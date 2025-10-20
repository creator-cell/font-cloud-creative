import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { env } from "../config/env";
import { UserModel } from "../models";
import type { AuthClaims, Role } from "../types/express";
import type { PlanTier } from "../constants/plans";
import type { ProviderId } from "../providers/types";

interface IssueTokenInput {
  userId: string;
  email: string;
  plan: PlanTier;
  preferredProvider?: ProviderId;
  preferredModel?: string;
  passwordHash?: string;
}

const elevatedRoles: Role[] = ["owner", "admin", "analyst", "support", "billing", "user"];

const resolveInitialRoles = async (email: string): Promise<Role[]> => {
  const normalized = email.toLowerCase();
  if (env.superAdmins.includes(normalized)) {
    return elevatedRoles;
  }

  const count = await UserModel.estimatedDocumentCount();
  if (count === 0) {
    return ["owner", "admin", "user"];
  }
  return ["user"];
};

export const issueUserToken = async ({
  userId,
  email,
  plan,
  preferredProvider,
  preferredModel,
  passwordHash
}: IssueTokenInput): Promise<{ token: string; claims: AuthClaims; created: boolean }> => {
  const existing = Types.ObjectId.isValid(userId)
    ? await UserModel.findById(userId)
    : await UserModel.findOne({ email });

  let user = existing;
  let created = false;
  if (user) {
    user = await UserModel.findByIdAndUpdate(
      user._id,
      {
        email,
        plan,
        preferredProvider,
        preferredModel,
        ...(passwordHash ? { passwordHash } : {})
      },
      { new: true }
    );
  } else {
    const roles = await resolveInitialRoles(email);
    user = await UserModel.create({
      _id: Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
      email,
      plan,
      preferredProvider,
      preferredModel,
      roles,
      passwordHash
    });
    created = true;
  }

  const normalizedEmail = email.toLowerCase();
  if (env.superAdmins.includes(normalizedEmail) && user) {
    const roleSet = new Set<Role>([...(user.roles ?? []), ...elevatedRoles]);
    if (roleSet.size !== (user.roles?.length ?? 0)) {
      user.roles = Array.from(roleSet);
      await user.save();
    }
  }

  const claims: AuthClaims = {
    sub: user!._id.toHexString(),
    email: user!.email,
    plan: user!.plan,
    preferredProvider: user!.preferredProvider,
    preferredModel: user!.preferredModel,
    roles: user!.roles ?? ["user"]
  };

  const token = jwt.sign(claims, env.jwtSecret, { expiresIn: "1h" });
  return { token, claims, created };
};
