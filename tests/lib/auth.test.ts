import { expect, test, describe } from "bun:test";
import { normalizePermissions, validatePasswordStrength } from "../../lib/auth";

describe("auth utils", () => {
  describe("normalizePermissions", () => {
    test("should handle null/undefined", () => {
      expect(normalizePermissions(null)).toEqual([]);
      expect(normalizePermissions(undefined)).toEqual([]);
    });

    test("should handle array of strings", () => {
      expect(normalizePermissions(["view", " edit "])).toEqual(["view", "edit"]);
    });

    test("should handle JSON string", () => {
      expect(normalizePermissions('["view", "admin"]')).toEqual(["view", "admin"]);
    });

    test("should handle single string as fallback", () => {
      expect(normalizePermissions("*")).toEqual(["*"]);
      expect(normalizePermissions("  events.view  ")).toEqual(["events.view"]);
    });

    test("should filter empty strings and nulls in array", () => {
      expect(normalizePermissions(["view", "", " ", null])).toEqual(["view"]);
    });
  });

  describe("validatePasswordStrength", () => {
    test("should reject short passwords", () => {
      const result = validatePasswordStrength("Ab1");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("8 Zeichen");
    });

    test("should reject passwords without uppercase", () => {
      const result = validatePasswordStrength("ab123456");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("Großbuchstaben");
    });

    test("should reject passwords without lowercase", () => {
      const result = validatePasswordStrength("AB123456");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("Kleinbuchstaben");
    });

    test("should reject passwords without digits", () => {
      const result = validatePasswordStrength("Abcdefgh");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("Zahl");
    });

    test("should accept strong passwords", () => {
      const result = validatePasswordStrength("Password123");
      expect(result.valid).toBe(true);
    });
  });
});
