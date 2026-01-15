
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

  // 1. Try JSON (NPM, Swift.resolved, Lock files)
  try {
    const json = JSON.parse(trimmedInput);

    // NPM Style (package.json)
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

    // package-lock.json (NPM v1/v2)
    if (json.dependencies && typeof json.dependencies === 'object' && !found) {
      found = true;
      Object.entries(json.dependencies).forEach(([name, data]: [string, any]) => {
        if (data.version) {
          results.push({ name, version: data.version });
        }
      });
    }

    // package-lock.json (NPM v3/lockfileVersion 3)
    if (json.packages && typeof json.packages === 'object' && !Array.isArray(json.packages) && !found) {
      found = true;
      Object.entries(json.packages).forEach(([path, data]: [string, any]) => {
        if (path && path !== '' && data.version) {
          // Extract package name from path like "node_modules/react"
          const name = path.replace(/^node_modules\//, '');
          if (name && !name.includes('/node_modules/')) {
            results.push({ name, version: data.version });
          }
        }
      });
    }

    // Pipfile.lock (Python)
    if ((json.default || json._meta) && !found) {
      found = true;
      const packages = json.default || {};
      Object.entries(packages).forEach(([name, data]: [string, any]) => {
        if (data.version) {
          results.push({ name, version: data.version.replace(/^==/, '') });
        }
      });
    }

    // composer.lock (PHP)
    if (json.packages && Array.isArray(json.packages) && !found) {
      found = true;
      json.packages.forEach((pkg: any) => {
        if (pkg.name && pkg.version) {
          results.push({ name: pkg.name, version: pkg.version });
        }
      });
    }

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

    if (found) {
      return results;
    }
  } catch (e) {
  }

  // 2. yarn.lock
  let match;
  const yarnLockRegex = /"?([^@\s"]+)@[^:]*:\s*version\s+"([^"]+)"/g;
  while ((match = yarnLockRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }
  if (results.length > 0) return results;

  // 3. Cargo.lock (Rust)
  // Cargo.lock uses [[package]] (double brackets), not [package] (single bracket like Cargo.toml)
  // Match within [[package]] sections to avoid false matches with Cargo.toml
  const cargoLockRegex = /\[\[package\]\][\s\S]*?name\s*=\s*"([^"]+)"[\s\S]{0,200}?version\s*=\s*"([^"]+)"/g;
  while ((match = cargoLockRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }
  if (results.length > 0) return results;

  // 4. Gemfile.lock (Ruby)
  const gemfileLockRegex = /^\s{4}(\S+)\s+\(([^)]+)\)/gm;
  while ((match = gemfileLockRegex.exec(trimmedInput)) !== null) {
    results.push({ name: match[1], version: match[2] });
  }
  if (results.length > 0) return results;

  // 5. Go (go.mod and go.sum)
  // Skip XML files
  if (trimmedInput.startsWith('<?xml')) {
  } else if (trimmedInput.includes('module ') || trimmedInput.includes('require ')) {
    // go.mod format - Handle both single-line and multi-line require blocks
    // Match: require github.com/foo/bar v1.2.3
    // Match inside: require ( ... )
    const goModRegex = /^\s*(?:require\s+)?([a-zA-Z0-9\-_.\/]+)\s+(v[^\s\n\r)]+)/gm;
    while ((match = goModRegex.exec(trimmedInput)) !== null) {
      // Skip if it's just "require (" without actual package
      if (!match[1].includes('(') && !match[1].includes(')')) {
        results.push({ name: match[1], version: match[2] });
      }
    }
  } else if (!trimmedInput.startsWith('<')) {
    // go.sum format: module version/hash - deduplicate by using a Set
    // Only parse if not XML/HTML
    const goSumRegex = /^([^\s]+)\s+(v[^\s\/]+)/gm;
    const goSumSeen = new Set<string>();
    while ((match = goSumRegex.exec(trimmedInput)) !== null) {
      const key = `${match[1]}@${match[2]}`;
      if (!goSumSeen.has(key)) {
        goSumSeen.add(key);
        results.push({ name: match[1], version: match[2] });
      }
    }
  }
  if (results.length > 0) return results;

  // 6. Rust (Cargo.toml)
  // Only parse dependencies within [dependencies], [dev-dependencies], [build-dependencies] sections
  const cargoSections = /\[(dependencies|dev-dependencies|build-dependencies)\]([\s\S]*?)(?=\n\[|\n*$)/gi;
  let sectionMatch;
  while ((sectionMatch = cargoSections.exec(trimmedInput)) !== null) {
    const sectionContent = sectionMatch[2];
    // Match: package = "version" or package = { version = "version", ... }
    const simpleDep = /^([a-zA-Z0-9\-_]+)\s*=\s*"([^"]+)"/gm;
    const complexDep = /^([a-zA-Z0-9\-_]+)\s*=\s*\{\s*version\s*=\s*"([^"]+)"/gm;

    let depMatch;
    while ((depMatch = simpleDep.exec(sectionContent)) !== null) {
      results.push({ name: depMatch[1], version: depMatch[2] });
    }
    while ((depMatch = complexDep.exec(sectionContent)) !== null) {
      results.push({ name: depMatch[1], version: depMatch[2] });
    }
  }
  if (results.length > 0) return results;

  // 7. Maven (pom.xml) - Simple heuristic
  if (trimmedInput.includes('<dependency>')) {
    const mavenRegex = /<dependency>[\s\S]*?<artifactId>(.*?)<\/artifactId>[\s\S]*?<version>(.*?)<\/version>/g;
    while ((match = mavenRegex.exec(trimmedInput)) !== null) {
      results.push({ name: match[1], version: match[2] });
    }
  }
  if (results.length > 0) return results;

  // 8. Gradle (build.gradle)
  const gradleRegex = /(?:implementation|api|testImplementation|testRuntimeOnly|runtimeOnly|compileOnly|annotationProcessor|classpath)\s+['"]([^:]+):([^:]+):([^'"]+)['"]/g;
  while ((match = gradleRegex.exec(trimmedInput)) !== null) {
    results.push({ name: `${match[1]}:${match[2]}`, version: match[3] });
  }
  if (results.length > 0) return results;

  // 9. Swift (Package.swift)
  const swiftRegex = /\.package\(url:\s*["']([^"']+)["'],\s*(?:from|branch|revision):\s*["']([^"']+)["']\)/g;
  while ((match = swiftRegex.exec(trimmedInput)) !== null) {
    results.push({ name: getBaseName(match[1]), version: match[2] });
  }
  if (results.length > 0) return results;

  // 10. Fallback: Line-by-line (requirements.txt, poetry.lock text format, etc.)
  if (results.length === 0) {
    const lines = trimmedInput.split('\n');
    // Updated regex to properly handle Python version specifiers like ~=, >=, <=, ==
    const kvRegex = /^([a-zA-Z0-9\-_.[\]]+?)\s*[~<>=!:]+\s*([^\s,;#]+)/;
    lines.forEach((line, index) => {
      const l = line.trim();
      // Skip comments, XML tags, and other non-dependency lines
      if (!l || l.startsWith('//') || l.startsWith('#') || l.startsWith('/*') || l.startsWith('<') || l.startsWith('[')) {
        return;
      }
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
