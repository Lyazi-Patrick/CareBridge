import { Sparkles } from "lucide-react";

/**
 * AIInsightPanel — the canonical wrapper for anything Gemini-generated
 * (case summaries, form-assist suggestions). Per DESIGN.md, AI Indigo is
 * reserved exclusively for AI content so it's always visually distinct
 * from human-entered data — 2px indigo left border + faint gradient wash.
 *
 * Renders its own loading / error states so callers just pass status.
 */
export default function AIInsightPanel({
  title = "AI Summary",
  status = "idle", // "idle" | "loading" | "error" | "ready"
  errorMessage = "Couldn't generate an AI summary right now.",
  children,
  className = "",
}) {
  return (
    <div
      className={`ai-indigo-border rounded-xl p-lg space-y-sm ${className}`}
      aria-live="polite"
    >
      <div className="flex items-center gap-xs text-ai-indigo">
        <Sparkles size={16} strokeWidth={2.25} aria-hidden="true" />
        <span className="text-label-md uppercase tracking-wide font-bold">{title}</span>
      </div>

      {status === "loading" && (
        <div className="space-y-xs animate-pulse" role="status" aria-label="Generating summary">
          <div className="h-3 bg-surface-container-highest rounded-full w-11/12" />
          <div className="h-3 bg-surface-container-highest rounded-full w-4/5" />
          <div className="h-3 bg-surface-container-highest rounded-full w-2/3" />
        </div>
      )}

      {status === "error" && (
        <p className="text-body-sm text-on-error-container">{errorMessage}</p>
      )}

      {status === "ready" && <div className="text-body-sm text-on-surface-variant">{children}</div>}

      {status === "idle" && children}
    </div>
  );
}
