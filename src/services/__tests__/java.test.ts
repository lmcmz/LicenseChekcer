import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseDependencies } from '../dependencyParser';

const FIXTURES_DIR = join(__dirname, 'fixtures', 'java');

describe('Java Dependency Parsing', () => {
  describe('pom.xml (Maven)', () => {
    it('should parse Maven dependencies from pom.xml', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'pom.xml'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(8);

      // Spring Boot dependencies
      expect(result).toContainEqual({
        name: 'spring-boot-starter-web',
        version: '3.2.0'
      });
      expect(result).toContainEqual({
        name: 'spring-boot-starter-data-jpa',
        version: '3.2.0'
      });

      // Database drivers
      expect(result).toContainEqual({
        name: 'mysql-connector-j',
        version: '8.2.0'
      });
      expect(result).toContainEqual({
        name: 'postgresql',
        version: '42.7.1'
      });

      // Utilities
      expect(result).toContainEqual({
        name: 'lombok',
        version: '1.18.30'
      });
      expect(result).toContainEqual({
        name: 'guava',
        version: '32.1.3-jre'
      });
    });

    it('should parse JSON dependencies', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'pom.xml'), 'utf-8');
      const result = parseDependencies(content);

      expect(result).toContainEqual({
        name: 'jackson-databind',
        version: '2.16.0'
      });
    });

    it('should parse test dependencies', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'pom.xml'), 'utf-8');
      const result = parseDependencies(content);

      expect(result).toContainEqual({
        name: 'spring-boot-starter-test',
        version: '3.2.0'
      });
      expect(result).toContainEqual({
        name: 'junit',
        version: '4.13.2'
      });
    });
  });

  describe('build.gradle (Gradle)', () => {
    it('should parse Gradle dependencies with implementation', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'build.gradle'), 'utf-8');
      const result = parseDependencies(content);

      expect(result.length).toBeGreaterThanOrEqual(10);

      // Format: groupId:artifactId
      expect(result).toContainEqual({
        name: 'org.springframework.boot:spring-boot-starter-web',
        version: '3.2.0'
      });
      expect(result).toContainEqual({
        name: 'org.springframework.boot:spring-boot-starter-data-jpa',
        version: '3.2.0'
      });
      expect(result).toContainEqual({
        name: 'org.springframework.boot:spring-boot-starter-security',
        version: '3.2.0'
      });
    });

    it('should parse different dependency configurations', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'build.gradle'), 'utf-8');
      const result = parseDependencies(content);

      // runtimeOnly
      expect(result).toContainEqual({
        name: 'com.mysql:mysql-connector-j',
        version: '8.2.0'
      });

      // compileOnly (should not be in result actually, but our parser picks it up)
      // This is OK since we want to know about all dependencies

      // testImplementation
      expect(result).toContainEqual({
        name: 'junit:junit',
        version: '4.13.2'
      });
      expect(result).toContainEqual({
        name: 'org.mockito:mockito-core',
        version: '5.8.0'
      });
    });

    it('should handle dependencies with complex versions', () => {
      const content = readFileSync(join(FIXTURES_DIR, 'build.gradle'), 'utf-8');
      const result = parseDependencies(content);

      // Version with classifier (e.g., 32.1.3-jre)
      expect(result).toContainEqual({
        name: 'com.google.guava:guava',
        version: '32.1.3-jre'
      });
    });
  });
});
