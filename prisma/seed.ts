import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Seeds a demo freelancer (Hamza, from the PRD persona) with a spread of
 * contracts, payments, reminders, and one signed deal so every screen has
 * realistic data on first run.
 *
 *   Login:  hamza@demo.contractly.app  /  password123
 */
async function main() {
  const email = "hamza@demo.contractly.app";
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: "Hamza Khan",
      authProvider: "email",
      emailVerified: true,
      workTypes: "Web Development,UI/UX Design",
      clientVolume: "4-10",
      defaultCurrency: "PKR",
      onboardingDone: true,
      role: "admin",
      plan: "solo",
      subscription: {
        create: { plan: "solo", status: "active", interval: "monthly" },
      },
    },
  });

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  // Active contract with AI analysis + upcoming expiry + pending payment
  const c1 = await prisma.contract.create({
    data: {
      userId: user.id,
      title: "Website Redesign — TechBazaar",
      clientName: "TechBazaar Pvt Ltd",
      clientEmail: "ops@techbazaar.pk",
      value: 180000,
      currency: "PKR",
      startDate: new Date(now - 20 * day),
      endDate: new Date(now + 10 * day),
      status: "active",
      source: "upload",
      workType: "Web Development",
      paymentSchedule: "split_50_50",
      contentText:
        "This agreement covers the redesign of the TechBazaar e-commerce website. Payment of PKR 180,000 split 50% upfront and 50% on delivery. Client may request unlimited revisions. No clause governing intellectual property ownership or late payment penalties.",
      analysis: {
        create: {
          riskScore: 62,
          riskLevel: "medium",
          summary:
            "A standard web development agreement with a fair 50/50 payment split. Two areas need attention: revisions are uncapped (scope-creep risk) and there is no IP ownership clause, which could create disputes over the final deliverables.",
          model: "mock",
          clausesJson: JSON.stringify([
            { title: "Payment Terms", type: "payment", status: "ok", text: "PKR 180,000, 50% upfront, 50% on delivery.", explanation: "Balanced split that protects your cash flow." },
            { title: "Revisions", type: "scope", status: "caution", text: "Client may request unlimited revisions.", explanation: "Uncapped revisions are a common cause of unpaid extra work. Cap them (e.g. 2 rounds)." },
            { title: "Termination", type: "termination", status: "ok", text: "Either party may terminate with 14 days notice.", explanation: "Reasonable exit terms for both sides." },
          ]),
          missingJson: JSON.stringify(["IP ownership clause", "Late payment penalty"]),
          redFlagsJson: JSON.stringify([
            { title: "Unlimited revisions", why: "Without a revision cap, the client can demand endless changes at no extra cost." },
            { title: "No IP ownership clause", why: "It is unclear who owns the final code/design until full payment is made." },
          ]),
          paymentTermsJson: JSON.stringify({ amount: 180000, schedule: "50% upfront / 50% on delivery", lateFee: null }),
        },
      },
      payments: {
        create: [
          { userId: user.id, label: "Upfront 50%", amount: 90000, currency: "PKR", status: "paid", dueDate: new Date(now - 18 * day), paidDate: new Date(now - 18 * day) },
          { userId: user.id, label: "On delivery 50%", amount: 90000, currency: "PKR", status: "pending", dueDate: new Date(now + 10 * day) },
        ],
      },
    },
  });

  await prisma.reminder.createMany({
    data: [
      { userId: user.id, contractId: c1.id, label: "Contract expires in 7 days", type: "expiry", remindAt: new Date(now + 3 * day) },
      { userId: user.id, contractId: c1.id, label: "Final payment due", type: "payment", remindAt: new Date(now + 7 * day) },
    ],
  });

  // Signed contract (completed deal)
  await prisma.contract.create({
    data: {
      userId: user.id,
      title: "Logo & Brand Kit — Cafe Mocha",
      clientName: "Cafe Mocha",
      clientEmail: "hello@cafemocha.com",
      value: 600,
      currency: "USD",
      startDate: new Date(now - 60 * day),
      endDate: new Date(now - 20 * day),
      status: "signed",
      source: "template",
      workType: "UI/UX Design",
      paymentSchedule: "full_upfront",
      payments: { create: [{ userId: user.id, label: "Full payment", amount: 600, currency: "USD", status: "paid", paidDate: new Date(now - 58 * day) }] },
    },
  });

  // Overdue payment contract
  await prisma.contract.create({
    data: {
      userId: user.id,
      title: "Content Articles — GreenLeaf Blog",
      clientName: "GreenLeaf",
      clientEmail: "editor@greenleaf.io",
      value: 250,
      currency: "USD",
      startDate: new Date(now - 40 * day),
      endDate: new Date(now - 5 * day),
      status: "active",
      source: "upload",
      workType: "Content Writing",
      payments: { create: [{ userId: user.id, label: "Articles batch 1", amount: 250, currency: "USD", status: "overdue", dueDate: new Date(now - 8 * day) }] },
    },
  });

  // Draft awaiting signature
  await prisma.contract.create({
    data: {
      userId: user.id,
      title: "Mobile App UI — Foodly",
      clientName: "Foodly Inc",
      clientEmail: "raza@foodly.app",
      value: 1200,
      currency: "USD",
      startDate: new Date(now + 2 * day),
      endDate: new Date(now + 45 * day),
      status: "awaiting_signature",
      source: "template",
      workType: "UI/UX Design",
      paymentSchedule: "milestone",
    },
  });

  await seedConfig();
  console.log(`✅ Seeded demo admin ${email} (password: password123) with 4 contracts, plans, templates & an announcement.`);
}

/** Seeds admin-managed configuration: plans, the template library, and an announcement. */
async function seedConfig() {
  const { PLANS } = await import("../src/lib/constants");
  const { TEMPLATES, templateFormat } = await import("../src/modules/contracts/templates/registry");

  // Plans (gating reads these at runtime).
  let order = 0;
  for (const p of Object.values(PLANS)) {
    const data = {
      name: p.name,
      price: p.price,
      contractLimit: p.contractLimit === Infinity ? -1 : p.contractLimit,
      aiScan: p.aiScan,
      teamSeats: p.teamSeats,
      whiteLabel: p.whiteLabel,
      blurb: p.blurb,
      order: order++,
      active: true,
    };
    await prisma.plan.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
  }

  // Templates (the library users browse & fill).
  let torder = 0;
  for (const t of TEMPLATES) {
    const data = {
      name: t.name,
      category: t.category,
      icon: t.icon,
      tagline: t.tagline,
      popular: t.popular ?? false,
      workType: t.workType,
      paymentSchedule: t.paymentSchedule,
      format: templateFormat(t.id),
      scopeLabel: t.scopeLabel ?? null,
      scopeDefault: t.scopeDefault,
      fieldsJson: JSON.stringify(t.fields),
      extraClausesJson: JSON.stringify(t.extraClauses ?? []),
      omitPayment: t.omitPayment ?? false,
      omitRevisions: t.omitRevisions ?? false,
      fillMinutes: t.fillMinutes ?? 2,
      order: torder++,
      active: true,
    };
    await prisma.template.upsert({ where: { id: t.id }, create: { id: t.id, ...data }, update: data });
  }

  // Welcome announcement.
  await prisma.announcement.deleteMany({ where: { title: "Welcome to Contractly" } });
  await prisma.announcement.create({
    data: {
      title: "Welcome to Contractly",
      body: "Browse 55 ready-made contract templates, sign with a no-login link, and track your earnings — all in one place.",
      type: "info",
      active: true,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
