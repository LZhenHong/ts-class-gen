import { CGHelper } from '../../src/CGHelper';
import { StringBuilder } from '../../src/StringBuilder';

describe('CGHelper', () => {
  describe('formatDateInYearMonthDay', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-01-15');
      const result = CGHelper.formatDateInYearMonthDay(date);
      expect(result).toBe('2023-01-15');
    });

    it('should handle single digit month and day', () => {
      const date = new Date('2023-03-05');
      const result = CGHelper.formatDateInYearMonthDay(date);
      expect(result).toBe('2023-03-05');
    });

    it('should handle December 31st', () => {
      const date = new Date('2023-12-31');
      const result = CGHelper.formatDateInYearMonthDay(date);
      expect(result).toBe('2023-12-31');
    });
  });

  describe('getFileHeader', () => {
    it('should generate basic file header', () => {
      const result = CGHelper.getFileHeader('John Doe', new Date('2023-01-01'), '1.0.0', 'Test file');
      expect(result).toContain('// --------------------------------------------------');
      expect(result).toContain('// Author: John Doe');
      expect(result).toContain('// Date: 2023-01-01');
      expect(result).toContain('// Version: 1.0.0');
      expect(result).toContain('// Description: Test file');
    });

    it('should handle null date', () => {
      const result = CGHelper.getFileHeader('John Doe', null, '1.0.0', 'Test file');
      expect(result).toContain('// Author: John Doe');
      expect(result).not.toContain('// Date:');
    });

    it('should handle empty strings', () => {
      const result = CGHelper.getFileHeader('', null, '', '');
      expect(result).toContain('// --------------------------------------------------');
      expect(result).toContain('// Author: ');
      expect(result).toContain('// Version: ');
      expect(result).toContain('// Description: ');
    });
  });

  describe('beautyLine', () => {
    it('should generate beauty line', () => {
      const result = CGHelper.beautyLine();
      expect(result).toContain('// --------------------------------------------------');
      expect(result.length).toBe(53); // '// ' + 50 dashes + newline
    });
  });

  describe('getComment', () => {
    it('should generate single line comment', () => {
      const result = CGHelper.getComment('Test comment', 0);
      expect(result).toContain('/**');
      expect(result).toContain('Test comment');
      expect(result).toContain('*/');
    });

    it('should handle multiline comment', () => {
      const result = CGHelper.getComment('Line 1\nLine 2\nLine 3', 0);
      expect(result).toContain('/**');
      expect(result).toContain('Line 1');
      expect(result).toContain('Line 2');
      expect(result).toContain('Line 3');
      expect(result).toContain('*/');
    });

    it('should handle indentation', () => {
      const result = CGHelper.getComment('Test comment', 2);
      expect(result).toContain('        /**'); // 2 tabs = 8 spaces
    });
  });

  describe('getClassDecorator', () => {
    it('should generate decorator without indentation', () => {
      const result = CGHelper.getClassDecorator('@Component');
      expect(result).toBe('@@Component');
    });

    it('should generate decorator with indentation', () => {
      const result = CGHelper.getClassDecorator('@Component', 1);
      expect(result).toContain('    @@Component'); // 1 tab = 4 spaces
    });
  });

  describe('getClassDeclaration', () => {
    it('should generate basic class declaration', () => {
      const result = CGHelper.getClassDeclaration(0, 'TestClass');
      expect(result).toBe('class TestClass');
    });

    it('should generate exported class', () => {
      const result = CGHelper.getClassDeclaration(0, 'TestClass', '', [], true);
      expect(result).toBe('export class TestClass');
    });

    it('should generate default exported class', () => {
      const result = CGHelper.getClassDeclaration(0, 'TestClass', '', [], true, true);
      expect(result).toBe('export default class TestClass');
    });

    it('should generate class with inheritance', () => {
      const result = CGHelper.getClassDeclaration(0, 'TestClass', 'BaseClass');
      expect(result).toBe('class TestClass extends BaseClass');
    });

    it('should generate class with interfaces', () => {
      const result = CGHelper.getClassDeclaration(0, 'TestClass', '', ['IInterface1', 'IInterface2']);
      expect(result).toBe('class TestClass implements IInterface1, IInterface2');
    });

    it('should generate class with inheritance and interfaces', () => {
      const result = CGHelper.getClassDeclaration(0, 'TestClass', 'BaseClass', ['IInterface1', 'IInterface2']);
      expect(result).toBe('class TestClass extends BaseClass implements IInterface1, IInterface2');
    });

    it('should handle indentation', () => {
      const result = CGHelper.getClassDeclaration(1, 'TestClass');
      expect(result).toContain('    class TestClass'); // 1 tab = 4 spaces
    });
  });

  describe('getInterfaceDeclaration', () => {
    it('should generate basic interface declaration', () => {
      const result = CGHelper.getInterfaceDeclaration(0, 'ITestInterface');
      expect(result).toBe('interface ITestInterface');
    });

    it('should generate exported interface', () => {
      const result = CGHelper.getInterfaceDeclaration(0, 'ITestInterface', true);
      expect(result).toBe('export interface ITestInterface');
    });

    it('should generate default exported interface', () => {
      const result = CGHelper.getInterfaceDeclaration(0, 'ITestInterface', true, true);
      expect(result).toBe('export default interface ITestInterface');
    });

    it('should handle indentation', () => {
      const result = CGHelper.getInterfaceDeclaration(1, 'ITestInterface');
      expect(result).toContain('    interface ITestInterface'); // 1 tab = 4 spaces
    });
  });

  describe('getPropertyDeclaration', () => {
    it('should generate basic property', () => {
      const result = CGHelper.getPropertyDeclaration(0, 'public', 'string', 'name', '');
      expect(result).toBe('name: string;');
    });

    it('should generate private property', () => {
      const result = CGHelper.getPropertyDeclaration(0, 'private', 'string', 'name', '');
      expect(result).toBe('privatename: string;');
    });

    it('should generate protected property', () => {
      const result = CGHelper.getPropertyDeclaration(0, 'protected', 'string', 'name', '');
      expect(result).toBe('protectedname: string;');
    });

    it('should generate static property', () => {
      const result = CGHelper.getPropertyDeclaration(0, 'public', 'string', 'name', '', true);
      expect(result).toBe(' static name: string;');
    });

    it('should generate property with default value', () => {
      const result = CGHelper.getPropertyDeclaration(0, 'public', 'string', 'name', '"default"');
      expect(result).toBe('name: string = "default";');
    });

    it('should handle indentation', () => {
      const result = CGHelper.getPropertyDeclaration(1, 'public', 'string', 'name', '');
      expect(result).toContain('    name: string;'); // 1 tab = 4 spaces
    });
  });

  describe('getMethodDeclaration', () => {
    it('should generate basic method', () => {
      const result = CGHelper.getMethodDeclaration(0, 'public', 'void', 'testMethod');
      expect(result).toBe('public testMethod(): void');
    });

    it('should generate private method', () => {
      const result = CGHelper.getMethodDeclaration(0, 'private', 'void', 'testMethod');
      expect(result).toBe('private testMethod(): void');
    });

    it('should generate static method', () => {
      const result = CGHelper.getMethodDeclaration(0, 'public', 'void', 'testMethod', true);
      expect(result).toBe('public static testMethod(): void');
    });

    it('should generate method with parameters', () => {
      const result = CGHelper.getMethodDeclaration(0, 'public', 'void', 'testMethod', false, ['param1: string', 'param2: number']);
      expect(result).toBe('public testMethod(param1: string, param2: number): void');
    });

    it('should generate readonly method (getter)', () => {
      const result = CGHelper.getMethodDeclaration(0, 'public', 'string', 'testMethod', false, [], true);
      expect(result).toBe('public get testMethod(): string');
    });

    it('should handle indentation', () => {
      const result = CGHelper.getMethodDeclaration(1, 'public', 'void', 'testMethod');
      expect(result).toContain('    public testMethod(): void'); // 1 tab = 4 spaces
    });
  });

  describe('tab', () => {
    it('should generate correct number of tabs', () => {
      expect(CGHelper.tab(0)).toBe('');
      expect(CGHelper.tab(1)).toBe('    '); // 4 spaces
      expect(CGHelper.tab(2)).toBe('        '); // 8 spaces
      expect(CGHelper.tab(3)).toBe('            '); // 12 spaces
    });

    it('should handle negative numbers', () => {
      expect(CGHelper.tab(-1)).toBe('');
      expect(CGHelper.tab(-5)).toBe('');
    });
  });

  describe('beginCodeBlock', () => {
    it('should append opening brace with newline', () => {
      const sb = new StringBuilder();
      CGHelper.beginCodeBlock(sb);
      expect(sb.toString()).toBe(' {\n');
    });
  });

  describe('endCodeBlock', () => {
    it('should append closing brace with proper indentation', () => {
      const sb = new StringBuilder();
      CGHelper.endCodeBlock(sb, 0);
      expect(sb.toString()).toBe('}\n');
    });

    it('should handle indentation', () => {
      const sb = new StringBuilder();
      CGHelper.endCodeBlock(sb, 1);
      expect(sb.toString()).toBe('    }\n'); // 1 tab = 4 spaces
    });
  });

  describe('beginRegion', () => {
    it('should append region start comment', () => {
      const sb = new StringBuilder();
      CGHelper.beginRegion(sb, 'Test Region', 0);
      const result = sb.toString();
      expect(result).toContain('// #region');
      expect(result).toContain('Test Region');
    });

    it('should handle indentation', () => {
      const sb = new StringBuilder();
      CGHelper.beginRegion(sb, 'Test Region', 1);
      const result = sb.toString();
      expect(result).toContain('    // #region'); // 1 tab = 4 spaces
    });
  });

  describe('endRegion', () => {
    it('should append region end comment', () => {
      const sb = new StringBuilder();
      CGHelper.endRegion(sb, 0);
      const result = sb.toString();
      expect(result).toContain('// #endregion');
    });

    it('should handle indentation', () => {
      const sb = new StringBuilder();
      CGHelper.endRegion(sb, 1);
      const result = sb.toString();
      expect(result).toContain('    // #endregion'); // 1 tab = 4 spaces
    });
  });

  describe('edge cases', () => {
    it('should handle empty class name', () => {
      const result = CGHelper.getClassDeclaration(0, '');
      expect(result).toBe('class ');
    });

    it('should handle empty interface name', () => {
      const result = CGHelper.getInterfaceDeclaration(0, '');
      expect(result).toBe('interface ');
    });

    it('should handle empty property name', () => {
      const result = CGHelper.getPropertyDeclaration(0, 'public', 'string', '', '');
      expect(result).toBe(': string;');
    });

    it('should handle empty method name', () => {
      const result = CGHelper.getMethodDeclaration(0, 'public', 'void', '');
      expect(result).toBe('public (): void');
    });

    it('should handle very large tab values', () => {
      const result = CGHelper.tab(100);
      expect(result.length).toBe(400); // 100 * 4 spaces
    });
  });
});