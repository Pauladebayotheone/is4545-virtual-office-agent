import React, { useState } from 'react';
import { ExperienceMonitoringAnalysis } from '../../types';
import { Search, HeartHandshake, ShieldAlert, AlertTriangle, CheckCircle2, Download, Building, Users } from 'lucide-react';

interface ExperienceMonitoringDashboardProps {
  analysis: ExperienceMonitoringAnalysis;
}

export const ExperienceMonitoringDashboard: React.FC<ExperienceMonitoringDashboardProps> = ({ analysis }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [equityOnly, setEquityOnly] = useState<boolean>(false);
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredItems = analysis.items.filter(item => {
    const matchSearch = searchTerm === '' ||
      item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operationalIssue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.equityReview.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEquity = !equityOnly || item.equityReview.flagged;
    const matchRisk = riskFilter === 'all' || item.riskAssessment.level === riskFilter;
    return matchSearch && matchEquity && matchRisk;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Executive Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700">
              <span>Agent 2 Result Canvas</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono">Completed at {analysis.completedAt}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Patient Experience & Equity Monitoring Dashboard
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Continuous healthcare equity review, multi-category organizational risk assessment, and operational bottleneck mapping.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
            <span className="text-[11px] font-semibold text-indigo-700 block">Equity Concerns Flagged</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-indigo-900">{analysis.equityConcernsCount}</span>
            <span className="text-[10px] text-indigo-600 block mt-0.5">LEP, Elderly, Disabilities & Rural</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-700 block">High Organizational Risk</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-800">{analysis.riskDistribution.High}</span>
            <span className="text-[10px] text-rose-600 block mt-0.5">Safety & Compliance exposure</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-700 block">Moderate Risk</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-800">{analysis.riskDistribution.Moderate}</span>
            <span className="text-[10px] text-amber-600 block mt-0.5">Operational & Reputational</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 block">Top Systemic Bottlenecks</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{analysis.topOperationalBottlenecks.length}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Mapped hospital processes</span>
          </div>
        </div>
      </div>

      {/* Operational Bottlenecks Callout */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <Building className="w-4 h-4 text-indigo-600" />
          <span>STEP 2: Systemic Operational Bottlenecks Identified</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysis.topOperationalBottlenecks.map((bottleneck, i) => (
            <div key={i} className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span className="font-medium leading-relaxed">{bottleneck}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search equity details, vulnerabilities, patient IDs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={equityOnly}
              onChange={e => setEquityOnly(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span className="font-semibold text-indigo-950">Vulnerable Equity Groups Only</span>
          </label>

          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 py-2 px-2.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Detailed Cases Feed */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <div
            key={item.patientId}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {item.patientId}
                </span>
                <span className="text-xs font-semibold text-indigo-800">
                  Primary: {item.primaryTheme}
                </span>
                {item.secondaryThemes.length > 0 && (
                  <span className="text-xs text-slate-500">
                    (Secondary: {item.secondaryThemes.join(', ')})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  item.riskAssessment.level === 'High' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                  item.riskAssessment.level === 'Moderate' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                  'bg-slate-50 text-slate-700 border border-slate-200'
                }`}>
                  Risk: {item.riskAssessment.level} ({item.riskAssessment.category})
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Patient Feedback Submission
              </span>
              <p className="text-xs text-slate-800 italic leading-relaxed">
                "{item.comment}"
              </p>
            </div>

            {/* Step 3 Equity Review & Step 4 Risk */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              
              <div className={`p-3 rounded-xl border ${
                item.equityReview.flagged
                  ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950'
                  : 'bg-slate-50 border-slate-200/70 text-slate-700'
              }`}>
                <span className="font-semibold block mb-0.5 flex items-center gap-1.5 text-indigo-900">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>STEP 3: Healthcare Equity & Accessibility Review</span>
                </span>
                <p className="leading-relaxed">
                  {item.equityReview.details}
                </p>
                {item.equityReview.flagged && (
                  <span className="inline-block mt-2 font-mono text-[11px] font-semibold text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    Target Cohort: {item.equityReview.group}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-semibold text-slate-800 block mb-0.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
                  <span>STEP 4: Organizational Risk Rationale</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {item.riskAssessment.rationale}
                </p>
              </div>

            </div>

            {/* Step 5 Recommendation */}
            <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs">
              <span className="font-semibold text-teal-900 block mb-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>STEP 5: Managerial Action Recommendation</span>
              </span>
              <p className="text-teal-950 leading-relaxed">
                {item.managerialRecommendation}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
