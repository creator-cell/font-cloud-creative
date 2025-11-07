import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthenticatedRequest } from "../types/express";
import { createProjectSchema } from "../schemas/projectSchemas";
import { ProjectModel, BrandVoiceModel } from "../models";
import { createAssistantThread, createAssistantVectorStore } from "../services/openai/assistantThreads.js";
import { asyncHandler } from "../utils/asyncHandler";

export const listProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const projects = await ProjectModel.find({ userId: new Types.ObjectId(req.user.sub) })
    .lean()
    .exec();

  res.json({ projects });
});

export const createProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = createProjectSchema.parse(req.body);
  const [assistantThreadId, assistantVectorStoreId] = await Promise.all([
    createAssistantThread(),
    createAssistantVectorStore()
  ]);
  const project = await ProjectModel.create({
    userId: new Types.ObjectId(req.user.sub),
    name: payload.name,
    modelOverride: payload.modelOverride,
    assistantThreadId,
    assistantVectorStoreId
  });

  res.status(201).json({ project });
});

export const listBrandVoices = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const voices = await BrandVoiceModel.find({ userId: new Types.ObjectId(req.user.sub) })
    .lean()
    .exec();

  res.json({ brandVoices: voices });
});
