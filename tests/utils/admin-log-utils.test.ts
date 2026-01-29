import { expect, test, describe } from "bun:test";
import { getActionDescription } from "../../lib/utils/admin-log-utils";

describe("admin-log-utils", () => {
  test("getActionDescription - should return correct German translation", () => {
    expect(getActionDescription("event.create")).toBe("Termin erstellt");
    expect(getActionDescription("news.delete")).toBe("Nachricht gelöscht");
    expect(getActionDescription("auth.login")).toBe("Angemeldet");
  });

  test("getActionDescription - should return action unchanged if not found", () => {
    expect(getActionDescription("unknown.action")).toBe("unknown.action");
  });
});
