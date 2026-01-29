import { expect, test, describe } from "bun:test";
import { calculateImportance, isHighImportanceRole } from "../../lib/utils/importance-utils";

describe("importance-utils", () => {
  test("calculateImportance - should return 0 for empty affiliations", () => {
    expect(calculateImportance([])).toBe(0);
  });

  test("calculateImportance - should return the highest role importance", () => {
    const affiliations = [
        { org: "CDU", role: "Mitglied" }, // 100
        { org: "Dorf", role: "Ortsbürgermeister" } // 1000
    ];
    expect(calculateImportance(affiliations)).toBe(1000);
  });

  test("calculateImportance - should return default for unknown roles", () => {
    const affiliations = [
        { org: "Test", role: "Some Unknown Role" }
    ];
    expect(calculateImportance(affiliations)).toBe(50);
  });

  test("isHighImportanceRole - should correctly identify high importance roles", () => {
    expect(isHighImportanceRole("Ortsbürgermeister")).toBe(true); // 1000
    expect(isHighImportanceRole("Ortsbrandmeister")).toBe(true);   // 600
    expect(isHighImportanceRole("1. Vorsitzender")).toBe(false);   // 400
    expect(isHighImportanceRole("Mitglied")).toBe(false);        // 100
    expect(isHighImportanceRole("Unknown")).toBe(false);         // 0
  });
});
