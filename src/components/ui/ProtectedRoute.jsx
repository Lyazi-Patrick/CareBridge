import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import RouteLoading from "./RouteLoading.jsx";

/**
 * ProtectedRoute — redirects to /login if not authenticated, or to the
 * user's own dashboard if they're logged in as the wrong role (e.g. a
 * donor hitting /hospital). `role` is the DB role string (HOSPITAL,
 * PATIENT, DONOR).
 */
export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteLoading />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    const home = { HOSPITAL: "/hospital", PATIENT: "/patient", DONOR: "/donor" }[user.role] || "/";
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
