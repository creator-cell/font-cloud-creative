import { Types } from "mongoose";
import { BrandVoiceModel, ProjectModel, type StyleCard } from "../models";

type BuildStyleCardInput = {
  samples: string[];
  language?: string;
};

const averageSentenceLength = (text: string): number => {
  const sentences = text.split(/[.!?]+/).map((sentence) => sentence.trim()).filter(Boolean);
  if (sentences.length === 0) return 0;
  const totalWords = sentences.reduce(
    (total, sentence) => total + sentence.split(/\s+/).filter(Boolean).length,
    0
  );
  return totalWords / sentences.length;
};

const detectTone = (samples: string[]): string[] => {
  const joined = samples.join(" ").toLowerCase();
  const tone: string[] = [];
  if (/[!]{2,}/.test(joined) || /excited|thrilled/.test(joined)) tone.push("enthusiastic");
  if (/professional|enterprise|solution/.test(joined)) tone.push("professional");
  if (/friendly|casual|hey|let's/.test(joined)) tone.push("friendly");
  if (tone.length === 0) tone.push("confident");
  return tone;
};

const harvestPowerWords = (samples: string[]): string[] => {
  const candidates = new Map<string, number>();
  const addWord = (word: string) => {
    const normalized = word.toLowerCase();
    if (normalized.length < 5) return;
    candidates.set(normalized, (candidates.get(normalized) ?? 0) + 1);
  };
  samples.forEach((sample) => {
    sample
      .split(/[^a-zA-Z]+/)
      .filter(Boolean)
      .forEach(addWord);
  });
  return Array.from(candidates.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

export const buildStyleCard = ({ samples, language = "en" }: BuildStyleCardInput): StyleCard => {
  const tone = detectTone(samples);
  const average = averageSentenceLength(samples.join(" "));
  const cadence = average < 12 ? "snappy" : average < 20 ? "conversational" : "in-depth";
  const readingLevel = average < 14 ? "Grade 8" : "Grade 10";
  const powerWords = harvestPowerWords(samples);

  return {
    tone,
    cadence,
    readingLevel,
    powerWords,
    taboo: [],
    dos: ["Lead with benefits", "Reference the brand voice"],
    donts: ["Overpromise results", "Use profanity"],
    language
  };
};

export const createBrandVoice = async (
  userId: string,
  projectId: string,
  styleCard: StyleCard
) => {
  const voice = await BrandVoiceModel.create({
    userId: new Types.ObjectId(userId),
    projectId: new Types.ObjectId(projectId),
    styleCard
  });

  await ProjectModel.findByIdAndUpdate(projectId, {
    $addToSet: { brandVoiceIds: voice._id }
  });

  return voice;
};
