import React, { useState } from 'react';
import { HealthcareAnalyticsResult } from '../../types';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Cpu, Lightbulb, Target, Sparkles, Building2, Layers } from 'lucide-react';

interface HealthcareAnalyticsDashboardProps {
  analytics: HealthcareAnalyticsResult;
}

export const HealthcareAnalyticsDashboard: React.FC<HealthcareAnalyticsDashboardProps> = ({ analytics }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'satisfaction' | 'nlp' | 'problems' | 'ai-risks' | 'recommendations'>('overview');

  const {
    section1_ExecutiveOverview: s1,
    section2_SatisfactionInsights: s2,
    section3_NLPAnalysis: s3,
    section4_HiddenOrganizationalProblems: s4,
    section5_AIRiskMonitoring: s5,
    section6_ExecutiveRecommendations: s6
  } = analytics;

  return (
    <div className="space-y-6">
      
      {/* Header & Section Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-800">
              <span>Agent 5 Result Canvas</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono">Completed at {analytics.completedAt}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Healthcare Analytics & C-Suite Executive Command Center
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Comprehensive hospital leadership intelligence: Executive Overview, Satisfaction Deep-Dive, NLP Theme Mining, Hidden Systemic Problems, AI Risk Vetting, and Strategic Roadmaps.
            </p>
          </div>
        </div>

        {/* 6 Sections Segmented Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5">
          {[
            { id: 'overview', label: '1. Executive Overview' },
            { id: 'satisfaction', label: '2. Satisfaction Insights' },
            { id: 'nlp', label: '3. NLP & Word Cloud' },
            { id: 'problems', label: '4. Hidden Org Problems' },
            { id: 'ai-risks', label: '5. AI Risk Monitoring' },
            { id: 'recommendations', label: '6. Executive Priorities' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Executive Overview */}
      {(activeTab === 'overview' || activeTab === 'satisfaction') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-700" />
              <span>Section 1: Executive KPI Overview</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Audited across {s1.serviceLinesCount} clinical service lines
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block">Total Comments</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{s1.totalCommentsAnalyzed}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">100% parsed & triaged</span>
            </div>

            <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200">
              <span className="text-xs font-semibold text-cyan-800 block">Avg Satisfaction</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-cyan-950">{s1.averageSatisfactionScore} <span className="text-xs font-normal text-cyan-700">/ 5.0</span></span>
              <span className="text-[10px] text-cyan-700 block mt-0.5">HCAHPS composite</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="text-xs font-semibold text-indigo-800 block">Avg Communication</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-indigo-950">{s1.averageCommunicationRating} <span className="text-xs font-normal text-indigo-700">/ 5.0</span></span>
              <span className="text-[10px] text-indigo-700 block mt-0.5">Doctor & nurse clarity</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-800 block">Follow-up Compliance</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-emerald-950">{s1.followUpComplianceRate}%</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Post-discharge adherence</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 col-span-2 md:col-span-1">
              <span className="text-xs font-semibold text-slate-500 block">Service Lines</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{s1.serviceLinesCount}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Full hospital coverage</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Patient Satisfaction Insights */}
      {(activeTab === 'satisfaction' || activeTab === 'overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-700" />
              <span>Section 2: Patient Satisfaction Visualizations</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Score Distribution Chart */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Satisfaction Score Distribution (1 to 5 Stars)
              </h4>
              <div className="space-y-2 text-xs">
                {s2.distribution.map(d => (
                  <div key={d.score} className="space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-semibold text-slate-700">{d.score} Star Rating</span>
                      <span className="text-slate-500">{d.count} patients ({d.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          d.score <= 2 ? 'bg-rose-500' :
                          d.score === 3 ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${d.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Satisfaction by Service Line */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Satisfaction by Service Line
              </h4>
              <div className="space-y-2 text-xs">
                {s2.byServiceLine.map(sl => (
                  <div key={sl.serviceLine} className="space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-semibold text-slate-700">{sl.serviceLine}</span>
                      <span className="text-slate-700 font-bold">{sl.avgScore} / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-cyan-600 h-2 rounded-full"
                        style={{ width: `${(sl.avgScore / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Satisfaction by Visit Type */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Satisfaction by Visit Type
              </h4>
              <div className="space-y-2.5 text-xs">
                {s2.byVisitType.map(vt => (
                  <div key={vt.visitType} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                    <span className="font-semibold text-slate-800">{vt.visitType}</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900">{vt.avgScore} / 5.0 ({vt.count} cases)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Satisfaction by Persona */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Satisfaction by Patient Cohort Persona
              </h4>
              <div className="space-y-2.5 text-xs">
                {s2.byPersona.map(p => (
                  <div key={p.persona} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">{p.persona}</span>
                    <span className={`font-mono tabular-nums font-bold ${
                      p.avgScore <= 2 ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      {p.avgScore} / 5.0
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 3: NLP Analysis & Word Cloud */}
      {(activeTab === 'nlp' || activeTab === 'overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-700" />
              <span>Section 3: NLP Free-Text Analysis & Word Cloud</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Themes Distribution */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Top NLP Themes Identified From Comments
              </h4>
              <div className="space-y-2.5 text-xs">
                {s3.topThemes.map((t, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{t.theme}</span>
                      <span className="font-mono text-slate-500">{t.count} comments ({t.share}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${t.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Frequency Bars */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Most Frequently Occurring Keywords
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {s3.topKeywords.map((kw, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{kw.keyword}</span>
                      <span className="text-[10px] text-slate-400">{kw.category}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                      {kw.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Word Cloud Canvas */}
          <div className="p-5 rounded-xl bg-slate-900 text-white shadow-inner">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Patient Narrative Word Cloud (Term Frequency Density)</span>
              <span className="text-[10px] font-mono text-slate-400">Natural Language Extraction</span>
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3 py-4">
              {s3.wordCloudTerms.map((term, i) => {
                const sizeClass = term.value > 40 ? 'text-2xl font-black text-cyan-300' :
                                  term.value > 30 ? 'text-xl font-bold text-teal-300' :
                                  term.value > 20 ? 'text-base font-semibold text-slate-200' :
                                  'text-xs font-normal text-slate-400';
                return (
                  <span
                    key={i}
                    className={`${sizeClass} hover:text-white transition-colors cursor-default px-2 py-1 select-none`}
                    title={`Frequency score: ${term.value}`}
                  >
                    {term.text}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Hidden Organizational Problems */}
      {(activeTab === 'problems' || activeTab === 'overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Section 4: Hidden Organizational Problems</span>
            </h3>
          </div>

          {/* Service Lines with Unusually High Complaint Rates */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Service Lines with Unusually High Complaint Rates
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {s4.highComplaintServiceLines.map((line, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-rose-950 text-sm">{line.line}</span>
                      <span className="font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded text-xs">
                        {line.complaintRate}% Grievance Rate
                      </span>
                    </div>
                    <p className="text-rose-900 leading-relaxed mt-1">
                      {line.primaryReason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specific Bottlenecks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>Communication Bottlenecks</span>
              </h5>
              <ul className="space-y-1.5 text-slate-700">
                {s4.communicationBottlenecks.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>Technology & Patient Portal Breakdowns</span>
              </h5>
              <ul className="space-y-1.5 text-slate-700">
                {s4.technologyIssues.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-600 font-bold shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>Scheduling Gridlocks</span>
              </h5>
              <ul className="space-y-1.5 text-slate-700">
                {s4.schedulingIssues.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>Wait-Time Delays & ED Throughput</span>
              </h5>
              <ul className="space-y-1.5 text-slate-700">
                {s4.waitTimeComplaints.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: AI Risk Monitoring */}
      {(activeTab === 'ai-risks' || activeTab === 'overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-700" />
              <span>Section 5: AI Risk Monitoring & Safe Healthcare Automation</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Hallucination Traps */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Hallucination Trap Comments ({s5.hallucinationTraps.length} Identified)</span>
              </h4>
              <p className="text-amber-900 leading-relaxed">
                Cases where patient free-text was vague, contradictory, or missing EHR notes. Constrained models refuse to fabricate clinical details and flag human chart audit.
              </p>
              {s5.hallucinationTraps.map((ht, i) => (
                <div key={i} className="p-3 bg-white rounded-lg border border-amber-200 mt-2 space-y-1">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                    <span>{ht.patientId}</span>
                    <span className="text-amber-700 font-sans text-[11px]">Safeguard Enforced</span>
                  </div>
                  <p className="text-slate-700 italic">"{ht.comment}"</p>
                  <p className="text-amber-900 font-medium">Resolution: {ht.safeguardApplied}</p>
                </div>
              ))}
            </div>

            {/* Bias-Related Comments */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
              <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-700" />
                <span>Bias-Related Comments ({s5.biasRelatedComments.length} Identified)</span>
              </h4>
              <p className="text-rose-900 leading-relaxed">
                Cases where explicit demographic stereotyping, pain threshold dismissal, or failure to accommodate disabilities occurred.
              </p>
              {s5.biasRelatedComments.map((bc, i) => (
                <div key={i} className="p-3 bg-white rounded-lg border border-rose-200 mt-2 space-y-1">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                    <span>{bc.patientId}</span>
                    <span className="text-rose-700 font-sans text-[11px]">Mandatory Peer Review</span>
                  </div>
                  <p className="text-slate-700 italic">"{bc.comment}"</p>
                  <p className="text-rose-900 font-medium">Concern: {bc.biasConcern}</p>
                  <p className="text-slate-600">Mitigation: {bc.mitigation}</p>
                </div>
              ))}
            </div>

            {/* Cases Requiring Human Review */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">
                Cases Mandating Professional Human Review ({s5.casesRequiringHumanReview.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {s5.casesRequiringHumanReview.map((c, i) => (
                  <span key={i} className="font-mono text-xs px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-800">
                    <strong>{c.patientId}</strong>: {c.department} ({c.reason})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: Executive Recommendations */}
      {(activeTab === 'recommendations' || activeTab === 'overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-700" />
              <span>Section 6: Strategic Executive Recommendations</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            
            {/* Top 5 Priorities */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Top 5 Organizational Priorities
                </h4>
                <ol className="space-y-2 text-slate-700 list-decimal pl-4">
                  {s6.top5OrganizationalPriorities.map((p, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">{p}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Quick Wins */}
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-teal-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>Quick Wins (Within 3 Months)</span>
                </h4>
                <ul className="space-y-2 text-teal-900">
                  {s6.quickWinsWithin3Months.map((qw, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-teal-700 font-bold shrink-0">✓</span>
                      <span>{qw}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Long-Term AI Opportunities */}
            <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-cyan-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Long-Term AI Horizons (6–12 Mo)</span>
                </h4>
                <ul className="space-y-2 text-cyan-900">
                  {s6.longTermAIOpportunities.map((ai, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-cyan-700 font-bold shrink-0">→</span>
                      <span>{ai}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
