import { z } from "zod";
import { providerIdSchema } from "./generationSchemas.js";

export const createTokenSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  plan: z.enum(["free", "starter", "pro", "team"]),
  preferredProvider: providerIdSchema.optional(),
  preferredModel: z.string().optional()
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  plan: z.enum(["free", "starter", "pro", "team"]).default("starter"),
  name: z
    .string()
    .min(1, "Name must be at least 1 character")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long")
    .max(128, "Password must be at most 128 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/,
      "Password must include upper & lower case letters, a number, and a special character."
    )
});

export const passwordLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required")
});

export const planSelectionSchema = z.object({
  plan: z.enum(["starter", "pro", "team"])
});
