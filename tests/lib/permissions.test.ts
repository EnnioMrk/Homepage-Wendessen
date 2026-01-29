import { expect, test, describe } from "bun:test";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "../../lib/permissions";
import type { AdminUser } from "../../lib/auth";

describe("permissions", () => {
  const mockUser: AdminUser = {
    id: 1,
    username: "testuser",
    mustChangePassword: false,
    createdAt: new Date(),
    customPermissions: ["events.view", "events.create", "news.*"]
  };

  const superUser: AdminUser = {
    id: 2,
    username: "superuser",
    mustChangePassword: false,
    createdAt: new Date(),
    customPermissions: ["*"]
  };

  const limitedUser: AdminUser = {
    id: 3,
    username: "limited",
    mustChangePassword: false,
    createdAt: new Date(),
    customPermissions: ["verein.events.create"]
  };

  test("hasPermission - exact match", () => {
    expect(hasPermission(mockUser, "events.view")).toBe(true);
    expect(hasPermission(mockUser, "events.create")).toBe(true);
    expect(hasPermission(mockUser, "events.delete")).toBe(false);
  });

  test("hasPermission - wildcard *", () => {
    expect(hasPermission(superUser, "any.permission")).toBe(true);
    expect(hasPermission(superUser, "news.delete")).toBe(true);
  });

  test("hasPermission - category wildcard category.*", () => {
    expect(hasPermission(mockUser, "news.view")).toBe(true);
    expect(hasPermission(mockUser, "news.create")).toBe(true);
    expect(hasPermission(mockUser, "news.delete")).toBe(true);
  });

  test("hasPermission - implicit .view from verein.*", () => {
    expect(hasPermission(limitedUser, "events.view")).toBe(true);
    expect(hasPermission(limitedUser, "events.create")).toBe(false);
  });

  test("hasPermission - null user", () => {
    expect(hasPermission(null, "events.view")).toBe(false);
  });

  test("hasAnyPermission", () => {
    expect(hasAnyPermission(mockUser, ["events.delete", "events.view"])).toBe(true);
    expect(hasAnyPermission(mockUser, ["events.delete", "news.delete"])).toBe(true); // news.delete allowed by news.*
    expect(hasAnyPermission(mockUser, ["gallery.view", "contacts.view"])).toBe(false);
  });

  test("hasAllPermissions", () => {
    expect(hasAllPermissions(mockUser, ["events.view", "news.view"])).toBe(true);
    expect(hasAllPermissions(mockUser, ["events.view", "gallery.view"])).toBe(false);
  });
});
