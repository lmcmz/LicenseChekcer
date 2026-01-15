import 'dotenv/config';
import { defineEventHandler, readBody } from 'h3';
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from '@supabase/supabase-js';

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
    const body = await readBody<{ dependencies: DependencyInput[] }>(event);

    if (!body || !body.dependencies || body.dependencies.length === 0) {
      return { success: true, data: [] };
    }

    const { dependencies } = body;

    // Check cache first
    const cachedResults: DependencyAudit[] = [];
    const uncachedDeps: DependencyInput[] = [];

    for (const dep of dependencies) {
      const ecosystem = dep.ecosystem || 'unknown';
      const { data, error } = await getSupabaseClient()
        .from('package_licenses')
        .select('*')
        .eq('ecosystem', ecosystem)
        .eq('package_name', dep.name)
        .eq('package_version', dep.version)
        .single();

      if (data && !error) {
        // Found in cache
        const record = data as any;
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

    // Store results in database
    const insertPromises = audits.map((audit) => {
      const key = `${audit.name}@${audit.version}`;
      const ecosystem = ecosystemMap.get(key) || 'unknown';
      return getSupabaseClient().from('package_licenses').insert({
        ecosystem,
        package_name: audit.name,
        package_version: audit.version,
        license_name: audit.license,
        risk_level: audit.riskLevel,
        metadata: {
          repository: audit.repository,
          reason: audit.reason,
          sources: audit.sources,
          isFriendly: audit.isFriendly,
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
    console.error('Audit error:', error);
    return {
      success: false,
      error: error.message || 'Failed to audit dependencies'
    };
  }
});
