import React, { useState } from 'react';
import { HospitalManagerAnalysis } from '../../types';
import { AlertOctagon, ShieldAlert, CheckCircle2, Search, ArrowRight, UserCheck, HelpCircle } from 'lucide-react';

interface HospitalManagerDashboardProps {
  analysis: HospitalManagerAnalysis;
}

export const HospitalManagerDashboard: React.FC<HospitalManagerDashboardProps> = ({ analysis }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [humanReviewOnly, setHumanReviewOnly] = useState<boolean>(false);

  const filteredCases = analysis.cases.filter(c => {
    const matchSearch = searchTerm === '' ||
      c.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mainProblem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.serviceLine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    const matchHR = !humanReviewOnly || c.humanReviewNeeded;
    return matchSearch && matchPriority && matchHR;
  });

  return (
    <div className="space-y-6">
      
      {/* REQUIRED FORMAT: Top Most Important Management Alert */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded">
                Executive Management Alert #1 (Priority 1)
              </span>
              <span className="text-xs text-amber-800 font-mono">
                Affected: {analysis.topManagementAlert.affectedServiceLines.join(', ')}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-amber-950 mt-1">
              {analysis.topManagementAlert.headline}
            </h2>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              {analysis.topManagementAlert.context}
            </p>
          </div>
        </div>
      </div>

      {/* Case Management Overview Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <span>Agent 4 Result Canvas</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono">Completed at {analysis.completedAt}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Hospital Operations Case Matrix & Management Priority
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Stratifies operational concerns, explains managerial priority, details AI risk flags, and assigns targeted managerial remedies.
            </p>
          </div>
        </div>

        {/* Priority Counts */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-xs font-semibold text-rose-800 block">High Priority Cases</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-950">
              {analysis.priorityDistribution.High}
            </span>
            <span className="text-[11px] text-rose-700 block mt-0.5">Immediate operational intervention</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-semibold text-amber-800 block">Medium Priority Cases</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-950">
              {analysis.priorityDistribution.Medium}
            </span>
            <span className="text-[11px] text-amber-700 block mt-0.5">Service recovery & protocol update</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-700 block">Low Priority Cases</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {analysis.priorityDistribution.Low}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Standard quality tracking</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search main problem, service lines, persona, patient IDs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={humanReviewOnly}
              onChange={e => setHumanReviewOnly(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <span className="font-semibold text-amber-950">Human Review Needed Only</span>
          </label>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 py-2 px-2.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="space-y-4">
        {filteredCases.map(item => {
          const isHigh = item.priority === 'High';

          return (
            <div
              key={item.patientId}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all space-y-4 ${
                isHigh
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : 'border-slate-200'
              }`}
            >
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {item.patientId}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {item.persona}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {item.serviceLine}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-500">
                    Sat: {item.satisfactionScore}/5 | Comm: {item.communicationRating}/5
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    item.priority === 'High' ? 'bg-rose-100 text-rose-900' :
                    item.priority === 'Medium' ? 'bg-amber-100 text-amber-900' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    Priority: {item.priority}
                  </span>

                  {item.humanReviewNeeded && (
                    <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Human Review Required
                    </span>
                  )}
                </div>
              </div>

              {/* 1. Main Problem */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">
                  1. Operational Problem Identified
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {item.mainProblem}
                </p>
              </div>

              {/* 2 & 3. Priority Reasoning & AI Risk Flag review */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="font-semibold text-slate-800 block mb-0.5">
                    3. Priority Rating Rationale
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {item.priorityReasoning}
                  </p>
                </div>

                <div className={`p-3 rounded-xl border ${
                  item.aiRiskFlag !== 'None'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-slate-50 border-slate-200/70 text-slate-700'
                }`}>
                  <span className="font-semibold block mb-0.5 flex items-center gap-1.5 text-amber-900">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>AI Risk Flag Vetting: {item.aiRiskFlag}</span>
                  </span>
                  <p className="leading-relaxed">
                    {item.aiRiskExplanation || 'No hallucination, bias, or contradictory record risks detected in patient chart.'}
                  </p>
                </div>
              </div>

              {/* 4. Recommended Management Actions */}
              <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs">
                <span className="font-semibold text-teal-900 block mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>4. Recommended Management Actions</span>
                </span>
                <ul className="space-y-1">
                  {item.recommendedActions.map((act, i) => (
                    <li key={i} className="text-teal-950 flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold shrink-0">·</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          );
        })}
      </div>

      {/* REQUIRED FORMAT: At the bottom, provide 2–3 recommended management actions */}
      <div className="bg-white rounded-2xl border border-teal-300 p-6 shadow-sm bg-gradient-to-br from-teal-50/40 to-white">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Executive Summary: Core Management Actions For Leadership</span>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Synthesized strategic interventions based on all analyzed operational cases:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {analysis.overallActionPlan.map((action, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-teal-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold text-teal-700 block mb-1">
                  ACTION STEP 0{idx + 1}
                </span>
                <p className="font-medium text-slate-800 leading-relaxed">
                  {action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
