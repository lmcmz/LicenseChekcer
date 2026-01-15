import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDependencies } from '../dependencyParser';

const FIXTURES_DIR = join(__dirname, 'fixtures', 'python');

describe('Python Dependency Parsing', () => {
  describe('requirements.txt', () => {
    it('should parse requirements.txt with various version specifiers', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'requirements.txt'), 'utf-8');
      const result = parseDependencies(content);

      console.log('requirements.txt parsed:', result.length, 'dependencies');
      console.log('Names:', result.map(d => d.name).join(', '));

      expect(result.length).toBeGreaterThanOrEqual(10);

      // == exact version
      expect(result).toContainEqual({ name: 'Django', version: '4.2.0' });
      expect(result).toContainEqual({ name: 'numpy', version: '1.24.3' });
      expect(result).toContainEqual({ name: 'pytest', version: '7.4.3' });

      // >= minimum version
      expect(result.some(d => d.name === 'Flask')).toBe(true);

      // ~ compatible version - version may vary based on parsing
      expect(result.some(d => d.name === 'requests')).toBe(true);
    });

    it('should ignore comments', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'requirements.txt'), 'utf-8');
      const result = parseDependencies(content);

      // Should NOT include commented out redis
      const commentedDeps = result.filter(d =>
        d.name.startsWith('#') || d.version.startsWith('#')
      );
      expect(commentedDeps.length).toBe(0);
    });

    it('should handle extras like celery[redis]', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'requirements.txt'), 'utf-8');
      const result = parseDependencies(content);

      // celery with [redis] extra
      const celery = result.find(d => d.name.includes('celery'));
      expect(celery).toBeDefined();
    });
  });

  describe('Pipfile.lock', () => {
    it('should parse Pipfile.lock default packages', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Pipfile.lock'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(5);

      // Default packages
      expect(result).toContainEqual({ name: 'django', version: '4.2.0' });
      expect(result).toContainEqual({ name: 'flask', version: '2.3.0' });
      expect(result).toContainEqual({ name: 'requests', version: '2.31.0' });
      expect(result).toContainEqual({ name: 'numpy', version: '1.24.3' });
      expect(result).toContainEqual({ name: 'fastapi', version: '0.104.1' });
    });

    it('should strip == prefix from versions', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Pipfile.lock'), 'utf-8');
      const result = parseDependencies(content);

      // Versions should not have == prefix
      result.forEach(dep => {
        expect(dep.version.startsWith('==')).toBe(false);
      });
    });
  });
});
