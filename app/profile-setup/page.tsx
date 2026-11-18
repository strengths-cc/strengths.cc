'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const FORMSPREE_URL = 'https://formspree.io/f/mqpqbnpn';

const CLIFTON_THEMES = [
  'Achiever', 'Activator', 'Adaptability', 'Analytical', 'Arranger',
  'Belief', 'Command', 'Communication', 'Competition', 'Connectedness',
  'Consistency', 'Context', 'Deliberative', 'Developer', 'Discipline',
  'Empathy', 'Focus', 'Futuristic', 'Harmony', 'Ideation',
  'Includer', 'Individualization', 'Input', 'Intellection', 'Learner',
  'Maximizer', 'Positivity', 'Relator', 'Responsibility', 'Restorative',
  'Self-Assurance', 'Significance', 'Strategic', 'Woo',
];

function ProfileSetupContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('signup') === 'success';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('Gallup-Certified Strengths Coach');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState<'Sales Teams' | 'Executive & HR' | 'Enterprise'>('Sales Teams');
  const [rate, setRate] = useState('$250 / session');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isSuccess) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans antialiased flex flex-col justify-between">
        <header className="border-b border-slate-200/80 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 font-serif text-lg font-bold text-white">
                s
              </span>
              <span className="font-serif text-xl font-semibold tracking-tight text-slate-900">
                strengths.cc
              </span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-md px-6 py-20 text-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              Membership Required
            </span>
            <h1 className="mt-4 font-serif text-2xl font-normal text-slate-900">
              Complete Directory Registration First
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Coach profile setup is unlocked immediately after completing your Founding Coach
              Directory membership checkout.
            </p>
            <a
              href="https://buy.stripe.com/5kQdR97vpcfGdPg3ZOdQQ02"
              className="mt-6 block w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Join Directory via Stripe &rarr;
            </a>
            <Link
              href="/"
              className="mt-4 inline-block text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              &larr; Return to Strengths.cc Home
            </Link>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} strengths.cc
        </footer>
      </div>
    );
  }

  const toggleTheme = (theme: string) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(selectedThemes.filter((t) => t !== theme));
    } else if (selectedThemes.length < 5) {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedThemes.length !== 5 || submitting) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const { error: dbError } = await supabase.from('coaches').insert([
        {
          name: fullName,
          email,
          title,
          location,
          specialty,
          rate,
          top5: selectedThemes,
          bio,
          approved: false,
        },
      ]);

      if (dbError) {
        throw new Error(dbError.message);
      }

      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          submissionType: 'New Coach Pending Approval in Supabase',
          fullName,
          email,
          title,
          location,
          specialty,
          rate,
          top5Strengths: selectedThemes.join(', '),
          bio,
        }),
      });

      setSubmitted(true);
    } catch {
      setErrorMessage('Could not save profile to database. Please try again or contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans antialiased">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 font-serif text-lg font-bold text-white">
              s
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight text-slate-900">
              strengths.cc
            </span>
          </Link>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            Coach Onboarding
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
          <p className="text-sm font-semibold">
            &#10003; Payment confirmed &mdash; Welcome to the Strengths.cc Founding Coach Directory!
          </p>
          <p className="mt-1 text-xs text-emerald-800">
            Complete your verified coach profile below so sales leaders and HR executives can discover you.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
              &#10003;
            </div>
            <h1 className="mt-5 font-serif text-3xl font-normal text-slate-900">
              Profile Submitted for Verification
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
              Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. Your
              profile is saved in our verification queue and will automatically go live within 24
              hours once your Gallup credential is confirmed.
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-[#fafaf9] p-6 text-left">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                  {specialty}
                </span>
                <span className="text-xs font-medium text-slate-500">{rate}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{fullName}</h2>
              <p className="text-xs font-medium text-emerald-700">{title}</p>
              <p className="mt-1 text-xs text-slate-500">{location}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">{bio}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selectedThemes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <span>Return to Strengths.cc Home</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs sm:p-10">
            <h1 className="font-serif text-3xl font-normal text-slate-900">
              Set Up Your Coach Profile
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              This information appears on your public directory card for corporate buyers.
            </p>

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Jordan Taylor"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Gallup-Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@coachingpractice.com"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Credential Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Location &amp; Format
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Chicago, IL (Remote & On-site)"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Primary Specialty
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) =>
                      setSpecialty(e.target.value as 'Sales Teams' | 'Executive & HR' | 'Enterprise')
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
                  >
                    <option value="Sales Teams">Sales Teams</option>
                    <option value="Executive & HR">Executive &amp; HR</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Starting Session / Workshop Rate
                  </label>
                  <input
                    type="text"
                    required
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="e.g., $300 / session"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Select Your Top 5 CliftonStrengths
                  </label>
                  <span
                    className={`text-xs font-semibold ${
                      selectedThemes.length === 5 ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {selectedThemes.length} / 5 selected
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  {CLIFTON_THEMES.map((theme) => {
                    const active = selectedThemes.includes(theme);
                    const disabled = !active && selectedThemes.length >= 5;
                    return (
                      <button
                        type="button"
                        key={theme}
                        disabled={disabled}
                        onClick={() => toggleTheme(theme)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          active
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : disabled
                            ? 'bg-white text-slate-300 cursor-not-allowed'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-600'
                        }`}
                      >
                        {theme}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Coaching Bio &amp; Corporate Outcomes
                </label>
                <textarea
                  required
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your experience coaching sales organizations, executives, or high-performing teams..."
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-emerald-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={selectedThemes.length !== 5 || submitting}
                className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white transition ${
                  selectedThemes.length === 5 && !submitting
                    ? 'bg-emerald-700 hover:bg-emerald-800 shadow-sm'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {submitting
                  ? 'Saving Verified Profile...'
                  : selectedThemes.length === 5
                  ? 'Submit Verified Profile'
                  : `Select ${5 - selectedThemes.length} More Strengths to Continue`}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProfileSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fafaf9] text-sm text-slate-500">
          Loading profile setup...
        </div>
      }
    >
      <ProfileSetupContent />
    </Suspense>
  );
}
