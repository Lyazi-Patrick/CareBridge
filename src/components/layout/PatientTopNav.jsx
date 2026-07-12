import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const LINKS = [
  { label: "Network", to: "/cases" },
  { label: "Impact", to: "/#impact" },
  { label: "Partners", to: "/#partners" },
  { label: "About", to: "/#about" },
];

/**
 * PatientTopNav — logged-in top nav for the patient experience dashboard.
 * Distinct from the public Navbar: shorter (h-16 vs h-20), no active-route
 * underline, and shows the patient's avatar instead of a "Login" CTA.
 */
export default function PatientTopNav({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-surface sticky top-0 z-50 border-b border-outline-variant shadow-sm w-full">
      <div className="flex justify-between items-center w-full px-md md:px-margin-desktop py-base max-w-7xl mx-auto h-16">
        <div className="flex items-center gap-xl">
          <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary">
            CareBridge
          </Link>
          <div className="hidden md:flex gap-lg">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button
            onClick={handleLogout}
            className="text-on-surface-variant hover:text-error transition-colors"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={20} />
          </button>
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed bg-surface-container flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-label-sm font-bold text-primary">
                {user?.name?.[0] ?? "P"}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
