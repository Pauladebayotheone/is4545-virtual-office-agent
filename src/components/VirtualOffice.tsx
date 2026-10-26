import React from 'react';
import { AgentDefinition, AgentId, AgentStatus, AnalysisRunState } from '../types';
import { AgentRoom } from './AgentRoom';
import { Building2, UploadCloud, Play, CheckSquare, Square, ShieldCheck, BarChart3, Activity } from 'lucide-react';

interface VirtualOfficeProps {
  agents: AgentDefinition[];
  agentStatuses: Record<AgentId, AgentStatus>;
  runStates: Record<AgentId, AnalysisRunState>;
  selectedAgentIds: Set<AgentId>;
  onToggleSelect: (id: AgentId) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onOpenWorkspace: (agent: AgentDefinition) => void;
  onViewResults: (id: AgentId) => void;
  onNavigateToUpload: () => void;
  onNavigateToSynthesis: () => void;
  onStartAnalysis: () => void;
  isProcessingAny: boolean;
  totalRecords: number;
}

export const VirtualOffice: React.FC<VirtualOfficeProps> = ({
  agents,
  agentStatuses,
  runStates,
  selectedAgentIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onOpenWorkspace,
  onViewResults,
  onNavigateToUpload,
  onNavigateToSynthesis,
  onStartAnalysis,
  isProcessingAny,
  totalRecords
}) => {
  // Aggregate status counts
  const counts = {
    idle: 0,
    selected: 0,
    processing: 0,
    completed: 0,
    error: 0
  };

  agents.forEach(a => {
    const st = agentStatuses[a.id];
    if (st === 'processing') counts.processing++;
    else if (st === 'completed') counts.completed++;
    else if (st === 'error') counts.error++;
    else if (selectedAgentIds.has(a.id)) counts.selected++;
    else counts.idle++;
  });

  const allSelected = selectedAgentIds.size === agents.length;
  const anyCompleted = counts.completed > 0;

  return (
    <div className="space-y-6">
      
      {/* Office Facility Header & Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Department of Clinical Quality & Patient Safety
              </span>
              <span className="text-slate-300" aria-hidden="true">/</span>
              <span className="text-xs font-medium text-slate-500">
                AI Agent Collaborative Floor
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans text-balance">
              Clinical Multi-Agent Virtual Office
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Six autonomous healthcare AI agents stationed in dedicated virtual offices. Upload hospital datasets, select agents to execute parallel clinical analyses, and review individual outputs or synthesized executive risk reports.
            </p>
          </div>

          {/* Quick Action Station */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onNavigateToUpload}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4 text-slate-500" />
              <span>Dataset ({totalRecords} records)</span>
            </button>

            {anyCompleted && (
              <button
                onClick={onNavigateToSynthesis}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-50 text-teal-900 border border-teal-300 hover:bg-teal-100 transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Executive Synthesis</span>
              </button>
            )}

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
                {isProcessingAny
                  ? 'Parallel Analysis in Progress...'
                  : `Launch ${selectedAgentIds.size} Selected`}
              </span>
            </button>
          </div>
        </div>

        {/* Shared Activity Overview Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Activity className="w-4 h-4 text-slate-500" />
              <span>Agent Status Registry:</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Idle:</span>
              <span className="font-mono tabular-nums font-bold">{counts.idle}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Selected:</span>
              <span className="font-mono tabular-nums font-bold">{counts.selected}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Processing:</span>
              <span className="font-mono tabular-nums font-bold">{counts.processing}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Completed:</span>
              <span className="font-mono tabular-nums font-bold">{counts.completed}</span>
            </div>

            {counts.error > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Error:</span>
                <span className="font-mono tabular-nums font-bold">{counts.error}</span>
              </div>
            )}
          </div>

          {/* Selection Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              {allSelected ? (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-500" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Select All 6 Agents</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Virtual Office Floor Plan - 6 Agent Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => {
          const runState = runStates[agent.id];
          return (
            <AgentRoom
              key={agent.id}
              agent={agent}
              status={agentStatuses[agent.id]}
              isSelected={selectedAgentIds.has(agent.id)}
              onToggleSelect={onToggleSelect}
              onOpenWorkspace={onOpenWorkspace}
              onViewResults={onViewResults}
              progress={runState?.progress || 0}
              currentStep={runState?.currentStep}
            />
          );
        })}
      </div>

    </div>
  );
};
