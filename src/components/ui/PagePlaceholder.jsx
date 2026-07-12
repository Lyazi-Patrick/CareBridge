/**
 * Temporary placeholder shown for pages not yet built in the current
 * phase. Every usage is replaced with real content in its scheduled
 * phase (see CHANGELOG.md) — this only exists so routing/layouts are
 * fully testable from Phase 1 onward.
 */
export default function PagePlaceholder({ title, phase }) {
  return (
    <div className="max-w-2xl mx-auto px-md py-xxl text-center space-y-sm">
      <h1 className="font-headline-lg text-headline-lg text-primary">{title}</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">
        Coming in {phase}.
      </p>
    </div>
  );
}
