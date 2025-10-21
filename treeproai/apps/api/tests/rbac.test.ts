import { describe, it, expect } from "vitest";
import { hasRole } from "../src/common/guards/rbac.guard";

describe("RBAC helper", () => {
  it("allows when role in allowed", () => {
    expect(hasRole("MANAGER", ["OWNER", "MANAGER"])).toBe(true);
  });
  it("denies when role not allowed", () => {
    expect(hasRole("CREW", ["OWNER", "MANAGER"])).toBe(false);
  });
});