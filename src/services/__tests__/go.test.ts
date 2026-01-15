import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDependencies } from '../dependencyParser';

const FIXTURES_DIR = join(__dirname, 'fixtures', 'go');

describe('Go Dependency Parsing', () => {
  describe('go.mod', () => {
    it('should parse multi-line require blocks', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'go.mod'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(30);

      // Direct dependencies (main require block)
      expect(result).toContainEqual({
        name: 'github.com/gin-gonic/gin',
        version: 'v1.9.1'
      });
      expect(result).toContainEqual({
        name: 'github.com/redis/go-redis/v9',
        version: 'v9.3.0'
      });
      expect(result).toContainEqual({
        name: 'github.com/stretchr/testify',
        version: 'v1.8.4'
      });
      expect(result).toContainEqual({
        name: 'golang.org/x/crypto',
        version: 'v0.16.0'
      });
    });

    it('should parse indirect dependencies', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'go.mod'), 'utf-8');
      const result = parseDependencies(content);

      // Indirect dependencies (marked with // indirect)
      expect(result).toContainEqual({
        name: 'github.com/bytedance/sonic',
        version: 'v1.10.2'
      });
      expect(result).toContainEqual({
        name: 'github.com/cespare/xxhash/v2',
        version: 'v2.2.0'
      });
    });

    it('should parse single-line require statements', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'go.mod'), 'utf-8');
      const result = parseDependencies(content);

      // Single line at the end
      expect(result).toContainEqual({
        name: 'github.com/gorilla/mux',
        version: 'v1.8.1'
      });
    });

    it('should not include module declaration', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'go.mod'), 'utf-8');
      const result = parseDependencies(content);

      // Should NOT parse "module github.com/example/license-checker"
      const moduleEntry = result.find(d =>
        d.name === 'github.com/example/license-checker'
      );
      expect(moduleEntry).toBeUndefined();
    });
  });

  describe('go.sum', () => {
    it('should parse go.sum and deduplicate entries', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'go.sum'), 'utf-8');
      const result = parseDependencies(content);

      // Each package appears twice in go.sum (with h1: hash and /go.mod suffix)
      // Parser should deduplicate them

      expect(result).toContainEqual({
        name: 'github.com/gin-gonic/gin',
        version: 'v1.9.1'
      });
      expect(result).toContainEqual({
        name: 'github.com/redis/go-redis/v9',
        version: 'v9.3.0'
      });
      expect(result).toContainEqual({
        name: 'github.com/gorilla/mux',
        version: 'v1.8.1'
      });

      // Count how many times each package appears
      const ginEntries = result.filter(d => d.name === 'github.com/gin-gonic/gin');
      expect(ginEntries.length).toBe(1); // Should be deduplicated
    });

    it('should handle various hash formats', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'go.sum'), 'utf-8');
      const result = parseDependencies(content);

      // All entries should have valid version format (vX.Y.Z)
      result.forEach(dep => {
        expect(dep.version).toMatch(/^v\d+\.\d+\.\d+/);
      });
    });
  });
});
