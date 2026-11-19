'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const FORMSPREE_URL = 'https://formspree.io/f/mqpqbnpn';
const MONTHLY_STRIPE_URL = 'https://buy.stripe.com/5kQdR97vpcfGdPg3ZOdQQ00';
const ANNUAL_STRIPE_URL = 'https://buy.stripe.com/cNi7sL4jd7Zq9z03ZOdQQ02';

type Tab = 'sales' | 'hr' | 'directory' | 'coaches';

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
  const [activeTab, setActiveTab] = useState<Tab>('sales');
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
            onClick={() => setActiveTab('sales')}
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

      {activeTab === 'sales' && (
        <main className="mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800">
            <span>Gallup CliftonStrengths Meta-Analysis Findings</span>
          </div>

          <h1 className="mx-auto mt-8 max-w-4xl font-serif text-4xl leading-tight font-normal tracking-tight text-slate-900 sm:text-6xl">
            Strengths-based sales development drives{' '}
            <span className="underline decoration-emerald-400 decoration-2 underline-offset-8">
              19% higher sales revenue.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Deploy Gallup Certified Strengths Coaches to transform sales team performance. Stop
            forcing rigid sales scripts and harness individual natural talent.
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
            <button
              onClick={() => setActiveTab('coaches')}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span>List Your Coaching Practice</span>
            </button>
          </div>

          <div className="mt-20 grid gap-6 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold">
                19%
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Higher Sales Revenue</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Sales teams that receive strengths-based coaching consistently outperform quota
                compared to one-size-fits-all training.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold">
                29%
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Increased Profit</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Aligning deal strategy with each rep&apos;s top CliftonStrengths themes reduces
                ramp time and boosts win rates.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold">
                72%
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Lower Rep Turnover</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Retain top performers by coaching managers to lead around natural selling styles
                rather than micromanaging.
              </p>
            </div>
          </div>
        </main>
      )}

      {activeTab === 'hr' && (
        <main className="mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800">
            <span>Enterprise Talent &amp; People Strategy</span>
          </div>

          <h1 className="mx-auto mt-8 max-w-4xl font-serif text-4xl leading-tight font-normal tracking-tight text-slate-900 sm:text-6xl">
            Build high-engagement teams grounded in{' '}
            <span className="underline decoration-emerald-400 decoration-2 underline-offset-8">
              verified Gallup coaches.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Connect directly with credentialed CliftonStrengths facilitators for team offsites,
            manager workshops, and leadership development.
          </p>

          <div className="mt-10">
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
          </div>
        </main>
      )}

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

      {activeTab === 'coaches' && (
        <main className="mx-auto max-w-6xl px-6 py-16">
          {/* Differentiation-First Hero Section */}
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
                href="#membership-plans"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-8 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <span>View Membership Options</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                href="#coach-benefits"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span>See Why Specialists Join</span>
              </a>
            </div>
          </section>

          {/* Corporate Engagement ROI Callout */}
          <section className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Asymmetric Practice ROI
                </span>
                <h2 className="mt-4 font-serif text-3xl font-normal text-slate-900">
                  One corporate client pays for your listing many times over—and you keep 100% of
                  the engagement.
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
                  Direct client contracts, direct invoicing, and zero middleman markups.
                </p>
              </div>
            </div>
          </section>

          {/* 4 Differentiation & Benefit Pillars */}
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

          {/* Comparison Table */}
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

          {/* 3-Step Process */}
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
                  Choose Monthly or Annual Plan
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Complete checkout via Stripe and proceed immediately to the profile builder.
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

          {/* Dual Membership Options: Monthly & Annual */}
          <section id="membership-plans" className="mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Directory Membership Options
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-slate-900 sm:text-4xl">
                Simple, flat membership—zero commission on client engagements
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Choose the billing cadence that fits your practice. Both plans include full
                credential verification, directory placement, and 100% fee retention.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
              {/* Monthly Option */}
              <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-2xs">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Monthly Plan
                    </span>
                    <span className="text-xs font-medium text-slate-500">Flexible Billing</span>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-normal text-slate-900">
                    Monthly Coach Listing
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Month-to-month directory visibility with direct corporate buyer inquiries and
                    zero revenue share.
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700">&#10003;</span>
                      <span>Verified Gallup Certified Strengths Coach badge</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700">&#10003;</span>
                      <span>Top 5 CliftonStrengths &amp; corporate specialty filtering</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700">&#10003;</span>
                      <span>Direct buyer inquiries—keep 100% of client fees</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700">&#10003;</span>
                      <span>Cancel anytime with one click</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href={MONTHLY_STRIPE_URL}
                    className="block w-full rounded-xl border border-slate-900 bg-white py-3.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                  >
                    Start Monthly Membership &rarr;
                  </a>
                </div>
              </div>

              {/* Annual Option */}
              <div className="flex flex-col justify-between rounded-3xl border-2 border-emerald-700 bg-white p-8 shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                      Annual Plan &bull; Best Value
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">
                      Full-Year Visibility
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-normal text-slate-900">
                    Annual Coach Listing
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Uninterrupted year-round positioning in front of corporate sales and HR
                    leaders—paid for many times over by a single workshop.
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700">&#10003;</span>
                      <span>Verified Gallup Certified Strengths Coach badge</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700">&#10003;</span>
                      <span>Top 5 CliftonStrengths &amp; corporate specialty filtering</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700">&#10003;</span>
                      <span>Direct buyer inquiries—keep 100% of client fees</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700">&#10003;</span>
                      <span>Annual billing savings &amp; year-round search presence</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href={ANNUAL_STRIPE_URL}
                    className="block w-full rounded-xl bg-emerald-700 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                  >
                    Start Annual Membership &rarr;
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              Both plans redirect immediately to the profile builder after Stripe checkout.
            </p>
          </section>

          {/* Coach FAQ */}
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
                  Never. You contract directly with the corporate buyer, invoice them through your
                  own business, and retain 100% of every workshop, coaching engagement, and
                  follow-on retainer.
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
