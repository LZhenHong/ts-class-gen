import { CGFile } from '../../src/CGFile';
import { CGClass } from '../../src/CGClass';
import { CGInterface } from '../../src/CGInterface';
import { CGProperty } from '../../src/CGProperty';
import { CGMethod } from '../../src/CGMethod';
import { CGParameter } from '../../src/CGParameter';
import { CGAccess } from '../../src/CGAccess';
import { StringBuilder } from '../../src/StringBuilder';

describe('Code Generation Integration Tests', () => {
  let writer: StringBuilder;

  beforeEach(() => {
    writer = new StringBuilder();
  });

  describe('Complete Class Generation', () => {
    it('should generate a complete TypeScript class with all features', () => {
      // Create a file
      const cgFile = new CGFile();
      cgFile.author = 'Test Author';
      cgFile.version = '1.0.0';
      cgFile.comment = 'Generated TypeScript class';
      cgFile.date = new Date('2023-01-01');

      // Create an interface
      const userInterface = new CGInterface();
      userInterface.name = 'IUser';
      userInterface.isExport = true;
      
      const interfaceIdProp = new CGProperty();
      interfaceIdProp.name = 'id';
      interfaceIdProp.type = 'string';
      userInterface.addProperty(interfaceIdProp);
      
      const interfaceNameProp = new CGProperty();
      interfaceNameProp.name = 'name';
      interfaceNameProp.type = 'string';
      userInterface.addProperty(interfaceNameProp);

      cgFile.addInterface(userInterface);

      // Create a class
      const userClass = new CGClass();
      userClass.name = 'User';
      userClass.isExport = true;
      userClass.addImplementInterface('IUser');

      // Add properties
      const idProperty = new CGProperty();
      idProperty.name = 'id';
      idProperty.type = 'string';
      idProperty.access = CGAccess.private;
      userClass.addProperty(idProperty);

      const nameProperty = new CGProperty();
      nameProperty.name = 'name';
      nameProperty.type = 'string';
      nameProperty.access = CGAccess.private;
      userClass.addProperty(nameProperty);

      const staticCountProperty = new CGProperty();
      staticCountProperty.name = 'count';
      staticCountProperty.type = 'number';
      staticCountProperty.access = CGAccess.private;
      staticCountProperty.isStatic = true;
      staticCountProperty.defaultValue = '0';
      userClass.addProperty(staticCountProperty);

      // Add constructor
      const constructor = new CGMethod();
      constructor.name = 'constructor';
      constructor.access = CGAccess.public;
      
      const idParam = new CGParameter();
      idParam.name = 'id';
      idParam.type = 'string';
      constructor.addParameters(idParam);
      
      const nameParam = new CGParameter();
      nameParam.name = 'name';
      nameParam.type = 'string';
      constructor.addParameters(nameParam);
      
      constructor.appendCodes('this.id = id;', 'this.name = name;', 'User.count++;');
      userClass.addMethod(constructor);

      // Add getter methods
      const getIdMethod = new CGMethod();
      getIdMethod.name = 'getId';
      getIdMethod.access = CGAccess.public;
      getIdMethod.returnType = 'string';
      getIdMethod.appendCodes('return this.id;');
      userClass.addMethod(getIdMethod);

      const getNameMethod = new CGMethod();
      getNameMethod.name = 'getName';
      getNameMethod.access = CGAccess.public;
      getNameMethod.returnType = 'string';
      getNameMethod.appendCodes('return this.name;');
      userClass.addMethod(getNameMethod);

      // Add static method
      const getCountMethod = new CGMethod();
      getCountMethod.name = 'getCount';
      getCountMethod.access = CGAccess.public;
      getCountMethod.returnType = 'number';
      getCountMethod.isStatic = true;
      getCountMethod.appendCodes('return User.count;');
      userClass.addMethod(getCountMethod);

      cgFile.addClass(userClass);

      // Generate the code
      cgFile.writeTo(writer);
      const result = writer.toString();

      // Verify file header
      expect(result).toContain('// --------------------------------------------------');
      expect(result).toContain('// Author: Test Author');
      expect(result).toContain('// Date: 2023-01-01');
      expect(result).toContain('// Version: 1.0.0');
      expect(result).toContain('// Description: Generated TypeScript class');

      // Verify interface generation
      expect(result).toContain('export interface IUser');
      expect(result).toContain('id: string;');
      expect(result).toContain('name: string;');

      // Verify class generation
      expect(result).toContain('export class User implements IUser');
      expect(result).toContain('privateid: string;');
      expect(result).toContain('privatename: string;');
      expect(result).toContain('private static count: number = 0;');
      expect(result).toContain('public constructor(id: string, name: string)');
      expect(result).toContain('public getId(): string');
      expect(result).toContain('public getName(): string');
      expect(result).toContain('public static getCount(): number');
    });
  });

  describe('Multiple Classes and Interfaces', () => {
    it('should generate multiple classes and interfaces in correct order', () => {
      const cgFile = new CGFile();
      cgFile.author = 'Integration Test';
      cgFile.version = '2.0.0';
      cgFile.comment = 'Multiple entities test';

      // Create first interface
      const baseInterface = new CGInterface();
      baseInterface.name = 'IBase';
      baseInterface.isExport = true;
      
      const baseProp = new CGProperty();
      baseProp.name = 'id';
      baseProp.type = 'number';
      baseInterface.addProperty(baseProp);
      cgFile.addInterface(baseInterface);

      // Create second interface
      const namedInterface = new CGInterface();
      namedInterface.name = 'INamed';
      namedInterface.isExport = true;
      
      const namedProp = new CGProperty();
      namedProp.name = 'name';
      namedProp.type = 'string';
      namedInterface.addProperty(namedProp);
      cgFile.addInterface(namedInterface);

      // Create first class
      const entityClass = new CGClass();
      entityClass.name = 'Entity';
      entityClass.isExport = true;
      entityClass.addImplementInterface('IBase');
      entityClass.addImplementInterface('INamed');
      
      const entityIdProp = new CGProperty();
      entityIdProp.name = 'id';
      entityIdProp.type = 'number';
      entityIdProp.access = CGAccess.protected;
      entityClass.addProperty(entityIdProp);
      
      const entityNameProp = new CGProperty();
      entityNameProp.name = 'name';
      entityNameProp.type = 'string';
      entityNameProp.access = CGAccess.protected;
      entityClass.addProperty(entityNameProp);
      cgFile.addClass(entityClass);

      // Create second class that extends first
      const userClass = new CGClass();
      userClass.name = 'User';
      userClass.isExport = true;
      userClass.inheritClassName = 'Entity';
      
      const userEmailProp = new CGProperty();
      userEmailProp.name = 'email';
      userEmailProp.type = 'string';
      userEmailProp.access = CGAccess.private;
      userClass.addProperty(userEmailProp);
      cgFile.addClass(userClass);

      cgFile.writeTo(writer);
      const result = writer.toString();

      // Verify interfaces come before classes
      const ibaseIndex = result.indexOf('export interface IBase');
      const inamedIndex = result.indexOf('export interface INamed');
      const entityIndex = result.indexOf('export class Entity');
      const userIndex = result.indexOf('export class User');

      expect(ibaseIndex).toBeGreaterThan(-1);
      expect(inamedIndex).toBeGreaterThan(-1);
      expect(entityIndex).toBeGreaterThan(-1);
      expect(userIndex).toBeGreaterThan(-1);

      // Interfaces should come before classes
      expect(ibaseIndex).toBeLessThan(entityIndex);
      expect(inamedIndex).toBeLessThan(entityIndex);
      
      // Entity should come before User
      expect(entityIndex).toBeLessThan(userIndex);

      // Verify inheritance and implementation
      expect(result).toContain('export class Entity implements IBase, INamed');
      expect(result).toContain('export class User extends Entity');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty file generation', () => {
      const cgFile = new CGFile();
      cgFile.author = 'Empty Test';
      cgFile.version = '0.0.1';
      cgFile.comment = 'Empty file';

      cgFile.writeTo(writer);
      const result = writer.toString();

      // Should only contain file header
      expect(result).toContain('// --------------------------------------------------');
      expect(result).toContain('// Author: Empty Test');
      expect(result).toContain('// Version: 0.0.1');
      expect(result).toContain('// Description: Empty file');
      
      // Should not contain any class or interface declarations
      expect(result).not.toContain('class ');
      expect(result).not.toContain('interface ');
    });

    it('should handle class with no methods or properties', () => {
      const cgFile = new CGFile();
      cgFile.author = 'Minimal Test';
      cgFile.version = '0.0.1';
      cgFile.comment = 'Minimal class';

      const emptyClass = new CGClass();
      emptyClass.name = 'EmptyClass';
      emptyClass.isExport = true;
      cgFile.addClass(emptyClass);

      cgFile.writeTo(writer);
      const result = writer.toString();

      expect(result).toContain('export class EmptyClass');
      expect(result).toContain('{');
      expect(result).toContain('}');
    });
  });
});