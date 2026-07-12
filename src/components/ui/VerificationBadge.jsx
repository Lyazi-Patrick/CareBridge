import { BadgeCheck } from "lucide-react";

/**
 * VerificationBadge — small pill with a checkmark in Secondary Green,
 * for verified hospitals / clinicians / medical records.
 * DESIGN.md: "Verification Badges".
 */
export default function VerificationBadge({ label = "Verified", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-xs bg-secondary text-on-secondary px-sm py-xs rounded-full shadow-sm text-label-sm font-bold ${className}`}
    >
      <BadgeCheck size={14} strokeWidth={2.5} aria-hidden="true" />
      {label}
    </span>
  );
}
