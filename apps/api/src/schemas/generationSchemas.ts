import { z } from "zod";

export const providerIdSchema = z.enum(["openai", "anthropic", "google", "ollama"]);
export const generationTypeSchema = z.enum(["ad", "carousel", "blog"]);

const adSchema = z.object({
  headline: z.string(),
  hook: z.string(),
  body: z.string(),
  hashtags: z.array(z.string()).max(6),
  cta: z.string()
});

const carouselSchema = z.object({
  slides: z
    .array(
      z.object({
        title: z.string(),
        bullets: z.array(z.string()).min(2).max(5)
      })
    )
    .min(3)
    .max(7)
});

const blogSchema = z.object({
  headline: z.string(),
  body: z.string(),
  seo: z.object({
    title: z.string(),
    meta: z.string(),
    keywords: z.array(z.string()).min(3)
  })
});

const claimsSchema = z
  .array(
    z.object({
      statement: z.string(),
      evidence: z.string().optional()
    })
  )
  .optional();

export const generationDataSchema = {
  ad: adSchema,
  carousel: carouselSchema,
  blog: blogSchema
} as const;

export const getResponseSchema = (type: keyof typeof generationDataSchema) =>
  z.object({
    data: generationDataSchema[type],
    warnings: z.array(z.string()).default([]),
    claims: claimsSchema
  });

export const generateRequestSchema = z.object({
  type: generationTypeSchema,
  inputs: z.record(z.any()),
  projectId: z.string().optional(),
  styleCardId: z.string().optional(),
  provider: providerIdSchema.optional(),
  model: z.string().optional(),
  claimsMode: z.boolean().optional()
});
