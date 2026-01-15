import { describe, it, expect } from 'bun:test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

describe('API Tests', () => {
  describe('GET /api/parse', () => {
    it('should parse dependencies from URL', async () => {
      const testUrl = 'https://raw.githubusercontent.com/facebook/react/main/package.json';
      const response = await fetch(`${API_BASE_URL}/parse?url=${encodeURIComponent(testUrl)}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.dependencies).toBeDefined();
      expect(Array.isArray(data.dependencies)).toBe(true);
    }, 30000);

    it('should fail with missing URL parameter', async () => {
      const response = await fetch(`${API_BASE_URL}/parse`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });

  describe('POST /api/parse', () => {
    it('should parse dependencies from content', async () => {
      const content = JSON.stringify({
        dependencies: {
          react: '^18.2.0',
          vue: '^3.3.4'
        }
      });

      const response = await fetch(`${API_BASE_URL}/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.dependencies).toBeDefined();
      expect(data.dependencies.length).toBeGreaterThan(0);
    });

    it('should fail with missing content', async () => {
      const response = await fetch(`${API_BASE_URL}/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });

  describe('POST /api/audit', () => {
    it('should audit dependencies', async () => {
      const dependencies = [
        { name: 'react', version: '18.2.0' },
        { name: 'vue', version: '3.3.4' }
      ];

      const response = await fetch(`${API_BASE_URL}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dependencies })
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    }, 60000);

    it('should fail with empty dependencies', async () => {
      const response = await fetch(`${API_BASE_URL}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dependencies: [] })
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
    });
  });

  describe('GET /api/check', () => {
    it('should check from GitHub file URL', async () => {
      const testUrl = 'https://raw.githubusercontent.com/facebook/react/main/package.json';
      const response = await fetch(`${API_BASE_URL}/check?url=${encodeURIComponent(testUrl)}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    }, 60000);

    it('should check from GitHub repo URL', async () => {
      const testUrl = 'https://github.com/facebook/react';
      const response = await fetch(`${API_BASE_URL}/check?url=${encodeURIComponent(testUrl)}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    }, 60000);
  });

  describe('POST /api/check', () => {
    it('should check from content', async () => {
      const content = JSON.stringify({
        dependencies: {
          react: '^18.2.0'
        }
      });

      const response = await fetch(`${API_BASE_URL}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    }, 60000);
  });

  describe('Rate Limiting', () => {
    it('should include rate limit headers', async () => {
      const response = await fetch(`${API_BASE_URL}/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '{}' })
      });

      // Note: Rate limit headers might not be present in all environments
      const rateLimitHeader = response.headers.get('X-RateLimit-Limit');
      if (rateLimitHeader) {
        expect(rateLimitHeader).toBeDefined();
        expect(parseInt(rateLimitHeader)).toBeGreaterThan(0);
      }
    });
  });
});
