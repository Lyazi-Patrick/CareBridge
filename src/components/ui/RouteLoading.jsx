/**
 * RouteLoading — shown briefly while a lazy-loaded page chunk downloads.
 * Kept intentionally minimal (no layout shift, matches surface bg).
 */
export default function RouteLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
