import { useEffect, useState } from "react";
import { BadgeCheck, BarChart3, Check, Download, FileText, Sparkles } from "lucide-react";
import ProgressBar from "../../components/ui/ProgressBar.jsx";
import AIInsightPanel from "../../components/ai/AIInsightPanel.jsx";
import { getPatientDashboard } from "../../services/patientService.js";

const DOC_ICON = { description: FileText, assignment: FileText, analytics: BarChart3 };

export default function PatientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPatientDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body-md text-body-md text-on-surface-variant">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body-md text-body-md text-error">Couldn't load dashboard: {error}</p>
      </div>
    );
  }

  const { patient, roadmap = [], documents = [], donorMessages = [], aiInsight } = data;

  if (patient.raised === undefined) {
    // No active case linked to this patient account yet.
    return (
      <main className="max-w-3xl mx-auto px-md py-xxl text-center space-y-md">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Welcome, {patient.name}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          You don't have an active case yet. Once your hospital submits and verifies an
          assistance request on your behalf, your funding journey will appear here.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-md md:px-margin-desktop py-xl">
      <header className="mb-xxl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">
              Welcome back, {patient.name}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Here is a clinical overview of your current journey.
            </p>
          </div>
          <span className="bg-secondary-fixed text-on-secondary-fixed px-md py-xs rounded-full font-label-sm text-label-sm flex items-center gap-xs w-fit">
            <BadgeCheck size={16} aria-hidden="true" /> Verified Case
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Funding progress */}
        <div className="lg:col-span-12 premium-card rounded-xl p-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-lg gap-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-xs">Your Journey</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Funding Goal Progress
              </p>
            </div>
            <div className="text-right">
              <p className="font-headline-md text-headline-md text-secondary">
                ${patient.raised.toLocaleString()}
              </p>
              <p className="font-label-md text-label-md text-on-surface-variant">
                of ${patient.goal.toLocaleString()} raised
              </p>
            </div>
          </div>

          <ProgressBar value={patient.raised} max={patient.goal} label="Funding progress" thickness={16} className="mb-lg" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
            {[
              ["Donors", patient.donors],
              ["Days Left", patient.daysLeft],
              ["Avg Gift", `$${patient.avgGift}`],
              ["Status", patient.status],
            ].map(([label, value]) => (
              <div key={label} className="p-md rounded-lg bg-surface-container-low">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
                  {label}
                </p>
                <p className="font-headline-md text-headline-md">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="lg:col-span-4 premium-card rounded-xl p-xl">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-xl">Journey Roadmap</h3>
          {roadmap.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Your care team hasn't published a roadmap yet.
            </p>
          ) : (
            <div className="space-y-0 relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-outline-variant" />
              {roadmap.map((item, i) => (
                <div key={item.phase} className={`relative pl-xl ${i === roadmap.length - 1 ? "" : "pb-xl"}`}>
                  <div
                    className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-surface ${
                      item.status === "complete"
                        ? "bg-secondary"
                        : item.status === "current"
                          ? "bg-primary"
                          : "bg-surface-container-highest"
                    }`}
                  >
                    {item.status === "complete" ? (
                      <Check size={16} className="text-on-secondary" aria-hidden="true" />
                    ) : (
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === "current" ? "bg-on-primary animate-pulse" : "bg-outline"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`font-label-md text-label-md ${
                      item.status === "complete"
                        ? "text-secondary"
                        : item.status === "current"
                          ? "text-primary"
                          : "text-on-surface-variant"
                    }`}
                  >
                    {item.phase}
                  </p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{item.title}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{item.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Donor messages */}
        <div className="lg:col-span-4 premium-card rounded-xl p-xl flex flex-col">
          <div className="flex justify-between items-center mb-xl">
            <h3 className="font-headline-md text-headline-md text-on-surface">Donor Messages</h3>
            <span className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full font-label-sm text-label-sm">
              {donorMessages.length} New
            </span>
          </div>
          {donorMessages.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              No messages from donors yet.
            </p>
          ) : (
            <div className="flex-grow space-y-lg overflow-y-auto max-h-[400px] pr-sm custom-scrollbar">
              {donorMessages.map((msg, i) => (
                <div key={i} className="p-md bg-surface-container-low rounded-lg">
                  <div className="flex items-center gap-md mb-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs shrink-0">
                      {msg.initials}
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{msg.name}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{msg.timeAgo}</p>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface">"{msg.message}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="lg:col-span-4 premium-card rounded-xl p-xl">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-xl">Medical Documents</h3>
          {documents.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              No documents uploaded for this case yet.
            </p>
          ) : (
            <div className="space-y-md">
              {documents.map((doc) => {
                const Icon = DOC_ICON[doc.icon] ?? FileText;
                return (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-md border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all group"
                  >
                    <div className="flex items-center gap-md min-w-0">
                      <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 bg-primary-fixed text-primary">
                        <Icon size={18} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-body-md text-body-md font-semibold text-on-surface truncate">
                          {doc.name}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{doc.meta}</p>
                      </div>
                    </div>
                    <button
                      className="text-outline group-hover:text-primary transition-colors shrink-0"
                      aria-label={`Download ${doc.name}`}
                    >
                      <Download size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Insight */}
        <div className="lg:col-span-12">
          <AIInsightPanel title="CareBridge Health Insight" status="idle" className="premium-card">
            <div className="flex flex-col md:flex-row items-center gap-xl">
              <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <Sparkles size={32} aria-hidden="true" />
              </div>
              <p className="flex-grow font-body-md text-body-md text-on-surface">{aiInsight}</p>
            </div>
          </AIInsightPanel>
        </div>
      </div>
    </main>
  );
}
