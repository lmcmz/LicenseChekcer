
export interface RawDependency {
  name: string;
  version: string;
}

const NON_DEP_KEYS = new Set([
  'name', 'version', 'description', 'scripts', 'type', 'main', 'module', 
  'exports', 'author', 'license', 'engines', 'private', 'keywords', 
  'repository', 'bugs', 'homepage', 'devDependencies', 'dependencies', 
  'peerDependencies', 'optionalDependencies', 'workspaces', 'publishConfig',
  'dependenciesMeta', 'bundleDependencies', 'bundledDependencies', 'cpu', 'os'
]);

export const parseDependencies = (input: string): RawDependency[] => {
  const results: RawDependency[] = [];
  
  // Try parsing as JSON first
  try {
    const json = JSON.parse(input);
    
    // Look for standard dependency keys first
    const depKeys = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    let foundStandard = false;
    
    depKeys.forEach(key => {
      if (json[key] && typeof json[key] === 'object') {
        foundStandard = true;
        for (const [name, version] of Object.entries(json[key])) {
          if (typeof version === 'string') {
            results.push({ name, version });
          }
        }
      }
    });

    // If no standard keys found, parse the root object but filter out known metadata keys
    if (!foundStandard && typeof json === 'object' && json !== null) {
      for (const [name, version] of Object.entries(json)) {
        if (!NON_DEP_KEYS.has(name) && typeof version === 'string') {
          results.push({ name, version });
        }
      }
    }
    
    if (results.length > 0) return results;
  } catch (e) {
    // Not valid JSON, proceed to regex
  }

  // Fallback: Line-by-line parsing for requirements.txt or raw lists
  const lines = input.split('\n');
  const kvRegex = /["']?([^"':\s=]+)["']?\s*[:=]\s*["']?([^"'\s]+)["']?/;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return;
    
    const match = trimmed.match(kvRegex);
    if (match) {
      const name = match[1];
      if (!NON_DEP_KEYS.has(name)) {
        results.push({ name, version: match[2] });
      }
    } else {
      // Simple space/tab separated
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 1) {
        const name = parts[0].replace(/['",]/g, '');
        if (name && !NON_DEP_KEYS.has(name)) {
          results.push({ name, version: parts[1]?.replace(/['",]/g, '') || 'latest' });
        }
      }
    }
  });

  return results;
};
