import { Outlet } from "react-router-dom";
import PatientTopNav from "../components/layout/PatientTopNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * PatientLayout — top-nav only (no sidebar), per the patient_experience_dashboard
 * mockup. Distinct from DashboardLayout because patients get a lighter,
 * less clinical-feeling frame than hospital/donor admin views.
 */
export default function PatientLayout() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <PatientTopNav user={user ? { name: user.name, avatarUrl: user.avatar_url } : null} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
