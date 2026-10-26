import React from 'react';
import { AgentDefinition, AgentStatus } from '../types';
import { AgentAvatar } from './AgentAvatar';
import { Check, Play, ArrowRight, Info, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface AgentRoomProps {
  agent: AgentDefinition;
  status: AgentStatus;
  isSelected: boolean;
  onToggleSelect: (id: AgentDefinition['id']) => void;
  onOpenWorkspace: (agent: AgentDefinition) => void;
  onViewResults: (id: AgentDefinition['id']) => void;
  progress?: number;
  currentStep?: string;
}

export const AgentRoom: React.FC<AgentRoomProps> = ({
  agent,
  status,
  isSelected,
  onToggleSelect,
  onOpenWorkspace,
  onViewResults,
  progress = 0,
  currentStep
}) => {
  const isProcessing = status === 'processing';
  const isCompleted = status === 'completed';
  const isError = status === 'error';

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 bg-white shadow-sm flex flex-col justify-between overflow-hidden ${
        isProcessing
          ? 'border-amber-300 ring-2 ring-amber-200/50 shadow-md'
          : isSelected
          ? 'border-teal-300 ring-1 ring-teal-200 shadow-sm'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Room Header Architectural Bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {agent.roomNumber}
          </span>
          <span className="text-xs text-slate-500 font-medium tracking-tight">
            Clinical Wing A
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5">
          {isProcessing ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
              <span>Analyzing</span>
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Complete</span>
            </span>
          ) : isError ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              <span>Error</span>
            </span>
          ) : isSelected ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <Check className="w-3 h-3 text-teal-600" />
              <span>Selected</span>
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-600">
              Idle
            </span>
          )}
        </div>
      </div>

      {/* Main Room Interior with Avatar & Desk */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Avatar and Agent Identity */}
          <div className="flex items-start gap-4">
            <button
              onClick={() => onOpenWorkspace(agent)}
              className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-2xl group/avatar"
              title="Click to view agent workspace & analytical functions"
            >
              <AgentAvatar agentId={agent.id} status={status} size="lg" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold tracking-wide uppercase text-teal-700">
                  {agent.avatarRole}
                </span>
                {/* Agent Selection Toggle */}
                <button
                  onClick={() => onToggleSelect(agent.id)}
                  aria-label={isSelected ? `Deselect ${agent.name}` : `Select ${agent.name}`}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-teal-700 border-teal-700 text-white shadow-sm'
                      : 'border-slate-300 hover:border-slate-400 bg-white text-transparent'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'text-white' : 'opacity-0'}`} />
                </button>
              </div>

              <h3
                onClick={() => onOpenWorkspace(agent)}
                className="text-base font-bold text-slate-900 leading-snug mt-0.5 hover:text-teal-700 cursor-pointer transition-colors text-balance"
              >
                {agent.name}
              </h3>

              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {agent.shortDescription}
              </p>
            </div>
          </div>

          {/* Primary Analytical Functions (Clean unboxed list) */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Primary Functions
            </span>
            <ul className="space-y-1">
              {agent.keyFunctions.slice(0, 3).map((func, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold shrink-0">·</span>
                  <span className="truncate">{func}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live Progress Bar if Processing */}
        {isProcessing && (
          <div className="mt-4 pt-3 border-t border-amber-100">
            <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
              <span className="font-semibold truncate max-w-[190px]">
                {currentStep || 'Analyzing data...'}
              </span>
              <span className="font-mono tabular-nums font-bold text-amber-700">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Completed State Summary & Action Buttons */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenWorkspace(agent)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>View Tasks</span>
          </button>

          {isCompleted ? (
            <button
              onClick={() => onViewResults(agent.id)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors flex items-center gap-1.5"
            >
              <span>View Results</span>
              <ArrowRight className="w-3 h-3 text-teal-600" />
            </button>
          ) : (
            <button
              onClick={() => onToggleSelect(agent.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isSelected ? 'Selected' : 'Select Agent'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
