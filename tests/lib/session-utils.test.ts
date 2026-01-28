import { expect, test, describe } from "bun:test";
import { signSession, verifySession, type SessionData } from "../../lib/session-utils";

describe("session-utils", () => {
  const mockPayload: SessionData = {
    userId: 1,
    username: "testuser",
    mustChangePassword: false,
    timestamp: Date.now(),
    roleId: 2,
    roleName: "admin"
  };

  test("should sign and verify a session token", async () => {
    const token = await signSession(mockPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.includes(".")).toBe(true);

    const verified = await verifySession(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(mockPayload.userId);
    expect(verified?.username).toBe(mockPayload.username);
    expect(verified?.roleId).toBe(mockPayload.roleId);
  });

  test("should return null for invalid token signature", async () => {
    const token = await signSession(mockPayload);
    const [header, signature] = token.split(".");
    const tamperedToken = `${header}.tampered-signature`;
    
    const verified = await verifySession(tamperedToken);
    expect(verified).toBeNull();
  });

  test("should return null for malformed token", async () => {
    const verified = await verifySession("malformed-token-without-dot");
    expect(verified).toBeNull();
  });

  test("should return null for invalid JSON data", async () => {
    const invalidHeader = Buffer.from("not-a-json").toString("base64url");
    const token = `${invalidHeader}.some-signature`;
    
    // This will likely catch JSON.parse error and return null
    const verified = await verifySession(token);
    expect(verified).toBeNull();
  });
});
