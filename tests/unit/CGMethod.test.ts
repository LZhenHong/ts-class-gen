import { CGMethod } from '../../src/CGMethod';
import { CGAccess } from '../../src/CGAccess';
import { CGParameter } from '../../src/CGParameter';
import { StringBuilder } from '../../src/StringBuilder';

describe('CGMethod', () => {
  let cgMethod: CGMethod;
  let writer: StringBuilder;

  beforeEach(() => {
    cgMethod = new CGMethod();
    writer = new StringBuilder();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(cgMethod.comment).toBe('');
      expect(cgMethod.access).toBe(CGAccess.public);
      expect(cgMethod.isStatic).toBe(false);
      expect(cgMethod.isReadonly).toBe(false);
      expect(cgMethod.returnType).toBe('void');
      expect(cgMethod.name).toBe('');
      // bodyCodes is private, so we test through writeTo output
    });
  });

  describe('addParameters', () => {
    it('should add parameter to method', () => {
      const param = new CGParameter();
      param.name = 'testParam';
      param.type = 'string';
      
      cgMethod.addParameters(param);
      cgMethod.name = 'testMethod';
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('testParam: string');
    });

    it('should add multiple parameters', () => {
      const param1 = new CGParameter();
      param1.name = 'param1';
      param1.type = 'string';
      
      const param2 = new CGParameter();
      param2.name = 'param2';
      param2.type = 'number';
      
      cgMethod.addParameters(param1, param2);
      cgMethod.name = 'testMethod';
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('param1: string, param2: number');
    });
  });

  describe('writeTo', () => {
    it('should generate basic method declaration', () => {
      cgMethod.name = 'testMethod';
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('public testMethod(): void');
    });

    it('should generate method with comment', () => {
      cgMethod.name = 'testMethod';
      cgMethod.comment = 'This is a test method';
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('/**');
      expect(result).toContain('This is a test method');
      expect(result).toContain('*/');
    });

    it('should generate private method', () => {
      cgMethod.name = 'testMethod';
      cgMethod.access = CGAccess.private;
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('private testMethod(): void');
    });

    it('should generate protected method', () => {
      cgMethod.name = 'testMethod';
      cgMethod.access = CGAccess.protected;
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('protected testMethod(): void');
    });

    it('should generate static method', () => {
      cgMethod.name = 'testMethod';
      cgMethod.isStatic = true;
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('public static testMethod(): void');
    });

    it('should generate readonly method (getter)', () => {
      cgMethod.name = 'testMethod';
      cgMethod.isReadonly = true;
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('public get testMethod(): void');
    });

    it('should generate method with return type', () => {
      cgMethod.name = 'testMethod';
      cgMethod.returnType = 'string';
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('public testMethod(): string');
    });

    it('should generate method with body', () => {
      cgMethod.name = 'testMethod';
      cgMethod.appendCodes('return "test";');
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('return "test";');
    });

    it('should generate method with parameters', () => {
      const param = new CGParameter();
      param.name = 'value';
      param.type = 'string';
      
      cgMethod.name = 'testMethod';
      cgMethod.addParameters(param);
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('testMethod(value: string): void');
    });

    it('should generate complete method with all features', () => {
      const param1 = new CGParameter();
      param1.name = 'param1';
      param1.type = 'string';
      
      const param2 = new CGParameter();
      param2.name = 'param2';
      param2.type = 'number';
      
      cgMethod.name = 'testMethod';
      cgMethod.comment = 'Test method with all features';
      cgMethod.access = CGAccess.private;
      cgMethod.isStatic = true;
      cgMethod.returnType = 'boolean';
      cgMethod.addParameters(param1, param2);
      cgMethod.appendCodes('return true;');
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('/**');
      expect(result).toContain('Test method with all features');
      expect(result).toContain('private static testMethod(param1: string, param2: number): boolean');
      expect(result).toContain('return true;');
    });

    it('should handle generic return types', () => {
      cgMethod.name = 'getData';
      cgMethod.returnType = 'Promise<T>';
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('public getData(): Promise<T>');
    });

    it('should handle async methods', () => {
      cgMethod.name = 'fetchData';
      cgMethod.returnType = 'Promise<string>';
      cgMethod.appendCodes('return await fetch("/api/data");');
      cgMethod.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('public fetchData(): Promise<string>');
      expect(result).toContain('return await fetch("/api/data");');
    });
  });
});