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
    expect(calculateImportance(affiliations)).toBe(7);
  });

  test("calculateImportance - should return default for unknown roles", () => {
    const affiliations = [
        { org: "Test", role: "Some Unknown Role" }
    ];
    expect(calculateImportance(affiliations)).toBe(0);
  });

  test("isHighImportanceRole - should correctly identify high importance roles", () => {
    expect(isHighImportanceRole("Ortsbürgermeister")).toBe(true); // 7
    expect(isHighImportanceRole("Ortsbrandmeister")).toBe(true);   // 5
    expect(isHighImportanceRole("1. Vorsitzender")).toBe(false);   // 3
    expect(isHighImportanceRole("Mitglied")).toBe(false);          // 0
    expect(isHighImportanceRole("Unknown")).toBe(false);           // 0
  });
});
