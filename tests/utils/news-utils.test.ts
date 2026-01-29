import { expect, test, describe } from "bun:test";
import { getCategoryColorClasses } from "../../lib/utils/news-utils";

describe("news-utils", () => {
  test("getCategoryColorClasses - should return correct hex codes for known category", () => {
    const colors = getCategoryColorClasses("veranstaltung");
    expect(colors.borderColor).toBe("#059669");
    expect(colors.dotColor).toBe("#059669");
  });

  test("getCategoryColorClasses - should return default for unknown category", () => {
    const colors = getCategoryColorClasses("unknown");
    expect(colors.borderColor).toBe("#6b7280");
  });

  test("getCategoryColorClasses - should handle common categories", () => {
    expect(getCategoryColorClasses("ortsrat").borderColor).toBe("#2563eb");
    expect(getCategoryColorClasses("feuerwehr").borderColor).toBe("#dc2626");
    expect(getCategoryColorClasses("bau").borderColor).toBe("#f59e0b");
  });
});
