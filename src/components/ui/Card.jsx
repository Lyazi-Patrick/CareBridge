/**
 * Card — Level 1 elevation surface (see DESIGN.md "Elevation & Depth").
 * variant "premium" adds the hover-lift used for case/stat cards;
 * variant "flat" is for nested panels that shouldn't lift on hover.
 */
export default function Card({
  as: Tag = "div",
  variant = "premium",
  className = "",
  children,
  ...props
}) {
  const base =
    variant === "premium"
      ? "premium-card rounded-lg"
      : "bg-white border border-surface-container rounded-lg";

  return (
    <Tag className={`${base} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
