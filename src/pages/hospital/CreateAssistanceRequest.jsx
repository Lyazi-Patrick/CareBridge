import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  ListChecks,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import AIInsightPanel from "../../components/ai/AIInsightPanel.jsx";
import { createCase, requestFormAssist } from "../../services/casesService.js";

const STEPS = ["Info", "Financial", "Files"];

const URGENCY_OPTIONS = [
  { value: "medium", label: "Standard (30-60 days)" },
  { value: "high", label: "Urgent (Within 14 days)" },
  { value: "critical", label: "Critical (Immediate surgical/ICU need)" },
];

export default function CreateAssistanceRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    condition: "",
    description: "",
    fundingGoal: "",
    category: "Surgery",
    urgency: "medium",
  });
  const [assistStatus, setAssistStatus] = useState("idle");
  const [assistText, setAssistText] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAIAssist() {
    setAssistStatus("loading");
    try {
      const text = await requestFormAssist(form);
      setAssistText(text);
      setAssistStatus("ready");
    } catch (err) {
      setAssistStatus("error");
      setAssistText(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createCase(form);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
        <div className="bg-white rounded-3xl p-xl md:p-xxl max-w-lg w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-lg">
            <ListChecks size={36} className="text-secondary" aria-hidden="true" />
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
            Request Submitted
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
            Your patient assistance request has been sent to our medical review board. We'll
            notify you once it goes live for donors.
          </p>
          <Button size="lg" fullWidth onClick={() => navigate("/hospital")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-md md:px-margin-desktop py-xl">
      <header className="mb-xxl">
        <button
          onClick={() => navigate("/hospital")}
          className="flex items-center gap-xs text-primary mb-md font-label-md text-label-md hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to Patient Directory
        </button>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
          Create Assistance Request
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Connect patient needs with our donor network through a transparent, verified medical
          case.
        </p>
      </header>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-xxl relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-high -z-10 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((label, i) => {
          const n = i + 1;
          const isDone = n < step;
          const isCurrent = n === step;
          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-surface font-bold transition-colors ${
                  isDone || isCurrent
                    ? isDone
                      ? "bg-secondary text-white"
                      : "bg-primary text-white"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {isDone ? <Check size={18} /> : n}
              </div>
              <span
                className={`font-label-sm text-label-sm ${isCurrent ? "text-primary font-bold" : "text-on-surface-variant"}`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-xl">
        {step === 1 && (
          <section className="space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">
                  Full Patient Name
                </label>
                <input
                  type="text"
                  required
                  value={form.patientName}
                  onChange={(e) => update("patientName", e.target.value)}
                  placeholder="e.g. Samuel J. Reed"
                  className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">
                  Primary Medical Condition
                </label>
                <input
                  type="text"
                  required
                  value={form.condition}
                  onChange={(e) => update("condition", e.target.value)}
                  placeholder="e.g. Acute Lymphoblastic Leukemia"
                  className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase">
                Case Description
              </label>
              <textarea
                rows={5}
                required
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the clinical situation and the necessity of requested aid..."
                className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <AIInsightPanel title="CareBridge AI Insight" status={assistStatus}>
              {assistStatus === "ready" || assistStatus === "error" ? (
                <p>{assistText}</p>
              ) : (
                <div className="flex items-start justify-between gap-md">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Our AI will help simplify these medical details for donors, translating
                    clinical terms into relatable health narratives while preserving medical
                    accuracy.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    icon={Sparkles}
                    onClick={handleAIAssist}
                    className="shrink-0"
                  >
                    Assist
                  </Button>
                </div>
              )}
            </AIInsightPanel>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">
                  Funding Goal (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.fundingGoal}
                    onChange={(e) => update("fundingGoal", e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white border border-outline-variant rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase">
                  Urgency Level
                </label>
                <select
                  value={form.urgency}
                  onChange={(e) => update("urgency", e.target.value)}
                  className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                >
                  {URGENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-lg bg-surface-container-low rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-sm mb-md">
                <Info size={20} className="text-secondary" aria-hidden="true" />
                <h3 className="font-label-md text-label-md text-on-surface font-bold">
                  Transparency Note
                </h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Funds are disbursed directly to the provider for clinical expenses. Please ensure
                the estimated costs align with the facility's standardized billing rates.
              </p>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-lg">
            <div className="space-y-md">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase">
                Required Documentation
              </label>
              <div className="border-2 border-dashed border-outline-variant rounded-2xl p-xxl text-center">
                <UploadCloud size={48} className="mx-auto mb-md text-outline" aria-hidden="true" />
                <h4 className="font-headline-md text-headline-md text-on-surface mb-sm">
                  File upload coming soon
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Document upload isn't wired up yet in this build. Your case will still be
                  created and reviewed — you'll be able to attach records here in a future
                  update.
                </p>
              </div>
            </div>
          </section>
        )}

        {submitError && (
          <div className="bg-error-container text-on-error-container text-body-sm px-md py-sm rounded-lg">
            {submitError}
          </div>
        )}

        {/* Actions */}
        <div className="pt-xl border-t border-outline-variant flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-xl py-sm text-on-surface-variant font-bold hover:text-primary transition-colors flex items-center gap-xs"
            >
              <ArrowLeft size={18} aria-hidden="true" /> Back
            </button>
          ) : (
            <span />
          )}

          {step < STEPS.length ? (
            <Button
              type="button"
              size="lg"
              className="!rounded-full"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => setStep((s) => s + 1)}
            >
              Next Step
            </Button>
          ) : (
            <Button type="submit" size="lg" variant="secondary" className="!rounded-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Review & Publish Request"}
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}
