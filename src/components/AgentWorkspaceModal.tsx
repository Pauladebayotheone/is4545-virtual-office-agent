import React from 'react';
import { AgentDefinition, AgentStatus } from '../types';
import { AgentAvatar } from './AgentAvatar';
import { Check, Play, ArrowRight, ShieldCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface AgentWorkspaceModalProps {
  agent: AgentDefinition;
  status: AgentStatus;
  isSelected: boolean;
  onToggleSelect: (id: AgentDefinition['id']) => void;
  onRunSingleAgent: (id: AgentDefinition['id']) => void;
  onViewResults: (id: AgentDefinition['id']) => void;
  onClose: () => void;
}

export const AgentWorkspaceModal: React.FC<AgentWorkspaceModalProps> = ({
  agent,
  status,
  isSelected,
  onToggleSelect,
  onRunSingleAgent,
  onViewResults,
  onClose
}) => {
  const isCompleted = status === 'completed';
  const isProcessing = status === 'processing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-xs max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <AgentAvatar agentId={agent.id} status={status} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {agent.roomNumber}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  {agent.avatarRole}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {agent.name}
              </h2>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {agent.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold text-base p-1"
          >
            ✕
          </button>
        </div>

        {/* Tasks Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-xs">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Assigned Operational Tasks (Authoritative Specification)</span>
          </h3>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            {agent.tasks.map((task, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-700">
                <span className="text-teal-600 font-bold shrink-0">·</span>
                <span className="leading-relaxed">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints & Guardrails */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Constraints & Responsible Healthcare AI Guardrails</span>
          </h3>
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-950 leading-relaxed">
            {agent.constraints}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => onToggleSelect(agent.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors ${
              isSelected
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600' : 'opacity-0'}`} />
            <span>{isSelected ? 'Agent Selected' : 'Select Agent'}</span>
          </button>

          <div className="flex items-center gap-2">
            {isCompleted && (
              <button
                onClick={() => {
                  onClose();
                  onViewResults(agent.id);
                }}
                className="px-4 py-2 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 font-semibold text-xs flex items-center gap-1.5"
              >
                <span>View Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onRunSingleAgent(agent.id);
              }}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg bg-teal-700 text-white hover:bg-teal-800 font-semibold text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isProcessing ? 'Analyzing...' : 'Run Single Agent'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
