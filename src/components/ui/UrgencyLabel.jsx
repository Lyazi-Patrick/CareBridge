import { AlertTriangle } from "lucide-react";

/**
 * UrgencyLabel — "soft-alert" style per DESIGN.md: pale red background,
 * bold red text. Used for critical alerts / "Needs Attention" flags.
 */
export default function UrgencyLabel({ label = "Urgent", showIcon = true, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-xs bg-error-container text-on-error-container px-sm py-xs rounded-full text-label-sm font-bold ${className}`}
    >
      {showIcon && <AlertTriangle size={13} strokeWidth={2.5} aria-hidden="true" />}
      {label}
    </span>
  );
}
