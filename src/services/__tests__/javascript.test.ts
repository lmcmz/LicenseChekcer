import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDependencies } from '../dependencyParser';

const FIXTURES_DIR = join(__dirname, 'fixtures', 'javascript');

describe('JavaScript/TypeScript Dependency Parsing', () => {
  describe('package.json', () => {
    it('should parse all dependency types from package.json', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'package.json'), 'utf-8');
      const result = parseDependencies(content);

      // Should have dependencies + devDependencies + peerDependencies + optionalDependencies
      expect(result.length).toBeGreaterThanOrEqual(10);

      // Check regular dependencies
      expect(result).toContainEqual({ name: 'react', version: '^18.2.0' });
      expect(result).toContainEqual({ name: 'axios', version: '1.6.0' });
      expect(result).toContainEqual({ name: 'lodash', version: '~4.17.21' });
      expect(result).toContainEqual({ name: 'express', version: '>=4.18.0' });

      // Check devDependencies
      expect(result).toContainEqual({ name: 'typescript', version: '^5.3.3' });
      expect(result).toContainEqual({ name: 'vite', version: '5.0.0' });

      // Check peerDependencies
      expect(result).toContainEqual({ name: 'webpack', version: '^5.0.0' });

      // Check optionalDependencies
      expect(result).toContainEqual({ name: 'fsevents', version: '^2.3.3' });
    });

    it('should not include package metadata fields', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'package.json'), 'utf-8');
      const result = parseDependencies(content);

      // Should NOT include these fields
      const names = result.map(d => d.name);
      expect(names).not.toContain('license-checker-test');
      expect(names).not.toContain('MIT');
      expect(names).not.toContain('Test Author');
    });
  });

  describe('yarn.lock', () => {
    it('should parse dependencies from yarn.lock', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'yarn.lock'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(5);

      expect(result).toContainEqual({ name: 'react', version: '18.2.0' });
      expect(result).toContainEqual({ name: 'react-dom', version: '18.2.0' });
      expect(result).toContainEqual({ name: 'axios', version: '1.6.0' });
      expect(result).toContainEqual({ name: 'typescript', version: '5.3.3' });
      expect(result).toContainEqual({ name: 'vite', version: '5.0.0' });
    });
  });

  describe('package-lock.json', () => {
    it('should parse dependencies from package-lock.json v3', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'package-lock.json'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(5);

      // Should extract from node_modules/ paths
      expect(result).toContainEqual({ name: 'axios', version: '1.6.0' });
      expect(result).toContainEqual({ name: 'react', version: '18.2.0' });
      expect(result).toContainEqual({ name: 'react-dom', version: '18.2.0' });
      expect(result).toContainEqual({ name: 'typescript', version: '5.3.3' });
      expect(result).toContainEqual({ name: 'vite', version: '5.0.0' });
    });

    it('should not include empty path entry', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'package-lock.json'), 'utf-8');
      const result = parseDependencies(content);

      // Should not have empty name
      const emptyNames = result.filter(d => !d.name || d.name === '');
      expect(emptyNames.length).toBe(0);
    });
  });
});
