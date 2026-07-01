"use client";
import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CURRENCIES, MAX_UPLOAD_BYTES } from "@/lib/constants";
import { uploadContractAction } from "./actions";
import { cn } from "@/lib/utils";

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.heic,.docx";

export function UploadForm({ defaultCurrency, canScan }: { defaultCurrency: string; canScan: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (f: File | null) => {
    setError(null);
    if (f && f.size > MAX_UPLOAD_BYTES) {
      setError("File too large. Max 10MB. Try compressing your PDF.");
      return;
    }
    setFile(f);
  };

  return (
    <form action={uploadContractAction} className="space-y-4">
      <DropZone
        file={file}
        error={error}
        onPick={pick}
        onOpen={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        name="file"
        accept={ACCEPT}
        required
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="title" label="Contract title" required placeholder="Website Redesign" />
        <Input name="clientName" label="Client name" required placeholder="Acme Inc" />
        <Input name="clientEmail" type="email" label="Client email (optional)" placeholder="client@email.com" />
        <Input name="value" type="number" step="0.01" label="Contract value (optional)" placeholder="0.00" />
        <Select name="currency" label="Currency" defaultValue={defaultCurrency}>
          {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Input name="startDate" type="date" label="Start date" />
          <Input name="endDate" type="date" label="End date" />
        </div>
      </div>

      <Pending canScan={canScan} hasFile={!!file} />
    </form>
  );
}

function DropZone({
  file, error, onPick, onOpen,
}: { file: File | null; error: string | null; onPick: (f: File | null) => void; onOpen: () => void }) {
  const [drag, setDrag] = useState(false);
  return (
    <div>
      <div
        onClick={onOpen}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); onPick(e.dataTransfer.files?.[0] ?? null); }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed p-8 text-center transition",
          drag ? "border-primary bg-primary-50" : "border-black/15 hover:border-primary/50",
        )}
      >
        <div className="text-3xl">{file ? "✅" : "📎"}</div>
        <p className="mt-2 text-sm font-medium text-ink">{file ? file.name : "Drop a file or click to browse"}</p>
        <p className="text-xs text-ink-secondary">PDF, JPG, PNG, HEIC or DOCX · max 10MB</p>
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

function Pending({ canScan, hasFile }: { canScan: boolean; hasFile: boolean }) {
  const { pending } = useFormStatus();
  if (pending) {
    return (
      <div className="rounded-card bg-primary-50 p-4 text-center">
        <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-primary">
          {canScan ? "Analyzing your contract…" : "Saving your contract…"}
        </p>
        <p className="text-xs text-ink-secondary">Reading document · Identifying clauses · Generating summary</p>
      </div>
    );
  }
  return (
    <Button type="submit" size="lg" className="w-full" disabled={!hasFile}>
      {canScan ? "Analyze & Save Contract" : "Save Contract"}
    </Button>
  );
}
