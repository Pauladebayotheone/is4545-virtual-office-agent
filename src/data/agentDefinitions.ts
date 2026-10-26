import { AgentDefinition } from '../types';

export const AGENT_DEFINITIONS: AgentDefinition[] = [
  {
    id: 'feedback-insight',
    roomNumber: 'Room 101',
    name: 'Patient Feedback Insight Agent',
    title: 'Patient Feedback Insight Agent',
    role: 'Analyze patient comments to help healthcare leaders understand patient experience, operational problems, communication issues, and possible risks.',
    avatarRole: 'Clinical Quality Analyst',
    roomTheme: {
      accent: 'text-teal-700',
      subtle: 'bg-teal-50/60',
      border: 'border-teal-200',
      badge: 'bg-teal-100 text-teal-800',
    },
    shortDescription: 'Analyzes qualitative comments for themes, sentiment, operational issues, bias concerns, and practical management fixes.',
    keyFunctions: [
      'Theme Classification (9 clinical themes)',
      'Sentiment Analysis (Positive / Negative / Neutral / Mixed)',
      'Operational Healthcare Bottleneck Detection',
      'Patient Safety, Accessibility & Bias Risk Spotting',
      'Managerial Quality-Improvement Action Formulation'
    ],
    tasks: [
      'Step 1. Theme (Communication, Scheduling, Wait Time, Portal, Billing, Clinical Care, Discharge, Equity, Mixed)',
      'Step 2. Sentiment (Positive, Negative, Neutral, Mixed)',
      'Step 3. Reasoning for selected theme & sentiment',
      'Step 4. Operational issue breakdown in clinical process',
      'Step 5. Risk or bias concern (safety, accessibility, language, disability)',
      'Step 6. Practical managerial action recommendation'
    ],
    constraints: 'Use professional healthcare quality-improvement tone. Do not invent medical facts. If ambiguous, state clearly. Highlight missing info.'
  },
  {
    id: 'experience-monitoring',
    roomNumber: 'Room 102',
    name: 'Patient Experience Monitoring Agent',
    title: 'Patient Experience Monitoring Agent',
    role: 'Analyze patient feedback to help healthcare leaders improve patient experiences, communication quality, operational performance, and healthcare equity.',
    avatarRole: 'Patient Experience Director',
    roomTheme: {
      accent: 'text-indigo-700',
      subtle: 'bg-indigo-50/60',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-800',
    },
    shortDescription: 'Monitors ongoing experience trends with a strong emphasis on healthcare equity, underserved groups, and systemic risk.',
    keyFunctions: [
      'Primary & Secondary Multi-Theme Tagging',
      'Operational Bottleneck & Process Failure Mapping',
      'Equity & Vulnerable Populations Review (Elderly, Rural, LEP)',
      'Multi-Category Risk Assessment (Safety, Reputational, Compliance)',
      'Actionable Executive Experience Recommendations'
    ],
    tasks: [
      'STEP 1: Theme Classification (Primary & Secondary themes)',
      'STEP 2: Operational Issue Identification (Specific systemic bottlenecks)',
      'STEP 3: Healthcare Equity & Accessibility Review (Older adults, rural, LEP, disabilities, low digital literacy)',
      'STEP 4: Risk Assessment (Low, Moderate, High across safety, compliance, reputational)',
      'STEP 5: Managerial Recommendation for leadership'
    ],
    constraints: 'Focus on equity and accessible healthcare delivery. Avoid medical diagnoses. Professional tone.'
  },
  {
    id: 'complaint-triage',
    roomNumber: 'Room 103',
    name: 'Complaint Triage Assistant',
    title: 'Healthcare Complaint Triage Assistant',
    role: 'Help healthcare organizations review, prioritize, and route patient complaints efficiently while maintaining patient safety, fairness, compliance, and human oversight. NOT to resolve complaints.',
    avatarRole: 'Clinical Triage Coordinator',
    roomTheme: {
      accent: 'text-rose-700',
      subtle: 'bg-rose-50/60',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-800',
    },
    shortDescription: 'Triages patient grievances into 4 rigorous severity levels, flags clinical risks, and determines precise department routing.',
    keyFunctions: [
      'Complaint Categorization (10 standard hospital categories)',
      '4-Level Severity Scoring (Low to Critical)',
      'Risk Detection across 8 Clinical & Legal Dimensions',
      'Intelligent Department Escalation Routing',
      'Mandatory Human Review Guardrails'
    ],
    tasks: [
      'STEP 1: Complaint Category (Primary & Secondary categorization)',
      'STEP 2: Severity Assessment (Level 1 Low to Level 4 Critical with full reasoning)',
      'STEP 3: Risk Detection (Safety, Clinical, Compliance, Privacy, Accessibility, Reputational, Operational)',
      'STEP 4: Escalation Recommendation (Route to Patient Experience, Nursing, Physician Leadership, Compliance, Risk Management, etc.)'
    ],
    constraints: 'Role is NOT to resolve complaints. Do not invent medical facts. State ambiguous details. Enforce human checkpoints.'
  },
  {
    id: 'hospital-manager',
    roomNumber: 'Room 104',
    name: 'Hospital Manager Decision Support',
    title: 'Hospital Manager Decision Support Agent',
    role: 'Transform patient-level data into clear managerial insights by identifying patterns, prioritizing concerns, recommending actions, and presenting results through an interactive dashboard.',
    avatarRole: 'Hospital Operations Director',
    roomTheme: {
      accent: 'text-amber-800',
      subtle: 'bg-amber-50/60',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
    },
    shortDescription: 'Provides hospital operational management with prioritized problem matrices, human review triage, and executive action alerts.',
    keyFunctions: [
      'Patient Persona & Service Line Cross-Analysis',
      'Management Priority Stratification (Low, Medium, High)',
      'AI Risk Flag Vetting (Hallucination Trap, Bias review)',
      'Actionable Operational Intervention Planning',
      'Top Management Alerts & Bottom Action Summaries'
    ],
    tasks: [
      'Analyze persona, visit type, service line, satisfaction, portal usage, readmission risk, comments',
      '1. Identify the main problem for each case',
      '2. Rate management priority (Low, Medium, High)',
      '3. Explain priority rating reasoning',
      '4. Recommend 1-2 management actions',
      '5. Determine if human review is needed'
    ],
    constraints: 'Focus strictly on management issues (waits, scheduling, communication, billing). Do not diagnose medical conditions. Pay special attention to AI Risk Flags.'
  },
  {
    id: 'healthcare-analytics',
    roomNumber: 'Room 105',
    name: 'Healthcare Analytics Agent',
    title: 'Healthcare Analytics Agent (C-Suite)',
    role: 'Create an interactive executive dashboard application for hospital leadership and C-suite officers to supplement high-level managerial decisions.',
    avatarRole: 'Chief Healthcare Biostatistician',
    roomTheme: {
      accent: 'text-cyan-800',
      subtle: 'bg-cyan-50/60',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-800',
    },
    shortDescription: 'Consolidates 6 executive sections: KPI overview, satisfaction distribution, NLP keyword clouds, hidden bottlenecks, AI risks, and strategic roadmaps.',
    keyFunctions: [
      'Executive KPI Overview & Service Line Benchmarks',
      'Multi-Dimensional Satisfaction Insights',
      'NLP Keyword Frequency & Word Cloud Mapping',
      'Hidden Organizational Bottlenecks Detection',
      'AI Risk Monitoring (Hallucination traps, bias)',
      'Strategic 3-Month Quick Wins & Long-Term Roadmaps'
    ],
    tasks: [
      'SECTION 1: Executive Overview (comments, satisfaction, communication, compliance)',
      'SECTION 2: Patient Satisfaction Insights (distribution, by service line, visit type, persona)',
      'SECTION 3: NLP Analysis (top themes, frequent keywords, word cloud)',
      'SECTION 4: Hidden Organizational Problems (bottlenecks, tech, scheduling, wait-time)',
      'SECTION 5: AI Risk Monitoring (hallucination traps, bias, human review)',
      'SECTION 6: Executive Recommendations (Top 5 priorities, Quick wins <3mo, Long-term AI 6-12mo)'
    ],
    constraints: 'Zero fictitious information. Professional healthcare quality-improvement tone. Executive-ready presentation.'
  },
  {
    id: 'readmission-risk',
    roomNumber: 'Room 106',
    name: 'Patient Readmission Risk Agent',
    title: 'Patient Readmission Risk Agent',
    role: 'Analyze discharge summaries, post-discharge feedback, follow-up call notes, and socioeconomic barriers to spot gaps in discharge instructions and reduce preventable 30-day readmissions.',
    avatarRole: 'Care Transitions Specialist',
    roomTheme: {
      accent: 'text-emerald-800',
      subtle: 'bg-emerald-50/60',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    shortDescription: 'Stratifies 30-day readmission risk, isolates care-transition barriers, reviews clinician flags, and prescribes care coordination actions.',
    keyFunctions: [
      '30-Day Readmission Risk Stratification (Low, Moderate, High)',
      'Primary Transition Barrier Identification (6 root causes)',
      'Clinical & Financial Impact Analysis (Hospital penalties)',
      'Clinician Human-Review Risk Verification',
      'Actionable Care Coordination & Telehealth Interventions',
      'Care Transition Enhancement Proposals (Step 6)'
    ],
    tasks: [
      'Step 1: Readmission Risk Stratification (Low, Moderate, High)',
      'Step 2: Primary Barrier Identification (Medication confusion, transportation, discharge communication, symptoms, financial, social isolation)',
      'Step 3: Clinical & Operational Impact (Safety, recovery timeline, readmission penalty)',
      'Step 4: AI Risk Flag Review (Conflicting data, clinician review)',
      'Step 5: Care Coordination Action (Nurse telehealth, rideshare, multilingual instruction)',
      'Step 6: Future Changes (Input care transition enhancements)'
    ],
    constraints: 'Professional quality tone. Do not diagnose conditions or alter clinical treatment plans. Highlight high-risk cases at top, care coordination at bottom.'
  }
];
