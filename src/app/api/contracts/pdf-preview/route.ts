import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getTemplateById } from "@/modules/contracts/templates/service";
import { renderTemplate } from "@/modules/contracts/templates/render";
import { buildContractPdf } from "@/modules/signature/pdf";

const ACCENT: Record<string, string> = {
  classic: "#534AB7",
  modern: "#534AB7",
  minimal: "#534AB7",
  legal: "#1A1A2E",
};

/** Generates a live, unsigned PDF draft of a template with the user's field values. */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const form = await req.formData();
  const templateId = String(form.get("templateId") || "");
  const template = await getTemplateById(templateId);
  if (!template) return new Response("Unknown template", { status: 400 });

  const values: Record<string, string> = { freelancerName: user.name };
  for (const [k, v] of form.entries()) if (k !== "templateId") values[k] = String(v);
  values.currency = values.currency || user.defaultCurrency;
  values.paymentSchedule = values.paymentSchedule || template.paymentSchedule;
  values.scope = values.scope || template.scopeDefault;

  const { title, bodyHtml } = renderTemplate(template, values as never);
  const bodyNoTitle = bodyHtml.replace(/<h2[^>]*>[\s\S]*?<\/h2>\s*/, "");

  const pdf = await buildContractPdf({
    title,
    bodyText: htmlToText(bodyNoTitle),
    freelancerName: user.name,
    clientName: values.clientName || "Client",
    accentHex: ACCENT[template.format ?? "classic"],
  });

  return new Response(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${title.replace(/[^\w]+/g, "-")}-draft.pdf"`,
    },
  });
}

function htmlToText(html: string): string {
  return html
    .replace(/<\/(h[1-6]|p|li|div)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
