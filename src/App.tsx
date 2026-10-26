import React, { useState, useEffect, useRef } from 'react';
import {
  ActiveScreen,
  AgentId,
  AgentStatus,
  AnalysisRunState,
  PatientRecord,
  FeedbackInsightAnalysis,
  ExperienceMonitoringAnalysis,
  ComplaintTriageAnalysis,
  HospitalManagerAnalysis,
  HealthcareAnalyticsResult,
  ReadmissionRiskAnalysis,
  CrossAgentFinding,
  ConflictingInterpretation,
  HumanReviewItem,
  AgentDefinition
} from './types';
import { AGENT_DEFINITIONS } from './data/agentDefinitions';
import { SAMPLE_PATIENT_RECORDS } from './data/sampleDataset';
import {
  analyzePatientFeedbackInsight,
  analyzePatientExperienceMonitoring,
  analyzeComplaintTriage,
  analyzeHospitalManagerSupport,
  analyzeHealthcareAnalytics,
  analyzePatientReadmissionRisk,
  generateCrossAgentInsights
} from './services/agentEngines';

import { Navigation } from './components/Navigation';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { VirtualOffice } from './components/VirtualOffice';
import { DataUploadView } from './components/DataUploadView';
import { AgentConfigView } from './components/AgentConfigView';
import { LiveProcessingView } from './components/LiveProcessingView';
import { AgentResultsView } from './components/AgentResultsView';
import { CombinedDashboard } from './components/CombinedDashboard';
import { AgentWorkspaceModal } from './components/AgentWorkspaceModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('virtual-office');
  const [records, setRecords] = useState<PatientRecord[]>(SAMPLE_PATIENT_RECORDS);
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<AgentId>>(
    new Set<AgentId>(['feedback-insight', 'experience-monitoring', 'complaint-triage', 'hospital-manager', 'healthcare-analytics', 'readmission-risk'])
  );

  const [activeResultsAgentId, setActiveResultsAgentId] = useState<AgentId>('feedback-insight');
  const [workspaceModalAgent, setWorkspaceModalAgent] = useState<AgentDefinition | null>(null);

  // Agent Statuses
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentId, AgentStatus>>({
    'feedback-insight': 'completed',
    'experience-monitoring': 'completed',
    'complaint-triage': 'completed',
    'hospital-manager': 'completed',
    'healthcare-analytics': 'completed',
    'readmission-risk': 'completed'
  });

  // Run states for progress reporting
  const [runStates, setRunStates] = useState<Record<AgentId, AnalysisRunState>>({
    'feedback-insight': {
      agentId: 'feedback-insight',
      status: 'completed',
      progress: 100,
      currentStep: 'Step 6: Recommended Action Generated',
      stepIndex: 6,
      totalSteps: 6,
      findingsCount: 18,
      latestFindingPreview: 'Completed comprehensive 6-step qualitative feedback insight analysis.'
    },
    'experience-monitoring': {
      agentId: 'experience-monitoring',
      status: 'completed',
      progress: 100,
      currentStep: 'STEP 5: Managerial Recommendations Ready',
      stepIndex: 5,
      totalSteps: 5,
      findingsCount: 18,
      latestFindingPreview: 'Equity review and organizational risk assessments finalized across all cohorts.'
    },
    'complaint-triage': {
      agentId: 'complaint-triage',
      status: 'completed',
      progress: 100,
      currentStep: 'STEP 4: Escalation Routing Completed',
      stepIndex: 4,
      totalSteps: 4,
      findingsCount: 18,
      latestFindingPreview: 'Assigned 4-level severity rankings and dispatched departmental routing tickets.'
    },
    'hospital-manager': {
      agentId: 'hospital-manager',
      status: 'completed',
      progress: 100,
      currentStep: 'Management Actions Synthesized',
      stepIndex: 5,
      totalSteps: 5,
      findingsCount: 18,
      latestFindingPreview: 'High-priority management alert and operational intervention matrix compiled.'
    },
    'healthcare-analytics': {
      agentId: 'healthcare-analytics',
      status: 'completed',
      progress: 100,
      currentStep: 'Section 6: Strategic Roadmaps Finalized',
      stepIndex: 6,
      totalSteps: 6,
      findingsCount: 24,
      latestFindingPreview: 'Executive dashboard compiled across KPIs, NLP clouds, and 3-month quick wins.'
    },
    'readmission-risk': {
      agentId: 'readmission-risk',
      status: 'completed',
      progress: 100,
      currentStep: 'Step 6: Care Transition Proposal Ready',
      stepIndex: 6,
      totalSteps: 6,
      findingsCount: 18,
      latestFindingPreview: 'Stratified 30-day readmission risk and structured care coordination pathways.'
    }
  });

  // Initial Pre-computed Results
  const [results, setResults] = useState<{
    feedback?: FeedbackInsightAnalysis;
    experience?: ExperienceMonitoringAnalysis;
    triage?: ComplaintTriageAnalysis;
    manager?: HospitalManagerAnalysis;
    analytics?: HealthcareAnalyticsResult;
    readmission?: ReadmissionRiskAnalysis;
  }>(() => {
    return {
      feedback: analyzePatientFeedbackInsight(SAMPLE_PATIENT_RECORDS),
      experience: analyzePatientExperienceMonitoring(SAMPLE_PATIENT_RECORDS),
      triage: analyzeComplaintTriage(SAMPLE_PATIENT_RECORDS),
      manager: analyzeHospitalManagerSupport(SAMPLE_PATIENT_RECORDS),
      analytics: analyzeHealthcareAnalytics(SAMPLE_PATIENT_RECORDS),
      readmission: analyzePatientReadmissionRisk(SAMPLE_PATIENT_RECORDS)
    };
  });

  // Cross-agent synthesis state
  const [crossFindings, setCrossFindings] = useState<CrossAgentFinding[]>([]);
  const [conflicts, setConflicts] = useState<ConflictingInterpretation[]>([]);
  const [humanReviewQueue, setHumanReviewQueue] = useState<HumanReviewItem[]>([]);

  // Update synthesis when results or records change
  useEffect(() => {
    const syn = generateCrossAgentInsights(records, results);
    setCrossFindings(syn.crossAgentFindings);
    setConflicts(syn.conflictingInterpretations);
    setHumanReviewQueue(syn.humanReviewQueue);
  }, [records, results]);

  // Toggle selection
  const handleToggleSelect = (id: AgentId) => {
    const next = new Set(selectedAgentIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAgentIds(next);

    setAgentStatuses(prev => ({
      ...prev,
      [id]: next.has(id) ? (prev[id] === 'completed' ? 'completed' : 'selected') : 'idle'
    }));
  };

  const handleSelectAll = () => {
    const all = new Set(AGENT_DEFINITIONS.map(a => a.id));
    setSelectedAgentIds(all);
    setAgentStatuses(prev => {
      const next = { ...prev };
      AGENT_DEFINITIONS.forEach(a => {
        if (next[a.id] !== 'completed') next[a.id] = 'selected';
      });
      return next;
    });
  };

  const handleDeselectAll = () => {
    setSelectedAgentIds(new Set());
    setAgentStatuses(prev => {
      const next = { ...prev };
      AGENT_DEFINITIONS.forEach(a => {
        if (next[a.id] !== 'completed') next[a.id] = 'idle';
      });
      return next;
    });
  };

  // Run analytical processing for selected agents
  const isProcessingAny = Object.values(agentStatuses).some(s => s === 'processing');

  const startAnalysisForAgents = (agentIdsToRun: AgentId[]) => {
    if (agentIdsToRun.length === 0) return;

    setActiveScreen('live-processing');

    // Set statuses to processing
    setAgentStatuses(prev => {
      const updated = { ...prev };
      agentIdsToRun.forEach(id => {
        updated[id] = 'processing';
      });
      return updated;
    });

    // Step sequences per agent
    const stepDefinitions: Record<AgentId, string[]> = {
      'feedback-insight': [
        'Step 1. Classifying Theme (9 categories)...',
        'Step 2. Scoring Sentiment (Pos/Neg/Neut/Mixed)...',
        'Step 3. Formulating Decision Reasoning...',
        'Step 4. Isolating Operational Bottlenecks...',
        'Step 5. Auditing Risk & Cultural Bias Concerns...',
        'Step 6. Synthesizing Quality-Improvement Action...'
      ],
      'experience-monitoring': [
        'STEP 1: Theme & Multi-Category Tagging...',
        'STEP 2: Operational Issue & Bottleneck Mapping...',
        'STEP 3: Healthcare Equity & Accessibility Review...',
        'STEP 4: Multi-Dimensional Risk Assessment...',
        'STEP 5: Managerial Recommendations Formulated...'
      ],
      'complaint-triage': [
        'STEP 1: Complaint Categorization (10 hospital categories)...',
        'STEP 2: Rigorous 4-Level Severity Scoring...',
        'STEP 3: Risk Detection (Clinical, Privacy, Legal)...',
        'STEP 4: Escalation Routing & Leadership Dispatch...'
      ],
      'hospital-manager': [
        'Analyzing Persona, Service Lines & Portals...',
        'Rating Management Priorities (Low/Med/High)...',
        'Vetting AI Risk Flags (Hallucination & Bias)...',
        'Recommending 1-2 Direct Management Actions...',
        'Compiling Top Alert & Overall Action Plan...'
      ],
      'healthcare-analytics': [
        'Section 1: Ingesting Executive KPI Metrics...',
        'Section 2: Computing Multi-Dimensional Satisfaction...',
        'Section 3: Running NLP Keyword & Word Cloud Extraction...',
        'Section 4: Uncovering Hidden Systemic Breakdowns...',
        'Section 5: Auditing AI Hallucination & Risk Flags...',
        'Section 6: Generating 3-Month Quick Wins & AI Roadmaps...'
      ],
      'readmission-risk': [
        'Step 1: Stratifying 30-Day Readmission Risk...',
        'Step 2: Identifying Primary Transition Barriers (6 root causes)...',
        'Step 3: Calculating Clinical & Hospital Penalty Impact...',
        'Step 4: Reviewing Clinician Oversight Flags...',
        'Step 5: Prescribing Care Coordination Interventions...',
        'Step 6: Formulating Care Transition Enhancements...'
      ]
    };

    // Simulate parallel asynchronous execution with realistic progression
    agentIdsToRun.forEach((agentId, agentIndex) => {
      const steps = stepDefinitions[agentId];
      const totalSteps = steps.length;
      let currentStepIndex = 0;

      const interval = setInterval(() => {
        currentStepIndex++;
        const pct = Math.min(100, Math.round((currentStepIndex / totalSteps) * 100));

        setRunStates(prev => ({
          ...prev,
          [agentId]: {
            agentId,
            status: pct >= 100 ? 'completed' : 'processing',
            progress: pct,
            currentStep: steps[currentStepIndex - 1] || 'Finalizing Analysis...',
            stepIndex: currentStepIndex,
            totalSteps,
            findingsCount: Math.round(records.length * (pct / 100)),
            latestFindingPreview: `Analyzed records for ${records[Math.min(currentStepIndex, records.length - 1)]?.serviceLine || 'hospital'}: ${records[Math.min(currentStepIndex, records.length - 1)]?.persona || 'Patient'}.`
          }
        }));

        if (currentStepIndex >= totalSteps) {
          clearInterval(interval);

          // Produce fresh analytical results for this agent
          setResults(prev => {
            const updated = { ...prev };
            if (agentId === 'feedback-insight') updated.feedback = analyzePatientFeedbackInsight(records);
            if (agentId === 'experience-monitoring') updated.experience = analyzePatientExperienceMonitoring(records);
            if (agentId === 'complaint-triage') updated.triage = analyzeComplaintTriage(records);
            if (agentId === 'hospital-manager') updated.manager = analyzeHospitalManagerSupport(records);
            if (agentId === 'healthcare-analytics') updated.analytics = analyzeHealthcareAnalytics(records);
            if (agentId === 'readmission-risk') updated.readmission = analyzePatientReadmissionRisk(records);
            return updated;
          });

          setAgentStatuses(prev => ({
            ...prev,
            [agentId]: 'completed'
          }));
        }
      }, 700 + agentIndex * 150); // slight natural parallel jitter
    });
  };

  const handleStartAnalysis = () => {
    const toRun = Array.from(selectedAgentIds);
    startAnalysisForAgents(toRun);
  };

  const handleRerunSingleAgent = (id: AgentId) => {
    startAnalysisForAgents([id]);
  };

  const handleCancelAgent = (id: AgentId) => {
    setAgentStatuses(prev => ({
      ...prev,
      [id]: 'idle'
    }));
    setRunStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: 'idle',
        currentStep: 'Analysis Paused by User',
        progress: 0
      }
    }));
  };

  const handleViewResults = (id: AgentId) => {
    setActiveResultsAgentId(id);
    setActiveScreen('agent-results');
  };

  const handleUpdateReviewStatus = (
    reviewId: string,
    status: HumanReviewItem['status'],
    notes?: string
  ) => {
    setHumanReviewQueue(prev =>
      prev.map(item => {
        if (item.id === reviewId) {
          return {
            ...item,
            status,
            reviewerNotes: notes || item.reviewerNotes,
            reviewedBy: 'Dr. Marcus Vance, Chief Medical Officer',
            reviewedAt: new Date().toLocaleDateString()
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Clinical Disclaimer & Governance Notice */}
      <DisclaimerBanner />

      {/* Top Bar Contract (1-line Brand wordmark, 5 clean nav links, 1 primary action) */}
      <Navigation
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        selectedCount={selectedAgentIds.size}
        totalRecords={records.length}
        isProcessingAny={isProcessingAny}
        onStartAnalysis={handleStartAnalysis}
      />

      {/* Main Viewport Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeScreen === 'virtual-office' && (
          <VirtualOffice
            agents={AGENT_DEFINITIONS}
            agentStatuses={agentStatuses}
            runStates={runStates}
            selectedAgentIds={selectedAgentIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onOpenWorkspace={setWorkspaceModalAgent}
            onViewResults={handleViewResults}
            onNavigateToUpload={() => setActiveScreen('data-upload')}
            onNavigateToSynthesis={() => setActiveScreen('combined-dashboard')}
            onStartAnalysis={handleStartAnalysis}
            isProcessingAny={isProcessingAny}
            totalRecords={records.length}
          />
        )}

        {activeScreen === 'data-upload' && (
          <DataUploadView
            records={records}
            onUpdateRecords={newRecords => {
              setRecords(newRecords);
              // Recompute pre-computed results on dataset change
              setResults({
                feedback: analyzePatientFeedbackInsight(newRecords),
                experience: analyzePatientExperienceMonitoring(newRecords),
                triage: analyzeComplaintTriage(newRecords),
                manager: analyzeHospitalManagerSupport(newRecords),
                analytics: analyzeHealthcareAnalytics(newRecords),
                readmission: analyzePatientReadmissionRisk(newRecords)
              });
            }}
            onProceedToConfig={() => setActiveScreen('agent-config')}
          />
        )}

        {activeScreen === 'agent-config' && (
          <AgentConfigView
            agents={AGENT_DEFINITIONS}
            selectedAgentIds={selectedAgentIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onStartAnalysis={handleStartAnalysis}
            isProcessingAny={isProcessingAny}
            totalRecords={records.length}
          />
        )}

        {activeScreen === 'live-processing' && (
          <LiveProcessingView
            agents={AGENT_DEFINITIONS}
            agentStatuses={agentStatuses}
            runStates={runStates}
            onRerunAgent={handleRerunSingleAgent}
            onCancelAgent={handleCancelAgent}
            onViewResults={handleViewResults}
            onNavigateToSynthesis={() => setActiveScreen('combined-dashboard')}
            isProcessingAny={isProcessingAny}
          />
        )}

        {activeScreen === 'agent-results' && (
          <AgentResultsView
            agents={AGENT_DEFINITIONS}
            activeAgentId={activeResultsAgentId}
            onSelectActiveAgent={setActiveResultsAgentId}
            results={results}
            onRerunAgent={handleRerunSingleAgent}
            onNavigateToSynthesis={() => setActiveScreen('combined-dashboard')}
            onUpdateTriageAnalysis={updated => {
              setResults(prev => ({ ...prev, triage: updated }));
            }}
          />
        )}

        {activeScreen === 'combined-dashboard' && (
          <CombinedDashboard
            findings={crossFindings}
            conflicts={conflicts}
            humanReviewQueue={humanReviewQueue}
            agents={AGENT_DEFINITIONS}
            records={records}
            onUpdateReviewStatus={handleUpdateReviewStatus}
          />
        )}

      </main>

      {/* Agent Workspace Detail Modal (when clicking room or avatar) */}
      {workspaceModalAgent && (
        <AgentWorkspaceModal
          agent={workspaceModalAgent}
          status={agentStatuses[workspaceModalAgent.id]}
          isSelected={selectedAgentIds.has(workspaceModalAgent.id)}
          onToggleSelect={handleToggleSelect}
          onRunSingleAgent={handleRerunSingleAgent}
          onViewResults={handleViewResults}
          onClose={() => setWorkspaceModalAgent(null)}
        />
      )}

      {/* Quiet Clinical Portal Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ClinicaSuite</span>
            <span aria-hidden="true">·</span>
            <span>Clinical Virtual-Office Multi-Agent Portal</span>
            <span aria-hidden="true">·</span>
            <span>Healthcare Quality Improvement & Patient Safety</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>HIPAA Safe Harbor Protocol</span>
            <span aria-hidden="true">·</span>
            <span>De-identified Clinical Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Human-in-the-Loop Governance</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
