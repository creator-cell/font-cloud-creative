import { z } from "zod";
import { providerIdSchema } from "./generationSchemas";

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
    ),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Enter a valid phone number with country code")
    .optional()
});

export const passwordLoginSchema = z.object({
  email: z.string().email().optional(),
  identifier: z.string().min(3, "Email or mobile number is required").optional(),
  password: z.string().min(1, "Password is required")
}).refine((data) => data.email || data.identifier, {
  message: "Email or mobile number is required",
  path: ["identifier"]
});

export const planSelectionSchema = z.object({
  plan: z.enum(["starter", "pro", "team"])
});

export const otpRequestSchema = z.object({
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Enter a valid phone number with country code")
});

export const otpVerifySchema = z.object({
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Enter a valid phone number with country code"),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit OTP code")
});
