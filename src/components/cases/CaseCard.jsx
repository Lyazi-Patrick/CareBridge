import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUp, BadgeCheck, Minus, Siren, Sparkles } from "lucide-react";
import ProgressBar from "../ui/ProgressBar.jsx";
import Button from "../ui/Button.jsx";

const URGENCY_BADGE = {
  critical: { label: "Critical", icon: Siren, className: "bg-error text-on-error" },
  high: { label: "High", icon: ArrowUp, className: "bg-surface-container-highest text-on-surface-variant" },
  medium: { label: "Medium", icon: Minus, className: "bg-surface-container-highest text-on-surface-variant" },
  low: { label: "Medium", icon: Minus, className: "bg-surface-container-highest text-on-surface-variant" },
};

/**
 * CaseCard — the core "unit" of the platform, used on Home's featured
 * cases grid and the full DiscoverCases grid. AI-matched cases get the
 * ai-indigo-border treatment per DESIGN.md.
 */
export default function CaseCard({ medicalCase }) {
  const badge = medicalCase.aiMatch
    ? { label: "AI Match", icon: Sparkles, className: "bg-secondary text-on-secondary" }
    : URGENCY_BADGE[medicalCase.urgency];
  const BadgeIcon = badge.icon;
  const pct = Math.round((medicalCase.raised / medicalCase.goal) * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col group border border-outline-variant/30 ${
        medicalCase.aiMatch ? "ai-indigo-border" : ""
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={medicalCase.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-md left-md">
          <span
            className={`font-label-md text-label-md px-md py-1 rounded-full flex items-center gap-xs shadow-md ${badge.className}`}
          >
            <BadgeIcon size={14} strokeWidth={2.5} aria-hidden="true" />
            {badge.label}
          </span>
        </div>
      </div>

      <div className="p-lg flex flex-col flex-grow">
        <div className="flex items-center gap-sm mb-md">
          <span className="font-label-md text-label-md text-primary bg-primary-container/20 px-sm py-1 rounded">
            #{medicalCase.id}
          </span>
          <div className="flex items-center gap-xs text-on-secondary-fixed-variant">
            <BadgeCheck size={16} aria-hidden="true" />
            <span className="font-label-sm text-label-sm">{medicalCase.hospital}</span>
          </div>
        </div>

        <h3 className="font-headline-md text-headline-md mb-sm text-on-surface group-hover:text-primary transition-colors">
          {medicalCase.shortTitle}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-lg">
          {medicalCase.summary}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-end mb-sm">
            <div>
              <span className="block font-label-sm text-label-sm text-on-surface-variant">Funding Goal</span>
              <span className="font-headline-md text-headline-md text-primary">
                ${medicalCase.goal.toLocaleString()}
              </span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">{pct}% funded</span>
          </div>
          <ProgressBar value={medicalCase.raised} max={medicalCase.goal} label="Funding progress" />

          <Button
            as={Link}
            to={`/cases/${medicalCase.id}`}
            variant={medicalCase.urgency === "critical" ? "danger" : "primary"}
            fullWidth
            className="mt-lg"
          >
            {medicalCase.urgency === "critical" ? "Emergency Donate" : "Support Case"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
