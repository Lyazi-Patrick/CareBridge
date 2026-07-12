import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, BadgeCheck, Bell, Check, Hospital, Info, Share2, Siren } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";
import AIInsightPanel from "../../components/ai/AIInsightPanel.jsx";
import DonateModal from "../../components/cases/DonateModal.jsx";
import { getCase, getCaseAISummary } from "../../services/casesService.js";

const UPDATE_ICON = { check: Check, info: Info, warning: AlertCircle };

const TIMELINE_STYLES = {
  complete: { dot: "bg-secondary ring-secondary-container", card: "bg-white border-outline-variant" },
  current: { dot: "bg-primary ring-primary-container", card: "bg-white border-primary shadow-sm" },
  upcoming: { dot: "bg-surface-variant ring-surface-container", card: "bg-surface-container-low border-outline-variant opacity-60" },
};

export default function CaseDetails() {
  const { caseId } = useParams();
  const [caseResult, setCaseResult] = useState({ caseId: null, status: "loading", data: null });
  const [showDonate, setShowDonate] = useState(false);

  const [aiResult, setAiResult] = useState({ caseId: null, status: "loading", text: null });

  useEffect(() => {
    let cancelled = false;
    getCase(caseId)
      .then((data) => {
        if (!cancelled) setCaseResult({ caseId, status: "ready", data });
      })
      .catch(() => {
        if (!cancelled) setCaseResult({ caseId, status: "error", data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  const caseLoading = caseResult.caseId !== caseId || caseResult.status === "loading";
  const caseError = caseResult.caseId === caseId && caseResult.status === "error";
  const medicalCase = caseResult.caseId === caseId ? caseResult.data : null;

  useEffect(() => {
    if (!medicalCase) return;
    let cancelled = false;
    getCaseAISummary(medicalCase.id)
      .then((summary) => {
        if (!cancelled) setAiResult({ caseId: medicalCase.id, status: "ready", text: summary });
      })
      .catch(() => {
        if (!cancelled) setAiResult({ caseId: medicalCase.id, status: "error", text: null });
      });
    return () => {
      cancelled = true;
    };
  }, [medicalCase]);

  const aiStatus = medicalCase && aiResult.caseId === medicalCase.id ? aiResult.status : "loading";
  const aiText = aiResult.text;

  if (caseLoading) {
    return (
      <div className="max-w-2xl mx-auto px-md py-xxl text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">Loading case...</p>
      </div>
    );
  }

  if (caseError || !medicalCase) {
    return (
      <div className="max-w-2xl mx-auto px-md py-xxl text-center space-y-md">
        <h1 className="font-headline-lg text-headline-lg text-primary">Case not found</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          This case may have been fully funded and archived, or the link is incorrect.
        </p>
        <Button as={Link} to="/cases">
          Browse Active Cases
        </Button>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((medicalCase.raised / medicalCase.goal) * 100));

  return (
    <main className="max-w-7xl mx-auto px-md md:px-margin-desktop py-xl">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-xl">
        <div className="lg:col-span-8 flex flex-col gap-md">
          <div className="relative rounded-xl overflow-hidden h-[400px] md:h-[500px] shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img src={medicalCase.heroImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 p-xl z-20 text-white">
              <span className="bg-primary px-sm py-xs rounded font-label-sm text-label-sm uppercase tracking-wider mb-sm inline-block">
                {medicalCase.category} Support
              </span>
              <h1 className="font-display-lg text-display-lg mb-xs">{medicalCase.title}</h1>
              <p className="font-body-lg text-body-lg opacity-90 max-w-2xl">{medicalCase.summary}</p>
            </div>
          </div>
        </div>

        {/* Sticky donate widget */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-md">
            <div className="bg-white p-xl rounded-xl premium-card flex flex-col gap-lg">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    FUNDRAISING GOAL
                  </span>
                  <div className="flex items-baseline gap-xs">
                    <span className="font-headline-lg text-headline-lg text-primary">
                      ${medicalCase.raised.toLocaleString()}
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      / ${medicalCase.goal.toLocaleString()}
                    </span>
                  </div>
                </div>
                {medicalCase.urgency === "critical" && (
                  <span className="bg-error-container text-on-error-container px-sm py-xs rounded-full font-label-sm text-label-sm font-bold flex items-center gap-xs">
                    <Siren size={14} aria-hidden="true" /> CRITICAL
                  </span>
                )}
              </div>

              <div className="space-y-xs">
                <ProgressBar value={medicalCase.raised} max={medicalCase.goal} label="Funding progress" />
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>{pct}% Complete</span>
                  <span>{medicalCase.donors} Donors</span>
                </div>
              </div>

              <div className="space-y-sm">
                <Button size="lg" fullWidth className="!rounded-xl" onClick={() => setShowDonate(true)}>
                  Donate Now
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  icon={Share2}
                  className="!rounded-xl bg-surface-container-low"
                >
                  Share Story
                </Button>
              </div>

              <div className="pt-md border-t border-outline-variant flex items-center gap-sm">
                <div className="bg-secondary-container p-xs rounded-full">
                  <BadgeCheck size={18} className="text-on-secondary-container" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">
                    Verified by {medicalCase.hospital}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Validated clinical record #CB-{medicalCase.id.slice(-6)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
                  <Hospital size={22} className="text-on-primary-container" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md">{medicalCase.hospital}</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Primary Care Network Partner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-8 space-y-xl">
          <AIInsightPanel title="AI Medical Insight" status={aiStatus} className="premium-card">
            {aiStatus === "ready" ? (
              <p>{aiText}</p>
            ) : (
              <>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                  We've simplified the medical complexity for you. {medicalCase.patientName} is
                  facing{" "}
                  <span className="font-bold text-on-surface">{medicalCase.condition}</span>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="bg-white/50 p-md rounded-lg border border-outline-variant/30">
                    <h4 className="font-label-md text-label-md text-primary mb-xs uppercase">
                      The Challenge
                    </h4>
                    <p className="font-body-sm text-body-sm">{medicalCase.aiSummary.challenge}</p>
                  </div>
                  <div className="bg-white/50 p-md rounded-lg border border-outline-variant/30">
                    <h4 className="font-label-md text-label-md text-primary mb-xs uppercase">
                      The Solution
                    </h4>
                    <p className="font-body-sm text-body-sm">{medicalCase.aiSummary.solution}</p>
                  </div>
                </div>
              </>
            )}
          </AIInsightPanel>

          <article className="space-y-md">
            <h2 className="font-headline-lg text-headline-lg border-b border-outline-variant pb-xs">
              The Story
            </h2>
            {medicalCase.story.map((paragraph, i) => (
              <p key={i} className="font-body-md text-body-md leading-relaxed">
                {paragraph}
              </p>
            ))}
          </article>

          <section className="space-y-md">
            <h2 className="font-headline-lg text-headline-lg">Treatment Roadmap</h2>
            <div className="space-y-0">
              {medicalCase.timeline.map((step, i) => {
                const style = TIMELINE_STYLES[step.status];
                const isLast = i === medicalCase.timeline.length - 1;
                return (
                  <div key={step.phase} className={`relative pl-lg ${isLast ? "" : "pb-xl timeline-line"}`}>
                    <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ring-4 ${style.dot}`} />
                    <div className={`p-md rounded-xl border ml-md ${style.card}`}>
                      <span className="font-label-sm text-label-sm font-bold uppercase text-on-surface-variant">
                        {step.phase}
                      </span>
                      <h4 className="font-headline-md text-headline-md mt-xs">{step.title}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {medicalCase.updates.length > 0 && (
            <section className="space-y-md pt-xl">
              <div className="flex justify-between items-center">
                <h2 className="font-headline-lg text-headline-lg">Medical Updates</h2>
                <button className="text-primary font-label-md text-label-md flex items-center gap-xs">
                  Follow Case <Bell size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-md">
                {medicalCase.updates.map((update) => {
                  const Icon = UPDATE_ICON[update.icon] ?? Info;
                  return (
                    <div key={update.date + update.label} className="bg-white p-lg rounded-xl border border-outline-variant">
                      <div className="flex justify-between mb-sm">
                        <div className="flex items-center gap-sm">
                          <Icon size={18} className="text-secondary" aria-hidden="true" />
                          <span className="font-label-md text-label-md font-bold">
                            {update.date} - {update.label}
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-outline">{update.timeAgo}</span>
                      </div>
                      <p className="font-body-sm text-body-sm">{update.note}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {showDonate && (
        <DonateModal
          medicalCase={medicalCase}
          onClose={() => setShowDonate(false)}
          onDonated={(updatedCase) =>
            setCaseResult({ caseId, status: "ready", data: updatedCase })
          }
        />
      )}
    </main>
  );
}
