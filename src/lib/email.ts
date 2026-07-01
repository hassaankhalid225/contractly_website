import "server-only";
import { features, env } from "./env";

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
};

/**
 * Email adapter. Sends via Resend when configured; otherwise logs the message
 * to the server console so flows (signature requests, signed copies, win-back)
 * are observable in development without an email provider.
 */
export async function sendEmail(msg: EmailMessage): Promise<{ ok: boolean; id?: string }> {
  if (!features.email) {
    console.log(
      `\n📧 [email:dev] → ${msg.to}\n   subject: ${msg.subject}\n   ${
        msg.attachments?.length ? `attachments: ${msg.attachments.map((a) => a.filename).join(", ")}\n   ` : ""
      }(set RESEND_API_KEY to send real email)\n`,
    );
    return { ok: true, id: "dev-logged" };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(env.RESEND_API_KEY);
  const res = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: msg.to,
    subject: msg.subject,
    html: msg.html,
    attachments: msg.attachments?.map((a) => ({ filename: a.filename, content: a.content })),
  });
  return { ok: !res.error, id: res.data?.id };
}
