/**
 * Core type definitions for ClinicaSuite Healthcare Virtual-Office Portal
 */

export type AgentId = 
  | 'feedback-insight'
  | 'experience-monitoring'
  | 'complaint-triage'
  | 'hospital-manager'
  | 'healthcare-analytics'
  | 'readmission-risk';

export type AgentStatus = 'idle' | 'selected' | 'processing' | 'completed' | 'error';

export interface AgentDefinition {
  id: AgentId;
  roomNumber: string;
  name: string;
  title: string;
  role: string;
  avatarRole: string;
  roomTheme: {
    accent: string;
    subtle: string;
    border: string;
    badge: string;
  };
  shortDescription: string;
  keyFunctions: string[];
  tasks: string[];
  constraints: string;
}

export interface PatientRecord {
  patientId: string;
  ageGroup: string;
  persona: string;
  visitType: 'Inpatient' | 'Outpatient' | 'Emergency' | 'Day Surgery' | 'Telehealth';
  serviceLine: 'Emergency' | 'Cardiology' | 'Oncology' | 'Orthopedics' | 'General Surgery' | 'Pediatrics' | 'Maternity' | 'Neurology';
  satisfactionScore: number; // 1-5
  communicationRating: number; // 1-5
  followUpCompliance: 'Yes' | 'Partial' | 'No';
  complaintSeverity: 'None' | 'Low' | 'Moderate' | 'High' | 'Critical';
  portalUsage: 'Active' | 'Infrequent' | 'None / Locked Out';
  readmissionRisk: 'Low' | 'Moderate' | 'High';
  aiRiskFlag: 'None' | 'Hallucination Trap' | 'Bias Review Required' | 'Human Review Required' | 'Conflicting Follow-up Data';
  patientComment: string;
  dischargeNotes?: string;
  socioeconomicBarrier?: string;
}

// Agent 1: Patient Feedback Insight Result
export interface FeedbackInsightItem {
  patientId: string;
  comment: string;
  theme: 'Communication' | 'Scheduling' | 'Wait Time' | 'Technology / Patient Portal' | 'Billing' | 'Clinical Care' | 'Discharge / Follow-Up' | 'Accessibility / Equity' | 'Mixed or Ambiguous';
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  reasoning: string;
  operationalIssue: string;
  riskOrBiasConcern: string;
  recommendedAction: string;
}

export interface FeedbackInsightAnalysis {
  completedAt: string;
  totalComments: number;
  themeDistribution: Record<string, number>;
  sentimentDistribution: Record<string, number>;
  items: FeedbackInsightItem[];
  highRiskCount: number;
}

// Agent 2: Patient Experience Monitoring Result
export interface ExperienceMonitoringItem {
  patientId: string;
  comment: string;
  primaryTheme: string;
  secondaryThemes: string[];
  operationalIssue: string;
  equityReview: {
    flagged: boolean;
    group: 'Older adults' | 'Rural patients' | 'Disabilities' | 'Limited English proficiency' | 'Low digital literacy' | 'General' | 'None';
    details: string;
  };
  riskAssessment: {
    level: 'Low' | 'Moderate' | 'High';
    category: 'Patient Safety' | 'Reputational' | 'Compliance' | 'Equity';
    rationale: string;
  };
  managerialRecommendation: string;
}

export interface ExperienceMonitoringAnalysis {
  completedAt: string;
  equityConcernsCount: number;
  riskDistribution: { Low: number; Moderate: number; High: number };
  items: ExperienceMonitoringItem[];
  topOperationalBottlenecks: string[];
}

// Agent 3: Complaint Triage Assistant Result
export interface ComplaintTriageItem {
  patientId: string;
  comment: string;
  primaryCategory: 'Communication' | 'Scheduling' | 'Wait Time' | 'Technology / Patient Portal' | 'Billing' | 'Clinical Care' | 'Patient Safety' | 'Privacy or Security' | 'Staff Conduct' | 'Other';
  secondaryCategories: string[];
  severityLevel: 'LEVEL 1 – Low' | 'LEVEL 2 – Moderate' | 'LEVEL 3 – High' | 'LEVEL 4 – Critical';
  severityReasoning: string;
  detectedRisks: Array<{
    riskType: 'Patient Safety Risk' | 'Clinical Risk' | 'Compliance Risk' | 'Privacy Risk' | 'Accessibility Risk' | 'Equity Risk' | 'Reputational Risk' | 'Operational Risk';
    explanation: string;
  }>;
  routeTo: 'Patient Experience Team' | 'Nursing Leadership' | 'Physician Leadership' | 'Quality Improvement Team' | 'Compliance Office' | 'Information Technology' | 'Revenue Cycle / Billing' | 'Accessibility Coordinator' | 'Risk Management' | 'Executive Review';
  requiresHumanIntervention: boolean;
  humanSignOff?: {
    status: 'Pending' | 'Approved' | 'Re-routed' | 'Overridden';
    reviewedBy?: string;
    reviewDate?: string;
    notes?: string;
  };
}

export interface ComplaintTriageAnalysis {
  completedAt: string;
  severityCounts: Record<string, number>;
  routeCounts: Record<string, number>;
  items: ComplaintTriageItem[];
  criticalCount: number;
}

// Agent 4: Hospital Manager Decision Support Result
export interface HospitalManagerItem {
  patientId: string;
  persona: string;
  serviceLine: string;
  satisfactionScore: number;
  communicationRating: number;
  mainProblem: string;
  priority: 'Low' | 'Medium' | 'High';
  priorityReasoning: string;
  recommendedActions: string[];
  humanReviewNeeded: boolean;
  aiRiskFlag: string;
  aiRiskExplanation?: string;
}

export interface HospitalManagerAnalysis {
  completedAt: string;
  topManagementAlert: {
    headline: string;
    severity: 'High' | 'Medium';
    context: string;
    affectedServiceLines: string[];
  };
  overallActionPlan: string[];
  priorityDistribution: { Low: number; Medium: number; High: number };
  cases: HospitalManagerItem[];
}

// Agent 5: Healthcare Analytics Agent Result
export interface HealthcareAnalyticsResult {
  completedAt: string;
  section1_ExecutiveOverview: {
    totalCommentsAnalyzed: number;
    averageSatisfactionScore: number;
    averageCommunicationRating: number;
    followUpComplianceRate: number; // percentage
    serviceLinesCount: number;
  };
  section2_SatisfactionInsights: {
    distribution: { score: number; count: number; percentage: number }[];
    byServiceLine: { serviceLine: string; avgScore: number; count: number }[];
    byVisitType: { visitType: string; avgScore: number; count: number }[];
    byPersona: { persona: string; avgScore: number }[];
  };
  section3_NLPAnalysis: {
    topThemes: { theme: string; count: number; share: number }[];
    topKeywords: { keyword: string; count: number; category: string }[];
    wordCloudTerms: { text: string; value: number }[];
  };
  section4_HiddenOrganizationalProblems: {
    highComplaintServiceLines: { line: string; complaintRate: number; primaryReason: string }[];
    communicationBottlenecks: string[];
    technologyIssues: string[];
    schedulingIssues: string[];
    waitTimeComplaints: string[];
  };
  section5_AIRiskMonitoring: {
    hallucinationTraps: { patientId: string; comment: string; trapDetails: string; safeguardApplied: string }[];
    biasRelatedComments: { patientId: string; comment: string; biasConcern: string; mitigation: string }[];
    casesRequiringHumanReview: { patientId: string; reason: string; department: string }[];
  };
  section6_ExecutiveRecommendations: {
    top5OrganizationalPriorities: string[];
    quickWinsWithin3Months: string[];
    longTermAIOpportunities: string[];
  };
}

// Agent 6: Patient Readmission Risk Result
export interface ReadmissionRiskItem {
  patientId: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  primaryBarrier: 'Medication Non-Adherence / Confusion' | 'Lack of Transportation / Accessibility' | 'Inadequate Discharge Communication' | 'Unresolved Clinical Symptoms' | 'Financial / Insurance Constraints' | 'Social Isolation / Lack of Caregiver Support';
  clinicalAndOperationalImpact: string;
  aiRiskFlagReview: {
    flagged: boolean;
    issue: string;
    humanClinicianReviewRequired: boolean;
  };
  careCoordinationAction: string;
  futureCareTransitionImprovement: string;
}

export interface ReadmissionRiskAnalysis {
  completedAt: string;
  highRiskCount: number;
  moderateRiskCount: number;
  lowRiskCount: number;
  barrierDistribution: Record<string, number>;
  items: ReadmissionRiskItem[];
  highRiskAlerts: ReadmissionRiskItem[];
  careCoordinationActionSteps: string[];
  futureCareTransitionProposal: string;
}

// Combined Analysis
export interface CrossAgentFinding {
  id: string;
  title: string;
  supportingAgents: AgentId[];
  consensusSummary: string;
  serviceLineAffected: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  actionableRecommendation: string;
  evidenceSnippets: string[];
}

export interface ConflictingInterpretation {
  id: string;
  patientId: string;
  commentSnippet: string;
  divergence: {
    agentA: { id: AgentId; claim: string };
    agentB: { id: AgentId; claim: string };
  };
  resolutionGuidance: string;
  requiresHumanReview: boolean;
}

export interface HumanReviewItem {
  id: string;
  patientId: string;
  flaggedBy: AgentId[];
  reason: string;
  severity: 'Critical' | 'High' | 'Moderate';
  aiObservation: string;
  aiRecommendation: string;
  evidence: string;
  status: 'Pending Review' | 'Approved' | 'Adjusted' | 'Escalated';
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AnalysisRunState {
  agentId: AgentId;
  status: AgentStatus;
  progress: number; // 0 - 100
  currentStep: string;
  stepIndex: number;
  totalSteps: number;
  findingsCount: number;
  latestFindingPreview: string;
  errorMessage?: string;
}

export type ActiveScreen = 
  | 'virtual-office'
  | 'data-upload'
  | 'agent-config'
  | 'live-processing'
  | 'agent-results'
  | 'combined-dashboard';
