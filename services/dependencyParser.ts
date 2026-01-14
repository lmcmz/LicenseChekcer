
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
  const trimmedInput = input.trim();

  // 1. Try JSON (NPM, Swift.resolved)
  try {
    const json = JSON.parse(trimmedInput);
    
    // NPM Style
    const npmKeys = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    let found = false;
    npmKeys.forEach(key => {
      if (json[key] && typeof json[key] === 'object') {
        found = true;
        for (const [name, version] of Object.entries(json[key])) {
          if (typeof version === 'string') results.push({ name, version });
        }
      }
    });

    // Swift PM .resolved Style
    if (json.pins && Array.isArray(json.pins)) {
      found = true;
      json.pins.forEach((pin: any) => {
        results.push({ 
          name: pin.identity || pin.package || getBaseName(pin.location), 
          version: pin.state?.version || 'latest' 
        });
      });
    }

    if (found) return results;
  } catch (e) {}

  // 2. Go (go.mod)
  const goRegex = /require\s+([^\s]+)\s+([^\s\n\r]+)/g;
  let match;
  while ((match = goRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }

  // 3. Rust (Cargo.toml)
  const rustRegex = /^([a-zA-Z0-9\-_]+)\s*=\s*["']?([^"'\n]+)["']?/gm;
  while ((match = rustRegex.exec(trimmedInput)) !== null) {
    if (!['package', 'lib', 'bin'].includes(match[1])) {
      results.push({ name: match[1], version: match[2] });
    }
  }

  // 4. Maven (pom.xml) - Simple heuristic
  const mavenRegex = /<dependency>[\s\S]*?<artifactId>(.*?)<\/artifactId>[\s\S]*?<version>(.*?)<\/version>/g;
  while ((match = mavenRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }

  // 5. Gradle (build.gradle)
  const gradleRegex = /(?:implementation|api|testImplementation|classpath)\s+['"]([^:]+):([^:]+):([^'"]+)['"]/g;
  while ((match = gradleRegex.exec(trimmedInput)) !== null) {
    results.push({ name: `${match[1]}:${match[2]}`, version: match[3] });
  }

  // 6. Swift (Package.swift)
  const swiftRegex = /\.package\(url:\s*["']([^"']+)["'],\s*(?:from|branch|revision):\s*["']([^"']+)["']\)/g;
  while ((match = swiftRegex.exec(trimmedInput)) !== null) {
    results.push({ name: getBaseName(match[1]), version: match[2] });
  }

  // 7. Fallback: Line-by-line (requirements.txt, etc.)
  if (results.length === 0) {
    const lines = trimmedInput.split('\n');
    const kvRegex = /["']?([^"':\s=<>!]+)["']?\s*[:=<>!]+\s*["']?([^"'\s,;]+)["']?/;
    lines.forEach(line => {
      const l = line.trim();
      if (!l || l.startsWith('//') || l.startsWith('#') || l.startsWith('/*')) return;
      const m = l.match(kvRegex);
      if (m && !NON_DEP_KEYS.has(m[1])) {
        results.push({ name: m[1], version: m[2] });
      }
    });
  }

  return results;
};

const getBaseName = (url: string) => {
  const parts = url.replace(/\/$/, '').split('/');
  return parts[parts.length - 1].replace(/\.git$/, '');
};
