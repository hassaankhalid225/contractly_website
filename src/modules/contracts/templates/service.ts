import "server-only";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import type { Template } from "@prisma/client";
import type { ContractTemplate, TemplateField, TemplateCategory, DocFormat } from "./types";

/** Converts a stored Template row into the rich, render-ready ContractTemplate. */
export function toTemplate(row: Template): ContractTemplate {
  return {
    id: row.id,
    name: row.name,
    category: row.category as TemplateCategory,
    icon: row.icon,
    tagline: row.tagline,
    popular: row.popular,
    format: row.format as DocFormat,
    workType: row.workType,
    paymentSchedule: row.paymentSchedule,
    scopeLabel: row.scopeLabel ?? undefined,
    scopeDefault: row.scopeDefault,
    fields: parseJson<TemplateField[]>(row.fieldsJson, []),
    extraClauses: parseJson(row.extraClausesJson, []),
    omitPayment: row.omitPayment,
    omitRevisions: row.omitRevisions,
    fillMinutes: row.fillMinutes,
  };
}

/** Active templates for the public gallery / fill flow. */
export async function listTemplates(activeOnly = true): Promise<ContractTemplate[]> {
  const rows = await prisma.template.findMany({
    where: activeOnly ? { active: true } : {},
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return rows.map(toTemplate);
}

export async function getTemplateById(id: string): Promise<ContractTemplate | null> {
  const row = await prisma.template.findUnique({ where: { id } });
  return row ? toTemplate(row) : null;
}

// Raw rows for the admin panel (includes inactive).
export function listTemplateRows() {
  return prisma.template.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
}
export function getTemplateRow(id: string) {
  return prisma.template.findUnique({ where: { id } });
}
