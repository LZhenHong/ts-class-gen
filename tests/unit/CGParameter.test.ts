import { CGParameter } from '../../src/CGParameter';
import { StringBuilder } from '../../src/StringBuilder';

describe('CGParameter', () => {
  let cgParameter: CGParameter;
  let writer: StringBuilder;

  beforeEach(() => {
    cgParameter = new CGParameter();
    writer = new StringBuilder();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(cgParameter.type).toBe('');
      expect(cgParameter.name).toBe('any');
      expect(cgParameter.defaultValue).toBeUndefined();
    });
  });

  describe('toString', () => {
    it('should generate basic parameter string', () => {
      cgParameter.name = 'param';
      cgParameter.type = 'string';
      
      const result = cgParameter.toString();
      expect(result).toBe('param: string');
    });

    it('should generate parameter with default value', () => {
      cgParameter.name = 'param';
      cgParameter.type = 'string';
      cgParameter.defaultValue = '"default"';
      
      const result = cgParameter.toString();
      expect(result).toBe('param: string = "default"');
    });

    it('should handle number default value', () => {
      cgParameter.name = 'count';
      cgParameter.type = 'number';
      cgParameter.defaultValue = 0;
      
      const result = cgParameter.toString();
      expect(result).toBe('count: number');
    });

    it('should handle boolean default value', () => {
      cgParameter.name = 'flag';
      cgParameter.type = 'boolean';
      cgParameter.defaultValue = true;
      
      const result = cgParameter.toString();
      expect(result).toBe('flag: boolean = true');
    });

    it('should handle array type', () => {
      cgParameter.name = 'items';
      cgParameter.type = 'string[]';
      cgParameter.defaultValue = '[]';
      
      const result = cgParameter.toString();
      expect(result).toBe('items: string[] = []');
    });

    it('should handle generic type', () => {
      cgParameter.name = 'data';
      cgParameter.type = 'Map<string, number>';
      
      const result = cgParameter.toString();
      expect(result).toBe('data: Map<string, number>');
    });

    it('should handle optional parameter', () => {
      cgParameter.name = 'optional';
      cgParameter.type = 'string | undefined';
      
      const result = cgParameter.toString();
      expect(result).toBe('optional: string | undefined');
    });
  });

  describe('writeTo', () => {
    it('should write parameter to StringBuilder', () => {
      cgParameter.name = 'param';
      cgParameter.type = 'string';
      cgParameter.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toBe('param: string');
    });

    it('should write parameter with default value to StringBuilder', () => {
      cgParameter.name = 'param';
      cgParameter.type = 'string';
      cgParameter.defaultValue = '"test"';
      cgParameter.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toBe('param: string = "test"');
    });

    it('should ignore tab parameter', () => {
      cgParameter.name = 'param';
      cgParameter.type = 'string';
      cgParameter.writeTo(writer, 5);
      
      const result = writer.toString();
      expect(result).toBe('param: string');
    });
  });

  describe('edge cases', () => {
    it('should handle empty name', () => {
      cgParameter.name = '';
      cgParameter.type = 'string';
      
      const result = cgParameter.toString();
      expect(result).toBe(': string');
    });

    it('should handle empty type', () => {
      cgParameter.name = 'param';
      cgParameter.type = '';
      
      const result = cgParameter.toString();
      expect(result).toBe('param: ');
    });

    it('should handle null default value', () => {
      cgParameter.name = 'param';
      cgParameter.type = 'string';
      cgParameter.defaultValue = null;
      
      const result = cgParameter.toString();
      expect(result).toBe('param: string');
    });

    it('should handle undefined default value', () => {
      cgParameter.name = 'param';
      cgParameter.type = 'string';
      cgParameter.defaultValue = undefined;
      
      const result = cgParameter.toString();
      expect(result).toBe('param: string');
    });
  });
});