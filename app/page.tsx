'use client';

import React, { useState } from 'react';

const FORMSPREE_URL = 'https://formspree.io/f/mqpqbnpn';

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

const COACHES: Coach[] = [
  {
    id: '1',
    name: 'Elena Rostova',
    title: 'Gallup-Certified Strengths Coach',
    location: 'Seattle, WA (Remote & On-site)',
    specialty: 'Sales Teams',
    top5: ['Achiever', 'Strategic', 'Competition', 'Maximizer', 'Relator'],
    bio: '12+ years helping B2B revenue teams replace rigid scripts with talent-led selling.',
    rate: '$250 / session',
  },
  {
    id: '2',
    name: 'Marcus Vance',
    title: 'Gallup-Certified Executive Coach',
    location: 'Austin, TX (Remote & On-site)',
    specialty: 'Executive & HR',
    top5: ['Learner', 'Individualization', 'Developer', 'Connectedness', 'Arranger'],
    bio: 'Specializes in manager enablement, high-retention onboarding, and culture transformation.',
    rate: '$300 / session',
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    title: 'Senior Strengths & Revenue Strategist',
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
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerGoals, setBuyerGoals] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const filteredCoaches =
    filter === 'All' ? COACHES : COACHES.filter((c) => c.specialty === filter);

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
      {/* Top Navigation */}
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

      {/* TAB 1: Revenue Officers & Sales Leaders */}
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
            Deploy Certified Gallup Coaches to transform sales team performance. Stop forcing
            rigid sales scripts and harness individual natural talent.
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

          {/* Value Pillars */}
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

      {/* TAB 2: Managers & HR Executives */}
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

      {/* TAB 3: Find a Coach Directory */}
      {activeTab === 'directory' && (
        <main className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-8">
            <div>
              <h1 className="font-serif text-3xl font-normal text-slate-900 sm:text-4xl">
                Gallup-Certified Strengths Coaches
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

      {/* TAB 4: For Gallup Coaches (Stripe Membership) */}
      {activeTab === 'coaches' && (
        <main className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800">
            <span>For Gallup-Certified Coaches</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-normal text-slate-900 sm:text-5xl">
            Get discovered by sales leaders &amp; HR executives actively hiring.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Create your verified coach profile, showcase your Top 5 CliftonStrengths, and keep
            100% of your coaching fees.
          </p>

          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              Verified Directory Membership
            </span>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Founding Coach Listing</h2>
            <p className="mt-2 text-sm text-slate-600">
              Full directory profile, direct corporate inquiries, and featured placement.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>&#10003; Verified Gallup-Certified Coach badge</li>
              <li>&#10003; Top 5 CliftonStrengths &amp; specialty filters</li>
              <li>&#10003; Direct client leads with zero commission fees</li>
            </ul>

            <a
              href="https://buy.stripe.com/5kQdR97vpcfGdPg3ZOdQQ02"
              className="mt-8 block w-full rounded-xl bg-emerald-700 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              Join Directory &amp; Set Up Profile &rarr;
            </a>
            <p className="mt-3 text-center text-xs text-slate-400">
              After Stripe checkout, you will be redirected to set up your coach profile.
            </p>
          </div>
        </main>
      )}

      {/* Buyer Inquiry Modal */}
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

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 bg-white py-10 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} strengths.cc &mdash; CliftonStrengths&reg; is a trademark of Gallup, Inc.</p>
      </footer>
    </div>
  );
}
