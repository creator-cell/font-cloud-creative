import {
  BarChart2,
  Globe,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
  Workflow,
  Zap,
  Shield,
} from "lucide-react";
import translationsEnJson from "./translations-en.json" assert { type: "json" };
import translationsArJson from "./translations-ar.json" assert { type: "json" };
import type { LandingTranslation, NewsroomAction, StatsTile } from "./types";

const iconMap = {
  Shield,
  Globe,
  Zap,
  Target,
  Workflow,
  Sparkles,
  BarChart2,
  MessageSquare,
  UsersRound,
  TrendingUp,
};

const mapIcon = (name?: string) => (name ? iconMap[name as keyof typeof iconMap] : undefined);

const withIcons = (raw: any): LandingTranslation => {
  const newsroomActions = (raw.newsroomActions ?? []).map((action: NewsroomAction | string) => {
    if (typeof action === "string") return action;
    const iconName = (action as any).Icon ?? (action as any).icon;
    return { ...(action as NewsroomAction), Icon: mapIcon(iconName) };
  });

  const mapTile = (tile: StatsTile): StatsTile => {
    const iconName = (tile as any).Icon ?? (tile as any).icon;
    return { ...tile, Icon: mapIcon(iconName) };
  };

  const pricingPlans = (raw.pricingPlans ?? []).map((plan: any) => ({
    ...plan,
    logo: mapIcon(plan.logo) ?? plan.logo,
  }));

  return {
    ...raw,
    newsroomActions,
    statsTiles: (raw.statsTiles ?? []).map(mapTile),
    pricingPlans,
  };
};

export const translations = {
  en: withIcons(translationsEnJson),
  ar: withIcons(translationsArJson),
} as const;
