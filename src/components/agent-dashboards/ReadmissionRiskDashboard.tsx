import React, { useState } from 'react';
import { ReadmissionRiskAnalysis } from '../../types';
import { AlertCircle, ShieldAlert, CheckCircle2, Search, HeartPulse, Truck, PhoneCall, DollarSign, Users, FileText, ArrowRight, Sparkles } from 'lucide-react';

interface ReadmissionRiskDashboardProps {
  analysis: ReadmissionRiskAnalysis;
}

export const ReadmissionRiskDashboard: React.FC<ReadmissionRiskDashboardProps> = ({ analysis }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [barrierFilter, setBarrierFilter] = useState<string>('all');

  const filteredItems = analysis.items.filter(item => {
    const matchSearch = searchTerm === '' ||
      item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryBarrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.careCoordinationAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clinicalAndOperationalImpact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRisk = riskFilter === 'all' || item.riskLevel === riskFilter;
    const matchBarrier = barrierFilter === 'all' || item.primaryBarrier === barrierFilter;
    return matchSearch && matchRisk && matchBarrier;
  });

  return (
    <div className="space-y-6">
      
      {/* REQUIRED FORMAT: Highlight High-Readmission-Risk Cases AT THE TOP */}
      <div className="bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-900 bg-rose-200/80 px-2.5 py-0.5 rounded">
                High 30-Day Readmission Risk Alert ({analysis.highRiskAlerts.length} Patients)
              </span>
              <span className="text-xs text-rose-800 font-mono">
                CMS Hospital Readmission Penalty Exposure
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-rose-950 mt-1">
              Immediate Care Transition Interventions Required
            </h2>
            <p className="text-xs text-rose-900 mt-1 leading-relaxed">
              Patients flagged below present critical transition barriers including medication reconciliation confusion, unaddressed surgical wound infections, missing oxygen concentrators, or lack of transportation.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.highRiskAlerts.map(alert => (
                <span
                  key={alert.patientId}
                  className="font-mono text-xs font-bold bg-white text-rose-900 px-3 py-1 rounded-lg border border-rose-300 shadow-xs flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{alert.patientId}</span>
                  <span className="text-[11px] font-sans font-normal text-slate-600">({alert.primaryBarrier.split('/')[0]})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stratification & Barrier Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <span>Agent 6 Result Canvas</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono">Completed at {analysis.completedAt}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Patient Readmission Risk Stratification & Root Cause Analysis
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Identifies transition gaps, stratifies 30-day readmission risk, isolates primary social/clinical barriers, and prescribes coordinated care interventions.
            </p>
          </div>
        </div>

        {/* Stratification Strip */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-xs font-semibold text-rose-800 block">High Risk Stratum</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-950">
              {analysis.highRiskCount}
            </span>
            <span className="text-[11px] text-rose-700 block mt-0.5">Complex comorbidities / barriers</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-semibold text-amber-800 block">Moderate Risk Stratum</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-950">
              {analysis.moderateRiskCount}
            </span>
            <span className="text-[11px] text-amber-700 block mt-0.5">Mild confusion / follow-up delay</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-800 block">Low Risk Stratum</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-950">
              {analysis.lowRiskCount}
            </span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">Stable recovery / clear plan</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search primary barrier, patient ID, care coordination action..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 py-2 px-2.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="Low">Low Risk</option>
          </select>

          <select
            value={barrierFilter}
            onChange={e => setBarrierFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 py-2 px-2.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All 6 Transition Barriers</option>
            <option value="Medication Non-Adherence / Confusion">Medication Confusion</option>
            <option value="Lack of Transportation / Accessibility">Lack of Transportation</option>
            <option value="Inadequate Discharge Communication">Inadequate Communication</option>
            <option value="Unresolved Clinical Symptoms">Unresolved Symptoms</option>
            <option value="Financial / Insurance Constraints">Financial Constraints</option>
            <option value="Social Isolation / Lack of Caregiver Support">Social Isolation</option>
          </select>
        </div>
      </div>

      {/* Case-by-Case Care Transition Deep Dive */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          const isHigh = item.riskLevel === 'High';

          return (
            <div
              key={item.patientId}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all space-y-4 ${
                isHigh
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {item.patientId}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Step 2 Root Cause: {item.primaryBarrier}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    item.riskLevel === 'High' ? 'bg-rose-100 text-rose-900' :
                    item.riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-900' :
                    'bg-emerald-100 text-emerald-900'
                  }`}>
                    30-Day Risk: {item.riskLevel}
                  </span>

                  {item.aiRiskFlagReview.humanClinicianReviewRequired && (
                    <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Clinician Review Required
                    </span>
                  )}
                </div>
              </div>

              {/* Step 3 Clinical & Operational Impact & Step 4 AI Risk Review */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="font-semibold text-slate-800 block mb-0.5">
                    Step 3: Clinical & Hospital Operational Impact
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {item.clinicalAndOperationalImpact}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="font-semibold text-slate-800 block mb-0.5 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
                    <span>Step 4: AI Risk Flag Review</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {item.aiRiskFlagReview.issue}
                  </p>
                </div>
              </div>

              {/* Step 5 Care Coordination Action */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs">
                <span className="font-semibold text-emerald-950 block mb-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Step 5: Proactive Care Coordination Intervention</span>
                </span>
                <p className="text-emerald-900 leading-relaxed">
                  {item.careCoordinationAction}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* REQUIRED FORMAT: Actionable Care-Coordination Steps AT THE BOTTOM */}
      <div className="bg-white rounded-2xl border border-emerald-300 p-6 shadow-sm bg-gradient-to-br from-emerald-50/40 to-white space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Care Coordination Protocol & Readmission Reduction Action Steps</span>
        </div>
        <p className="text-xs text-slate-600">
          Standardized interventions to prevent avoidable 30-day hospital readmissions:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {analysis.careCoordinationActionSteps.map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white border border-emerald-200 flex items-start gap-2.5">
              <span className="font-mono text-emerald-700 font-bold shrink-0">0{idx + 1}.</span>
              <span className="text-slate-800 font-medium leading-relaxed">{step}</span>
            </div>
          ))}
        </div>

        {/* Step 6: Future Changes Proposal */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-emerald-200 text-xs">
          <span className="font-bold text-emerald-950 block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Step 6: Proposed Future Care Transition Ingestion Enhancements</span>
          </span>
          <p className="text-slate-700 leading-relaxed">
            {analysis.futureCareTransitionProposal}
          </p>
        </div>
      </div>

    </div>
  );
};
