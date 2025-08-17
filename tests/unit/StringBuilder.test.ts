import { StringBuilder } from '../../src/StringBuilder';

describe('StringBuilder', () => {
  let sb: StringBuilder;

  beforeEach(() => {
    sb = new StringBuilder();
  });

  describe('constructor', () => {
    it('should initialize with empty string', () => {
      expect(sb.toString()).toBe('');
    });
  });

  describe('append', () => {
    it('should append string without newline', () => {
      sb.append('Hello');
      sb.append(' World');
      
      expect(sb.toString()).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      sb.append('');
      sb.append('test');
      
      expect(sb.toString()).toBe('test');
    });

    it('should handle special characters', () => {
      sb.append('Hello\nWorld\t!');
      
      expect(sb.toString()).toBe('Hello\nWorld\t!');
    });
  });

  describe('appendLine', () => {
    it('should append string with newline', () => {
      sb.appendLine('Hello');
      sb.appendLine('World');
      
      expect(sb.toString()).toBe('Hello\nWorld\n');
    });

    it('should handle empty lines', () => {
      sb.appendLine('');
      sb.appendLine('test');
      
      expect(sb.toString()).toBe('\ntest\n');
    });

    it('should work without parameters', () => {
      sb.appendLine();
      sb.append('test');
      
      expect(sb.toString()).toBe('\ntest');
    });
  });

  describe('toString', () => {
    it('should return complete string', () => {
      sb.append('Hello ');
      sb.appendLine('World');
      sb.append('!');
      
      expect(sb.toString()).toBe('Hello World\n!');
    });

    it('should return empty string when nothing appended', () => {
      expect(sb.toString()).toBe('');
    });
  });

  describe('mixed operations', () => {
    it('should handle mixed append and appendLine operations', () => {
      sb.append('function ');
      sb.append('test()');
      sb.appendLine(' {');
      sb.appendLine('  return true;');
      sb.append('}');
      
      const expected = 'function test() {\n  return true;\n}';
      expect(sb.toString()).toBe(expected);
    });

    it('should build complex code structure', () => {
      sb.appendLine('class TestClass {');
      sb.append('  private ');
      sb.append('value');
      sb.appendLine(': string;');
      sb.appendLine();
      sb.appendLine('  constructor(value: string) {');
      sb.appendLine('    this.value = value;');
      sb.appendLine('  }');
      sb.appendLine('}');
      
      const expected = [
        'class TestClass {',
        '  private value: string;',
        '',
        '  constructor(value: string) {',
        '    this.value = value;',
        '  }',
        '}',
        ''
      ].join('\n');
      
      expect(sb.toString()).toBe(expected);
    });
  });

  describe('performance', () => {
    it('should handle large number of operations efficiently', () => {
      const start = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        sb.append(`line ${i} `);
        sb.appendLine('content');
      }
      
      const end = Date.now();
      const result = sb.toString();
      
      expect(result).toContain('line 0 content');
      expect(result).toContain('line 999 content');
      expect(end - start).toBeLessThan(100); // Should complete within 100ms
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined gracefully', () => {
      sb.append(null as any);
      sb.appendLine(undefined as any);
      
      expect(sb.toString()).toBe('\n');
    });

    it('should handle numbers and booleans', () => {
      sb.append(42 as any);
      sb.appendLine(true as any);
      sb.append(false as any);
      
      expect(sb.toString()).toBe('42true\nfalse');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      sb.append(longString);
      
      expect(sb.toString()).toBe(longString);
      expect(sb.toString().length).toBe(10000);
    });
  });
});