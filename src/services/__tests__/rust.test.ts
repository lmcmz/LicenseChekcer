import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDependencies } from '../dependencyParser';

const FIXTURES_DIR = join(__dirname, 'fixtures', 'rust');

describe('Rust Dependency Parsing', () => {
  describe('Cargo.toml', () => {
    it('should parse simple dependencies', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Cargo.toml'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(10);

      // Simple format: package = "version"
      expect(result).toContainEqual({ name: 'actix-web', version: '4.4.0' });
      expect(result).toContainEqual({ name: 'anyhow', version: '1.0' });
      expect(result).toContainEqual({ name: 'thiserror', version: '1.0' });
    });

    it('should parse complex dependencies with features', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Cargo.toml'), 'utf-8');
      const result = parseDependencies(content);

      // Complex format: package = { version = "X.Y", features = [...] }
      expect(result).toContainEqual({ name: 'tokio', version: '1.35.0' });
      expect(result).toContainEqual({ name: 'serde', version: '1.0' });
      expect(result).toContainEqual({ name: 'serde_json', version: '1.0' });
      expect(result).toContainEqual({ name: 'sqlx', version: '0.7' });
      expect(result).toContainEqual({ name: 'reqwest', version: '0.11' });
      expect(result).toContainEqual({ name: 'uuid', version: '1.6' });
      expect(result).toContainEqual({ name: 'chrono', version: '0.4' });
      expect(result).toContainEqual({ name: 'clap', version: '4.4' });
    });

    it('should parse dev-dependencies', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Cargo.toml'), 'utf-8');
      const result = parseDependencies(content);

      expect(result).toContainEqual({ name: 'mockito', version: '1.2' });
      expect(result).toContainEqual({ name: 'tokio-test', version: '0.4' });
    });

    it('should parse build-dependencies', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Cargo.toml'), 'utf-8');
      const result = parseDependencies(content);

      expect(result).toContainEqual({ name: 'cc', version: '1.0' });
    });

    it('should NOT include [package] metadata', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Cargo.toml'), 'utf-8');
      const result = parseDependencies(content);

      const names = result.map(d => d.name);

      // Should NOT include package metadata
      expect(names).not.toContain('license-checker');
      expect(names).not.toContain('name');
      expect(names).not.toContain('version');
      expect(names).not.toContain('edition');
      expect(names).not.toContain('authors');
      expect(names).not.toContain('description');

      // Should NOT include lib metadata
      expect(names).not.toContain('license_checker');
      expect(names).not.toContain('lib');
    });

    it('should NOT include [profile.release] settings', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Cargo.toml'), 'utf-8');
      const result = parseDependencies(content);

      const names = result.map(d => d.name);
      expect(names).not.toContain('opt-level');
      expect(names).not.toContain('lto');
      expect(names).not.toContain('codegen-units');
    });
  });

  describe('Cargo.lock', () => {
    it('should parse Cargo.lock with [[package]] syntax', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Cargo.lock'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(10);

      expect(result).toContainEqual({ name: 'actix-web', version: '4.4.0' });
      expect(result).toContainEqual({ name: 'anyhow', version: '1.0.75' });
      expect(result).toContainEqual({ name: 'serde', version: '1.0.193' });
      expect(result).toContainEqual({ name: 'tokio', version: '1.35.1' });
      expect(result).toContainEqual({ name: 'reqwest', version: '0.11.22' });
      expect(result).toContainEqual({ name: 'clap', version: '4.4.11' });
    });

    it('should include the project itself', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'Cargo.lock'), 'utf-8');
      const result = parseDependencies(content);

      // Cargo.lock includes the project itself as a [[package]]
      expect(result).toContainEqual({ name: 'license-checker', version: '0.1.0' });
    });

    it('should NOT confuse with Cargo.toml [package]', () => {
      // This test verifies the bug fix where Cargo.lock regex
      // was incorrectly matching Cargo.toml's [package] section

      const cargoToml = readFileSync(join(FIXTURES_DIR, 'Cargo.toml'), 'utf-8');
      const tomlResult = parseDependencies(cargoToml);

      // Cargo.toml should NOT include the project name as a dependency
      const projectInToml = tomlResult.filter(d => d.name === 'license-checker');
      expect(projectInToml.length).toBe(0);

      const cargoLock = readFileSync(join(FIXTURES_DIR, 'Cargo.lock'), 'utf-8');
      const lockResult = parseDependencies(cargoLock);

      // Cargo.lock SHOULD include the project
      const projectInLock = lockResult.filter(d => d.name === 'license-checker');
      expect(projectInLock.length).toBe(1);
    });
  });
});
