import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & FieldProps
>(({ label, hint, error, required, className, id, ...props }, ref) => {
  const fieldId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className="label-base">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input ref={ref} id={fieldId} className={cn("input-base", error && "border-error", className)} {...props} />
      {error ? (
        <p className="mt-1 text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-secondary">{hint}</p>
      ) : null}
    </div>
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(({ label, hint, error, required, className, id, ...props }, ref) => {
  const fieldId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className="label-base">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <textarea ref={ref} id={fieldId} className={cn("input-base min-h-[96px]", error && "border-error", className)} {...props} />
      {error ? (
        <p className="mt-1 text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-secondary">{hint}</p>
      ) : null}
    </div>
  );
});
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & FieldProps
>(({ label, hint, error, required, className, id, children, ...props }, ref) => {
  const fieldId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className="label-base">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <select ref={ref} id={fieldId} className={cn("input-base appearance-none", error && "border-error", className)} {...props}>
        {children}
      </select>
      {error ? (
        <p className="mt-1 text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-secondary">{hint}</p>
      ) : null}
    </div>
  );
});
Select.displayName = "Select";
