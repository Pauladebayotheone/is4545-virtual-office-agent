import React, { useState } from 'react';
import {
  CrossAgentFinding,
  ConflictingInterpretation,
  HumanReviewItem,
  AgentDefinition,
  PatientRecord
} from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Building,
  HelpCircle,
  Download,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CombinedDashboardProps {
  findings: CrossAgentFinding[];
  conflicts: ConflictingInterpretation[];
  humanReviewQueue: HumanReviewItem[];
  agents: AgentDefinition[];
  records: PatientRecord[];
  onUpdateReviewStatus: (reviewId: string, status: HumanReviewItem['status'], notes?: string) => void;
}

export const CombinedDashboard: React.FC<CombinedDashboardProps> = ({
  findings,
  conflicts,
  humanReviewQueue,
  agents,
  records,
  onUpdateReviewStatus
}) => {
  const [selectedReviewItem, setSelectedReviewItem] = useState<HumanReviewItem | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(findings[0]?.id || null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const pendingReviewCount = humanReviewQueue.filter(q => q.status === 'Pending Review').length;
  const approvedReviewCount = humanReviewQueue.filter(q => q.status === 'Approved').length;

  const handleOpenReview = (item: HumanReviewItem) => {
    setSelectedReviewItem(item);
    setReviewerNotes(item.reviewerNotes || '');
  };

  const handleSaveDecision = (status: HumanReviewItem['status']) => {
    if (!selectedReviewItem) return;
    onUpdateReviewStatus(selectedReviewItem.id, status, reviewerNotes);
    setSelectedReviewItem(null);
  };

  const exportConsolidatedReport = () => {
    const reportData = {
      title: 'ClinicaSuite Multi-Agent Executive Quality & Safety Synthesis',
      generatedAt: new Date().toISOString(),
      executiveSummary: 'Synthesized findings across six autonomous clinical AI agents analyzing hospital patient experience and risk dataset.',
      crossAgentFindings: findings,
      conflictsIdentified: conflicts,
      humanReviewQueue: humanReviewQueue
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'ClinicaSuite_Executive_Synthesis_Report.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Command Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Multi-Agent Consensus & Executive Synthesis</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Combined Clinical Quality & Governance Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Synthesizes outputs across all specialized healthcare AI agents. Correlates cross-agent consensus findings, surfaces conflicting interpretations, and enforces human-review sign-offs before operational action.
            </p>
          </div>

          <button
            onClick={exportConsolidatedReport}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-all flex items-center gap-2 shadow-sm shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Executive Report</span>
          </button>
        </div>

        {/* Synthesis KPI Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
            <span className="text-[11px] font-semibold text-teal-800 block">Cross-Agent Consensus</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-teal-950">{findings.length}</span>
            <span className="text-[10px] text-teal-700 block mt-0.5">Validated by &ge;2 agents</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 block">Conflicting Interpretations</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-950">{conflicts.length}</span>
            <span className="text-[10px] text-amber-700 block mt-0.5">Divergences reconciled</span>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 block">Pending Human Review</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-950">{pendingReviewCount}</span>
            <span className="text-[10px] text-rose-700 block mt-0.5">Mandatory clinical sign-off</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">Human Approvals</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-950">{approvedReviewCount}</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">Decisions verified</span>
          </div>
        </div>
      </div>

      {/* Human Review Checkpoint Queue */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Human-in-the-Loop Clinical Review Queue</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              High-risk cases flagged by agents requiring human clinician or executive review before operational implementation.
            </p>
          </div>
          <span className="text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {pendingReviewCount} Pending Sign-Offs
          </span>
        </div>

        <div className="space-y-3">
          {humanReviewQueue.map(item => {
            const isApproved = item.status === 'Approved';
            const isPending = item.status === 'Pending Review';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isApproved
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {item.patientId}
                    </span>
                    <span className="font-semibold text-rose-900">
                      Reason: {item.reason}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">
                      Flagged by: {item.flaggedBy.join(', ')}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">AI Recommendation:</strong> {item.aiRecommendation}
                  </p>

                  {item.reviewerNotes && (
                    <p className="text-emerald-800 bg-white/80 p-2 rounded border border-emerald-200">
                      <strong>Human Reviewer Decision:</strong> {item.reviewerNotes} ({item.reviewedBy || 'Manager'} on {item.reviewedAt})
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Approved</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenReview(item)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Review & Approve</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cross-Agent Consensus Findings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <span>Cross-Agent Consensus Findings ({findings.length})</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Key systemic vulnerabilities confirmed independently by multiple specialized AI agents analyzing the dataset.
          </p>
        </div>

        <div className="space-y-4">
          {findings.map(finding => {
            const isExpanded = expandedFindingId === finding.id;

            return (
              <div
                key={finding.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5 shadow-xs space-y-3"
              >
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedFindingId(isExpanded ? null : finding.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        finding.urgency === 'Critical' ? 'bg-rose-100 text-rose-900' :
                        finding.urgency === 'High' ? 'bg-amber-100 text-amber-900' :
                        'bg-teal-100 text-teal-900'
                      }`}>
                        {finding.urgency} Urgency
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        Service Line: {finding.serviceLineAffected}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {finding.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                      {finding.supportingAgents.length} Agents Supporting
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {finding.consensusSummary}
                </p>

                {/* Supporting Agent Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500">Supporting Agents:</span>
                  {finding.supportingAgents.map(aid => {
                    const ag = agents.find(a => a.id === aid);
                    return (
                      <span
                        key={aid}
                        className="text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs"
                      >
                        {ag?.name || aid}
                      </span>
                    );
                  })}
                </div>

                {/* Expandable Supporting Evidence & Recommendation */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                      <span className="font-bold text-teal-950 block mb-0.5">
                        Actionable Synthesis Recommendation
                      </span>
                      <p className="text-teal-900 leading-relaxed">
                        {finding.actionableRecommendation}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">
                        Supporting Evidence From Primary Dataset
                      </span>
                      <ul className="space-y-1 text-slate-600">
                        {finding.evidenceSnippets.map((ev, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-teal-600 font-bold shrink-0">·</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conflicting Interpretations Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Conflicting Interpretations & Divergence Matrix ({conflicts.length})</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparently highlights where agents differed in sentiment scoring or risk triage, with explicit clinical resolution guidance.
          </p>
        </div>

        <div className="space-y-4">
          {conflicts.map(conflict => (
            <div key={conflict.id} className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-amber-200">
                  Case {conflict.patientId}
                </span>
                <span className="text-amber-800 font-semibold">
                  Requires Clinical Manager Reconciliation
                </span>
              </div>

              <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200">
                "{conflict.commentSnippet}"
              </p>

              {/* Side-by-side agent divergence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-teal-800 block mb-0.5">
                    Agent Interpretation A ({conflict.divergence.agentA.id})
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {conflict.divergence.agentA.claim}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-rose-800 block mb-0.5">
                    Agent Interpretation B ({conflict.divergence.agentB.id})
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {conflict.divergence.agentB.claim}
                  </p>
                </div>
              </div>

              {/* Resolution Guidance */}
              <div className="p-3 rounded-xl bg-white border border-amber-200 text-amber-950">
                <span className="font-bold block mb-0.5">
                  Resolution & Human Guidance
                </span>
                <p className="text-amber-900 leading-relaxed">
                  {conflict.resolutionGuidance}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Areas Where Additional Data is Needed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-600" />
          <span>Recommended Follow-Up & Clinical Data Expansion</span>
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Based on ambiguity traps and cross-agent synthesis, the following primary data gaps must be integrated into future cycles:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-1">1. Real-Time Pharmacy Fill Logs</strong>
            <p className="text-slate-600">Cross-reference post-discharge prescriptions with retail pharmacy dispensing records to detect non-adherence within 48 hours.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-1">2. DME Delivery Telemetry</strong>
            <p className="text-slate-600">Integrate digital dispatch receipts from medical oxygen and assistive equipment vendors to prevent unassisted home releases.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-1">3. Caregiver Language Proficiency Flags</strong>
            <p className="text-slate-600">Add mandatory secondary contact language preferences to EHR registration to ensure instructions match family caregiver capabilities.</p>
          </div>
        </div>
      </div>

      {/* Human Review Modal */}
      {selectedReviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>Professional Review Sign-Off: {selectedReviewItem.patientId}</span>
              </h3>
              <button
                onClick={() => setSelectedReviewItem(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                  Source Evidence (Patient Feedback Narrative)
                </span>
                <p className="text-slate-800 italic">
                  "{selectedReviewItem.evidence}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                <span className="font-bold block mb-0.5">AI Flag & Observation</span>
                <p>{selectedReviewItem.aiObservation}</p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Human Clinical Decision & Notes:
                </label>
                <textarea
                  rows={3}
                  value={reviewerNotes}
                  onChange={e => setReviewerNotes(e.target.value)}
                  placeholder="Enter reviewer judgment, department action plan, or clinical override..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedReviewItem(null)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveDecision('Approved')}
                className="px-4 py-1.5 rounded-lg bg-teal-700 text-white font-semibold hover:bg-teal-800"
              >
                Approve & Execute Action
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
