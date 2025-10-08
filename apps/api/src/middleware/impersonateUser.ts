import type { Response, NextFunction } from "express";
import { Types } from "mongoose";
import type { AuthenticatedRequest } from "../types/express";
import { UserModel, AuditLogModel } from "../models";

export const impersonateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const targetId = req.headers["x-impersonate-user"];
  if (!targetId || typeof targetId !== "string") {
    next();
    return;
  }

  if (!req.user?.roles?.some((role) => role === "owner" || role === "admin")) {
    res.status(403).json({ error: "Only owner or admin can impersonate" });
    return;
  }

  if (!Types.ObjectId.isValid(targetId)) {
    res.status(400).json({ error: "Invalid impersonation target" });
    return;
  }

  const targetUser = await UserModel.findById(targetId);
  if (!targetUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  req.impersonatorId = req.user.sub;
  req.user = {
    sub: targetUser._id.toHexString(),
    email: targetUser.email,
    plan: targetUser.plan,
    preferredProvider: targetUser.preferredProvider,
    preferredModel: targetUser.preferredModel,
    roles: targetUser.roles ?? ["user"]
  };

  await AuditLogModel.create({
    actorId: new Types.ObjectId(req.impersonatorId),
    action: "impersonate",
    entityType: "user",
    entityId: targetUser._id,
    meta: { targetEmail: targetUser.email },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  next();
};
