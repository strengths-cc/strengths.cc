'use client';

import React, { useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Data Models & Default Seed Profiles
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Interactive Playbook Configurations (2 Strengths Per Named Persona)
// ---------------------------------------------------------------------------
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
      play: 'Anchors new hires into peer networks quickly, preventing post-reorg isolation and regrettable turnover
