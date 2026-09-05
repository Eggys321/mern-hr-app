import { describe, it, expect, vi, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";
import restrict from "../middleware/isAdmin.js";

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

beforeAll(() => {
  process.env.JWT_SECRETE = "test-secret";
});

describe("auth middleware", () => {
  it("rejects a request with no Authorization header", async () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = vi.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a malformed/invalid token", async () => {
    const req = { headers: { authorization: "Bearer not-a-real-token" } };
    const res = mockRes();
    const next = vi.fn();

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the decoded user and calls next() for a valid token", async () => {
    const token = jwt.sign(
      { userId: "u1", role: "employee", firstName: "A", lastName: "B", email: "a@b.com" },
      process.env.JWT_SECRETE,
      { expiresIn: "1h" }
    );
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = vi.fn();

    await auth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toMatchObject({ userId: "u1", role: "employee" });
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("restrict (role-check) middleware", () => {
  it("blocks a role that isn't in the allowed list", () => {
    const middleware = restrict("admin", "super-admin");
    const req = { user: { role: "employee" } };
    const res = mockRes();
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("allows a role that is in the allowed list", () => {
    const middleware = restrict("admin", "super-admin");
    const req = { user: { role: "admin" } };
    const res = mockRes();
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
