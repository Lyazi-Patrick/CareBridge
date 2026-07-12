import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  HeartHandshake,
  Hospital,
  Languages,
  Sparkles,
  Star,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import CaseCard from "../components/cases/CaseCard.jsx";
import { listCases } from "../services/casesService.js";
import { getPlatformStats } from "../services/statsService.js";

// Editorial/marketing copy — not app data, so it stays as static content
// on the page itself rather than fetched from an API.
const TESTIMONIALS = [
  {
    name: "Dr. Elena Rodriguez",
    role: "Chief of Surgery, Metro Health",
    quote:
      "CareBridge has changed how we handle non-insured emergency cases — the verification speed is unmatched.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlCmOR1NUTBKpw2bCVJa_OGkLTYKDkkD6LtciwV2sI-YY5AmJPQRSlKf8QOTyniUT0qTl6WU7Xw1aNnBufg6sHfVOZNEmSzbOitflqkHNPbfTmLZJ2vzCnXGxvb5RF_FxPDXusrJoNnRCYfNP2zlm-__4JsIh2tsSUc97kibjwnDLSOHmlXhCF__h75Pj5GDwLz_PghwqEXIvT83CBn0XQi0Q5u7_IMQ3uzk7kWmuahGTspupMXrQc",
  },
  {
    name: "Marcus Thorne",
    role: "Global Health Initiatives Donor",
    quote:
      "The clinical precision of the reporting gives me confidence that my contributions are being used efficiently.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3AbLMHTOhvBP_HTJkFJuVcYGhIuH1cOB1uCLFaASuvMgujyxu9AKWtpe09tzXhI_clIefaW2NO17rsa35gJJXEbbqCpA6Lj_Kkxiqfoey6D3Z4W5qxSpZELQYwAqspcMEhK6E_qqul1kZjZYaFR4JNBqo3BXQ3gSBuiTwILYoF9eFPvK7nx485MWIm6FRrS2YTEcxZEIJlTtZ_hr69TpiHbbTaDHXVMgzXJbV4LyH_E1sozE4otOU",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Hospital,
    iconBg: "bg-primary-container text-on-primary",
    title: "Hospital Verification",
    body: "Registered medical facilities submit cases with verified clinical data and cost breakdowns.",
  },
  {
    icon: BookOpen,
    iconBg: "bg-secondary text-on-secondary",
    title: "Patient Story",
    body: "We bridge the data with narrative, sharing the human context behind the medical need.",
  },
  {
    icon: HeartHandshake,
    iconBg: "bg-tertiary-container text-on-tertiary",
    title: "Donor Impact",
    body: "Direct funding with real-time tracking from donation to treatment completion.",
  },
];

export default function Home() {
  const [featuredCases, setFeaturedCases] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    listCases()
      .then((cases) => setFeaturedCases(cases.slice(0, 3)))
      .catch(() => setFeaturedCases([]));
    getPlatformStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative hero-mesh py-xxl md:py-section overflow-hidden">
        <div className="max-w-7xl mx-auto px-md md:px-margin-desktop flex flex-col lg:flex-row items-center gap-xxl">
          <div className="flex-1 space-y-xl z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-xs px-sm py-1 bg-primary-container/10 text-primary rounded-full border border-primary/20"
            >
              <BadgeCheck size={16} aria-hidden="true" />
              <span className="font-label-md text-label-md uppercase tracking-wider">
                Clinical Reliability meets Human Warmth
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="font-display-lg text-display-lg text-primary leading-tight"
            >
              Technology helping humanity.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-[36rem] mx-auto lg:mx-0"
            >
              Bridging the medical funding gap with transparency and precision. We empower
              hospitals and donors to transform lives through verified clinical cases.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-md justify-center lg:justify-start pt-md"
            >
              <Button as={Link} to="/cases" size="lg">
                Support a Patient
              </Button>
              <div className="flex flex-col gap-sm">
                <Button as={Link} to="/cases" variant="ghost" size="md">
                  Find Help
                </Button>
                <Button as={Link} to="/register" variant="ghost" size="md">
                  Partner as a Hospital
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="flex-1 w-full relative"
          >
            <div className="relative z-10 rounded-xxl overflow-hidden shadow-2xl premium-card border-4 border-white">
              <img
                className="w-full h-[500px] object-cover"
                alt="Doctors collaborating over a digital patient record in a modern hospital lobby"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn6qtSr0Ck9VXXdxt6Mix0LpUyXeXskEB4ccVpcEPmFEwY1m0g71Gxtny1jM8XBIgYRN0mc6NPvCwv6RbXH-zMOtXhyoDU9t3D6ux-tL26rSJ9GEOeSTQIfQIU8MRx27lZAGxmYZnyWyzZD2dpRulCUk_TV8B_rE8PpXSVCdmJv7HoB9F_9NGOvCjD8sFyn6AGDpVrpEV2g_Q4H9wQQf4XAsdmsWjxt7i6TxJBC426Y-i1GPnZ_dLn"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-container rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-primary-container rounded-full blur-3xl opacity-30 -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-xl bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-7xl mx-auto px-md md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-xl">
          {[
            ["Total Funded", stats?.totalFunded ?? "—"],
            ["Lives Touched", stats?.livesTouched ?? "—"],
            ["Partner Hospitals", stats?.partnerHospitals ?? "—"],
            ["Verification Rate", stats?.verificationRate ?? "—"],
          ].map(([label, value], i) => (
            <div key={label} className={`text-center ${i > 0 ? "border-l border-outline-variant" : ""}`}>
              <div className="font-display-lg text-primary text-headline-lg">{value}</div>
              <div className="font-label-md text-on-surface-variant uppercase">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-xxl bg-surface">
        <div className="max-w-7xl mx-auto px-md md:px-margin-desktop">
          <div className="text-center mb-xxl space-y-md">
            <h2 className="font-headline-lg text-headline-lg text-primary">Precision in Every Step</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Our rigorous verification process ensures that every dollar spent directly impacts a
              human life with full transparency.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-xl relative">
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-px border-t border-dashed border-outline-variant -z-10" />
            {HOW_IT_WORKS.map(({ icon: Icon, iconBg, title, body }) => (
              <div key={title} className="flex flex-col items-center text-center space-y-md">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${iconBg}`}>
                  <Icon size={32} aria-hidden="true" />
                </div>
                <h3 className="font-headline-md text-headline-md">{title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cases */}
      <section className="py-xxl bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-md md:px-margin-desktop">
          <div className="flex justify-between items-end mb-xl">
            <div className="space-y-sm">
              <h2 className="font-headline-lg text-headline-lg text-primary">Urgent Medical Cases</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Help bridge the gap for these verified patients today.
              </p>
            </div>
            <Link
              to="/cases"
              className="hidden md:flex items-center gap-xs text-primary font-bold font-label-md"
            >
              View All Cases <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-lg">
            {featuredCases.map((c) => (
              <CaseCard key={c.id} medicalCase={c} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-xxl bg-surface">
        <div className="max-w-7xl mx-auto px-md md:px-margin-desktop">
          <div className="ai-glow p-xl md:p-xxl rounded-xxl flex flex-col lg:flex-row items-center gap-xl border border-outline-variant/30">
            <div className="flex-1 space-y-md">
              <div className="flex items-center gap-sm text-primary">
                <Sparkles size={20} aria-hidden="true" />
                <span className="font-label-md text-label-md font-bold uppercase tracking-widest">
                  AI-Enhanced Transparency
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg">Bridging the understanding gap.</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Our platform uses advanced AI to translate complex clinical medical records into
                clear, human-centered stories without losing technical precision. We help donors
                understand exactly what they are funding.
              </p>
              <div className="grid sm:grid-cols-2 gap-md pt-md">
                <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/20">
                  <Languages size={22} className="text-primary mb-sm" aria-hidden="true" />
                  <h4 className="font-label-md text-label-md font-bold text-primary mb-xs">
                    Medical Translation
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Converting technical jargon into empathetic patient narratives.
                  </p>
                </div>
                <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/20">
                  <BarChart3 size={22} className="text-primary mb-sm" aria-hidden="true" />
                  <h4 className="font-label-md text-label-md font-bold text-primary mb-xs">
                    Cost Auditing
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Real-time AI verification of hospital billing against standard rates.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full flex justify-center">
              <div className="relative w-full max-w-[28rem] aspect-square bg-surface-container rounded-xxl overflow-hidden border border-outline-variant shadow-inner flex items-center justify-center p-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="relative z-10 w-full space-y-sm">
                  <div className="bg-white p-sm rounded-lg shadow-md border border-outline-variant/50">
                    <div className="h-3 w-1/3 bg-primary/20 rounded mb-2" />
                    <div className="h-2 w-full bg-surface-container rounded mb-1" />
                    <div className="h-2 w-full bg-surface-container rounded mb-1" />
                    <div className="h-2 w-2/3 bg-surface-container rounded" />
                  </div>
                  <div className="flex justify-center text-primary">
                    <Sparkles size={32} aria-hidden="true" />
                  </div>
                  <div className="bg-primary p-sm rounded-lg shadow-lg border border-primary-container">
                    <div className="h-3 w-1/2 bg-white/40 rounded mb-2" />
                    <p className="text-white text-[12px] leading-relaxed font-medium">
                      "Patient requires a specialized cardiac stent procedure to restore full
                      arterial blood flow and prevent future ischemic events."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-xxl bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-md md:px-margin-desktop">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary">Trusted by the Network</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-xl">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="premium-card p-xl rounded-xxl flex gap-md">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img src={t.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-sm">
                  <div className="flex text-secondary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="font-body-md text-body-md italic text-on-surface">"{t.quote}"</p>
                  <div className="font-label-md text-label-md font-bold text-primary">{t.name}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-xxl pt-xl border-t border-outline-variant flex flex-wrap justify-center items-center gap-xxl opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {["HEALTH+", "MED-CORE", "UNITED CARE", "BIO-TRUST", "VITA-NET"].map((name) => (
              <span key={name} className="font-headline-md font-black tracking-tighter text-on-surface-variant">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-xxl bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto px-md text-center space-y-xl">
          <h2 className="font-display-lg text-display-lg text-white">
            Join the bridge between need and care.
          </h2>
          <p className="font-body-lg text-body-lg text-primary-fixed-dim">
            Whether you are a medical professional looking for funding or a donor looking for
            impact, your place is here.
          </p>
          <div className="flex flex-col sm:flex-row gap-lg justify-center pt-md">
            <Button as={Link} to="/cases" variant="secondary" size="lg" className="!rounded-xl hover:scale-105">
              Support a Patient
            </Button>
            <Button
              as={Link}
              to="/register"
              variant="ghost"
              size="lg"
              className="!rounded-xl border-2 border-primary-fixed text-primary-fixed hover:bg-primary-container"
            >
              Partner With Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
