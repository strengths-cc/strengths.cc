'use client';

import React, { useState, useEffect } from 'react';

interface PublicCoachProfile {
  id?: string;
  name: string;
  title: string;
  specialty: 'Sales Teams' | 'Executive & HR' | 'Enterprise';
  location: string;
  languages: string[];
  headshot: string;
  calendarUrl: string;
  bio: string;
  top5: string[];
  status?: 'approved' | 'pending';
}

const DEFAULT_COACHES: PublicCoachProfile[] = [
  {
    id: 'seed-1',
    name: 'Elena Rostova',
    title: 'Gallup Certified Strengths Coach • B2B Revenue Specialist',
    specialty: 'Sales Teams',
    location: 'New York, NY / Remote',
    languages: ['English', 'Spanish'],
    headshot: 'https://placehold.co/160x160/065f46/ffffff?text=ER',
    calendarUrl: 'https://calendly.com',
    bio: 'Former VP of Enterprise Sales helping SaaS revenue teams map CliftonStrengths to discovery, negotiation, and quota attainment.',
    top5: ['Strategic', 'Achiever', 'Maximizer', 'Relator', 'Command'],
    status: 'approved',
  },
  {
    id: 'seed-2',
    name: 'Marcus Vance',
    title: 'Gallup Certified Strengths Coach • Executive & People Strategy',
    specialty: 'Executive & HR',
    location: 'Chicago, IL / Remote',
    languages: ['English'],
    headshot: 'https://placehold.co/160x160/0f172a/ffffff?text=MV',
    calendarUrl: 'https://calendly.com',
    bio: 'Partners with CHROs and newly promoted managers to turn annual engagement feedback into high-trust 1:1 coaching habits.',
    top5: ['Individualization', 'Developer', 'Connectedness', 'Empathy', 'Arranger'],
    status: 'approved',
  },
  {
    id: 'seed-3',
    name: 'Simone Alvarez',
    title: 'Gallup Certified Strengths Coach • Post-Merger & Enterprise Scale',
    specialty: 'Enterprise',
    location: 'Austin, TX / Global',
    languages: ['English', 'Portuguese', 'Spanish'],
    headshot: 'https://placehold.co/160x160/047857/ffffff?text=SA',
    calendarUrl: 'https://calendly.com',
    bio: 'Aligns cross-functional engineering, product, and GTM leadership teams across Fortune 500 and high-growth Series C+ organizations.',
    top5: ['Analytical', 'Harmony', 'Focus', 'Ideation', 'Responsibility'],
    status: 'approved',
  },
];

type SalesStageKey = 'prospecting' | 'negotiation' | 'closing';

const SALES_STAGES: { key: SalesStageKey; num: string; title: string }[] = [
  { key: 'prospecting', num: '01', title: 'Prospecting & Outreach' },
  { key: 'negotiation', num: '02', title: 'Discovery & Scoping' },
  { key: 'closing', num: '03', title: 'Closing & Expansion' },
];

const SALES_PLAYS: Record<
  SalesStageKey,
  {
    stepTitle: string;
    maya: { label: string; play: string };
    liam: { label: string; play: string };
    chloe: { label: string; play: string };
  }
> = {
  prospecting: {
    stepTitle: 'Step 1 of 3 — Prospecting & Outreach',
    maya: {
      label: 'How Maya prospects',
      play: 'Researches account benchmarks and sends a custom industry insight brief that earns executive replies.',
    },
    liam: {
      label: 'How Liam prospects',
      play: 'Activates warm network referrals and crafts personalized outreach that feels like a trusted peer check-in.',
    },
    chloe: {
      label: 'How Chloe prospects',
      play: 'Turns cold calls and live events into instant rapport, booking first meetings within minutes of outreach.',
    },
  },
  negotiation: {
    stepTitle: 'Step 2 of 3 — Discovery & Scoping',
    maya: {
      label: 'How Maya runs discovery',
      play: 'Diagnoses operational bottlenecks with precision data and quantifies the cost of inaction for CFO sign-off.',
    },
    liam: {
      label: 'How Liam runs discovery',
      play: 'Creates psychological safety across stakeholders so buyers openly share internal politics and real priorities.',
    },
    chloe: {
      label: 'How Chloe runs discovery',
      play: 'Guides fast-paced working sessions that map quick wins and move straight into a live pilot scope.',
    },
  },
  closing: {
    stepTitle: 'Step 3 of 3 — Closing & Expansion',
    maya: {
      label: 'How Maya closes & expands',
      play: 'Delivers a phased rollout roadmap that makes executive sign-off and multi-year expansion obvious.',
    },
    liam: {
      label: 'How Liam closes & expands',
      play: 'Deepens post-sale trust across departments, driving organic referrals and account growth.',
    },
    chloe: {
      label: 'How Chloe closes & expands',
      play: 'Creates urgency around launch timelines and rallies stakeholders to sign before quarter-end.',
    },
  },
};

type HrStageKey = 'coaching' | 'alignment' | 'retention';

const HR_STAGES: { key: HrStageKey; num: string; title: string }[] = [
  { key: 'coaching', num: '01', title: '1:1 Coaching & Feedback' },
  { key: 'alignment', num: '02', title: 'Cross-Team Alignment' },
  { key: 'retention', num: '03', title: 'Onboarding & Retention' },
];

const HR_PLAYS: Record<
  HrStageKey,
  {
    stepTitle: string;
    jordan: { label: string; play: string };
    priya: { label: string; play: string };
    david: { label: string; play: string };
  }
> = {
  coaching: {
    stepTitle: 'Step 1 of 3 — 1:1 Coaching & Feedback',
    jordan: {
      label: 'How Jordan leads 1:1s',
      play: 'Spots subtle growth signals in each direct report and tailors stretch assignments to their natural motivators.',
    },
    priya: {
      label: 'How Priya leads 1:1s',
      play: 'Clears distractions, sets crisp weekly milestones, and helps teammates experience daily momentum.',
    },
    david: {
      label: 'How David leads 1:1s',
      play: 'Connects individual daily tasks to the broader company mission and resolves interpersonal tension early.',
    },
  },
  alignment: {
    stepTitle: 'Step 2 of 3 — Cross-Team Alignment',
    jordan: {
      label: 'How Jordan aligns teams',
      play: 'Pairs complementary teammates across Product and Ops so each person owns the phase that fits their strengths.',
    },
    priya: {
      label: 'How Priya aligns teams',
      play: 'Translates cross-departmental brainstorming into concrete deliverables with clear owners and deadlines.',
    },
    david: {
      label: 'How David aligns teams',
      play: 'Facilitates shared working agreements that turn friction between fast movers and risk planners into mutual respect.',
    },
  },
  retention: {
    stepTitle: 'Step 3 of 3 — Onboarding & Retention',
    jordan: {
      label: 'How Jordan retains talent',
      play: 'Builds custom 90-day ramp plans around each new hire’s Top 5 strengths instead of a generic checklist.',
    },
    priya: {
      label: 'How Priya retains talent',
      play: 'Protects high performers from meeting overload so they can execute deeply and hit meaningful goals.',
    },
    david: {
      label: 'How David retains talent',
      play: 'Anchors new hires into peer networks quickly, preventing post-reorg isolation and regrettable turnover.',
    },
  },
};

type ActiveTab = 'home' | 'sales' | 'hr' | 'directory' | 'coaches' | 'apply';

const STORAGE_KEY_COACHES = 'strengths_cc_custom_coaches_v1';
const STORAGE_KEY_PRIVATE_APPS = 'strengths_cc_private_applications_v1';
const STORAGE_KEY_INQUIRIES = 'strengths_cc_inquiries_v1';

export default function Page() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [directoryFilter, setDirectoryFilter] = useState<string>('All');
  const [salesStage, setSalesStage] = useState<SalesStageKey>('prospecting');
  const [hrStage, setHrStage] = useState<HrStageKey>('coaching');
  const [coaches, setCoaches] = useState<PublicCoachProfile[]>(DEFAULT_COACHES);
  const [inquiryCoach, setInquiryCoach] = useState<PublicCoachProfile | null>(null);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);

  const [appName, setAppName] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appTitle, setAppTitle] = useState('');
  const [appSpecialty, setAppSpecialty] = useState<'Sales Teams' | 'Executive & HR' | 'Enterprise'>('Sales Teams');
  const [appLocation, setAppLocation] = useState('');
  const [appLanguages, setAppLanguages] = useState('');
  const [appCalendarUrl, setAppCalendarUrl] = useState('');
  const [appTop5, setAppTop5] = useState('');
  const [appPrivateFee, setAppPrivateFee] = useState('');
  const [appBio, setAppBio] = useState('');
  const [appHeadshotUrl, setAppHeadshotUrl] = useState('');
  const [appSubmitting, setAppSubmitting] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_COACHES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCoaches([...parsed, ...DEFAULT_COACHES]);
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const navigateTo = (tab: ActiveTab, filter?: string) => {
    if (filter) setDirectoryFilter(filter);
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppSubmitting(true);
    setStatusNotice(null);

    const parsedLanguages = appLanguages.split(',').map((l) => l.trim()).filter(Boolean);
    const parsedTop5 = appTop5.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5);
    const initials = appName.split(' ').map((n) => n[0]).join('').toUpperCase() || 'CC';
    const resolvedHeadshot =
      appHeadshotUrl.trim() ||
      `https://placehold.co/160x160/047857/ffffff?text=${encodeURIComponent(initials)}`;

    const publicProfilePayload: PublicCoachProfile = {
      id: `coach-${Date.now()}`,
      name: appName.trim(),
      title: appTitle.trim(),
      specialty: appSpecialty,
      location: appLocation.trim(),
      languages: parsedLanguages.length ? parsedLanguages : ['English'],
      headshot: resolvedHeadshot,
      calendarUrl: appCalendarUrl.trim(),
      bio: appBio.trim(),
      top5: parsedTop5.length ? parsedTop5 : ['Strategic', 'Achiever'],
      status: 'approved',
    };

    try {
      const existingPublicRaw = window.localStorage.getItem(STORAGE_KEY_COACHES);
      const existingPublic: PublicCoachProfile[] = existingPublicRaw ? JSON.parse(existingPublicRaw) : [];
      const updatedPublic = [publicProfilePayload, ...existingPublic];
      window.localStorage.setItem(STORAGE_KEY_COACHES, JSON.stringify(updatedPublic));

      const existingPrivateRaw = window.localStorage.getItem(STORAGE_KEY_PRIVATE_APPS);
      const existingPrivate = existingPrivateRaw ? JSON.parse(existingPrivateRaw) : [];
      window.localStorage.setItem(
        STORAGE_KEY_PRIVATE_APPS,
        JSON.stringify([
          {
            ...publicProfilePayload,
            contactEmail: appEmail.trim(),
            privateEngagementFee: appPrivateFee.trim(),
            submittedAt: new Date().toISOString(),
          },
          ...existingPrivate,
        ])
      );

      setCoaches([...updatedPublic, ...DEFAULT_COACHES]);
      setAppSubmitted(true);
    } catch {
      setCoaches((prev) => [publicProfilePayload, ...prev]);
      setAppSubmitted(true);
    } finally {
      setAppSubmitting(false);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryCoach) return;
    setInquirySubmitting(true);

    try {
      const existingRaw = window.localStorage.getItem(STORAGE_KEY_INQUIRIES);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      window.localStorage.setItem(
        STORAGE_KEY_INQUIRIES,
        JSON.stringify([
          {
            coachId: inquiryCoach.id || inquiryCoach.name,
            coachName: inquiryCoach.name,
            buyerEmail: inquiryEmail.trim(),
            message: inquiryMessage.trim(),
            createdAt: new Date().toISOString(),
          },
          ...existing,
        ])
      );
    } catch {
      // Ignore storage write errors
    } finally {
      setInquirySubmitting(false);
      setInquirySent(true);
    }
  };

  const filteredCoaches =
    directoryFilter === 'All'
      ? coaches
      : coaches.filter((c) => c.specialty === directoryFilter);

  const currentSalesIndex = SALES_STAGES.findIndex((s) => s.key === salesStage);
  const currentHrIndex = HR_STAGES.findIndex((s) => s.key === hrStage);
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans antialiased">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center text-left"
          >
            <span className="font-serif text-2xl font-extrabold tracking-tight text-slate-900">
              STRENGTHS<span className="text-emerald-700">.cc</span>
            </span>
          </button>

          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => navigateTo('sales')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                activeTab === 'sales'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>Revenue Officers &amp; Sales Leaders</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('hr')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                activeTab === 'hr'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>Managers &amp; HR Executives</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('directory')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                activeTab === 'directory'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>Find a Coach</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo('coaches')}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-800"
            >
              <span>For Gallup Coaches</span>
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'home' && (
        <main className="mx-auto max-w-6xl px-6 py-20">
          <section className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              <span>Evidence-Based Organizational Performance</span>
            </div>
            <h1 className="mx-auto mt-8 font-serif text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Stop fixing weaknesses.{' '}
              <span className="underline decoration-emerald-500 decoration-4 underline-offset-8">
                Scale what your people naturally do best.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-700">
              Traditional corporate training forces every employee into the same rigid mold—and wastes millions in lost productivity and turnover. Strengths-based development aligns daily execution with innate human talent, guided by verified{' '}
              <strong className="font-extrabold text-slate-900">
                Gallup Certified Strengths Coaches
              </strong>
              .
            </p>
          </section>

          <section className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-sm transition hover:border-slate-900 hover:shadow-md sm:p-10">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-extrabold text-slate-800">
                    For CROs, VPs of Sales &amp; Enablement
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900">
                    +19% Sales Lift
                  </span>
                </div>
                <h2 className="mt-5 font-serif text-3xl font-extrabold tracking-tight text-slate-900">
                  Revenue Officers &amp; Sales Leaders
                </h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                  Rigid talk tracks and one-size-fits-all playbooks stall quota attainment. Discover how strengths-based sales coaching helps every sales rep win deals using their natural selling DNA—accelerating ramp time and retaining top performers.
                </p>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm font-medium text-slate-800">
                  <li className="flex items-start gap-2.5">
                    <span className="font-extrabold text-emerald-700">&#10003;</span>
                    <span>Replace generic scripts with theme-aligned deal execution</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-extrabold text-emerald-700">&#10003;</span>
                    <span>Cut new-hire ramp time and raise pipeline conversion</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-extrabold text-emerald-700">&#10003;</span>
                    <span>Reduce costly sales floor attrition by up to 72%</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('sales')}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-sm font-extrabold text-white transition hover:bg-slate-800"
              >
                <span>Explore Strengths for Sales Teams &rarr;</span>
              </button>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-700 hover:shadow-md sm:p-10">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-extrabold text-emerald-900">
                    For CHROs, People Ops &amp; Department Heads
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900">
                    +29% Profit Lift
                  </span>
                </div>
                <h2 className="mt-5 font-serif text-3xl font-extrabold tracking-tight text-slate-900">
                  Managers &amp; HR Executives
                </h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                  Annual engagement surveys don&apos;t fix manager burnout or cross-functional friction. Equip frontline managers and leadership teams with a shared CliftonStrengths operating language that drives accountability and retention.
                </p>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm font-medium text-slate-800">
                  <li className="flex items-start gap-2.5">
                    <span className="font-extrabold text-emerald-700">&#10003;</span>
                    <span>Turn overwhelmed managers into high-trust talent multipliers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-extrabold text-emerald-700">&#10003;</span>
                    <span>Eliminate team silos during rapid growth or reorgs</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-extrabold text-emerald-700">&#10003;</span>
                    <span>Deploy high-impact offsites and leadership workshops</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('hr')}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-4 text-sm font-extrabold text-white transition hover:bg-emerald-800"
              >
                <span>Explore Strengths for HR &amp; Managers &rarr;</span>
              </button>
            </div>
          </section>

          <section className="mt-20 rounded-3xl bg-slate-900 p-8 text-white shadow-xl sm:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                  Gallup CliftonStrengths Meta-Analysis Benchmarks
                </p>
                <h2 className="mt-1 font-serif text-2xl font-extrabold text-white sm:text-3xl">
                  Measured Enterprise Impact of Strengths-Based Development
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('directory', 'All')}
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-emerald-500"
              >
                Browse Verified Coaches &rarr;
              </button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-6">
                <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                  Revenue Growth
                </span>
                <p className="mt-5 font-serif text-5xl font-extrabold tracking-tight text-emerald-400 sm:text-6xl">
                  +19%
                </p>
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-[76%] rounded-full bg-emerald-400" />
                </div>
                <p className="mt-4 text-base font-extrabold text-white">Higher Sales Revenue</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Outperformance across sales teams receiving strengths-based coaching vs. control groups.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-6">
                <span className="rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  Bottom-Line Margin
                </span>
                <p className="mt-5 font-serif text-5xl font-extrabold tracking-tight text-amber-400 sm:text-6xl">
                  +29%
                </p>
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-[86%] rounded-full bg-amber-400" />
                </div>
                <p className="mt-4 text-base font-extrabold text-white">Increased Profit</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Driven by stronger manager execution, faster ramp times, and role-to-talent alignment.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-6">
                <span className="rounded-lg bg-sky-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-sky-300">
                  Talent Retention
                </span>
                <p className="mt-5 font-serif text-5xl font-extrabold tracking-tight text-sky-400 sm:text-6xl">
                  -72%
                </p>
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-[92%] rounded-full bg-sky-400" />
                </div>
                <p className="mt-4 text-base font-extrabold text-white">Lower Employee Turnover</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Dramatic reduction in regrettable attrition when managers lead around employee strengths.
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {activeTab === 'sales' && (
        <main className="mx-auto max-w-6xl px-6 py-20">
          <section className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              <span>For Chief Revenue Officers, VPs of Sales &amp; Enablement Leaders</span>
            </div>
            <h1 className="mx-auto mt-8 font-serif text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Strengths-based sales development drives{' '}
              <span className="underline decoration-emerald-500 decoration-4 underline-offset-8">
                19% higher sales revenue.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-700">
              Most sales enablement programs fail because they force analytical, relationship-led, and competitive sales reps to sell the exact same way. Deploy Gallup Certified Strengths Coaches to turn each sales rep&apos;s natural talent into repeatable pipeline and closed revenue.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigateTo('directory', 'Sales Teams')}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-800"
              >
                <span>Find a Sales Strengths Coach &rarr;</span>
              </button>
            </div>
          </section>

          <section className="mt-20 rounded-3xl bg-slate-900 p-8 text-white shadow-xl sm:p-12">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                <span>Talent-Led Selling in Action</span>
              </div>
              <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Three distinct selling styles—one winning quota
              </h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300">
                See how a Gallup Certified Strengths Coach tailors execution around each sales rep&apos;s top two CliftonStrengths themes instead of forcing a single script.
              </p>

              <div className="mt-4 grid gap-2.5 rounded-2xl border border-slate-700/90 bg-slate-950/70 p-2 sm:grid-cols-3">
                {SALES_STAGES.map((stage) => {
                  const isActive = salesStage === stage.key;
                  return (
                    <button
                      key={stage.key}
                      type="button"
                      onClick={() => setSalesStage(stage.key)}
                      className={`group flex cursor-pointer items-center justify-between gap-2 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/70'
                          : 'border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-extrabold">
                          {stage.num}
                        </span>
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                          {stage.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-extrabold text-emerald-300">
                        {isActive ? 'Active' : 'Select →'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-800/70 p-7">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Maya — Enterprise Sales Rep</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-extrabold text-emerald-300">Strategic</span>
                    <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-extrabold text-emerald-300">Analytical</span>
                  </div>
                  <div className="mt-5 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                      {SALES_PLAYS[salesStage].maya.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      {SALES_PLAYS[salesStage].maya.play}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-800/70 p-7">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Liam — Relationship Sales Rep</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-sky-500/20 px-2.5 py-1 text-xs font-extrabold text-sky-300">Relator</span>
                    <span className="rounded-md bg-sky-500/20 px-2.5 py-1 text-xs font-extrabold text-sky-300">Empathy</span>
                  </div>
                  <div className="mt-5 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400">
                      {SALES_PLAYS[salesStage].liam.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      {SALES_PLAYS[salesStage].liam.play}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-800/70 p-7">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Chloe — Outbound Sales Rep</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-extrabold text-amber-300">Woo</span>
                    <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-extrabold text-amber-300">Activator</span>
                  </div>
                  <div className="mt-5 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                      {SALES_PLAYS[salesStage].chloe.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      {SALES_PLAYS[salesStage].chloe.play}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-3.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Currently viewing: <span className="text-emerald-400">{SALES_PLAYS[salesStage].stepTitle}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSalesStage(
                      SALES_STAGES[(currentSalesIndex - 1 + SALES_STAGES.length) % SALES_STAGES.length].key
                    )
                  }
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-extrabold text-slate-200 hover:bg-slate-700"
                >
                  &larr; Previous Stage
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSalesStage(SALES_STAGES[(currentSalesIndex + 1) % SALES_STAGES.length].key)
                  }
                  className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-500"
                >
                  Next Stage &rarr;
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {activeTab === 'hr' && (
        <main className="mx-auto max-w-6xl px-6 py-20">
          <section className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              <span>For CHROs, VPs of People, L&amp;D Leaders &amp; Department Heads</span>
            </div>
            <h1 className="mx-auto mt-8 font-serif text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Build high-engagement teams grounded in{' '}
              <span className="underline decoration-emerald-500 decoration-4 underline-offset-8">
                verified Gallup coaches.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-700">
              70% of the variance in team engagement comes down to the manager. Partner directly with accredited Gallup Certified Strengths Coaches to upskill frontline leaders, resolve cross-functional friction, and retain top talent.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigateTo('directory', 'Executive & HR')}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-800"
              >
                <span>Browse Executive &amp; HR Coaches &rarr;</span>
              </button>
            </div>
          </section>

          <section className="mt-20 rounded-3xl bg-slate-900 p-8 text-white shadow-xl sm:p-12">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Three leadership styles—one high-trust culture
              </h2>
              <div className="mt-6 grid gap-2.5 rounded-2xl border border-slate-700/90 bg-slate-950/70 p-2 sm:grid-cols-3">
                {HR_STAGES.map((stage) => {
                  const isActive = hrStage === stage.key;
                  return (
                    <button
                      key={stage.key}
                      type="button"
                      onClick={() => setHrStage(stage.key)}
                      className={`group flex cursor-pointer items-center justify-between gap-2 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/70'
                          : 'border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-extrabold uppercase tracking-wider">
                        {stage.num}. {stage.title}
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-300">
                        {isActive ? 'Active' : 'Select →'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-7">
                <h3 className="text-lg font-extrabold text-white">Jordan — People Manager</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-extrabold text-emerald-300">Individualization</span>
                  <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-extrabold text-emerald-300">Developer</span>
                </div>
                <div className="mt-5 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                    {HR_PLAYS[hrStage].jordan.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {HR_PLAYS[hrStage].jordan.play}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-7">
                <h3 className="text-lg font-extrabold text-white">Priya — Operations Director</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-sky-500/20 px-2.5 py-1 text-xs font-extrabold text-sky-300">Achiever</span>
                  <span className="rounded-md bg-sky-500/20 px-2.5 py-1 text-xs font-extrabold text-sky-300">Focus</span>
                </div>
                <div className="mt-5 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400">
                    {HR_PLAYS[hrStage].priya.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {HR_PLAYS[hrStage].priya.play}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-7">
                <h3 className="text-lg font-extrabold text-white">David — VP of Product</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-extrabold text-amber-300">Harmony</span>
                  <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-extrabold text-amber-300">Connectedness</span>
                </div>
                <div className="mt-5 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                    {HR_PLAYS[hrStage].david.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {HR_PLAYS[hrStage].david.play}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-3.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Currently viewing: <span className="text-emerald-400">{HR_PLAYS[hrStage].stepTitle}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setHrStage(HR_STAGES[(currentHrIndex - 1 + HR_STAGES.length) % HR_STAGES.length].key)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-extrabold text-slate-200 hover:bg-slate-700"
                >
                  &larr; Previous Scenario
                </button>
                <button
                  type="button"
                  onClick={() => setHrStage(HR_STAGES[(currentHrIndex + 1) % HR_STAGES.length].key)}
                  className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-500"
                >
                  Next Scenario &rarr;
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {activeTab === 'directory' && (
        <main className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-8">
            <div>
              <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Gallup Certified Strengths Coaches
              </h1>
              <p className="mt-2 font-medium text-slate-600">
                Direct access to vetted coaches—book an intro call directly or send a message with zero agency markups.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Sales Teams', 'Executive & HR', 'Enterprise'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDirectoryFilter(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    directoryFilter === cat
                      ? 'bg-emerald-700 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {filteredCoaches.map((coach, idx) => (
              <div
                key={coach.id || idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800">
                      {coach.specialty}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      <span>{coach.languages.join(', ')}</span>
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3.5">
                    <img
                      src={coach.headshot}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://placehold.co/160x160/047857/ffffff?text=Coach';
                      }}
                      alt={coach.name}
                      className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-emerald-600/20"
                    />
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">{coach.name}</h2>
                      <p className="text-xs font-bold text-emerald-700">{coach.title}</p>
                      <p className="mt-0.5 text-xs font-medium text-slate-500">{coach.location}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{coach.bio}</p>
                  <div className="mt-5">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Top 5 CliftonStrengths
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {coach.top5.map((theme) => (
                        <span
                          key={theme}
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <a
                    href={coach.calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-3 text-xs font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    <span>Book Intro Call</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setInquiryCoach(coach);
                      setInquirySent(false);
                      setInquiryEmail('');
                      setInquiryMessage('');
                    }}
                    className="rounded-xl bg-slate-900 py-3 text-xs font-extrabold text-white transition hover:bg-slate-800"
                  >
                    Message {coach.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {activeTab === 'coaches' && (
        <main className="mx-auto max-w-6xl px-6 py-16">
          <section className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              <span>Credential-Verified Corporate Directory</span>
            </div>
            <h1 className="mx-auto mt-6 font-serif text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Stand apart from generalist directories as a verified{' '}
              <span className="underline decoration-emerald-500 decoration-4 underline-offset-8">
                Gallup Certified Strengths Coach.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-700">
              General coaching platforms bury certified practitioners next to unvetted life coaches—while brokerages take 30%–50% of your fee. Strengths.cc verifies your Gallup credential and connects you directly with CROs, VPs of Sales, and HR leaders investing in team development.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setAppSubmitted(false);
                  navigateTo('apply');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-8 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <span>Apply to Join the Directory — $149/year &rarr;</span>
              </button>
            </div>
          </section>

          <section className="mt-20 rounded-3xl bg-slate-900 p-8 text-white shadow-xl sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                  <span>Asymmetric Practice ROI</span>
                </span>
                <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  One corporate client covers your $149 annual listing 30x to 150x over—and you keep 100% of the engagement.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  A single corporate CliftonStrengths team workshop or multi-month sales enablement engagement typically bills between{' '}
                  <strong className="font-extrabold text-white">$5,000 and $25,000+</strong>. Because Strengths.cc charges zero referral fees and takes zero commission, every dollar from your client contract—and every follow-on leadership retainer—stays in your practice.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/80 p-6 lg:col-span-5">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-slate-900/80 p-5">
                    <p className="font-serif text-3xl font-extrabold text-emerald-400">100%</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Fees Kept By You
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 p-5">
                    <p className="font-serif text-3xl font-extrabold text-amber-400">0%</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Platform Commission
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24">
            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                Built for Serious Practitioners
              </p>
              <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Why Gallup Certified Strengths Coaches choose Strengths.cc
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800">
                  Targeted B2B Marketing Engine
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                  Targeted Marketing Engine Driving Pre-Educated Buyers
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Strengths.cc runs a dedicated B2B marketing engine targeting Chief Revenue Officers, VPs of Sales, and HR executives—bringing pre-educated corporate decision-makers directly to your profile so your discovery calls focus on scoping outcomes rather than pitching CliftonStrengths.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800">
                  Pre-Educated B2B Buyers
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                  Skip the &ldquo;Why CliftonStrengths?&rdquo; Pitch
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Decision-makers visiting Strengths.cc are already convinced by Gallup&apos;s meta-analysis findings (19% higher sales revenue, 29% higher profit, 72% lower turnover). Your discovery calls focus on scoping team outcomes, not defending the assessment.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800">
                  Direct Client Ownership
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                  Own the Relationship &amp; Renewals
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Unlike coaching marketplaces that restrict client communication and skim 30%–50% off every invoice, buyer inquiries route straight to you. You scope, contract, and expand accounts directly under your own brand.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800">
                  Specialty &amp; Top 5 Filtering
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                  Matched by Corporate Outcome
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Buyers filter directly by <strong>Sales Teams</strong>, <strong>Executive &amp; HR</strong>, or <strong>Enterprise</strong>, alongside your Top 5 CliftonStrengths themes, languages spoken, and direct calendar booking link.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-24">
            <div className="mx-auto max-w-xl rounded-3xl border-2 border-emerald-700 bg-white p-8 shadow-md sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800">
                  Annual Directory Membership
                </span>
                <span className="text-xs font-extrabold text-emerald-700">
                  0% Commission &bull; Keep 100% of Fees
                </span>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-serif text-5xl font-extrabold text-slate-900">$149</span>
                <span className="text-sm font-bold text-slate-500">/ year</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-extrabold text-slate-900">
                Verified Gallup Certified Strengths Coach Listing
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Full-year visibility in front of corporate sales and HR leaders—paid for many times over by a single team workshop or leadership engagement.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAppSubmitted(false);
                  navigateTo('apply');
                }}
                className="mt-8 block w-full rounded-xl bg-emerald-700 py-4 text-center text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Apply for Annual Directory ($149/yr) &rarr;
              </button>
            </div>
          </section>

          <section className="mt-20 rounded-2xl border border-slate-200 bg-slate-100/80 p-6 text-xs leading-relaxed text-slate-600">
            <p className="font-extrabold uppercase tracking-wider text-slate-800">
              Independent Directory Disclosure
            </p>
            <p className="mt-2">
              strengths.cc is an independent, practitioner-led directory and is not affiliated with, endorsed by, or sponsored by Gallup, Inc. Gallup&reg;, CliftonStrengths&reg;, and each of the 34 CliftonStrengths theme names are trademarks of Gallup, Inc. Coaches listed on strengths.cc independently hold Gallup Certified Strengths Coach credentials.
            </p>
          </section>
        </main>
      )}

      {activeTab === 'apply' && (
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="border-b border-slate-200 pb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              <span>Gallup Certified Practitioner Onboarding</span>
            </span>
            <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Coach Directory Application
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-600">
              Complete your public directory profile and private vetting details. Your engagement fee is used solely for internal qualification and is{' '}
              <strong className="font-extrabold text-slate-900">never displayed</strong> on your public listing.
            </p>
          </div>

          {statusNotice && (
            <div className="mt-6 rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs font-bold text-rose-800">
              {statusNotice}
            </div>
          )}

          {!appSubmitted ? (
            <form
              onSubmit={handleApplicationSubmit}
              className="mt-10 space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
            >
              <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 sm:flex-row sm:items-center">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-600/30 bg-slate-100">
