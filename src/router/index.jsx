/* eslint-disable react-refresh/only-export-components -- router config
   intentionally mixes lazy() component references with a non-component
   default export (the router object); this file isn't a Fast Refresh
   boundary and doesn't need to be. */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import PatientLayout from "../layouts/PatientLayout.jsx";
import RouteLoading from "../components/ui/RouteLoading.jsx";
import ProtectedRoute from "../components/ui/ProtectedRoute.jsx";
import { HOSPITAL_NAV_ITEMS, DONOR_NAV_ITEMS } from "./navConfig.js";

// Lazy-loaded so each route ships its own chunk instead of one large bundle.
const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const DiscoverCases = lazy(() => import("../pages/cases/DiscoverCases.jsx"));
const CaseDetails = lazy(() => import("../pages/cases/CaseDetails.jsx"));
const HospitalDashboard = lazy(() => import("../pages/hospital/HospitalDashboard.jsx"));
const CreateAssistanceRequest = lazy(() => import("../pages/hospital/CreateAssistanceRequest.jsx"));
const DonorDashboard = lazy(() => import("../pages/donor/DonorDashboard.jsx"));
const PatientDashboard = lazy(() => import("../pages/patient/PatientDashboard.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

function withSuspense(Component) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Component />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: withSuspense(Home) },
      { path: "/login", element: withSuspense(Login) },
      { path: "/register", element: withSuspense(Register) },
      { path: "/cases", element: withSuspense(DiscoverCases) },
      { path: "/cases/:caseId", element: withSuspense(CaseDetails) },
    ],
  },
  {
    element: <ProtectedRoute role="HOSPITAL" />,
    children: [
      {
        element: <DashboardLayout navItems={HOSPITAL_NAV_ITEMS} fabTo="/hospital/new-request" />,
        children: [
          { path: "/hospital", element: withSuspense(HospitalDashboard) },
          { path: "/hospital/new-request", element: withSuspense(CreateAssistanceRequest) },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute role="DONOR" />,
    children: [
      {
        element: <DashboardLayout navItems={DONOR_NAV_ITEMS} />,
        children: [{ path: "/donor", element: withSuspense(DonorDashboard) }],
      },
    ],
  },
  {
    element: <ProtectedRoute role="PATIENT" />,
    children: [
      {
        element: <PatientLayout />,
        children: [{ path: "/patient", element: withSuspense(PatientDashboard) }],
      },
    ],
  },
  { path: "*", element: withSuspense(NotFound) },
]);

export default router;
