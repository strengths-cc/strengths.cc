'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const FORMSPREE_URL = 'https://formspree.io/f/mqpqbnpn';
const ANNUAL_STRIPE_URL = 'https://buy.stripe.com/cNi7sL4jd7Zq9z03ZOdQQ02';

type Tab = 'home' | 'sales' | 'hr' | 'directory' | 'coaches';

interface Coach {
  id: string;
  name: string;
  title: string;
  location: string;
  specialty: 'Sales Teams' | 'Executive & HR' | 'Enterprise';
  top5: string[];
  bio: string;
  rate: string;
}

const SAMPLE_COACHES: Coach[] = [
  {
    id: 'sample-1',
    name: 'Elena Rostova',
    title: 'Gallup Certified Strengths Coach',
    location: 'Seattle, WA (Remote & On-site)',
    specialty: 'Sales Teams',
    top5: ['Achiever', 'Strategic', 'Competition', 'Maximizer', 'Relator'],
    bio: '12+ years helping B2B revenue teams replace rigid scripts with talent-led selling.',
    rate: '$250 / session',
  },
  {
    id: 'sample-2',
    name: 'Marcus Vance',
    title: 'Gallup Certified Strengths Coach',
    location: 'Austin, TX (Remote & On-site)',
    specialty: 'Executive & HR',
    top5: ['Learner', 'Individualization', 'Developer', 'Connectedness', 'Arranger'],
    bio: 'Specializes in manager enablement, high-retention onboarding, and culture transformation.',
    rate: '$300 / session',
  },
  {
    id: 'sample-3',
    name: 'Sarah Jenkins',
    title: 'Gallup Certified Strengths Coach',
    location: 'New York, NY (Remote & On-site)',
    specialty: 'Enterprise',
    top5: ['Activator', 'Command', 'Focus', 'Significance', 'Woo'],
    bio: 'Former VP of Sales coaching enterprise account executives to exceed quota consistently.',
    rate: '$350 / session',
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [filter, setFilter] = useState<string>('All');
  const [coaches, setCoaches] = useState<Coach[]>(SAMPLE_COACHES);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerGoals, setBuyerGoals] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    async function loadApprovedCoaches() {
      const { data, error } = await supabase
        .from('coaches')
        .select('id, name, title, location, specialty, top5, bio, rate')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCoaches(data as Coach[]);
      }
    }

    loadApprovedCoaches();
  }, []);

  const filteredCoaches =
    filter === 'All' ? coaches : coaches.filter((c) => c.specialty === filter);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach || sendingInquiry) return;

    setSendingInquiry(true);
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          submissionType: 'Corporate Buyer Coach Inquiry',
          requestedCoach: selectedCoach.name,
          coachSpecialty: selectedCoach.specialty,
          buyerEmail,
          teamGoals: buyerGoals,
        }),
      });

      if (response.ok) {
        setInquirySent(true);
        setBuyerEmail('');
        setBuyerGoals('');
      }
    } finally {
      setSendingInquiry(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans antialiased">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 font-serif text-lg font-bold text-white">
              s
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight text-slate-900">
              strengths.cc
            </span>
          </button>

          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('sales')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'sales'
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue Officers &amp; Sales Leaders
            </button>
            <button
              onClick={() => setActiveTab('hr')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'hr'
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Managers &amp; HR Executives
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'directory'
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Find a Coach
            </button>
          </nav>

          <button
            onClick={() => setActiveTab('coaches')}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-emerald-800"
          >
            <span>For Gallup Coaches</span>
          </button>
        </div>
      </header>

      {/* BOLD HOME PAGE */}
      {activeTab === 'home' && (
        <main className="mx-auto max-w-6xl px-6 py-20">
          <section className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800">
              <span>Evidence-Based Organizational Performance</span>
            </div>

            <h1 className="mx-auto mt-8 font-serif text-4xl leading-tight font-normal tracking-tight text-slate-900 sm:text-6xl">
              Stop fixing weaknesses.{' '}
              <span className="underline decoration-emerald-400 decoration-2 underline-offset-8">
                Scale what your people naturally do best.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Traditional corporate training forces every employee into the same rigid mold—and
              wastes millions in lost productivity and turnover. Strengths-based development
              aligns daily execution with innate human talent, guided by verified{' '}
              <strong className="font-semibold text-slate-900">
                Gallup Certified Strengths Coaches
              </strong>
              .
            </p>
          </section>

          {/* Two Core Pathways: Sales vs. HR */}
          <section className="mt-16 grid gap-8 md:grid-cols-2">
            {/* Pathway 1: Revenue & Sales Leaders */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs transition hover:border-emerald-600/60 hover:shadow-md sm:p-10">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    For CROs, VPs of Sales &amp; Enablement
                  </span>
                  <span className="text-xs font-bold text-emerald-700">+19% Sales Lift</span>
                </div>

                <h2 className="mt-5 font-serif text-3xl font-normal text-slate-900">
                  Revenue Officers &amp; Sales Leaders
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Rigid talk tracks and one-size-fits-all playbooks stall quota attainment. Discover
                  how strengths-based sales coaching helps every rep win deals using their natural
                  selling DNA—accelerating ramp time and retaining top performers.
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-6 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-emerald-700">&#10003;</span>
                    <span>Replace generic scripts with theme-aligned deal execution</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-emerald-700">&#10003;</span>
                    <span>Cut new-hire AE ramp time and raise pipeline conversion</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-emerald-700">&#10003;</span>
                    <span>Reduce costly sales floor attrition by up to 72%</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveTab('sales')}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <span>Explore Strengths for Sales Teams</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>

            {/* Pathway 2: Managers & HR Executives */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs transition hover:border-emerald-600/60 hover:shadow-md sm:p-10">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    For CHROs, People Ops &amp; Department Heads
                  </span>
                  <span className="text-xs font-bold text-emerald-700">+29% Profit Lift</span>
                </div>

                <h2 className="mt-5 font-serif text-3xl font-normal text-slate-900">
                  Managers &amp; HR Executives
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Annual engagement surveys don&apos;t fix manager burnout or cross-functional
                  friction. Equip frontline managers and leadership teams with a shared
                  CliftonStrengths operating language that drives accountability and retention.
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-6 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-emerald-700">&#10003;</span>
                    <span>Turn overwhelmed managers into high-trust talent multipliers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-emerald-700">&#10003;</span>
                    <span>Eliminate team silos during rapid growth or reorgs</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-emerald-700">&#10003;</span>
                    <span>Deploy high-impact offsites and leadership workshops</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveTab('hr')}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                <span>Explore Strengths for HR &amp; Managers</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </section>

          {/* Gallup Meta-Analysis Proof Bar */}
          <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs sm:p-10">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
              Gallup CliftonStrengths Global Meta-Analysis Benchmarks
            </p>
            <div className="mt-8 grid gap-8 text-center sm:grid-cols-3">
              <div>
                <p className="font-serif text-4xl font-normal text-slate-900 sm:text-5xl">19%</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Higher Sales Revenue</p>
                <p className="mt-1 text-xs text-slate-500">
                  Across teams receiving strengths-based coaching
                </p>
              </div>
              <div>
                <p className="font-serif text-4xl font-normal text-emerald-700 sm:text-5xl">29%</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Increased Profit</p>
                <p className="mt-1 text-xs text-slate-500">
                  Driven by higher engagement and role alignment
                </p>
              </div>
              <div>
                <p className="font-serif text-4xl font-normal text-slate-900 sm:text-5xl">72%</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Lower Turnover</p>
                <p className="mt-1 text-xs text-slate-500">
                  In high-turnover organizations adopting strengths
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <button
                onClick={() => {
                  setFilter('All');
                  setActiveTab('directory');
                }}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Or browse all verified Gallup Certified Strengths Coaches &rarr;
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ROBUST SALES LEADERS PAGE */}
      {activeTab === 'sales' && (
        <main className="mx-auto max-w-6xl px-6 py-20">
          {/* Sales Hero */}
          <section className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800">
              <span>For Chief Revenue Officers, VPs of Sales &amp; Enablement Leaders</span>
            </div>

            <h1 className="mx-auto mt-8 font-serif text-4xl leading-tight font-normal tracking-tight text-slate-900 sm:text-6xl">
              Strengths-based sales development drives{' '}
              <span className="underline decoration-emerald-400 decoration-2 underline-offset-8">
                19% higher sales revenue.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Most sales enablement programs fail because they force analytical, relationship-led,
              and competitive reps to sell the exact same way. Deploy Gallup Certified Strengths
              Coaches to turn each rep&apos;s natural talent into repeatable pipeline and closed
              revenue.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setFilter('Sales Teams');
                  setActiveTab('directory');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
              >
                <span>Find a Sales Strengths Coach</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
              <a
                href="#sales-problems"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span>See How It Solves Quota Gaps</span>
              </a>
            </div>
          </section>

          {/* Key Metrics */}
          <section className="mt-20 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold">
                19%
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Higher Sales Revenue</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Sales teams coached around individual CliftonStrengths themes consistently
                outperform quota compared to uniform methodology rollouts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold">
                29%
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Increased Profit</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Matching prospecting, discovery, and closing motions to rep strengths eliminates
                wasted activity and improves win rates.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold">
                72%
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Lower Rep Turnover</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Stop losing mid-tier and top AEs to burnout by equipping frontline sales managers
                to coach each rep&apos;s natural selling edge.
              </p>
            </div>
          </section>

          {/* The 3 Revenue Problems Solved */}
          <section id="sales-problems" className="mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Solving Revenue Bottlenecks
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-slate-900 sm:text-4xl">
                Why standard sales training stalls—and how strengths coaching fixes it
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                  Problem 01 &bull; Rigid Scripts
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Forcing AEs to Sound Like Someone Else
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  When an <em>Analytical + Relator</em> rep is forced to use a high-pressure
                  challenger script, buyers sense the friction immediately. Strengths coaching
                  translates your sales process into authentic talk tracks for every rep profile.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                  Problem 02 &bull; Slow Ramp Time
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  6–9 Months Before New Hires Produce
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  New AEs waste quarters trying to copy the top rep&apos;s style instead of
                  activating their own. Mapping Top 5 CliftonStrengths during onboarding gives
                  managers an immediate blueprint to accelerate first-deal velocity.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  Problem 03 &bull; Generic 1:1 Coaching
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Pipeline Reviews Instead of Skill Development
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Frontline sales managers default to inspecting CRM stages because they lack a
                  diagnostic framework for human behavior. Certified coaches give managers
                  practical, theme-specific coaching plays for stuck deals.
                </p>
              </div>
            </div>
          </section>

          {/* How Different Strengths Win Deals */}
          <section className="mt-24 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Talent-Led Selling in Action
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-slate-900">
                Different CliftonStrengths win the same enterprise deal differently
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Strategic + Analytical + Learner
                </p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">
                  The Consultative Architect
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Wins complex multi-stakeholder deals through deep industry insight, business
                  case rigor, and anticipating CFO objections before they arise.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Relator + Individualization + Empathy
                </p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">
                  The Champion Builder
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Uncovers hidden buying committee dynamics, builds high-trust executive sponsors,
                  and drives high net-dollar expansion post-sale.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Activator + Competition + Command
                </p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">
                  The Momentum Closer
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Creates urgency in stalled evaluations, navigates procurement roadblocks
                  decisively, and thrives in high-velocity new-logo acquisition.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  setFilter('Sales Teams');
                  setActiveTab('directory');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-8 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <span>Connect With a Sales Strengths Coach &rarr;</span>
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ROBUST HR & MANAGERS PAGE */}
      {activeTab === 'hr' && (
        <main className="mx-auto max-w-6xl px-6 py-20">
          {/* HR Hero */}
          <section className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800">
              <span>For CHROs, VPs of People, L&amp;D Leaders &amp; Department Heads</span>
            </div>

            <h1 className="mx-auto mt-8 font-serif text-4xl leading-tight font-normal tracking-tight text-slate-900 sm:text-6xl">
              Build high-engagement teams grounded in{' '}
              <span className="underline decoration-emerald-400 decoration-2 underline-offset-8">
                verified Gallup coaches.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              70% of the variance in team engagement comes down to the manager. Partner directly
              with accredited Gallup Certified Strengths Coaches to upskill frontline leaders,
              resolve cross-functional friction, and retain top talent.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setFilter('Executive & HR');
                  setActiveTab('directory');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
              >
                <span>Browse Executive &amp; HR Coaches</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
              <a
                href="#hr-challenges"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span>Explore People &amp; Culture Solutions</span>
              </a>
            </div>
          </section>

          {/* The 3 People & Leadership Challenges Solved */}
          <section id="hr-challenges" className="mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Practical People Strategy
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-slate-900 sm:text-4xl">
                Solving the people challenges HR leaders face every quarter
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  Challenge 01 &bull; Manager Effectiveness
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Promoted Individual Contributors Struggling to Lead
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  New managers often micromanage because they try to make direct reports work the
                  way they did. Strengths coaching teaches managers how to delegate, motivate,
                  and give feedback tailored to each employee&apos;s Top 5 themes.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  Challenge 02 &bull; Team Silos &amp; Friction
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Misaligned Execution Across Departments
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  When <em>Ideation + Activator</em> product leaders clash with{' '}
                  <em>Deliberative + Consistency</em> operations teams, projects stall. A
                  facilitated team grid reframes friction into complementary partnerships.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  Challenge 03 &bull; Regrettable Attrition
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  High Performers Disengaging After Reorgs
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Employees who use their strengths every day are 6x more likely to be engaged at
                  work. Strengths-based role alignment keeps top talent energized without
                  inflating compensation bands.
                </p>
              </div>
            </div>
          </section>

          {/* Engagement Formats */}
          <section className="mt-24 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Flexible Delivery Models
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-slate-900">
                How HR &amp; People teams deploy Strengths.cc coaches
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <h3 className="text-base font-semibold text-slate-900">
                  Half-Day &amp; Full-Day Team Offsites
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Interactive on-site or virtual workshops that map your entire team&apos;s 34
                  CliftonStrengths domains, uncover blind spots, and establish working agreements.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <h3 className="text-base font-semibold text-slate-900">
                  Manager Cohort Enablement
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Multi-session leadership cohorts equipping people managers to run strength-based
                  1:1s, career development conversations, and performance check-ins.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
                <h3 className="text-base font-semibold text-slate-900">
                  1:1 Executive &amp; VP Coaching
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Confidential Full-34 CliftonStrengths debriefs and ongoing advisory for C-suite
                  leaders, founders, and newly promoted executives.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  setFilter('Executive & HR');
                  setActiveTab('directory');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-8 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <span>Browse Executive &amp; HR Coaches &rarr;</span>
              </button>
            </div>
          </section>
        </main>
      )}

      {/* DIRECTORY PAGE */}
      {activeTab === 'directory' && (
        <main className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-8">
            <div>
              <h1 className="font-serif text-3xl font-normal text-slate-900 sm:text-4xl">
                Gallup Certified Strengths Coaches
              </h1>
              <p className="mt-2 text-slate-600">
                Direct access to vetted coaches—no agency markups or middleman delays.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Sales Teams', 'Executive & HR', 'Enterprise'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    filter === item
                      ? 'bg-emerald-700 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {filteredCoaches.map((coach) => (
              <div
                key={coach.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                      {coach.specialty}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{coach.rate}</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-slate-900">{coach.name}</h2>
                  <p className="text-sm font-medium text-emerald-700">{coach.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{coach.location}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{coach.bio}</p>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Top 5 CliftonStrengths
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {coach.top5.map((theme) => (
                        <span
                          key={theme}
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCoach(coach);
                    setInquirySent(false);
                  }}
                  className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Connect with {coach.name.split(' ')[0]}
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* FOR GALLUP COACHES LANDING PAGE */}
      {activeTab === 'coaches' && (
        <main className="mx-auto max-w-6xl px-6 py-16">
          <section className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800">
              <span>Credential-Verified Corporate Directory</span>
            </div>

            <h1 className="mx-auto mt-6 font-serif text-4xl leading-tight font-normal tracking-tight text-slate-900 sm:text-6xl">
              Stand apart from generalist directories as a verified{' '}
              <span className="underline decoration-emerald-400 decoration-2 underline-offset-8">
                Gallup Certified Strengths Coach.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              General coaching platforms bury certified practitioners next to unvetted life
              coaches—while brokerages take 30%–50% of your fee. Strengths.cc verifies your Gallup
              credential and connects you directly with CROs, VPs of Sales, and HR leaders
              investing in team development.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={ANNUAL_STRIPE_URL}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-8 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <span>Join the Directory &mdash; $149/year &rarr;</span>
              </a>
              <a
                href="#coach-benefits"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span>See Why Specialists Join</span>
              </a>
            </div>
          </section>

          <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Asymmetric Practice ROI
                </span>
                <h2 className="mt-4 font-serif text-3xl font-normal text-slate-900">
                  One corporate client covers your $149 annual listing 30x to 150x over—and you
                  keep 100% of the engagement.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  A single corporate CliftonStrengths team workshop or multi-month sales
                  enablement engagement typically bills between{' '}
                  <strong className="text-slate-900">$5,000 and $25,000+</strong>. Because
                  Strengths.cc charges zero referral fees and takes zero commission, every dollar
                  from your client contract—and every follow-on leadership retainer—stays in your
                  practice.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Your Fee Share
                </p>
                <p className="mt-2 font-serif text-5xl font-normal text-emerald-900">100%</p>
                <p className="mt-2 text-xs leading-relaxed text-emerald-800">
                  Flat $149/year membership. Direct client contracts, direct invoicing, and zero
                  middleman markups.
                </p>
              </div>
            </div>
          </section>

          <section id="coach-benefits" className="mt-24">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Built for Serious Practitioners
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-slate-900 sm:text-4xl">
                Why Gallup Certified Strengths Coaches choose Strengths.cc
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  Credential-Only Positioning
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  Zero Dilution From Uncertified Coaches
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Every coach is manually verified as a Gallup Certified Strengths Coach before
                  their profile is published. Corporate buyers know they are hiring an accredited
                  CliftonStrengths specialist—protecting your authority and enterprise rates.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  Pre-Educated B2B Buyers
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  Skip the &ldquo;Why CliftonStrengths?&rdquo; Pitch
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Decision-makers visiting Strengths.cc are already convinced by Gallup&apos;s
                  meta-analysis findings (19% higher sales revenue, 29% higher profit, 72% lower
                  turnover). Your discovery calls focus on scoping team outcomes, not defending the
                  assessment.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  Direct Client Ownership
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  Own the Relationship &amp; Renewals
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Unlike coaching marketplaces that restrict client communication and skim 30%–50%
                  off every invoice, buyer inquiries route straight to you. You scope, contract,
                  and expand accounts directly under your own brand.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  Specialty &amp; Top 5 Filtering
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  Matched by Corporate Outcome
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Buyers filter directly by <strong>Sales Teams</strong>,{' '}
                  <strong>Executive &amp; HR</strong>, or <strong>Enterprise</strong>, alongside
                  your Top 5 CliftonStrengths themes and remote/on-site workshop availability.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-24 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-normal text-slate-900">
                How Strengths.cc Differs From Alternatives
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Purpose-built for independent CliftonStrengths consultants serving corporate teams.
              </p>
            </div>

            <div className="mt-10 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="py-4 pr-4 font-semibold">Criteria</th>
                    <th className="py-4 px-4 font-bold text-emerald-800">Strengths.cc</th>
                    <th className="py-4 px-4 font-semibold">Coaching Marketplaces</th>
                    <th className="py-4 pl-4 font-semibold">General Directories</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-4 pr-4 font-medium text-slate-900">
                      Credential Requirement
                    </td>
                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      Verified Gallup Certified Strengths Coach
                    </td>
                    <td className="py-4 px-4 text-slate-500">Mixed / generic frameworks</td>
                    <td className="py-4 pl-4 text-slate-500">Unverified self-listings</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-medium text-slate-900">
                      Revenue Share / Commission
                    </td>
                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      0% (Keep 100% of client fees)
                    </td>
                    <td className="py-4 px-4 text-slate-500">30% – 50% taken per engagement</td>
                    <td className="py-4 pl-4 text-slate-500">0% (Mostly B2C inquiries)</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-medium text-slate-900">
                      Client &amp; Contract Ownership
                    </td>
                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      100% yours (direct renewals)
                    </td>
                    <td className="py-4 px-4 text-slate-500">Platform owns client contract</td>
                    <td className="py-4 pl-4 text-slate-500">Direct</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-medium text-slate-900">Corporate Buyer Focus</td>
                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      CROs, VPs of Sales &amp; HR
                    </td>
                    <td className="py-4 px-4 text-slate-500">Enterprise HR procurement</td>
                    <td className="py-4 pl-4 text-slate-500">Individual B2C coaching</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-24">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Simple Onboarding
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-slate-900">
                Publish your verified profile in under 24 hours
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-7">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  1
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Activate Annual Listing
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Complete your $149/year checkout via Stripe and proceed immediately to the
                  profile builder.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-7">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  2
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Build Your Specialist Profile
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Add your Top 5 CliftonStrengths, corporate focus area, workshop/session rate,
                  and track record.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-7">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  3
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Get Verified &amp; Receive Inquiries
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  We verify your Gallup certification within 24 hours, publish your listing, and
                  route corporate leads straight to your inbox.
                </p>
              </div>
            </div>
          </section>

          <section id="membership-plan" className="mt-24">
            <div className="mx-auto max-w-xl rounded-3xl border-2 border-emerald-700 bg-white p-8 shadow-md sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Annual Directory Membership
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  0% Commission &bull; Keep 100% of Fees
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-serif text-5xl font-normal text-slate-900">$149</span>
                <span className="text-sm font-medium text-slate-500">/ year</span>
              </div>

              <h2 className="mt-3 font-serif text-2xl font-normal text-slate-900">
                Verified Gallup Certified Strengths Coach Listing
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Full-year visibility in front of corporate sales and HR leaders—paid for many
                times over by a single team workshop or leadership engagement.
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-emerald-700">&#10003;</span>
                  <span>
                    <strong>Verified Gallup Certified Strengths Coach Badge</strong> that builds
                    instant trust with corporate decision-makers
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-emerald-700">&#10003;</span>
                  <span>
                    <strong>Top 5 CliftonStrengths &amp; Corporate Specialty Filtering</strong> so
                    ideal B2B buyers find you fast
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-emerald-700">&#10003;</span>
                  <span>
                    <strong>Direct Buyer Inquiries</strong> routed straight to you with zero
                    middleman markups or contract restrictions
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-emerald-700">&#10003;</span>
                  <span>
                    <strong>Uninterrupted 12-Month Search Presence</strong> across Sales Teams,
                    Executive &amp; HR, and Enterprise filters
                  </span>
                </li>
              </ul>

              <a
                href={ANNUAL_STRIPE_URL}
                className="mt-8 block w-full rounded-xl bg-emerald-700 py-4 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Join Annual Directory ($149/yr) &amp; Set Up Profile &rarr;
              </a>
              <p className="mt-3 text-center text-xs text-slate-500">
                Immediate access to the profile builder right after Stripe checkout.
              </p>
            </div>
          </section>

          <section className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-center font-serif text-3xl font-normal text-slate-900">
              Frequently Asked Questions
            </h2>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900">
                  Who is eligible to list on Strengths.cc?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Only accredited Gallup Certified Strengths Coaches in good standing. During
                  onboarding, you provide your Gallup-registered email so we can verify your
                  credential before publishing your profile.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900">
                  Do you take a percentage of my coaching or workshop fees?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Never. Beyond your flat $149/year directory membership, you contract directly
                  with the corporate buyer, invoice them through your own business, and retain
                  100% of every workshop, coaching engagement, and follow-on retainer.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900">
                  What if I deliver both remote and on-site corporate workshops?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  You can list your home metro area alongside remote availability (for example,
                  &ldquo;Chicago, IL — Remote &amp; On-site&rdquo;) so both local organizations and
                  distributed teams can connect with you.
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {selectedCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Contact {selectedCoach.name}
              </h3>
              <button
                onClick={() => setSelectedCoach(null)}
                className="text-sm text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            {inquirySent ? (
              <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
                Inquiry sent for {selectedCoach.name}. We will connect you within 1 business day.
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Work Email</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Team Size &amp; Goals
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={buyerGoals}
                    onChange={(e) => setBuyerGoals(e.target.value)}
                    placeholder="Tell us about your sales or leadership team..."
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingInquiry}
                  className="w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:bg-slate-300"
                >
                  {sendingInquiry ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="mt-24 border-t border-slate-200 bg-white py-10 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} strengths.cc &mdash; CliftonStrengths&reg; is a trademark of Gallup, Inc.</p>
      </footer>
    </div>
  );
}
