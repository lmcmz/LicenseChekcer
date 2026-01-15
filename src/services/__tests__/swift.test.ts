import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDependencies } from '../dependencyParser';

const FIXTURES_DIR = join(__dirname, 'fixtures', 'swift');

describe('Swift Dependency Parsing', () => {
  describe('Package.swift', () => {
    it('should parse dependencies with "from" version', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Package.swift'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(5);

      // Extract package name from GitHub URL
      expect(result).toContainEqual({ name: 'Alamofire', version: '5.8.1' });
      expect(result).toContainEqual({ name: 'SwiftyJSON', version: '5.0.1' });
      expect(result).toContainEqual({ name: 'vapor', version: '4.89.0' });
      expect(result).toContainEqual({ name: 'swift-argument-parser', version: '1.3.0' });
      expect(result).toContainEqual({ name: 'swift-log', version: '1.5.3' });
    });

    it('should parse dependencies with branch specification', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Package.swift'), 'utf-8');
      const result = parseDependencies(content);

      // Branch: master
      expect(result).toContainEqual({ name: 'realm-swift', version: 'master' });
    });

    it('should parse dependencies with revision specification', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Package.swift'), 'utf-8');
      const result = parseDependencies(content);

      // Specific commit revision
      const keychainDep = result.find(d => d.name === 'KeychainAccess');
      expect(keychainDep).toBeDefined();
      expect(keychainDep?.version).toBe('84e546727d66f1adc5439debad16270d0fdd04e7');
    });
  });

  describe('Package.resolved', () => {
    it('should parse resolved dependencies with version', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Package.resolved'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(5);

      // identity field is used as package name
      expect(result).toContainEqual({ name: 'alamofire', version: '5.8.1' });
      expect(result).toContainEqual({ name: 'swiftyjson', version: '5.0.1' });
      expect(result).toContainEqual({ name: 'vapor', version: '4.89.0' });
      expect(result).toContainEqual({ name: 'swift-argument-parser', version: '1.3.0' });
      expect(result).toContainEqual({ name: 'swift-log', version: '1.5.3' });
    });

    it('should parse dependencies with branch', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Package.resolved'), 'utf-8');
      const result = parseDependencies(content);

      // Should handle "branch" instead of "version"
      const realmDep = result.find(d => d.identity === 'realm-swift' || d.name === 'realm-swift');
      expect(realmDep).toBeDefined();
    });

    it('should parse dependencies with revision only', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Package.resolved'), 'utf-8');
      const result = parseDependencies(content);

      // KeychainAccess has only revision, no version
      const keychainDep = result.find(d =>
        d.identity === 'keychainaccess' || d.name === 'keychainaccess'
      );
      expect(keychainDep).toBeDefined();
    });
  });
});
