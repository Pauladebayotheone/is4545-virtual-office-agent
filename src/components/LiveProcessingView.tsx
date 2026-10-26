import React from 'react';
import { AgentDefinition, AgentId, AgentStatus, AnalysisRunState } from '../types';
import { AgentAvatar } from './AgentAvatar';
import { RefreshCw, CheckCircle2, AlertCircle, Play, Pause, RotateCcw, ArrowRight, Activity, Eye } from 'lucide-react';

interface LiveProcessingViewProps {
  agents: AgentDefinition[];
  agentStatuses: Record<AgentId, AgentStatus>;
  runStates: Record<AgentId, AnalysisRunState>;
  onRerunAgent: (id: AgentId) => void;
  onCancelAgent: (id: AgentId) => void;
  onViewResults: (id: AgentId) => void;
  onNavigateToSynthesis: () => void;
  isProcessingAny: boolean;
}

export const LiveProcessingView: React.FC<LiveProcessingViewProps> = ({
  agents,
  agentStatuses,
  runStates,
  onRerunAgent,
  onCancelAgent,
  onViewResults,
  onNavigateToSynthesis,
  isProcessingAny
}) => {
  const completedCount = Object.values(agentStatuses).filter(s => s === 'completed').length;
  const processingCount = Object.values(agentStatuses).filter(s => s === 'processing').length;
  const allCompleted = completedCount > 0 && processingCount === 0;

  return (
    <div className="space-y-6">
      
      {/* Live Processing Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isProcessingAny ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                {isProcessingAny ? 'Parallel Multi-Agent Execution Active' : 'Analysis Run Complete'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Live Analytical Processing Stream
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Active agents process the hospital dataset concurrently. Analytical progress, active steps, generated findings previews, and animated agent avatars update dynamically.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {allCompleted && (
              <button
                onClick={onNavigateToSynthesis}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-all flex items-center gap-2 shadow-sm"
              >
                <span>View Executive Synthesis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Activity className="w-4 h-4 text-slate-500" />
              <span>Parallel Status:</span>
            </div>
            <span className="text-slate-600">
              {processingCount > 0
                ? `${processingCount} agents actively processing`
                : `${completedCount} of ${agents.length} agents completed`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">
              Completed: <strong className="text-slate-900">{completedCount}</strong>/{agents.length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Agent Processing Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map(agent => {
          const status = agentStatuses[agent.id];
          const runState = runStates[agent.id] || {
            status: 'idle',
            progress: 0,
            currentStep: 'Idle',
            stepIndex: 0,
            totalSteps: 6,
            findingsCount: 0,
            latestFindingPreview: 'Awaiting task execution.'
          };

          const isProcessing = status === 'processing';
          const isCompleted = status === 'completed';
          const isError = status === 'error';

          return (
            <div
              key={agent.id}
              className={`rounded-2xl border transition-all duration-300 bg-white p-5 shadow-sm flex flex-col justify-between ${
                isProcessing
                  ? 'border-amber-300 ring-2 ring-amber-200/60 shadow-md'
                  : isCompleted
                  ? 'border-emerald-200 ring-1 ring-emerald-100'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Station Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="shrink-0">
                      <AgentAvatar
                        agentId={agent.id}
                        status={status}
                        size="md"
                        showAnimation={true}
                      />
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

                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {agent.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                        <span>Processing</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed</span>
                      </span>
                    ) : isError ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Error</span>
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        Standby
                      </span>
                    )}
                  </div>
                </div>

                {/* Analytical Step & Progress Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[280px]">
                      {runState.currentStep}
                    </span>
                    <span className="font-mono tabular-nums font-bold text-slate-700">
                      {runState.progress}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isProcessing ? 'bg-amber-500 animate-pulse' :
                        isCompleted ? 'bg-emerald-600' :
                        isError ? 'bg-rose-500' : 'bg-slate-300'
                      }`}
                      style={{ width: `${runState.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Stage {runState.stepIndex} of {runState.totalSteps}</span>
                    <span>{runState.findingsCount} findings generated</span>
                  </div>
                </div>

                {/* Real-Time Newly Generated Finding Preview */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Latest Analytical Output Preview
                  </span>
                  <p className="text-slate-700 italic line-clamp-2 leading-relaxed">
                    "{runState.latestFindingPreview}"
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isProcessing ? (
                    <button
                      onClick={() => onCancelAgent(agent.id)}
                      className="text-xs font-medium text-slate-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                    >
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onRerunAgent(agent.id)}
                      className="text-xs font-medium text-slate-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rerun Agent</span>
                    </button>
                  )}
                </div>

                {isCompleted && (
                  <button
                    onClick={() => onViewResults(agent.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-600" />
                    <span>View Dashboard</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
