import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import MobileNav from "../components/layout/MobileNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const IDENTITY_SUBTITLE = { HOSPITAL: "Verified Provider", DONOR: "Donor", PATIENT: "Patient" };

/**
 * DashboardLayout — sidebar-driven layout for role-based dashboards
 * (hospital admin, create-assistance-request, donor dashboard).
 * `navItems`/`fabTo` are per-role config (see router/navConfig.js); the
 * identity card in the sidebar comes from the authenticated user.
 */
export default function DashboardLayout({ navItems, fabTo }) {
  const { user } = useAuth();
  const identity = user
    ? { name: user.name, subtitle: IDENTITY_SUBTITLE[user.role] ?? "" }
    : null;

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar navItems={navItems} identity={identity} />
      <div className="flex-1 min-w-0 pb-20 lg:pb-0">
        <Outlet />
      </div>
      <MobileNav navItems={navItems} fabTo={fabTo} />
    </div>
  );
}
