import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDependencies } from '../dependencyParser';

const FIXTURES_DIR = join(__dirname, 'fixtures', 'php');

describe('PHP Dependency Parsing', () => {
  describe('composer.lock', () => {
    it('should parse packages array from composer.lock', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'composer.lock'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(5);

      // Symfony
      expect(result).toContainEqual({
        name: 'symfony/http-foundation',
        version: 'v6.4.0'
      });

      // Laravel
      expect(result).toContainEqual({
        name: 'laravel/framework',
        version: 'v10.35.0'
      });

      // HTTP Client
      expect(result).toContainEqual({
        name: 'guzzlehttp/guzzle',
        version: '7.8.1'
      });

      // Logging
      expect(result).toContainEqual({
        name: 'monolog/monolog',
        version: '3.5.0'
      });

      // Testing
      expect(result).toContainEqual({
        name: 'phpunit/phpunit',
        version: '10.5.3'
      });
    });

    it('should handle package names with vendor prefix', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'composer.lock'), 'utf-8');
      const result = parseDependencies(content);

      // PHP packages typically use vendor/package format
      result.forEach(dep => {
        expect(dep.name).toMatch(/^[a-z0-9\-]+\/[a-z0-9\-]+$/);
      });
    });

    it('should not confuse with npm package-lock.json', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'composer.lock'), 'utf-8');
      const result = parseDependencies(content);

      // composer.lock has "packages" as an array
      // package-lock.json has "packages" as an object
      // Parser should correctly identify composer.lock

      // All should be valid composer package names
      const invalidNames = result.filter(d =>
        !d.name.includes('/') || // Should have vendor/package format
        d.name.includes('node_modules') // Should NOT have npm paths
      );

      expect(invalidNames.length).toBe(0);
    });
  });
});
