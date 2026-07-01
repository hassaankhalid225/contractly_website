"use client";
import { useEffect } from "react";

/**
 * Fires a celebratory confetti burst once on mount (success moments). Respects
 * prefers-reduced-motion. Dynamically imports canvas-confetti so it never ships
 * on routes that don't celebrate.
 */
export function Confetti() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    (async () => {
      const confetti = (await import("canvas-confetti")).default;
      if (cancelled) return;
      const colors = ["#534AB7", "#8b73e0", "#0F6E56", "#F4B740"];
      const fire = (ratio: number, opts: object) =>
        confetti({ origin: { y: 0.7 }, colors, particleCount: Math.floor(180 * ratio), ...opts });
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    })();
    return () => { cancelled = true; };
  }, []);
  return null;
}
