import { NavLink, useNavigate } from "react-router-dom";
import { HelpCircle, LogOut, Settings, Stethoscope } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Sidebar — desktop nav for role-based dashboards (hospital/donor).
 * `navItems` and `identity` are passed in per role so this one component
 * serves HospitalDashboard, CreateAssistanceRequest, and DonorDashboard
 * instead of forking three near-identical sidebars.
 */
export default function Sidebar({ navItems, identity }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside className="hidden lg:flex flex-col h-screen sticky top-0 py-md bg-surface-container-low border-r border-outline-variant w-64 shrink-0">
      <div className="px-xl mb-xl">
        <NavLink to="/" className="font-headline-md text-headline-md font-black text-primary">
          CareBridge
        </NavLink>
      </div>

      {identity && (
        <div className="px-md mb-lg">
          <div className="flex items-center gap-sm p-sm bg-surface-container rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed-dim flex items-center justify-center shrink-0">
              <Stethoscope size={18} className="text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface truncate">{identity.name}</p>
              <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                {identity.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-md rounded-lg mx-2 px-4 py-3 transition-all duration-200 hover:translate-x-1 ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-variant"
              }`
            }
          >
            <Icon size={20} aria-hidden="true" />
            <span className="font-label-md text-label-md">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-1">
        <a
          href="#settings"
          className="flex items-center gap-md text-on-surface-variant hover:bg-surface-variant rounded-lg mx-2 px-4 py-3"
        >
          <Settings size={20} aria-hidden="true" />
          <span className="font-label-md text-label-md">Settings</span>
        </a>
        <a
          href="#support"
          className="flex items-center gap-md text-on-surface-variant hover:bg-surface-variant rounded-lg mx-2 px-4 py-3"
        >
          <HelpCircle size={20} aria-hidden="true" />
          <span className="font-label-md text-label-md">Support</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-md text-error hover:bg-error-container/30 rounded-lg mx-2 px-4 py-3 transition-colors"
        >
          <LogOut size={20} aria-hidden="true" />
          <span className="font-label-md text-label-md">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
