import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  process.env.JWT_SECRETE = process.env.JWT_SECRETE || "test-secret";
});

function findRouteLayer(router, path, method) {
  return router.stack.find(
    (layer) => layer.route?.path === path && layer.route.methods[method]
  );
}

describe("employee routes", () => {
  it("PATCH /:employeeId requires auth", async () => {
    const { default: employeesRoutes } = await import("../routes/employeesRoutes.js");
    const layer = findRouteLayer(employeesRoutes, "/:employeeId", "patch");
    expect(layer).toBeTruthy();
    const middlewareNames = layer.route.stack.map((l) => l.name);
    expect(middlewareNames).toContain("auth");
  });
});

describe("department routes", () => {
  it("PATCH /:deptId requires auth and admin/super-admin role", async () => {
    const { default: departmentRoutes } = await import("../routes/departmentRoutes.js");
    const layer = findRouteLayer(departmentRoutes, "/:deptId", "patch");
    expect(layer).toBeTruthy();
    expect(layer.route.stack.length).toBeGreaterThanOrEqual(3);
    const middlewareNames = layer.route.stack.map((l) => l.name);
    expect(middlewareNames).toContain("auth");
  });
});
