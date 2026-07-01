import type { ContractTemplate, TemplateField, DocFormat } from "./types";

export type { DocFormat } from "./types";

// Reusable field presets ------------------------------------------------------
const revisions = (def = "2"): TemplateField => ({
  key: "revisions",
  label: "Revision rounds included",
  type: "number",
  default: def,
  hint: "Cap revisions to avoid unpaid extra work.",
});
const notice = (def = "14"): TemplateField => ({
  key: "noticePeriodDays",
  label: "Termination notice (days)",
  type: "number",
  default: def,
});
const monthlyHours = (label = "Hours per month", def = "20"): TemplateField => ({
  key: "monthlyHours",
  label,
  type: "number",
  default: def,
});

/**
 * The built-in premium template library. Each template is ready to use — the
 * user fills a few fields and gets a complete, professional contract instantly.
 */
export const TEMPLATES: ContractTemplate[] = [
  // ── Development ──────────────────────────────────────────────────────────
  {
    id: "web-development",
    name: "Website Development Agreement",
    category: "Development",
    icon: "code",
    tagline: "Full website build with clear scope, milestones, and IP transfer.",
    popular: true,
    workType: "Web Development",
    paymentSchedule: "split_50_50",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will design and develop a responsive website for the Client, including {{pages}} pages, mobile and desktop layouts, basic on-page SEO, and a contact form. The build uses {{techStack}}. Hosting and domain are {{hosting}}.",
    fields: [
      { key: "pages", label: "Number of pages", type: "number", default: "5" },
      { key: "techStack", label: "Tech stack", type: "text", placeholder: "Next.js + Tailwind", default: "modern web technologies" },
      { key: "hosting", label: "Hosting & domain", type: "select", default: "provided by the Client",
        options: [
          { value: "provided by the Client", label: "Client provides" },
          { value: "arranged by the Freelancer and billed at cost", label: "Freelancer arranges" },
        ] },
      revisions("2"),
      notice(),
    ],
    extraClauses: [
      { title: "Browser & Device Support", body: "<p>The website will be tested and function correctly on the latest versions of major browsers (Chrome, Safari, Firefox, Edge) and on common mobile and desktop screen sizes.</p>" },
    ],
  },
  {
    id: "mobile-app",
    name: "Mobile App Development",
    category: "Development",
    icon: "smartphone",
    tagline: "iOS / Android app build with store-submission terms.",
    workType: "Web Development",
    paymentSchedule: "milestone",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will design and develop a mobile application for {{platforms}}, covering the agreed feature set and screens. Deliverables include source code, build files, and basic documentation. App store submission is {{appStore}}.",
    fields: [
      { key: "platforms", label: "Platforms", type: "select", default: "iOS and Android",
        options: [
          { value: "iOS", label: "iOS only" },
          { value: "Android", label: "Android only" },
          { value: "iOS and Android", label: "iOS + Android" },
        ] },
      { key: "appStore", label: "App store submission", type: "select", default: "included",
        options: [
          { value: "included", label: "Included" },
          { value: "handled by the Client", label: "Client handles" },
        ] },
      revisions("2"),
      notice("30"),
    ],
  },

  // ── Design ───────────────────────────────────────────────────────────────
  {
    id: "ui-ux-design",
    name: "UI/UX Design Contract",
    category: "Design",
    icon: "palette",
    tagline: "Product/app design with deliverables and revision caps.",
    popular: true,
    workType: "UI/UX Design",
    paymentSchedule: "split_50_50",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will deliver UI/UX design for {{screens}} screens, including wireframes, high-fidelity mockups, and an interactive prototype. Source files will be shared in {{designTool}}. Deliverables: {{deliverables}}.",
    fields: [
      { key: "screens", label: "Number of screens", type: "number", default: "10" },
      { key: "designTool", label: "Design tool", type: "text", default: "Figma" },
      { key: "deliverables", label: "Deliverables", type: "text", default: "wireframes, mockups, prototype, design system", wide: true },
      revisions("3"),
      notice(),
    ],
  },
  {
    id: "logo-branding",
    name: "Logo & Brand Identity",
    category: "Design",
    icon: "sparkles",
    tagline: "Logo, brand kit, and full usage rights on payment.",
    workType: "UI/UX Design",
    paymentSchedule: "split_50_50",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will create a logo and brand identity for the Client, presenting {{concepts}} initial concept(s). The final package includes the logo in {{formats}}, a color palette, and typography guidance.",
    fields: [
      { key: "concepts", label: "Initial concepts", type: "number", default: "3" },
      { key: "formats", label: "Final file formats", type: "text", default: "SVG, PNG, and PDF" },
      { key: "usageRights", label: "Usage rights", type: "select", default: "full commercial rights on full payment",
        options: [
          { value: "full commercial rights on full payment", label: "Full commercial rights" },
          { value: "limited rights as specified", label: "Limited rights" },
        ] },
      revisions("3"),
      notice(),
    ],
  },
  {
    id: "graphic-design",
    name: "Graphic Design Services",
    category: "Design",
    icon: "image",
    tagline: "Social graphics, marketing collateral, and print-ready files.",
    workType: "UI/UX Design",
    paymentSchedule: "split_50_50",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will design the following graphic deliverables for the Client: {{deliverables}}. Files will be provided in web and print-ready formats as appropriate.",
    fields: [
      { key: "deliverables", label: "Deliverables", type: "textarea", default: "10 social media graphics, 1 banner set, and 1 flyer", wide: true },
      revisions("2"),
      notice(),
    ],
  },

  // ── Content & Media ──────────────────────────────────────────────────────
  {
    id: "content-writing",
    name: "Content Writing Agreement",
    category: "Content & Media",
    icon: "pen",
    tagline: "Articles & copy with word counts and SEO options.",
    workType: "Content Writing",
    paymentSchedule: "split_50_50",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will write {{articles}} piece(s) of content totaling approximately {{words}} words on topics agreed with the Client. Content will be original, plagiarism-free, and {{seo}}.",
    fields: [
      { key: "articles", label: "Number of pieces", type: "number", default: "4" },
      { key: "words", label: "Approx. total words", type: "number", default: "4000" },
      { key: "seo", label: "SEO optimization", type: "select", default: "optimized for search where relevant",
        options: [
          { value: "optimized for search where relevant", label: "SEO-optimized" },
          { value: "written without specific SEO requirements", label: "No SEO" },
        ] },
      revisions("2"),
      notice(),
    ],
  },
  {
    id: "photography",
    name: "Photography Services",
    category: "Content & Media",
    icon: "camera",
    tagline: "Shoots with deliverables, usage rights, and shoot dates.",
    workType: "Photography",
    paymentSchedule: "split_50_50",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will provide photography services on {{shootDate}} for approximately {{hours}} hour(s). Deliverables: {{deliverables}}. The Client receives {{usageRights}}.",
    fields: [
      { key: "shootDate", label: "Shoot date", type: "date" },
      { key: "hours", label: "Shoot hours", type: "number", default: "3" },
      { key: "deliverables", label: "Deliverables", type: "text", default: "40 professionally edited high-resolution photos", wide: true },
      { key: "usageRights", label: "Usage rights", type: "select", default: "a personal and commercial usage license",
        options: [
          { value: "a personal and commercial usage license", label: "Personal + commercial" },
          { value: "a personal-use license only", label: "Personal use only" },
        ] },
      notice(),
    ],
  },
  {
    id: "videography",
    name: "Video Production & Editing",
    category: "Content & Media",
    icon: "video",
    tagline: "Filming/editing with run-time, revisions, and raw-footage terms.",
    workType: "Video Editing",
    paymentSchedule: "split_50_50",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will produce and edit a final video of approximately {{length}}, including color grading and audio mixing. Deliverables: {{deliverables}}. Raw footage is {{rawFootage}}.",
    fields: [
      { key: "length", label: "Final video length", type: "text", default: "2–3 minutes" },
      { key: "deliverables", label: "Deliverables", type: "text", default: "1 final edited video in 1080p and a 60-second cut", wide: true },
      { key: "rawFootage", label: "Raw footage", type: "select", default: "retained by the Freelancer",
        options: [
          { value: "retained by the Freelancer", label: "Freelancer keeps raw" },
          { value: "delivered to the Client on request", label: "Delivered to client" },
        ] },
      revisions("2"),
      notice(),
    ],
  },

  // ── Marketing ────────────────────────────────────────────────────────────
  {
    id: "social-media",
    name: "Social Media Management",
    category: "Marketing",
    icon: "megaphone",
    tagline: "Monthly retainer for content, scheduling, and reporting.",
    popular: true,
    workType: "Social Media",
    paymentSchedule: "monthly_retainer",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will manage the Client's social media on {{platforms}}, producing {{posts}} posts per month, scheduling content, engaging with the community, and providing {{reporting}} performance reports.",
    fields: [
      { key: "platforms", label: "Platforms", type: "text", default: "Instagram, Facebook, and LinkedIn", wide: true },
      { key: "posts", label: "Posts per month", type: "number", default: "16" },
      monthlyHours("Hours per month", "20"),
      { key: "reporting", label: "Reporting frequency", type: "select", default: "monthly",
        options: [
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
        ] },
      notice("30"),
    ],
    extraClauses: [
      { title: "Retainer & Renewal", body: "<p>This is a recurring monthly retainer covering {{monthlyHours}} hours per month. Unused hours do not roll over. The retainer renews automatically each month until either party gives notice.</p>" },
    ],
  },
  {
    id: "seo-services",
    name: "SEO Services Agreement",
    category: "Marketing",
    icon: "search",
    tagline: "Ongoing SEO retainer with targets and reporting.",
    workType: "Consulting",
    paymentSchedule: "monthly_retainer",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will provide monthly SEO services including technical audits, on-page optimization, and content guidance targeting approximately {{keywords}} priority keywords, with {{reporting}} reporting.",
    fields: [
      { key: "keywords", label: "Target keywords", type: "number", default: "15" },
      monthlyHours("Hours per month", "15"),
      { key: "reporting", label: "Reporting frequency", type: "select", default: "monthly",
        options: [{ value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }] },
      notice("30"),
    ],
    extraClauses: [
      { title: "Results Disclaimer", body: "<p>SEO outcomes depend on factors outside the Freelancer's control (search-engine algorithms, competition). The Freelancer commits to best-practice work but does not guarantee specific rankings or traffic figures.</p>" },
    ],
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing Retainer",
    category: "Marketing",
    icon: "trending-up",
    tagline: "Multi-channel marketing with managed ad spend.",
    workType: "Consulting",
    paymentSchedule: "monthly_retainer",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will manage the Client's digital marketing across {{channels}}, including campaign strategy, execution, and optimization, for approximately {{monthlyHours}} hours per month. Ad budget is managed separately and paid directly by the Client.",
    fields: [
      { key: "channels", label: "Channels", type: "text", default: "Google Ads, Meta Ads, and email", wide: true },
      monthlyHours("Hours per month", "25"),
      notice("30"),
    ],
    extraClauses: [
      { title: "Advertising Spend", body: "<p>Advertising budgets are separate from the Freelancer's fee and are paid directly by the Client to the relevant platforms. The Freelancer manages but does not fund ad spend.</p>" },
    ],
  },

  // ── Business ─────────────────────────────────────────────────────────────
  {
    id: "consulting",
    name: "Consulting & Advisory",
    category: "Business",
    icon: "lightbulb",
    tagline: "Advisory engagement, hourly or fixed scope.",
    workType: "Consulting",
    paymentSchedule: "split_50_50",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will provide consulting and advisory services to the Client in their area of expertise, covering: {{deliverables}}. Estimated effort is approximately {{hoursEstimate}} hours.",
    fields: [
      { key: "deliverables", label: "Engagement scope / deliverables", type: "textarea", default: "strategy sessions, written recommendations, and follow-up support", wide: true },
      { key: "hoursEstimate", label: "Estimated hours", type: "number", default: "20" },
      notice(),
    ],
  },
  {
    id: "virtual-assistant",
    name: "Virtual Assistant Agreement",
    category: "Business",
    icon: "headset",
    tagline: "Ongoing VA support with weekly hours and task scope.",
    workType: "General Services",
    paymentSchedule: "monthly_retainer",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will provide virtual assistance for approximately {{weeklyHours}} hours per week, covering: {{tasks}}. The Freelancer will be available during {{availability}}.",
    fields: [
      { key: "weeklyHours", label: "Hours per week", type: "number", default: "10" },
      { key: "tasks", label: "Tasks / scope", type: "textarea", default: "inbox and calendar management, research, and data entry", wide: true },
      { key: "availability", label: "Availability", type: "text", default: "agreed working hours, Monday to Friday" },
      notice("14"),
    ],
  },
  {
    id: "retainer-general",
    name: "Monthly Retainer Agreement",
    category: "Business",
    icon: "repeat",
    tagline: "Flexible recurring retainer for any service.",
    workType: "General Services",
    paymentSchedule: "monthly_retainer",
    fillMinutes: 2,
    scopeDefault:
      "The Freelancer will provide ongoing services to the Client under a monthly retainer covering approximately {{monthlyHours}} hours per month. Scope: {{retainerScope}}.",
    fields: [
      monthlyHours("Hours per month", "20"),
      { key: "retainerScope", label: "Retainer scope", type: "textarea", default: "agreed ongoing tasks and priority support", wide: true },
      { key: "rollover", label: "Unused hours", type: "select", default: "do not roll over to the next month",
        options: [
          { value: "do not roll over to the next month", label: "No rollover" },
          { value: "roll over for one month", label: "Roll over 1 month" },
        ] },
      notice("30"),
    ],
    omitRevisions: true,
    extraClauses: [
      { title: "Retainer Terms", body: "<p>The retainer covers {{monthlyHours}} hours per month, billed at the start of each month. Unused hours {{rollover}}. Work beyond the retainer is agreed in writing and billed separately.</p>" },
    ],
  },

  // ── Legal ────────────────────────────────────────────────────────────────
  {
    id: "nda",
    name: "Non-Disclosure Agreement (NDA)",
    category: "Legal",
    icon: "lock",
    tagline: "Protect confidential information — one-way or mutual.",
    popular: true,
    workType: "General Services",
    paymentSchedule: "full_upfront",
    fillMinutes: 1,
    omitPayment: true,
    omitRevisions: true,
    scopeLabel: "Purpose of Disclosure",
    scopeDefault:
      "The parties wish to explore {{purpose}} and will share confidential information for that purpose. This {{mutual}} agreement protects that information.",
    fields: [
      { key: "purpose", label: "Purpose", type: "textarea", default: "a potential working relationship", wide: true },
      { key: "mutual", label: "Type", type: "select", default: "mutual",
        options: [{ value: "mutual", label: "Mutual (both share)" }, { value: "one-way", label: "One-way" }] },
      { key: "durationMonths", label: "Confidentiality period (months)", type: "number", default: "24" },
      { key: "jurisdiction", label: "Governing jurisdiction", type: "text", placeholder: "e.g. Pakistan" },
      notice("14"),
    ],
    extraClauses: [
      { title: "Definition of Confidential Information", body: "<p>“Confidential Information” means any non-public information disclosed by one party to the other, in any form, that is marked confidential or would reasonably be understood to be confidential, including business plans, technical data, designs, and customer information.</p>" },
      { title: "Obligations", body: "<p>The receiving party shall: (a) keep the Confidential Information strictly confidential; (b) use it only for the stated purpose; (c) not disclose it to third parties without prior written consent; and (d) protect it with at least the same care it uses for its own confidential information.</p>" },
      { title: "Exclusions", body: "<p>Confidential Information does not include information that is or becomes public through no fault of the receiving party, was lawfully known beforehand, or is independently developed without use of the disclosed information.</p>" },
      { title: "Duration & Return", body: "<p>The confidentiality obligations remain in effect for <strong>{{durationMonths}} months</strong> from the date of disclosure. On request, the receiving party will return or destroy all Confidential Information.</p>" },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // PREMIUM LIBRARY — in-depth templates with rich, guided inputs.
  // ════════════════════════════════════════════════════════════════════════

  // ── Premium · Development ────────────────────────────────────────────────
{
  id: "saas-mvp", name: "SaaS MVP Development Agreement", category: "Development",
  icon: "server", tagline: "Ship a launch-ready SaaS MVP with auth, billing, and a working core feature set.",
  popular: true, workType: "Web Development", paymentSchedule: "milestone", fillMinutes: 4,
  scopeDefault: "The Freelancer will design, build, and deploy a Minimum Viable Product for {{projectTitle}} using {{techStack}}, including {{authMethod}} authentication, a user dashboard, and the following core features: {{coreFeatures}}. Billing will be handled via {{billingProvider}} and the application will be deployed to {{hostingPlatform}}. The MVP targets readiness for approximately {{userTarget}} early users and excludes any feature not expressly listed in this Agreement.",
  fields: [
    { key: "techStack", label: "Tech stack", type: "text", placeholder: "Next.js, Postgres, Prisma", default: "Next.js, Postgres, and Prisma", required: true, wide: true, hint: "Frameworks, database, and key libraries the MVP will be built on." },
    { key: "coreFeatures", label: "Core features in scope", type: "textarea", placeholder: "List the must-have features for launch", required: true, wide: true, hint: "Be specific — anything not listed here is out of scope and billable separately." },
    { key: "authMethod", label: "Authentication", type: "select", default: "email & password with social login", required: true, options: [{ value: "email & password", label: "Email & password" }, { value: "email & password with social login", label: "Email + social login" }, { value: "passwordless (magic link)", label: "Passwordless / magic link" }, { value: "single sign-on (SSO)", label: "Enterprise SSO" }] },
    { key: "billingProvider", label: "Billing & subscriptions", type: "select", default: "Stripe", options: [{ value: "Stripe", label: "Stripe" }, { value: "Paddle", label: "Paddle" }, { value: "Lemon Squeezy", label: "Lemon Squeezy" }, { value: "no billing in this phase", label: "None this phase" }] },
    { key: "hostingPlatform", label: "Deployment target", type: "select", default: "Vercel", options: [{ value: "Vercel", label: "Vercel" }, { value: "AWS", label: "AWS" }, { value: "Railway", label: "Railway" }, { value: "the Client's existing infrastructure", label: "Client infrastructure" }] },
    { key: "userTarget", label: "Target early users", type: "number", default: "100", hint: "Approximate scale the MVP is built to handle — not a performance guarantee." },
    { key: "milestoneCount", label: "Number of milestones", type: "number", default: "3" },
    { key: "designSource", label: "Design source", type: "select", default: "Freelancer designs from scratch", options: [{ value: "Freelancer designs from scratch", label: "Freelancer designs UI" }, { value: "Client provides Figma designs", label: "Client provides Figma" }, { value: "a pre-built UI component library", label: "Component library" }] },
    { key: "launchDate", label: "Target launch date", type: "date", hint: "Subject to timely Client feedback and content delivery." },
    { key: "postLaunchSupport", label: "Post-launch support window", type: "text", default: "14 days of bug fixes", placeholder: "e.g. 14 days of bug fixes" }
  ],
  extraClauses: [
    { title: "Definition of MVP & Scope Boundary", body: "<p>An <strong>MVP</strong> under this Agreement is a functional product limited to the core features listed above. Features, integrations, or enhancements not expressly listed are out of scope and will be quoted as a separate change order. The Freelancer is not obligated to build for scale, edge cases, or user volumes materially beyond {{userTarget}} users in this engagement.</p>" },
    { title: "Milestone Acceptance", body: "<p>Work is delivered across {{milestoneCount}} milestones per the {{scheduleLabel}} schedule. Each milestone is deemed accepted if the Client does not provide specific written objections within five (5) business days of delivery. Approved milestones are non-refundable, and the corresponding {{formattedAmount}} portion becomes due immediately upon acceptance.</p>" },
    { title: "Third-Party Services & Costs", body: "<p>Costs for {{billingProvider}}, {{hostingPlatform}}, and any other third-party services, APIs, or licenses are the Client's responsibility and are billed at cost or paid directly by the Client. The Freelancer is not liable for outages, pricing changes, or policy decisions of these providers.</p>" },
    { title: "Post-Launch Support", body: "<p>The Freelancer will correct defects in delivered features for {{postLaunchSupport}} following launch at no additional charge. New features, third-party breakages, or changes requested after this window are billable at the Freelancer's standard rates.</p>" }
  ],
},
{
  id: "api-integration", name: "API Integration & Backend Services", category: "Development",
  icon: "plug", tagline: "Connect third-party APIs and build reliable backend endpoints, webhooks, and data sync.",
  workType: "Web Development", paymentSchedule: "split_50_50", fillMinutes: 3,
  scopeDefault: "The Freelancer will integrate {{apiList}} into {{projectTitle}} and build the necessary backend endpoints, {{webhookHandling}}, and data synchronization logic in {{backendStack}}. Integrations will be delivered against the providers' {{apiVersion}} APIs with {{errorHandling}} and documented for the Client's team. Work is scoped to the named services only; additional providers are handled as separate change orders.",
  fields: [
    { key: "apiList", label: "APIs / services to integrate", type: "textarea", placeholder: "Stripe, Twilio, HubSpot, internal CRM…", required: true, wide: true, hint: "Name every service. Each unlisted provider is a separate change order." },
    { key: "backendStack", label: "Backend stack", type: "text", default: "Node.js with Express", placeholder: "Node.js, Python/FastAPI, etc.", required: true, wide: true },
    { key: "webhookHandling", label: "Webhooks & events", type: "select", default: "inbound webhook handlers with retry logic", options: [{ value: "inbound webhook handlers with retry logic", label: "Inbound webhooks + retries" }, { value: "outbound event publishing", label: "Outbound events" }, { value: "bidirectional event sync", label: "Bidirectional sync" }, { value: "no webhook work", label: "No webhooks" }] },
    { key: "apiVersion", label: "API version policy", type: "select", default: "current stable", options: [{ value: "current stable", label: "Current stable" }, { value: "the version pinned by the Client", label: "Client-pinned version" }, { value: "latest including beta endpoints", label: "Latest incl. beta" }] },
    { key: "errorHandling", label: "Error handling & resilience", type: "select", default: "retries, logging, and graceful degradation", options: [{ value: "retries, logging, and graceful degradation", label: "Retries + logging" }, { value: "basic error logging", label: "Basic logging" }, { value: "full observability with alerting", label: "Full observability" }] },
    { key: "authStorage", label: "Credential storage", type: "text", default: "environment variables / secrets manager", placeholder: "How API keys are stored", hint: "The Client must supply valid API credentials before work begins." },
    { key: "endpointCount", label: "Approx. endpoints to build", type: "number", default: "6" },
    { key: "rateLimitNote", label: "Expected request volume", type: "text", default: "moderate (within provider free tiers)", placeholder: "e.g. ~10k requests/day" },
    { key: "testCoverage", label: "Testing approach", type: "select", default: "integration tests for critical paths", options: [{ value: "integration tests for critical paths", label: "Integration tests" }, { value: "manual verification only", label: "Manual only" }, { value: "full unit + integration coverage", label: "Full coverage" }] },
    { key: "handoffDocs", label: "Documentation deliverable", type: "text", default: "a README and endpoint reference", placeholder: "What docs are delivered" }
  ],
  extraClauses: [
    { title: "Client-Supplied Credentials & Accounts", body: "<p>The Client must provide valid, paid-tier-as-needed accounts and API credentials for {{apiList}} before the Freelancer begins integration work. Credentials are stored using {{authStorage}}. Delays in providing access, or revocation of access mid-project, pause the timeline and may incur rescheduling fees.</p>" },
    { title: "Third-Party API Changes", body: "<p>The Freelancer builds against the {{apiVersion}} of each provider's API as it exists on the start date. If a provider deprecates endpoints, changes pricing, or alters behavior after delivery, remediation is billable as new work. The Freelancer is not responsible for downtime or breaking changes originating from {{apiList}}.</p>" },
    { title: "Rate Limits & Usage Costs", body: "<p>This engagement assumes request volume of approximately {{rateLimitNote}}. Provider usage charges, overage fees, and rate-limit upgrades are the Client's responsibility. Architecture is optimized within the named providers' standard limits and is not warranted beyond them.</p>" },
    { title: "Handoff & Documentation", body: "<p>On completion the Freelancer delivers {{handoffDocs}} covering the {{endpointCount}} endpoints and {{webhookHandling}} implemented. Knowledge-transfer sessions beyond a single walkthrough are billed at the Freelancer's standard hourly rate.</p>" }
  ],
},
{
  id: "ecommerce-store", name: "E-Commerce Store Build", category: "Development",
  icon: "cart", tagline: "Launch a complete online store with products, payments, and shipping configured end to end.",
  popular: true, workType: "Web Development", paymentSchedule: "split_50_50", fillMinutes: 4,
  scopeDefault: "The Freelancer will build an e-commerce store for {{projectTitle}} on {{platform}}, configured with up to {{productCount}} products, {{paymentGateway}} for checkout, and {{shippingSetup}}. The store will use {{themeSource}} and include {{extraIntegrations}}. Product data, imagery, and copy are supplied by the Client unless otherwise agreed in writing.",
  fields: [
    { key: "platform", label: "E-commerce platform", type: "select", default: "Shopify", required: true, options: [{ value: "Shopify", label: "Shopify" }, { value: "WooCommerce", label: "WooCommerce" }, { value: "a custom Next.js storefront", label: "Custom (Next.js)" }, { value: "BigCommerce", label: "BigCommerce" }] },
    { key: "productCount", label: "Number of products to load", type: "number", default: "25", required: true, hint: "Products beyond this count are billed per additional batch." },
    { key: "paymentGateway", label: "Payment gateway", type: "select", default: "Stripe and PayPal", required: true, options: [{ value: "Stripe", label: "Stripe" }, { value: "Stripe and PayPal", label: "Stripe + PayPal" }, { value: "Shopify Payments", label: "Shopify Payments" }, { value: "the Client's existing processor", label: "Client's processor" }] },
    { key: "shippingSetup", label: "Shipping configuration", type: "select", default: "flat-rate and region-based shipping zones", options: [{ value: "flat-rate and region-based shipping zones", label: "Flat-rate + zones" }, { value: "carrier-calculated live rates", label: "Live carrier rates" }, { value: "local pickup only", label: "Local pickup" }, { value: "digital delivery (no shipping)", label: "Digital products" }] },
    { key: "themeSource", label: "Theme / design", type: "select", default: "a customized premium theme", options: [{ value: "a customized premium theme", label: "Customized premium theme" }, { value: "a fully custom design", label: "Fully custom design" }, { value: "a free theme with light branding", label: "Free theme + branding" }] },
    { key: "extraIntegrations", label: "Additional integrations", type: "text", default: "email marketing and abandoned-cart recovery", placeholder: "Klaviyo, reviews, analytics…", wide: true },
    { key: "taxSetup", label: "Tax handling", type: "select", default: "automatic tax via the platform", options: [{ value: "automatic tax via the platform", label: "Automatic tax" }, { value: "manual tax rates provided by the Client", label: "Manual rates" }, { value: "handled by the Client's accountant", label: "Client handles tax" }] },
    { key: "productDataNote", label: "Who supplies product data", type: "text", default: "the Client provides product details and images", placeholder: "Source of product info", wide: true },
    { key: "launchDate", label: "Target launch date", type: "date", hint: "Assumes product data is delivered at least 5 days prior." },
    { key: "trainingIncluded", label: "Store-management training", type: "text", default: "one recorded walkthrough", placeholder: "e.g. one 60-min session" }
  ],
  extraClauses: [
    { title: "Product Data & Content Responsibility", body: "<p>Unless stated otherwise, {{productDataNote}}. The Freelancer will load up to {{productCount}} products as provided; bulk data entry, image editing, or copywriting beyond this is billable separately. The Client warrants it holds the rights to all product imagery and descriptions supplied.</p>" },
    { title: "Payments, Tax & Compliance", body: "<p>Checkout is configured with {{paymentGateway}} and tax via {{taxSetup}}. The Client is solely responsible for merchant-account approval, payout settings, sales-tax registration, and legal compliance (privacy policy, terms, consumer law). The Freelancer configures the tools but does not provide tax, legal, or financial advice.</p>" },
    { title: "Launch Readiness", body: "<p>Go-live on or around {{launchDate}} assumes the Client has supplied product data, branding, and a funded {{paymentGateway}} account at least five (5) business days beforehand. Missing inputs shift the launch date without penalty to the Freelancer.</p>" },
    { title: "Handover & Training", body: "<p>On launch the Freelancer provides {{trainingIncluded}} covering order management on {{platform}}. The store's day-to-day operation — fulfilment, customer service, inventory — transfers to the Client at launch, and {{formattedAmount}} remaining on the {{scheduleLabel}} schedule becomes due.</p>" }
  ],
},
{
  id: "wordpress-care", name: "WordPress Website & Care Plan", category: "Development",
  icon: "globe", tagline: "Build a polished WordPress site, then keep it secure and updated with an ongoing care plan.",
  workType: "Web Development", paymentSchedule: "milestone", fillMinutes: 4,
  scopeDefault: "The Freelancer will build a WordPress website for {{projectTitle}} comprising approximately {{pageCount}} pages using {{builderTool}}, then provide an ongoing care plan billed {{carePlanTier}}. The build includes {{seoSetup}} and {{ecommerceAddon}}. The care plan covers core, theme, and plugin updates, {{backupFrequency}} backups, and uptime monitoring as detailed below.",
  fields: [
    { key: "pageCount", label: "Number of pages", type: "number", default: "7", required: true },
    { key: "builderTool", label: "Build approach", type: "select", default: "the Gutenberg block editor", required: true, options: [{ value: "the Gutenberg block editor", label: "Gutenberg blocks" }, { value: "Elementor", label: "Elementor" }, { value: "a custom theme", label: "Custom theme" }, { value: "the Divi builder", label: "Divi" }] },
    { key: "carePlanTier", label: "Care plan billing", type: "select", default: "monthly", required: true, options: [{ value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }, { value: "annually", label: "Annually" }] },
    { key: "backupFrequency", label: "Backup frequency", type: "select", default: "daily off-site", options: [{ value: "daily off-site", label: "Daily off-site" }, { value: "weekly off-site", label: "Weekly off-site" }, { value: "real-time", label: "Real-time" }] },
    { key: "seoSetup", label: "SEO setup", type: "select", default: "on-page SEO basics and a sitemap", options: [{ value: "on-page SEO basics and a sitemap", label: "On-page basics" }, { value: "no SEO work", label: "None" }, { value: "advanced SEO with schema markup", label: "Advanced + schema" }] },
    { key: "ecommerceAddon", label: "WooCommerce store", type: "select", default: "no online store", options: [{ value: "no online store", label: "No store" }, { value: "a basic WooCommerce store", label: "Basic WooCommerce" }, { value: "a full WooCommerce shop", label: "Full WooCommerce" }] },
    { key: "carePlanHours", label: "Care plan edit hours / month", type: "number", default: "2", hint: "Included content-edit hours; overage is billed hourly." },
    { key: "hostingNote", label: "Hosting", type: "text", default: "provided by the Client", placeholder: "Who provides hosting", wide: true, hint: "The care plan assumes a managed WordPress-compatible host." },
    { key: "carePlanStart", label: "Care plan start date", type: "date", hint: "Typically begins the day the site goes live." },
    { key: "minimumTerm", label: "Care plan minimum term", type: "text", default: "3 months, then month-to-month", placeholder: "e.g. 3 months minimum" }
  ],
  extraClauses: [
    { title: "Care Plan Scope", body: "<p>The care plan includes WordPress core, theme, and plugin updates, {{backupFrequency}} backups, security monitoring, and up to {{carePlanHours}} hours of content edits per month. Unused hours do not roll over. New pages, redesigns, or development work fall outside the care plan and are quoted separately.</p>" },
    { title: "Care Plan Term & Renewal", body: "<p>The care plan is billed {{carePlanTier}} beginning {{carePlanStart}}, with a minimum commitment of {{minimumTerm}}. It renews automatically until cancelled with thirty (30) days' written notice. Pausing the plan suspends updates, backups, and monitoring, and the Freelancer is not liable for issues arising during any lapse.</p>" },
    { title: "Hosting & Environment", body: "<p>Hosting is {{hostingNote}}. The care plan assumes a stable, WordPress-compatible managed host; the Freelancer is not responsible for server outages, host-level misconfiguration, or losses caused by hosting the Client controls. Restoring from a {{backupFrequency}} backup is included; data loss between backups is not recoverable.</p>" },
    { title: "Third-Party Plugins & Licenses", body: "<p>Premium plugin and theme licenses required for {{projectTitle}} (including any for {{ecommerceAddon}}) are the Client's responsibility and renew at the Client's cost. The Freelancer is not liable for vulnerabilities, conflicts, or abandonment of third-party plugins outside its control.</p>" }
  ],
},
{
  id: "software-maintenance", name: "Software Maintenance & Support Retainer", category: "Development",
  icon: "wrench", tagline: "Keep your application healthy with ongoing fixes, updates, monitoring, and guaranteed response times.",
  workType: "Web Development", paymentSchedule: "monthly_retainer", fillMinutes: 4, omitRevisions: true,
  scopeDefault: "The Freelancer will provide ongoing maintenance and support for {{projectTitle}} under a {{scheduleLabel}} retainer of {{formattedAmount}}, covering up to {{monthlyHours}} hours per month of bug fixes, dependency updates, and minor improvements. Support is offered during {{supportHours}} with {{priorityResponse}} response targets for critical issues. The retainer also includes {{monitoringLevel}} and excludes net-new feature development unless agreed as separate work.",
  fields: [
    { key: "monthlyHours", label: "Included hours per month", type: "number", default: "10", required: true, hint: "Work beyond this is billed at the overage rate below." },
    { key: "supportHours", label: "Support window", type: "select", default: "business hours, Monday–Friday", required: true, options: [{ value: "business hours, Monday–Friday", label: "Business hours, Mon–Fri" }, { value: "extended hours including weekends", label: "Extended + weekends" }, { value: "24/7 on-call coverage", label: "24/7 on-call" }] },
    { key: "priorityResponse", label: "Critical-issue response target", type: "select", default: "same business day", required: true, options: [{ value: "within 4 business hours", label: "4 business hours" }, { value: "same business day", label: "Same business day" }, { value: "within 1 hour, 24/7", label: "1 hour, 24/7" }] },
    { key: "monitoringLevel", label: "Monitoring", type: "select", default: "uptime and error monitoring with alerts", options: [{ value: "uptime and error monitoring with alerts", label: "Uptime + errors" }, { value: "uptime monitoring only", label: "Uptime only" }, { value: "full performance and security monitoring", label: "Full monitoring" }] },
    { key: "overageRate", label: "Overage hourly rate", type: "text", default: "the Freelancer's standard hourly rate", placeholder: "e.g. $90/hour", wide: true, hint: "Applies once monthly included hours are exhausted." },
    { key: "techScope", label: "Systems covered", type: "textarea", placeholder: "Which apps, services, or repos are covered", required: true, wide: true, hint: "List the specific applications and repositories under this retainer." },
    { key: "rolloverPolicy", label: "Unused-hours policy", type: "select", default: "do not roll over", options: [{ value: "do not roll over", label: "No rollover" }, { value: "roll over for one month", label: "Roll over 1 month" }, { value: "are credited toward future work", label: "Credited forward" }] },
    { key: "retainerStart", label: "Retainer start date", type: "date" },
    { key: "minimumTerm", label: "Minimum term & notice", type: "text", default: "3 months, then 30 days' notice to cancel", placeholder: "Term and cancellation notice" },
    { key: "exclusions", label: "Explicit exclusions", type: "text", default: "new features, redesigns, and third-party outages", placeholder: "What is not covered", wide: true }
  ],
  extraClauses: [
    { title: "Service Level Agreement (SLA)", body: "<p>For critical issues — defined as production outages or data-affecting defects — the Freelancer will acknowledge and begin work {{priorityResponse}}, during {{supportHours}}. Response targets are acknowledgement-to-start, not guaranteed resolution times, and assume the Client provides prompt access and reproduction details. SLA targets are suspended during third-party outages or Client-caused delays.</p>" },
    { title: "Included Hours & Overage", body: "<p>The retainer includes up to {{monthlyHours}} hours per month across the systems listed in scope. Unused hours {{rolloverPolicy}}. Work exceeding the monthly allotment is performed only with the Client's approval and billed at {{overageRate}}.</p>" },
    { title: "Scope of Coverage & Exclusions", body: "<p>This retainer covers maintenance of the named systems only and expressly excludes {{exclusions}}. New feature development, major version migrations, and work on systems not listed are quoted as separate engagements. The Freelancer is not responsible for failures caused by {{monitoringLevel}} blind spots outside the agreed coverage.</p>" },
    { title: "Term, Renewal & Cancellation", body: "<p>The retainer begins {{retainerStart}}, is billed {{scheduleLabel}} at {{formattedAmount}}, and runs for {{minimumTerm}}. It renews automatically each period until cancelled in writing. The {{formattedAmount}} retainer fee is due in advance and is non-refundable for the period in which services were available, whether or not all included hours were used.</p>" }
  ],
},

  // ── Premium · Design ─────────────────────────────────────────────────────
{
  id: "brand-identity-system",
  name: "Complete Brand Identity System",
  category: "Design",
  icon: "layers",
  tagline: "A full brand identity package from logo suite to delivered guidelines and assets.",
  popular: true,
  workType: "UI/UX Design",
  paymentSchedule: "split_50_50",
  scopeLabel: "Brand Identity Scope",
  scopeDefault: "{{freelancerName}} will design a complete brand identity for {{clientName}}'s {{brandName}}, beginning with {{logoConcepts}} distinct logo concepts and refining the chosen direction across {{revisionRounds}} rounds of revisions. The engagement delivers a cohesive visual system spanning logo lockups, a color palette, and typography, packaged with {{brandGuidelines}}. Final files will be provided as {{deliverableFormats}}, granting {{clientName}} {{usageRights}} upon receipt of full payment.",
  fields: [
    { key: "brandName", label: "Brand / Company Name", type: "text", placeholder: "e.g. Northwind Coffee Co.", required: true, hint: "The brand this identity is being created for." },
    { key: "logoConcepts", label: "Number of Logo Concepts", type: "number", placeholder: "3", default: "3", required: true, hint: "Initial distinct directions presented before refinement." },
    { key: "deliverableFormats", label: "Deliverable File Formats", type: "select", required: true, default: "vector and raster files (AI, EPS, SVG, PNG, JPG)", options: [
      { value: "vector files only (AI, EPS, SVG)", label: "Vector only (AI, EPS, SVG)" },
      { value: "vector and raster files (AI, EPS, SVG, PNG, JPG)", label: "Vector + raster (AI, EPS, SVG, PNG, JPG)" },
      { value: "a full file suite (vector, raster, PDF, and web-optimized formats)", label: "Full suite (vector, raster, PDF, web)" }
    ] },
    { key: "brandGuidelines", label: "Brand Guidelines Document", type: "select", required: true, default: "a standard brand guidelines document (10-20 pages)", options: [
      { value: "no formal guidelines document", label: "No formal guidelines" },
      { value: "a mini one-page style sheet", label: "Mini one-page style sheet" },
      { value: "a standard brand guidelines document (10-20 pages)", label: "Standard guidelines (10–20 pages)" },
      { value: "a comprehensive brand book (30+ pages)", label: "Comprehensive brand book (30+ pages)" }
    ] },
    { key: "revisionRounds", label: "Revision Rounds", type: "number", placeholder: "3", default: "3", required: true, hint: "Rounds of feedback included on the selected concept." },
    { key: "usageRights", label: "Usage Rights", type: "select", required: true, default: "full exclusive ownership", options: [
      { value: "full exclusive ownership", label: "Full exclusive ownership" },
      { value: "commercial, non-exclusive usage rights", label: "Commercial, non-exclusive" },
      { value: "limited usage rights for specified uses only", label: "Limited (specified uses only)" }
    ] },
    { key: "colorTypography", label: "Color & Typography System", type: "text", placeholder: "e.g. 4 brand colors + 2 typeface families", hint: "Scope of the palette and type system." },
    { key: "applicationMockups", label: "Brand Application Mockups", type: "text", placeholder: "e.g. business card, letterhead, social avatar", hint: "Real-world applications shown to present the identity." },
    { key: "assetList", label: "Full Asset & Deliverable List", type: "textarea", placeholder: "Primary logo, secondary lockup, favicon, color swatches (HEX/RGB/CMYK), font files, social templates...", wide: true, hint: "Itemize every file and artifact to be delivered." }
  ],
  extraClauses: [
    { title: "Concept Selection", body: "<p>{{clientName}} will select <strong>one</strong> primary direction from the {{logoConcepts}} concepts presented. Once a direction is approved, the included {{revisionRounds}} revision rounds apply to refining that single concept. Returning to a previously rejected concept or requesting entirely new directions is billed as additional work.</p>" },
    { title: "Usage Rights & Ownership Transfer", body: "<p>{{clientName}} is granted <strong>{{usageRights}}</strong> to the final approved identity only upon receipt of {{formattedAmount}} in full. Until full payment clears, all concepts, drafts, and working files remain the intellectual property of {{freelancerName}}.</p>" },
    { title: "Source Files & Deliverables", body: "<p>Final deliverables will be provided as {{deliverableFormats}} along with the assets itemized in the project scope. Editable working files beyond the agreed list, and any third-party licensed typefaces, are not included unless explicitly stated.</p>" },
    { title: "Trademark & Originality", body: "<p>{{freelancerName}} warrants that the delivered identity is original work. {{clientName}} is responsible for any trademark searches, registrations, and legal clearances required to protect or use the {{brandName}} marks in their jurisdiction.</p>" }
  ],
  fillMinutes: 4
},
{
  id: "product-design-sprint",
  name: "Product Design Sprint",
  category: "Design",
  icon: "compass",
  tagline: "A focused, time-boxed sprint from research to a validated, testable prototype.",
  workType: "UI/UX Design",
  paymentSchedule: "full_upfront",
  scopeLabel: "Sprint Scope",
  scopeDefault: "{{freelancerName}} will facilitate {{sprintLength}} design sprint for {{clientName}} focused on the challenge of {{sprintGoal}}. The sprint moves through research, ideation, and rapid prototyping with {{participants}} participating stakeholders, producing a clickable prototype built in {{prototypingTool}}. The engagement concludes with {{validationMethod}} to validate the solution and a summary of findings, kicking off on {{startDateLabel}}.",
  fields: [
    { key: "sprintGoal", label: "Sprint Challenge / Goal", type: "text", placeholder: "e.g. redesign the onboarding flow to lift activation", required: true, wide: true, hint: "The single focused problem the sprint will tackle." },
    { key: "sprintLength", label: "Sprint Length", type: "select", required: true, default: "a 5-day classic", options: [
      { value: "a 1-day lightning", label: "1-day lightning sprint" },
      { value: "a 3-day condensed", label: "3-day condensed sprint" },
      { value: "a 4-day", label: "4-day sprint" },
      { value: "a 5-day classic", label: "5-day classic sprint" }
    ] },
    { key: "participants", label: "Number of Participants", type: "number", placeholder: "5", default: "5", required: true, hint: "Stakeholders attending the sprint sessions." },
    { key: "prototypingTool", label: "Prototyping Tool", type: "select", required: true, default: "Figma", options: [
      { value: "Figma", label: "Figma" },
      { value: "Sketch", label: "Sketch" },
      { value: "Framer", label: "Framer" },
      { value: "Adobe XD", label: "Adobe XD" }
    ] },
    { key: "validationMethod", label: "Validation Method", type: "select", required: true, default: "moderated user testing with 5 users", options: [
      { value: "moderated user testing with 5 users", label: "Moderated user testing (5 users)" },
      { value: "a stakeholder review and feedback session", label: "Stakeholder review & feedback" },
      { value: "unmoderated remote testing", label: "Unmoderated remote testing" }
    ] },
    { key: "deliverables", label: "Key Deliverables", type: "text", placeholder: "e.g. prototype, test recordings, recommendations deck", hint: "Tangible outputs handed over after the sprint." },
    { key: "researchInputs", label: "Provided Research & Inputs", type: "text", placeholder: "e.g. analytics, prior interviews, brand assets", hint: "Materials the client supplies before kickoff." },
    { key: "facilitationFormat", label: "Facilitation Format", type: "select", required: true, default: "fully remote", options: [
      { value: "fully remote", label: "Fully remote" },
      { value: "on-site", label: "On-site" },
      { value: "hybrid", label: "Hybrid" }
    ] },
    { key: "sprintAgenda", label: "Day-by-Day Agenda & Outcomes", type: "textarea", placeholder: "Day 1: map & expert interviews. Day 2: sketch. Day 3: decide & storyboard. Day 4: prototype. Day 5: test...", wide: true, hint: "Outline what happens each day of the sprint." }
  ],
  extraClauses: [
    { title: "Fixed Scope & Timeline", body: "<p>This is a fixed, time-boxed engagement: {{sprintLength}} sprint beginning {{startDateLabel}}. The {{sprintGoal}} challenge is the sole focus. Expanding the challenge, adding flows, or work beyond the sprint window is scoped and billed separately.</p>" },
    { title: "Participant Commitment", body: "<p>A productive sprint depends on the right people in the room. {{clientName}} commits to securing {{participants}} engaged participants, including a Decider with authority, for the full {{scheduleLabel}} schedule. Sessions cannot be rescheduled mid-sprint without affecting deliverables.</p>" },
    { title: "Prototype Fidelity", body: "<p>The prototype delivered is a <strong>validation artifact</strong> built in {{prototypingTool}}, intended to test the {{sprintGoal}} hypothesis via {{validationMethod}}. It is not production-ready code or a final design system, and should not be shipped to end users without further design and engineering work.</p>" },
    { title: "Inputs & Prerequisites", body: "<p>{{clientName}} will provide all required research inputs and access before the sprint start date. The full {{formattedAmount}} fee is due upfront to reserve the dedicated sprint window; cancellations within 7 days of kickoff forfeit the reserved time.</p>" }
  ],
  fillMinutes: 3
},
{
  id: "packaging-design",
  name: "Packaging & Print Design",
  category: "Design",
  icon: "box",
  tagline: "Print-ready packaging and artwork prepared to professional production specs.",
  workType: "UI/UX Design",
  paymentSchedule: "split_50_50",
  scopeLabel: "Packaging Scope",
  scopeDefault: "{{freelancerName}} will design print-ready packaging artwork for {{clientName}} covering {{skuCount}} SKU(s) of {{productType}}. Work will be prepared to the supplied print specification using a {{colorProfile}} color profile, with {{dielineProvided}}. The engagement includes {{proofRounds}} proof rounds before {{freelancerName}} releases the final production files described in the scope below.",
  fields: [
    { key: "productType", label: "Product / Package Type", type: "text", placeholder: "e.g. folding carton, label, pouch, box", required: true, hint: "What kind of packaging is being designed." },
    { key: "skuCount", label: "Number of SKUs", type: "number", placeholder: "3", default: "1", required: true, hint: "Distinct product variants to be designed." },
    { key: "colorProfile", label: "Color Profile", type: "select", required: true, default: "CMYK (4-color process)", options: [
      { value: "CMYK (4-color process)", label: "CMYK (4-color process)" },
      { value: "Pantone spot color", label: "Pantone spot colors" },
      { value: "CMYK plus Pantone spot color", label: "CMYK + Pantone spot" }
    ] },
    { key: "dielineProvided", label: "Dieline Source", type: "select", required: true, default: "a printer-supplied dieline", options: [
      { value: "a printer-supplied dieline", label: "Printer-supplied dieline" },
      { value: "a dieline created by the designer", label: "Designer-created dieline" },
      { value: "an existing client template", label: "Existing client template" }
    ] },
    { key: "proofRounds", label: "Proof Rounds", type: "number", placeholder: "2", default: "2", required: true, hint: "Rounds of proofing included before final files." },
    { key: "printSpec", label: "Print Specification", type: "text", placeholder: "e.g. 350gsm board, matte lam, spot UV, 3mm bleed", required: true, wide: true, hint: "Substrate, finishes, bleed, and printer requirements." },
    { key: "finishes", label: "Special Finishes", type: "select", default: "no special finishes", options: [
      { value: "no special finishes", label: "None" },
      { value: "foil stamping", label: "Foil stamping" },
      { value: "spot UV / varnish", label: "Spot UV / varnish" },
      { value: "emboss / deboss", label: "Emboss / deboss" }
    ] },
    { key: "fileFormat", label: "Final File Format", type: "select", required: true, default: "print-ready PDF/X", options: [
      { value: "print-ready PDF/X", label: "Print-ready PDF/X" },
      { value: "packaged AI/INDD plus PDF", label: "Packaged AI/INDD + PDF" },
      { value: "full native files with fonts and links", label: "Full native files + fonts/links" }
    ] },
    { key: "artworkScope", label: "Artwork & Deliverables Detail", type: "textarea", placeholder: "Front/back panels, ingredient panel, barcode placement, regulatory marks, per-SKU color variants...", wide: true, hint: "Itemize panels, variants, and production deliverables." }
  ],
  extraClauses: [
    { title: "Print Specification & Dieline", body: "<p>Artwork will be built to the supplied {{printSpec}} using {{dielineProvided}}. {{clientName}} is responsible for confirming the dieline and print spec with their printer before work begins. Changes to the dieline or spec after design starts may require rework billed separately.</p>" },
    { title: "Color Accuracy & Proofing", body: "<p>Files are prepared in the {{colorProfile}} color profile across {{proofRounds}} proof rounds. Screen colors are approximate; {{freelancerName}} is not responsible for final color shifts introduced on press. {{clientName}} is strongly advised to approve a physical printer's proof before the production run.</p>" },
    { title: "Production File Release", body: "<p>Final {{fileFormat}} production files for all {{skuCount}} SKU(s) are released only after the second 50% payment of {{formattedAmount}} clears. {{freelancerName}} is not liable for errors arising from changes made to files after handoff, or from production by third-party printers.</p>" },
    { title: "Regulatory & Content Accuracy", body: "<p>{{clientName}} is solely responsible for the accuracy and legal compliance of all copy, ingredient lists, barcodes, nutritional information, and regulatory marks supplied for the {{productType}} artwork. {{freelancerName}} reproduces provided content as given.</p>" }
  ],
  fillMinutes: 4
},
{
  id: "motion-graphics",
  name: "Motion Graphics & Animation",
  category: "Design",
  icon: "film",
  tagline: "Custom animated explainers and motion graphics, scripted to final render.",
  workType: "Video Editing",
  paymentSchedule: "split_50_50",
  scopeLabel: "Animation Scope",
  scopeDefault: "{{freelancerName}} will produce a {{duration}}-second {{animationStyle}} piece for {{clientName}}, delivered at {{resolution}}. The project covers concept, storyboard, animation, and final render, with {{revisionRounds}} rounds of revisions and {{musicLicensing}}. Final files will be delivered by {{deadlineLabel}}, with source files {{sourceFiles}}.",
  fields: [
    { key: "duration", label: "Final Duration (seconds)", type: "number", placeholder: "60", default: "60", required: true, hint: "Total runtime of the finished animation." },
    { key: "animationStyle", label: "Animation Style", type: "select", required: true, default: "2D motion graphics", options: [
      { value: "2D motion graphics", label: "2D motion graphics" },
      { value: "3D animation", label: "3D animation" },
      { value: "mixed 2D and 3D animation", label: "Mixed 2D / 3D" },
      { value: "frame-by-frame cel animation", label: "Frame-by-frame / cel" }
    ] },
    { key: "resolution", label: "Output Resolution", type: "select", required: true, default: "1080p Full HD", options: [
      { value: "1080p Full HD", label: "1080p Full HD" },
      { value: "4K UHD", label: "4K UHD" },
      { value: "social formats (square and vertical)", label: "Social (square + vertical)" }
    ] },
    { key: "revisionRounds", label: "Revision Rounds", type: "number", placeholder: "2", default: "2", required: true, hint: "Feedback rounds included on the animation." },
    { key: "sourceFiles", label: "Source / Project Files", type: "select", required: true, default: "not included (final render only)", options: [
      { value: "not included (final render only)", label: "Not included (final render only)" },
      { value: "included with delivery", label: "Included with delivery" },
      { value: "available for an additional fee", label: "Available for an additional fee" }
    ] },
    { key: "musicLicensing", label: "Music & Audio", type: "select", required: true, default: "licensed stock music included", options: [
      { value: "licensed stock music included", label: "Licensed stock music included" },
      { value: "music provided by the client", label: "Client-provided music" },
      { value: "no audio (silent delivery)", label: "No audio / silent" },
      { value: "a custom-scored soundtrack for an additional fee", label: "Custom scored audio (additional fee)" }
    ] },
    { key: "voiceover", label: "Voiceover", type: "select", default: "no voiceover", options: [
      { value: "no voiceover", label: "None" },
      { value: "client-supplied voiceover", label: "Client-supplied VO" },
      { value: "designer-arranged voiceover talent", label: "Designer-arranged VO talent" }
    ] },
    { key: "scriptStoryboard", label: "Script & Storyboard Source", type: "text", placeholder: "e.g. client-provided script, designer to storyboard", hint: "Who supplies the script and storyboard." },
    { key: "deliverableDetail", label: "Deliverables & Format Detail", type: "textarea", placeholder: "Final MP4 (H.264), social cutdowns, captions/SRT, aspect ratio variants, color profile...", wide: true, hint: "Itemize export formats, cutdowns, and extras." }
  ],
  extraClauses: [
    { title: "Script & Storyboard Approval", body: "<p>Animation begins only after {{clientName}} approves the storyboard in writing. Because motion work compounds on the approved storyboard, structural changes requested after animation has started (re-timing, new scenes, narrative changes) fall outside the {{revisionRounds}} included rounds and are billed separately.</p>" },
    { title: "Revisions Scope", body: "<p>The {{revisionRounds}} revision rounds cover refinements to timing, color, and motion within the approved {{duration}}-second {{animationStyle}} scope. Each round consolidates {{clientName}}'s feedback into one pass. Additional rounds are billed at {{freelancerName}}'s standard hourly rate.</p>" },
    { title: "Music, Audio & Licensing", body: "<p>Audio for this project is handled as follows: {{musicLicensing}}. Where stock music is licensed by {{freelancerName}}, the license covers this delivered piece only. If {{clientName}} provides music or voiceover, they warrant they hold all necessary rights for its use.</p>" },
    { title: "Source Files & Final Delivery", body: "<p>Final renders are delivered at {{resolution}} by {{deadlineLabel}}, with project/source files {{sourceFiles}}. Ownership of the final animation transfers to {{clientName}} upon receipt of {{formattedAmount}} in full; until then all renders and assets remain the property of {{freelancerName}}.</p>" }
  ],
  fillMinutes: 4
},

  // ── Premium · Content, Media & Marketing ─────────────────────────────────
{
  id: "podcast-production",
  name: "Podcast Production & Editing",
  category: "Content & Media",
  icon: "mic",
  tagline: "Turn raw recordings into polished, ready-to-publish podcast episodes every month.",
  workType: "Video Editing",
  paymentSchedule: "monthly_retainer",
  scopeDefault:
    "{{freelancerName}} will produce and edit {{episodesPerMonth}} podcast episode(s) per month for {{clientName}}'s show \"{{showName}}\", applying {{editingLevel}} to each recording. Each episode will be delivered within {{turnaroundDays}} days of receiving the raw audio, mastered for clean, consistent sound. Deliverables include {{showNotes}} and {{distribution}} as described below, ensuring {{projectTitle}} sounds professional across every platform.",
  scopeLabel: "Production Scope",
  fillMinutes: 4,
  fields: [
    {
      key: "showName",
      label: "Show / Podcast Name",
      type: "text",
      placeholder: "The Founder's Cut",
      required: true,
    },
    {
      key: "episodesPerMonth",
      label: "Episodes Per Month",
      type: "number",
      placeholder: "4",
      default: "4",
      required: true,
      hint: "Number of finished episodes delivered each month.",
    },
    {
      key: "episodeLength",
      label: "Typical Episode Length (minutes)",
      type: "number",
      placeholder: "45",
      default: "45",
      hint: "Approximate finished runtime per episode.",
    },
    {
      key: "editingLevel",
      label: "Editing Level",
      type: "select",
      required: true,
      default: "standard editing with full edit, music and mastering",
      options: [
        { value: "basic editing with cuts, leveling and noise cleanup", label: "Basic — cuts, leveling & noise cleanup" },
        { value: "standard editing with full edit, music and mastering", label: "Standard — full edit, music & mastering" },
        { value: "premium editing with sound design, ad inserts and polish", label: "Premium — sound design, ad inserts & polish" },
      ],
    },
    {
      key: "showNotes",
      label: "Show Notes & Transcripts",
      type: "select",
      default: "show notes with chapter timestamps",
      options: [
        { value: "no show notes", label: "No show notes" },
        { value: "show notes and a summary", label: "Show notes & summary" },
        { value: "show notes with chapter timestamps", label: "Show notes + chapter timestamps" },
        { value: "show notes with a full transcript", label: "Show notes + full transcript" },
      ],
    },
    {
      key: "distribution",
      label: "Distribution",
      type: "select",
      default: "uploading and scheduling to the host",
      options: [
        { value: "delivery of the finished files only", label: "Deliver files only" },
        { value: "uploading and scheduling to the host", label: "Upload & schedule to host" },
        { value: "full distribution with audiogram clips", label: "Full distribution + audiogram clips" },
      ],
    },
    {
      key: "turnaroundDays",
      label: "Turnaround (days)",
      type: "number",
      placeholder: "5",
      default: "5",
      required: true,
      hint: "Business days from receiving raw audio to delivery.",
    },
    {
      key: "introMusic",
      label: "Intro / Outro & Music",
      type: "text",
      placeholder: "Branded intro + licensed background music",
      hint: "Note any custom intro, outro, or stinger requirements.",
    },
    {
      key: "rawAudioNotes",
      label: "Recording & Source Audio Notes",
      type: "textarea",
      placeholder: "Recorded via Riverside, separate tracks per speaker, 2 hosts + 1 guest...",
      wide: true,
      hint: "Describe how episodes are recorded and how files will be shared.",
    },
  ],
  extraClauses: [
    {
      title: "Source Material & Delivery",
      body: "<p>The Client will provide usable raw audio for each episode, recorded as described in the recording notes. {{freelancerName}} will deliver each finished episode within {{turnaroundDays}} business days of receiving complete, usable source files. <strong>Turnaround timelines pause</strong> if raw audio is delivered late, is incomplete, or fails to meet a minimum recording quality, and the monthly episode count assumes recordings are supplied on a consistent schedule.</p>",
    },
    {
      title: "Scope, Re-Edits & Add-Ons",
      body: "<p>This engagement covers {{editingLevel}} for up to {{episodesPerMonth}} episode(s) per month at the agreed standard. Up to two rounds of revisions are included per episode; additional re-edits, episodes beyond the monthly allotment, bonus content, or expanded show-notes deliverables will be quoted and billed separately at {{freelancerName}}'s standard rates.</p>",
    },
    {
      title: "Monthly Retainer & Renewal",
      body: "<p>This is a recurring monthly retainer of {{formattedAmount}}, billed in advance on the {{scheduleLabel}} basis and due before each production cycle begins. Unused episodes do not roll over to the following month. The retainer renews automatically each month and may be cancelled by either party with at least 30 days' written notice ahead of the next billing cycle.</p>",
    },
    {
      title: "Music Licensing & Credits",
      body: "<p>Any music, sound effects, or intro/outro assets supplied by the Client must be properly licensed for podcast use, and the Client warrants it holds those rights. Where {{freelancerName}} sources licensed assets on the Client's behalf, associated costs are billed separately. {{freelancerName}} retains the right to reference {{projectTitle}} as a portfolio credit unless the parties agree otherwise in writing.</p>",
    },
  ],
},
{
  id: "website-copywriting",
  name: "Website Copywriting & Messaging",
  category: "Content & Media",
  icon: "type",
  tagline: "Clear, conversion-focused copy and messaging for every page of your website.",
  workType: "Content Writing",
  paymentSchedule: "split_50_50",
  scopeDefault:
    "{{freelancerName}} will write conversion-focused website copy for {{clientName}} across {{pageCount}} page(s) for {{projectTitle}}, written in a {{toneOfVoice}} tone of voice and aligned to the brand messaging defined below. The work includes {{seoLevel}} and up to {{revisionRounds}} round(s) of revisions per page. Final copy will be delivered as page-by-page documents ready for design and development handoff.",
  scopeLabel: "Copywriting Scope",
  fillMinutes: 4,
  fields: [
    {
      key: "pageCount",
      label: "Number of Pages",
      type: "number",
      placeholder: "6",
      default: "6",
      required: true,
      hint: "e.g. Home, About, Services, Pricing, Contact.",
    },
    {
      key: "pageList",
      label: "Pages In Scope",
      type: "text",
      placeholder: "Home, About, Services, Pricing, Contact, FAQ",
      hint: "List the specific pages covered by this agreement.",
    },
    {
      key: "toneOfVoice",
      label: "Tone of Voice",
      type: "select",
      required: true,
      default: "professional and polished",
      options: [
        { value: "professional and polished", label: "Professional & polished" },
        { value: "friendly and conversational", label: "Friendly & conversational" },
        { value: "bold and punchy", label: "Bold & punchy" },
        { value: "premium and editorial", label: "Premium & editorial" },
      ],
    },
    {
      key: "seoLevel",
      label: "SEO Optimization",
      type: "select",
      required: true,
      default: "on-page SEO covering titles, metas and headings",
      options: [
        { value: "no SEO work, copy only", label: "No SEO — copy only" },
        { value: "keyword-informed copy", label: "Keyword-informed copy" },
        { value: "on-page SEO covering titles, metas and headings", label: "On-page SEO (titles, metas, headings)" },
        { value: "full SEO including keyword research", label: "Full SEO incl. keyword research" },
      ],
    },
    {
      key: "ctaStrategy",
      label: "Calls-to-Action",
      type: "select",
      default: "a tailored call-to-action per page",
      options: [
        { value: "a single primary call-to-action", label: "Single primary CTA" },
        { value: "a tailored call-to-action per page", label: "Tailored CTA per page" },
        { value: "a full funnel call-to-action strategy", label: "Full funnel CTA strategy" },
      ],
    },
    {
      key: "revisionRounds",
      label: "Revision Rounds (per page)",
      type: "number",
      placeholder: "2",
      default: "2",
      required: true,
      hint: "Included rounds of revisions per page.",
    },
    {
      key: "metaDescriptions",
      label: "Meta Titles & Descriptions",
      type: "text",
      placeholder: "Included for all pages",
      hint: "Note whether SEO meta copy is in scope.",
    },
    {
      key: "deliveryFormat",
      label: "Delivery Format",
      type: "text",
      placeholder: "Google Docs, page by page",
      default: "Google Docs",
    },
    {
      key: "brandMessaging",
      label: "Brand Messaging & Positioning",
      type: "textarea",
      placeholder: "Target audience, key differentiators, value proposition, competitors, words to avoid...",
      wide: true,
      required: true,
      hint: "Share positioning, audience, and any existing brand guidelines.",
    },
  ],
  extraClauses: [
    {
      title: "Inputs & Research",
      body: "<p>To produce effective copy, the Client will provide the brand messaging, positioning, and any reference materials outlined above, along with timely access to stakeholders for a kickoff or discovery call. {{freelancerName}} will base {{projectTitle}} on the {{toneOfVoice}} direction and information supplied; <strong>significant changes to positioning or audience</strong> after writing begins may require a revised quote and timeline.</p>",
    },
    {
      title: "Revisions & Scope",
      body: "<p>This agreement includes up to {{revisionRounds}} round(s) of revisions per page for the {{pageCount}} page(s) in scope. A revision round means a single consolidated set of feedback. Additional pages, extra revision rounds, or rewrites prompted by a change in brand direction are outside this scope and will be billed separately at {{freelancerName}}'s standard rates.</p>",
    },
    {
      title: "SEO Performance Disclaimer",
      body: "<p>Where {{seoLevel}} is included, {{freelancerName}} applies current best practices for on-page copy but <strong>does not guarantee specific search rankings, traffic, or conversion results</strong>, as these depend on factors outside the copy itself such as technical SEO, design, and competition. Implementation of the copy into the live site is the Client's responsibility unless agreed otherwise.</p>",
    },
    {
      title: "Payment & Ownership",
      body: "<p>Fees totalling {{formattedAmount}} will be invoiced on a {{scheduleLabel}} basis. Full ownership and usage rights to the final copy transfer to the Client only upon receipt of full payment. Until then, {{freelancerName}} retains all rights to the work, and {{freelancerName}} may showcase the completed copy as a portfolio sample unless the Client requests confidentiality in writing.</p>",
    },
  ],
},
{
  id: "translation-localization",
  name: "Translation & Localization",
  category: "Content & Media",
  icon: "languages",
  tagline: "Accurate, culturally adapted translation and localization for global audiences.",
  workType: "Content Writing",
  paymentSchedule: "split_50_50",
  scopeDefault:
    "{{freelancerName}} will translate and localize approximately {{wordCount}} words for {{clientName}} from {{sourceLanguage}} into {{targetLanguages}} for {{projectTitle}}. The work covers the {{subjectDomain}} domain and includes {{proofreading}}, with delivery within {{turnaroundDays}} days of project confirmation. Translations will be adapted for natural tone and cultural fit rather than rendered word-for-word.",
  scopeLabel: "Translation Scope",
  fillMinutes: 4,
  fields: [
    {
      key: "sourceLanguage",
      label: "Source Language",
      type: "text",
      placeholder: "English (US)",
      required: true,
    },
    {
      key: "targetLanguages",
      label: "Target Language(s)",
      type: "text",
      placeholder: "Spanish (LatAm), French, German",
      required: true,
      wide: true,
      hint: "List every language the content will be translated into.",
    },
    {
      key: "wordCount",
      label: "Approximate Word Count",
      type: "number",
      placeholder: "5000",
      default: "5000",
      required: true,
      hint: "Source word count; affects price and timeline.",
    },
    {
      key: "subjectDomain",
      label: "Subject Domain",
      type: "select",
      required: true,
      default: "general and marketing",
      options: [
        { value: "general and marketing", label: "General / Marketing" },
        { value: "technical and software", label: "Technical / Software" },
        { value: "legal and financial", label: "Legal / Financial" },
        { value: "medical and life sciences", label: "Medical / Life Sciences" },
      ],
    },
    {
      key: "proofreading",
      label: "Proofreading & QA",
      type: "select",
      required: true,
      default: "translation plus a self-review",
      options: [
        { value: "translation only", label: "Translation only" },
        { value: "translation plus a self-review", label: "Translation + self-review" },
        { value: "translation plus independent second-linguist proofreading", label: "Independent second-linguist proofreading" },
      ],
    },
    {
      key: "catTool",
      label: "CAT Tool / Workflow",
      type: "select",
      default: "SDL Trados",
      options: [
        { value: "no CAT tool", label: "No CAT tool" },
        { value: "SDL Trados", label: "SDL Trados" },
        { value: "memoQ", label: "memoQ" },
        { value: "Phrase (Memsource)", label: "Phrase / Memsource" },
      ],
    },
    {
      key: "fileFormat",
      label: "File Format",
      type: "text",
      placeholder: "DOCX, XLIFF, JSON strings",
      hint: "Format of source files and required delivery format.",
    },
    {
      key: "glossary",
      label: "Glossary / Style Guide",
      type: "text",
      placeholder: "Client glossary & TM provided",
      hint: "Note any termbase, translation memory, or style guide.",
    },
    {
      key: "turnaroundDays",
      label: "Turnaround (days)",
      type: "number",
      placeholder: "7",
      default: "7",
      required: true,
      hint: "Business days from confirmation to delivery.",
    },
    {
      key: "localizationNotes",
      label: "Localization Notes",
      type: "textarea",
      placeholder: "Adapt currency & date formats, regional idioms, avoid certain terms, keep brand names untranslated...",
      wide: true,
      hint: "Cultural, regional, or formatting adaptation requirements.",
    },
  ],
  extraClauses: [
    {
      title: "Source Material & Reference",
      body: "<p>The Client will supply the final source text in {{sourceLanguage}}, in an editable {{fileFormat}} format, along with any glossary, translation memory, or style guide to ensure consistency. The {{wordCount}}-word estimate and {{turnaroundDays}}-day timeline assume the source is final; <strong>changes to the source text after work begins</strong> will be treated as additional words and may extend the deadline.</p>",
    },
    {
      title: "Quality, Proofreading & Corrections",
      body: "<p>Translations into {{targetLanguages}} will be delivered with {{proofreading}} as agreed. {{freelancerName}} will correct any genuine translation errors free of charge when reported within 14 days of delivery. <strong>Preferential or stylistic changes</strong>, requests reflecting a shift in terminology, or edits to content the Client later alters are outside the original scope and billed separately.</p>",
    },
    {
      title: "Confidentiality & Materials",
      body: "<p>{{freelancerName}} will treat all source content and reference materials for {{projectTitle}} as strictly confidential and will not disclose or reuse them beyond this engagement. Any translation memories or glossaries created during the work remain available to the Client. Machine translation will not be used as a substitute for human translation without the Client's prior written consent.</p>",
    },
    {
      title: "Payment & Delivery",
      body: "<p>The total fee of {{formattedAmount}} is payable on a {{scheduleLabel}} basis. Final localized files in {{targetLanguages}} will be released upon receipt of the balance due. Ownership of the delivered translations transfers to the Client on full payment, after which the Client is solely responsible for any post-delivery edits made without {{freelancerName}}'s involvement.</p>",
    },
  ],
},
{
  id: "email-marketing",
  name: "Email Marketing & Automation",
  category: "Marketing",
  icon: "mail",
  tagline: "Campaigns and automated flows that turn your email list into reliable revenue.",
  popular: true,
  workType: "Social Media",
  paymentSchedule: "monthly_retainer",
  scopeDefault:
    "{{freelancerName}} will manage {{clientName}}'s email marketing for {{projectTitle}}, producing {{emailsPerMonth}} campaign email(s) per month inside {{platform}} and building or maintaining the automated flows described below. The engagement includes {{listManagement}} and {{reporting}}, covering up to {{monthlyHours}} hours of work each month. All sends will follow opt-in and anti-spam best practices.",
  scopeLabel: "Email Marketing Scope",
  fillMinutes: 4,
  fields: [
    {
      key: "emailsPerMonth",
      label: "Campaign Emails Per Month",
      type: "number",
      placeholder: "8",
      default: "8",
      required: true,
      hint: "One-off broadcast campaigns, not automated flows.",
    },
    {
      key: "platform",
      label: "Email Platform",
      type: "select",
      required: true,
      default: "Klaviyo",
      options: [
        { value: "Klaviyo", label: "Klaviyo" },
        { value: "Mailchimp", label: "Mailchimp" },
        { value: "ActiveCampaign", label: "ActiveCampaign" },
        { value: "HubSpot", label: "HubSpot" },
      ],
    },
    {
      key: "automations",
      label: "Automated Flows to Build",
      type: "text",
      placeholder: "Welcome, abandoned cart, post-purchase, win-back",
      required: true,
      wide: true,
      hint: "List the automation flows in scope for this retainer.",
    },
    {
      key: "listManagement",
      label: "List Management",
      type: "select",
      required: true,
      default: "list segmentation and growth support",
      options: [
        { value: "no list management (the Client manages the list)", label: "Client manages the list" },
        { value: "basic list hygiene and suppressions", label: "Basic list hygiene & suppressions" },
        { value: "list segmentation and growth support", label: "Segmentation & list growth support" },
      ],
    },
    {
      key: "reporting",
      label: "Reporting",
      type: "select",
      required: true,
      default: "a monthly performance report",
      options: [
        { value: "no formal reporting", label: "No formal reporting" },
        { value: "a monthly performance report", label: "Monthly performance report" },
        { value: "bi-weekly reporting and insights", label: "Bi-weekly reporting & insights" },
      ],
    },
    {
      key: "designLevel",
      label: "Email Design",
      type: "select",
      default: "branded template-based design",
      options: [
        { value: "plain-text, minimal design", label: "Plain-text / minimal" },
        { value: "branded template-based design", label: "Branded template-based" },
        { value: "custom-designed emails", label: "Custom-designed emails" },
      ],
    },
    {
      key: "copywriting",
      label: "Copywriting",
      type: "text",
      placeholder: "Subject lines + full body copy included",
      hint: "Who writes the email copy for campaigns and flows.",
    },
    {
      key: "abTesting",
      label: "A/B Testing",
      type: "text",
      placeholder: "Subject line & send-time testing on key sends",
      hint: "Note any split-testing included in the retainer.",
    },
    {
      key: "monthlyHours",
      label: "Monthly Hours Allocated",
      type: "number",
      placeholder: "20",
      default: "20",
      required: true,
      hint: "Approximate hours included each month.",
    },
    {
      key: "goalsNotes",
      label: "Goals & Notes",
      type: "textarea",
      placeholder: "Target revenue from email, key promotions, calendar, integrations, deliverability concerns...",
      wide: true,
      hint: "Objectives, promo calendar, and anything unique to the account.",
    },
  ],
  extraClauses: [
    {
      title: "Access & Account Ownership",
      body: "<p>The Client will provide {{freelancerName}} with the necessary access to its {{platform}} account, brand assets, and any required integrations. The {{platform}} account, subscriber list, and all data remain the sole property of the Client at all times. {{freelancerName}} will use this access solely to deliver {{projectTitle}} and will not export or reuse the list for any other purpose.</p>",
    },
    {
      title: "Deliverability & Compliance",
      body: "<p>All campaigns and the {{automations}} flows will be sent only to subscribers who have validly opted in, in line with anti-spam and data-protection laws. <strong>The Client is responsible for the lawful origin of its list.</strong> {{freelancerName}} follows deliverability best practices but cannot guarantee specific open, click, inbox-placement, or revenue figures, as these depend on list quality, offers, and factors outside its control.</p>",
    },
    {
      title: "Monthly Retainer & Scope",
      body: "<p>This is a recurring retainer of {{formattedAmount}}, billed in advance on a {{scheduleLabel}} basis and covering up to {{monthlyHours}} hours and {{emailsPerMonth}} campaign(s) per month plus the agreed {{listManagement}} and {{reporting}}. Unused hours do not roll over. Work beyond the monthly allocation, additional flows, or rush requests will be quoted separately before being undertaken.</p>",
    },
    {
      title: "Renewal & Cancellation",
      body: "<p>The retainer renews automatically each month until cancelled. Either party may cancel with at least 30 days' written notice ahead of the next billing cycle; fees already invoiced for the current cycle are non-refundable. On termination, {{freelancerName}} will leave the {{platform}} account and any built {{automations}} flows in working order and hand back full administrative control to the Client.</p>",
    },
  ],
},
{
  id: "influencer-campaign",
  name: "Influencer & Creator Campaign",
  category: "Marketing",
  icon: "star",
  tagline: "Sponsored content created and posted by a creator on behalf of your brand.",
  workType: "Social Media",
  paymentSchedule: "split_50_50",
  scopeDefault:
    "{{freelancerName}} will create and publish {{postCount}} piece(s) of sponsored content for {{clientName}} as part of {{projectTitle}}, distributed across {{platforms}}. The content will consist of {{contentTypes}} delivered to the posting schedule below, with the brand receiving {{usageRights}} and {{exclusivity}} as agreed. All sponsored content will be clearly disclosed as a paid partnership in line with advertising guidelines.",
  scopeLabel: "Campaign Scope",
  fillMinutes: 4,
  fields: [
    {
      key: "postCount",
      label: "Number of Posts",
      type: "number",
      placeholder: "3",
      default: "3",
      required: true,
      hint: "Total pieces of sponsored content in this campaign.",
    },
    {
      key: "platforms",
      label: "Platforms",
      type: "text",
      placeholder: "Instagram, TikTok, YouTube",
      required: true,
      hint: "Where the content will be published.",
    },
    {
      key: "contentTypes",
      label: "Content Types",
      type: "select",
      required: true,
      default: "reels and short-form video",
      options: [
        { value: "reels and short-form video", label: "Reels / short-form video" },
        { value: "stories", label: "Stories" },
        { value: "feed posts and carousels", label: "Feed posts / carousels" },
        { value: "a mix of reels, stories and feed posts", label: "Mixed (reels, stories & posts)" },
      ],
    },
    {
      key: "exclusivity",
      label: "Category Exclusivity",
      type: "select",
      required: true,
      default: "30 days of same-category exclusivity",
      options: [
        { value: "no category exclusivity", label: "No exclusivity" },
        { value: "30 days of same-category exclusivity", label: "30 days, same category" },
        { value: "90 days of same-category exclusivity", label: "90 days, same category" },
      ],
    },
    {
      key: "usageRights",
      label: "Content Usage Rights",
      type: "select",
      required: true,
      default: "brand organic re-use for 30 days",
      options: [
        { value: "usage on the creator's own channels only", label: "Creator channels only" },
        { value: "brand organic re-use for 30 days", label: "Brand organic re-use, 30 days" },
        { value: "perpetual brand organic re-use", label: "Brand organic re-use, perpetual" },
        { value: "paid ad usage through whitelisting", label: "Paid ad usage (whitelisting)" },
      ],
    },
    {
      key: "whitelisting",
      label: "Whitelisting / Paid Amplification",
      type: "select",
      default: "no whitelisting",
      options: [
        { value: "no whitelisting", label: "No whitelisting" },
        { value: "TikTok Spark or Meta Partnership Ads whitelisting", label: "TikTok Spark / Meta Partnership Ads" },
        { value: "full ad-account whitelisting", label: "Full ad-account whitelisting" },
      ],
    },
    {
      key: "approvalProcess",
      label: "Content Approval",
      type: "text",
      placeholder: "One round of pre-publish approval",
      hint: "How drafts are reviewed before going live.",
    },
    {
      key: "postingSchedule",
      label: "Posting Schedule",
      type: "text",
      placeholder: "1 reel/week across 3 weeks, launch on the 15th",
      required: true,
      wide: true,
      hint: "Dates or cadence for publishing the content.",
    },
    {
      key: "campaignBrief",
      label: "Campaign Brief & Messaging",
      type: "textarea",
      placeholder: "Key messages, hashtags, mandatory mentions, do's and don'ts, links, discount codes...",
      wide: true,
      hint: "Talking points, required tags, and creative guardrails.",
    },
  ],
  extraClauses: [
    {
      title: "Content Approval & Creative Control",
      body: "<p>{{freelancerName}} will submit each of the {{postCount}} piece(s) for the Client's review before publishing, allowing one round of reasonable revisions per the approval process. While the Client may guide messaging through the brief, <strong>final creative execution and the creator's authentic voice remain with {{freelancerName}}</strong>, and the Client will not require edits that conflict with platform rules or advertising-disclosure requirements.</p>",
    },
    {
      title: "Usage Rights & Whitelisting",
      body: "<p>Subject to full payment, the Client receives {{usageRights}} to the content created for {{projectTitle}}, including any {{whitelisting}} arrangement agreed. Usage outside these terms — extended duration, additional platforms, or paid amplification beyond what is stated — requires a separate licensing fee. {{freelancerName}} retains ownership and the right to feature the content on its own channels and portfolio.</p>",
    },
    {
      title: "Exclusivity & Disclosure",
      body: "<p>{{freelancerName}} agrees to {{exclusivity}}, refraining from promoting directly competing brands for the stated period across {{platforms}}. All sponsored content will be clearly labelled as a paid partnership in accordance with FTC, ASA, and platform guidelines. <strong>The Client warrants that any claims, products, and assets it provides are accurate and lawful</strong>, and will indemnify {{freelancerName}} against issues arising from them.</p>",
    },
    {
      title: "Payment, Performance & Posting",
      body: "<p>The agreed fee of {{formattedAmount}} is payable on a {{scheduleLabel}} basis and is for content creation and posting, not for guaranteed reach, engagement, or sales, which depend on the platform algorithm and audience. Once published, the content will remain live for the agreed period; <strong>early removal at the Client's request does not entitle the Client to a refund</strong>.</p>",
    },
  ],
},
{
  id: "ppc-ads",
  name: "Paid Ads (PPC) Management",
  category: "Marketing",
  icon: "target",
  tagline: "Hands-on management of your paid ad campaigns to maximize return on spend.",
  workType: "Social Media",
  paymentSchedule: "monthly_retainer",
  scopeDefault:
    "{{freelancerName}} will plan, launch, and manage {{clientName}}'s paid advertising for {{projectTitle}} across {{platforms}}, overseeing approximately {{currencySymbol}}{{adBudget}} in monthly ad spend. The engagement is charged under a {{feeModel}} and includes {{reporting}} plus up to {{monthlyHours}} hours of optimization work each month against the target KPIs below. Ad spend is billed by the platforms directly to the Client and is separate from this management fee.",
  scopeLabel: "Ad Management Scope",
  fillMinutes: 4,
  fields: [
    {
      key: "platforms",
      label: "Ad Platforms",
      type: "select",
      required: true,
      default: "Google and Meta",
      options: [
        { value: "Google Ads", label: "Google Ads" },
        { value: "Meta (Facebook and Instagram)", label: "Meta (Facebook & Instagram)" },
        { value: "Google and Meta", label: "Google + Meta" },
        { value: "multiple platforms including TikTok and LinkedIn", label: "Multi-platform (incl. TikTok/LinkedIn)" },
      ],
    },
    {
      key: "adBudget",
      label: "Monthly Ad Budget Managed",
      type: "number",
      placeholder: "10000",
      default: "10000",
      required: true,
      hint: "Total monthly media spend, paid by the Client to the platforms.",
    },
    {
      key: "feeModel",
      label: "Management Fee Model",
      type: "select",
      required: true,
      default: "flat monthly fee",
      options: [
        { value: "flat monthly fee", label: "Flat monthly fee" },
        { value: "percentage of ad spend", label: "Percentage of ad spend" },
        { value: "flat fee plus a performance bonus", label: "Flat fee + performance bonus" },
      ],
    },
    {
      key: "campaignTypes",
      label: "Campaign Types",
      type: "select",
      default: "a mixed funnel of prospecting and retargeting",
      options: [
        { value: "search and intent campaigns", label: "Search / intent" },
        { value: "paid social prospecting campaigns", label: "Paid social / prospecting" },
        { value: "retargeting campaigns", label: "Retargeting" },
        { value: "a mixed funnel of prospecting and retargeting", label: "Mixed funnel (prospecting + retargeting)" },
      ],
    },
    {
      key: "reporting",
      label: "Reporting",
      type: "select",
      required: true,
      default: "a monthly report",
      options: [
        { value: "a monthly report", label: "Monthly report" },
        { value: "a bi-weekly report", label: "Bi-weekly report" },
        { value: "a live dashboard with a monthly review call", label: "Live dashboard + monthly review call" },
      ],
    },
    {
      key: "creativeResponsibility",
      label: "Ad Creative",
      type: "text",
      placeholder: "Client provides assets; freelancer writes ad copy",
      hint: "Who supplies images/video vs. ad copy and headlines.",
    },
    {
      key: "landingPages",
      label: "Landing Pages",
      type: "text",
      placeholder: "Client-provided; freelancer advises on CRO",
      hint: "Note responsibility for landing pages and tracking setup.",
    },
    {
      key: "monthlyHours",
      label: "Monthly Hours Allocated",
      type: "number",
      placeholder: "15",
      default: "15",
      required: true,
      hint: "Approximate optimization hours included each month.",
    },
    {
      key: "targetKpis",
      label: "Target KPIs",
      type: "textarea",
      placeholder: "Target ROAS 4x, CPA under $30, scale to $15k/mo spend while holding efficiency, lead volume goals...",
      wide: true,
      required: true,
      hint: "The metrics this campaign is being optimized toward.",
    },
  ],
  extraClauses: [
    {
      title: "Ad Spend Is Separate",
      body: "<p><strong>The management fee of {{formattedAmount}} does not include media/ad spend.</strong> All advertising spend on {{platforms}} — budgeted at approximately {{currencySymbol}}{{adBudget}} per month — is billed by the ad platforms directly to the Client's own payment method and remains the Client's responsibility. {{freelancerName}} never funds ad spend and is not liable for platform billing, spend fluctuations, or charges incurred on the Client's accounts.</p>",
    },
    {
      title: "Account Access & Ownership",
      body: "<p>The Client will grant {{freelancerName}} the necessary access to its {{platforms}} ad accounts, analytics, and billing while retaining full ownership of those accounts, audiences, and data. The Client is responsible for providing creative assets and a functioning landing-page and tracking setup as noted. On termination, {{freelancerName}} will return full administrative control and will not retain or reuse the Client's audiences or data.</p>",
    },
    {
      title: "Performance Disclaimer",
      body: "<p>{{freelancerName}} will manage the campaigns diligently toward the agreed KPIs and optimize against the targets described above. However, paid advertising results depend on market conditions, competition, budget, creative, and platform algorithms, so <strong>{{freelancerName}} does not guarantee any specific ROAS, cost-per-acquisition, conversion, or revenue figure</strong>. The {{reporting}} cadence will keep the Client informed of performance throughout.</p>",
    },
    {
      title: "Retainer, Fee Model & Renewal",
      body: "<p>This recurring engagement is billed in advance on a {{scheduleLabel}} basis under the {{feeModel}} and covers up to {{monthlyHours}} hours of management per month. Where the fee is tied to ad spend, it will be recalculated if budgets change materially. The retainer renews automatically each month and may be cancelled by either party with at least 30 days' written notice; fees for the current cycle are non-refundable once campaigns are live.</p>",
    },
  ],
},

  // ── Premium · Business & Legal ───────────────────────────────────────────
{
  id: "coaching-program",
  name: "Coaching & Mentorship Program",
  category: "Business",
  icon: "graduation",
  tagline: "Structure a transformational coaching package with clear cadence, deliverables, and expectations.",
  workType: "Consulting",
  paymentSchedule: "split_50_50",
  scopeLabel: "Program Overview",
  scopeDefault: "{{freelancerName}} will deliver a {{programLength}} coaching and mentorship program for {{clientName}}, structured around {{sessionsPerMonth}} sessions per month delivered in a {{sessionFormat}} format. Each session runs approximately {{sessionLength}} minutes and is designed to drive measurable progress toward the client's stated goals. Between sessions, {{freelancerName}} will provide the support and resources outlined in the deliverables below to reinforce learning and accountability.",
  fields: [
    { key: "programLength", label: "Program Length", type: "select", required: true, default: "12-week", hint: "Total duration of the engagement.", options: [
      { value: "6-week", label: "6 Weeks" },
      { value: "12-week", label: "12 Weeks" },
      { value: "3-month", label: "3 Months" },
      { value: "6-month", label: "6 Months" },
    ] },
    { key: "sessionsPerMonth", label: "Sessions Per Month", type: "number", required: true, default: "4", placeholder: "4", hint: "Number of live sessions included each month." },
    { key: "sessionLength", label: "Session Length (minutes)", type: "number", required: true, default: "60", placeholder: "60" },
    { key: "sessionFormat", label: "Session Format", type: "select", required: true, default: "one-to-one private", options: [
      { value: "one-to-one private", label: "1:1 Private" },
      { value: "small-group", label: "Group" },
      { value: "hybrid (1:1 and group)", label: "Hybrid (1:1 + Group)" },
    ] },
    { key: "deliveryMethod", label: "Delivery Method", type: "select", required: true, default: "video call", options: [
      { value: "video call", label: "Video Call" },
      { value: "phone", label: "Phone" },
      { value: "in person", label: "In Person" },
    ] },
    { key: "deliverables", label: "Deliverables & Resources", type: "textarea", required: true, wide: true, placeholder: "Session recordings, worksheets, accountability check-ins, email support between sessions...", hint: "What the client receives in addition to live sessions." },
    { key: "communicationAccess", label: "Between-Session Access", type: "text", placeholder: "Email + async voice notes, replies within 48 hours", wide: true },
    { key: "cancellationPolicy", label: "Cancellation & Rescheduling Policy", type: "textarea", required: true, wide: true, default: "Sessions may be rescheduled with at least 24 hours' notice. Sessions cancelled with less notice, or missed without notice, are forfeited.", hint: "Set clear expectations to protect your time." },
    { key: "startDate", label: "Program Start Date", type: "date", required: true },
  ],
  extraClauses: [
    { title: "No Guarantee of Results", body: "<p>{{freelancerName}} brings professional experience and a structured methodology to this engagement, but <strong>does not guarantee any specific outcome, result, or financial return</strong>. Coaching is a collaborative process, and the client's progress depends substantially on their own effort, participation, and implementation. {{clientName}} acknowledges that results will vary.</p>" },
    { title: "Attendance & Forfeited Sessions", body: "<p>The program includes {{sessionsPerMonth}} sessions per month. Per the agreed policy: {{cancellationPolicy}} Unused sessions do not roll over beyond the program term unless expressly agreed in writing.</p>" },
    { title: "Confidentiality", body: "<p>All personal, business, and financial information shared during sessions will be treated as confidential by {{freelancerName}} and will not be disclosed to third parties without {{clientName}}'s consent, except as required by law.</p>" },
    { title: "Client Commitment", body: "<p>{{clientName}} agrees to attend scheduled sessions, complete agreed-upon assignments, and engage honestly in the process. The value of this {{programLength}} program is realized through consistent participation.</p>" },
  ],
  fillMinutes: 4,
},
{
  id: "event-planning",
  name: "Event Planning & Coordination",
  category: "Business",
  icon: "calendar",
  tagline: "Coordinate a flawless event with clear scope, vendor handling, and on-site coverage.",
  workType: "General Services",
  paymentSchedule: "split_50_50",
  scopeLabel: "Event Scope",
  scopeDefault: "{{freelancerName}} will plan and coordinate a {{eventType}} on behalf of {{clientName}}, scheduled for {{eventDate}} with an estimated {{guestCount}} guests. The engagement includes {{venueCoordination}} and {{vendorManagement}}, along with up to {{onSiteHours}} hours of on-site coordination on the day of the event. {{freelancerName}} will manage timelines, logistics, and the deliverables outlined below to ensure a seamless experience.",
  fields: [
    { key: "eventType", label: "Event Type", type: "select", required: true, default: "corporate event", options: [
      { value: "corporate event", label: "Corporate Event" },
      { value: "wedding", label: "Wedding" },
      { value: "conference", label: "Conference" },
      { value: "private party", label: "Private Party" },
    ] },
    { key: "eventDate", label: "Event Date", type: "date", required: true },
    { key: "guestCount", label: "Estimated Guest Count", type: "number", required: true, default: "100", placeholder: "100" },
    { key: "venueCoordination", label: "Venue Coordination", type: "select", required: true, default: "full venue sourcing and coordination", options: [
      { value: "full venue sourcing and coordination", label: "Full venue sourcing & coordination" },
      { value: "coordination with the client-chosen venue", label: "Coordination with client-chosen venue" },
      { value: "no venue coordination", label: "No venue coordination" },
    ] },
    { key: "vendorManagement", label: "Vendor Management", type: "select", required: true, default: "full vendor sourcing and management", options: [
      { value: "full vendor sourcing and management", label: "Full vendor sourcing & management" },
      { value: "management of client-selected vendors", label: "Manage client-selected vendors" },
      { value: "day-of vendor coordination only", label: "Day-of vendor coordination only" },
    ] },
    { key: "onSiteHours", label: "On-Site Hours (day of event)", type: "number", required: true, default: "8", placeholder: "8", hint: "Hours of on-site presence included; additional hours billed separately." },
    { key: "planningStartDate", label: "Planning Start Date", type: "date" },
    { key: "deliverables", label: "Planning Deliverables", type: "textarea", required: true, wide: true, placeholder: "Master timeline, vendor shortlist, floor plan, run-of-show, budget tracker, day-of coordination...", hint: "What the client receives throughout planning." },
    { key: "additionalServices", label: "Additional Services & Notes", type: "text", wide: true, placeholder: "Rehearsal coordination, post-event breakdown supervision..." },
  ],
  extraClauses: [
    { title: "Third-Party Vendor Costs", body: "<p>The fees under this agreement cover {{freelancerName}}'s planning and coordination services only. <strong>All third-party costs — including venue, catering, rentals, entertainment, florals, and other vendor fees — are separate</strong> and are the responsibility of {{clientName}}, payable directly to those vendors unless otherwise agreed in writing.</p>" },
    { title: "Cancellation & Force Majeure", body: "<p>If {{clientName}} cancels the {{eventType}}, fees for work already performed are non-refundable. Neither party shall be liable for failure to perform due to events beyond reasonable control — including natural disasters, government action, or public-health emergencies. In such cases, {{freelancerName}} will work in good faith to reschedule or adapt the engagement.</p>" },
    { title: "On-Site Coordination", body: "<p>On-site coordination is included for up to {{onSiteHours}} hours surrounding the event on {{eventDate}}. Time beyond this allowance will be billed at {{freelancerName}}'s standard hourly rate, agreed in advance where practical.</p>" },
    { title: "Final Headcount & Decisions", body: "<p>{{clientName}} is responsible for providing a confirmed guest count of approximately {{guestCount}} and final decisions by the deadlines communicated by {{freelancerName}}. Delays in approvals may affect vendor availability and pricing.</p>" },
  ],
  fillMinutes: 4,
},
{
  id: "bookkeeping",
  name: "Bookkeeping & Accounting Retainer",
  category: "Business",
  icon: "calculator",
  tagline: "A clean monthly retainer for ongoing bookkeeping, reconciliation, and reporting.",
  workType: "Consulting",
  paymentSchedule: "monthly_retainer",
  scopeLabel: "Scope of Services",
  scopeDefault: "{{freelancerName}} will provide ongoing bookkeeping services to {{clientName}} on a monthly retainer basis, handling an estimated {{transactionVolume}} transactions per month within {{accountingSoftware}}. Services include {{reconciliationFrequency}} reconciliation and the delivery of {{reportsDelivered}} each period. The engagement covers approximately {{monthlyHours}} hours of work per month, with additional hours agreed in advance.",
  fields: [
    { key: "transactionVolume", label: "Monthly Transaction Volume", type: "number", required: true, default: "200", placeholder: "200", hint: "Approximate number of transactions per month." },
    { key: "accountingSoftware", label: "Accounting Software", type: "select", required: true, default: "QuickBooks", options: [
      { value: "QuickBooks", label: "QuickBooks" },
      { value: "Xero", label: "Xero" },
      { value: "Wave", label: "Wave" },
      { value: "FreshBooks", label: "FreshBooks" },
    ] },
    { key: "reportsDelivered", label: "Reports Delivered", type: "select", required: true, default: "a Profit & Loss statement and Balance Sheet", options: [
      { value: "a Profit & Loss statement and Balance Sheet", label: "P&L + Balance Sheet" },
      { value: "Profit & Loss, Balance Sheet, and Cash Flow statements", label: "P&L, Balance Sheet + Cash Flow" },
      { value: "a full reporting package with custom reports", label: "Full package + custom reports" },
    ] },
    { key: "reconciliationFrequency", label: "Reconciliation Frequency", type: "select", required: true, default: "monthly", options: [
      { value: "weekly", label: "Weekly" },
      { value: "bi-weekly", label: "Bi-Weekly" },
      { value: "monthly", label: "Monthly" },
    ] },
    { key: "monthlyHours", label: "Estimated Monthly Hours", type: "number", required: true, default: "10", placeholder: "10" },
    { key: "accountsCovered", label: "Accounts Covered", type: "text", wide: true, placeholder: "1 business checking, 1 credit card, 1 savings", hint: "Bank and credit accounts included in the retainer." },
    { key: "deliveryDeadline", label: "Monthly Reporting Deadline", type: "text", placeholder: "By the 10th of the following month" },
    { key: "additionalServices", label: "Additional Services & Exclusions", type: "textarea", wide: true, placeholder: "Payroll, invoicing, AP/AR, and tax filing are excluded unless added in writing.", hint: "Clarify what is in and out of scope." },
    { key: "startDate", label: "Retainer Start Date", type: "date", required: true },
  ],
  extraClauses: [
    { title: "No Tax or Legal Advice", body: "<p>{{freelancerName}} provides bookkeeping and record-keeping services only and <strong>is not acting as a licensed CPA, tax preparer, attorney, or financial advisor</strong>. Nothing in this engagement constitutes tax, legal, audit, or investment advice. {{clientName}} is responsible for filing returns and should consult a qualified professional for such matters.</p>" },
    { title: "Data Access & Confidentiality", body: "<p>{{clientName}} will provide {{freelancerName}} with timely, secure access to the {{accountingSoftware}} file, bank feeds, and supporting documentation required to perform the work. {{freelancerName}} will keep all financial data strictly confidential, use it solely for the purposes of this engagement, and apply reasonable safeguards to protect it.</p>" },
    { title: "Accuracy & Source Documents", body: "<p>The accuracy of {{reportsDelivered}} depends on complete and correct information from {{clientName}}. {{freelancerName}} relies on the records and explanations provided and is not responsible for errors arising from missing, late, or inaccurate source documents.</p>" },
    { title: "Scope & Additional Hours", body: "<p>The retainer covers approximately {{monthlyHours}} hours per month for the agreed scope. Work beyond this — including catch-up bookkeeping, cleanup of prior periods, or out-of-scope projects — will be quoted and approved separately before commencing.</p>" },
  ],
  fillMinutes: 4,
},
{
  id: "master-services-agreement",
  name: "Master Services Agreement (MSA)",
  category: "Legal",
  icon: "scroll",
  popular: true,
  tagline: "An umbrella agreement that governs all future Statements of Work between the parties.",
  workType: "General Services",
  paymentSchedule: "net_30",
  scopeLabel: "Overview",
  scopeDefault: "This Master Services Agreement establishes the general terms under which {{freelancerName}} will provide services to {{clientName}} on an {{relationshipType}} basis. The specific services, deliverables, fees, and timelines for each engagement will be defined in separate Statements of Work executed under this Agreement using the following process: {{sowProcess}}. This Agreement governs the relationship for an initial term of {{termLength}} and is interpreted under the laws of {{governingJurisdiction}}.",
  fields: [
    { key: "relationshipType", label: "Relationship Type", type: "select", required: true, default: "ongoing, open-ended", options: [
      { value: "ongoing, open-ended", label: "Ongoing / Open-ended" },
      { value: "recurring, project-based", label: "Recurring Project-Based" },
      { value: "preferred-vendor", label: "Preferred Vendor" },
    ] },
    { key: "sowProcess", label: "Statement of Work Process", type: "textarea", required: true, wide: true, default: "Each SOW must be in writing, reference this Agreement, and be signed by both parties before work begins. In any conflict between an SOW and this Agreement, this Agreement controls unless the SOW expressly states otherwise.", hint: "How individual engagements are initiated and approved." },
    { key: "governingJurisdiction", label: "Governing Jurisdiction", type: "text", required: true, placeholder: "State of California, USA", hint: "The state/country whose laws govern this Agreement." },
    { key: "liabilityCap", label: "Limitation of Liability", type: "select", required: true, default: "the total fees paid under the relevant Statement of Work", options: [
      { value: "the total fees paid under the relevant Statement of Work", label: "Capped at fees paid under the relevant SOW" },
      { value: "the total fees paid in the preceding twelve months", label: "Capped at fees paid in prior 12 months" },
      { value: "the custom amount specified in this Agreement", label: "Custom capped amount" },
    ] },
    { key: "liabilityCapAmount", label: "Custom Liability Cap Amount", type: "text", placeholder: "$10,000", hint: "Only if you selected a custom capped amount above." },
    { key: "termLength", label: "Initial Term Length", type: "select", required: true, default: "12 months", options: [
      { value: "12 months", label: "12 Months" },
      { value: "24 months", label: "24 Months" },
      { value: "a continuous period until terminated", label: "Continuous until terminated" },
    ] },
    { key: "autoRenew", label: "Auto-Renewal", type: "select", required: true, default: "automatically renews for successive terms", options: [
      { value: "automatically renews for successive terms", label: "Auto-renews for successive terms" },
      { value: "does not automatically renew", label: "Does not auto-renew" },
    ] },
    { key: "noticePeriod", label: "Termination Notice Period", type: "text", required: true, default: "30 days", placeholder: "30 days", hint: "Written notice required to terminate." },
    { key: "effectiveDate", label: "Effective Date", type: "date", required: true },
  ],
  extraClauses: [
    { title: "Statements of Work", body: "<p>Each specific engagement shall be documented in a Statement of Work (SOW). {{sowProcess}} Each fully executed SOW is incorporated into and governed by this Agreement. This Agreement does not obligate {{clientName}} to issue, or {{freelancerName}} to accept, any particular SOW.</p>" },
    { title: "Limitation of Liability", body: "<p>To the maximum extent permitted by law, neither party shall be liable for any indirect, incidental, special, or consequential damages. {{freelancerName}}'s total aggregate liability arising out of or related to this Agreement and any SOW shall be <strong>limited as follows: {{liabilityCap}}</strong>. This limitation does not apply to liability arising from gross negligence, willful misconduct, or breach of confidentiality.</p>" },
    { title: "Independent Contractor", body: "<p>{{freelancerName}} performs all services as an independent contractor and not as an employee, partner, or agent of {{clientName}}. {{freelancerName}} is responsible for their own taxes, insurance, and business expenses, and retains control over the manner and means by which services are performed.</p>" },
    { title: "Governing Law & Term", body: "<p>This Agreement is governed by the laws of {{governingJurisdiction}}, without regard to its conflict-of-laws principles. It remains in effect for the initial term of {{termLength}} and may be terminated by either party upon {{noticePeriod}} written notice. Termination of this Agreement does not affect any SOW then in progress unless that SOW is also terminated.</p>" },
  ],
  fillMinutes: 4,
},
{
  id: "ip-assignment",
  name: "IP Assignment Agreement",
  category: "Legal",
  icon: "stamp",
  tagline: "Cleanly transfer ownership of the deliverables to your client upon payment.",
  workType: "General Services",
  paymentSchedule: "full_upfront",
  omitRevisions: true,
  scopeLabel: "Assigned Work",
  scopeDefault: "Under this Agreement, {{freelancerName}} assigns to {{clientName}} all intellectual property rights in the work described below, with such assignment taking effect {{assignmentTrigger}}. The assigned work comprises: {{workDescription}}. Subject to the terms herein, moral rights are {{moralRights}}, and {{freelancerName}} retains portfolio rights as follows: such use is {{portfolioRights}}.",
  fields: [
    { key: "workDescription", label: "Description of Work", type: "textarea", required: true, wide: true, placeholder: "All designs, source code, copy, illustrations, and other deliverables created for the the Client project, including all drafts and intermediate materials.", hint: "Define precisely what IP is being assigned." },
    { key: "assignmentTrigger", label: "Assignment Trigger", type: "select", required: true, default: "upon receipt of full payment", options: [
      { value: "upon receipt of full payment", label: "On receipt of full payment" },
      { value: "upon signing of this Agreement", label: "On signing of this Agreement" },
    ] },
    { key: "moralRights", label: "Moral Rights", type: "select", required: true, default: "waived to the extent permitted by law", options: [
      { value: "waived to the extent permitted by law", label: "Waived to the extent permitted by law" },
      { value: "retained by the creator", label: "Retained by the creator" },
    ] },
    { key: "preExistingIp", label: "Pre-Existing IP / License-Back", type: "select", required: true, default: "licensed back to the Client on a perpetual, non-exclusive basis", options: [
      { value: "licensed back to the Client on a perpetual, non-exclusive basis", label: "Licensed back (perpetual, non-exclusive)" },
      { value: "included in the assignment", label: "Included in the assignment" },
      { value: "excluded and remains the creator's property", label: "Excluded; remains creator's property" },
    ] },
    { key: "portfolioRights", label: "Portfolio Rights", type: "select", required: true, default: "permitted for display in the creator's portfolio", options: [
      { value: "permitted for display in the creator's portfolio", label: "Permitted to display in portfolio" },
      { value: "permitted for portfolio display after public launch", label: "Permitted after public launch" },
      { value: "not permitted", label: "Not permitted" },
    ] },
    { key: "governingJurisdiction", label: "Governing Jurisdiction", type: "text", required: true, placeholder: "State of New York, USA", hint: "The state/country whose laws govern this assignment." },
    { key: "thirdPartyMaterials", label: "Third-Party / Licensed Materials", type: "textarea", wide: true, placeholder: "Stock photography, fonts, and open-source libraries licensed under their respective terms; not owned by either party.", hint: "List anything not originated by the creator." },
    { key: "effectiveDate", label: "Effective Date", type: "date", required: true },
  ],
  extraClauses: [
    { title: "Assignment of Rights", body: "<p>{{freelancerName}} hereby irrevocably assigns to {{clientName}} all right, title, and interest worldwide in and to the assigned work — including copyrights, and where applicable patent, trademark, and trade-secret rights — together with the right to enforce them. This assignment takes effect {{assignmentTrigger}}. Until that point, all rights remain with {{freelancerName}}.</p>" },
    { title: "Pre-Existing & Third-Party Materials", body: "<p>The assigned work may incorporate pre-existing materials owned by {{freelancerName}} or licensed from third parties. Such pre-existing IP is {{preExistingIp}}. Any third-party or licensed materials — {{thirdPartyMaterials}} — remain subject to their original license terms, and {{clientName}} is responsible for maintaining required licenses.</p>" },
    { title: "Moral Rights", body: "<p>To the fullest extent permitted under the laws of {{governingJurisdiction}}, moral rights in the assigned work are {{moralRights}}. Where such rights cannot be assigned or waived, {{freelancerName}} agrees not to assert them in a manner that interferes with {{clientName}}'s use of the work.</p>" },
    { title: "Further Assurances", body: "<p>{{freelancerName}} agrees to execute any further documents and take any reasonable actions {{clientName}} may request to perfect, record, or enforce the assignment of rights described herein, at {{clientName}}'s reasonable expense. With respect to showcasing the work, such use is {{portfolioRights}}.</p>" },
  ],
  fillMinutes: 4,
},

  // ════════════════════════════════════════════════════════════════════════
  // DREAM LIBRARY — flagship, in-depth templates engineered for developers.
  // ════════════════════════════════════════════════════════════════════════

  // ── Dream · SaaS & Equity ───────────────────────────────
{
  id: "saas-platform-build",
  name: "End-to-End SaaS Platform Build",
  category: "Development",
  icon: "dashboard",
  tagline: "A complete, production-grade SaaS platform built from architecture to launch.",
  popular: true,
  workType: "Web Development",
  paymentSchedule: "milestone",
  scopeLabel: "Platform Scope & Architecture",
  scopeDefault: "{{freelancerName}} will design, build, and deploy a production-ready SaaS platform for {{clientName}} titled \"{{projectTitle}}\", built on {{techStack}} and {{hosting}}. The system will follow a {{architecture}} with {{authModel}}, {{billingProvider}}, and approximately {{coreModules}} core modules, delivered across {{environments}} with {{cicd}}. Engineering will target {{coverageTarget}}, and the codebase will be {{sourceHandover}}. The platform is scheduled to reach production launch by {{launchDate}}, with progress released and invoiced against milestones per the {{scheduleLabel}} terms for a total of {{formattedAmount}}.",
  fields: [
    { key: "techStack", label: "Primary Tech Stack", type: "text", placeholder: "Next.js, TypeScript, PostgreSQL, Prisma", required: true, hint: "Frameworks, language, and database powering the build." },
    { key: "hosting", label: "Hosting / Cloud", type: "select", required: true, default: "hosted on AWS", hint: "Where the platform runs in production.", options: [
      { value: "hosted on AWS", label: "AWS" },
      { value: "hosted on Google Cloud Platform", label: "GCP" },
      { value: "deployed on Vercel with a managed database", label: "Vercel" },
      { value: "hosted on the Client's existing cloud infrastructure", label: "Client cloud" }
    ] },
    { key: "architecture", label: "Architecture", type: "select", required: true, default: "a modular monolith with clear service boundaries", hint: "Overall system shape.", options: [
      { value: "a single deployable monolith", label: "Monolith" },
      { value: "a modular monolith with clear service boundaries", label: "Modular monolith" },
      { value: "a microservices architecture with independently deployable services", label: "Microservices" }
    ] },
    { key: "authModel", label: "Authentication Model", type: "select", required: true, default: "multi-tenant authentication with role-based access control", hint: "How users sign in and are isolated.", options: [
      { value: "email and password authentication with secure session handling", label: "Email/password" },
      { value: "multi-tenant authentication with role-based access control", label: "Multi-tenant + RBAC" },
      { value: "single sign-on (SSO) with social and enterprise identity providers", label: "SSO" },
      { value: "passwordless authentication with magic links and one-time codes", label: "Passwordless" }
    ] },
    { key: "billingProvider", label: "Billing / Subscriptions", type: "select", required: true, default: "subscription billing powered by Stripe", hint: "Payment and subscription engine.", options: [
      { value: "subscription billing powered by Stripe", label: "Stripe" },
      { value: "subscription and metered billing through Paddle", label: "Paddle" },
      { value: "usage-based billing with metered invoicing", label: "Usage-based" },
      { value: "no billing in this phase, with the integration deferred to a later release", label: "Deferred" }
    ] },
    { key: "coreModules", label: "Number of Core Modules", type: "number", placeholder: "6", required: true, default: "6", hint: "Distinct functional areas in scope (e.g. dashboard, billing, admin)." },
    { key: "environments", label: "Environments", type: "select", required: true, default: "separate staging and production environments", hint: "Deployment environments provisioned.", options: [
      { value: "a single production environment", label: "Production only" },
      { value: "separate staging and production environments", label: "Staging + production" },
      { value: "isolated development, staging, and production environments", label: "Dev + staging + prod" }
    ] },
    { key: "cicd", label: "CI/CD Pipeline", type: "select", required: true, default: "an automated CI/CD pipeline with tests and previews on every pull request", hint: "How code ships to each environment.", options: [
      { value: "manual deployments documented in a runbook", label: "Manual + runbook" },
      { value: "an automated CI/CD pipeline with tests and previews on every pull request", label: "Full CI/CD" },
      { value: "an automated pipeline with blue-green production releases", label: "Blue-green CI/CD" }
    ] },
    { key: "coverageTarget", label: "Test Coverage Target", type: "select", required: true, default: "at least 70% automated test coverage across critical paths", hint: "Quality bar for automated testing.", options: [
      { value: "smoke tests covering critical user journeys", label: "Smoke tests" },
      { value: "at least 70% automated test coverage across critical paths", label: "70% coverage" },
      { value: "at least 90% automated test coverage with end-to-end suites", label: "90% + E2E" }
    ] },
    { key: "sourceHandover", label: "Source Code Handover", type: "select", required: true, default: "handed over in full to the Client's repository on final payment", hint: "How and when the Client receives the code.", options: [
      { value: "handed over in full to the Client's repository on final payment", label: "On final payment" },
      { value: "developed directly in the Client's repository from day one", label: "Client repo from day 1" },
      { value: "delivered as a complete archive plus deployment documentation", label: "Archive + docs" }
    ] },
    { key: "launchDate", label: "Target Launch Date", type: "date", required: true, hint: "Planned date for production go-live." },
    { key: "featureScope", label: "Feature Scope", type: "textarea", placeholder: "Multi-tenant onboarding, admin dashboard, subscription billing, public REST/GraphQL API, audit logging, email notifications, reporting...", required: true, wide: true, hint: "The concrete features and modules included in this build." },
    { key: "nonFunctional", label: "Non-Functional Requirements", type: "textarea", placeholder: "Sub-300ms p95 API latency, 99.9% uptime target, GDPR-compliant data handling, automated daily backups, horizontal scalability to 50k tenants...", wide: true, hint: "Performance, reliability, security, and compliance targets." }
  ],
  extraClauses: [
    { title: "Acceptance Testing & Milestone Sign-Off", body: "<p>Each milestone is considered delivered when the corresponding functionality is deployed to {{environments}} and passes the agreed acceptance criteria. {{clientName}} will review and either approve or return written feedback within five (5) business days; absent feedback in that window, the milestone is deemed accepted and the associated invoice becomes due under the {{scheduleLabel}} terms. Acceptance verifies that the delivered work meets the documented <strong>Feature Scope</strong> and the targets set out in the <strong>Non-Functional Requirements</strong>.</p>" },
    { title: "Source Code & Repository Ownership", body: "<p>All original source code, configuration, and infrastructure-as-code authored by {{freelancerName}} for \"{{projectTitle}}\" will be {{sourceHandover}}. Upon receipt of full and final payment of {{formattedAmount}}, {{freelancerName}} assigns to {{clientName}} all right, title, and interest in that custom codebase, including full {{cicd}} configuration. Until final payment is received, {{freelancerName}} retains ownership of the work product, and any pre-existing libraries, tools, or generic components are licensed to {{clientName}} on a non-exclusive, perpetual basis.</p>" },
    { title: "Third-Party Services & Cloud Costs", body: "<p>The platform relies on external services including {{hosting}} and {{billingProvider}}. All charges for cloud infrastructure, the {{billingProvider}} account, domains, SSL, email delivery, monitoring, and any other third-party API or license are the sole responsibility of {{clientName}} and are billed directly to {{clientName}}'s own accounts. {{freelancerName}} will recommend cost-effective configurations but is not liable for usage-based fees, price changes, or service outages of these providers.</p>" },
    { title: "Security & Data Ownership", body: "<p>{{clientName}} is and remains the sole owner of all customer, tenant, and operational data processed by the platform. {{freelancerName}} will implement reasonable, industry-standard security practices consistent with {{authModel}} and the agreed <strong>Non-Functional Requirements</strong>, including encrypted secrets, least-privilege access, and protection of credentials. {{freelancerName}} will not retain production data or access beyond what is required to deliver the work, and will revoke all access on final handover unless a separate maintenance agreement is in place.</p>" },
    { title: "Change Requests & Scope Management", body: "<p>This agreement covers the {{coreModules}} core modules and functionality described in the <strong>Feature Scope</strong>. Any new feature, module, or material change to the agreed {{architecture}} requested after a milestone is approved constitutes a change request. {{freelancerName}} will provide a written estimate of additional time and cost before proceeding, and approved changes are billed in addition to the {{formattedAmount}} contract value. No change request alters the {{launchDate}} or existing milestones until both parties agree in writing.</p>" },
    { title: "Post-Launch Warranty Window", body: "<p>For thirty (30) days following production launch on {{launchDate}}, {{freelancerName}} will fix, at no additional charge, any reproducible defect where the delivered platform fails to perform as described in the <strong>Feature Scope</strong>. This warranty excludes new features, third-party service failures, changes made by others to the codebase, and issues arising from {{clientName}}'s own configuration. After the warranty window, ongoing maintenance, monitoring, and support are available under a separate retainer.</p>" }
  ],
  fillMinutes: 5
},
{
  id: "technical-cofounder",
  name: "Technical Co-Founder / Equity Build Agreement",
  category: "Development",
  icon: "rocket",
  tagline: "A developer builds the startup's product in exchange for cash plus vesting equity.",
  workType: "Consulting",
  paymentSchedule: "milestone",
  scopeLabel: "Engagement & Equity",
  scopeDefault: "{{freelancerName}} will join {{clientName}} as {{roleTitle}} to architect and build the core product for \"{{projectTitle}}\" on a {{timeCommitment}} basis. In consideration of this work, {{freelancerName}} will receive a cash component of {{formattedAmount}} together with {{equityPercent}}% equity in the company, {{vestingSchedule}}. All product and intellectual property created during the engagement will be {{ipAssignment}}, and the relationship is subject to {{exclusivity}} and {{decisionRights}}. This agreement is governed by the laws of {{jurisdiction}} and runs for {{engagementLength}}, beginning {{startDateLabel}}, with cash released against the milestones below per the {{scheduleLabel}} terms.",
  fields: [
    { key: "roleTitle", label: "Role / Title", type: "text", placeholder: "Technical Co-Founder & CTO", required: true, hint: "The title and function being taken on." },
    { key: "equityPercent", label: "Equity Percentage", type: "number", placeholder: "10", required: true, default: "10", hint: "Fully-diluted ownership stake being granted." },
    { key: "vestingSchedule", label: "Vesting Schedule", type: "select", required: true, default: "vesting over four years with a one-year cliff", hint: "How and when the equity is earned.", options: [
      { value: "vesting over four years with a one-year cliff", label: "4yr / 1yr cliff" },
      { value: "vesting over three years with a six-month cliff", label: "3yr / 6mo cliff" },
      { value: "vesting in equal monthly installments over two years", label: "2yr monthly" },
      { value: "fully vested on completion of the agreed milestones", label: "Milestone-vested" }
    ] },
    { key: "timeCommitment", label: "Time Commitment", type: "select", required: true, default: "full-time", hint: "Weekly availability dedicated to the company.", options: [
      { value: "full-time", label: "Full-time" },
      { value: "part-time (roughly 20 hours per week)", label: "Part-time" },
      { value: "a fractional basis of agreed weekly hours", label: "Fractional" }
    ] },
    { key: "ipAssignment", label: "IP Assignment", type: "select", required: true, default: "assigned to the company in full as it is created", hint: "Who owns the work product.", options: [
      { value: "assigned to the company in full as it is created", label: "Assigned on creation" },
      { value: "assigned to the company upon vesting of the equity grant", label: "Assigned on vesting" },
      { value: "licensed to the company until the equity grant fully vests, then assigned", label: "Licensed then assigned" }
    ] },
    { key: "exclusivity", label: "Exclusivity / Non-Compete", type: "select", required: true, default: "an exclusivity commitment to not build a directly competing product during the engagement", hint: "Restrictions on competing activity.", options: [
      { value: "an exclusivity commitment to not build a directly competing product during the engagement", label: "Non-compete" },
      { value: "a non-exclusive arrangement allowing non-competing outside work", label: "Non-exclusive" },
      { value: "full exclusivity to the company for the duration of the engagement", label: "Fully exclusive" }
    ] },
    { key: "decisionRights", label: "Board / Decision Rights", type: "select", required: true, default: "shared decision rights over the product and technical roadmap", hint: "Governance and authority granted.", options: [
      { value: "shared decision rights over the product and technical roadmap", label: "Shared (technical)" },
      { value: "a board seat with full voting rights", label: "Board seat" },
      { value: "an advisory role with no formal voting rights", label: "Advisory only" },
      { value: "veto rights over technical and architectural decisions", label: "Technical veto" }
    ] },
    { key: "jurisdiction", label: "Governing Jurisdiction", type: "text", placeholder: "Delaware, USA", required: true, hint: "The legal jurisdiction governing this agreement." },
    { key: "engagementLength", label: "Engagement Length", type: "select", required: true, default: "an open-ended term reviewed annually", hint: "Expected duration of the build engagement.", options: [
      { value: "an initial term of six months, renewable by agreement", label: "6 months" },
      { value: "an initial term of twelve months, renewable by agreement", label: "12 months" },
      { value: "an open-ended term reviewed annually", label: "Open-ended" },
      { value: "a term running until the product reaches its first funded milestone", label: "Until first raise" }
    ] },
    { key: "cashFrequency", label: "Cash Component Cadence", type: "select", required: true, default: "released against agreed delivery milestones", hint: "How the cash portion is paid out.", options: [
      { value: "released against agreed delivery milestones", label: "Per milestone" },
      { value: "paid as a reduced monthly stipend", label: "Monthly stipend" },
      { value: "deferred until the company's first external funding round", label: "Deferred to raise" }
    ] },
    { key: "productScope", label: "Product Scope", type: "textarea", placeholder: "Define and build the MVP: multi-tenant web app, onboarding, core workflow engine, billing, admin tooling, public API, analytics, and the initial mobile-responsive experience...", required: true, wide: true, hint: "What the developer is responsible for building." },
    { key: "keyMilestones", label: "Key Milestones", type: "textarea", placeholder: "M1: Architecture & prototype. M2: Private beta with first 10 users. M3: Public launch & billing live. M4: First paying customers and analytics...", required: true, wide: true, hint: "The milestones tied to cash release and progress." }
  ],
  extraClauses: [
    { title: "Equity & Vesting", body: "<p>{{clientName}} grants {{freelancerName}} {{equityPercent}}% of the company's fully-diluted equity, {{vestingSchedule}}, with the cash component of {{formattedAmount}} {{cashFrequency}}. Vesting accrues only while {{freelancerName}} remains actively engaged in the {{roleTitle}} role on a {{timeCommitment}} basis. Unvested equity is forfeited on departure, and the grant is subject to the company's formal cap table, stock plan, and any standard transfer restrictions documented separately and consistent with the laws of {{jurisdiction}}.</p>" },
    { title: "Assignment of Intellectual Property", body: "<p>All code, designs, architecture, documentation, and other work product created by {{freelancerName}} for \"{{projectTitle}}\" will be {{ipAssignment}}. {{freelancerName}} waives any moral rights and agrees to sign any further documents reasonably required to perfect the company's ownership. Any pre-existing tools or generic libraries that {{freelancerName}} incorporates are licensed to {{clientName}} on a perpetual, royalty-free basis so the company can operate the product without restriction.</p>" },
    { title: "Roles & Decision-Making", body: "<p>{{freelancerName}} serves as {{roleTitle}} with {{decisionRights}}, leading the delivery of the <strong>Product Scope</strong> and the <strong>Key Milestones</strong>. Both parties will act in good faith and in the best interests of the company. Material decisions affecting equity, fundraising, or company direction require mutual agreement, and the scope of this role may evolve as the company grows, subject to written amendment of this agreement.</p>" },
    { title: "Confidentiality & Non-Solicitation", body: "<p>{{freelancerName}} will keep confidential all non-public information about {{clientName}}, including the codebase, roadmap, customer data, and financials, both during and after the engagement. For the duration of the engagement and twelve (12) months thereafter, {{freelancerName}} will not solicit the company's employees, contractors, or customers for a competing venture. This obligation operates alongside {{exclusivity}} agreed above.</p>" },
    { title: "Termination & Leaver Provisions", body: "<p>Either party may terminate this {{engagementLength}} engagement with thirty (30) days' written notice. On termination, equity vested up to the departure date is retained by {{freelancerName}} and all unvested equity is forfeited. A departure for cause or material breach is treated as a bad-leaver event, allowing the company to repurchase vested shares at the lower of cost or fair value. All company property, credentials, and the full codebase for \"{{projectTitle}}\" must be returned and access revoked on the final day.</p>" },
    { title: "Independent Contractor — Not Employment", body: "<p>This is an independent contractor and equity-build relationship, not employment. {{freelancerName}} is responsible for their own taxes, insurance, and statutory contributions, and the {{formattedAmount}} cash component and {{equityPercent}}% equity grant constitute the complete consideration for the work. Nothing in this agreement creates an employer-employee relationship, partnership, or entitlement to employee benefits, except as expressly granted through the equity terms and as governed by the laws of {{jurisdiction}}.</p>" }
  ],
  fillMinutes: 5
},

  // ── Dream · DevOps & Migration ───────────────────────────────
{
  id: "devops-cloud",
  name: "DevOps & Cloud Infrastructure Engagement",
  category: "Development",
  icon: "cloud",
  tagline: "Stand up production-grade cloud infrastructure with infrastructure-as-code, CI/CD, monitoring, autoscaling, backups, and security hardening.",
  popular: true,
  workType: "Web Development",
  paymentSchedule: "split_50_50",
  scopeLabel: "Infrastructure Scope",
  scopeDefault: "{{freelancerName}} will design, provision, and harden production cloud infrastructure for {{clientName}} as part of {{projectTitle}}, delivered {{cloudProvider}} and managed {{iacTool}}. The engagement covers automated CI/CD via {{cicdPlatform}}, observability through {{monitoringStack}}, autoscaling, and {{backupDr}}, targeting a sustained {{slaTarget}} availability objective. All infrastructure will be reproducible from version-controlled code, with a documented runbook handover delivered by {{deadlineLabel}}. Work begins {{startDateLabel}} for the agreed fee of {{formattedAmount}} on a {{scheduleLabel}} basis.",
  fields: [
    { key: "cloudProvider", label: "Cloud Provider", type: "select", required: true, hint: "Where the production workloads will run.", default: "provisioned on AWS", options: [
      { value: "provisioned on AWS", label: "AWS" },
      { value: "provisioned on Google Cloud Platform", label: "GCP" },
      { value: "provisioned on Microsoft Azure", label: "Azure" },
      { value: "provisioned across a multi-cloud footprint", label: "Multi-cloud" }
    ] },
    { key: "iacTool", label: "Infrastructure-as-Code Tool", type: "select", required: true, hint: "How infrastructure is defined and versioned.", default: "with infrastructure defined in Terraform", options: [
      { value: "with infrastructure defined in Terraform", label: "Terraform" },
      { value: "with infrastructure defined in Pulumi", label: "Pulumi" },
      { value: "with infrastructure defined in AWS CloudFormation", label: "CloudFormation" }
    ] },
    { key: "cicdPlatform", label: "CI/CD Platform", type: "select", required: true, hint: "Where build and deploy pipelines run.", default: "GitHub Actions", options: [
      { value: "GitHub Actions", label: "GitHub Actions" },
      { value: "GitLab CI/CD", label: "GitLab CI/CD" },
      { value: "CircleCI", label: "CircleCI" }
    ] },
    { key: "environments", label: "Environments", type: "select", required: true, hint: "Deployment tiers to be stood up.", default: "isolated development, staging, and production environments", options: [
      { value: "a single consolidated production environment", label: "Production only" },
      { value: "separate staging and production environments", label: "Staging + Production" },
      { value: "isolated development, staging, and production environments", label: "Dev + Staging + Prod" }
    ] },
    { key: "slaTarget", label: "Uptime / SLA Target", type: "select", required: true, hint: "Availability objective the design targets.", default: "99.9% (≈8.8h downtime/year)", options: [
      { value: "99.5% (≈1.8d downtime/year)", label: "99.5%" },
      { value: "99.9% (≈8.8h downtime/year)", label: "99.9%" },
      { value: "99.95% (≈4.4h downtime/year)", label: "99.95%" },
      { value: "99.99% (≈53m downtime/year)", label: "99.99%" }
    ] },
    { key: "monitoringStack", label: "Monitoring & Alerting", type: "select", required: true, hint: "Observability tooling for metrics, logs, and alerts.", default: "Prometheus and Grafana with alerting to the Client's on-call channel", options: [
      { value: "Prometheus and Grafana with alerting to the Client's on-call channel", label: "Prometheus + Grafana" },
      { value: "Datadog for metrics, logs, and alerting", label: "Datadog" },
      { value: "the cloud provider's native monitoring with CloudWatch-style alerting", label: "Cloud-native" }
    ] },
    { key: "containerization", label: "Containerization & Orchestration", type: "select", required: true, hint: "How workloads are packaged and run.", default: "containerized with Docker and orchestrated on Kubernetes", options: [
      { value: "containerized with Docker and orchestrated on Kubernetes", label: "Docker + Kubernetes" },
      { value: "containerized with Docker on a managed container service", label: "Docker (managed)" },
      { value: "deployed as serverless functions and managed services", label: "Serverless" }
    ] },
    { key: "backupDr", label: "Backup & Disaster Recovery", type: "select", required: true, hint: "Backup cadence and recovery posture.", default: "automated daily backups with a tested disaster-recovery plan", options: [
      { value: "automated daily backups with point-in-time recovery", label: "Daily + PITR" },
      { value: "automated daily backups with a tested disaster-recovery plan", label: "Daily + DR plan" },
      { value: "cross-region replication with automated failover", label: "Cross-region failover" }
    ] },
    { key: "secretsManagement", label: "Secrets Management", type: "text", required: true, placeholder: "e.g. HashiCorp Vault, AWS Secrets Manager", default: "a managed secrets vault with least-privilege access", hint: "Where credentials and keys are stored." },
    { key: "infraScope", label: "Infrastructure Scope", type: "textarea", wide: true, required: true, placeholder: "Networking (VPC, subnets), compute, databases, load balancers, DNS, CDN, autoscaling policies...", hint: "Concrete resources and capabilities to be delivered." },
    { key: "securityCompliance", label: "Security & Compliance Needs", type: "textarea", wide: true, placeholder: "e.g. SOC 2 readiness, encryption at rest/in transit, IAM least-privilege, network isolation, audit logging...", hint: "Hardening requirements and any compliance frameworks in scope." },
    { key: "handoverRunbook", label: "Handover & Runbook", type: "select", required: true, hint: "What documentation and training accompany delivery.", default: "a written runbook plus a recorded walkthrough session", options: [
      { value: "a written operational runbook", label: "Runbook only" },
      { value: "a written runbook plus a recorded walkthrough session", label: "Runbook + walkthrough" },
      { value: "a written runbook, live training, and 30 days of handover support", label: "Runbook + training + support" }
    ] },
    { key: "targetCompletion", label: "Target Completion", type: "date", required: true, hint: "Date production infrastructure is expected to be live." }
  ],
  extraClauses: [
    { title: "Cloud Costs Are the Client's", body: "<p>All third-party and cloud platform costs are the sole responsibility of {{clientName}}. This includes compute, storage, bandwidth, managed services, and any charges incurred while infrastructure is <strong>{{cloudProvider}}</strong>. {{freelancerName}} will architect for cost-efficiency and flag material cost drivers, but is not liable for the Client's cloud bill. Accounts, billing, and payment methods must be owned and funded by {{clientName}} before provisioning begins.</p>" },
    { title: "Access & Credentials", body: "<p>{{clientName}} will provide {{freelancerName}} with appropriately scoped administrative access to the relevant cloud accounts, source repositories, and {{cicdPlatform}} pipelines required to perform the work. All credentials provisioned for the engagement are stored in {{secretsManagement}} and may be rotated or revoked by {{clientName}} upon completion. {{freelancerName}} will not retain production credentials after handover.</p>" },
    { title: "Acceptance & Runbook Handover", body: "<p>Delivery is considered accepted when the agreed environments ({{environments}}) are live and {{handoverRunbook}} has been provided. {{clientName}} has seven (7) days from delivery of the runbook to review and confirm acceptance; absent written objection within that window, the deliverables are deemed accepted. Acceptance covers reproducibility of the infrastructure {{iacTool}}.</p>" },
    { title: "Security Hardening & Data Ownership", body: "<p>{{freelancerName}} will implement reasonable security hardening, including encryption in transit and at rest, least-privilege IAM, and the controls described under Security &amp; Compliance Needs. All data, infrastructure code, and configuration produced under this engagement are the exclusive property of {{clientName}} upon final payment of {{formattedAmount}}. {{freelancerName}} makes no warranty of absolute security and is not liable for breaches arising from the Client's subsequent changes or misuse.</p>" },
    { title: "Change Requests & Scope", body: "<p>The scope above defines the agreed deliverables. Additional environments, new managed services, compliance frameworks beyond those listed, or significant re-architecture constitute a change request and will be quoted separately. {{freelancerName}} will not begin out-of-scope work without written approval, and the {{scheduleLabel}} schedule and {{deadlineLabel}} target may be adjusted accordingly.</p>" },
    { title: "Warranty & Stabilization Window", body: "<p>For fourteen (14) days following acceptance, {{freelancerName}} will correct defects in the delivered infrastructure-as-code and pipelines at no additional charge, provided the {{slaTarget}} target was part of the agreed design. This warranty excludes issues caused by changes made by others, cloud-provider outages, traffic beyond the agreed autoscaling envelope, or failures of {{backupDr}} due to Client misconfiguration after handover.</p>" }
  ],
  fillMinutes: 5
},
{
  id: "platform-migration",
  name: "Platform Migration & Re-Architecture",
  category: "Development",
  icon: "git-branch",
  tagline: "Migrate a legacy system to a modern stack with data migration, a parallel run, and a controlled cutover that minimizes downtime.",
  workType: "Web Development",
  paymentSchedule: "milestone",
  scopeLabel: "Migration Scope",
  scopeDefault: "{{freelancerName}} will migrate and re-architect {{clientName}}'s {{sourceSystem}} onto {{targetStack}} as part of {{projectTitle}}, executed via a {{migrationStrategy}} aimed at {{downtimeTolerance}}. Data will be moved using {{dataMigrationApproach}}, validated against the source, and protected by a {{rollbackPlan}}. The plan includes a {{parallelRunPeriod}} parallel-run period before a controlled cutover on {{cutoverDate}}. Work begins {{startDateLabel}} for {{formattedAmount}}, billed on a {{scheduleLabel}} basis.",
  fields: [
    { key: "sourceSystem", label: "Source System", type: "text", required: true, placeholder: "e.g. PHP 5 monolith on bare-metal with MySQL 5.6", default: "the existing legacy platform", hint: "The legacy system being migrated away from." },
    { key: "targetStack", label: "Target Stack", type: "text", required: true, placeholder: "e.g. Next.js + Node services on a managed Postgres + cloud platform", default: "the modern target architecture", hint: "The stack the system is migrating to." },
    { key: "migrationStrategy", label: "Migration Strategy", type: "select", required: true, hint: "Overall approach to moving off the legacy system.", default: "phased, module-by-module migration", options: [
      { value: "single big-bang cutover", label: "Big-bang" },
      { value: "phased, module-by-module migration", label: "Phased" },
      { value: "incremental strangler-fig migration", label: "Strangler-fig" }
    ] },
    { key: "downtimeTolerance", label: "Downtime Tolerance", type: "select", required: true, hint: "How much downtime the business can absorb at cutover.", default: "a zero-downtime cutover", options: [
      { value: "a zero-downtime cutover", label: "Zero downtime" },
      { value: "a brief scheduled maintenance window", label: "Maintenance window" },
      { value: "an extended off-hours maintenance window", label: "Off-hours window" }
    ] },
    { key: "dataVolume", label: "Data Volume", type: "text", required: true, placeholder: "e.g. ~4M records across 60 tables, 120GB", default: "the full production dataset", hint: "Approximate scale of data to migrate." },
    { key: "dataMigrationApproach", label: "Data Migration Approach", type: "select", required: true, hint: "How data is moved and kept in sync.", default: "an ETL pipeline with continuous sync until cutover", options: [
      { value: "a one-time bulk export and import", label: "Bulk one-time" },
      { value: "an ETL pipeline with continuous sync until cutover", label: "ETL + live sync" },
      { value: "change-data-capture replication kept in sync until cutover", label: "CDC replication" }
    ] },
    { key: "rollbackPlan", label: "Rollback Plan", type: "select", required: true, hint: "What happens if cutover fails.", default: "documented rollback to the legacy system within the maintenance window", options: [
      { value: "documented rollback to the legacy system within the maintenance window", label: "Rollback to legacy" },
      { value: "a blue-green switchover that can be reversed instantly", label: "Blue-green reversible" },
      { value: "a feature-flagged cutover that can be toggled back per module", label: "Feature-flag toggle" }
    ] },
    { key: "parallelRunPeriod", label: "Parallel-Run Period", type: "text", required: true, placeholder: "e.g. 2 weeks", default: "two-week", hint: "How long both systems run side by side before retiring the old one." },
    { key: "environments", label: "Environments", type: "select", required: true, hint: "Environments used to validate the migration.", default: "isolated staging and production environments mirroring the target stack", options: [
      { value: "a production environment with a pre-production validation slot", label: "Prod + pre-prod" },
      { value: "isolated staging and production environments mirroring the target stack", label: "Staging + Prod" },
      { value: "dedicated development, staging, and production environments", label: "Dev + Staging + Prod" }
    ] },
    { key: "testingStrategy", label: "Testing Strategy", type: "select", required: true, hint: "How correctness and parity are verified.", default: "automated regression tests plus data-parity reconciliation between old and new", options: [
      { value: "automated regression tests plus data-parity reconciliation between old and new", label: "Regression + parity" },
      { value: "end-to-end tests with Client-led user acceptance testing", label: "E2E + UAT" },
      { value: "shadow-traffic testing comparing live responses across systems", label: "Shadow traffic" }
    ] },
    { key: "riskAreas", label: "Risk Areas", type: "textarea", wide: true, required: true, placeholder: "e.g. undocumented integrations, data quality issues in legacy DB, third-party APIs nearing deprecation...", hint: "Known risks and unknowns that could affect the cutover." },
    { key: "inScopeSystems", label: "In-Scope Systems", type: "textarea", wide: true, required: true, placeholder: "List the apps, services, databases, and integrations included in this migration...", hint: "Exactly which systems and integrations are covered." },
    { key: "cutoverDate", label: "Cutover Date", type: "date", required: true, hint: "Planned date the new platform goes live." }
  ],
  extraClauses: [
    { title: "Data Integrity & Backups Before Cutover", body: "<p>Before any cutover, {{freelancerName}} will ensure a verified, restorable backup of {{dataVolume}} from {{sourceSystem}} exists. Migration will use {{dataMigrationApproach}}, and data parity will be reconciled between source and target before the new platform is declared live. {{clientName}} acknowledges that legacy data-quality issues surfaced during migration are pre-existing and their remediation, if requested, is outside the base scope.</p>" },
    { title: "Acceptance Testing & Cutover Sign-off", body: "<p>The cutover on {{cutoverDate}} proceeds only after {{testingStrategy}} has passed and {{clientName}} provides written sign-off. Each milestone is deemed accepted when its agreed deliverables function in {{environments}} and the Client has had seven (7) days to review. Final cutover sign-off confirms that the {{parallelRunPeriod}} parallel run has validated the new platform under real load.</p>" },
    { title: "Rollback & Risk", body: "<p>In the event of a failed cutover, {{freelancerName}} will execute the agreed {{rollbackPlan}} to restore service on the prior system. The risks identified under Risk Areas are shared knowledge between the parties; {{freelancerName}} will mitigate them with reasonable professional care but is not liable for downtime, data loss, or business impact arising from undisclosed legacy behavior, third-party outages, or {{clientName}}'s decision to proceed against documented advice.</p>" },
    { title: "Source / Client Responsibilities & Access", body: "<p>{{clientName}} will provide timely, scoped access to {{sourceSystem}}, its database, infrastructure, and any third-party accounts or integrations needed to complete the migration to {{targetStack}}. Delays in access, missing credentials, or unavailability of Client subject-matter experts may shift the {{scheduleLabel}} milestones and the {{cutoverDate}} accordingly. {{freelancerName}} will not retain production access after the parallel run concludes.</p>" },
    { title: "Third-Party & License Costs", body: "<p>All third-party, cloud, and software license costs for the target platform are the responsibility of {{clientName}}. This includes hosting, managed databases, migration tooling, and any new subscriptions required by {{targetStack}}. {{freelancerName}} will recommend cost-effective options and flag material costs in advance, but {{formattedAmount}} covers professional services only and excludes platform and license fees.</p>" },
    { title: "Warranty & Post-Cutover Support", body: "<p>For fourteen (14) days following final cutover sign-off, {{freelancerName}} will correct migration-related defects — data mapping errors, broken in-scope integrations, or parity discrepancies — at no additional charge. This warranty excludes new feature requests, issues in systems outside In-Scope Systems, problems caused by changes made by others after cutover, and pre-existing defects carried over from {{sourceSystem}}.</p>" }
  ],
  fillMinutes: 5
},

  // ── Dream · AI & Blockchain ───────────────────────────────
{
  id: "ai-ml-integration",
  name: "AI / LLM Integration & Model Development",
  category: "Development",
  icon: "brain",
  tagline: "Integrate large language models and ship production AI features — RAG, fine-tuning, evals, guardrails, and everything in between.",
  popular: true,
  workType: "Web Development",
  paymentSchedule: "milestone",
  scopeLabel: "AI Engagement Scope",
  scopeDefault: "{{freelancerName}} will design and build AI capabilities for {{clientName}} as part of {{projectTitle}}, implementing {{aiApproach}} on top of {{baseModel}} and storing embeddings in {{vectorDatabase}}. The system will be grounded in the Client's designated data sources and tuned toward the accuracy and latency targets agreed below, with {{guardrails}} applied to manage safety and reliability. Work will be delivered against defined milestones, with each milestone evaluated using {{evaluationMethod}} before acceptance, targeting completion by {{deadlineLabel}}. Compensation totals {{formattedAmount}} ({{scheduleLabel}}), beginning {{startDateLabel}}.",
  fields: [
    {
      key: "aiApproach",
      label: "AI Approach",
      type: "select",
      required: true,
      hint: "The core technique driving the AI feature.",
      default: "a Retrieval-Augmented Generation (RAG) pipeline",
      options: [
        { value: "a Retrieval-Augmented Generation (RAG) pipeline", label: "RAG pipeline" },
        { value: "fine-tuning of a base model on the Client's data", label: "Fine-tuning" },
        { value: "prompt engineering and structured prompt orchestration", label: "Prompt engineering" },
        { value: "an agentic system with tool use and multi-step reasoning", label: "Agentic system" }
      ]
    },
    {
      key: "baseModel",
      label: "Base Model / Provider",
      type: "select",
      required: true,
      hint: "Primary foundation model the solution is built on.",
      default: "Anthropic's Claude models",
      options: [
        { value: "Anthropic's Claude models", label: "Anthropic Claude" },
        { value: "OpenAI's GPT models", label: "OpenAI GPT" },
        { value: "an open-source model (e.g. Llama or Mistral)", label: "Open-source model" },
        { value: "a multi-model setup routing across several providers", label: "Multi-model" }
      ]
    },
    {
      key: "vectorDatabase",
      label: "Vector Database",
      type: "select",
      required: true,
      hint: "Where embeddings and retrieval indexes will live.",
      default: "a managed vector database (e.g. Pinecone)",
      options: [
        { value: "a managed vector database (e.g. Pinecone)", label: "Pinecone (managed)" },
        { value: "a self-hosted vector store (e.g. Qdrant or Weaviate)", label: "Self-hosted (Qdrant/Weaviate)" },
        { value: "pgvector running inside the Client's existing Postgres database", label: "pgvector" },
        { value: "no vector database (the approach does not require retrieval)", label: "None needed" }
      ]
    },
    {
      key: "dataSources",
      label: "Data Sources for Grounding",
      type: "textarea",
      wide: true,
      required: true,
      hint: "Documents, databases, APIs or knowledge bases the AI will draw on.",
      placeholder: "e.g. Internal help-center articles, product documentation in Notion, and a read-only Postgres table of order history."
    },
    {
      key: "evaluationMethod",
      label: "Evaluation Method",
      type: "select",
      required: true,
      hint: "How quality will be measured before each milestone is accepted.",
      default: "a combination of automated benchmarks and human spot-checks",
      options: [
        { value: "structured human evaluation of sampled outputs", label: "Human evaluation" },
        { value: "automated benchmarks against a fixed test set", label: "Automated benchmarks" },
        { value: "a combination of automated benchmarks and human spot-checks", label: "Hybrid (auto + human)" },
        { value: "LLM-as-judge scoring against defined rubrics", label: "LLM-as-judge" }
      ]
    },
    {
      key: "latencyTarget",
      label: "Latency Target",
      type: "text",
      placeholder: "e.g. under 3 seconds for a typical response (p95)",
      hint: "Target response time; a goal, not a contractual guarantee given model variability."
    },
    {
      key: "guardrails",
      label: "Guardrails & Safety",
      type: "select",
      required: true,
      hint: "Safety and reliability controls to be implemented.",
      default: "input/output guardrails with content filtering and prompt-injection defenses",
      options: [
        { value: "input/output guardrails with content filtering and prompt-injection defenses", label: "Full guardrails" },
        { value: "basic content moderation and refusal handling", label: "Basic moderation" },
        { value: "citation and grounding checks to reduce hallucinations", label: "Grounding checks" },
        { value: "no dedicated guardrail layer (the Client accepts raw model output)", label: "None" }
      ]
    },
    {
      key: "hosting",
      label: "Hosting / Inference",
      type: "select",
      required: true,
      hint: "Where inference runs.",
      default: "a hosted provider API (the Client holds the account)",
      options: [
        { value: "a hosted provider API (the Client holds the account)", label: "Provider API" },
        { value: "a self-hosted model on the Client's infrastructure", label: "Self-hosted" },
        { value: "a hybrid of provider API and self-hosted components", label: "Hybrid" }
      ]
    },
    {
      key: "costOwner",
      label: "Token / Usage Cost Owner",
      type: "select",
      required: true,
      hint: "Who pays for model inference and API usage.",
      default: "the Client, who provisions and pays for all model API usage directly",
      options: [
        { value: "the Client, who provisions and pays for all model API usage directly", label: "Client pays directly" },
        { value: "the Client via reimbursement of usage costs incurred by the Freelancer", label: "Client reimburses" },
        { value: "the Freelancer during development, with the Client assuming costs at launch", label: "Split (dev vs launch)" }
      ]
    },
    {
      key: "useCaseScope",
      label: "Use-Case Scope",
      type: "textarea",
      wide: true,
      required: true,
      hint: "The specific problems the AI feature is meant to solve.",
      placeholder: "e.g. A customer-support assistant that answers product questions from documentation and escalates billing issues to a human."
    },
    {
      key: "accuracyExpectations",
      label: "Accuracy Expectations",
      type: "textarea",
      wide: true,
      required: true,
      hint: "Realistic, measurable quality bar — not a promise of perfection.",
      placeholder: "e.g. At least 90% of answers judged correct and grounded on the agreed test set; out-of-scope questions handled gracefully."
    },
    {
      key: "integrationSurface",
      label: "Integration Surface",
      type: "text",
      placeholder: "e.g. REST API endpoint plus an embeddable chat widget",
      hint: "How the AI feature is exposed to the Client's product."
    },
    {
      key: "deliveryDate",
      label: "Target Delivery Date",
      type: "date",
      hint: "Target date for the final milestone."
    }
  ],
  extraClauses: [
    {
      title: "AI Output Disclaimer",
      body: "<p>The Client acknowledges that outputs from large language models are <strong>probabilistic and non-deterministic</strong>. {{freelancerName}} will engineer the system toward the accuracy expectations defined above, but does <strong>not warrant</strong> that outputs will be accurate, complete, or fit for any particular purpose. The same input may produce different outputs over time. The Client is responsible for human review of any output used in high-stakes, legal, medical, financial, or safety-critical contexts, and will not rely on {{aiApproach}} as a substitute for professional judgment.</p>"
    },
    {
      title: "Model & API Costs Are the Client's",
      body: "<p>All inference, token, embedding, and third-party API charges are borne by {{costOwner}}. Such usage-based costs are <strong>separate from</strong> the {{formattedAmount}} fee for {{projectTitle}}, which covers {{freelancerName}}'s engineering work only. The Client is responsible for provisioning API keys, monitoring spend, and configuring usage limits; {{freelancerName}} is not liable for cost overruns resulting from production traffic, abuse, or model price changes.</p>"
    },
    {
      title: "Data, Privacy & Training",
      body: "<p>The Client retains full ownership of all data supplied for grounding, fine-tuning, or evaluation. {{freelancerName}} will use such data solely to deliver {{projectTitle}} and will not use it to train models for any third party. Where {{baseModel}} is accessed via a provider API, the Client is responsible for reviewing and accepting that provider's data-handling and retention terms. The Client confirms it has the rights and consents necessary to use the data sources described above for AI processing.</p>"
    },
    {
      title: "Evaluation & Acceptance Criteria",
      body: "<p>Each milestone will be evaluated using {{evaluationMethod}} against the accuracy expectations and, where applicable, the latency target of {{latencyTarget}}. A milestone is deemed accepted when it meets the agreed criteria on the shared test set, or seven (7) days after delivery if the Client raises no written objection. Because model behavior is statistical, acceptance is measured against agreed thresholds rather than perfection on every individual input.</p>"
    },
    {
      title: "Third-Party Model Terms & Changes",
      body: "<p>The solution depends on {{baseModel}} and related services whose availability, pricing, rate limits, and behavior are controlled by their providers and may change without notice. {{freelancerName}} is not responsible for degradation, deprecation, or breaking changes originating from these third parties. Work to adapt the system to a provider's material change, or to migrate to an alternative model, is outside this scope and may be quoted separately.</p>"
    },
    {
      title: "Intellectual Property & Source Code on Payment",
      body: "<p>Upon receipt of the full {{formattedAmount}} due under {{scheduleLabel}}, {{freelancerName}} assigns to {{clientName}} all right, title, and interest in the custom source code, prompts, and configuration created specifically for {{projectTitle}}. This assignment excludes third-party models, open-source dependencies, and {{freelancerName}}'s pre-existing tools and libraries, which are provided under their respective licenses. Until payment is received in full, all deliverables remain the property of {{freelancerName}}.</p>"
    }
  ],
  fillMinutes: 5
},
{
  id: "blockchain-smart-contract",
  name: "Blockchain & Smart Contract Development",
  category: "Development",
  icon: "blocks",
  tagline: "Design, audit, and deploy production smart contracts and web3 systems — from testnet to mainnet, with gas optimization and security baked in.",
  workType: "Web Development",
  paymentSchedule: "milestone",
  scopeLabel: "Protocol Scope",
  scopeDefault: "{{freelancerName}} will develop and deploy smart contracts for {{clientName}} as part of {{projectTitle}}, targeting {{blockchain}} and written in {{language}}. The engagement covers {{contractType}} implementing the {{tokenStandard}} standard, with {{auditScope}} and {{gasOptimization}} prior to mainnet release. Contracts will be deployed and validated on testnet before a production deployment targeting {{mainnetTarget}}, and delivered against defined milestones. Total compensation is {{formattedAmount}} ({{scheduleLabel}}), commencing {{startDateLabel}} and targeting completion by {{deadlineLabel}}.",
  fields: [
    {
      key: "blockchain",
      label: "Target Blockchain",
      type: "select",
      required: true,
      hint: "The network the contracts will be deployed to.",
      default: "the Ethereum mainnet",
      options: [
        { value: "the Ethereum mainnet", label: "Ethereum" },
        { value: "the Solana network", label: "Solana" },
        { value: "the Polygon network", label: "Polygon" },
        { value: "multiple EVM-compatible chains", label: "Multi-chain (EVM)" }
      ]
    },
    {
      key: "language",
      label: "Contract Language",
      type: "select",
      required: true,
      hint: "Smart contract programming language.",
      default: "Solidity",
      options: [
        { value: "Solidity", label: "Solidity" },
        { value: "Rust", label: "Rust" },
        { value: "Vyper", label: "Vyper" }
      ]
    },
    {
      key: "contractType",
      label: "Contract Type",
      type: "select",
      required: true,
      hint: "The kind of on-chain system being built.",
      default: "a fungible token contract",
      options: [
        { value: "a fungible token contract", label: "Token" },
        { value: "an NFT collection contract", label: "NFT" },
        { value: "a DeFi protocol (e.g. staking, lending, or AMM)", label: "DeFi protocol" },
        { value: "a DAO governance and voting system", label: "DAO governance" }
      ]
    },
    {
      key: "tokenStandard",
      label: "Token Standard",
      type: "select",
      required: true,
      hint: "The interface standard the contract conforms to.",
      default: "ERC-20",
      options: [
        { value: "ERC-20", label: "ERC-20 (fungible)" },
        { value: "ERC-721", label: "ERC-721 (NFT)" },
        { value: "ERC-1155", label: "ERC-1155 (multi-token)" }
      ]
    },
    {
      key: "auditScope",
      label: "Audit",
      type: "select",
      required: true,
      hint: "Level of security review included in this engagement.",
      default: "an internal security review by the Freelancer",
      options: [
        { value: "an internal security review by the Freelancer", label: "Internal review" },
        { value: "coordination of a third-party security audit (audit firm fees billed to the Client)", label: "Third-party audit" },
        { value: "no formal security audit (the Client accepts this risk)", label: "No audit" }
      ]
    },
    {
      key: "testnetDeployment",
      label: "Testnet Deployment",
      type: "select",
      required: true,
      hint: "How contracts will be validated before mainnet.",
      default: "full testnet deployment and validation before mainnet",
      options: [
        { value: "full testnet deployment and validation before mainnet", label: "Full testnet validation" },
        { value: "local fork and simulation testing only", label: "Local/fork testing" },
        { value: "testnet deployment plus a public bug-bounty period", label: "Testnet + bug bounty" }
      ]
    },
    {
      key: "gasOptimization",
      label: "Gas Optimization",
      type: "select",
      required: true,
      hint: "Effort dedicated to reducing on-chain execution cost.",
      default: "standard gas optimization of core functions",
      options: [
        { value: "standard gas optimization of core functions", label: "Standard" },
        { value: "aggressive gas optimization with benchmarked before/after reports", label: "Aggressive + benchmarks" },
        { value: "no specific gas optimization beyond clean implementation", label: "None" }
      ]
    },
    {
      key: "upgradeability",
      label: "Upgradeability",
      type: "select",
      required: true,
      hint: "Whether the deployed contracts can be upgraded.",
      default: "immutable, non-upgradeable contracts",
      options: [
        { value: "immutable, non-upgradeable contracts", label: "Immutable" },
        { value: "a proxy-upgradeable architecture controlled by the Client", label: "Proxy-upgradeable" }
      ]
    },
    {
      key: "dappFrontend",
      label: "Frontend / dApp",
      type: "select",
      required: true,
      hint: "Whether a user-facing dApp is part of this scope.",
      default: "a frontend dApp with wallet connection is included",
      options: [
        { value: "a frontend dApp with wallet connection is included", label: "dApp included" },
        { value: "no frontend; contracts and ABI are delivered for the Client's own integration", label: "Contracts only" }
      ]
    },
    {
      key: "specFunctionality",
      label: "Specification & Functionality",
      type: "textarea",
      wide: true,
      required: true,
      hint: "Detailed behavior, roles, and rules the contracts must implement.",
      placeholder: "e.g. Mintable supply capped at 10M, owner-controlled pause, 2% transfer fee routed to a treasury, and role-based minting permissions."
    },
    {
      key: "securityAssumptions",
      label: "Security Assumptions",
      type: "textarea",
      wide: true,
      required: true,
      hint: "Trust model, admin keys, oracle dependencies, and known risk boundaries.",
      placeholder: "e.g. A multisig holds admin rights; price feeds come from Chainlink; the contract is not designed to resist a compromised admin key."
    },
    {
      key: "governingJurisdiction",
      label: "Governing Jurisdiction",
      type: "text",
      placeholder: "e.g. State of Delaware, USA",
      hint: "Jurisdiction governing this agreement (not the chain)."
    },
    {
      key: "mainnetTarget",
      label: "Mainnet Target Date",
      type: "date",
      hint: "Target date for production mainnet deployment."
    }
  ],
  extraClauses: [
    {
      title: "Security Audit & Vulnerability Disclaimer",
      body: "<p>The Client understands that smart contracts deployed to {{blockchain}} are typically <strong>immutable and irreversible</strong>, and that no review can guarantee code is free of vulnerabilities or exploits. This engagement includes {{auditScope}}; where that is an internal review or no audit, {{freelancerName}} <strong>strongly recommends</strong> a reputable third-party audit before any contract holds material value. {{freelancerName}} is not liable for losses arising from exploits, economic attacks, oracle manipulation, or undiscovered bugs once {{projectTitle}} is deployed and accepted.</p>"
    },
    {
      title: "Gas, Deployment & Network Fees Are the Client's",
      body: "<p>All gas, deployment, transaction, and network fees on {{blockchain}} — across testnet and mainnet — are paid by the Client, who funds the deploying wallet. These on-chain costs are <strong>separate from</strong> the {{formattedAmount}} fee, which covers {{freelancerName}}'s development work only. {{freelancerName}} is not responsible for fee volatility or for costs incurred by production usage after handover.</p>"
    },
    {
      title: "Regulatory & Compliance Responsibility",
      body: "<p>The Client is solely responsible for the legal and regulatory status of {{contractType}} and any associated token, including securities, AML/KYC, tax, and consumer-protection obligations in every applicable jurisdiction. {{freelancerName}} provides engineering services only and does <strong>not</strong> provide legal, financial, or tax advice. The Client warrants that {{projectTitle}} complies with the laws of {{governingJurisdiction}} and all other relevant jurisdictions.</p>"
    },
    {
      title: "Audit & Acceptance",
      body: "<p>Each milestone will be validated through {{testnetDeployment}}, with the specification and {{tokenStandard}} conformance verified against the functionality defined above. A milestone is accepted when it passes the agreed test suite on testnet, or seven (7) days after delivery if the Client raises no written objection. Mainnet deployment targeting {{mainnetTarget}} proceeds only after the Client confirms acceptance in writing.</p>"
    },
    {
      title: "Private Keys & Custody",
      body: "<p>The Client is solely responsible for the generation, custody, and security of all private keys, seed phrases, admin wallets, and multisig signers, including any keys controlling {{upgradeability}}. {{freelancerName}} will not hold custody of production keys or user funds and is <strong>not liable</strong> for any loss resulting from compromised, lost, or mismanaged keys. The Client is responsible for securing any privileged roles configured in the contracts.</p>"
    },
    {
      title: "Intellectual Property & Source on Payment",
      body: "<p>Upon receipt of the full {{formattedAmount}} due under {{scheduleLabel}}, {{freelancerName}} assigns to {{clientName}} all right, title, and interest in the smart contract source code and deployment scripts created specifically for {{projectTitle}}. This excludes open-source libraries (e.g. OpenZeppelin) and {{freelancerName}}'s pre-existing tooling, provided under their respective licenses. Until payment is received in full, all deliverables remain the property of {{freelancerName}}.</p>"
    }
  ],
  fillMinutes: 5
},

  // ── Dream · Dedicated Dev & Audit ───────────────────────────────
{
  id: "dedicated-developer",
  name: "Dedicated Developer Retainer (Staff Augmentation)",
  category: "Development",
  icon: "terminal",
  tagline: "Embed a dedicated developer with your team on an ongoing monthly retainer with clear commitment, ownership, and renewal terms.",
  popular: true,
  workType: "Web Development",
  paymentSchedule: "monthly_retainer",
  fillMinutes: 5,
  scopeDefault:
    "{{freelancerName}} will work as a dedicated developer embedded with {{clientName}}'s team on the {{projectTitle}} engagement, committing {{commitment}} for approximately {{contractedHours}} hours per month. Engagement begins on {{startDateLabel}} and operates as a rolling monthly retainer billed {{scheduleLabel}} at {{formattedAmount}}. The Freelancer will work primarily within {{workingHours}} and collaborate through {{commTools}}, providing {{onCall}} support coverage. A ramp-up period of {{rampUp}} applies at the start of the engagement, after which the Freelancer maintains a {{reportingCadence}} reporting rhythm and contributes against the responsibilities and tech stack defined below.",
  fields: [
    { key: "commitment", label: "Time commitment", type: "select", default: "full-time (approximately 40 hours per week)",
      options: [
        { value: "full-time (approximately 40 hours per week)", label: "Full-time (40h/wk)" },
        { value: "part-time (approximately 20 hours per week)", label: "Part-time (20h/wk)" },
        { value: "flexible hours agreed each sprint", label: "Flexible" },
      ] },
    { key: "contractedHours", label: "Contracted hours per month", type: "number", default: "160", hint: "Used to calculate overage and unused-hour handling." },
    { key: "seniority", label: "Seniority / role", type: "select", default: "a senior engineer",
      options: [
        { value: "a senior engineer", label: "Senior" },
        { value: "a mid-level engineer", label: "Mid-level" },
        { value: "a lead engineer with technical-direction responsibilities", label: "Lead" },
      ] },
    { key: "techStack", label: "Tech stack", type: "text", placeholder: "TypeScript, React, Node.js, PostgreSQL", default: "the Client's existing technology stack", hint: "List the primary languages, frameworks, and infrastructure." },
    { key: "workingHours", label: "Working hours / timezone overlap", type: "text", placeholder: "9am–5pm CET with 4 hours overlap with US Eastern", default: "the Client's core business hours with reasonable timezone overlap" },
    { key: "commTools", label: "Communication & tools", type: "text", placeholder: "Slack, Linear, GitHub, daily standups", default: "the Client's standard team communication and project-management tools" },
    { key: "onCall", label: "On-call / support coverage", type: "select", default: "no",
      options: [
        { value: "no", label: "None" },
        { value: "business-hours", label: "Business hours" },
        { value: "24/7 on-call", label: "24/7 on-call" },
      ] },
    { key: "codeOwnership", label: "Code ownership", type: "select", default: "assigned to the Client upon payment for each monthly period",
      options: [
        { value: "assigned to the Client upon payment for each monthly period", label: "Client owns (on payment)" },
        { value: "licensed to the Client with the Freelancer retaining reusable components and libraries", label: "Client license (Freelancer keeps tooling)" },
        { value: "jointly owned as agreed in writing for specific deliverables", label: "Joint / as agreed" },
      ] },
    { key: "reportingCadence", label: "Reporting cadence", type: "select", default: "weekly written",
      options: [
        { value: "daily standup", label: "Daily standup" },
        { value: "weekly written", label: "Weekly summary" },
        { value: "bi-weekly sprint review", label: "Bi-weekly sprint" },
      ] },
    { key: "rampUp", label: "Ramp-up period", type: "text", placeholder: "the first two weeks", default: "the first one to two weeks", hint: "Onboarding window for codebase and team context." },
    { key: "noticePeriod", label: "Notice period", type: "text", placeholder: "30 days written notice", default: "30 days' written notice" },
    { key: "responsibilities", label: "Responsibilities", type: "textarea", wide: true, placeholder: "Feature development, code review, bug fixing, technical design input, mentoring junior developers...", default: "Designing, building, testing, and maintaining application features; participating in code review and technical planning; fixing defects; and collaborating with the Client's team to deliver against the agreed roadmap." },
    { key: "exclusions", label: "Out-of-scope / exclusions", type: "textarea", wide: true, placeholder: "Production incident management outside agreed coverage, recruiting, non-engineering work, third-party license costs...", default: "Work materially outside the agreed tech stack and responsibilities, hardware or third-party license costs, non-engineering tasks, and any support coverage beyond the agreed on-call terms are out of scope and billed separately by written agreement." },
    { key: "startDate", label: "Engagement start date", type: "date" },
  ],
  extraClauses: [
    { title: "Monthly Retainer", body: "<p>This engagement is provided on a recurring monthly retainer basis. {{clientName}} reserves {{freelancerName}}'s availability at <strong>{{commitment}}</strong>, targeting approximately <strong>{{contractedHours}} hours</strong> each month, in exchange for a fixed monthly fee of <strong>{{formattedAmount}}</strong> payable {{scheduleLabel}}. The fee secures dedicated capacity and is payable in advance for each upcoming month regardless of the exact volume of tasks assigned.</p>" },
    { title: "Renewal & Notice", body: "<p>The retainer begins on <strong>{{startDateLabel}}</strong> and <strong>automatically renews</strong> for successive one-month periods unless either party provides {{noticePeriod}} before the end of the then-current period. Because capacity is reserved in advance, fees paid for a commenced monthly period are <strong>non-refundable</strong>, and termination takes effect at the end of the period in which proper notice expires.</p>" },
    { title: "Hours, Overage & Unused Hours", body: "<p>The {{contractedHours}} monthly hours are a good-faith target, not a strict cap or guarantee. Work meaningfully exceeding the contracted hours (overage) will be flagged in advance and billed at an agreed hourly rate or deferred by mutual consent. Unused hours reflect reserved capacity and <strong>do not roll over</strong> to subsequent months or entitle the Client to a refund or credit.</p>" },
    { title: "Code Ownership & Repository Access", body: "<p>All code and deliverables produced under this engagement are <strong>{{codeOwnership}}</strong>. Ownership or the applicable license transfers only once the relevant monthly invoice is paid in full. {{clientName}} will provide {{freelancerName}} with timely access to the repositories, environments, and credentials needed to perform the work, and {{freelancerName}} will follow the Client's branching, review, and security practices.</p>" },
    { title: "Independent Contractor", body: "<p>{{freelancerName}} performs this engagement as an <strong>independent contractor</strong>, not as an employee, partner, or agent of {{clientName}}. The Freelancer is responsible for their own taxes, insurance, equipment, and benefits, retains discretion over the manner and means of performing the work, and may serve other clients provided it does not conflict with the agreed commitment.</p>" },
    { title: "Confidentiality & Tooling", body: "<p>{{freelancerName}} will treat {{clientName}}'s source code, credentials, customer data, and business information as strictly confidential, using it only to perform this engagement through {{commTools}} and the Client's sanctioned systems. Confidential materials will be returned or securely destroyed on request, and this obligation survives termination of the retainer.</p>" },
    { title: "Non-Solicitation", body: "<p>During the engagement and for twelve (12) months afterward, neither party will knowingly solicit for employment or directly engage the other's staff or contractors who were involved in this engagement, without the other party's prior written consent. This clause does not restrict general public job postings not targeted at such individuals.</p>" },
  ],
},
{
  id: "code-audit-security",
  name: "Code Audit & Security Assessment",
  category: "Development",
  icon: "bug",
  tagline: "A rigorous, point-in-time audit of a codebase for security, quality, and performance with a documented report and remediation guidance.",
  workType: "Consulting",
  paymentSchedule: "split_50_50",
  fillMinutes: 5,
  scopeLabel: "Assessment Scope",
  scopeDefault:
    "{{freelancerName}} will perform a {{assessmentType}} of {{clientName}}'s {{projectTitle}} codebase (approximately {{codebaseSize}}) built on {{techStack}}, using a {{testingApproach}} approach against {{environments}}. Findings will be classified using {{severityFramework}} and compiled into {{deliverable}}, scheduled for delivery by {{deadlineLabel}}, with {{retest}}. The total fee is {{formattedAmount}}, invoiced {{scheduleLabel}}. Testing is strictly limited to the in-scope systems defined below, and {{authorization}}.",
  fields: [
    { key: "assessmentType", label: "Assessment type", type: "select", default: "full security and code-quality assessment",
      options: [
        { value: "security audit", label: "Security audit" },
        { value: "code quality review", label: "Code quality review" },
        { value: "performance audit", label: "Performance audit" },
        { value: "full security and code-quality assessment", label: "Full assessment" },
      ] },
    { key: "codebaseSize", label: "Codebase size", type: "text", placeholder: "approximately 80,000 lines across 3 services", default: "the agreed application repositories", hint: "Lines of code, services, or repos in scope." },
    { key: "techStack", label: "Tech stack", type: "text", placeholder: "Python/Django, React, PostgreSQL, AWS", default: "the Client's specified technology stack" },
    { key: "testingApproach", label: "Testing approach", type: "select", default: "grey-box (partial knowledge and credentials)",
      options: [
        { value: "black-box (no internal knowledge or credentials)", label: "Black-box" },
        { value: "white-box (full source and credential access)", label: "White-box" },
        { value: "grey-box (partial knowledge and credentials)", label: "Grey-box" },
      ] },
    { key: "environments", label: "Environments tested", type: "select", default: "a dedicated staging environment only",
      options: [
        { value: "a dedicated staging environment only", label: "Staging only" },
        { value: "the production environment with the Client's prior written permission", label: "Production (with permission)" },
        { value: "both staging and production with the Client's prior written permission", label: "Staging + production" },
      ] },
    { key: "authorization", label: "Authorization confirmed", type: "select", default: "the Client confirms it owns or is fully authorized to permit testing of all in-scope systems",
      options: [
        { value: "the Client confirms it owns or is fully authorized to permit testing of all in-scope systems", label: "Client owns / authorized" },
        { value: "the Client will provide signed written authorization before testing begins", label: "Written auth pending" },
      ] },
    { key: "severityFramework", label: "Severity framework", type: "select", default: "CVSS v3.1 scoring",
      options: [
        { value: "CVSS v3.1 scoring", label: "CVSS" },
        { value: "the OWASP Risk Rating methodology", label: "OWASP" },
        { value: "CVSS scoring mapped to OWASP categories", label: "CVSS + OWASP" },
      ] },
    { key: "deliverable", label: "Deliverable", type: "select", default: "a written report with prioritized remediation guidance",
      options: [
        { value: "a written technical report", label: "Written report" },
        { value: "a written report plus a live findings walkthrough", label: "Report + walkthrough" },
        { value: "a written report with prioritized remediation guidance", label: "Report + remediation guidance" },
      ] },
    { key: "retest", label: "Retest included", type: "select", default: "one round of verification retesting of remediated findings included",
      options: [
        { value: "no retest included", label: "No retest" },
        { value: "one round of verification retesting of remediated findings included", label: "One retest included" },
        { value: "up to two rounds of verification retesting included", label: "Two retests included" },
      ] },
    { key: "scopeBoundaries", label: "Scope boundaries", type: "textarea", wide: true, placeholder: "Repositories, domains, IP ranges, and API endpoints that are in scope...", default: "Testing is confined to the specific repositories, hosts, domains, and endpoints listed by the Client in writing. No system, account, or network outside this agreed list will be accessed, scanned, or tested under any circumstances." },
    { key: "exclusions", label: "Systems explicitly excluded", type: "textarea", wide: true, placeholder: "Third-party SaaS, payment processors, shared infrastructure, social engineering of staff...", default: "Third-party and SaaS platforms not owned by the Client, shared or upstream infrastructure, physical security, social-engineering of personnel, and any denial-of-service or destructive testing are explicitly excluded." },
    { key: "reportDate", label: "Report delivery date", type: "date" },
  ],
  extraClauses: [
    { title: "Authorization & Legal Permission", body: "<p>{{clientName}} <strong>warrants that it owns, or holds valid written permission to authorize security testing of</strong>, every system within the agreed scope, and that {{authorization}}. {{freelancerName}} will only test the in-scope systems described above and will immediately stop and notify the Client if any out-of-scope or third-party system is encountered. {{clientName}} agrees to indemnify the Freelancer against claims arising from the Client's failure to secure proper authorization.</p>" },
    { title: "Confidentiality & Responsible Disclosure", body: "<p>All vulnerabilities, source code, credentials, and data accessed during this assessment are strictly confidential. {{freelancerName}} will disclose findings only to {{clientName}} through secure channels, will not publicly disclose or retain proof-of-concept data beyond what is needed for the report, and will securely destroy temporary copies of sensitive data after delivery. This obligation survives completion of the engagement.</p>" },
    { title: "No Guarantee of Complete Security", body: "<p>This assessment is a <strong>point-in-time evaluation</strong> based on the systems, access, and information available during the testing window. It cannot and does not guarantee that all vulnerabilities have been identified or that the systems are fully secure. New code, configuration changes, or newly discovered threats after delivery fall outside the scope of {{freelancerName}}'s findings.</p>" },
    { title: "Report Ownership & Sensitive Findings Handling", body: "<p>Upon full payment, {{clientName}} owns the final {{deliverable}} produced under this engagement. Because the report identifies exploitable weaknesses, {{clientName}} agrees to store and circulate it only on a strict need-to-know basis and not to attribute or publish it in a way that exposes unremediated vulnerabilities. {{freelancerName}} may retain a redacted record of the engagement for its own professional and legal purposes.</p>" },
    { title: "Remediation Is Advisory", body: "<p>Any remediation guidance provided is <strong>advisory only</strong>. Implementing fixes, deploying changes, and validating them in {{clientName}}'s environment are the Client's responsibility. {{freelancerName}} is not responsible for the consequences of remediation steps applied by the Client, nor for vulnerabilities left unaddressed after the report is delivered.</p>" },
    { title: "Liability Limitation", body: "<p>To the maximum extent permitted by law, {{freelancerName}}'s total liability arising out of this engagement is limited to the total fees actually paid by {{clientName}}, being {{formattedAmount}}. {{freelancerName}} is not liable for indirect, incidental, or consequential damages, data loss, or business interruption, including any resulting from the inherently intrusive nature of authorized security testing performed in good faith within the agreed scope.</p>" },
  ],
},

  // ════════════════════════════════════════════════════════════════════════
  // EXTRAORDINARY LIBRARY — cross-industry flagship templates.
  // ════════════════════════════════════════════════════════════════════════

  // ── Premium+ · Game · Data · No-Code ───────────────────────────────
{
  id: "game-dev",
  name: "Game Development Agreement",
  category: "Development",
  icon: "gamepad",
  tagline: "A complete agreement for building a game from prototype to release, with milestone builds and clear ownership.",
  popular: true,
  workType: "Web Development",
  paymentSchedule: "milestone",
  scopeLabel: "Game & Build Scope",
  scopeDefault: "The Freelancer will design and develop {{projectTitle}}, a {{genre}} game {{engine}} and targeted at {{platforms}}. The game will ship as a {{multiplayer}} experience with {{artStyle}}, and assets will be handled under the arrangement that {{assetResponsibility}}. Development proceeds in playable milestone builds delivered {{milestoneCadence}}, each submitted for the Client's review and acceptance. The agreed playable scope is as follows: {{playableScope}}. The Freelancer will work toward a target release of {{releaseDate}}, with the game monetized as a {{monetization}} title.",
  fields: [
    { key: "engine", label: "Game Engine", type: "select", required: true, default: "built in the Unity engine", hint: "The engine the game is built on.", options: [
      { value: "built in the Unity engine", label: "Unity" },
      { value: "built in Unreal Engine", label: "Unreal" },
      { value: "built in the Godot engine", label: "Godot" },
      { value: "built on a custom in-house engine", label: "Custom" }
    ] },
    { key: "platforms", label: "Target Platforms", type: "select", required: true, default: "PC (Windows/macOS)", hint: "Where the game will run.", options: [
      { value: "PC (Windows/macOS)", label: "PC" },
      { value: "home consoles (PlayStation, Xbox, Switch)", label: "Console" },
      { value: "mobile devices (iOS and Android)", label: "Mobile" },
      { value: "multiple platforms with cross-platform support", label: "Cross-platform" }
    ] },
    { key: "genre", label: "Genre", type: "text", placeholder: "e.g. roguelike deck-builder", required: true, hint: "The game's genre or subgenre." },
    { key: "artStyle", label: "Art Style", type: "select", required: true, default: "a stylized 2D art style", options: [
      { value: "a stylized 2D art style", label: "2D Stylized" },
      { value: "a pixel-art aesthetic", label: "Pixel Art" },
      { value: "a low-poly 3D look", label: "Low-poly 3D" },
      { value: "a high-fidelity 3D art style", label: "Realistic 3D" }
    ] },
    { key: "multiplayer", label: "Multiplayer Mode", type: "select", required: true, default: "single-player", options: [
      { value: "single-player", label: "Single-player" },
      { value: "online multiplayer", label: "Online MP" },
      { value: "local couch multiplayer", label: "Local MP" }
    ] },
    { key: "coreMechanics", label: "Core Gameplay Mechanics", type: "textarea", wide: true, required: true, placeholder: "Describe the central gameplay loop, controls, progression systems, and signature mechanics.", hint: "The mechanics that define how the game plays." },
    { key: "assetResponsibility", label: "Asset Responsibility", type: "select", required: true, default: "the Freelancer creates all art, audio, and game assets", options: [
      { value: "the Freelancer creates all art, audio, and game assets", label: "Freelancer creates" },
      { value: "the Client provides all art, audio, and game assets", label: "Client provides" },
      { value: "art and assets are produced through a mix of Freelancer-created and Client-supplied materials", label: "Mixed" }
    ] },
    { key: "monetization", label: "Monetization Model", type: "select", required: true, default: "premium paid", options: [
      { value: "premium paid", label: "Premium" },
      { value: "free-to-play with in-app purchases", label: "Free-to-play" },
      { value: "free-to-play supported by advertising", label: "Ad-supported" }
    ] },
    { key: "milestoneCadence", label: "Milestone Build Cadence", type: "select", required: true, default: "at the end of every two-week sprint", hint: "How often playable builds are delivered.", options: [
      { value: "weekly", label: "Weekly" },
      { value: "at the end of every two-week sprint", label: "Biweekly" },
      { value: "at the close of each monthly milestone", label: "Monthly" }
    ] },
    { key: "licenseOwner", label: "Engine/Store License Owner", type: "text", required: true, placeholder: "e.g. the Client", default: "the Client", hint: "Who holds and pays for engine, store, and platform licenses." },
    { key: "playableScope", label: "Playable Scope", type: "textarea", wide: true, required: true, placeholder: "Define the levels, content volume, hours of gameplay, and what 'done' looks like at launch.", hint: "The concrete content scope to be delivered." },
    { key: "releaseDate", label: "Target Release Date", type: "date", required: true, hint: "The planned launch or release target." }
  ],
  extraClauses: [
    { title: "Milestone Builds & Acceptance", body: "<p>Development proceeds through playable milestone builds delivered {{milestoneCadence}}. Each build is submitted to the Client for review against the agreed playable scope. The Client has <strong>seven (7) days</strong> to test a build and respond with written acceptance or a specific list of defects. A build is deemed accepted if no written response is received within that window. Acceptance of a milestone build authorizes release of the corresponding milestone payment.</p>" },
    { title: "Source Project & Asset Ownership on Payment", body: "<p>Upon receipt of <strong>full and final payment</strong>, the Freelancer assigns to {{clientName}} all right, title, and interest in the completed game, including the source project files, code, and all assets created by the Freelancer for {{projectTitle}}. Prior to full payment, all deliverables remain the property of the Freelancer. The Freelancer retains ownership of any pre-existing tools, libraries, and reusable engine code, and grants the Client a perpetual license to use them as embedded in the game.</p>" },
    { title: "Third-Party Engine, Asset & Store License Costs", body: "<p>All costs for the game engine, third-party asset packs, middleware, storefront publishing fees, developer program memberships, and platform certification are the responsibility of {{licenseOwner}}. Where the Freelancer must operate under such licenses to perform the work, accounts and seats will be provisioned in the name of {{licenseOwner}}. The Freelancer is not liable for store rejections arising from platform policy changes outside its control.</p>" },
    { title: "Scope & Change Requests", body: "<p>This agreement covers the gameplay, content, and platforms defined above. New mechanics, additional levels or platforms, expanded asset requirements, or feature changes requested after a milestone is locked are <strong>out of scope</strong> and will be quoted separately as a written change order before work begins. Approved change orders may adjust the target release of {{releaseDate}} and the {{formattedAmount}} fee accordingly.</p>" },
    { title: "Post-Launch Bug-Fix Warranty", body: "<p>For <strong>thirty (30) days</strong> following final delivery, the Freelancer will fix reproducible bugs and crashes in the delivered build at no additional charge, provided they stem from the Freelancer's work and not from Client modifications, platform updates, or new content. This warranty covers defect repair only and does not include new features, balance changes, or ongoing live-operations support.</p>" },
    { title: "Credit & Portfolio Rights", body: "<p>The Freelancer may identify {{projectTitle}} as their work and display screenshots, video, and gameplay footage in a professional portfolio and reel, unless and until subject to a separate non-disclosure agreement. Where customary, the Freelancer will receive an appropriate development credit in the game's credits screen. The Client retains all rights to publish, market, and distribute the game.</p>" }
  ],
  fillMinutes: 5
},
{
  id: "data-engineering",
  name: "Data Engineering & Analytics Platform",
  category: "Development",
  icon: "database",
  tagline: "Build the pipelines, warehouse, and dashboards that turn raw data into trusted, decision-ready metrics.",
  workType: "Web Development",
  paymentSchedule: "milestone",
  scopeLabel: "Platform & Data Scope",
  scopeDefault: "The Freelancer will design and build a data platform for {{clientName}} consolidating the following sources: {{dataSources}}. Data will be ingested using {{pipelineTool}}, orchestrated via {{orchestration}}, and loaded into a {{warehouse}} warehouse refreshed on a {{refreshCadence}} basis. A {{biLayer}} layer will surface the modeled metrics, with the following KPIs prioritized for delivery: {{kpis}}. Governance will follow the principle that {{governance}}, and all models will be validated through {{dataQuality}} before sign-off. The platform is targeted for delivery by {{deliveryDate}}.",
  fields: [
    { key: "dataSources", label: "Data Sources", type: "textarea", wide: true, required: true, placeholder: "List the systems to ingest: e.g. Stripe, Postgres production DB, Salesforce, Google Analytics, CSV exports.", hint: "Every source system the platform must pull from." },
    { key: "warehouse", label: "Data Warehouse", type: "select", required: true, default: "Snowflake", hint: "Where modeled data lives.", options: [
      { value: "Snowflake", label: "Snowflake" },
      { value: "Google BigQuery", label: "BigQuery" },
      { value: "Amazon Redshift", label: "Redshift" },
      { value: "PostgreSQL", label: "Postgres" }
    ] },
    { key: "pipelineTool", label: "Pipeline / ETL Tooling", type: "select", required: true, default: "dbt for transformation with Airflow-scheduled extraction", hint: "How data is moved and transformed.", options: [
      { value: "dbt for transformation with Airflow-scheduled extraction", label: "dbt + Airflow" },
      { value: "Fivetran-managed connectors with dbt transformations", label: "Fivetran + dbt" },
      { value: "custom-built extraction and transformation scripts", label: "Custom" }
    ] },
    { key: "orchestration", label: "Orchestration", type: "select", required: true, default: "Apache Airflow", hint: "What schedules and monitors the jobs.", options: [
      { value: "Apache Airflow", label: "Airflow" },
      { value: "Dagster", label: "Dagster" },
      { value: "Prefect", label: "Prefect" },
      { value: "the warehouse's native scheduler", label: "Native scheduler" }
    ] },
    { key: "biLayer", label: "BI / Dashboard Layer", type: "select", required: true, default: "Looker", hint: "Where stakeholders view the data.", options: [
      { value: "Looker", label: "Looker" },
      { value: "Metabase", label: "Metabase" },
      { value: "Power BI", label: "Power BI" },
      { value: "a custom-built dashboard application", label: "Custom" }
    ] },
    { key: "dataVolume", label: "Approximate Data Volume", type: "text", required: true, placeholder: "e.g. ~50M rows, 200 GB", hint: "Rough scale of data the platform handles." },
    { key: "refreshCadence", label: "Refresh Cadence", type: "select", required: true, default: "daily", hint: "How fresh the data needs to be.", options: [
      { value: "real-time streaming", label: "Real-time" },
      { value: "hourly", label: "Hourly" },
      { value: "daily", label: "Daily" }
    ] },
    { key: "governance", label: "Governance & PII Handling", type: "select", required: true, default: "personally identifiable information is masked or excluded from analytics models", hint: "How sensitive data is governed.", options: [
      { value: "personally identifiable information is masked or excluded from analytics models", label: "PII masked" },
      { value: "sensitive fields are encrypted at rest and access is role-restricted", label: "Encrypted + RBAC" },
      { value: "all data is treated as internal with standard access controls", label: "Standard controls" }
    ] },
    { key: "dataQuality", label: "Data Quality Testing", type: "select", required: true, default: "automated dbt tests for uniqueness, nullness, and referential integrity", hint: "How correctness is verified.", options: [
      { value: "automated dbt tests for uniqueness, nullness, and referential integrity", label: "dbt tests" },
      { value: "automated tests plus reconciliation against source-of-truth totals", label: "Tests + reconciliation" },
      { value: "manual spot-checks against source systems", label: "Manual checks" }
    ] },
    { key: "kpis", label: "KPIs & Metrics to Model", type: "textarea", wide: true, required: true, placeholder: "e.g. MRR, churn rate, CAC, LTV, daily active users, funnel conversion by channel.", hint: "The business metrics the platform must produce." },
    { key: "deliveryDate", label: "Delivery Date", type: "date", required: true, hint: "Target date for the completed platform." },
    { key: "stakeholders", label: "Primary Stakeholders", type: "text", placeholder: "e.g. Finance, Growth, and Product teams", hint: "Who consumes the dashboards." }
  ],
  extraClauses: [
    { title: "Data Ownership & Privacy", body: "<p>All raw data, derived datasets, and modeled tables produced from {{clientName}}'s source systems remain the exclusive property of {{clientName}}. The Freelancer will process personal and sensitive data only as needed to build the platform and in accordance with the agreed governance approach, namely that {{governance}}. The Freelancer will not retain, copy, or use Client data outside the scope of this engagement and will purge local copies on request after delivery.</p>" },
    { title: "Cloud & Warehouse Costs Are the Client's", body: "<p>All cloud infrastructure, {{warehouse}} compute and storage, managed-connector subscriptions, and BI-tool licensing are billed directly to and paid by {{clientName}}. These accounts will be provisioned in the Client's name. The Freelancer will design pipelines with reasonable cost-efficiency in mind but is <strong>not responsible</strong> for the Client's consumption-based cloud bills.</p>" },
    { title: "Acceptance & Data-Accuracy Reconciliation", body: "<p>Each milestone is accepted once the delivered models and dashboards reconcile to the Client's source-of-truth figures within an agreed tolerance, validated through {{dataQuality}}. The Client has <strong>seven (7) days</strong> to reconcile a delivery and report discrepancies in writing; absent a response, the milestone is deemed accepted. Discrepancies traced to upstream source-data errors are outside the Freelancer's responsibility but will be flagged.</p>" },
    { title: "Access & Credentials", body: "<p>The Client will provide timely, least-privilege access to all source systems, the {{warehouse}} warehouse, and the {{biLayer}} layer required to perform the work. Delays in granting access may extend the {{deliveryDate}} target proportionally. The Freelancer will handle all credentials securely and will not share them with third parties.</p>" },
    { title: "Change Requests", body: "<p>This agreement covers the sources, models, and dashboards defined above. Adding new data sources, materially restructuring the warehouse, or introducing new KPIs beyond those listed is <strong>out of scope</strong> and will be quoted as a written change order before work begins. Approved changes may adjust the {{formattedAmount}} fee and the {{deliveryDate}} timeline.</p>" },
    { title: "Warranty & Pipeline Stabilization", body: "<p>For <strong>thirty (30) days</strong> after final delivery, the Freelancer will fix pipeline failures, broken transformations, and dashboard defects attributable to its work at no additional charge. This stabilization warranty excludes failures caused by source-schema changes, upstream API deprecations, infrastructure changes, or new data the platform was not designed to handle, which may be addressed under a separate support arrangement.</p>" }
  ],
  fillMinutes: 5
},
{
  id: "nocode-build",
  name: "No-Code / Webflow Build",
  category: "Development",
  icon: "wand",
  tagline: "Ship a polished, responsive site or app on a no-code platform, with clean handover and clear account ownership.",
  workType: "Web Development",
  paymentSchedule: "split_50_50",
  scopeLabel: "Build Scope",
  scopeDefault: "The Freelancer will design and build {{projectTitle}} on the {{platform}} platform, comprising approximately {{pageCount}} pages or screens with {{cmsCollections}}. The build will be {{responsiveBreakpoints}} and include {{animations}}, with content handled under the arrangement that {{contentResponsibility}}. The following functional scope is in scope for this engagement: {{featureScope}}. Branding and design direction will be sourced as follows: {{brandSource}}. The Freelancer will deliver a launch-ready build by {{launchDate}}, with {{trainingHandover}} provided at handover.",
  fields: [
    { key: "platform", label: "No-Code Platform", type: "select", required: true, default: "Webflow", hint: "The platform the project is built on.", options: [
      { value: "Webflow", label: "Webflow" },
      { value: "Bubble", label: "Bubble" },
      { value: "Framer", label: "Framer" },
      { value: "Softr", label: "Softr" }
    ] },
    { key: "pageCount", label: "Number of Pages / Screens", type: "number", required: true, placeholder: "e.g. 8", hint: "Approximate count of unique pages or screens." },
    { key: "cmsCollections", label: "CMS Collections", type: "select", required: true, default: "a basic CMS for blog posts and a handful of dynamic collections", hint: "Depth of dynamic, CMS-driven content.", options: [
      { value: "no CMS-driven content", label: "None" },
      { value: "a basic CMS for blog posts and a handful of dynamic collections", label: "Basic" },
      { value: "an advanced CMS with multiple interrelated collections and dynamic filtering", label: "Advanced" }
    ] },
    { key: "integrations", label: "Integrations", type: "text", placeholder: "e.g. Stripe checkout, Mailchimp, Calendly, Zapier", hint: "Third-party tools to connect." },
    { key: "responsiveBreakpoints", label: "Responsive Breakpoints", type: "select", required: true, default: "fully responsive across desktop, tablet, and mobile breakpoints", hint: "How thoroughly the build adapts to screen sizes.", options: [
      { value: "fully responsive across desktop, tablet, and mobile breakpoints", label: "Full responsive" },
      { value: "responsive for desktop and mobile, with tablet inheriting the desktop layout", label: "Desktop + mobile" },
      { value: "optimized primarily for desktop with a basic mobile fallback", label: "Desktop-first" }
    ] },
    { key: "animations", label: "Animations & Interactions", type: "select", required: true, default: "tasteful scroll and hover interactions", hint: "Level of motion and interactivity.", options: [
      { value: "no custom animations", label: "None" },
      { value: "tasteful scroll and hover interactions", label: "Standard" },
      { value: "rich, custom-built animations and complex interactions", label: "Advanced" }
    ] },
    { key: "planOwner", label: "Plan / Subscription Owner", type: "select", required: true, default: "the Client owns the platform account and pays the subscription directly", hint: "Who holds and pays for the platform plan.", options: [
      { value: "the Client owns the platform account and pays the subscription directly", label: "Client owns account" },
      { value: "the build is transferred into a Client-owned account at handover", label: "Transferred at handover" }
    ] },
    { key: "contentResponsibility", label: "Content Responsibility", type: "select", required: true, default: "the Client provides all final copy and imagery", hint: "Who supplies the written and visual content.", options: [
      { value: "the Client provides all final copy and imagery", label: "Client provides" },
      { value: "the Freelancer writes copy and sources imagery as part of the build", label: "Freelancer writes" },
      { value: "copy and imagery are produced jointly, with the Client supplying source material", label: "Collaborative" }
    ] },
    { key: "trainingHandover", label: "Training & Handover", type: "select", required: true, default: "a recorded walkthrough video and editing guide", hint: "What the Client receives to manage the site.", options: [
      { value: "a recorded walkthrough video and editing guide", label: "Video + guide" },
      { value: "a live training session covering day-to-day editing", label: "Live session" },
      { value: "written documentation for self-service editing", label: "Written docs" }
    ] },
    { key: "featureScope", label: "Feature Scope", type: "textarea", wide: true, required: true, placeholder: "Describe the pages, forms, dynamic content, user logic, and any app-like functionality in scope.", hint: "Everything the build must do." },
    { key: "brandSource", label: "Brand / Design Source", type: "textarea", wide: true, required: true, placeholder: "e.g. an existing Figma file, a brand guide, or design to be created from scratch by the Freelancer.", hint: "Where the visual design comes from." },
    { key: "launchDate", label: "Launch Date", type: "date", required: true, hint: "Target go-live date." }
  ],
  extraClauses: [
    { title: "Platform Subscription & Account Ownership", body: "<p>{{projectTitle}} is built on the {{platform}} platform, where {{planOwner}}. All platform subscription, hosting, and add-on costs are the responsibility of the Client and are billed directly to the Client's account. The Freelancer requires appropriate collaborator access to perform the work and will relinquish that access at handover. The Client's continued access to the live site depends on maintaining the platform subscription in good standing.</p>" },
    { title: "Acceptance & Sign-off", body: "<p>Upon delivery of the completed build, the Client has <strong>seven (7) days</strong> to review the site against the agreed feature scope and provide written sign-off or a specific list of defects. The build is deemed accepted if no written response is received within that window. Acceptance and final payment authorize launch and trigger the warranty period below.</p>" },
    { title: "Content Responsibility", body: "<p>Under this agreement, {{contentResponsibility}}. Where the Client supplies content, the Freelancer is not responsible for delays caused by late or incomplete materials, and the {{launchDate}} target may shift proportionally. The Client warrants that all supplied copy, images, and assets are owned or properly licensed by the Client, and indemnifies the Freelancer against claims arising from Client-supplied content.</p>" },
    { title: "Platform Limitations Disclaimer", body: "<p>No-code platforms impose inherent constraints on functionality, performance, data export, and customization. The Freelancer will build within the documented capabilities of {{platform}} and is <strong>not liable</strong> for limitations, pricing changes, downtime, feature deprecations, or vendor lock-in imposed by the platform provider. Functionality that exceeds what the platform natively supports is out of scope unless separately agreed.</p>" },
    { title: "Change Requests", body: "<p>This agreement covers approximately {{pageCount}} pages and the feature scope defined above. Additional pages, new integrations, expanded CMS structures, or design directions beyond the agreed scope are <strong>out of scope</strong> and will be quoted as a written change order before work begins. Approved changes may adjust the {{formattedAmount}} fee and the {{launchDate}} timeline.</p>" },
    { title: "Handover, Training & Warranty", body: "<p>At handover, the Freelancer will transfer the completed build per the ownership arrangement above and provide {{trainingHandover}} so the Client can manage the site independently. For <strong>thirty (30) days</strong> after launch, the Freelancer will fix build defects and broken interactions attributable to its work at no additional charge. This warranty excludes issues caused by Client edits, platform changes, third-party integration outages, or new feature requests.</p>" }
  ],
  fillMinutes: 5
},

  // ── Premium+ · Security · CRM · CTO ───────────────────────────────
{
  id: "cybersecurity-retainer",
  name: "Cybersecurity & vCISO Retainer",
  category: "Development",
  icon: "shield",
  tagline: "Ongoing security leadership, monitoring, and incident response delivered as a predictable monthly retainer.",
  popular: true,
  workType: "Consulting",
  paymentSchedule: "monthly_retainer",
  scopeLabel: "Security Services Scope",
  scopeDefault:
    "{{freelancerName}} will provide {{clientName}} with ongoing security services under {{projectTitle}}, beginning {{startDateLabel}}. The engagement covers {{securityServices}}, with {{monitoringCoverage}} and a target incident response time of {{incidentSla}}. Vulnerability scanning will be performed {{scanCadence}}, and the program will be aligned toward {{frameworkTarget}}. {{freelancerName}} will deliver {{reportingCadence}} summarizing posture, open risks, and recommended remediation across the systems described below.",
  fields: [
    {
      key: "securityServices",
      label: "Security Services",
      type: "select",
      required: true,
      default: "managed security monitoring and advisory",
      hint: "The primary mode of engagement.",
      options: [
        { value: "vCISO strategic security advisory", label: "vCISO advisory" },
        { value: "managed security monitoring and advisory", label: "Managed monitoring" },
        { value: "a fully managed security operations (SOC) function", label: "Full SOC" },
      ],
    },
    {
      key: "monthlyHours",
      label: "Included Hours / Month",
      type: "number",
      required: true,
      default: "20",
      placeholder: "20",
      hint: "Retainer hours included each month before overage applies.",
    },
    {
      key: "frameworkTarget",
      label: "Compliance Framework",
      type: "select",
      required: true,
      default: "SOC 2 readiness",
      hint: "The standard the program is working toward.",
      options: [
        { value: "SOC 2 readiness", label: "SOC 2" },
        { value: "ISO 27001 alignment", label: "ISO 27001" },
        { value: "the NIST Cybersecurity Framework", label: "NIST CSF" },
        { value: "general security best practices without a specific certification", label: "No framework" },
      ],
    },
    {
      key: "monitoringCoverage",
      label: "Monitoring & Response Coverage",
      type: "select",
      required: true,
      default: "business-hours monitoring and response",
      hint: "When monitoring and active response are provided.",
      options: [
        { value: "business-hours monitoring and response", label: "Business hours" },
        { value: "24/7 monitoring and response", label: "24/7" },
      ],
    },
    {
      key: "incidentSla",
      label: "Incident Response SLA",
      type: "select",
      required: true,
      default: "4 hours for critical incidents",
      hint: "Target time to begin active response on a critical incident.",
      options: [
        { value: "1 hour for critical incidents", label: "1 hour" },
        { value: "4 hours for critical incidents", label: "4 hours" },
        { value: "the next business day for critical incidents", label: "Next business day" },
      ],
    },
    {
      key: "scanCadence",
      label: "Vulnerability Scanning Cadence",
      type: "select",
      required: true,
      default: "monthly",
      hint: "How often vulnerability scans are run.",
      options: [
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "quarterly", label: "Quarterly" },
      ],
    },
    {
      key: "securityTraining",
      label: "Security Awareness Training",
      type: "select",
      required: true,
      default: "included quarterly for all staff",
      hint: "Whether staff security training is part of the retainer.",
      options: [
        { value: "included quarterly for all staff", label: "Included" },
        { value: "not included and available as a separate engagement", label: "Not included" },
      ],
    },
    {
      key: "reportingCadence",
      label: "Reporting Cadence",
      type: "select",
      required: true,
      default: "a monthly security report",
      hint: "How often posture reports are delivered.",
      options: [
        { value: "a monthly security report", label: "Monthly" },
        { value: "a bi-weekly security report", label: "Bi-weekly" },
        { value: "a quarterly executive security briefing", label: "Quarterly" },
      ],
    },
    {
      key: "toolingOwner",
      label: "Security Tooling Owner",
      type: "text",
      required: true,
      default: "Client (licenses held in Client accounts)",
      placeholder: "Client (licenses held in Client accounts)",
      hint: "Who owns and pays for security tools and licenses.",
    },
    {
      key: "scopeOfSystems",
      label: "Scope of Systems",
      type: "textarea",
      required: true,
      wide: true,
      placeholder: "Cloud infrastructure (AWS production accounts), corporate endpoints, Google Workspace, primary web application, and CI/CD pipeline.",
      hint: "The systems, environments, and assets covered by the retainer.",
    },
    {
      key: "complianceGoals",
      label: "Compliance & Security Goals",
      type: "textarea",
      required: true,
      wide: true,
      placeholder: "Achieve SOC 2 Type II audit readiness within 9 months, establish a documented incident response plan, and reduce critical vulnerabilities to zero.",
      hint: "What success looks like for the security program.",
    },
    {
      key: "startDate",
      label: "Engagement Start Date",
      type: "date",
      required: true,
      hint: "When monitoring and advisory coverage begins.",
    },
  ],
  extraClauses: [
    {
      title: "Monthly Retainer & Renewal",
      body: "<p>This engagement is provided as a monthly retainer of {{formattedAmount}}, billed in advance on a recurring basis per {{scheduleLabel}}, and includes up to {{monthlyHours}} hours of security work per month. Unused hours do not roll over, and work beyond the included hours will be quoted and approved in advance. The retainer renews automatically each month and may be cancelled by either party with thirty (30) days' written notice. Fees may be adjusted at renewal with thirty (30) days' notice.</p>",
    },
    {
      title: "No Guarantee Against Breach",
      body: "<p>Security is a continuous, evolving practice. {{freelancerName}} will apply reasonable, industry-standard measures and professional judgment, but <strong>does not and cannot guarantee that {{clientName}} will be free from breaches, intrusions, malware, or data loss</strong>. All assessments reflect a point-in-time view, the threat landscape evolves constantly, and no security program can eliminate all risk. {{clientName}} retains ultimate responsibility for accepting residual risk and acting on recommendations.</p>",
    },
    {
      title: "Incident Response Scope & SLA",
      body: "<p>{{freelancerName}} will provide {{monitoringCoverage}} and will begin active response within {{incidentSla}}. Response includes triage, containment guidance, and coordination of remediation across the systems in scope. Major incidents requiring forensics, legal counsel, breach notification, or third-party specialists are outside the included hours and will be handled as a separate, prioritized engagement. {{clientName}} agrees to provide timely access and decision-making during an active incident.</p>",
    },
    {
      title: "Confidentiality & Responsible Handling of Findings",
      body: "<p>{{freelancerName}} will treat all vulnerabilities, configurations, credentials, and findings discovered during the engagement as strictly confidential and will disclose them only to {{clientName}}'s authorized contacts through secure channels. Findings will not be published, shared, or used outside this engagement. {{clientName}} likewise agrees not to disclose {{freelancerName}}'s methods, tooling, or proprietary materials.</p>",
    },
    {
      title: "Tooling & License Costs Are the Client's",
      body: "<p>Security tooling, monitoring platforms, scanners, SIEM, endpoint agents, and related subscriptions are the responsibility of {{toolingOwner}}. {{clientName}} agrees that all such licenses, third-party services, and cloud costs are paid directly by {{clientName}} and are not included in {{formattedAmount}}. Where {{freelancerName}} procures tooling on {{clientName}}'s behalf, those costs are passed through at cost plus any agreed handling fee.</p>",
    },
    {
      title: "Limitation of Liability",
      body: "<p>To the maximum extent permitted by law, {{freelancerName}}'s total liability arising out of or related to this engagement is limited to the fees paid by {{clientName}} in the three (3) months preceding the event giving rise to the claim. {{freelancerName}} is not liable for indirect, incidental, consequential, or punitive damages, including lost profits, business interruption, regulatory fines, or third-party claims, even if advised of their possibility.</p>",
    },
  ],
  fillMinutes: 5,
},
{
  id: "crm-implementation",
  name: "CRM Implementation & Automation",
  category: "Business",
  icon: "contact",
  tagline: "Stand up, configure, and automate a CRM platform with clean data, workflows, and trained users ready for go-live.",
  workType: "Consulting",
  paymentSchedule: "split_50_50",
  scopeLabel: "Implementation Scope",
  scopeDefault:
    "{{freelancerName}} will implement and configure a CRM for {{clientName}} under {{projectTitle}}, {{crmPlatform}}. The project includes {{dataMigration}}, the build of {{automationCount}} automated workflows, and {{userTraining}}. Reporting will be delivered as {{reportingScope}}, and existing records will undergo {{dataCleansing}} prior to launch. The configured system will be ready for go-live by {{goLiveDate}}, covering the processes and success criteria defined below.",
  fields: [
    {
      key: "crmPlatform",
      label: "CRM Platform",
      type: "select",
      required: true,
      default: "implemented on HubSpot",
      hint: "The platform being configured.",
      options: [
        { value: "implemented on Salesforce", label: "Salesforce" },
        { value: "implemented on HubSpot", label: "HubSpot" },
        { value: "implemented on Pipedrive", label: "Pipedrive" },
        { value: "implemented on Zoho CRM", label: "Zoho" },
      ],
    },
    {
      key: "licenseOwner",
      label: "Edition / License Owner",
      type: "text",
      required: true,
      default: "Client (Professional edition, billed to Client)",
      placeholder: "Client (Professional edition, billed to Client)",
      hint: "Who holds and pays for the CRM subscription and edition.",
    },
    {
      key: "dataMigration",
      label: "Data Migration",
      type: "select",
      required: true,
      default: "a basic import of existing contacts and companies",
      hint: "The level of data migration included.",
      options: [
        { value: "no data migration", label: "None" },
        { value: "a basic import of existing contacts and companies", label: "Basic import" },
        { value: "a full data migration with field mapping and deduplication", label: "Full migration" },
      ],
    },
    {
      key: "automationCount",
      label: "Number of Automations / Workflows",
      type: "number",
      required: true,
      default: "10",
      placeholder: "10",
      hint: "How many automated workflows are included in scope.",
    },
    {
      key: "integrations",
      label: "Integrations",
      type: "text",
      required: false,
      placeholder: "Gmail, Slack, calendar sync, and Stripe billing",
      hint: "Third-party tools to connect to the CRM.",
    },
    {
      key: "customObjects",
      label: "Custom Objects / Fields",
      type: "select",
      required: true,
      default: "standard objects with custom fields",
      hint: "Level of data-model customization.",
      options: [
        { value: "standard objects only", label: "Standard only" },
        { value: "standard objects with custom fields", label: "Custom fields" },
        { value: "custom objects with tailored fields and relationships", label: "Custom objects" },
      ],
    },
    {
      key: "userTraining",
      label: "User Count & Training",
      type: "select",
      required: true,
      default: "onboarding and training for up to 10 users",
      hint: "Number of users and the training included.",
      options: [
        { value: "onboarding and training for up to 5 users", label: "Up to 5 users" },
        { value: "onboarding and training for up to 10 users", label: "Up to 10 users" },
        { value: "onboarding and role-based training for the full team", label: "Full team" },
      ],
    },
    {
      key: "reportingScope",
      label: "Reporting / Dashboards",
      type: "select",
      required: true,
      default: "a standard sales pipeline dashboard",
      hint: "The reporting and dashboards delivered.",
      options: [
        { value: "a standard sales pipeline dashboard", label: "Standard dashboard" },
        { value: "a set of custom dashboards for sales and management", label: "Custom dashboards" },
        { value: "no reporting beyond platform defaults", label: "Defaults only" },
      ],
    },
    {
      key: "dataCleansing",
      label: "Data Cleansing",
      type: "select",
      required: true,
      default: "deduplication and basic cleansing of imported records",
      hint: "How existing data is cleaned before import.",
      options: [
        { value: "no data cleansing", label: "None" },
        { value: "deduplication and basic cleansing of imported records", label: "Basic cleansing" },
        { value: "full cleansing, normalization, and enrichment of records", label: "Full cleansing" },
      ],
    },
    {
      key: "processScope",
      label: "Process Scope",
      type: "textarea",
      required: true,
      wide: true,
      placeholder: "Lead capture and routing, a 5-stage sales pipeline, quote-to-close handoff, and automated follow-up sequences for new and dormant leads.",
      hint: "The business processes the CRM must support.",
    },
    {
      key: "successCriteria",
      label: "Success Criteria",
      type: "textarea",
      required: true,
      wide: true,
      placeholder: "All active deals migrated and visible in the pipeline, sales team logging in daily, and automated lead-routing reducing response time to under one hour.",
      hint: "What defines a successful implementation.",
    },
    {
      key: "goLiveDate",
      label: "Go-Live Date",
      type: "date",
      required: true,
      hint: "Target date the configured CRM is live for the team.",
    },
  ],
  extraClauses: [
    {
      title: "License & Subscription Costs Are the Client's",
      body: "<p>The CRM platform subscription, seat licenses, edition upgrades, paid add-ons, and any connected third-party services are the responsibility of {{licenseOwner}}. {{clientName}} agrees that these recurring costs are paid directly to the vendors and are not included in {{formattedAmount}}, which covers {{freelancerName}}'s implementation and configuration services only.</p>",
    },
    {
      title: "Data Migration & Accuracy",
      body: "<p>{{freelancerName}} will perform {{dataMigration}} using the source data provided by {{clientName}}. {{clientName}} is responsible for reviewing and validating migrated records for completeness and accuracy. <strong>{{freelancerName}} is not responsible for pre-existing errors, duplicates, or gaps in the Client's source data</strong>, and corrections beyond the agreed cleansing scope will be handled as a change request.</p>",
    },
    {
      title: "Acceptance & User Sign-off",
      body: "<p>Deliverables are presented for review against the success criteria defined above. {{clientName}} has five (5) business days to test and either accept or provide written, specific change requests. Configuration is deemed accepted upon written sign-off or first business use of the live system. Acceptance of go-live confirms the implementation meets the agreed scope.</p>",
    },
    {
      title: "Access & Admin Credentials",
      body: "<p>{{clientName}} will provide {{freelancerName}} with timely administrator access to the CRM, source data systems, and any tools required for {{integrations}} or migration. Delays in providing access, credentials, or required decisions will extend the {{goLiveDate}} timeline accordingly. {{freelancerName}} will handle all credentials securely and remove its access upon completion if requested.</p>",
    },
    {
      title: "Change Requests",
      body: "<p>Work beyond the defined process scope, the agreed {{automationCount}} workflows, or the stated customization level constitutes a change request. {{freelancerName}} will estimate additional effort and cost in writing for {{clientName}}'s approval before proceeding. The original timeline and {{formattedAmount}} assume the scope documented in this agreement.</p>",
    },
    {
      title: "Post-Go-Live Support Window",
      body: "<p>Following go-live, {{freelancerName}} will provide fourteen (14) days of complimentary support to address configuration defects and answer adoption questions. This window covers fixes to delivered work, not new features, additional training, or ongoing administration, which are available under a separate support or retainer arrangement.</p>",
    },
  ],
  fillMinutes: 5,
},
{
  id: "fractional-cto",
  name: "Fractional CTO & Technical Advisory",
  category: "Business",
  icon: "briefcase",
  tagline: "Part-time technical leadership to guide architecture, teams, and strategy without a full-time executive hire.",
  popular: true,
  workType: "Consulting",
  paymentSchedule: "monthly_retainer",
  scopeLabel: "Engagement Scope",
  scopeDefault:
    "{{freelancerName}} will serve {{clientName}} as Fractional CTO under {{projectTitle}}, beginning {{startDateLabel}}, on a basis of {{engagementLevel}}. The engagement encompasses {{focusAreas}}, with {{decisionAuthority}} and {{teamManagement}}. {{freelancerName}} will be involved in {{vendorHiring}} and will report to {{reportingTo}}, delivering technical leadership across the responsibilities detailed below while respecting the stated out-of-scope boundaries.",
  fields: [
    {
      key: "engagementLevel",
      label: "Engagement Level",
      type: "select",
      required: true,
      default: "fractional engagement of 2 to 3 days per week",
      hint: "How much time the engagement covers.",
      options: [
        { value: "advisory engagement of a few days per month", label: "Advisory (days/month)" },
        { value: "fractional engagement of 2 to 3 days per week", label: "Fractional (2-3 days/week)" },
        { value: "interim full-time leadership engagement", label: "Interim full-time" },
      ],
    },
    {
      key: "daysPerMonth",
      label: "Days Per Month",
      type: "number",
      required: true,
      default: "10",
      placeholder: "10",
      hint: "Approximate committed days per month.",
    },
    {
      key: "focusAreas",
      label: "Focus Areas",
      type: "select",
      required: true,
      default: "technical strategy, architecture, and team building",
      hint: "Where the engagement concentrates.",
      options: [
        { value: "technical architecture and engineering strategy", label: "Architecture" },
        { value: "engineering team building, hiring, and mentoring", label: "Team building" },
        { value: "fundraising support and technical due diligence", label: "Fundraising / DD" },
        { value: "technical strategy, architecture, and team building", label: "All of the above" },
      ],
    },
    {
      key: "decisionAuthority",
      label: "Decision Authority",
      type: "select",
      required: true,
      default: "shared decision-making with the founders",
      hint: "Level of authority over technical decisions.",
      options: [
        { value: "an advisory role with recommendations only", label: "Advisory only" },
        { value: "shared decision-making with the founders", label: "Shared" },
        { value: "delegated authority over technical decisions", label: "Delegated" },
      ],
    },
    {
      key: "teamManagement",
      label: "Team Management",
      type: "select",
      required: true,
      default: "mentoring of engineering leads",
      hint: "Extent of direct team responsibility.",
      options: [
        { value: "no direct team management", label: "None" },
        { value: "mentoring of engineering leads", label: "Mentoring" },
        { value: "full management of the engineering team", label: "Full management" },
      ],
    },
    {
      key: "vendorHiring",
      label: "Vendor & Hiring Involvement",
      type: "select",
      required: true,
      default: "vendor evaluation and engineering hiring decisions",
      hint: "Involvement in vendors and recruiting.",
      options: [
        { value: "advising on vendor and hiring decisions only", label: "Advisory" },
        { value: "vendor evaluation and engineering hiring decisions", label: "Active involvement" },
        { value: "leading vendor selection and the full hiring process", label: "Leading" },
      ],
    },
    {
      key: "confidentialityIp",
      label: "Confidentiality & IP",
      type: "select",
      required: true,
      default: "work product assigned to the Client with mutual confidentiality",
      hint: "How IP and confidentiality are handled.",
      options: [
        { value: "work product assigned to the Client with mutual confidentiality", label: "Assign to Client" },
        { value: "a license to the Client with mutual confidentiality", label: "License to Client" },
      ],
    },
    {
      key: "reportingTo",
      label: "Reporting To",
      type: "text",
      required: true,
      default: "the CEO and founding team",
      placeholder: "the CEO and founding team",
      hint: "Who the Fractional CTO reports to.",
    },
    {
      key: "noticePeriod",
      label: "Notice Period",
      type: "text",
      required: true,
      default: "30 days",
      placeholder: "30 days",
      hint: "Notice required to end the engagement.",
    },
    {
      key: "responsibilities",
      label: "Responsibilities",
      type: "textarea",
      required: true,
      wide: true,
      placeholder: "Own the technical roadmap, lead architecture decisions, run weekly engineering reviews, support fundraising with technical materials, and coach two engineering leads.",
      hint: "The core duties of the engagement.",
    },
    {
      key: "outOfScope",
      label: "Out of Scope",
      type: "textarea",
      required: true,
      wide: true,
      placeholder: "Hands-on production coding, 24/7 on-call duty, day-to-day project management, and any role as a statutory officer or signatory of the company.",
      hint: "What the engagement explicitly does not cover.",
    },
    {
      key: "startDate",
      label: "Engagement Start Date",
      type: "date",
      required: true,
      hint: "When the advisory engagement begins.",
    },
  ],
  extraClauses: [
    {
      title: "Monthly Retainer & Renewal",
      body: "<p>This engagement is provided as a monthly retainer of {{formattedAmount}}, billed in advance per {{scheduleLabel}}, reflecting an {{engagementLevel}} of approximately {{daysPerMonth}} days per month. The retainer renews automatically each month and may be ended by either party with {{noticePeriod}} written notice. Substantial work beyond the committed days will be agreed in advance, and fees may be revisited at renewal with reasonable notice.</p>",
    },
    {
      title: "Advisory Nature & No Guarantee of Outcomes",
      body: "<p>{{freelancerName}} provides experienced technical leadership and judgment but <strong>does not guarantee specific business, fundraising, hiring, or technical outcomes</strong>. Decisions ultimately rest with {{clientName}} and {{reportingTo}}. Recommendations are made in good faith based on available information, and {{clientName}} is responsible for the final decisions it adopts and their results.</p>",
    },
    {
      title: "IP & Work Product Ownership",
      body: "<p>Subject to full payment, deliverables, documentation, and original work product created specifically for {{clientName}} under this engagement are {{confidentialityIp}}. {{freelancerName}} retains ownership of pre-existing methods, frameworks, templates, and general know-how, and grants {{clientName}} a license to use these as embedded in the deliverables.</p>",
    },
    {
      title: "Independent Contractor",
      body: "<p>{{freelancerName}} acts as an independent contractor and not as an employee, statutory officer, or director of {{clientName}} unless separately and formally appointed in writing. Nothing in this agreement creates an employment, partnership, or fiduciary relationship. {{freelancerName}} is responsible for its own taxes, insurance, and benefits, and retains discretion over how services are performed.</p>",
    },
    {
      title: "Confidentiality & Conflicts",
      body: "<p>{{freelancerName}} will keep {{clientName}}'s technical, financial, and strategic information strictly confidential and will use it solely for this engagement. {{freelancerName}} may serve other clients provided there is no direct competitive conflict with {{clientName}}, and will disclose any material conflict of interest that arises during the term.</p>",
    },
    {
      title: "Non-Solicitation",
      body: "<p>During the engagement and for twelve (12) months after it ends, neither party will knowingly solicit for employment the other's employees or contractors introduced through this engagement, without prior written consent. This clause does not restrict general public job postings that are not specifically targeted at the other party's personnel.</p>",
    },
  ],
  fillMinutes: 5,
},

  // ── Premium+ · Docs · Course · Music ───────────────────────────────
{
  id: "technical-documentation",
  name: "Technical Writing & Documentation",
  category: "Content & Media",
  icon: "file-code",
  tagline: "Developer-grade docs that turn complex products into clear, accurate, ready-to-ship reference material.",
  workType: "Content Writing",
  paymentSchedule: "split_50_50",
  scopeLabel: "Documentation scope",
  fillMinutes: 5,
  scopeDefault:
    "{{freelancerName}} will research, write, and structure {{docType}} for \"{{projectTitle}}\", covering approximately {{pageCount}} articles authored in {{sourceFormat}} for an audience of {{audience}}. Drafts will be delivered for review across {{reviewCycles}} review cycle(s), with code samples {{codeSamples}} and {{diagrams}}. Each deliverable will be edited for clarity, technical accuracy, and consistency before final hand-off to the Client by {{deliveryDate}}, with the full engagement valued at {{formattedAmount}} on the {{scheduleLabel}} basis.",
  fields: [
    {
      key: "docType",
      label: "Documentation type",
      type: "select",
      required: true,
      default: "API reference documentation",
      hint: "What kind of documentation is being produced.",
      options: [
        { value: "API reference documentation", label: "API reference" },
        { value: "end-user guides and how-to articles", label: "User guides" },
        { value: "developer and integration documentation", label: "Developer docs" },
        { value: "an internal knowledge base", label: "Knowledge base" },
      ],
    },
    {
      key: "pageCount",
      label: "Number of articles / pages",
      type: "number",
      required: true,
      placeholder: "12",
      hint: "Approximate count of distinct articles or pages.",
    },
    {
      key: "sourceFormat",
      label: "Source format & tool",
      type: "select",
      required: true,
      default: "Markdown source files",
      hint: "How the documentation is authored and delivered.",
      options: [
        { value: "Markdown source files", label: "Markdown" },
        { value: "a Docusaurus site", label: "Docusaurus" },
        { value: "a GitBook space", label: "GitBook" },
        { value: "Confluence pages", label: "Confluence" },
      ],
    },
    {
      key: "audience",
      label: "Primary audience",
      type: "select",
      required: true,
      default: "software developers",
      hint: "Who the documentation is written for.",
      options: [
        { value: "software developers", label: "Developers" },
        { value: "non-technical end-users", label: "End-users" },
        { value: "internal team members", label: "Internal team" },
      ],
    },
    {
      key: "codeSamples",
      label: "Code samples",
      type: "select",
      required: true,
      default: "written and tested by the Freelancer",
      hint: "Who produces the runnable code examples.",
      options: [
        { value: "written and tested by the Freelancer", label: "Included" },
        { value: "supplied by the Client and integrated as provided", label: "Client-provided" },
        { value: "not included in this engagement", label: "None" },
      ],
    },
    {
      key: "diagrams",
      label: "Diagrams & visuals",
      type: "select",
      required: true,
      default: "supporting diagrams will be created as needed",
      hint: "Whether architecture or flow diagrams are included.",
      options: [
        { value: "supporting diagrams will be created as needed", label: "Created by Freelancer" },
        { value: "diagrams will be supplied by the Client", label: "Client-provided" },
        { value: "no diagrams are included", label: "No diagrams" },
      ],
    },
    {
      key: "seoStructure",
      label: "SEO & information structure",
      type: "select",
      required: true,
      default: "organized with search-optimized headings and cross-linking",
      hint: "How discoverability and navigation are handled.",
      options: [
        { value: "organized with search-optimized headings and cross-linking", label: "SEO-optimized" },
        { value: "structured for clear in-product navigation", label: "Navigation-first" },
        { value: "structured to the Client's existing information architecture", label: "Match existing IA" },
      ],
    },
    {
      key: "reviewCycles",
      label: "Review cycles",
      type: "number",
      required: true,
      default: "2",
      hint: "Rounds of Client review built into the engagement.",
    },
    {
      key: "smeAccess",
      label: "Subject-matter access",
      type: "text",
      placeholder: "Slack channel + 2 engineer office-hours per week",
      hint: "How the Freelancer reaches experts and the product.",
    },
    {
      key: "docScopeDetail",
      label: "Detailed documentation scope",
      type: "textarea",
      wide: true,
      placeholder: "List the endpoints, features, or sections to be documented, and any explicit exclusions.",
      hint: "The concrete topics, sections, and exclusions.",
    },
    {
      key: "styleGuide",
      label: "Style guide & terminology",
      type: "textarea",
      wide: true,
      placeholder: "Voice and tone, naming conventions, glossary terms, and any house style to follow (e.g. Google Developer Style Guide).",
      hint: "The conventions the docs must follow.",
    },
    {
      key: "deliveryDate",
      label: "Final delivery date",
      type: "date",
      required: true,
      hint: "Target date for final, reviewed documentation.",
    },
  ],
  extraClauses: [
    {
      title: "Subject-Matter Access & Accuracy",
      body:
        "<p>Accurate documentation depends on timely access to the Client's product, systems, and subject-matter experts. The Client will provide the access described as <strong>{{smeAccess}}</strong>, along with working credentials, environments, and timely answers to technical questions. {{freelancerName}} will document the product in good faith based on the information and access made available; delays or gaps in Client responses may extend the {{deliveryDate}} timeline and are not the Freelancer's responsibility.</p>",
    },
    {
      title: "Revisions Scope",
      body:
        "<p>This engagement includes {{reviewCycles}} review cycle(s) per deliverable, addressing corrections, clarity, and adherence to the agreed style guide. Substantive changes to scope, newly added topics beyond the agreed {{pageCount}} articles, or documentation of product changes introduced after a draft is approved are treated as additional work and will be quoted separately before any further effort begins.</p>",
    },
    {
      title: "Ownership & Usage on Payment",
      body:
        "<p>Upon receipt of full payment of {{formattedAmount}}, all final documentation prepared for \"{{projectTitle}}\" — including text, examples, and structure — is assigned to the Client for unrestricted internal and public use. Until full payment is received, {{freelancerName}} retains all rights in the work, and no draft or final material may be published, deployed, or distributed by the Client.</p>",
    },
    {
      title: "Technical Accuracy Disclaimer",
      body:
        "<p>The documentation reflects the product, APIs, and behavior as they exist at the time of writing and as represented by the Client and its experts. {{freelancerName}} does not warrant that the documentation will remain accurate after subsequent product changes, releases, or third-party dependency updates. The Client is responsible for validating technical instructions against its production systems before publication.</p>",
    },
    {
      title: "Maintenance Excluded",
      body:
        "<p>This agreement covers the authoring and delivery of the agreed documentation only. Ongoing maintenance, updates for future product versions, content audits, and answering reader questions are not included. {{freelancerName}} is happy to provide continued documentation support under a separate retainer or change order.</p>",
    },
    {
      title: "Confidentiality",
      body:
        "<p>In the course of this work {{freelancerName}} may access non-public source code, internal systems, roadmaps, and proprietary information. The Freelancer will keep such information confidential, use it solely to produce the documentation, and not disclose it to any third party without the Client's written consent. This obligation survives completion or termination of this agreement.</p>",
    },
  ],
},
{
  id: "online-course",
  name: "Online Course & E-Learning Production",
  category: "Content & Media",
  icon: "monitor-play",
  tagline: "End-to-end production of a polished, platform-ready online course your learners will actually finish.",
  popular: true,
  workType: "Video Editing",
  paymentSchedule: "milestone",
  scopeLabel: "Course production scope",
  fillMinutes: 5,
  scopeDefault:
    "{{freelancerName}} will produce \"{{projectTitle}}\", a course {{courseFormat}} spanning {{moduleCount}} modules and approximately {{videoLength}} of finished content at a {{productionLevel}} production standard. The course will be prepared for delivery on {{platform}}, accompanied by {{supportingMaterials}} and {{captions}}. Production will proceed through agreed milestones, beginning on {{startDateLabel}} and targeting launch by {{launchDate}}, with the full engagement valued at {{formattedAmount}} on the {{scheduleLabel}} basis.",
  fields: [
    {
      key: "courseFormat",
      label: "Course format",
      type: "select",
      required: true,
      default: "delivered as pre-recorded video lessons",
      hint: "How learners experience the course.",
      options: [
        { value: "delivered as pre-recorded video lessons", label: "Pre-recorded video" },
        { value: "run as a live cohort-based program", label: "Live cohort" },
        { value: "delivered as a hybrid of recorded lessons and live sessions", label: "Hybrid" },
      ],
    },
    {
      key: "moduleCount",
      label: "Number of modules",
      type: "number",
      required: true,
      placeholder: "8",
      hint: "Distinct modules or sections in the curriculum.",
    },
    {
      key: "videoLength",
      label: "Total video length",
      type: "text",
      required: true,
      placeholder: "4 hours",
      hint: "Approximate total runtime of finished video.",
    },
    {
      key: "productionLevel",
      label: "Production level",
      type: "select",
      required: true,
      default: "talking-head video with edited graphics",
      hint: "The visual production standard.",
      options: [
        { value: "talking-head video with edited graphics", label: "Talking-head" },
        { value: "screen-recording walkthroughs with voiceover", label: "Screen-recording" },
        { value: "fully studio-produced video with multi-camera setup", label: "Studio-produced" },
      ],
    },
    {
      key: "platform",
      label: "Hosting platform",
      type: "select",
      required: true,
      default: "Teachable",
      hint: "Where the finished course will be hosted.",
      options: [
        { value: "Teachable", label: "Teachable" },
        { value: "Kajabi", label: "Kajabi" },
        { value: "Udemy", label: "Udemy" },
        { value: "the Client's own learning management system", label: "Client LMS" },
      ],
    },
    {
      key: "supportingMaterials",
      label: "Supporting materials",
      type: "select",
      required: true,
      default: "downloadable slides and workbooks",
      hint: "Companion resources produced alongside the video.",
      options: [
        { value: "downloadable slides and workbooks", label: "Slides + workbooks" },
        { value: "module quizzes and knowledge checks", label: "Quizzes" },
        { value: "no supporting materials", label: "None" },
      ],
    },
    {
      key: "captions",
      label: "Captions & accessibility",
      type: "select",
      required: true,
      default: "accurate closed captions on every lesson",
      hint: "How accessibility is handled.",
      options: [
        { value: "accurate closed captions on every lesson", label: "Captions included" },
        { value: "full WCAG-aligned accessibility including captions and transcripts", label: "Full accessibility" },
        { value: "no captions or accessibility features", label: "None" },
      ],
    },
    {
      key: "revisionRounds",
      label: "Revision rounds per module",
      type: "number",
      required: true,
      default: "2",
      hint: "Rounds of edits included per finished module.",
    },
    {
      key: "curriculumOutline",
      label: "Curriculum outline",
      type: "textarea",
      wide: true,
      placeholder: "List each module and its lessons, plus the sequence and any prerequisites.",
      hint: "The module-by-module structure of the course.",
    },
    {
      key: "learningOutcomes",
      label: "Learning outcomes",
      type: "textarea",
      wide: true,
      placeholder: "What learners will be able to do by the end of the course, and who the course is for.",
      hint: "The measurable outcomes the course delivers.",
    },
    {
      key: "ipRights",
      label: "IP & instructor rights",
      type: "select",
      required: true,
      default: "owned by the Client with the Freelancer credited as producer",
      hint: "Who owns the finished course IP.",
      options: [
        { value: "owned by the Client with the Freelancer credited as producer", label: "Client owns" },
        { value: "owned by the Freelancer and licensed to the Client for hosting", label: "Freelancer owns, licensed" },
        { value: "co-owned with a revenue share to be agreed in writing", label: "Co-owned" },
      ],
    },
    {
      key: "launchDate",
      label: "Target launch date",
      type: "date",
      required: true,
      hint: "Date the course is intended to go live.",
    },
  ],
  extraClauses: [
    {
      title: "Content Ownership & Instructor/Usage Rights",
      body:
        "<p>Subject to full payment of {{formattedAmount}}, the finished course for \"{{projectTitle}}\" is {{ipRights}}. Where the Client owns the course IP, {{freelancerName}} retains the right to reference the project in a portfolio. Where the Freelancer owns the IP, the Client receives a non-exclusive license to host and sell the course on {{platform}}. Any teaching materials, templates, or production assets created by the Freelancer and reused across projects remain the Freelancer's property.</p>",
    },
    {
      title: "Platform & Hosting Costs Are the Client's",
      body:
        "<p>All costs of hosting and delivering the course — including {{platform}} subscriptions, transaction fees, bandwidth, and any third-party tools or stock licenses required for ongoing operation — are the responsibility of the Client. {{freelancerName}}'s fee of {{formattedAmount}} covers production only and does not include platform fees or post-launch hosting.</p>",
    },
    {
      title: "Production Milestones & Acceptance",
      body:
        "<p>Production proceeds in milestones tied to the agreed curriculum, with payment released on the {{scheduleLabel}} basis as each milestone is delivered. The Client will review each milestone within five business days and either accept it or provide consolidated written feedback within the agreed {{revisionRounds}} revision rounds. A milestone not rejected in writing within that window is deemed accepted, and subsequent production continues on that basis.</p>",
    },
    {
      title: "Revisions Scope",
      body:
        "<p>Each module includes {{revisionRounds}} round(s) of revisions covering edits, corrections, and refinements to delivered video and materials. Re-recording lessons due to Client-side script or content changes, adding modules beyond the agreed {{moduleCount}}, or reworking accepted milestones are billable as additional work and will be quoted before any further production begins.</p>",
    },
    {
      title: "On-Camera Talent & Likeness",
      body:
        "<p>Where the course involves on-camera talent, voiceover, or the likeness of any individual, the Client warrants that all required talent releases, appearance rights, and consents have been secured. {{freelancerName}} is not responsible for clearing the likeness or performance of presenters supplied by the Client, and the Client indemnifies the Freelancer against claims arising from talent it provides.</p>",
    },
    {
      title: "Updates & Maintenance Excluded",
      body:
        "<p>This agreement covers production and delivery of the agreed course only. Refreshing lessons for product or curriculum changes, re-encoding for new platforms, responding to learner questions, and ongoing course maintenance after launch by {{launchDate}} are not included and are available under a separate retainer or change order.</p>",
    },
  ],
},
{
  id: "music-production",
  name: "Music Production & Audio",
  category: "Content & Media",
  icon: "music",
  tagline: "Studio-quality production, mixing, and mastering that makes your tracks sound finished, loud, and ready to release.",
  workType: "Video Editing",
  paymentSchedule: "split_50_50",
  scopeLabel: "Production Scope",
  fillMinutes: 5,
  scopeDefault:
    "{{freelancerName}} will provide {{serviceType}} for \"{{projectTitle}}\", covering {{trackCount}} track(s) in a {{genreStyle}} style. Final audio will be delivered as {{deliverableFormats}}, prepared to the agreed technical specification and supported by {{revisionRounds}} round(s) of revisions. Rights will be handled on a {{publishingSplit}} basis with credit {{creditOwnership}}, and final masters will be delivered by {{deliveryDate}} upon final payment, with the engagement valued at {{formattedAmount}} on the {{scheduleLabel}} basis.",
  fields: [
    {
      key: "serviceType",
      label: "Service",
      type: "select",
      required: true,
      default: "full music production from arrangement to final master",
      hint: "The production service being provided.",
      options: [
        { value: "full music production from arrangement to final master", label: "Full production" },
        { value: "mixing of Client-supplied recorded tracks", label: "Mixing only" },
        { value: "mastering of Client-supplied final mixes", label: "Mastering only" },
        { value: "original sound design and audio production", label: "Sound design" },
      ],
    },
    {
      key: "trackCount",
      label: "Number of tracks",
      type: "number",
      required: true,
      placeholder: "1",
      hint: "How many songs or audio pieces are covered.",
    },
    {
      key: "genreStyle",
      label: "Genre / style",
      type: "text",
      required: true,
      placeholder: "indie pop with analog warmth",
      hint: "The musical genre and sonic direction.",
    },
    {
      key: "deliverableFormats",
      label: "Deliverable formats",
      type: "select",
      required: true,
      default: "high-resolution WAV files and MP3 reference copies",
      hint: "What final files the Client receives.",
      options: [
        { value: "high-resolution WAV files and MP3 reference copies", label: "WAV + MP3" },
        { value: "high-resolution WAV files plus individual stems", label: "Stems included" },
        { value: "high-resolution WAV files plus the full project session files", label: "Full session files" },
      ],
    },
    {
      key: "revisionRounds",
      label: "Revision rounds",
      type: "number",
      required: true,
      default: "2",
      hint: "Rounds of mix/master revisions included.",
    },
    {
      key: "publishingSplit",
      label: "Publishing & royalty split",
      type: "select",
      required: true,
      default: "full buyout with all rights assigned to the Client",
      hint: "How publishing and royalties are handled.",
      options: [
        { value: "full buyout with all rights assigned to the Client", label: "Full buyout" },
        { value: "royalty share with a writer/producer split to be registered", label: "Royalty share" },
        { value: "a license for the agreed use only, with rights retained by the Freelancer", label: "License only" },
      ],
    },
    {
      key: "creditOwnership",
      label: "Credit & ownership",
      type: "select",
      required: true,
      default: "credited as producer on all releases and metadata",
      hint: "How the Freelancer is credited.",
      options: [
        { value: "credited as producer on all releases and metadata", label: "Producer credit" },
        { value: "credited as mixing and mastering engineer", label: "Engineer credit" },
        { value: "provided without a public production credit", label: "No credit" },
      ],
    },
    {
      key: "clearanceResponsibility",
      label: "Sample / clearance responsibility",
      type: "select",
      required: true,
      default: "the Client is responsible for clearing any samples or third-party material",
      hint: "Who clears samples and third-party rights.",
      options: [
        { value: "the Client is responsible for clearing any samples or third-party material", label: "Client clears" },
        { value: "the Freelancer will use only royalty-free and original material", label: "Freelancer royalty-free only" },
        { value: "no samples or third-party material will be used", label: "No samples" },
      ],
    },
    {
      key: "referenceBrief",
      label: "Reference & brief",
      type: "textarea",
      wide: true,
      placeholder: "Reference tracks, mood, instrumentation, vocal direction, and anything the production should avoid.",
      hint: "The creative direction for the production.",
    },
    {
      key: "technicalSpecs",
      label: "Technical specifications",
      type: "textarea",
      wide: true,
      placeholder: "Target loudness (e.g. -14 LUFS for streaming), sample rate and bit depth (e.g. 48kHz/24-bit), true-peak ceiling, and any platform delivery specs.",
      hint: "LUFS, sample rate, bit depth, and delivery specs.",
    },
    {
      key: "deliveryDate",
      label: "Final delivery date",
      type: "date",
      required: true,
      hint: "Date final masters are due.",
    },
  ],
  extraClauses: [
    {
      title: "Master & Publishing Rights",
      body:
        "<p>Rights in the recordings produced for \"{{projectTitle}}\" are handled as a {{publishingSplit}}. Under a full buyout, ownership of the master recording transfers to the Client on receipt of full payment of {{formattedAmount}}. Under a royalty share, ownership and the agreed split must be registered in writing, and {{freelancerName}} retains the producer's share of royalties. Under a license, the master remains owned by the Freelancer and is licensed only for the agreed use. No rights transfer until payment is complete.</p>",
    },
    {
      title: "Samples & Clearances",
      body:
        "<p>Responsibility for samples and third-party material is that {{clearanceResponsibility}}. The Client warrants that any recordings, vocals, sounds, or compositions it supplies are either original or properly licensed, and indemnifies {{freelancerName}} against any claim arising from uncleared material the Client provided. The Freelancer is not liable for infringement caused by Client-supplied content.</p>",
    },
    {
      title: "Stems & Session Files",
      body:
        "<p>Delivery comprises {{deliverableFormats}}. Where stems or full session files are not part of the agreed deliverables, they remain the property of {{freelancerName}} and may be provided later for an additional fee. Session files, plugin presets, and production techniques developed by the Freelancer remain the Freelancer's intellectual property except to the extent expressly delivered to the Client.</p>",
    },
    {
      title: "Revisions Scope",
      body:
        "<p>This engagement includes {{revisionRounds}} round(s) of revisions per track, covering mix and master adjustments against the agreed reference and technical specification. Re-arrangement, re-recording, new musical parts, or creative changes beyond the original brief for the {{trackCount}} agreed track(s) are billable as additional work and quoted before any further production begins.</p>",
    },
    {
      title: "Credit & Moral Rights",
      body:
        "<p>The Freelancer will be {{creditOwnership}}. Where a public credit is agreed, the Client will include it accurately in release metadata, liner notes, and distribution platforms. {{freelancerName}} retains the moral right to be identified as a producer of the work and the right to reference the finished tracks as portfolio and demonstration material, unless the parties agree otherwise in writing.</p>",
    },
    {
      title: "Payment & Delivery on Final Payment",
      body:
        "<p>Watermarked or reference-quality previews may be shared during production, but final, unwatermarked masters and any agreed source files are released only once full payment of {{formattedAmount}} has been received. Final delivery is targeted for {{deliveryDate}}. Any rights, ownership, or license granted under this agreement is contingent on payment in full, and use of the work before final payment is not authorized.</p>",
    },
  ],
},

  // ── Premium+ · 3D · Pitch · Recruitment ───────────────────────────────
{
  id: "3d-modeling",
  name: "3D Modeling & Rendering",
  category: "Design",
  icon: "shapes",
  tagline: "Production-ready 3D models, textures, and photoreal renders delivered with clear ownership, source-file, and revision terms.",
  workType: "UI/UX Design",
  paymentSchedule: "split_50_50",
  scopeLabel: "Modeling Scope",
  fillMinutes: 5,
  scopeDefault:
    "{{freelancerName}} will produce {{modelCount}} {{deliverableType}} for {{clientName}} as part of {{projectTitle}}, {{softwarePhrase}} to a {{fidelity}} standard. Each asset will be delivered {{texturing}} and {{rigging}}, prepared for {{output}}. The Freelancer will work from the references and technical specifications supplied by the Client and deliver final files by {{deadlineLabel}}. The engagement includes up to {{revisionCount}} rounds of revisions on the agreed scope, with the total fee of {{formattedAmount}} payable per {{scheduleLabel}}.",
  fields: [
    {
      key: "deliverableType",
      label: "Deliverable Type",
      type: "select",
      required: true,
      default: "product visualization models",
      hint: "The primary category of asset being produced.",
      options: [
        { value: "product visualization models", label: "Product models" },
        { value: "architectural visualization scenes", label: "Architectural viz" },
        { value: "stylized character models", label: "Character models" },
        { value: "game-ready 3D assets", label: "Game-ready assets" },
      ],
    },
    {
      key: "softwarePhrase",
      label: "Software",
      type: "select",
      required: true,
      default: "modeled and rendered in Blender",
      hint: "The primary application used to build and render the assets.",
      options: [
        { value: "modeled and rendered in Blender", label: "Blender" },
        { value: "modeled and rendered in Cinema 4D", label: "Cinema 4D" },
        { value: "modeled and rendered in Autodesk Maya", label: "Maya" },
        { value: "modeled and rendered in Autodesk 3ds Max", label: "3ds Max" },
      ],
    },
    {
      key: "modelCount",
      label: "Number of Models",
      type: "number",
      required: true,
      default: "3",
      placeholder: "3",
      hint: "How many distinct models or scenes are in scope.",
    },
    {
      key: "fidelity",
      label: "Poly Budget / Fidelity",
      type: "select",
      required: true,
      default: "photoreal high-detail",
      hint: "Drives topology, render time, and pricing.",
      options: [
        { value: "real-time optimized low-poly", label: "Real-time low-poly" },
        { value: "high-poly detailed", label: "High-poly" },
        { value: "photoreal high-detail", label: "Photoreal" },
      ],
    },
    {
      key: "texturing",
      label: "Texturing & Materials",
      type: "select",
      required: true,
      default: "with full PBR textures and materials",
      hint: "The level of surfacing work included.",
      options: [
        { value: "with full PBR textures and materials", label: "PBR textures" },
        { value: "with basic color and material setup", label: "Basic materials" },
        { value: "untextured, geometry only", label: "None" },
      ],
    },
    {
      key: "rigging",
      label: "Rigging & Animation",
      type: "select",
      required: true,
      default: "as static, non-rigged assets",
      hint: "Whether assets are posed, rigged, or animated.",
      options: [
        { value: "as static, non-rigged assets", label: "Static" },
        { value: "with a deformation-ready rig", label: "Rigged" },
        { value: "fully rigged and animated", label: "Animated" },
      ],
    },
    {
      key: "output",
      label: "Output",
      type: "select",
      required: true,
      default: "final still renders",
      hint: "The form in which the work is presented to the Client.",
      options: [
        { value: "final still renders", label: "Still renders" },
        { value: "a 360-degree turntable animation", label: "360 turntable" },
        { value: "real-time engine-ready scene files", label: "Real-time files" },
      ],
    },
    {
      key: "fileFormats",
      label: "File Formats",
      type: "text",
      required: true,
      default: "FBX, OBJ, and native source files",
      placeholder: "FBX, OBJ, glTF, native source",
      hint: "Exact export formats the Client will receive.",
    },
    {
      key: "revisionCount",
      label: "Revision Rounds",
      type: "number",
      required: true,
      default: "2",
      placeholder: "2",
      hint: "Included rounds of changes on the agreed scope.",
    },
    {
      key: "modelScope",
      label: "Model Scope",
      type: "textarea",
      wide: true,
      required: true,
      placeholder: "List each model/scene, level of detail, scale, and intended use...",
      hint: "Itemize what is and is not included.",
    },
    {
      key: "referenceSpecs",
      label: "Reference & Specs",
      type: "textarea",
      wide: true,
      placeholder: "Reference images, dimensions, engine/render target, naming conventions, UV/texel density...",
      hint: "Technical constraints and supplied references.",
    },
    {
      key: "deliveryDate",
      label: "Delivery Date",
      type: "date",
      required: true,
      hint: "Target date for final, approved delivery.",
    },
  ],
  extraClauses: [
    {
      title: "Source Files & Ownership on Payment",
      body: "<p>Upon receipt of the full fee of {{formattedAmount}}, the Client owns the final approved {{deliverableType}}, including the {{fileFormats}} deliverables and all native source files. The Freelancer assigns all rights in the delivered assets to the Client on payment. Until payment is received in full, all models, textures, and renders remain the property of the Freelancer and may not be used in any production or commercial context.</p>",
    },
    {
      title: "Revisions Scope",
      body: "<p>This engagement includes up to {{revisionCount}} rounds of revisions on the agreed {{modelScope}}. A revision means refinement of work already delivered to the {{fidelity}} standard. New models, changes to the {{deliverableType}} brief, conversion to a different fidelity, or added {{rigging}} requirements fall outside scope and will be quoted separately as additional work.</p>",
    },
    {
      title: "Render Times & Third-Party Render/Asset Costs",
      body: "<p>The fee covers the Freelancer's labor only. Cloud or render-farm time, paid plugins, marketplace assets, HDRIs, scan libraries, and any third-party licenses required to complete or render the {{output}} are billed to the Client at cost, or supplied by the Client. The Freelancer will obtain the Client's approval before incurring any such cost on the Client's behalf.</p>",
    },
    {
      title: "Reference & Licensing",
      body: "<p>The Client warrants that all references, photographs, CAD data, logos, and assets supplied to the Freelancer are owned by the Client or properly licensed for this use. The Client indemnifies the Freelancer against any claim arising from supplied material. The Freelancer is not responsible for verifying the provenance of Client-supplied references.</p>",
    },
    {
      title: "Acceptance & Sign-off",
      body: "<p>The Client will review each delivery within five (5) business days and provide written approval or consolidated revision notes. Work not rejected in writing within that window is deemed accepted. Final sign-off on the {{deliverableType}} by {{deadlineLabel}} closes the {{modelScope}} and triggers any remaining payment under {{scheduleLabel}}.</p>",
    },
    {
      title: "Portfolio Rights",
      body: "<p>The Freelancer may display the final {{deliverableType}} and renders produced for {{projectTitle}} in a portfolio, reel, and case studies, crediting the work as their own. Where the Client identifies an asset as confidential or pre-release in writing, the Freelancer will withhold it from public display until the Client confirms release.</p>",
    },
  ],
},
{
  id: "pitch-deck",
  name: "Pitch Deck & Investor Materials",
  category: "Business",
  icon: "presentation",
  tagline: "Investor-ready pitch decks and supporting materials, crafted with clear ownership, confidentiality, and accuracy terms.",
  popular: true,
  workType: "Consulting",
  paymentSchedule: "split_50_50",
  scopeLabel: "Engagement Scope",
  fillMinutes: 5,
  scopeDefault:
    "{{freelancerName}} will deliver {{engagementScope}} for {{clientName}} as part of {{projectTitle}}, producing a {{slideCount}}-slide deck and {{deliverables}}, built {{designTool}}. The work includes {{narrative}} and {{financialModel}}, tailored to a {{companyStage}} company. Source files will be provided {{sourceFiles}}, with up to {{revisionCount}} rounds of revisions on the agreed direction. The total fee of {{formattedAmount}} is payable per {{scheduleLabel}}, with final delivery by {{deadlineLabel}}.",
  fields: [
    {
      key: "engagementScope",
      label: "Scope",
      type: "select",
      required: true,
      default: "full strategy, narrative, and design",
      hint: "How much of the deck the Freelancer owns end to end.",
      options: [
        { value: "design and layout only", label: "Design only" },
        { value: "copywriting and narrative with design", label: "Copy + narrative" },
        { value: "full strategy, narrative, and design", label: "Full strategy + design" },
      ],
    },
    {
      key: "slideCount",
      label: "Number of Slides",
      type: "number",
      required: true,
      default: "12",
      placeholder: "12",
      hint: "Approximate slide count for the core deck.",
    },
    {
      key: "deliverables",
      label: "Deliverables",
      type: "select",
      required: true,
      default: "a leave-behind one-pager",
      hint: "What ships alongside the main deck.",
      options: [
        { value: "the core deck only", label: "Deck only" },
        { value: "a leave-behind one-pager", label: "Deck + one-pager" },
        { value: "a financial model and a leave-behind one-pager", label: "Deck + model + one-pager" },
      ],
    },
    {
      key: "designTool",
      label: "Design Tool",
      type: "select",
      required: true,
      default: "in Figma",
      hint: "The application the deck is built in.",
      options: [
        { value: "in Figma", label: "Figma" },
        { value: "in Microsoft PowerPoint", label: "PowerPoint" },
        { value: "in Apple Keynote", label: "Keynote" },
        { value: "in Pitch", label: "Pitch" },
      ],
    },
    {
      key: "narrative",
      label: "Narrative Development",
      type: "select",
      required: true,
      default: "a full narrative arc developed from scratch",
      hint: "How much story work is included.",
      options: [
        { value: "refinement of the Client's existing narrative", label: "Refine existing" },
        { value: "a full narrative arc developed from scratch", label: "Build from scratch" },
        { value: "narrative coaching and structural guidance only", label: "Coaching only" },
      ],
    },
    {
      key: "financialModel",
      label: "Financial Model",
      type: "select",
      required: true,
      default: "presentation of Client-provided financials",
      hint: "Whether modeling work is in or out of scope.",
      options: [
        { value: "a financial model built by the Freelancer", label: "Included" },
        { value: "presentation of Client-provided financials", label: "Client-provided" },
        { value: "no financial modeling", label: "Excluded" },
      ],
    },
    {
      key: "sourceFiles",
      label: "Source Files",
      type: "select",
      required: true,
      default: "as fully editable source files",
      hint: "What the Client can edit after handoff.",
      options: [
        { value: "as fully editable source files", label: "Editable source" },
        { value: "as exported PDF and image files only", label: "Exports only" },
        { value: "as editable files for an additional handoff fee", label: "Source for extra fee" },
      ],
    },
    {
      key: "revisionCount",
      label: "Revision Rounds",
      type: "number",
      required: true,
      default: "3",
      placeholder: "3",
      hint: "Included rounds of changes on the agreed direction.",
    },
    {
      key: "companyStage",
      label: "Company Stage",
      type: "select",
      required: true,
      default: "seed-stage",
      hint: "Shapes tone, depth, and investor expectations.",
      options: [
        { value: "pre-seed", label: "Pre-seed" },
        { value: "seed-stage", label: "Seed" },
        { value: "Series A or later", label: "Series A+" },
      ],
    },
    {
      key: "contentSource",
      label: "Content & Data Source",
      type: "textarea",
      wide: true,
      required: true,
      placeholder: "Where copy, metrics, traction data, and financials come from; what the Client supplies vs. what the Freelancer writes...",
      hint: "Clarify responsibility for every claim and figure.",
    },
    {
      key: "narrativeNotes",
      label: "Positioning & Narrative Notes",
      type: "textarea",
      wide: true,
      placeholder: "Target investors, key differentiators, the ask, tone, references, and any framing to avoid...",
      hint: "Strategic context for the deck's angle.",
    },
    {
      key: "pitchDate",
      label: "Pitch Date",
      type: "date",
      hint: "When the Client needs the deck ready to present.",
    },
  ],
  extraClauses: [
    {
      title: "Content Accuracy & Disclaimer",
      body: "<p>The Client is solely responsible for the accuracy of all financials, metrics, projections, and claims included in the deck, drawn from the {{contentSource}}. The Freelancer presents and designs this information but does not verify it and provides no investment advice. Nothing in this engagement is a guarantee of fundraising success, investor interest, or any financial outcome.</p>",
    },
    {
      title: "Confidentiality",
      body: "<p>The Freelancer will treat all non-public information shared by {{clientName}} for {{projectTitle}} — including the {{contentSource}}, financials, cap table, and strategy — as strictly confidential, and will not disclose or use it except to perform this work. This obligation survives completion of the engagement.</p>",
    },
    {
      title: "Source Files & Ownership on Payment",
      body: "<p>Upon receipt of the full fee of {{formattedAmount}}, the Client owns the final {{slideCount}}-slide deck and {{deliverables}}, delivered {{sourceFiles}}, and the Freelancer assigns all rights in the delivered work to the Client. Until payment is received in full, the materials remain the Freelancer's property and may not be presented to investors or third parties.</p>",
    },
    {
      title: "Revisions Scope",
      body: "<p>This engagement includes up to {{revisionCount}} rounds of revisions on the agreed direction. Revisions cover refinement of delivered slides and copy. A change of {{engagementScope}}, a pivot in {{narrative}}, additional slides beyond the {{slideCount}}-slide scope, or new {{financialModel}} work are billed separately as additional work.</p>",
    },
    {
      title: "Third-Party Assets & Fonts",
      body: "<p>Stock photography, icons, premium fonts, illustrations, and any licensed assets used in the deck are the Client's responsibility and are licensed to the Client, not the Freelancer. Where the Freelancer sources such assets, their cost is billed to the Client at cost and the Client must hold the appropriate license for ongoing investor use of the {{deliverables}}.</p>",
    },
    {
      title: "Portfolio Rights",
      body: "<p>The Freelancer may reference the engagement and show selected, non-confidential design samples from {{projectTitle}} in a portfolio or case study, crediting the work as their own. The Freelancer will respect the confidentiality of {{clientName}}: financials, traction data, and any material the Client marks sensitive will be redacted or withheld until the Client confirms release in writing.</p>",
    },
  ],
},
{
  id: "recruitment",
  name: "Recruitment & Talent Sourcing",
  category: "Business",
  icon: "user-search",
  tagline: "Source, screen, and place qualified candidates with clear fee triggers, replacement guarantees, and data-handling terms.",
  workType: "General Services",
  paymentSchedule: "milestone",
  scopeLabel: "Engagement Scope",
  fillMinutes: 4,
  scopeDefault:
    "{{freelancerName}} will run a {{engagementModel}} search for {{clientName}} to fill {{roleCount}} {{seniority}} role(s) as part of {{projectTitle}}, providing {{screeningDepth}}. The placement fee is structured as {{feeBasis}} and is earned on the terms set out below, with {{exclusivity}} for the duration of the search. The Freelancer will target a pipeline of at least {{pipelineTarget}} qualified candidates per role, handle candidate data {{dataHandling}}, and begin work on {{startDateLabel}}. Each successful placement carries a {{guaranteePeriod}}, and fees are payable per {{scheduleLabel}}.",
  fields: [
    {
      key: "engagementModel",
      label: "Model",
      type: "select",
      required: true,
      default: "contingency",
      hint: "How and when the Freelancer is paid for the search.",
      options: [
        { value: "contingency", label: "Contingency" },
        { value: "retained", label: "Retained" },
        { value: "hourly sourcing", label: "Hourly sourcing" },
      ],
    },
    {
      key: "roleCount",
      label: "Number of Roles",
      type: "number",
      required: true,
      default: "1",
      placeholder: "1",
      hint: "How many distinct positions are in scope.",
    },
    {
      key: "seniority",
      label: "Seniority",
      type: "select",
      required: true,
      default: "mid-level",
      hint: "The level of the role(s) being sourced.",
      options: [
        { value: "entry-level", label: "Entry-level" },
        { value: "mid-level", label: "Mid-level" },
        { value: "senior", label: "Senior" },
        { value: "executive and leadership", label: "Executive" },
      ],
    },
    {
      key: "feeBasis",
      label: "Placement Fee Basis",
      type: "select",
      required: true,
      default: "a percentage of the candidate's first-year base salary",
      hint: "How the placement fee is calculated.",
      options: [
        { value: "a percentage of the candidate's first-year base salary", label: "% of annual salary" },
        { value: "a flat fee per successful hire", label: "Flat per hire" },
        { value: "an hourly rate for sourcing time", label: "Hourly" },
      ],
    },
    {
      key: "screeningDepth",
      label: "Screening Depth",
      type: "select",
      required: true,
      default: "a screened, qualified shortlist",
      hint: "How far the Freelancer takes each candidate.",
      options: [
        { value: "candidate sourcing and outreach only", label: "Sourcing only" },
        { value: "a screened, qualified shortlist", label: "Screened shortlist" },
        { value: "full interview coordination through to offer", label: "Full coordination" },
      ],
    },
    {
      key: "guaranteePeriod",
      label: "Guarantee Period",
      type: "select",
      required: true,
      default: "60-day replacement guarantee",
      hint: "Free-replacement window if a placed candidate leaves.",
      options: [
        { value: "30-day replacement guarantee", label: "30 days" },
        { value: "60-day replacement guarantee", label: "60 days" },
        { value: "90-day replacement guarantee", label: "90 days" },
      ],
    },
    {
      key: "exclusivity",
      label: "Exclusivity",
      type: "select",
      required: true,
      default: "non-exclusive engagement",
      hint: "Whether the Client may use other recruiters in parallel.",
      options: [
        { value: "exclusive engagement on these roles", label: "Exclusive" },
        { value: "non-exclusive engagement", label: "Non-exclusive" },
      ],
    },
    {
      key: "pipelineTarget",
      label: "Candidate Pipeline Target",
      type: "number",
      required: true,
      default: "5",
      placeholder: "5",
      hint: "Minimum qualified candidates targeted per role.",
    },
    {
      key: "rolesRequirements",
      label: "Roles & Requirements",
      type: "textarea",
      wide: true,
      required: true,
      placeholder: "For each role: title, must-have skills, location/remote, salary band, and any non-negotiables...",
      hint: "Define what 'qualified' means for each position.",
    },
    {
      key: "processResponsibilities",
      label: "Process & Responsibilities",
      type: "textarea",
      wide: true,
      placeholder: "Who runs interviews, expected turnaround on feedback, scheduling, offer ownership, and reporting cadence...",
      hint: "Split duties between Freelancer and Client.",
    },
    {
      key: "dataHandling",
      label: "Data / Privacy Handling",
      type: "select",
      required: true,
      default: "under GDPR with documented candidate consent",
      hint: "The standard applied to candidate personal data.",
      options: [
        { value: "under GDPR with documented candidate consent", label: "GDPR + consent" },
        { value: "under the Client's data processing policy", label: "Client policy" },
        { value: "under standard confidentiality terms", label: "Standard confidentiality" },
      ],
    },
    {
      key: "kickoffDate",
      label: "Kickoff Date",
      type: "date",
      required: true,
      hint: "When the search formally begins.",
    },
  ],
  extraClauses: [
    {
      title: "Placement Fees & Payment Triggers",
      body: "<p>The placement fee, calculated as {{feeBasis}}, is earned when a candidate introduced by the Freelancer accepts a written offer from {{clientName}} and a start date is agreed. For a {{engagementModel}} arrangement, the fee for each of the {{roleCount}} role(s) becomes payable per {{scheduleLabel}} from that point. A candidate is deemed introduced by the Freelancer if first presented to the Client by the Freelancer in writing.</p>",
    },
    {
      title: "Replacement Guarantee",
      body: "<p>Each successful placement carries a {{guaranteePeriod}}. If a placed candidate resigns or is terminated for cause within that period, the Freelancer will source a replacement for the same role at no additional placement fee. The guarantee is void if the role's requirements change materially from the agreed {{rolesRequirements}}, or if any fee due remains unpaid.</p>",
    },
    {
      title: "Candidate Data & Privacy",
      body: "<p>The Freelancer will handle all candidate personal data {{dataHandling}}, collecting and processing it only as needed to fill the {{roleCount}} role(s) and sharing it with the Client on a confidential basis. Both parties will retain candidate data only as long as lawfully necessary and will honor candidate requests to access or delete their data in line with applicable privacy law.</p>",
    },
    {
      title: "No Guarantee of Hire & Client Decision",
      body: "<p>The Freelancer provides {{screeningDepth}} but does not guarantee that any candidate will be hired, accept an offer, or succeed in the role. All hiring decisions, references, background checks, and final assessments rest solely with {{clientName}}. The Freelancer is not liable for a hired candidate's performance or conduct after placement.</p>",
    },
    {
      title: "Exclusivity & Ownership of Candidates",
      body: "<p>This is a {{exclusivity}}. Candidates sourced and introduced by the Freelancer for {{projectTitle}} remain attributable to the Freelancer for twelve (12) months from introduction. If the Client hires such a candidate for any role within that period — directly or through another party — the agreed {{feeBasis}} remains due to the Freelancer.</p>",
    },
    {
      title: "Non-Solicitation",
      body: "<p>For the duration of this engagement and for twelve (12) months after, neither party will knowingly poach or directly solicit candidates placed by the Freelancer for the purpose of moving them away from {{clientName}}. The Freelancer will not actively recruit any candidate it has placed with the Client out of that placement during the same period.</p>",
    },
  ],
},
];

export function getTemplate(id: string): ContractTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

const TEMPLATE_FORMATS: Record<string, DocFormat> = {
  "web-development": "modern",
  "mobile-app": "modern",
  "ui-ux-design": "minimal",
  "logo-branding": "minimal",
  "graphic-design": "minimal",
  "content-writing": "classic",
  photography: "minimal",
  videography: "modern",
  "social-media": "modern",
  "seo-services": "classic",
  "digital-marketing": "modern",
  consulting: "legal",
  "virtual-assistant": "classic",
  "retainer-general": "classic",
  nda: "legal",
  // Premium library
  "saas-mvp": "modern",
  "api-integration": "modern",
  "ecommerce-store": "modern",
  "wordpress-care": "classic",
  "software-maintenance": "classic",
  "brand-identity-system": "minimal",
  "product-design-sprint": "minimal",
  "packaging-design": "minimal",
  "motion-graphics": "modern",
  "podcast-production": "modern",
  "website-copywriting": "classic",
  "translation-localization": "classic",
  "email-marketing": "modern",
  "influencer-campaign": "modern",
  "ppc-ads": "modern",
  "coaching-program": "classic",
  "event-planning": "modern",
  "bookkeeping": "classic",
  "master-services-agreement": "legal",
  "ip-assignment": "legal",
  // Dream library (developer flagship)
  "saas-platform-build": "modern",
  "technical-cofounder": "legal",
  "devops-cloud": "modern",
  "platform-migration": "modern",
  "ai-ml-integration": "modern",
  "blockchain-smart-contract": "modern",
  "dedicated-developer": "modern",
  "code-audit-security": "legal",
  // Extraordinary library (cross-industry flagship)
  "game-dev": "modern",
  "data-engineering": "modern",
  "nocode-build": "minimal",
  "cybersecurity-retainer": "modern",
  "crm-implementation": "modern",
  "fractional-cto": "legal",
  "technical-documentation": "classic",
  "online-course": "modern",
  "music-production": "minimal",
  "3d-modeling": "minimal",
  "pitch-deck": "modern",
  "recruitment": "classic",
};

export function templateFormat(id: string): DocFormat {
  return TEMPLATE_FORMATS[id] ?? "classic";
}

export const TEMPLATE_CATEGORIES = [
  "Development", "Design", "Content & Media", "Marketing", "Business", "Legal",
] as const;
