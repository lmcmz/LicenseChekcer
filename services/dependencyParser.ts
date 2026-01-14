
export interface RawDependency {
  name: string;
  version: string;
}

export const parseDependencies = (input: string): RawDependency[] => {
  const results: RawDependency[] = [];
  
  // Try parsing as JSON first (package.json style)
  try {
    const json = JSON.parse(input);
    const deps = { ...(json.dependencies || {}), ...(json.devDependencies || {}), ...json };
    for (const [name, version] of Object.entries(deps)) {
      if (typeof version === 'string') {
        results.push({ name, version });
      }
    }
    if (results.length > 0) return results;
  } catch (e) {
    // Not valid JSON, try line-by-line parsing
  }

  // Fallback: Regex for "name": "version" or "name == version" or "name version"
  const lines = input.split('\n');
  const kvRegex = /["']?([^"':\s=]+)["']?\s*[:=]\s*["']?([^"'\s]+)["']?/;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return;
    
    const match = trimmed.match(kvRegex);
    if (match) {
      results.push({ name: match[1], version: match[2] });
    } else {
      // Simple space separated
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 1) {
        results.push({ name: parts[0], version: parts[1] || 'latest' });
      }
    }
  });

  return results;
};
