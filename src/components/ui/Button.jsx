import { forwardRef } from "react";

const VARIANTS = {
  primary:
    "bg-primary text-on-primary shadow-sm hover:opacity-90 disabled:opacity-50",
  container:
    "bg-primary-container text-on-primary-container font-bold hover:bg-primary hover:text-on-primary",
  ghost:
    "border border-outline text-on-surface hover:bg-surface-container disabled:opacity-50",
  secondary:
    "bg-secondary text-on-secondary shadow-sm hover:opacity-90 disabled:opacity-50",
  danger:
    "bg-error text-on-error shadow-sm hover:opacity-90 disabled:opacity-50",
  link: "text-primary font-bold hover:underline p-0",
};

const SIZES = {
  sm: "px-md py-xs text-label-sm rounded",
  md: "px-lg py-sm text-label-md rounded-lg font-bold",
  lg: "px-xxl py-md text-headline-md rounded-xl",
};

/**
 * Shared Button — every clickable action in the app should use this
 * rather than a raw <button>, so states (hover/active/disabled/focus)
 * stay consistent with DESIGN.md.
 */
const Button = forwardRef(function Button(
  {
    as: Tag = "button",
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    fullWidth = false,
    className = "",
    children,
    ...props
  },
  ref
) {
  const classes = [
    "inline-flex items-center justify-center gap-xs",
    "transition-all active:scale-95",
    "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
    variant !== "link" ? SIZES[size] : "text-label-md",
    VARIANTS[variant],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={classes} {...props}>
      {Icon && iconPosition === "left" && <Icon size={18} strokeWidth={2.25} aria-hidden="true" />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={18} strokeWidth={2.25} aria-hidden="true" />}
    </Tag>
  );
});

export default Button;
