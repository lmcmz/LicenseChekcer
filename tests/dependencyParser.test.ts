import { describe, it, expect } from 'bun:test';
import { parseDependencies } from '../src/services/dependencyParser';

describe('Dependency Parser', () => {
  describe('package.json parsing', () => {
    it('should parse npm dependencies', () => {
      const content = JSON.stringify({
        dependencies: {
          react: '^18.2.0',
          vue: '~3.3.4'
        },
        devDependencies: {
          vite: '^5.0.0'
        }
      });

      const deps = parseDependencies(content);

      expect(deps.length).toBe(3);
      expect(deps.some(d => d.name === 'react')).toBe(true);
      expect(deps.some(d => d.name === 'vue')).toBe(true);
      expect(deps.some(d => d.name === 'vite')).toBe(true);
    });

    it('should handle empty dependencies', () => {
      const content = JSON.stringify({
        dependencies: {}
      });

      const deps = parseDependencies(content);

      expect(deps.length).toBe(0);
    });
  });

  describe('requirements.txt parsing', () => {
    it('should parse Python dependencies', () => {
      const content = `
flask==2.0.1
requests>=2.25.0
Django~=3.2.0
numpy>=1.20.0
      `.trim();

      const deps = parseDependencies(content);

      expect(deps.length).toBeGreaterThan(0);
      const names = deps.map(d => d.name.toLowerCase());
      expect(names.includes('flask')).toBe(true);
      expect(names.includes('requests')).toBe(true);
      expect(names.includes('django')).toBe(true);
      expect(names.includes('numpy')).toBe(true);
    });
  });

  describe('go.mod parsing', () => {
    it('should parse Go dependencies', () => {
      const content = `
module example.com/myapp

go 1.21

require (
    github.com/gin-gonic/gin v1.9.0
    github.com/stretchr/testify v1.8.1
)
      `.trim();

      const deps = parseDependencies(content);

      expect(deps.length).toBeGreaterThan(0);
      expect(deps.some(d => d.name === 'github.com/gin-gonic/gin')).toBe(true);
      expect(deps.some(d => d.name === 'github.com/stretchr/testify')).toBe(true);
    });
  });

  describe('Cargo.toml parsing', () => {
    it('should parse Rust dependencies', () => {
      const content = `
[package]
name = "my-app"
version = "0.1.0"

[dependencies]
serde = "1.0"
tokio = { version = "1.0", features = ["full"] }
      `.trim();

      const deps = parseDependencies(content);

      expect(deps.length).toBeGreaterThan(0);
      expect(deps.some(d => d.name === 'serde')).toBe(true);
      expect(deps.some(d => d.name === 'tokio')).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid JSON', () => {
      const content = '{invalid json}';

      const deps = parseDependencies(content);

      expect(Array.isArray(deps)).toBe(true);
    });

    it('should handle empty string', () => {
      const content = '';

      const deps = parseDependencies(content);

      expect(deps.length).toBe(0);
    });
  });
});
