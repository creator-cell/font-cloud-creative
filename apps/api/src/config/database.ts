import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production"
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState > 0) {
    await mongoose.disconnect();
  }
};
