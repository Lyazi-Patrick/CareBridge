/**
 * ProgressBar — 6px height, rounded caps, Secondary Green fill,
 * per DESIGN.md "Progress Bars". Used for funding-goal progress.
 */
export default function ProgressBar({ value, max = 100, label, thickness = 6, className = "" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      <div
        className="w-full bg-surface-container rounded-full overflow-hidden"
        style={{ height: thickness }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className="bg-secondary h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
