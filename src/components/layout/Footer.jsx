import { Link } from "react-router-dom";
import { Globe, Mail, Share2, ShieldCheck } from "lucide-react";

const COLUMNS = [
  {
    heading: "Mission",
    links: [
      { label: "Impact Report", to: "/#impact" },
      { label: "Philosophy", to: "/#about" },
      { label: "Ethics", to: "/#about" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Donor FAQ", to: "/#faq" },
      { label: "Hospitals", to: "/#partners" },
      { label: "Verification", to: "/#partners" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant w-full mt-xxl">
      <div className="max-w-7xl mx-auto px-md md:px-margin-desktop py-xl flex flex-col md:flex-row justify-between gap-xl">
        <div className="flex flex-col gap-md max-w-xs">
          <span className="text-headline-lg font-bold text-primary">CareBridge</span>
          <p className="text-body-sm text-on-surface-variant">
            Bridging the gap in medical funding with AI-enhanced verification and clinical
            transparency.
          </p>
          <div className="flex gap-md">
            <Globe size={20} className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" aria-label="Website" />
            <Mail size={20} className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" aria-label="Email" />
            <Share2 size={20} className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" aria-label="Share" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-xl w-full md:w-auto">
          {COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-sm">
              <span className="text-label-md font-bold text-on-surface uppercase mb-xs">
                {col.heading}
              </span>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-label-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 hover:underline decoration-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-md md:px-margin-desktop py-lg flex flex-col md:flex-row justify-between items-center gap-md text-center md:text-left">
          <span className="text-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} CareBridge Medical Network. Clinical Precision with Human
            Warmth.
          </span>
          <div className="flex items-center gap-xs">
            <ShieldCheck size={20} className="text-secondary" aria-hidden="true" />
            <span className="text-label-sm text-on-surface-variant">
              HIPAA Compliant Platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}