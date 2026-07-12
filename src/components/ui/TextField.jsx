import { forwardRef } from "react";

const TextField = forwardRef(function TextField(
  { label, id, icon: Icon, rightElement, error, className = "", ...inputProps },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-label-md text-on-surface-variant uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full h-12 bg-white border rounded-lg text-base text-on-surface placeholder:text-outline/70 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none ${
            Icon ? "pl-11" : "pl-4"
          } ${rightElement ? "pr-11" : "pr-4"} ${
            error ? "border-error" : "border-outline-variant"
          } ${className}`}
          {...inputProps}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-label-sm text-error">{error}</p>}
    </div>
  );
});

export default TextField;