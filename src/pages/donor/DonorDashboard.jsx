import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Gift, HeartHandshake, TrendingUp } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import AIInsightPanel from "../../components/ai/AIInsightPanel.jsx";
import { getDonorDashboard } from "../../services/donorService.js";

const STATUS_TONE = {
  Active: "bg-primary-container/20 text-primary",
  Funded: "bg-secondary-container/30 text-on-secondary-container",
};

export default function DonorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDonorDashboard()
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

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body-md text-body-md text-error">Couldn't load dashboard: {error}</p>
      </div>
    );
  }

  const { donor, gifts, impactInsight } = data;

  return (
    <div className="p-md md:p-margin-desktop max-w-6xl mx-auto w-full space-y-xl">
      <header>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
          Welcome back, {donor.name}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Here's the impact your generosity has made across the CareBridge network.
        </p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
        <div className="premium-card p-lg rounded-xl flex flex-col gap-xs">
          <span className="text-primary bg-primary-container/20 p-2 rounded-lg w-fit mb-sm">
            <HeartHandshake size={20} aria-hidden="true" />
          </span>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Total Given
          </p>
          <h3 className="font-display-lg text-display-lg text-primary">
            ${donor.totalGiven.toLocaleString()}
          </h3>
        </div>
        <div className="premium-card p-lg rounded-xl flex flex-col gap-xs">
          <span className="text-secondary bg-secondary-container/20 p-2 rounded-lg w-fit mb-sm">
            <Gift size={20} aria-hidden="true" />
          </span>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Cases Supported
          </p>
          <h3 className="font-display-lg text-display-lg text-secondary">{donor.casesSupported}</h3>
        </div>
        <div className="premium-card p-lg rounded-xl flex flex-col gap-xs">
          <span className="text-primary bg-primary-container/20 p-2 rounded-lg w-fit mb-sm">
            <TrendingUp size={20} aria-hidden="true" />
          </span>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Impact Score
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">{donor.impactScore}</h3>
        </div>
      </section>

      <AIInsightPanel title="Your Impact Insight" status="idle" className="premium-card">
        <p>{impactInsight}</p>
      </AIInsightPanel>

      {/* Gift history */}
      <section className="premium-card rounded-xl overflow-hidden">
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-headline-md text-headline-md text-on-surface">My Gifts</h3>
          <Link to="/cases" className="text-primary font-label-md text-label-md hover:underline flex items-center gap-xs">
            Find another case <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {gifts.length === 0 ? (
          <div className="p-xl text-center text-on-surface-variant font-body-sm text-body-sm">
            You haven't made any gifts yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant">
                <tr>
                  <th className="px-xl py-md font-label-md text-label-md">CASE</th>
                  <th className="px-xl py-md font-label-md text-label-md">AMOUNT</th>
                  <th className="px-xl py-md font-label-md text-label-md">DATE</th>
                  <th className="px-xl py-md font-label-md text-label-md text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {gifts.map((gift, i) => (
                  <tr key={i} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-xl py-lg">
                      <Link to={`/cases/${gift.caseId}`} className="font-body-md text-body-md font-semibold hover:text-primary">
                        {gift.caseTitle}
                      </Link>
                      <p className="text-label-sm text-on-surface-variant">#{gift.caseId.slice(-6)}</p>
                    </td>
                    <td className="px-xl py-lg font-body-md text-body-md">${gift.amount}</td>
                    <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface-variant">
                      {gift.date}
                    </td>
                    <td className="px-xl py-lg text-right">
                      <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${STATUS_TONE[gift.status]}`}>
                        {gift.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-primary text-on-primary rounded-xl p-xl flex flex-col md:flex-row items-center justify-between gap-lg">
        <div>
          <h4 className="font-headline-md text-headline-md font-bold mb-xs">Ready for your next gift?</h4>
          <p className="font-body-sm text-body-sm opacity-90">
            Browse verified cases matched to the causes you care about.
          </p>
        </div>
        <Button as={Link} to="/cases" variant="secondary" icon={Compass} className="shrink-0">
          Discover Cases
        </Button>
      </section>
    </div>
  );
}
