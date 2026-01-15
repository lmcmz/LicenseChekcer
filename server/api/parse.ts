import 'dotenv/config';
import { defineEventHandler, readBody, getQuery } from 'h3';
import { parseDependencies, type RawDependency } from '@/services/dependencyParser';

interface ParseRequest {
  content?: string;
}

interface ParseResponse {
  success: boolean;
  dependencies?: Array<{ name: string; version: string; ecosystem?: string }>;
  error?: string;
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
        } as ParseResponse;
      }

      // Fetch content from URL
      const response = await fetch(url);
      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch URL: ${response.statusText}`,
        } as ParseResponse;
      }

      content = await response.text();
    }
    // Handle POST request (file content in body)
    else if (event.method === 'POST') {
      const body = await readBody<ParseRequest>(event);

      if (!body || !body.content) {
        return {
          success: false,
          error: 'Missing required field: content',
        } as ParseResponse;
      }

      content = body.content;
    } else {
      return {
        success: false,
        error: 'Method not allowed. Use GET or POST.',
      } as ParseResponse;
    }

    // Parse dependencies
    const rawDeps = parseDependencies(content);
    const dependencies = rawDeps.map((dep: RawDependency) => ({
      name: dep.name,
      version: dep.version,
      ecosystem: dep.ecosystem,
    }));

    return {
      success: true,
      dependencies,
    } as ParseResponse;
  } catch (error: any) {
    console.error('Parse API error:', error);
    return {
      success: false,
      error: error.message || 'Failed to parse dependencies',
    } as ParseResponse;
  }
});
