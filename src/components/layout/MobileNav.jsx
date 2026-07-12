import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";

/**
 * MobileNav — bottom tab bar shown below `lg` breakpoint on dashboard
 * layouts, mirrors the Sidebar's navItems. Optional centered FAB action
 * (e.g. "New Request") via `fabTo`.
 */
export default function MobileNav({ navItems, fabTo }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around items-center py-sm px-md z-50 premium-blur">
      {navItems.slice(0, 2).map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-on-surface-variant"}`
          }
        >
          <Icon size={22} aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase">{label}</span>
        </NavLink>
      ))}

      {fabTo && (
        <NavLink
          to={fabTo}
          className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center -mt-8 shadow-lg border-4 border-background"
          aria-label="New request"
        >
          <Plus size={22} aria-hidden="true" />
        </NavLink>
      )}

      {navItems.slice(2, 4).map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-on-surface-variant"}`
          }
        >
          <Icon size={22} aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
