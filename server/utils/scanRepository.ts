interface DependencyFile {
  name: string;
  path: string;
  content: string;
  type: string;
}

interface ScanResult {
  success: boolean;
  error?: string;
  repository?: string;
  files?: DependencyFile[];
}

// Common dependency files to look for
const DEPENDENCY_FILES = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'requirements.txt',
  'Pipfile.lock',
  'go.mod',
  'go.sum',
  'Cargo.toml',
  'Cargo.lock',
  'pom.xml',
  'build.gradle',
  'Package.swift',
  'Package.resolved',
  'Gemfile.lock',
  'composer.lock'
];

function detectFileType(filename: string): string {
  if (filename.includes('package')) return 'npm';
  if (filename.includes('requirements') || filename.includes('Pipfile')) return 'python';
  if (filename.includes('go.')) return 'go';
  if (filename.includes('Cargo')) return 'rust';
  if (filename.includes('pom.xml')) return 'maven';
  if (filename.includes('build.gradle')) return 'gradle';
  if (filename.includes('Package.')) return 'swift';
  if (filename.includes('Gemfile')) return 'ruby';
  if (filename.includes('composer')) return 'php';
  return 'unknown';
}

export async function scanRepository(repoUrl: string): Promise<ScanResult> {
  try {
    // Parse GitHub URL to get owner and repo
    const githubRegex = /github\.com\/([^\/]+)\/([^\/\?#]+)/;
    const match = repoUrl.match(githubRegex);

    if (!match) {
      return { success: false, error: 'Invalid GitHub URL. Please provide a valid GitHub repository URL.' };
    }

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');

    // Fetch repository contents from GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/contents`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'License-Checker'
      }
    });

    if (!response.ok) {
      return { success: false, error: `Failed to fetch repository: ${response.statusText}` };
    }

    const contents = await response.json();
    const foundFiles: DependencyFile[] = [];

    // Search for dependency files
    for (const item of contents) {
      if (item.type === 'file' && DEPENDENCY_FILES.includes(item.name)) {
        try {
          // Fetch file content
          const fileResponse = await fetch(item.download_url);
          if (fileResponse.ok) {
            const content = await fileResponse.text();
            foundFiles.push({
              name: item.name,
              path: item.path,
              content,
              type: detectFileType(item.name)
            });
          }
        } catch (err) {
          console.error(`Failed to fetch ${item.name}:`, err);
        }
      }
    }

    if (foundFiles.length === 0) {
      return {
        success: false,
        error: 'No dependency files found in the root directory of this repository.'
      };
    }

    return {
      success: true,
      repository: `${owner}/${cleanRepo}`,
      files: foundFiles
    };

  } catch (error) {
    console.error('Repo scan error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scan repository'
    };
  }
}
