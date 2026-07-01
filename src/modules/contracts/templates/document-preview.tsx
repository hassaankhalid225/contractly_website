import type { CSSProperties } from "react";
import type { DocFormat } from "./registry";

/**
 * Renders the contract as a realistic PDF "paper" preview. Each document format
 * (classic / modern / legal / minimal) gets distinct chrome and typography so
 * different contract types genuinely look different. The paper is forced white
 * in both light and dark mode — it mirrors the final downloadable PDF.
 */
export function DocumentPreview({ html, title, format }: { html: string; title: string; format: DocFormat }) {
  // The render output starts with an <h2> title — we render the title ourselves
  // (styled per format), so strip it from the body.
  const body = html.replace(/<h2[^>]*>[\s\S]*?<\/h2>\s*/, "");
  const theme = THEMES[format];

  return (
    <div className="rounded-card bg-black/10 p-3 dark:bg-black/30 sm:p-5">
      <div
        className="mx-auto w-full max-w-[600px] overflow-hidden rounded-[4px] shadow-pop ring-1 ring-black/10"
        style={{ backgroundColor: "#ffffff", "--acc": theme.accent } as CSSProperties}
      >
        {/* Header chrome */}
        {theme.header === "bar" ? (
          <div className="flex items-center justify-between px-8 py-3" style={{ backgroundColor: theme.accent }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">Contractly</span>
            <span className="text-[9px] uppercase tracking-wider text-white/80">Agreement</span>
          </div>
        ) : null}

        <div className="px-8 py-8 sm:px-11 sm:py-10" style={{ color: "#2a2a3a" }}>
          {theme.header === "rule" && (
            <div className="mb-6 flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(83,74,183,0.35)" }}>
              <span className="text-[11px] font-bold tracking-[0.18em]" style={{ color: theme.accent }}>CONTRACTLY</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400">Contract preview</span>
            </div>
          )}
          {theme.header === "formal" && (
            <div className="mb-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Contractly</p>
              <div className="mx-auto mt-2 h-px w-16" style={{ backgroundColor: theme.accent }} />
            </div>
          )}
          {theme.header === "dot" && (
            <div className="mb-7 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: theme.accent }} />
              <span className="text-[11px] font-medium tracking-wide text-gray-500">Contractly</span>
            </div>
          )}

          {/* Title */}
          <h1 className={theme.title} style={{ color: format === "legal" ? "#1a1a2e" : theme.accent }}>{title}</h1>

          {/* Body */}
          <div
            className={`${theme.font} ${theme.bodyText} ${theme.h3} ${theme.p} text-[12px]
              [&_h3]:font-bold [&_strong]:font-semibold [&_strong]:text-[#1a1a2e]
              [&_li]:ml-4 [&_li]:mb-1 [&_li]:list-disc`}
            dangerouslySetInnerHTML={{ __html: body }}
          />

          {/* Footer */}
          <div className="mt-9 border-t pt-3 text-[8.5px] leading-snug text-gray-400" style={{ borderColor: "#eee" }}>
            Electronically signable via Contractly. E-signatures are legally valid under the ESIGN Act (USA),
            eIDAS (EU), and the Electronic Transactions Ordinance (Pakistan, 2002).
          </div>
        </div>
      </div>
    </div>
  );
}

type Theme = {
  accent: string;
  header: "rule" | "bar" | "formal" | "dot";
  font: string;
  title: string;
  bodyText: string;
  h3: string;
  p: string;
};

const THEMES: Record<DocFormat, Theme> = {
  classic: {
    accent: "#534AB7",
    header: "rule",
    font: "font-serif",
    title: "mb-5 text-center text-[17px] font-bold uppercase tracking-wide",
    bodyText: "leading-[1.7]",
    h3: "[&_h3]:mt-5 [&_h3]:mb-1 [&_h3]:text-[12.5px]",
    p: "[&_p]:mb-2.5 [&_p]:text-justify [&_p]:text-[#3a3a4a]",
  },
  modern: {
    accent: "#534AB7",
    header: "bar",
    font: "font-sans",
    title: "mb-5 mt-1 text-left text-[20px] font-extrabold leading-tight",
    bodyText: "leading-[1.7]",
    h3: "[&_h3]:mt-6 [&_h3]:mb-1.5 [&_h3]:text-[12.5px] [&_h3]:border-l-[3px] [&_h3]:border-[color:var(--acc)] [&_h3]:pl-2.5 [&_h3]:text-[color:var(--acc)]",
    p: "[&_p]:mb-2.5 [&_p]:text-left [&_p]:text-[#44445a]",
  },
  legal: {
    accent: "#1A1A2E",
    header: "formal",
    font: "font-serif",
    title: "mb-5 text-center text-[15px] font-bold uppercase tracking-[0.12em]",
    bodyText: "leading-[1.62]",
    h3: "[&_h3]:mt-5 [&_h3]:mb-1 [&_h3]:text-[11.5px] [&_h3]:uppercase [&_h3]:tracking-wide",
    p: "[&_p]:mb-2.5 [&_p]:text-justify [&_p]:text-[#33333f]",
  },
  minimal: {
    accent: "#534AB7",
    header: "dot",
    font: "font-sans",
    title: "mb-6 text-left text-[22px] font-semibold tracking-tight",
    bodyText: "leading-[1.75]",
    h3: "[&_h3]:mt-6 [&_h3]:mb-1 [&_h3]:text-[13px] [&_h3]:font-semibold [&_h3]:text-[#1a1a2e]",
    p: "[&_p]:mb-3 [&_p]:text-left [&_p]:text-[#55556a]",
  },
};
