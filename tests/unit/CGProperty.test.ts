import { CGProperty } from '../../src/CGProperty';
import { CGAccess } from '../../src/CGAccess';
import { StringBuilder } from '../../src/StringBuilder';

describe('CGProperty', () => {
  let cgProperty: CGProperty;
  let writer: StringBuilder;

  beforeEach(() => {
    cgProperty = new CGProperty();
    writer = new StringBuilder();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(cgProperty.comment).toBe('');
      expect(cgProperty.access).toBe(CGAccess.public);
      expect(cgProperty.isStatic).toBe(false);
      expect(cgProperty.type).toBe('any');
      expect(cgProperty.name).toBe('');
      expect(cgProperty.defaultValue).toBe('');
    });
  });



  describe('writeTo', () => {
    it('should generate basic property declaration', () => {
      cgProperty.name = 'testProp';
      cgProperty.type = 'string';
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('testProp: string;');
    });

    it('should generate property with comment', () => {
      cgProperty.name = 'testProp';
      cgProperty.type = 'string';
      cgProperty.comment = 'This is a test property';
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('/**');
      expect(result).toContain('This is a test property');
      expect(result).toContain('*/');
    });

    it('should generate private property', () => {
      cgProperty.name = 'testProp';
      cgProperty.type = 'string';
      cgProperty.access = CGAccess.private;
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('privatetestProp: string;');
    });

    it('should generate protected property', () => {
      cgProperty.name = 'testProp';
      cgProperty.type = 'string';
      cgProperty.access = CGAccess.protected;
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('protectedtestProp: string;');
    });

    it('should generate static property', () => {
      cgProperty.name = 'testProp';
      cgProperty.type = 'string';
      cgProperty.isStatic = true;
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain(' static testProp: string;');
    });

    it('should generate property with default value', () => {
      cgProperty.name = 'testProp';
      cgProperty.type = 'string';
      cgProperty.defaultValue = '"default"';
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('testProp: string = "default";');
    });



    it('should generate complete property with all features', () => {
      cgProperty.name = 'testProp';
      cgProperty.type = 'string';
      cgProperty.comment = 'Test property with all features';
      cgProperty.access = CGAccess.private;
      cgProperty.isStatic = true;
      cgProperty.defaultValue = '"test"';
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('/**');
      expect(result).toContain('Test property with all features');
      expect(result).toContain('private static testProp: string = "test";');
    });

    it('should handle array types', () => {
      cgProperty.name = 'items';
      cgProperty.type = 'string[]';
      cgProperty.defaultValue = '[]';
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('items: string[] = [];');
    });

    it('should handle generic types', () => {
      cgProperty.name = 'data';
      cgProperty.type = 'Map<string, number>';
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('data: Map<string, number>;');
    });

    it('should handle optional properties', () => {
      cgProperty.name = 'optionalProp';
      cgProperty.type = 'string | undefined';
      cgProperty.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('optionalProp: string | undefined;');
    });
  });
});