import { Schema, model, type Document, Types } from "mongoose";
import type { ProviderId } from "../providers/types";
import {
  createAssistantThread,
  createAssistantVectorStore,
  deleteAssistantThread,
  deleteAssistantVectorStore
} from "../services/openai/assistantThreads.js";

export interface ProjectDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  modelOverride?: {
    provider: ProviderId;
    model: string;
  };
  brandVoiceIds: Types.ObjectId[];
  assistantThreadId?: string | null;
  assistantVectorStoreId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  ensureAssistantResources: () => Promise<void>;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    modelOverride: {
      provider: { type: String, enum: ["openai", "anthropic", "google", "ollama"] },
      model: { type: String }
    },
    brandVoiceIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "BrandVoice" }],
      default: []
    },
    assistantThreadId: { type: String, default: null },
    assistantVectorStoreId: { type: String, default: null }
  },
  { timestamps: true }
);

projectSchema.pre("deleteOne", { document: true, query: false }, async function (this: ProjectDocument, next) {
  try {
    await deleteAssistantThread(this.assistantThreadId);
    await deleteAssistantVectorStore(this.assistantVectorStoreId);
    next();
  } catch (error) {
    next(error as Error);
  }
});

projectSchema.pre("findOneAndDelete", async function (this: any, next) {
  try {
    const doc = await this.model.findOne(this.getFilter()).lean().exec();
    if (doc?.assistantThreadId) {
      await deleteAssistantThread(doc.assistantThreadId);
    }
    if (doc?.assistantVectorStoreId) {
      await deleteAssistantVectorStore(doc.assistantVectorStoreId);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

projectSchema.methods.ensureAssistantResources = async function (this: ProjectDocument) {
  if (!this.assistantThreadId) {
    this.assistantThreadId = await createAssistantThread();
  }
  if (!this.assistantVectorStoreId) {
    this.assistantVectorStoreId = await createAssistantVectorStore();
  }
  await this.save();
};

export const ProjectModel = model<ProjectDocument>("Project", projectSchema);
