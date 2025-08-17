import { CGFile } from '../../src/CGFile';
import { CGClass } from '../../src/CGClass';
import { CGInterface } from '../../src/CGInterface';
import { CGProperty } from '../../src/CGProperty';
import { CGAccess } from '../../src/CGAccess';
import { StringBuilder } from '../../src/StringBuilder';

describe('CGFile', () => {
  let cgFile: CGFile;
  let writer: StringBuilder;

  beforeEach(() => {
    cgFile = new CGFile();
    writer = new StringBuilder();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(cgFile.directoryPath).toBe('');
      expect(cgFile.name).toBe('');
      expect(cgFile.fileExtension).toBe('ts');
      expect(cgFile.author).toBe('');
      expect(cgFile.date).toBeNull();
      expect(cgFile.version).toBe('');
      expect(cgFile.comment).toBe('');
    });
  });

  describe('fileName getter', () => {
    it('should return correct filename with default extension', () => {
      cgFile.name = 'TestFile';
      expect(cgFile.fileName).toBe('TestFile.ts');
    });

    it('should return correct filename with custom extension', () => {
      cgFile.name = 'TestFile';
      cgFile.fileExtension = 'js';
      expect(cgFile.fileName).toBe('TestFile.js');
    });

    it('should handle empty name', () => {
      cgFile.name = '';
      expect(cgFile.fileName).toBe('.ts');
    });
  });

  describe('filePath getter', () => {
    it('should return correct file path', () => {
      cgFile.directoryPath = '/src/models';
      cgFile.name = 'User';
      expect(cgFile.filePath).toBe('/src/models/User.ts');
    });

    it('should handle empty directory path', () => {
      cgFile.directoryPath = '';
      cgFile.name = 'User';
      expect(cgFile.filePath).toBe('/User.ts');
    });

    it('should handle custom extension', () => {
      cgFile.directoryPath = '/dist';
      cgFile.name = 'index';
      cgFile.fileExtension = 'js';
      expect(cgFile.filePath).toBe('/dist/index.js');
    });
  });

  describe('addImport', () => {
    it('should add import statement', () => {
      cgFile.addImport('{ Component } from "react"');
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('import { Component } from "react";');
    });

    it('should add multiple import statements', () => {
      cgFile.addImport('{ Component } from "react"');
      cgFile.addImport('{ Observable } from "rxjs"');
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('import { Component } from "react";');
      expect(result).toContain('import { Observable } from "rxjs";');
    });
  });

  describe('addSupplement', () => {
    it('should add supplement code', () => {
      cgFile.addSupplement('const API_URL = "https://api.example.com";');
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('const API_URL = "https://api.example.com";');
    });

    it('should add multiple supplements', () => {
      cgFile.addSupplement('const API_URL = "https://api.example.com";');
      cgFile.addSupplement('const VERSION = "1.0.0";');
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('const API_URL = "https://api.example.com";');
      expect(result).toContain('const VERSION = "1.0.0";');
    });
  });

  describe('addInterface', () => {
    it('should add interface to file', () => {
      const testInterface = new CGInterface();
      testInterface.name = 'IUser';
      
      const prop = new CGProperty();
      prop.name = 'id';
      prop.type = 'number';
      testInterface.addProperty(prop);
      
      cgFile.addInterface(testInterface);
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('interface IUser');
      expect(result).toContain('id: number;');
    });

    it('should add multiple interfaces', () => {
      const interface1 = new CGInterface();
      interface1.name = 'IUser';
      
      const interface2 = new CGInterface();
      interface2.name = 'IProduct';
      
      cgFile.addInterface(interface1);
      cgFile.addInterface(interface2);
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('interface IUser');
      expect(result).toContain('interface IProduct');
    });
  });

  describe('addClass', () => {
    it('should add class to file', () => {
      const testClass = new CGClass();
      testClass.name = 'User';
      
      const prop = new CGProperty();
      prop.name = 'name';
      prop.type = 'string';
      testClass.addProperty(prop);
      
      cgFile.addClass(testClass);
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('class User');
      expect(result).toContain('name: string;');
    });

    it('should add multiple classes', () => {
      const class1 = new CGClass();
      class1.name = 'User';
      
      const class2 = new CGClass();
      class2.name = 'Product';
      
      cgFile.addClass(class1);
      cgFile.addClass(class2);
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('class User');
      expect(result).toContain('class Product');
    });
  });

  describe('writeTo', () => {
    it('should generate basic file structure', () => {
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('// --------------------------------------------------');
      expect(result).toContain('// Author:');
      expect(result).toContain('// Version:');
      expect(result).toContain('// Description:');
    });

    it('should generate file with header information', () => {
      cgFile.author = 'John Doe';
      cgFile.date = new Date('2023-01-01');
      cgFile.version = '1.0.0';
      cgFile.comment = 'Test file';
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('John Doe');
      expect(result).toContain('2023-01-01');
      expect(result).toContain('1.0.0');
      expect(result).toContain('Test file');
    });

    it('should generate complete file with all components', () => {
      // Set file metadata
      cgFile.author = 'Test Author';
      cgFile.version = '1.0.0';
      cgFile.comment = 'Complete test file';
      
      // Add imports
      cgFile.addImport('{ Component } from "react"');
      cgFile.addImport('{ Observable } from "rxjs"');
      
      // Add supplements
      cgFile.addSupplement('const API_URL = "https://api.example.com";');
      
      // Add interface
      const testInterface = new CGInterface();
      testInterface.name = 'IUser';
      testInterface.isExport = true;
      
      const interfaceProp = new CGProperty();
      interfaceProp.name = 'id';
      interfaceProp.type = 'number';
      testInterface.addProperty(interfaceProp);
      
      cgFile.addInterface(testInterface);
      
      // Add class
      const testClass = new CGClass();
      testClass.name = 'User';
      testClass.isExport = true;
      
      const classProp = new CGProperty();
      classProp.name = 'name';
      classProp.type = 'string';
      testClass.addProperty(classProp);
      
      cgFile.addClass(testClass);
      
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      
      // Check header
      expect(result).toContain('Test Author');
      expect(result).toContain('1.0.0');
      expect(result).toContain('Complete test file');
      
      // Check imports
      expect(result).toContain('import { Component } from "react";');
      expect(result).toContain('import { Observable } from "rxjs";');
      
      // Check supplements
      expect(result).toContain('const API_URL = "https://api.example.com";');
      
      // Check interface
      expect(result).toContain('export interface IUser');
      expect(result).toContain('id: number;');
      
      // Check class
      expect(result).toContain('export class User');
      expect(result).toContain('name: string;');
    });
  });

  describe('edge cases', () => {
    it('should handle file with no content', () => {
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('// --------------------------------------------------');
      expect(result).toContain('// Author:');
      expect(result).toContain('// Version:');
      expect(result).toContain('// Description:');
    });

    it('should handle null date', () => {
      cgFile.author = 'Test Author';
      cgFile.date = null;
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('Test Author');
    });

    it('should handle empty strings', () => {
      cgFile.author = '';
      cgFile.version = '';
      cgFile.comment = '';
      cgFile.writeTo(writer);
      
      const result = writer.toString();
      expect(result).toContain('// --------------------------------------------------');
      expect(result).toContain('// Author:');
      expect(result).toContain('// Version:');
      expect(result).toContain('// Description:');
    });
  });
});