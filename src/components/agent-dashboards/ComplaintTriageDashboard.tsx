import React, { useState } from 'react';
import { ComplaintTriageAnalysis, ComplaintTriageItem } from '../../types';
import { AlertCircle, ShieldAlert, CheckCircle2, UserCheck, ArrowRight, CornerDownRight, Search, ShieldCheck } from 'lucide-react';

interface ComplaintTriageDashboardProps {
  analysis: ComplaintTriageAnalysis;
  onUpdateAnalysis?: (updated: ComplaintTriageAnalysis) => void;
}

export const ComplaintTriageDashboard: React.FC<ComplaintTriageDashboardProps> = ({
  analysis,
  onUpdateAnalysis
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  const handleApproveRouting = (patientId: string) => {
    if (!onUpdateAnalysis) return;
    const updatedItems = analysis.items.map(item => {
      if (item.patientId === patientId) {
        return {
          ...item,
          humanSignOff: {
            status: 'Approved' as const,
            reviewedBy: 'Dr. Sarah Lin, MD (Quality Lead)',
            reviewDate: new Date().toLocaleDateString(),
            notes: 'Verified department routing and confirmed expedited triage.'
          }
        };
      }
      return item;
    });

    onUpdateAnalysis({
      ...analysis,
      items: updatedItems
    });
  };

  const filteredItems = analysis.items.filter(item => {
    const matchSearch = searchTerm === '' ||
      item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.routeTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.severityReasoning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSeverity = selectedSeverity === 'all' || item.severityLevel === selectedSeverity;
    const matchRoute = selectedRoute === 'all' || item.routeTo === selectedRoute;
    return matchSearch && matchSeverity && matchRoute;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Mandatory Non-Resolution Disclaimer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
              <span>Agent 3 Result Canvas</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono">Completed at {analysis.completedAt}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Healthcare Complaint Triage & Routing Console
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Assesses grievance severity across 4 standardized levels, detects legal/clinical liabilities, and routes to appropriate leadership.
            </p>
          </div>
        </div>

        {/* Mandatory Scope Boundary Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-900">Operational Guardrail:</strong> The Complaint Triage Assistant does <em>NOT</em> resolve patient complaints. Its role is strictly to triage severity, spot multi-dimensional risks, mandate human review checkpoints, and route cases to responsible departments.
          </p>
        </div>

        {/* Severity Count Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 block">LEVEL 4 – Critical</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-900">
              {analysis.severityCounts['LEVEL 4 – Critical'] || 0}
            </span>
            <span className="text-[10px] text-rose-600 block mt-0.5">Immediate safety / Legal</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 block">LEVEL 3 – High</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-900">
              {analysis.severityCounts['LEVEL 3 – High'] || 0}
            </span>
            <span className="text-[10px] text-amber-600 block mt-0.5">Potential harm / Meds</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 block">LEVEL 2 – Moderate</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {analysis.severityCounts['LEVEL 2 – Moderate'] || 0}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Repeated service failure</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 block">LEVEL 1 – Low</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {analysis.severityCounts['LEVEL 1 – Low'] || 0}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Minor dissatisfaction</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search complaint text, severity reasoning, routing targets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 py-2 px-2.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All 4 Severity Levels</option>
            <option value="LEVEL 4 – Critical">Level 4 – Critical</option>
            <option value="LEVEL 3 – High">Level 3 – High</option>
            <option value="LEVEL 2 – Moderate">Level 2 – Moderate</option>
            <option value="LEVEL 1 – Low">Level 1 – Low</option>
          </select>

          <select
            value={selectedRoute}
            onChange={e => setSelectedRoute(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 py-2 px-2.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Routing Destinations</option>
            <option value="Risk Management">Risk Management</option>
            <option value="Compliance Office">Compliance Office</option>
            <option value="Nursing Leadership">Nursing Leadership</option>
            <option value="Physician Leadership">Physician Leadership</option>
            <option value="Accessibility Coordinator">Accessibility Coordinator</option>
            <option value="Revenue Cycle / Billing">Revenue Cycle / Billing</option>
            <option value="Quality Improvement Team">Quality Improvement</option>
          </select>
        </div>
      </div>

      {/* Complaints Triage Cards */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          const isCritical = item.severityLevel === 'LEVEL 4 – Critical';
          const isHigh = item.severityLevel === 'LEVEL 3 – High';

          return (
            <div
              key={item.patientId}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all space-y-4 ${
                isCritical
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : isHigh
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {item.patientId}
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    Category: {item.primaryCategory}
                  </span>
                  {item.secondaryCategories.length > 0 && (
                    <span className="text-xs text-slate-500">
                      (Secondary: {item.secondaryCategories.join(', ')})
                    </span>
                  )}
                </div>

                {/* Severity Badge */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    isCritical
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : isHigh
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    {item.severityLevel}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Patient Complaint Submission
                </span>
                <p className="text-xs text-slate-800 italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              {/* Step 2 Severity Reasoning & Step 3 Detected Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                
                {/* Step 2 Reasoning */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="font-semibold text-slate-800 block mb-0.5">
                    STEP 2: Severity Rationale
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {item.severityReasoning}
                  </p>
                </div>

                {/* Step 3 Detected Risks */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="font-semibold text-slate-800 block mb-1">
                    STEP 3: Detected Risk Dimensions ({item.detectedRisks.length})
                  </span>
                  <div className="space-y-1.5">
                    {item.detectedRisks.map((risk, idx) => (
                      <div key={idx} className="text-slate-700 flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold shrink-0">·</span>
                        <div>
                          <strong className="text-slate-900">{risk.riskType}:</strong>{' '}
                          <span className="text-slate-600">{risk.explanation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Step 4 Escalation Recommendation & Human Review Sign-Off */}
              <div className="p-3.5 rounded-xl bg-rose-50/40 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-4 h-4 text-rose-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-rose-950 block">
                      STEP 4: Escalation Routing Recommendation
                    </span>
                    <span className="font-bold text-sm text-rose-900">
                      ROUTE TO: {item.routeTo}
                    </span>
                  </div>
                </div>

                {/* Human Review Checkpoint */}
                <div className="shrink-0 flex items-center gap-2">
                  {item.humanSignOff?.status === 'Approved' ? (
                    <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Route Approved by Human Lead</span>
                    </div>
                  ) : item.requiresHumanIntervention ? (
                    <button
                      onClick={() => handleApproveRouting(item.patientId)}
                      className="px-3 py-1.5 rounded-lg bg-rose-700 text-white hover:bg-rose-800 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve & Dispatch Route</span>
                    </button>
                  ) : (
                    <span className="text-slate-500 font-medium text-[11px]">
                      Automated Routine Queue
                    </span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
