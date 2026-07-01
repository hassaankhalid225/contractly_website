"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const num = (v: FormDataEntryValue | null, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";

// ── Users ────────────────────────────────────────────────────────────────────
export async function setUserPlanAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId"));
  const plan = String(formData.get("plan"));
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { plan } }),
    prisma.subscription.upsert({
      where: { userId },
      create: { userId, plan, status: plan === "free" ? "canceled" : "active" },
      update: { plan, status: plan === "free" ? "canceled" : "active" },
    }),
  ]);
  revalidatePath("/admin/users");
}

export async function setUserRoleAction(userId: string, role: "user" | "admin") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function toggleSuspendAction(userId: string) {
  await requireAdmin();
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { suspended: true } });
  await prisma.user.update({ where: { id: userId }, data: { suspended: !u?.suspended } });
  revalidatePath("/admin/users");
}

export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin();
  if (admin.id === userId) return; // never delete yourself
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

// ── Plans ────────────────────────────────────────────────────────────────────
export async function savePlanAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (!id) redirect("/admin/plans?error=id");
  const data = {
    name: String(formData.get("name") || id),
    price: num(formData.get("price")),
    contractLimit: num(formData.get("contractLimit"), 3),
    aiScan: bool(formData, "aiScan"),
    teamSeats: num(formData.get("teamSeats")),
    whiteLabel: bool(formData, "whiteLabel"),
    blurb: String(formData.get("blurb") || ""),
    order: num(formData.get("order")),
    active: bool(formData, "active"),
  };
  await prisma.plan.upsert({ where: { id }, create: { id, ...data }, update: data });
  revalidatePath("/admin/plans");
  revalidatePath("/upgrade");
  redirect("/admin/plans?saved=1");
}

export async function deletePlanAction(id: string) {
  await requireAdmin();
  if (id === "free") return; // keep the base plan
  await prisma.plan.delete({ where: { id } });
  revalidatePath("/admin/plans");
}

// ── Templates ────────────────────────────────────────────────────────────────
export async function saveTemplateAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (!id) redirect("/admin/templates/new?error=id");

  // Validate the JSON blobs for fields & clauses.
  let fieldsJson = String(formData.get("fieldsJson") || "[]");
  let extraClausesJson = String(formData.get("extraClausesJson") || "[]");
  try { JSON.parse(fieldsJson); } catch { redirect(`/admin/templates/${id}?error=fields`); }
  try { JSON.parse(extraClausesJson); } catch { redirect(`/admin/templates/${id}?error=clauses`); }

  const data = {
    name: String(formData.get("name") || id),
    category: String(formData.get("category") || "Business"),
    icon: String(formData.get("icon") || "file"),
    tagline: String(formData.get("tagline") || ""),
    popular: bool(formData, "popular"),
    workType: String(formData.get("workType") || "General Services"),
    paymentSchedule: String(formData.get("paymentSchedule") || "split_50_50"),
    format: String(formData.get("format") || "classic"),
    scopeLabel: String(formData.get("scopeLabel") || "") || null,
    scopeDefault: String(formData.get("scopeDefault") || ""),
    fieldsJson,
    extraClausesJson,
    omitPayment: bool(formData, "omitPayment"),
    omitRevisions: bool(formData, "omitRevisions"),
    fillMinutes: num(formData.get("fillMinutes"), 2),
    order: num(formData.get("order"), 99),
    active: bool(formData, "active"),
  };
  await prisma.template.upsert({ where: { id }, create: { id, ...data }, update: data });
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
  redirect("/admin/templates?saved=1");
}

export async function toggleTemplateAction(id: string) {
  await requireAdmin();
  const t = await prisma.template.findUnique({ where: { id }, select: { active: true } });
  await prisma.template.update({ where: { id }, data: { active: !t?.active } });
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
}

export async function deleteTemplateAction(id: string) {
  await requireAdmin();
  await prisma.template.delete({ where: { id } });
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
  redirect("/admin/templates");
}

// ── Announcements ────────────────────────────────────────────────────────────
export async function saveAnnouncementAction(formData: FormData) {
  await requireAdmin();
  await prisma.announcement.create({
    data: {
      title: String(formData.get("title") || "Announcement"),
      body: String(formData.get("body") || ""),
      type: String(formData.get("type") || "info"),
      active: true,
    },
  });
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function toggleAnnouncementAction(id: string) {
  await requireAdmin();
  const a = await prisma.announcement.findUnique({ where: { id }, select: { active: true } });
  await prisma.announcement.update({ where: { id }, data: { active: !a?.active } });
  revalidatePath("/admin/announcements");
}

export async function deleteAnnouncementAction(id: string) {
  await requireAdmin();
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/admin/announcements");
}
