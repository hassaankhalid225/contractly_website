import type { EmailMessage } from "@/lib/email";

const shell = (inner: string) => `
<div style="font-family:Inter,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#1A1A2E">
  <div style="padding:20px 0">
    <span style="display:inline-block;background:#534AB7;color:#fff;border-radius:8px;padding:6px 10px;font-weight:700">Contractly</span>
  </div>
  ${inner}
  <p style="color:#999;font-size:12px;margin-top:32px">Sent via Contractly — your AI contract wallet.</p>
</div>`;

const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#534AB7;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">${label}</a>`;

export function signatureRequestEmail(o: {
  to: string;
  signerName: string;
  freelancerName: string;
  contractTitle: string;
  message?: string;
  signUrl: string;
}): EmailMessage {
  return {
    to: o.to,
    subject: `Action Required: ${o.contractTitle} awaiting your signature`,
    html: shell(`
      <h2 style="font-size:20px">Hi ${o.signerName},</h2>
      <p>${o.freelancerName} has sent you a contract to review and sign: <strong>${o.contractTitle}</strong>.</p>
      ${o.message ? `<p style="background:#F8F8FF;border-radius:8px;padding:12px">${o.message}</p>` : ""}
      <p>No account needed — review and sign right in your browser.</p>
      <p style="margin:24px 0">${button(o.signUrl, "Review & Sign Contract")}</p>
      <p style="color:#666;font-size:13px">This link expires in 30 days.</p>
    `),
  };
}

export function signedCopyEmail(o: {
  to: string;
  contractTitle: string;
  downloadUrl: string;
  pdf: Buffer;
}): EmailMessage {
  return {
    to: o.to,
    subject: `Signed: ${o.contractTitle}`,
    html: shell(`
      <h2 style="font-size:20px">Contract signed ✅</h2>
      <p><strong>${o.contractTitle}</strong> has been signed by all parties. Your signed copy is attached.</p>
      <p style="margin:24px 0">${button(o.downloadUrl, "Download signed PDF")}</p>
    `),
    attachments: [{ filename: `${o.contractTitle.replace(/[^\w]+/g, "-")}-signed.pdf`, content: o.pdf }],
  };
}
