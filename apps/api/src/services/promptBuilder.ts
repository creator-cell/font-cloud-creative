import type { GenerationType } from "../models/Generation.js";
import type { StyleCard } from "../models/BrandVoice.js";

export interface BuildPromptInput {
  type: GenerationType;
  inputs: Record<string, unknown>;
  styleCard?: StyleCard;
  claimsMode?: boolean;
}

export interface PromptBundle {
  system: string;
  user: string;
}

const TYPE_PROMPTS: Record<GenerationType, string> = {
  ad: `You must return JSON with keys headline (string), hook (string), body (string), hashtags (array of 3 short hashtag strings), cta (string).`,
  carousel: `Return JSON with slides (array). Each slide has title (string) and bullets (array of 2-4 short strings).`,
  blog: `Return JSON with headline (string), body (markdown string), seo (object with title, meta, keywords array).`
};

const serializeStyleCard = (styleCard?: StyleCard): string => {
  if (!styleCard) return "";
  const parts = [
    `Tone: ${styleCard.tone.join(", ")}`,
    `Cadence: ${styleCard.cadence}`,
    `Reading level: ${styleCard.readingLevel}`,
    `Power words to lean on: ${styleCard.powerWords.join(", ")}`,
    `Do use: ${styleCard.dos.join(", ")}`,
    `Avoid: ${styleCard.donts.join(", ")}`,
    `Taboo: ${styleCard.taboo.join(", ")}`,
    `Language: ${styleCard.language}`
  ];
  return parts.join("\n");
};

const formatInputs = (inputs: Record<string, unknown>): string =>
  JSON.stringify(inputs, null, 2);

export const buildPrompt = ({ type, inputs, styleCard, claimsMode }: BuildPromptInput): PromptBundle => {
  const baseSystem = `You are Front Cloud Creative, an advertising copywriter who never breaks brand-safety rules. You must answer with strict JSON and nothing else. If fields are missing, craft best-effort content. Never fabricate legal or regulatory claims.`;

  const styleSection = serializeStyleCard(styleCard);
  const typeSection = TYPE_PROMPTS[type];
  const claimsSection = claimsMode
    ? `If factual claims are made, include a claims field (array of objects with statement and evidence). Add warnings (array of strings) for any compliance concerns.`
    : `If you foresee compliance risks, populate warnings (array of strings). Otherwise warnings should be an empty array.`;

  const system = [baseSystem, styleSection].filter(Boolean).join("\n\n");

  const expectations = `Respond in JSON with keys: data (object), warnings (array of strings)${
    claimsMode ? ", claims (array)" : ""
  }. The data object must follow the structure described for this content type.`;

  const user = [
    `Content type: ${type}.`,
    typeSection,
    claimsSection,
    expectations,
    `Inputs provided by the user:\n${formatInputs(inputs)}`
  ].join("\n\n");

  return { system, user };
};
