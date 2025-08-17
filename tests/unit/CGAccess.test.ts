import { CGAccess } from '../../src/CGAccess';

describe('CGAccess', () => {
  describe('enum values', () => {
    it('should have correct public value', () => {
      expect(CGAccess.public).toBe('public');
    });

    it('should have correct private value', () => {
      expect(CGAccess.private).toBe('private');
    });

    it('should have correct protected value', () => {
      expect(CGAccess.protected).toBe('protected');
    });
  });

  describe('enum completeness', () => {
    it('should have exactly 3 access modifiers', () => {
      const values = Object.values(CGAccess);
      expect(values).toHaveLength(3);
    });

    it('should contain all expected access modifiers', () => {
      const values = Object.values(CGAccess);
      expect(values).toContain('public');
      expect(values).toContain('private');
      expect(values).toContain('protected');
    });
  });

  describe('enum keys', () => {
    it('should have correct enum keys', () => {
      const keys = Object.keys(CGAccess);
      expect(keys).toContain('public');
      expect(keys).toContain('private');
      expect(keys).toContain('protected');
    });
  });
});