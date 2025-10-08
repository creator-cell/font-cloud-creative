import { describe, expect, it, vi } from "vitest";
import type { Response } from "express";
import { requireRole } from "../middleware/requireRole";
import type { AuthenticatedRequest } from "../types/express";

describe("requireRole", () => {
  const createResponse = () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    } as unknown as Response;
    return res;
  };

  it("allows request when role is present", () => {
    const middleware = requireRole("admin");
    const req = { user: { roles: ["admin"], plan: "free", sub: "1", email: "a" } } as AuthenticatedRequest;
    const res = createResponse();
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects request when role is missing", () => {
    const middleware = requireRole("admin");
    const req = { user: { roles: ["user"], plan: "free", sub: "1", email: "a" } } as AuthenticatedRequest;
    const res = createResponse();
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
