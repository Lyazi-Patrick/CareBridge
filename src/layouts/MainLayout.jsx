import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

/**
 * MainLayout — public/marketing pages: landing, cases discovery, case
 * details, login, register. Sticky navbar + footer wrap the routed page.
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
