import { Link } from "react-router-dom";
import { BadgeCheck, HeartHandshake, ShieldCheck } from "lucide-react";

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "HIPAA-compliant verification on every case" },
  { icon: BadgeCheck, text: "158 verified partner hospitals worldwide" },
  { icon: HeartHandshake, text: "$42M+ directed straight to patient care" },
];

/**
 * AuthShell — shared split-screen chrome for Login and Register. Keeps the
 * hero-mesh brand panel in one place so the two auth pages stay visually
 * identical apart from their form content.
 */
export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-[calc(100vh-80px)] grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-md md:px-xxl py-xxl">
        <div className="w-full max-w-md space-y-xl">
          <div className="space-y-sm">
            <span className="text-label-md text-primary uppercase tracking-wider">
              {eyebrow}
            </span>
            <h1 className="text-headline-lg text-on-surface">{title}</h1>
            <p className="text-body-md text-on-surface-variant">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex hero-mesh items-center justify-center p-xxl relative overflow-hidden">
        <div className="relative z-10 max-w-md space-y-xl">
          <Link to="/" className="text-headline-lg font-bold text-primary">
            CareBridge
          </Link>
          <h2 className="text-display-lg text-primary leading-tight">
            Clinical precision, human warmth.
          </h2>
          <div className="space-y-md">
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-md premium-card rounded-xl px-md py-sm">
                <Icon size={20} className="text-primary shrink-0" aria-hidden="true" />
                <span className="text-body-sm text-on-surface">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary-container rounded-full blur-3xl opacity-40 -z-0" />
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary-container rounded-full blur-3xl opacity-30 -z-0" />
      </div>
    </div>
  );
}
