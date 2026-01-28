import { expect, test, describe } from "bun:test";
import { 
  getCategoryColors, 
  getCategoryBackgroundColor, 
  getCategoryBadgeClasses, 
  getCategoryDisplayName 
} from "../../lib/utils/event-utils";

describe("event-utils", () => {
  test("getCategoryColors - should return correct colors for known category", () => {
    const colors = getCategoryColors("sitzung");
    expect(colors.bg).toBe("bg-blue-500");
    expect(colors.text).toBe("text-blue-600");
  });

  test("getCategoryColors - should return default colors for unknown category", () => {
    const colors = getCategoryColors("unknown");
    expect(colors.bg).toBe("bg-gray-500");
    expect(colors.text).toBe("text-gray-600");
  });

  test("getCategoryBackgroundColor - should return bg class", () => {
    expect(getCategoryBackgroundColor("sport")).toBe("bg-orange-500");
  });

  test("getCategoryBadgeClasses - should combine bgLight and text classes", () => {
    const classes = getCategoryBadgeClasses("veranstaltung");
    expect(classes).toContain("bg-green-100");
    expect(classes).toContain("text-green-600");
  });

  test("getCategoryDisplayName - should return German label", () => {
    expect(getCategoryDisplayName("sitzung")).toBe("Sitzung");
    expect(getCategoryDisplayName("notfall")).toBe("Notfall");
    expect(getCategoryDisplayName("nonexistent")).toBe("Sonstiges");
  });
});
