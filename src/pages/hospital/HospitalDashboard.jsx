import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Plus,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { getHospitalDashboard } from "../../services/hospitalService.js";

const METRIC_ICON = { clinical_notes: ClipboardList, check_circle: CheckCircle2, payments: Wallet, pending_actions: Clock3 };
const TREND_TONE = { secondary: "text-secondary", error: "text-error", muted: "text-on-surface-variant" };
const TAG_TONE = {
  secondary: "bg-secondary-container/30 text-on-secondary-container",
  primary: "bg-primary-container/20 text-primary",
  error: "bg-error-container/30 text-error",
  neutral: "bg-surface-container-highest text-on-surface-variant",
};

export default function HospitalDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getHospitalDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body-md text-body-md text-on-surface-variant">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body-md text-body-md text-error">Couldn't load dashboard: {error}</p>
      </div>
    );
  }

  const { hospital, metrics, requests, insight } = data;
  const filteredRequests = requests.filter(
    (r) =>
      !search ||
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.caseType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-surface border-b border-outline-variant flex flex-col sm:flex-row sm:justify-between sm:items-center gap-md w-full px-md md:px-margin-desktop py-md sticky top-0 z-30 premium-blur">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-primary">
            {hospital.name} — Clinical Overview
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Welcome back, {hospital.adminName}. Real-time data sync active.
          </p>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative hidden sm:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              type="text"
              className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-64"
            />
          </div>
          <Button as={Link} to="/hospital/new-request" size="md" className="!rounded-full" icon={Plus}>
            New Assistance Request
          </Button>
        </div>
      </header>

      <div className="p-md md:p-margin-desktop max-w-7xl mx-auto w-full space-y-xl">
        {/* Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {metrics.map((m) => {
            const Icon = METRIC_ICON[m.icon];
            return (
              <div
                key={m.label}
                className="premium-card p-lg rounded-xl flex flex-col gap-xs hover:border-primary/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-sm">
                  <span className="text-primary bg-primary-container/20 p-2 rounded-lg">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className={`font-label-md text-label-md ${TREND_TONE[m.trendTone]}`}>{m.trend}</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  {m.label}
                </p>
                <h3 className="font-display-lg text-display-lg text-on-surface">{m.value}</h3>
              </div>
            );
          })}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Requests table */}
          <section className="lg:col-span-2 premium-card rounded-xl overflow-hidden flex flex-col">
            <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Recent Assistance Requests
              </h3>
              <span className="text-on-surface-variant font-label-md text-label-md">
                {requests.length} total
              </span>
            </div>
            {filteredRequests.length === 0 ? (
              <div className="p-xl text-center text-on-surface-variant font-body-sm text-body-sm">
                {requests.length === 0
                  ? "No assistance requests yet — create your first one."
                  : "No requests match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low text-on-surface-variant">
                    <tr>
                      <th className="px-xl py-md font-label-md text-label-md">PATIENT &amp; ID</th>
                      <th className="px-xl py-md font-label-md text-label-md">CASE TYPE</th>
                      <th className="px-xl py-md font-label-md text-label-md">STATUS</th>
                      <th className="px-xl py-md font-label-md text-label-md text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filteredRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-xl py-lg">
                          <div className="flex items-center gap-md">
                            <div className="w-10 h-10 rounded-full bg-primary-fixed-dim/30 flex items-center justify-center font-bold text-primary shrink-0">
                              {r.initials}
                            </div>
                            <div>
                              <p className="font-body-md text-body-md font-semibold">{r.patient}</p>
                              <p className="text-label-sm text-on-surface-variant">#{r.id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-xl py-lg">
                          <p className="font-body-sm text-body-sm">{r.caseType}</p>
                          <p className="text-[11px] text-on-surface-variant">{r.doctor}</p>
                        </td>
                        <td className="px-xl py-lg">
                          <div className="flex flex-wrap gap-xs">
                            {r.tags.map((tag) => (
                              <span
                                key={tag.label}
                                className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${TAG_TONE[tag.tone]}`}
                              >
                                {tag.label}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-xl py-lg text-right">
                          <Link
                            to={`/cases/${r.id}`}
                            className="text-outline hover:text-primary transition-colors inline-block"
                            aria-label={`View ${r.patient}`}
                          >
                            <ChevronRight size={20} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-gutter">
            <div className="premium-card rounded-xl p-lg border-l-4 border-primary">
              <div className="flex items-center gap-sm mb-md">
                <Sparkles size={20} className="text-primary" aria-hidden="true" />
                <h4 className="font-label-md text-label-md text-primary uppercase">Bridge Insights</h4>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">{insight}</p>
            </div>

            <div className="bg-primary text-on-primary rounded-xl p-lg shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-headline-md text-headline-md font-bold mb-xs">Network Expansion</h4>
                <p className="font-body-sm text-body-sm opacity-90 mb-lg">
                  Invite specialized clinics to the CareBridge network to share resource loads.
                </p>
                <button className="bg-on-primary text-primary px-lg py-2 rounded-lg font-label-md text-label-md font-bold hover:scale-105 transition-transform">
                  Invite Partner
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
