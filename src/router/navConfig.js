import { BarChart3, Compass, Gift, HeartHandshake, LayoutDashboard, Share2, UserSearch } from "lucide-react";

/**
 * Nav configs kept separate from router/index.jsx so that file can stay
 * component-only (react-refresh/only-export-components requires this).
 * Each role's route tree and its sidebar entries are still defined
 * together conceptually — just split across these two files.
 */
export const HOSPITAL_NAV_ITEMS = [
  { label: "Dashboard", to: "/hospital", icon: LayoutDashboard, end: true },
  { label: "Patients", to: "/hospital/patients", icon: UserSearch },
  { label: "Donations", to: "/hospital/donations", icon: HeartHandshake },
  { label: "Network", to: "/hospital/network", icon: Share2 },
  { label: "Analytics", to: "/hospital/analytics", icon: BarChart3 },
];

export const DONOR_NAV_ITEMS = [
  { label: "Overview", to: "/donor", icon: LayoutDashboard, end: true },
  { label: "Discover", to: "/cases", icon: Compass },
  { label: "My Gifts", to: "/donor/gifts", icon: Gift },
  { label: "Impact", to: "/donor/impact", icon: BarChart3 },
];
