import { CGClass } from '../../src/CGClass';
import { CGAccess } from '../../src/CGAccess';
import { CGProperty } from '../../src/CGProperty';
import { CGMethod } from '../../src/CGMethod';
import { StringBuilder } from '../../src/StringBuilder';

describe('CGClass', () => {
  let cgClass: CGClass;
  let writer: StringBuilder;

  beforeEach(() => {
    cgClass = new CGClass();
    writer = new StringBuilder();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(cgClass.comment).toBe('');
      expect(cgClass.access).toBe(CGAccess.public);
      expect(cgClass.name).toBe('');
      expect(cgClass.inheritClassName).toBe('');
      expect(cgClass.isExport).toBe(false);
      expect(cgClass.isExportAsDefault).toBe(false);
    });
  });

  describe('addDecorator', () => {
    it('should add decorator to class', () => {
      cgClass.addDecorator('@Component');
      cgClass.name = 'TestClass';
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('@Component');
    });

    it('should add multiple decorators', () => {
      cgClass.addDecorator('@Component');
      cgClass.addDecorator('@Injectable');
      cgClass.name = 'TestClass';
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('@Component');
      expect(result).toContain('@Injectable');
    });
  });

  describe('addImplementInterface', () => {
    it('should add interface to implements clause', () => {
      cgClass.addImplementInterface('ITestInterface');
      cgClass.name = 'TestClass';
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('implements ITestInterface');
    });

    it('should add multiple interfaces', () => {
      cgClass.addImplementInterface('ITestInterface');
      cgClass.addImplementInterface('IAnotherInterface');
      cgClass.name = 'TestClass';
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('implements ITestInterface, IAnotherInterface');
    });
  });

  describe('addProperty', () => {
    it('should add property to class', () => {
      const property = new CGProperty();
      property.name = 'testProp';
      property.type = 'string';
      
      cgClass.addProperty(property);
      cgClass.name = 'TestClass';
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('testProp: string');
    });
  });

  describe('addMethod', () => {
    it('should add method to class', () => {
      const method = new CGMethod();
      method.name = 'testMethod';
      method.returnType = 'void';
      
      cgClass.addMethod(method);
      cgClass.name = 'TestClass';
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('testMethod(): void');
    });
  });

  describe('writeTo', () => {
    it('should generate basic class declaration', () => {
      cgClass.name = 'TestClass';
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('class TestClass');
      expect(result).toContain('{');
      expect(result).toContain('}');
    });

    it('should generate class with comment', () => {
      cgClass.name = 'TestClass';
      cgClass.comment = 'This is a test class';
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('/**');
      expect(result).toContain('This is a test class');
      expect(result).toContain('*/');
    });

    it('should generate exported class', () => {
      cgClass.name = 'TestClass';
      cgClass.isExport = true;
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('export class TestClass');
    });

    it('should generate default exported class', () => {
      cgClass.name = 'TestClass';
      cgClass.isExport = true;
      cgClass.isExportAsDefault = true;
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('export default class TestClass');
    });

    it('should generate class with inheritance', () => {
      cgClass.name = 'TestClass';
      cgClass.inheritClassName = 'BaseClass';
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('class TestClass extends BaseClass');
    });

    it('should generate complete class with all features', () => {
      cgClass.name = 'TestClass';
      cgClass.comment = 'Test class with all features';
      cgClass.isExport = true;
      cgClass.inheritClassName = 'BaseClass';
      cgClass.addDecorator('@Component');
      cgClass.addImplementInterface('ITestInterface');
      
      const property = new CGProperty();
      property.name = 'testProp';
      property.type = 'string';
      cgClass.addProperty(property);
      
      const method = new CGMethod();
      method.name = 'testMethod';
      method.returnType = 'void';
      cgClass.addMethod(method);
      
      cgClass.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('/**');
      expect(result).toContain('Test class with all features');
      expect(result).toContain('@Component');
      expect(result).toContain('export class TestClass extends BaseClass implements ITestInterface');
      expect(result).toContain('testProp: string');
      expect(result).toContain('testMethod(): void');
    });
  });
});