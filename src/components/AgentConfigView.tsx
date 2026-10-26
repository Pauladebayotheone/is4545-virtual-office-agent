import React, { useState } from 'react';
import { AgentDefinition, AgentId } from '../types';
import { AgentAvatar } from './AgentAvatar';
import { Play, Check, CheckSquare, Square, Settings2, Sliders, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface AgentConfigViewProps {
  agents: AgentDefinition[];
  selectedAgentIds: Set<AgentId>;
  onToggleSelect: (id: AgentId) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onStartAnalysis: () => void;
  isProcessingAny: boolean;
  totalRecords: number;
}

export const AgentConfigView: React.FC<AgentConfigViewProps> = ({
  agents,
  selectedAgentIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onStartAnalysis,
  isProcessingAny,
  totalRecords
}) => {
  // Config state
  const [modelMode, setModelMode] = useState<'gemini' | 'standard'>('standard');
  const [sensitivityLevel, setSensitivityLevel] = useState<'standard' | 'high'>('high');
  const [equityReviewActive, setEquityReviewActive] = useState<boolean>(true);
  const [hallucinationSafeguards, setHallucinationSafeguards] = useState<boolean>(true);

  const allSelected = selectedAgentIds.size === agents.length;

  return (
    <div className="space-y-6">
      
      {/* Configuration Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <span>Step 2: Task & Multi-Agent Orchestration</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Configure Agent Analytical Tasks
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Select one, several, or all six specialized AI agents to run independently in parallel on the active dataset ({totalRecords} records). Each agent executes its designated workflow per the authoritative specification.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              {allSelected ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Select All 6 Agents</span>
                </>
              )}
            </button>

            <button
              onClick={onStartAnalysis}
              disabled={isProcessingAny || selectedAgentIds.size === 0}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                isProcessingAny
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed'
                  : selectedAgentIds.size === 0
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-teal-700 text-white hover:bg-teal-800'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {isProcessingAny ? 'Processing...' : `Start Parallel Run (${selectedAgentIds.size})`}
              </span>
            </button>
          </div>
        </div>

        {/* Global Agent Engine Options */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <label className="font-semibold text-slate-800 block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Reasoning Engine</span>
            </label>
            <select
              value={modelMode}
              onChange={e => setModelMode(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-md py-1 px-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="standard">ClinicaSuite Certified Engine</option>
              <option value="gemini">Gemini 2.5 Flash Connected</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <label className="font-semibold text-slate-800 block mb-1 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Risk Sensitivity Threshold</span>
            </label>
            <select
              value={sensitivityLevel}
              onChange={e => setSensitivityLevel(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-md py-1 px-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="high">High Sensitivity (Zero-tolerance for safety)</option>
              <option value="standard">Standard Hospital Triage</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <label className="font-semibold text-slate-800 block mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Healthcare Equity Lens</span>
            </label>
            <label className="flex items-center gap-2 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={equityReviewActive}
                onChange={e => setEquityReviewActive(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span className="text-slate-700">Audit LEP, disability & rural equity</span>
            </label>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <label className="font-semibold text-slate-800 block mb-1 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Hallucination Guardrails</span>
            </label>
            <label className="flex items-center gap-2 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={hallucinationSafeguards}
                onChange={e => setHallucinationSafeguards(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span className="text-slate-700">Flag ambiguous facts for human review</span>
            </label>
          </div>
        </div>
      </div>

      {/* Agents Selection & Task Breakdown Cards */}
      <div className="space-y-4">
        {agents.map(agent => {
          const isSelected = selectedAgentIds.has(agent.id);

          return (
            <div
              key={agent.id}
              className={`rounded-2xl border transition-all duration-200 bg-white p-5 shadow-sm ${
                isSelected
                  ? 'border-teal-300 ring-1 ring-teal-200'
                  : 'border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                
                {/* Agent Header Info */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <AgentAvatar agentId={agent.id} status={isSelected ? 'selected' : 'idle'} size="md" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-500">
                        {agent.roomNumber}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                        {agent.avatarRole}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {agent.name}
                    </h3>

                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-xl">
                      {agent.role}
                    </p>
                  </div>
                </div>

                {/* Selection Toggle Control */}
                <div className="shrink-0">
                  <button
                    onClick={() => onToggleSelect(agent.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm ${
                      isSelected
                        ? 'bg-teal-700 text-white hover:bg-teal-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'opacity-0'}`} />
                    <span>{isSelected ? 'Agent Active' : 'Include Agent'}</span>
                  </button>
                </div>
              </div>

              {/* Authoritative Workflow Steps from prompt file */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Assigned Execution Steps (Per Prompt Spec)
                  </span>
                  <div className="space-y-1">
                    {agent.tasks.slice(0, 4).map((task, idx) => (
                      <div key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold shrink-0">✓</span>
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Operational Constraints & Guardrails
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    {agent.constraints}
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
