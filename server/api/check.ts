import 'dotenv/config';
import { defineEventHandler, readBody, getQuery } from 'h3';
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from '@supabase/supabase-js';
import { parseDependencies } from '@/services/dependencyParser';
import { scanRepository } from '../utils/scanRepository';

// Lazy initialization of Supabase client
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key are required');
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// In-memory cache for repository scans (TTL: 5 minutes)
const repoScanCache = new Map<string, { content: string; timestamp: number }>();
const REPO_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedRepoScan(url: string): string | null {
  const cached = repoScanCache.get(url);
  if (cached && Date.now() - cached.timestamp < REPO_CACHE_TTL) {
    return cached.content;
  }
  repoScanCache.delete(url);
  return null;
}

function setCachedRepoScan(url: string, content: string): void {
  repoScanCache.set(url, { content, timestamp: Date.now() });
}

interface DependencyInput {
  name: string;
  version: string;
  ecosystem?: string;
}

interface DependencyAudit {
  name: string;
  version: string;
  license: string;
  repository?: string;
  riskLevel: 'Safe' | 'Caution' | 'High Risk';
  reason?: string;
  isFriendly: boolean;
  sources?: string[];
}

export default defineEventHandler(async (event) => {
  try {
    let content = '';

    // Handle GET request (URL parameter)
    if (event.method === 'GET') {
      const query = getQuery(event);
      const url = query.url as string;

      if (!url) {
        return {
          success: false,
          error: 'Missing required parameter: url',
        };
      }

      // Smart URL handling - detect if it's a repo or file URL
      const isGithubUrl = url.includes('github.com');
      const isRawUrl = url.includes('raw.githubusercontent.com') || url.includes('/raw/');
      const isFileUrl = url.includes('/blob/');

      // If it's a GitHub repo URL (not a file), scan the repo
      if (isGithubUrl && !isRawUrl && !isFileUrl) {
        // Check cache first
        const cachedContent = getCachedRepoScan(url);
        if (cachedContent) {
          content = cachedContent;
        } else {
          // Scan repository directly
          const scanData = await scanRepository(url);

          if (!scanData.success || !scanData.files || scanData.files.length === 0) {
            return {
              success: false,
              error: scanData.error || 'No dependency files found in repository',
            };
          }

          // Use the first file found
          content = scanData.files[0].content;

          // Cache the result
          setCachedRepoScan(url, content);
        }
      } else {
        // It's a file URL - fetch directly
        let targetUrl = url;

        // Convert GitHub blob URLs to raw URLs
        if (isGithubUrl && !isRawUrl) {
          targetUrl = targetUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }

        const response = await fetch(targetUrl);
        if (!response.ok) {
          return {
            success: false,
            error: `Failed to fetch URL: ${response.statusText}`,
          };
        }

        content = await response.text();
      }
    }
    // Handle POST request (file content in body)
    else if (event.method === 'POST') {
      const body = await readBody<{ content?: string }>(event);

      if (!body || !body.content) {
        return {
          success: false,
          error: 'Missing required field: content',
        };
      }

      content = body.content;
    } else {
      return {
        success: false,
        error: 'Method not allowed. Use GET or POST.',
      };
    }

    // Parse dependencies from content
    const rawDeps = parseDependencies(content);
    const dependencies: DependencyInput[] = rawDeps.map(dep => ({
      name: dep.name,
      version: dep.version,
      ecosystem: dep.ecosystem,
    }));

    if (dependencies.length === 0) {
      return { success: true, data: [] };
    }

    // Check cache first - use batch query instead of N+1
    const cachedResults: DependencyAudit[] = [];
    const uncachedDeps: DependencyInput[] = [];

    // Get unique package names for batch query
    const packageNames = [...new Set(dependencies.map(dep => dep.name))];

    // Batch query all dependencies at once using .in()
    const { data: cachedData, error: cacheError } = await getSupabaseClient()
      .from('package_licenses')
      .select('*')
      .in('package_name', packageNames);

    if (!cacheError && cachedData) {
      // Create a map for quick lookup
      const cacheMap = new Map(
        cachedData.map((record: any) => [
          `${record.ecosystem}:${record.package_name}@${record.package_version}`,
          record
        ])
      );

      // Check each dependency against cache
      for (const dep of dependencies) {
        const ecosystem = dep.ecosystem || 'unknown';
        const key = `${ecosystem}:${dep.name}@${dep.version}`;
        const record = cacheMap.get(key);

        if (record) {
          // Found in cache
          cachedResults.push({
            name: record.package_name,
            version: record.package_version,
            license: record.license_name,
            repository: record.metadata?.repository,
            riskLevel: record.risk_level as 'Safe' | 'Caution' | 'High Risk',
            reason: record.metadata?.reason,
            isFriendly: record.risk_level === 'Safe',
            sources: record.metadata?.sources || [],
          });
        } else {
          // Not in cache
          uncachedDeps.push(dep);
        }
      }
    } else {
      // If batch query fails, fall back to treating all as uncached
      uncachedDeps.push(...dependencies);
    }

    // If all results are cached, return them
    if (uncachedDeps.length === 0) {
      return {
        success: true,
        data: cachedResults,
        cached: true,
        cachedCount: cachedResults.length,
        newCount: 0
      };
    }

    // Create ecosystem map for uncached deps
    const ecosystemMap = new Map<string, string>();
    uncachedDeps.forEach(dep => {
      const key = `${dep.name}@${dep.version}`;
      ecosystemMap.set(key, dep.ecosystem || 'unknown');
    });

    // Query AI for uncached dependencies
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });
    const depString = uncachedDeps.map(d => `${d.name}@${d.version}`).join(', ');

    const prompt = `
      Task: Audit these software dependencies for license compliance.

      Dependencies: ${depString}

      STRICT GUIDELINES:
      1. For each dependency, find its OFFICIAL license and repo URL.
      2. RISK CATEGORIZATION:
         - SAFE (Green): MIT, Apache-2.0, BSD-3-Clause, BSD-2-Clause, ISC, Unlicense, Zlib.
         - CAUTION (Yellow): GPL-3.0, GPL-2.0, LGPL, MPL-2.0, EPL-2.0.
         - HIGH RISK (Red): AGPL-3.0, SSPL, BSL-1.1, Proprietary, or Unknown.
      3. If the license is MIT, it MUST be marked as "Safe".
      4. Provide a concise reason for the risk level.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              version: { type: Type.STRING },
              license: { type: Type.STRING },
              repository: { type: Type.STRING },
              riskLevel: { type: Type.STRING, enum: ["Safe", "Caution", "High Risk"] },
              reason: { type: Type.STRING },
              isFriendly: { type: Type.BOOLEAN },
              sources: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "version", "license", "riskLevel", "isFriendly"]
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");

    let audits = JSON.parse(resultText) as DependencyAudit[];

    // Extract grounding URLs
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls = groundingChunks
      ?.map(chunk => chunk.web?.uri)
      .filter((uri): uri is string => !!uri) || [];

    audits = audits.map(audit => ({
      ...audit,
      sources: [...(audit.sources || []), ...groundingUrls]
    }));

    // Store results in database - use ORIGINAL versions from package.json, not AI versions
    const insertPromises = audits.map((audit) => {
      // Find the original dependency that matches this audit
      const originalDep = uncachedDeps.find(dep => dep.name === audit.name);
      if (!originalDep) return Promise.resolve(); // Skip if not found

      const key = `${originalDep.name}@${originalDep.version}`;
      const ecosystem = ecosystemMap.get(key) || 'unknown';

      return getSupabaseClient().from('package_licenses').insert({
        ecosystem,
        package_name: audit.name,
        package_version: originalDep.version, // Use original version, not AI's version
        license_name: audit.license,
        risk_level: audit.riskLevel,
        metadata: {
          repository: audit.repository,
          reason: audit.reason,
          sources: audit.sources,
          isFriendly: audit.isFriendly,
          aiResolvedVersion: audit.version, // Store AI's resolved version for reference
        }
      } as any);
    });

    await Promise.allSettled(insertPromises);

    // Combine cached and new results
    const allResults = [...cachedResults, ...audits];

    return {
      success: true,
      data: allResults,
      cached: cachedResults.length > 0,
      cachedCount: cachedResults.length,
      newCount: audits.length
    };
  } catch (error: any) {
    console.error('Check error:', error);
    return {
      success: false,
      error: error.message || 'Failed to check dependencies'
    };
  }
});
