import { describe, it, expect } from "vitest";
import { hasRole } from "../src/common/guards/rbac.guard";
import { Role } from "../src/common/decorators/roles.decorator";

describe("RBAC Guard Logic", () => {
  it("should return true if user role is in the allowed list", () => {
    const allowed: Role[] = ["OWNER", "MANAGER"];
    expect(hasRole("OWNER", allowed)).toBe(true);
    expect(hasRole("MANAGER", allowed)).toBe(true);
  });

  it("should return false if user role is not in the allowed list", () => {
    const allowed: Role[] = ["OWNER", "MANAGER"];
    expect(hasRole("SALES", allowed)).toBe(false);
    expect(hasRole("CREW", allowed)).toBe(false);
  });

  it("should handle single-role lists", () => {
    const allowed: Role[] = ["SALES"];
    expect(hasRole("SALES", allowed)).toBe(true);
    expect(hasRole("MANAGER", allowed)).toBe(false);
  });
});