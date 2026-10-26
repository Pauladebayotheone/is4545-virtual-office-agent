import React, { useState } from 'react';
import {
  AgentDefinition,
  AgentId,
  FeedbackInsightAnalysis,
  ExperienceMonitoringAnalysis,
  ComplaintTriageAnalysis,
  HospitalManagerAnalysis,
  HealthcareAnalyticsResult,
  ReadmissionRiskAnalysis
} from '../types';
import { FeedbackInsightDashboard } from './agent-dashboards/FeedbackInsightDashboard';
import { ExperienceMonitoringDashboard } from './agent-dashboards/ExperienceMonitoringDashboard';
import { ComplaintTriageDashboard } from './agent-dashboards/ComplaintTriageDashboard';
import { HospitalManagerDashboard } from './agent-dashboards/HospitalManagerDashboard';
import { HealthcareAnalyticsDashboard } from './agent-dashboards/HealthcareAnalyticsDashboard';
import { ReadmissionRiskDashboard } from './agent-dashboards/ReadmissionRiskDashboard';
import { AgentAvatar } from './AgentAvatar';
import { Play, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

interface AgentResultsViewProps {
  agents: AgentDefinition[];
  activeAgentId: AgentId;
  onSelectActiveAgent: (id: AgentId) => void;
  results: {
    feedback?: FeedbackInsightAnalysis;
    experience?: ExperienceMonitoringAnalysis;
    triage?: ComplaintTriageAnalysis;
    manager?: HospitalManagerAnalysis;
    analytics?: HealthcareAnalyticsResult;
    readmission?: ReadmissionRiskAnalysis;
  };
  onRerunAgent: (id: AgentId) => void;
  onNavigateToSynthesis: () => void;
  onUpdateTriageAnalysis?: (updated: ComplaintTriageAnalysis) => void;
}

export const AgentResultsView: React.FC<AgentResultsViewProps> = ({
  agents,
  activeAgentId,
  onSelectActiveAgent,
  results,
  onRerunAgent,
  onNavigateToSynthesis,
  onUpdateTriageAnalysis
}) => {
  const currentAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  return (
    <div className="space-y-6">
      
      {/* Top Agent Segmented Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Agent Result Rooms:
            </span>
          </div>

          <button
            onClick={onNavigateToSynthesis}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Combined Executive Synthesis</span>
            <ArrowRight className="w-3 h-3 text-teal-600" />
          </button>
        </div>

        {/* 6 Agent Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-100">
          {agents.map(agent => {
            const isActive = activeAgentId === agent.id;
            const hasResult = (
              (agent.id === 'feedback-insight' && !!results.feedback) ||
              (agent.id === 'experience-monitoring' && !!results.experience) ||
              (agent.id === 'complaint-triage' && !!results.triage) ||
              (agent.id === 'hospital-manager' && !!results.manager) ||
              (agent.id === 'healthcare-analytics' && !!results.analytics) ||
              (agent.id === 'readmission-risk' && !!results.readmission)
            );

            return (
              <button
                key={agent.id}
                onClick={() => onSelectActiveAgent(agent.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full mb-1">
                  <span className={`font-mono text-[10px] font-semibold ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    {agent.roomNumber}
                  </span>
                  {hasResult && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-teal-400' : 'bg-emerald-500'}`} />
                  )}
                </div>
                <span className="text-xs font-bold leading-tight truncate w-full block">
                  {agent.name.replace(' Agent', '').replace(' Assistant', '')}
                </span>
                <span className={`text-[10px] truncate block mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {agent.avatarRole}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Agent's Specialized Dashboard */}
      <div>
        {activeAgentId === 'feedback-insight' && results.feedback && (
          <FeedbackInsightDashboard analysis={results.feedback} />
        )}

        {activeAgentId === 'experience-monitoring' && results.experience && (
          <ExperienceMonitoringDashboard analysis={results.experience} />
        )}

        {activeAgentId === 'complaint-triage' && results.triage && (
          <ComplaintTriageDashboard
            analysis={results.triage}
            onUpdateAnalysis={onUpdateTriageAnalysis}
          />
        )}

        {activeAgentId === 'hospital-manager' && results.manager && (
          <HospitalManagerDashboard analysis={results.manager} />
        )}

        {activeAgentId === 'healthcare-analytics' && results.analytics && (
          <HealthcareAnalyticsDashboard analytics={results.analytics} />
        )}

        {activeAgentId === 'readmission-risk' && results.readmission && (
          <ReadmissionRiskDashboard analysis={results.readmission} />
        )}

        {/* Empty state if agent has not yet analyzed */}
        {((activeAgentId === 'feedback-insight' && !results.feedback) ||
          (activeAgentId === 'experience-monitoring' && !results.experience) ||
          (activeAgentId === 'complaint-triage' && !results.triage) ||
          (activeAgentId === 'hospital-manager' && !results.manager) ||
          (activeAgentId === 'healthcare-analytics' && !results.analytics) ||
          (activeAgentId === 'readmission-risk' && !results.readmission)) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <AgentAvatar agentId={activeAgentId} status="idle" size="md" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {currentAgent.name} Analysis Pending
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                This agent has not yet processed the dataset. Click below to run this agent immediately or execute all agents in parallel.
              </p>
            </div>
            <button
              onClick={() => onRerunAgent(activeAgentId)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run {currentAgent.name} Now</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
