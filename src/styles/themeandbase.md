/* base.css */
/* ==========================================================================
   CareBridge base layer — utility classes shared across the 6 Stitch mockups.
   Consolidated so every page/component draws from the same definitions
   (e.g. every design had its own slightly different ai-indigo-border /
   glass-card — merged here into one canonical version each).
   ========================================================================== */

@layer components {
  /* Elevated white card used for cases, stats, dashboard panels */
  .premium-card {
    background: white;
    border: 1px solid var(--color-surface-container);
    box-shadow: var(--shadow-level-1);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .premium-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-level-2);
  }

  /* Frosted translucent panel (used over hero imagery / sticky headers) */
  .glass-card {
    background: rgb(255 255 255 / 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-surface-container);
  }

  /* Sticky nav / mobile tab bar blur */
  .premium-blur {
    backdrop-filter: blur(8px);
    background: rgb(251 248 255 / 0.8);
  }

  /* Soft gradient mesh, hero sections only */
  .hero-mesh {
    background-color: var(--color-surface-bright);
    background-image:
      radial-gradient(at 100% 0%, #dde1ff 0px, transparent 50%),
      radial-gradient(at 0% 100%, #6ffbbe 0px, transparent 50%);
  }

  /* AI Indigo accent — reserved exclusively for AI-generated content,
     per DESIGN.md. 2px left border + faint indigo gradient wash. */
  .ai-indigo-border {
    border-left: 2px solid var(--color-ai-indigo);
    background: linear-gradient(90deg, rgb(99 102 241 / 0.06) 0%, rgb(255 255 255 / 0) 100%);
  }

  /* Vertical connector line for timelines (case status history) */
  .timeline-line {
    position: relative;
  }
  .timeline-line::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 24px;
    bottom: 0;
    width: 2px;
    background-color: var(--color-outline-variant);
  }

  /* Thin custom scrollbar for filter sidebars / case lists */
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--color-inverse-on-surface);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--color-outline-variant);
    border-radius: 10px;
  }
}

/* Respect reduced-motion preference site-wide */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Visible keyboard focus ring, consistent across all interactive elements */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}


/*theme.css */
/* ==========================================================================
   CareBridge design tokens — ported from /stitch/carebridge/DESIGN.md
   "Clinical Precision with Human Warmth"
   Tailwind v4 CSS-first theme (no tailwind.config.js needed).
   ========================================================================== */

@theme {
  /* ---- Color: surfaces ---- */
  --color-surface: #fbf8ff;
  --color-surface-dim: #dad9e3;
  --color-surface-bright: #fbf8ff;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f4f2fc;
  --color-surface-container: #eeedf7;
  --color-surface-container-high: #e8e7f1;
  --color-surface-container-highest: #e3e1eb;
  --color-surface-variant: #e3e1eb;
  --color-on-surface: #1a1b22;
  --color-on-surface-variant: #444653;
  --color-inverse-surface: #2f3037;
  --color-inverse-on-surface: #f1f0fa;
  --color-outline: #757684;
  --color-outline-variant: #c4c5d5;
  --color-background: #fbf8ff;
  --color-on-background: #1a1b22;

  /* ---- Color: primary (Deep Medical Blue — trust, navigation, actions) ---- */
  --color-surface-tint: #3755c3;
  --color-primary: #00288e;
  --color-on-primary: #ffffff;
  --color-primary-container: #1e40af;
  --color-on-primary-container: #a8b8ff;
  --color-inverse-primary: #b8c4ff;
  --color-primary-fixed: #dde1ff;
  --color-primary-fixed-dim: #b8c4ff;
  --color-on-primary-fixed: #001453;
  --color-on-primary-fixed-variant: #173bab;

  /* ---- Color: secondary (Healthy Green — confirmations, funded states) ---- */
  --color-secondary: #006c49;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #6cf8bb;
  --color-on-secondary-container: #00714d;
  --color-secondary-fixed: #6ffbbe;
  --color-secondary-fixed-dim: #4edea3;
  --color-on-secondary-fixed: #002113;
  --color-on-secondary-fixed-variant: #005236;

  /* ---- Color: tertiary (warm accent) ---- */
  --color-tertiary: #611e00;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #872d00;
  --color-on-tertiary-container: #ffa583;
  --color-tertiary-fixed: #ffdbce;
  --color-tertiary-fixed-dim: #ffb59a;
  --color-on-tertiary-fixed: #380d00;
  --color-on-tertiary-fixed-variant: #802a00;

  /* ---- Color: error / urgency (critical alerts, "needs attention") ---- */
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;

  /* ---- Color: AI Indigo (exclusively for AI-generated insights) ---- */
  --color-ai-indigo: #6366f1;
  --color-ai-indigo-soft: #eef0ff;

  /* ---- Border radius ---- */
  --radius-sm: 0.25rem;
  --radius-DEFAULT: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* ---- Spacing (4px base rhythm) ---- */
  --spacing-base: 4px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  --spacing-section: 64px;
  --spacing-gutter: 24px;
  --spacing-margin-mobile: 16px;
  --spacing-margin-desktop: 40px;

  /* ---- Typography ---- */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --text-display-lg: 48px;
  --text-display-lg--line-height: 56px;
  --text-display-lg--font-weight: 700;
  --text-display-lg--letter-spacing: -0.02em;

  --text-headline-lg: 32px;
  --text-headline-lg--line-height: 40px;
  --text-headline-lg--font-weight: 600;
  --text-headline-lg--letter-spacing: -0.01em;

  --text-headline-lg-mobile: 24px;
  --text-headline-lg-mobile--line-height: 32px;
  --text-headline-lg-mobile--font-weight: 600;

  --text-headline-md: 24px;
  --text-headline-md--line-height: 32px;
  --text-headline-md--font-weight: 600;

  --text-body-lg: 18px;
  --text-body-lg--line-height: 28px;
  --text-body-lg--font-weight: 400;

  --text-body-md: 16px;
  --text-body-md--line-height: 24px;
  --text-body-md--font-weight: 400;

  --text-body-sm: 14px;
  --text-body-sm--line-height: 20px;
  --text-body-sm--font-weight: 400;

  --text-label-md: 12px;
  --text-label-md--line-height: 16px;
  --text-label-md--font-weight: 600;
  --text-label-md--letter-spacing: 0.05em;

  --text-label-sm: 11px;
  --text-label-sm--line-height: 14px;
  --text-label-sm--font-weight: 500;

  /* ---- Elevation (soft ambient shadows) ---- */
  --shadow-level-1: 0 4px 15px 0 rgb(26 27 34 / 0.04);
  --shadow-level-2: 0 10px 30px 0 rgb(26 27 34 / 0.08);
}

/* Mobile type scale: display/headline-lg scale down ~25% below 768px */
@media (max-width: 767px) {
  :root {
    --text-display-lg: 36px;
    --text-display-lg--line-height: 44px;
  }
}
