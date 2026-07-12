import { useEffect, useMemo, useState } from "react";
import { ArrowUp, ChevronDown, Minus, Search, TriangleAlert } from "lucide-react";
import CaseCard from "../../components/cases/CaseCard.jsx";
import AIFloatingAssistant from "../../components/ai/AIFloatingAssistant.jsx";
import { listCases, getCategories } from "../../services/casesService.js";

const URGENCY_FILTERS = [
  { id: "critical", label: "Critical", icon: TriangleAlert },
  { id: "high", label: "High", icon: ArrowUp },
  { id: "medium", label: "Medium", icon: Minus },
];

export default function DiscoverCases() {
  const [allCases, setAllCases] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [urgency, setUrgency] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    Promise.all([listCases(), getCategories()])
      .then(([cases, cats]) => {
        setAllCases(cases);
        setCategoryOptions(cats);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function toggleCategory(cat) {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }

  const filtered = useMemo(() => {
    return allCases.filter((c) => {
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.condition.toLowerCase().includes(search.toLowerCase()) ||
        c.hospital.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categories.length === 0 || categories.includes(c.category);
      const matchesUrgency = !urgency || c.urgency === urgency;
      return matchesSearch && matchesCategory && matchesUrgency;
    });
  }, [allCases, search, categories, urgency]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <main className="max-w-7xl mx-auto px-md md:px-margin-desktop py-xl">
      <div className="mb-xxl text-center lg:text-left">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-md">Discover Medical Cases</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Browse urgent medical cases verified by our network of partner hospitals. Join our
          mission of clinical precision and human warmth.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-xl">
        {/* Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="glass-card rounded-xl p-lg lg:sticky lg:top-32 space-y-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md">Filters</h2>
              <button
                onClick={() => {
                  setSearch("");
                  setCategories([]);
                  setUrgency(null);
                }}
                className="text-primary font-label-md text-label-md hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="relative">
              <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cases..."
                className="pl-xl pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-full text-body-sm w-full focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-sm">
                Treatment Type
              </label>
              <div className="space-y-sm">
                {categoryOptions.map((cat) => (
                  <label key={cat} className="flex items-center gap-sm cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={categories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-sm">
                Urgency Level
              </label>
              <div className="grid grid-cols-1 gap-xs">
                {URGENCY_FILTERS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setUrgency((u) => (u === id ? null : id))}
                    className={`flex items-center justify-between px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${
                      urgency === id
                        ? "bg-error-container/20 text-on-error-container border border-error/10"
                        : "hover:bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {label} <Icon size={18} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Cases Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="glass-card rounded-xl p-xxl text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">Loading cases...</p>
            </div>
          ) : loadError ? (
            <div className="glass-card rounded-xl p-xxl text-center">
              <p className="font-body-md text-body-md text-error">
                Couldn't load cases: {loadError}
              </p>
            </div>
          ) : visible.length === 0 ? (
            <div className="glass-card rounded-xl p-xxl text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                No cases match your filters right now. Try clearing a filter above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {visible.map((c) => (
                <CaseCard key={c.id} medicalCase={c} />
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="mt-xl flex justify-center">
              <button
                onClick={() => setVisibleCount((n) => n + 4)}
                className="flex items-center gap-sm px-xl py-md text-primary font-label-md text-label-md border-2 border-primary rounded-xl hover:bg-primary hover:text-on-primary transition-all"
              >
                Load More Cases
                <ChevronDown size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      <AIFloatingAssistant />
    </main>
  );
}
