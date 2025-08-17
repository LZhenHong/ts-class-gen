import { CGInterface } from '../../src/CGInterface';
import { CGProperty } from '../../src/CGProperty';
import { CGAccess } from '../../src/CGAccess';
import { StringBuilder } from '../../src/StringBuilder';

describe('CGInterface', () => {
  let cgInterface: CGInterface;
  let writer: StringBuilder;

  beforeEach(() => {
    cgInterface = new CGInterface();
    writer = new StringBuilder();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(cgInterface.comment).toBe('');
      expect(cgInterface.name).toBe('');
      expect(cgInterface.isExport).toBe(false);
      expect(cgInterface.isExportAsDefault).toBe(false);
    });
  });

  describe('addProperty', () => {
    it('should add property to interface', () => {
      const property = new CGProperty();
      property.name = 'testProp';
      property.type = 'string';
      
      cgInterface.addProperty(property);
      cgInterface.name = 'TestInterface';
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('testProp: string;');
    });

    it('should add multiple properties', () => {
      const prop1 = new CGProperty();
      prop1.name = 'prop1';
      prop1.type = 'string';
      
      const prop2 = new CGProperty();
      prop2.name = 'prop2';
      prop2.type = 'number';
      
      cgInterface.addProperty(prop1);
      cgInterface.addProperty(prop2);
      cgInterface.name = 'TestInterface';
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('prop1: string;');
      expect(result).toContain('prop2: number;');
    });
  });

  describe('writeTo', () => {
    it('should generate basic interface declaration', () => {
      cgInterface.name = 'TestInterface';
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('interface TestInterface');
      expect(result).toContain('{');
      expect(result).toContain('}');
    });

    it('should generate interface with comment', () => {
      cgInterface.name = 'TestInterface';
      cgInterface.comment = 'Test interface comment';
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('/**');
      expect(result).toContain('Test interface comment');
      expect(result).toContain('*/');
      expect(result).toContain('interface TestInterface');
    });

    it('should generate exported interface', () => {
      cgInterface.name = 'TestInterface';
      cgInterface.isExport = true;
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('export interface TestInterface');
    });

    it('should generate default exported interface', () => {
      cgInterface.name = 'TestInterface';
      cgInterface.isExport = true;
      cgInterface.isExportAsDefault = true;
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('export default interface TestInterface');
    });

    it('should generate interface with properties', () => {
      cgInterface.name = 'TestInterface';
      
      const prop1 = new CGProperty();
      prop1.name = 'id';
      prop1.type = 'number';
      
      const prop2 = new CGProperty();
      prop2.name = 'name';
      prop2.type = 'string';
      
      cgInterface.addProperty(prop1);
      cgInterface.addProperty(prop2);
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('interface TestInterface');
      expect(result).toContain('id: number;');
      expect(result).toContain('name: string;');
    });

    it('should handle empty interface', () => {
      cgInterface.name = 'EmptyInterface';
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('interface EmptyInterface');
      expect(result).toContain('{');
      expect(result).toContain('}');
    });

    it('should generate complete interface with all features', () => {
      cgInterface.name = 'CompleteInterface';
      cgInterface.comment = 'A complete interface example';
      cgInterface.isExport = true;
      
      const prop1 = new CGProperty();
      prop1.name = 'id';
      prop1.type = 'number';
      prop1.comment = 'Unique identifier';
      
      const prop2 = new CGProperty();
      prop2.name = 'name';
      prop2.type = 'string';
      prop2.defaultValue = '"default"';
      
      cgInterface.addProperty(prop1);
      cgInterface.addProperty(prop2);
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('/**');
      expect(result).toContain('A complete interface example');
      expect(result).toContain('export interface CompleteInterface');
      expect(result).toContain('Unique identifier');
      expect(result).toContain('id: number;');
      expect(result).toContain('name: string = "default";');
    });
  });

  describe('edge cases', () => {
    it('should handle interface with no name', () => {
      cgInterface.name = '';
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('interface ');
    });

    it('should handle multiline comment', () => {
      cgInterface.name = 'TestInterface';
      cgInterface.comment = 'Line 1\nLine 2\nLine 3';
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('/**');
      expect(result).toContain('Line 1');
      expect(result).toContain('Line 2');
      expect(result).toContain('Line 3');
      expect(result).toContain('*/');
    });

    it('should handle empty comment', () => {
      cgInterface.name = 'TestInterface';
      cgInterface.comment = '';
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).not.toContain('/**');
      expect(result).toContain('interface TestInterface');
    });

    it('should handle whitespace-only comment', () => {
      cgInterface.name = 'TestInterface';
      cgInterface.comment = '   \n\t  ';
      cgInterface.writeTo(writer);
      
      const result = writer.toString();
      expect(result).not.toContain('/**');
      expect(result).toContain('interface TestInterface');
    });
  });
});