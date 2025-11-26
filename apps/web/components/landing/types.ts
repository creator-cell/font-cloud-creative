import type { LucideIcon } from "lucide-react";

export type ContentFilter = "copy" | "product" | "social";

export interface StatsTile {
  label?: string;
  value?: string;
  title?: string;
  description?: string;
  Icon?: LucideIcon;
  color?: string;
}

export interface ContentFilterItem {
  id: ContentFilter;
  label: string;
}

export interface SpeedFeature {
  title: string;
  description: string;
  Icon?: LucideIcon;
  iconColor?: string;
  style?: React.CSSProperties;
}

export interface OrchestrateCard {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  Icon?: LucideIcon;
}

export interface CreationFeature {
  title: string;
  description: string;
  Icon?: LucideIcon;
}

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  priceValid?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  tookens?: string;
  month?: string;
  boundary?: string;
  Limitations?: string[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

export interface NewsroomAction {
  label: string;
  Icon?: LucideIcon;
}

export interface LandingTranslation {
  nav: { label: string; href: string }[];
  heroEyebrow: string;
  heroTitlePrimary: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroToken: string;
  heroCard: string;
  heroCancel: string;
  heroStats: StatsTile[];
  providerHeading: string;
  providerCreate: string;
  providerDescription: string;
  providerViewAll: string;
  providerAd: string;
  providerSocial: string;
  providerBlog: string;
  providerOpenAI: string;
  providerAnthropic: string;
  providerGoogle: string;
  providerOpenAIBadge?: string;
  providerAnthropicBadge?: string;
  providerComboBadge?: string;
  providerAllam: string;
  providerAllamBadge?: string;
  providerLabels: string[];
  speedTitle: string;
  speedTitleSecond: string;
  speedSubtitle: string;
  speedContent: string;
  speedReady: string;
  speedFeatures: SpeedFeature[];
  orchestrateTitle: string;
  orchestrateSubtitle: string;
  orchestrateCards: OrchestrateCard[];
  contentTitle: string;
  contentSubtitle: string;
  contentFilters: ContentFilterItem[];
  contentScenarios: Record<ContentFilter, string[]>;
  creationTitle: string;
  creationSubtitle: string;
  creationFeature: string;
  creationFeatures: CreationFeature[];
  newsroomTitle: string;
  newsroomSubtitle: string;
  newsroomActions: (NewsroomAction | string)[];
  newsroomHighlightTitle: string;
  newsroomHighlightBody: string;
  statsTiles: StatsTile[];
  pricingHead: string;
  pricingTitle: string;
  pricingSubtitle: string;
  pricingPlans: PricingPlan[];
  enterpriseTitle: string;
  enterpriseSubtitle: string;
  enterpriseCta: string;
  enterpriseCta2: string;
  enterpriseCtaPercentage?: string;
  enterpriseCtaSatisfaction?: string;
  enterpriseMil?: string;
  enterpriseGen?: string;
  finalCtaTitle: string;
  finalCtaTitle2: string;
  finalCtaSubtitle: string;
  finalPrimaryCta: string;
  finalSecondaryCta: string;
  finalSecondaryCtaPercentage?: string;
  finalSecondaryCtaSatisfaction?: string;
  finalMil?: string;
  finalGen?: string;
  finalData: string[];
  LimitedTime: string;
  LimitedDes: string;
  FAQTitle: string;
  FAQLeftOneTitle: string;
  FAQLeftTwoTitle: string;
  FAQLeftThreeTitle: string;
  FAQLeftFourTitle: string;
  FAQLeftRightDesc: string;
  FAQLeftRightDesc2: string;
  FAQLeftRightDesc3: string;
  FAQLeftRightDesc4: string;
  footerTagline: string;
  footerLegal: string;
  footerInputPlaceholder: string;
  footerBottomCta: string;
  footerLinks: Record<string, FooterLinkGroup>;
  finalSecondaryCta?: string;
}
