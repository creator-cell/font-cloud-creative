// @ts-nocheck
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/express.js";
import { AnnouncementModel } from "../../models/index.js";
import { announcementSchema } from "../../schemas/adminSchemas.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auditService } from "../../services/auditService.js";

export const createAnnouncement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = announcementSchema.parse(req.body);
  const announcement = await AnnouncementModel.create({
    title: payload.title,
    body: payload.body,
    audience: payload.audience,
    link: payload.link,
    published: payload.published ?? false,
    publishAt: payload.publishAt ? new Date(payload.publishAt) : undefined
  });

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "create-announcement",
    entityType: "announcement",
    entityId: announcement._id,
    meta: { audience: announcement.audience, published: announcement.published },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.status(201).json({ announcement });
});

export const listAnnouncements = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const announcements = await AnnouncementModel.find().sort({ createdAt: -1 }).lean().exec();
  res.json({ announcements });
});
