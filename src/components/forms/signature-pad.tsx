"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Method = "draw" | "type";

/**
 * Signature capture with Draw (canvas) and Type tabs. Emits a PNG data URL via
 * the provided hidden field names so it can post inside any server-action form.
 */
export function SignaturePad({
  imageFieldName,
  methodFieldName,
  typedDefault = "",
}: {
  imageFieldName: string;
  methodFieldName: string;
  typedDefault?: string;
}) {
  const [method, setMethod] = useState<Method>("type");
  const [typed, setTyped] = useState(typedDefault);
  const [dataUrl, setDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  // Render typed signature to a canvas so both methods produce a PNG.
  useEffect(() => {
    if (method !== "type") return;
    const c = document.createElement("canvas");
    c.width = 400; c.height = 100;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#1A1A2E";
    ctx.font = "italic 40px Georgia, serif";
    ctx.textBaseline = "middle";
    ctx.fillText(typed || "", 12, 55);
    setDataUrl(typed ? c.toDataURL("image/png") : "");
  }, [typed, method]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.strokeStyle = "#1A1A2E";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = () => {
    drawing.current = false;
    setDataUrl(canvasRef.current!.toDataURL("image/png"));
  };
  const clear = () => {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setDataUrl("");
  };

  return (
    <div>
      <input type="hidden" name={imageFieldName} value={dataUrl} />
      <input type="hidden" name={methodFieldName} value={method} />

      <div className="mb-2 inline-flex rounded-card border border-black/10 p-0.5 text-sm">
        {(["type", "draw"] as Method[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMethod(m); setDataUrl(m === "type" ? dataUrl : ""); }}
            className={cn("rounded-[6px] px-3 py-1 capitalize", method === m ? "bg-primary text-white" : "text-ink-secondary")}
          >
            {m}
          </button>
        ))}
      </div>

      {method === "type" ? (
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Type your full name"
          className="input-base font-serif text-2xl italic"
        />
      ) : (
        <div>
          <canvas
            ref={canvasRef}
            width={400}
            height={120}
            className="sig-canvas w-full rounded-card border border-black/15 bg-white"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
          <button type="button" onClick={clear} className="mt-1 text-xs text-ink-secondary hover:text-ink">Clear</button>
        </div>
      )}
    </div>
  );
}
