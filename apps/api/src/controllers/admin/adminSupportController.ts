import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthenticatedRequest } from "../../types/express";
import { SupportTicketModel } from "../../models";
import { supportReplySchema } from "../../schemas/adminSchemas";
import { asyncHandler } from "../../utils/asyncHandler";
import { auditService } from "../../services/auditService";

export const listSupportTickets = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const query: Record<string, unknown> = {};
  if (status) {
    query.status = status;
  }
  const tickets = await SupportTicketModel.find(query)
    .sort({ updatedAt: -1 })
    .limit(100)
    .lean()
    .exec();
  res.json({ tickets });
});

export const replyToTicket = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const ticketId = req.params.id;
  if (!Types.ObjectId.isValid(ticketId)) {
    res.status(400).json({ error: "Invalid ticket id" });
    return;
  }

  const payload = supportReplySchema.parse(req.body);
  const ticket = await SupportTicketModel.findById(ticketId);
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }

  ticket.messages.push({
    senderId: new Types.ObjectId(req.impersonatorId ?? req.user.sub),
    body: payload.message,
    createdAt: new Date()
  });
  if (payload.status) {
    ticket.status = payload.status;
  }
  if (payload.assigneeId && Types.ObjectId.isValid(payload.assigneeId)) {
    ticket.assigneeId = new Types.ObjectId(payload.assigneeId);
  }
  await ticket.save();

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "reply-ticket",
    entityType: "support-ticket",
    entityId: ticket._id,
    meta: { status: ticket.status },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.json({ ticket });
});
