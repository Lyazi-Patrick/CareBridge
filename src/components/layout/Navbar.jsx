import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV_LINKS = [
  { label: "Network", to: "/cases" },
  { label: "Impact", to: "/#impact" },
  { label: "Partners", to: "/#partners" },
  { label: "About", to: "/#about" },
];

const ROLE_ROUTE = { DONOR: "/donor", PATIENT: "/patient", HOSPITAL: "/hospital" };

/**
 * Public-site navbar (landing page + marketing routes).
 * Dashboard-style pages use DashboardLayout's Sidebar/MobileNav instead —
 * see components/layout/Sidebar.jsx.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-md md:px-margin-desktop py-base max-w-7xl mx-auto h-20">
        <div className="flex items-center gap-xl">
          <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary">
            CareBridge
          </Link>
          <nav className="hidden md:flex gap-lg items-center">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `pb-1 font-label-md text-label-md transition-colors ${
                    isActive
                      ? "text-primary border-b-2 border-primary font-bold"
                      : "text-on-surface-variant hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-md">
          {user ? (
            <>
              <button
                onClick={() => navigate(ROLE_ROUTE[user.role] || "/")}
                className="hidden sm:block text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors"
              >
                My Dashboard
              </button>
              <Button size="md" variant="ghost" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors"
              >
                Login
              </button>
              <Button size="md" onClick={() => navigate("/register")}>
                Get Started
              </Button>
            </>
          )}
          <button
            className="md:hidden text-on-surface"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-outline-variant bg-surface px-md py-md flex flex-col gap-md">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="text-on-surface-variant font-label-md text-label-md hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
