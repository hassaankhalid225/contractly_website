import "server-only";

/**
 * Best-effort plain-text extraction from an uploaded contract, used to feed the
 * AI analyzer and the fallback heuristic.
 *
 * - text/plain & DOCX: extracted inline (DOCX is a ZIP of XML; we strip tags).
 * - PDF & images: text extraction requires OCR/parsing libraries not bundled
 *   here. When the real Claude API is enabled, production should send the file
 *   as a document block instead (see README → AI scanner). For now we return an
 *   empty string and callers fall back to metadata-derived text.
 */
export async function extractText(buffer: Buffer, mime: string): Promise<string> {
  if (mime.startsWith("text/")) {
    return buffer.toString("utf8");
  }
  if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return extractDocx(buffer);
  }
  return "";
}

/** DOCX = ZIP archive; word/document.xml holds the body. We inflate and strip. */
async function extractDocx(buffer: Buffer): Promise<string> {
  try {
    const { unzipSync, strFromU8 } = await import("fflate");
    const files = unzipSync(new Uint8Array(buffer));
    const doc = files["word/document.xml"];
    if (!doc) return "";
    const xml = strFromU8(doc);
    return xml
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch {
    return "";
  }
}

/** Synthesizes analyzable text from contract metadata when extraction yields nothing. */
export function metadataText(meta: {
  title: string;
  clientName: string;
  value?: number | null;
  currency?: string;
}): string {
  return `Contract titled "${meta.title}" with client ${meta.clientName}.${
    meta.value ? ` Contract value: ${meta.value} ${meta.currency ?? ""}.` : ""
  } No further text could be extracted from the uploaded file.`;
}
