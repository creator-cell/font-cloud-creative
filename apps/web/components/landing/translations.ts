import { CheckCircle2, Crown, Rocket, UsersRound, Zap } from "lucide-react";
export const translations = {
  en: {
    nav: [
      { label: "Product", href: "#product" },
      { label: "Solutions", href: "#solutions" },
      { label: "Pricing", href: "#pricing" },
      { label: "Resources", href: "#resources" },
    ],
    languageToggle: "العربية",
    heroEyebrow: "AI Content Operating System",
    heroTitlePrimary: "Create Content with",
    heroTitleHighlight: "Multi-AI Power",
    heroDescription:
      "Orchestrate OpenAI, Anthropic, Google, and private stacks. Generate ads, blogs, and updates ready to ship in minutes.",
    heroPrimaryCta: "Start free trial",
    heroSecondaryCta: "Watch demo",
    heroTertiaryCta: "Contact sales",
    heroStats: [
      { value: "10k+", label: "Assets shipped" },
      { value: "4.9", label: "Avg. team rating" },
      { value: "98.8%", label: "Workflow uptime" },
    ],
    providerHeading: "Every elite model in one workspace",
    providerDescription:
      "Blend creativity and governance by routing briefs across OpenAI, Anthropic, Google, and private stacks.",
    providerLabels: [
      "OpenAI GPT-4o",
      "Anthropic Claude",
      "Google Gemini",
      "Ollama Local",
    ],
    speedTitle: "From Idea to Content in 30 Seconds",
    speedSubtitle:
      "Multi-model Front Cloud Creative automates briefs, drafting, and approvals across every format.",
    speedFeatures: [
      {
        title: "Brief once. Sync everywhere.",
        description:
          "Centralize tone, compliance, and objectives so every asset stays brand-perfect.",
      },
      {
        title: "Generate multi-channel drafts",
        description:
          "Spin up landing pages, emails, and social variants simultaneously with unified intelligence.",
      },
      {
        title: "Review, approve, launch",
        description:
          "Collaborate with comments, assign reviewers, and publish to each channel in one click.",
      },
    ],
    orchestrateTitle: "Orchestrate Every Launch",
    orchestrateSubtitle:
      "Build campaign war rooms, assign duties, and monitor progress across teams and regions.",
    orchestrateCards: [
      {
        badge: "Campaign Control",
        title: "Command center for every rollout",
        description:
          "Timeline, assets, and owners in one view. Localize messaging without losing alignment.",
        bullets: [
          "Smart briefs & timelines",
          "Approval routing",
          "Localization insights",
        ],
      },
      {
        badge: "AI Collaboration",
        title: "Train every model on your voice",
        description:
          "Combine structured prompts and memory to keep tone consistent across providers.",
        bullets: [
          "Reusable style guides",
          "Compliance guardrails",
          "Live previews",
        ],
      },
    ],
    contentTitle: "Generate Any Content Type",
    contentSubtitle:
      "Pick a scenario. Front Cloud Creative orchestrates the ideal AI workflow instantly.",
    contentFilters: [
      { id: "copy", label: "Marketing Copy" },
      { id: "product", label: "Product Updates" },
      { id: "social", label: "Social Campaigns" },
    ],
    contentScenarios: {
      copy: [
        "Launch-ready landing pages",
        "Lifecycle emails optimized for activation",
        "Executive-ready press releases",
      ],
      product: [
        "Release notes for multiple audiences",
        "Knowledge base articles with modular sections",
        "In-app announcements localized automatically",
      ],
      social: [
        "Cross-network social calendars",
        "Paid ad variants in every language",
        "Video scripts aligned to brand story",
      ],
    },
    creationTitle: "Everything You Need to Create Amazing Content",
    creationSubtitle:
      "From brand guardrails to analytics, orchestrate sophisticated AI workflows without losing control.",
    creationFeatures: [
      {
        title: "Multi-AI Access",
        description:
          "Choose from OpenAI GPT-4, Claude 3.5, Gemini Pro, and local Ollama models for the best results.",
      },
      {
        title: "Brand Voice",
        description:
          "Define your unique brand personality and ensure consistent tone across all generated content.",
      },
      {
        title: "Smart Generation",
        description:
          "Generate ads, blog posts, and social media carousels optimized for engagement and conversion.",
      },
      {
        title: "Team Collaboration",
        description:
          "Work together with your team on projects with shared brand voices and content libraries.",
      },
      {
        title: "Analytics & Insights",
        description:
          "Track performance, usage, and ROI with detailed analytics and reporting.",
      },
      {
        title: "API Access",
        description:
          "Integrate our AI capabilities directly into your applications with our developer-friendly API.",
      },
    ],
    newsroomTitle: "Everything you need in one platform",
    newsroomSubtitle:
      "Plan launches, activate campaigns, and publish daily updates without switching tools.",
    newsroomActions: [
      "Content Calendar",
      "Campaign Playbooks",
      "Asset Library",
      "QA Checklists",
    ],
    newsroomHighlightTitle: "Transform your daily content runtime",
    newsroomHighlightBody:
      "Centralize approvals, generate localized variants, and align your entire team on the same story.",
    statsTiles: [
      { value: "10k+", label: "Teams launched" },
      { value: "4.9", label: "Average rating" },
      { value: "98.8%", label: "Workflow uptime" },
    ],
    pricingTitle: "Choose Your Plan",
    pricingSubtitle:
      "Start free or scale with multi-model orchestration built for modern teams.",
    pricingPlans: [
      {
        id: "free",
        title: "Free", 
        price: "Free",
        description: "Perfect for getting started",
        features: ["Basic AI models", "Watermarked outputs", "Up to 5 projects","Community support"],
        cta: "Get Started",
        popular: false,
        logo: Zap,
        logoProps: { className: "w-11 h-11 text-gray-500 bg-[#f0f0f2] p-2.5 rounded-lg item-center mx-auto" },
        tookens:"15K",
        Limitations:["Watermarked content"," Basic models only"," Limited projects"]
      },
      {
        id: "starter",
        title: "Starter",
        price: "$29",
        description: "For individual creators",
        features: ["All AI providers", "No watermarks", "Up to 25 projects","Priority support","Brand voice builder","Usage analytics"],
        cta: "Upgrade",
        popular: true,
        priceValid:"/month",
        logo: Rocket,
        logoProps: { className: "w-11 h-11 text-[#2b80ff] bg-[#e8f2ff] p-2.5 rounded-lg item-center mx-auto" },
        tookens:"300K"
      },
      {
        id: "pro",
        title: "Pro",
        price: "$79",
        description: "For growing businesses",
        features: ["Premium models", "Local models (Ollama)", "Up to 100 projects","Custom brand voices","API access","Advanced analytics","Priority support"],
        cta: "Upgrade",
        popular: false,
        priceValid:"/month",
        logo: Crown,
        logoProps: { className: "w-11 h-11 text-[#ab45ff] bg-[#f7edff] p-2.5 rounded-lg item-center mx-auto" },
        tookens:"1,000K ",
       
      },
      {
        id: "team",
        title: "Team",
        price: "$199",
        description: "For teams and agencies",
        features: ["Everything in Pro", "Team Collaboration", "Custom AI models","Unlimited projects","White-label options","Dedicated support","Custom integrations"],
        cta: "Upgrade",
        popular: false,
        priceValid:"/month",
        logo: UsersRound,
        logoProps: { className: "w-11 h-11 text-[#00bd7e] bg-[#e6faf3] p-2.5 rounded-lg item-center mx-auto" },
        tookens:"3,000K"
      }
    ],
    enterpriseTitle: "Enterprise Solution",
    enterpriseSubtitle:
      "Need custom AI models, dedicated infrastructure, or special compliance requirements? We offer tailored enterprise solutions.",
    enterpriseCta: "Schedule Demo",
    enterpriseCta2: "Contact Sales",
    finalCtaTitle: "Ready to Transform Your Content Creation?",
    finalCtaSubtitle:
      "Join marketing teams orchestrating AI workflows with Front Cloud Creative.",
    finalPrimaryCta: "Start free trial",
    finalSecondaryCta: "Schedule a walkthrough",
    footerTagline: "The most powerful AI content platform with access to OpenAI, Anthropic, Google, and Ollama in one subscription.",
    footerLinks: {
      product: {
        heading: "Product",
        links: [
          { label: "Features", href: "#" },
          { label: "Pricing", href: "#" },
          { label: "Generators", href: "#" },
          { label: "Integrations", href: "#" },
          { label: "Templates", href: "#" },
        ]
      },
       company: {
        heading: "Company",
        links: [
          { label: "About Us", href: "#" },
          { label: "Careers", href: "#" },
          { label: "Blog", href: "#" },
          { label: "Contact", href: "#" }
        ]
      },
      Support: {
        heading: "Support",
        links: [
          { label: "Help Center", href: "#" },
          { label: "Documentation", href: "#" },
          { label: "Status Page", href: "#" }
        ]
      },
      
      Legal: {
        heading: "Legal",
        links: [
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
          { label: "Cookie Policy", href: "#" }
        ]
      },
     
    },
    footerLegal: "© " + new Date().getFullYear() + " Front Cloud Creative. All rights reserved.",
    footerBottomCta: "Subscribe",
    footerInputPlaceholder: "Enter your email"
  },
  ar: {
    nav: [
      { label: "المنتج", href: "#product" },
      { label: "الحلول", href: "#solutions" },
      { label: "الأسعار", href: "#pricing" },
      { label: "المصادر", href: "#resources" },
    ],
    languageToggle: "English",
    heroEyebrow: "نظام تشغيل المحتوى بالذكاء الاصطناعي",
    heroTitlePrimary: "أنشئ المحتوى بقوة",
    heroTitleHighlight: "الذكاء المتعدد",
    heroDescription:
      "نسّق نماذج OpenAI وAnthropic وGoogle وبيئتك الخاصة. أطلق الإعلانات والمدونات والتحديثات في دقائق.",
    heroPrimaryCta: "ابدأ التجربة المجانية",
    heroSecondaryCta: "شاهد العرض",
    heroTertiaryCta: "تواصل مع المبيعات",
    heroStats: [
      { value: "+10k", label: "أصول منشورة" },
      { value: "4.9", label: "تقييم الفرق" },
      { value: "98.8%", label: "جاهزية المسارات" },
    ],
    providerHeading: "جميع النماذج الرائدة في مساحة واحدة",
    providerDescription:
      "ادمج الإبداع والحَوْكمة عبر توجيه الموجزات لأفضل نموذج لكل مهمة.",
    providerLabels: [
      "OpenAI GPT-4o",
      "Anthropic Claude",
      "Google Gemini",
      "Ollama Local",
    ],
    speedTitle: "من الفكرة إلى المحتوى في 30 ثانية",
    speedSubtitle:
      "يؤتمت Front Cloud Creative متعدد النماذج الموجزات والكتابة والموافقات لكل تنسيق.",
    speedFeatures: [
      {
        title: "موجز واحد. مزامنة كاملة.",
        description:
          "اجمع النبرة والالتزام والأهداف ليبقى كل أصل متوافقًا مع العلامة.",
      },
      {
        title: "مسودات متعددة القنوات",
        description:
          "أنشئ صفحات هبوط ورسائل بريد ومنشورات اجتماعية في وقت واحد.",
      },
      {
        title: "راجع واعتمد وأطلق",
        description:
          "تعاون بالتعليقات، ووزع المسؤوليات، وانشر لكل قناة بضغطة واحدة.",
      },
    ],
    orchestrateTitle: "نسّق كل إطلاق",
    orchestrateSubtitle:
      "ابن مراكز تحكم للحملات، ووزع المهام، وراقب التقدم عبر الفرق والمناطق.",
    orchestrateCards: [
      {
        badge: "إدارة الحملات",
        title: "مركز قيادة لكل إطلاق",
        description:
          "الجدول الزمني والأصول والمسؤولون في واجهة واحدة. خصص الرسائل دون فقدان الاتساق.",
        bullets: ["موجزات وجداول ذكية", "مسارات اعتماد", "رؤى التوطين"],
      },
      {
        badge: "تعاون ذكي",
        title: "درّب كل نموذج على صوتك",
        description:
          "ادمج الموجهات والذاكرة للحفاظ على النبرة بين مقدمي الخدمة.",
        bullets: [
          "أدلة صوت قابلة لإعادة الاستخدام",
          "حواجز امتثال",
          "معاينات مباشرة",
        ],
      },
    ],
    contentTitle: "أنشئ أي نوع من المحتوى",
    contentSubtitle:
      "اختر سيناريو وسيقترح Front Cloud Creative أنسب مسار ذكاء تلقائيًا.",
    contentFilters: [
      { id: "copy", label: "نسخ تسويقية" },
      { id: "product", label: "تحديثات المنتج" },
      { id: "social", label: "حملات اجتماعية" },
    ],
    contentScenarios: {
      copy: [
        "صفحات هبوط جاهزة للإطلاق",
        "رسائل بريد مرحلية موجهة للتفعيل",
        "بيانات صحفية بنبرة تنفيذية",
      ],
      product: [
        "ملاحظات إصدار تلائم جماهير مختلفة",
        "مقالات قاعدة المعرفة بوحدات مرنة",
        "إشعارات داخل التطبيق مترجمة تلقائيًا",
      ],
      social: [
        "جداول اجتماعية متعددة الشبكات",
        "إعلانات مدفوعة بلغات متعددة",
        "نصوص فيديو متسقة مع قصة العلامة",
      ],
    },
    creationTitle: "كل ما تحتاجه لإنشاء محتوى مذهل",
    creationSubtitle:
      "من حواجز الهوية إلى التحليلات، نسّق مسارات ذكاء متقدمة دون فقدان التحكم.",
    creationFeatures: [
      {
        title: "وصول إلى نماذج متعددة",
        description:
          "بدّل بين GPT-4o وClaude وGemini والنماذج الخاصة في ثوانٍ.",
      },
      {
        title: "مسارات عمل منظمة",
        description: "أتمتة الموجزات والكتابة وضمان الجودة والنشر عبر الفرق.",
      },
      {
        title: "قفل الهوية",
        description:
          "فرض النبرة والرسائل والامتثال بقوالب قابلة لإعادة الاستخدام.",
      },
      {
        title: "لوحة تحليلات",
        description: "تتبع سرعة المحتوى والموافقات وأداء التوطين.",
      },
      {
        title: "تعاون لحظي",
        description: "علّق، وعيّن المسؤولين، وتحرير مشترك في مساحة واحدة.",
      },
      {
        title: "استضافة خاصة",
        description: "حافظ على سرية المشاريع الحساسة داخل بنية آمنة.",
      },
    ],
    newsroomTitle: "كل ما تحتاجه في منصة واحدة",
    newsroomSubtitle:
      "خطط الإطلاقات ونشط الحملات وانشر التحديثات اليومية دون تغيير الأدوات.",
    newsroomActions: [
      "تقويم المحتوى",
      "كتيبات الحملات",
      "مكتبة الأصول",
      "قوائم الجودة",
    ],
    newsroomHighlightTitle: "حوّل روتين المحتوى اليومي",
    newsroomHighlightBody:
      "اجمع الموافقات وأنشئ نسخًا محلية ونسّق الفريق كله حول نفس القصة.",
    statsTiles: [
      { value: "+10k", label: "فرق أطلقت الحملات" },
      { value: "4.9", label: "متوسط التقييم" },
      { value: "98.8%", label: "جاهزية المسارات" },
    ],
    pricingTitle: "اختر خطتك",
    pricingSubtitle:
      "ابدأ مجانًا أو توسع مع تنسيق نماذج متعدد مصمم للفرق الحديثة.",
    pricingPlans: [
      {
        id: "free",
        title: "مجاني",
        price: "Free",
        description: "جرّب المسارات وتعاون مع زميل واحد.",
        features: [
          "حتى 10 مشاريع",
          "موجهات وقوالب مشتركة",
          "تصدير بعلامة مائية",
        ],
        cta: "ابدأ مجانًا",
        popular: false,
      },
      {
        id: "starter",
        title: "ابدأ",
        price: "29",
        description: "للمسوقين المستقلين الذين يحتاجون لمخرجات ثابتة.",
        features: [
          "مشاريع غير محدودة",
          "تبديل بين النماذج",
          "بطاقات صوت العلامة",
        ],
        cta: "ابدأ فترة تجريبية",
        popular: true,
      },
      {
        id: "pro",
        title: "احترافي",
        price: "79",
        description: "لفرق التطوير التي توحّد الحملات عبر القنوات.",
        features: ["مساحات عمل تعاونية", "أتمتة المسارات", "تحليلات متقدمة"],
        cta: "طوّر الخطة",
        popular: false,
      },
      {
        id: "team",
        title: "فريق",
        price: "189",
        description:
          "للوكالات أو المؤسسات التي تحتاج للحَوْكمة وSSO والاستضافة الخاصة.",
        features: ["يشمل 5 مقاعد", "SSO وSCIM", "شريك نجاح مخصص"],
        cta: "تواصل مع المبيعات",
        popular: false,
      },
    ],
    enterpriseTitle: "حل المؤسسات",
    enterpriseSubtitle:
      "تحتاج إلى حوكمة مخصصة أو استضافة معزولة أو نماذج خاصة؟ نوفر لك بيئة مخصصة.",
    enterpriseCta: "احجز عرض المؤسسات",
    finalCtaTitle: "جاهز لتحويل إنشاء المحتوى؟",
    finalCtaSubtitle:
      "انضم لفرق التسويق التي تنسق مسارات الذكاء مع Front Cloud Creative.",
    finalPrimaryCta: "ابدأ التجربة المجانية",
    finalSecondaryCta: "احجز جلسة تعريف",
    footerTagline: "منصة محتوى ذكية للفرق الحديثة.",
    footerLinks: {
      product: {
        heading: "المنتج",
        links: [
          { label: "نظرة عامة", href: "#" },
          { label: "القوالب", href: "#" },
          { label: "التكاملات", href: "#" },
          { label: "الأمان", href: "#" },
        ],
      },
      resources: {
        heading: "المصادر",
        links: [
          { label: "المدونة", href: "#" },
          { label: "الندوات", href: "#" },
          { label: "مركز المساعدة", href: "#" },
          { label: "حالة الخدمة", href: "#" },
        ],
      },
      company: {
        heading: "الشركة",
        links: [
          { label: "من نحن", href: "#" },
          { label: "الوظائف", href: "#" },
          { label: "الشركاء", href: "#" },
          { label: "تواصل", href: "#" },
        ],
      },
    },
    footerLegal:
      "© " +
      new Date().getFullYear() +
      " Front Cloud Creative. جميع الحقوق محفوظة.",
    footerBottomCta: "اشترك في النشرة",
    footerInputPlaceholder: "أدخل بريدك الإلكتروني",
  },
} as const;
