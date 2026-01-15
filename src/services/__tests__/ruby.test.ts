import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDependencies } from '../dependencyParser';

const FIXTURES_DIR = join(__dirname, 'fixtures', 'ruby');

describe('Ruby Dependency Parsing', () => {
  describe('Gemfile.lock', () => {
    it('should parse gems with proper indentation', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Gemfile.lock'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(5);

      // Rails ecosystem
      expect(result).toContainEqual({ name: 'rails', version: '7.1.2' });
      expect(result).toContainEqual({ name: 'actioncable', version: '7.1.2' });
      expect(result).toContainEqual({ name: 'actionmailbox', version: '7.1.2' });
      expect(result).toContainEqual({ name: 'actionmailer', version: '7.1.2' });
      expect(result).toContainEqual({ name: 'actionpack', version: '7.1.2' });
    });

    it('should parse other gems', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Gemfile.lock'), 'utf-8');
      const result = parseDependencies(content);

      expect(result).toContainEqual({ name: 'puma', version: '6.4.0' });
      expect(result).toContainEqual({ name: 'pg', version: '1.5.4' });
      expect(result).toContainEqual({ name: 'redis', version: '5.0.8' });
      expect(result).toContainEqual({ name: 'sidekiq', version: '7.2.0' });
      expect(result).toContainEqual({ name: 'rspec-rails', version: '6.1.0' });
    });

    it('should handle indentation correctly', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Gemfile.lock'), 'utf-8');
      const result = parseDependencies(content);

      // Gemfile.lock uses 4-space indentation for gem entries
      // Regex should match lines starting with exactly 4 spaces

      // Should NOT match section headers (GEM, PLATFORMS, etc.)
      const names = result.map(d => d.name);
      expect(names).not.toContain('GEM');
      expect(names).not.toContain('PLATFORMS');
      expect(names).not.toContain('DEPENDENCIES');
    });
  });
});
