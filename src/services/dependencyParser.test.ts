import { describe, it, expect } from 'bun:test';
import { parseDependencies } from './dependencyParser';

describe('parseDependencies', () => {

  describe('NPM / JavaScript', () => {
    it('should parse package.json', () => {
      const input = JSON.stringify({
        name: 'test-app',
        version: '1.0.0',
        dependencies: {
          'react': '^18.2.0',
          'vue': '~3.3.0'
        },
        devDependencies: {
          'vite': '4.0.0'
        }
      });

      const result = parseDependencies(input);
      expect(result.length).toBe(3);
      expect(result).toContainEqual({ name: 'react', version: '^18.2.0' });
      expect(result).toContainEqual({ name: 'vue', version: '~3.3.0' });
      expect(result).toContainEqual({ name: 'vite', version: '4.0.0' });
    });

    it('should parse yarn.lock', () => {
      const input = `
"react@^18.2.0":
  version "18.2.0"

"vue@~3.3.0":
  version "3.3.4"
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'react', version: '18.2.0' });
      expect(result).toContainEqual({ name: 'vue', version: '3.3.4' });
    });

    it('should parse package-lock.json v3', () => {
      const input = JSON.stringify({
        lockfileVersion: 3,
        packages: {
          '': { version: '1.0.0' },
          'node_modules/react': { version: '18.2.0' },
          'node_modules/vue': { version: '3.3.4' }
        }
      });

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'react', version: '18.2.0' });
      expect(result).toContainEqual({ name: 'vue', version: '3.3.4' });
    });
  });

  describe('Go', () => {
    it('should parse go.mod with single-line requires', () => {
      const input = `
module myapp

go 1.21

require github.com/gin-gonic/gin v1.9.0
require github.com/redis/go-redis/v9 v9.0.0
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'github.com/gin-gonic/gin', version: 'v1.9.0' });
      expect(result).toContainEqual({ name: 'github.com/redis/go-redis/v9', version: 'v9.0.0' });
    });

    it('should parse go.mod with multi-line require block', () => {
      const input = `
module myapp

go 1.21

require (
    github.com/gin-gonic/gin v1.9.0
    github.com/redis/go-redis/v9 v9.0.0
    github.com/stretchr/testify v1.8.0
)
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(3);
      expect(result).toContainEqual({ name: 'github.com/gin-gonic/gin', version: 'v1.9.0' });
      expect(result).toContainEqual({ name: 'github.com/redis/go-redis/v9', version: 'v9.0.0' });
      expect(result).toContainEqual({ name: 'github.com/stretchr/testify', version: 'v1.8.0' });
    });

    it('should parse go.sum and deduplicate', () => {
      const input = `
github.com/gin-gonic/gin v1.9.0 h1:abc123
github.com/gin-gonic/gin v1.9.0/go.mod h1:def456
github.com/redis/go-redis/v9 v9.0.0 h1:xyz789
github.com/redis/go-redis/v9 v9.0.0/go.mod h1:ghi012
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'github.com/gin-gonic/gin', version: 'v1.9.0' });
      expect(result).toContainEqual({ name: 'github.com/redis/go-redis/v9', version: 'v9.0.0' });
    });
  });

  describe('Rust', () => {
    it('should parse Cargo.toml with simple dependencies', () => {
      const input = `
[package]
name = "my-rust-app"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = "1.0"
reqwest = "0.11"

[dev-dependencies]
mockito = "1.0"
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(3);
      expect(result).toContainEqual({ name: 'serde', version: '1.0' });
      expect(result).toContainEqual({ name: 'reqwest', version: '0.11' });
      expect(result).toContainEqual({ name: 'mockito', version: '1.0' });

      // Should NOT include [package] fields
      expect(result).not.toContainEqual({ name: 'my-rust-app', version: '0.1.0' });
      expect(result.find(d => d.name === 'name' || d.name === 'edition')).toBeUndefined();
    });

    it('should parse Cargo.toml with complex dependencies', () => {
      const input = `
[dependencies]
serde = "1.0"
tokio = { version = "1.35", features = ["full"] }
reqwest = { version = "0.11", default-features = false }
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(3);
      expect(result).toContainEqual({ name: 'serde', version: '1.0' });
      expect(result).toContainEqual({ name: 'tokio', version: '1.35' });
      expect(result).toContainEqual({ name: 'reqwest', version: '0.11' });
    });

    it('should parse Cargo.lock', () => {
      const input = `
[[package]]
name = "serde"
version = "1.0.193"
source = "registry+https://github.com/rust-lang/crates.io-index"

[[package]]
name = "tokio"
version = "1.35.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'serde', version: '1.0.193' });
      expect(result).toContainEqual({ name: 'tokio', version: '1.35.1' });
    });

    it('should NOT confuse Cargo.lock with Cargo.toml', () => {
      // This was the bug - Cargo.lock regex was matching [package] in Cargo.toml
      const cargoToml = `
[package]
name = "my-app"
version = "0.1.0"

[dependencies]
serde = "1.0"
      `;

      const result = parseDependencies(cargoToml);
      // Should only parse [dependencies], not [package]
      expect(result.length).toBe(1);
      expect(result).toContainEqual({ name: 'serde', version: '1.0' });
      expect(result).not.toContainEqual({ name: 'my-app', version: '0.1.0' });
    });
  });

  describe('Python', () => {
    it('should parse requirements.txt', () => {
      const input = `
django==4.2.0
flask>=2.0.0
requests~=2.31.0
numpy==1.24.3
      `;

      const result = parseDependencies(input);
      expect(result.length).toBeGreaterThanOrEqual(4);
      expect(result).toContainEqual({ name: 'django', version: '4.2.0' });
      expect(result).toContainEqual({ name: 'flask', version: '2.0.0' });
    });

    it('should parse Pipfile.lock', () => {
      const input = JSON.stringify({
        _meta: { hash: { sha256: 'abc123' } },
        default: {
          'django': { version: '==4.2.0' },
          'flask': { version: '==2.0.0' }
        }
      });

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'django', version: '4.2.0' });
      expect(result).toContainEqual({ name: 'flask', version: '2.0.0' });
    });
  });

  describe('Ruby', () => {
    it('should parse Gemfile.lock', () => {
      const input = `
GEM
  specs:
    rails (7.1.0)
    puma (6.4.0)
    pg (1.5.4)
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(3);
      expect(result).toContainEqual({ name: 'rails', version: '7.1.0' });
      expect(result).toContainEqual({ name: 'puma', version: '6.4.0' });
      expect(result).toContainEqual({ name: 'pg', version: '1.5.4' });
    });
  });

  describe('Java', () => {
    it('should parse pom.xml (Maven)', () => {
      const input = `
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>3.2.0</version>
  </dependency>
  <dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.33</version>
  </dependency>
</dependencies>
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'spring-boot-starter', version: '3.2.0' });
      expect(result).toContainEqual({ name: 'mysql-connector-j', version: '8.0.33' });
    });

    it('should parse build.gradle (Gradle)', () => {
      const input = `
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter:3.2.0'
    api 'com.google.guava:guava:32.1.3-jre'
    testImplementation 'junit:junit:4.13.2'
}
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(3);
      expect(result).toContainEqual({ name: 'org.springframework.boot:spring-boot-starter', version: '3.2.0' });
      expect(result).toContainEqual({ name: 'com.google.guava:guava', version: '32.1.3-jre' });
      expect(result).toContainEqual({ name: 'junit:junit', version: '4.13.2' });
    });
  });

  describe('Swift', () => {
    it('should parse Package.swift', () => {
      const input = `
.package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),
.package(url: "https://github.com/SwiftyJSON/SwiftyJSON.git", branch: "master")
      `;

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'Alamofire', version: '5.8.0' });
      expect(result).toContainEqual({ name: 'SwiftyJSON', version: 'master' });
    });

    it('should parse Package.resolved', () => {
      const input = JSON.stringify({
        pins: [
          {
            identity: 'alamofire',
            location: 'https://github.com/Alamofire/Alamofire.git',
            state: { version: '5.8.0' }
          },
          {
            identity: 'swiftyjson',
            location: 'https://github.com/SwiftyJSON/SwiftyJSON.git',
            state: { version: '5.0.1' }
          }
        ]
      });

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'alamofire', version: '5.8.0' });
      expect(result).toContainEqual({ name: 'swiftyjson', version: '5.0.1' });
    });
  });

  describe('PHP', () => {
    it('should parse composer.lock', () => {
      const input = JSON.stringify({
        packages: [
          { name: 'symfony/http-foundation', version: 'v6.4.0' },
          { name: 'laravel/framework', version: 'v10.35.0' }
        ]
      });

      const result = parseDependencies(input);
      expect(result.length).toBe(2);
      expect(result).toContainEqual({ name: 'symfony/http-foundation', version: 'v6.4.0' });
      expect(result).toContainEqual({ name: 'laravel/framework', version: 'v10.35.0' });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty input', () => {
      expect(parseDependencies('')).toEqual([]);
      expect(parseDependencies('   ')).toEqual([]);
    });

    it('should handle invalid JSON gracefully', () => {
      const result = parseDependencies('{ invalid json }');
      expect(result).toBeDefined();
    });

    it('should handle mixed formats (fallback)', () => {
      const input = `
react: 18.2.0
vue: 3.3.4
      `;

      const result = parseDependencies(input);
      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });
});
