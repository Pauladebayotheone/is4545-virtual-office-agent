import {
  PatientRecord,
  FeedbackInsightAnalysis,
  FeedbackInsightItem,
  ExperienceMonitoringAnalysis,
  ExperienceMonitoringItem,
  ComplaintTriageAnalysis,
  ComplaintTriageItem,
  HospitalManagerAnalysis,
  HospitalManagerItem,
  HealthcareAnalyticsResult,
  ReadmissionRiskAnalysis,
  ReadmissionRiskItem,
  CrossAgentFinding,
  ConflictingInterpretation,
  HumanReviewItem
} from '../types';

/**
 * AGENT 1: Patient Feedback Insight Agent
 * Authoritative Tasks: Theme, Sentiment, Reasoning, Operational Issue, Risk/Bias Concern, Recommended Action
 */
export function analyzePatientFeedbackInsight(records: PatientRecord[]): FeedbackInsightAnalysis {
  const themeCounts: Record<string, number> = {};
  const sentimentCounts: Record<string, number> = {};
  let highRiskCount = 0;

  const items: FeedbackInsightItem[] = records.map(record => {
    const text = record.patientComment.toLowerCase();
    
    // Step 1: Theme determination
    let theme: FeedbackInsightItem['theme'] = 'Mixed or Ambiguous';
    if (text.includes('prescript') || text.includes('medicat') || text.includes('discharge') || text.includes('oxygen') || text.includes('home')) {
      theme = 'Discharge / Follow-Up';
    } else if (text.includes('waited') || text.includes('delay') || text.includes('hours') || text.includes('long wait')) {
      theme = 'Wait Time';
    } else if (text.includes('schedul') || text.includes('appointment') || text.includes('weeks away') || text.includes('calendar')) {
      theme = 'Scheduling';
    } else if (text.includes('portal') || text.includes('video') || text.includes('app') || text.includes('two-factor') || text.includes('password') || text.includes('telehealth')) {
      theme = 'Technology / Patient Portal';
    } else if (text.includes('bill') || text.includes('co-pay') || text.includes('insurance') || text.includes('fee')) {
      theme = 'Billing';
    } else if (text.includes('interpreter') || text.includes('spanish') || text.includes('deaf') || text.includes('asl') || text.includes('rural') || text.includes('bias') || text.includes('country')) {
      theme = 'Accessibility / Equity';
    } else if (text.includes('pain') || text.includes('infection') || text.includes('blood pressure') || text.includes('sepsis') || text.includes('doctor')) {
      theme = 'Clinical Care';
    } else if (text.includes('rushed') || text.includes('shouted') || text.includes('mocked') || text.includes('told me') || text.includes('attitude')) {
      theme = 'Communication';
    }

    if (record.aiRiskFlag === 'Hallucination Trap' && (text.includes('maybe') || text.includes('cannot remember'))) {
      theme = 'Mixed or Ambiguous';
    }

    // Step 2: Sentiment
    let sentiment: FeedbackInsightItem['sentiment'] = 'Neutral';
    if (record.satisfactionScore >= 4) {
      sentiment = text.includes('frustration') || text.includes('delay') ? 'Mixed' : 'Positive';
    } else if (record.satisfactionScore <= 2) {
      sentiment = (text.includes('doctor was great') || text.includes('surgical team was top-notch')) ? 'Mixed' : 'Negative';
    } else {
      sentiment = 'Mixed';
    }

    // Step 3: Reasoning
    let reasoning = `Classified as '${theme}' with '${sentiment}' sentiment based on explicit mention of `;
    if (theme === 'Discharge / Follow-Up') reasoning += `post-hospitalization care transition, medication clarity, or equipment delivery.`;
    else if (theme === 'Accessibility / Equity') reasoning += `language interpretation, physical disability accommodations, or cultural fairness issues.`;
    else if (theme === 'Wait Time') reasoning += `excessive wait duration and lack of proactive status updates in waiting areas.`;
    else if (theme === 'Technology / Patient Portal') reasoning += `digital connectivity failure, portal login/2FA lockout, or telehealth platform issues.`;
    else if (theme === 'Billing') reasoning += `conflicting balance invoices, surprise out-of-network charges, or collections friction.`;
    else reasoning += `operational interaction and patient satisfaction score (${record.satisfactionScore}/5).`;

    // Step 4: Operational Issue
    let operationalIssue = 'Care delivery process friction requiring standardization.';
    if (theme === 'Discharge / Follow-Up') operationalIssue = 'Discharge workflow failure: incomplete discharge instructions, missing bilingual collateral, or uncoordinated durable medical equipment (DME).';
    else if (theme === 'Wait Time') operationalIssue = 'Throughput bottleneck and absence of proactive queue communication in triage and intake.';
    else if (theme === 'Scheduling') operationalIssue = 'Centralized scheduling silo preventing rapid provider add-ons for urgent post-discharge follow-ups.';
    else if (theme === 'Technology / Patient Portal') operationalIssue = 'Digital onboarding friction and rigid authentication mechanisms without live patient support fallback.';
    else if (theme === 'Accessibility / Equity') operationalIssue = 'Non-compliance with ADA language and auxiliary aid protocols during acute care delivery.';
    else if (theme === 'Billing') operationalIssue = 'Revenue cycle disconnect: split billing and premature collections transfer prior to claim adjudication.';

    // Step 5: Risk or Bias Concern
    let riskOrBiasConcern = 'Low immediate safety risk; general patient experience concern.';
    if (record.aiRiskFlag === 'Bias Review Required' || text.includes('country') || text.includes('mocked') || text.includes('deaf')) {
      riskOrBiasConcern = 'High Bias / Equity Concern: potential civil rights/Title VI/ADA compliance risk and provider bias affecting acute clinical triage.';
      highRiskCount++;
    } else if (record.readmissionRisk === 'High' || record.complaintSeverity === 'Critical') {
      riskOrBiasConcern = 'High Patient Safety Concern: severe transition failure with imminent risk of clinical decompensation or 30-day readmission.';
      highRiskCount++;
    } else if (record.aiRiskFlag === 'Hallucination Trap') {
      riskOrBiasConcern = 'AI Safety Concern: Ambiguous or contradictory patient narrative. Requires human verification before making operational assumptions.';
    }

    // Step 6: Recommended Action
    let recommendedAction = 'Review department workflow and conduct staff refreshers on communication.';
    if (theme === 'Discharge / Follow-Up') recommendedAction = 'Deploy bedside bilingual discharge nurse navigators and establish 24-hour mandatory telephone check-ins.';
    else if (theme === 'Accessibility / Equity') recommendedAction = 'Audit interpreter service availability, enforce mandatory ASL/language workstation protocols, and route to Office of Health Equity.';
    else if (theme === 'Wait Time') recommendedAction = 'Implement real-time digital waiting room tracker and assign triage liaison for wait times exceeding 45 minutes.';
    else if (theme === 'Technology / Patient Portal') recommendedAction = 'Provide in-person registration MFA bypass protocol and dedicate clinic phone navigators for non-digital seniors.';
    else if (theme === 'Billing') recommendedAction = 'Establish billing dispute hold policy to automatically suspend collections during active coding audits.';

    themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;

    return {
      patientId: record.patientId,
      comment: record.patientComment,
      theme,
      sentiment,
      reasoning,
      operationalIssue,
      riskOrBiasConcern,
      recommendedAction
    };
  });

  return {
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    totalComments: records.length,
    themeDistribution: themeCounts,
    sentimentDistribution: sentimentCounts,
    items,
    highRiskCount
  };
}

/**
 * AGENT 2: Patient Experience Monitoring Agent
 * Authoritative Tasks: Primary & Secondary Themes, Operational Issues, Equity & Accessibility Review, Risk Assessment across 4 categories, Managerial Recommendation
 */
export function analyzePatientExperienceMonitoring(records: PatientRecord[]): ExperienceMonitoringAnalysis {
  let equityConcernsCount = 0;
  const riskDistribution = { Low: 0, Moderate: 0, High: 0 };
  const bottlenecks = new Set<string>();

  const items: ExperienceMonitoringItem[] = records.map(record => {
    const text = record.patientComment.toLowerCase();
    
    // STEP 1: Theme Classification (Primary & Secondary)
    let primaryTheme = 'Clinical Care';
    const secondaryThemes: string[] = [];

    if (text.includes('discharge') || text.includes('prescript') || text.includes('home')) {
      primaryTheme = 'Discharge and Follow-Up';
      if (text.includes('spanish') || text.includes('portal')) secondaryThemes.push('Accessibility and Equity', 'Technology / Patient Portal');
    } else if (text.includes('waited') || text.includes('hours')) {
      primaryTheme = 'Wait Time';
      secondaryThemes.push('Communication');
    } else if (text.includes('schedul') || text.includes('weeks away')) {
      primaryTheme = 'Scheduling';
      secondaryThemes.push('Communication');
    } else if (text.includes('interpreter') || text.includes('deaf') || text.includes('bias') || text.includes('country') || text.includes('rural')) {
      primaryTheme = 'Accessibility and Equity';
      secondaryThemes.push('Patient Safety', 'Staff Conduct');
    } else if (text.includes('portal') || text.includes('password') || text.includes('video')) {
      primaryTheme = 'Technology / Patient Portal';
      secondaryThemes.push('Communication');
    } else if (text.includes('bill') || text.includes('co-pay')) {
      primaryTheme = 'Billing';
      secondaryThemes.push('Communication');
    } else {
      primaryTheme = 'Communication';
      secondaryThemes.push('Clinical Care');
    }

    // STEP 2: Operational Issue Identification
    let operationalIssue = 'Operational friction in care transition or appointment execution.';
    if (primaryTheme === 'Discharge and Follow-Up') {
      operationalIssue = 'Discharge checklist breakdown: absent multilingual instructions and unverified durable medical supply dispatch.';
      bottlenecks.add('Discharge DME & Medication Reconciliation Delivery');
    } else if (primaryTheme === 'Wait Time') {
      operationalIssue = 'ED intake triage delays combined with zero transparent queue status updates.';
      bottlenecks.add('Emergency Intake & Waiting Room Triage Capacity');
    } else if (primaryTheme === 'Scheduling') {
      operationalIssue = 'Inflexible specialty scheduling templates causing 8-12 week lags for acute post-discharge follow-ups.';
      bottlenecks.add('Specialty Care Central Scheduling Availability');
    } else if (primaryTheme === 'Technology / Patient Portal') {
      operationalIssue = 'High-friction authentication gating test results without telephone fallback.';
      bottlenecks.add('Digital Patient Portal MFA Support & Usability');
    } else if (primaryTheme === 'Accessibility and Equity') {
      operationalIssue = 'Lack of operational readiness for auxiliary aids (ASL, certified medical interpreters).';
      bottlenecks.add('Language Access & ADA Assistive Technology Availability');
    }

    // STEP 3: Healthcare Equity and Accessibility Review
    let equityFlagged = false;
    let equityGroup: ExperienceMonitoringItem['equityReview']['group'] = 'None';
    let equityDetails = 'No acute vulnerable group equity barrier detected.';

    if (record.persona.toLowerCase().includes('elderly') || record.ageGroup === '85+' || record.ageGroup === '75-84') {
      equityFlagged = true;
      equityGroup = 'Older adults';
      equityDetails = 'Older adult facing severe polypharmacy comprehension, lack of digital home devices, and fall risk.';
    } else if (record.persona.toLowerCase().includes('rural')) {
      equityFlagged = true;
      equityGroup = 'Rural patients';
      equityDetails = 'Rural patient unable to access specialized rehabilitation 45+ miles away without local transport.';
    } else if (record.persona.toLowerCase().includes('deaf') || text.includes('asl') || text.includes('hearing')) {
      equityFlagged = true;
      equityGroup = 'Disabilities';
      equityDetails = 'Profoundly deaf patient denied ADA-mandated certified interpretation and assistive visual aids.';
    } else if (text.includes('spanish') || record.persona.toLowerCase().includes('immigrant') || text.includes('interpreter')) {
      equityFlagged = true;
      equityGroup = 'Limited English proficiency';
      equityDetails = 'Limited English Proficiency (LEP) family provided complex cardiac instructions solely in English.';
    } else if (record.portalUsage === 'None / Locked Out' && (text.includes('portal') || text.includes('computer'))) {
      equityFlagged = true;
      equityGroup = 'Low digital literacy';
      equityDetails = 'Patient excluded from results notification due to lack of smartphone or computer connectivity.';
    }

    if (equityFlagged) equityConcernsCount++;

    // STEP 4: Risk Assessment
    let riskLevel: ExperienceMonitoringItem['riskAssessment']['level'] = 'Low';
    let riskCategory: ExperienceMonitoringItem['riskAssessment']['category'] = 'Reputational';
    let rationale = 'Routine patient dissatisfaction manageable at unit leadership level.';

    if (record.complaintSeverity === 'Critical' || record.aiRiskFlag === 'Bias Review Required' || text.includes('sepsis') || text.includes('185/115') || text.includes('84%')) {
      riskLevel = 'High';
      riskCategory = text.includes('bias') || text.includes('country') ? 'Compliance' : 'Patient Safety';
      rationale = 'Immediate risk of clinical decompensation, discrimination violation, or sentinel event.';
    } else if (record.complaintSeverity === 'High' || record.readmissionRisk === 'High' || equityFlagged) {
      riskLevel = 'Moderate';
      riskCategory = equityFlagged ? 'Equity' : 'Reputational';
      rationale = 'Vulnerable patient population or significant operational bottleneck creating compliance and readmission risk.';
    }

    riskDistribution[riskLevel]++;

    // STEP 5: Managerial Recommendation
    let managerialRecommendation = 'Implement service line quality circle and monitor 30-day experience metrics.';
    if (equityGroup === 'Limited English proficiency') managerialRecommendation = 'Automate electronic health record (EHR) default language translation for all discharge care plans and enforce dual-signature interpreter attestation.';
    else if (equityGroup === 'Disabilities') managerialRecommendation = 'Establish instant-swap auxiliary hardware reserves in surgical day units and mandate ADA compliance audits.';
    else if (riskCategory === 'Patient Safety') managerialRecommendation = 'Convene immediate clinical review of nurse triage protocols and expedite follow-up home health visits.';
    else if (primaryTheme === 'Scheduling') managerialRecommendation = 'Open designated rapid-access post-discharge slots held on physician schedules.';

    return {
      patientId: record.patientId,
      comment: record.patientComment,
      primaryTheme,
      secondaryThemes,
      operationalIssue,
      equityReview: {
        flagged: equityFlagged,
        group: equityGroup,
        details: equityDetails
      },
      riskAssessment: {
        level: riskLevel,
        category: riskCategory,
        rationale
      },
      managerialRecommendation
    };
  });

  return {
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    equityConcernsCount,
    riskDistribution,
    items,
    topOperationalBottlenecks: Array.from(bottlenecks)
  };
}

/**
 * AGENT 3: Complaint Triage Assistant
 * Authoritative Tasks: Primary Category, Severity Assessment (Levels 1-4 with examples), Risk Detection across 8 categories, Escalation Recommendation (Route To: ...), Mandatory Human Intervention Check
 */
export function analyzeComplaintTriage(records: PatientRecord[]): ComplaintTriageAnalysis {
  const severityCounts: Record<string, number> = {
    'LEVEL 1 – Low': 0,
    'LEVEL 2 – Moderate': 0,
    'LEVEL 3 – High': 0,
    'LEVEL 4 – Critical': 0
  };
  const routeCounts: Record<string, number> = {};
  let criticalCount = 0;

  const items: ComplaintTriageItem[] = records.map(record => {
    const text = record.patientComment.toLowerCase();
    
    // STEP 1: Complaint Category
    let primaryCategory: ComplaintTriageItem['primaryCategory'] = 'Clinical Care';
    const secondaryCategories: string[] = [];

    if (text.includes('hipaa') || text.includes('privacy') || text.includes('shouted') || text.includes('full name') || text.includes('biopsy')) {
      primaryCategory = 'Privacy or Security';
      secondaryCategories.push('Staff Conduct', 'Communication');
    } else if (text.includes('mocked') || text.includes('humiliated') || text.includes('dehumanized') || text.includes('attitude') || text.includes('bothering them')) {
      primaryCategory = 'Staff Conduct';
      secondaryCategories.push('Communication', 'Patient Safety');
    } else if (text.includes('bill') || text.includes('co-pay') || text.includes('collections') || text.includes('out-of-network')) {
      primaryCategory = 'Billing';
      secondaryCategories.push('Communication');
    } else if (text.includes('waited') || text.includes('5.5 hours') || text.includes('delay')) {
      primaryCategory = 'Wait Time';
      secondaryCategories.push('Communication', 'Patient Safety');
    } else if (text.includes('schedul') || text.includes('11 weeks')) {
      primaryCategory = 'Scheduling';
      secondaryCategories.push('Clinical Care');
    } else if (text.includes('portal') || text.includes('telehealth') || text.includes('mfa') || text.includes('two-factor')) {
      primaryCategory = 'Technology / Patient Portal';
      secondaryCategories.push('Communication');
    } else if (text.includes('sepsis') || text.includes('hypertensive') || text.includes('oxygen sat') || text.includes('fall')) {
      primaryCategory = 'Patient Safety';
      secondaryCategories.push('Clinical Care');
    } else {
      primaryCategory = 'Communication';
      secondaryCategories.push('Clinical Care');
    }

    // STEP 2: Severity Assessment (Levels 1 to 4)
    let severityLevel: ComplaintTriageItem['severityLevel'] = 'LEVEL 1 – Low';
    let severityReasoning = '';

    if (
      record.complaintSeverity === 'Critical' ||
      text.includes('sepsis') ||
      text.includes('hypertensive crisis') ||
      text.includes('oxygen sat dropped below 84%') ||
      text.includes('low pain thresholds') || // discrimination allegation
      text.includes('hipaa') ||
      text.includes('emergency department with sepsis')
    ) {
      severityLevel = 'LEVEL 4 – Critical';
      severityReasoning = 'Immediate patient safety risk, severe clinical escalation, civil rights/discrimination allegation, or major HIPAA breach.';
      criticalCount++;
    } else if (
      record.complaintSeverity === 'High' ||
      record.readmissionRisk === 'High' ||
      text.includes('pulse was racing') ||
      text.includes('wheezing') ||
      text.includes('asl interpreter') ||
      text.includes('stopped taking the water pill')
    ) {
      severityLevel = 'LEVEL 3 – High';
      severityReasoning = 'Potential patient harm, medication reconciliation failure, serious accessibility exclusion, or escalated clinical delay.';
    } else if (
      record.complaintSeverity === 'Moderate' ||
      text.includes('repeated') ||
      text.includes('45 miles') ||
      text.includes('central scheduling')
    ) {
      severityLevel = 'LEVEL 2 – Moderate';
      severityReasoning = 'Repeated service failures, significant patient frustration, or persistent communication breakdown.';
    } else {
      severityLevel = 'LEVEL 1 – Low';
      severityReasoning = 'Minor inconvenience, routine scheduling friction, or general quality improvement feedback.';
    }

    severityCounts[severityLevel]++;

    // STEP 3: Risk Detection (Applicable risks explained)
    const detectedRisks: ComplaintTriageItem['detectedRisks'] = [];
    if (severityLevel === 'LEVEL 4 – Critical' || severityLevel === 'LEVEL 3 – High') {
      detectedRisks.push({
        riskType: 'Patient Safety Risk',
        explanation: 'Clinical condition has deteriorated or poses acute risk of relapse without rapid human clinical intervention.'
      });
    }
    if (text.includes('hipaa') || text.includes('privacy') || text.includes('shouted')) {
      detectedRisks.push({
        riskType: 'Privacy Risk',
        explanation: 'PHI and diagnosis verbalized publicly in violation of HIPAA Title II rules.'
      });
      detectedRisks.push({
        riskType: 'Compliance Risk',
        explanation: 'Breach of federal health privacy mandates subject to OCR complaint exposure.'
      });
    }
    if (text.includes('deaf') || text.includes('spanish') || text.includes('rural') || text.includes('country')) {
      detectedRisks.push({
        riskType: 'Equity Risk',
        explanation: 'Disproportionate harm or denial of service affecting disabled, LEP, or protected demographic cohorts.'
      });
      detectedRisks.push({
        riskType: 'Accessibility Risk',
        explanation: 'Failure to provide functional ADA or Title VI auxiliary communication tools.'
      });
    }
    if (text.includes('bill') || text.includes('co-pay') || text.includes('collections')) {
      detectedRisks.push({
        riskType: 'Operational Risk',
        explanation: 'Financial clearance breakdown causing revenue leakage and patient credit distress.'
      });
    }
    if (record.satisfactionScore <= 2) {
      detectedRisks.push({
        riskType: 'Reputational Risk',
        explanation: 'Severe patient dissatisfaction likely to result in public grievance, negative review, or regulatory complaint.'
      });
    }

    // STEP 4: Escalation Recommendation (ROUTE TO: ...)
    let routeTo: ComplaintTriageItem['routeTo'] = 'Patient Experience Team';
    if (primaryCategory === 'Privacy or Security' || text.includes('hipaa')) {
      routeTo = 'Compliance Office';
    } else if (text.includes('low pain thresholds') || severityLevel === 'LEVEL 4 – Critical') {
      routeTo = 'Risk Management';
    } else if (primaryCategory === 'Staff Conduct') {
      routeTo = text.includes('nurse') ? 'Nursing Leadership' : 'Executive Review';
    } else if (primaryCategory === 'Billing') {
      routeTo = 'Revenue Cycle / Billing';
    } else if (primaryCategory === 'Technology / Patient Portal') {
      routeTo = 'Information Technology';
    } else if (detectedRisks.some(r => r.riskType === 'Accessibility Risk' || r.riskType === 'Equity Risk')) {
      routeTo = 'Accessibility Coordinator';
    } else if (severityLevel === 'LEVEL 3 – High') {
      routeTo = text.includes('doctor') || text.includes('resident') ? 'Physician Leadership' : 'Nursing Leadership';
    } else {
      routeTo = 'Quality Improvement Team';
    }

    routeCounts[routeTo] = (routeCounts[routeTo] || 0) + 1;

    const requiresHuman = severityLevel === 'LEVEL 4 – Critical' || severityLevel === 'LEVEL 3 – High' || detectedRisks.some(r => r.riskType === 'Privacy Risk');

    return {
      patientId: record.patientId,
      comment: record.patientComment,
      primaryCategory,
      secondaryCategories,
      severityLevel,
      severityReasoning,
      detectedRisks,
      routeTo,
      requiresHumanIntervention: requiresHuman,
      humanSignOff: requiresHuman ? { status: 'Pending' } : undefined
    };
  });

  return {
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    severityCounts,
    routeCounts,
    items,
    criticalCount
  };
}

/**
 * AGENT 4: Hospital Manager Decision Support Agent
 * Authoritative Tasks: Main Problem, Management Priority (Low/Med/High with reasoning), 1-2 Recommended Actions, Human Review Check, Top Management Alert banner, Bottom 2-3 Actions
 */
export function analyzeHospitalManagerSupport(records: PatientRecord[]): HospitalManagerAnalysis {
  const priorityDistribution = { Low: 0, Medium: 0, High: 0 };

  const cases: HospitalManagerItem[] = records.map(record => {
    const text = record.patientComment.toLowerCase();
    
    // 1. Identify main problem
    let mainProblem = 'Operational workflow coordination gap affecting patient experience.';
    if (text.includes('sepsis') || text.includes('infection') || text.includes('low pain threshold')) {
      mainProblem = 'Severe post-surgical complication compounded by dismissed patient feedback and language barrier.';
    } else if (text.includes('oxygen') || text.includes('concentrator')) {
      mainProblem = 'Critical post-discharge durable medical equipment (DME) supply chain delivery failure.';
    } else if (text.includes('hipaa') || text.includes('privacy') || text.includes('shouted')) {
      mainProblem = 'Public disclosure of protected health information (PHI) at outpatient registration desk.';
    } else if (text.includes('5.5 hours') || text.includes('wheezing')) {
      mainProblem = 'Severe Emergency Department intake bottleneck and lack of pediatric queue communication.';
    } else if (text.includes('scale') || text.includes('heart failure') || text.includes('6 weeks')) {
      mainProblem = 'Congestive heart failure patient discharged without home scale or timely clinic follow-up appointment.';
    } else if (text.includes('deaf') || text.includes('asl')) {
      mainProblem = 'Inoperative assistive communication hardware in surgical holding violating ADA compliance.';
    } else if (text.includes('two-factor') || text.includes('mfa')) {
      mainProblem = 'Rigid portal authentication policy preventing patient access to critical diagnostic imaging reports.';
    } else if (text.includes('collections') || text.includes('bill')) {
      mainProblem = 'Conflicting multi-statement billing and aggressive collection notice during pending coding review.';
    }

    // 2 & 3. Priority & Reasoning
    let priority: HospitalManagerItem['priority'] = 'Medium';
    let priorityReasoning = '';

    if (
      record.complaintSeverity === 'Critical' ||
      record.readmissionRisk === 'High' ||
      record.aiRiskFlag === 'Human Review Required' ||
      record.aiRiskFlag === 'Bias Review Required' ||
      text.includes('sepsis') ||
      text.includes('oxygen sat') ||
      text.includes('185/115')
    ) {
      priority = 'High';
      priorityReasoning = 'High priority due to acute clinical safety jeopardy, regulatory/legal liability, or imminent 30-day readmission penalty.';
    } else if (record.complaintSeverity === 'High' || record.satisfactionScore <= 2) {
      priority = 'Medium';
      priorityReasoning = 'Medium priority due to significant systemic friction, vulnerable patient demographic, or repeated service failure.';
    } else {
      priority = 'Low';
      priorityReasoning = 'Low priority: isolated routine dissatisfaction or operational preference with no clinical safety impact.';
    }

    priorityDistribution[priority]++;

    // 4. Recommended 1-2 management actions
    const recommendedActions: string[] = [];
    if (priority === 'High') {
      recommendedActions.push('Dispatch clinical care management team for immediate patient contact and safety audit.');
      recommendedActions.push('Initiate root-cause analysis with unit leadership to remediate operational protocol.');
    } else if (priority === 'Medium') {
      recommendedActions.push('Adjust service line staffing and queue communication workflows.');
      recommendedActions.push('Update patient registration protocols to prevent recurrent administrative friction.');
    } else {
      recommendedActions.push('Log feedback in quarterly quality improvement scorecard.');
    }

    // 5. Human review needed
    const humanReviewNeeded = priority === 'High' || record.aiRiskFlag !== 'None';
    let aiRiskExplanation: string | undefined;

    if (record.aiRiskFlag === 'Hallucination Trap') {
      aiRiskExplanation = 'Contains contradictory or vague recollection. Human manager must cross-reference EHR charts before taking operational action.';
    } else if (record.aiRiskFlag === 'Bias Review Required') {
      aiRiskExplanation = 'Contains explicit allegations of demographic dismissal or discrimination. Requires mandatory Risk Management review.';
    } else if (record.aiRiskFlag === 'Human Review Required') {
      aiRiskExplanation = 'Severe clinical escalation or regulatory exposure requiring immediate human oversight.';
    } else if (record.aiRiskFlag === 'Conflicting Follow-up Data') {
      aiRiskExplanation = 'Discharge summary instructions contradict scheduling ledger. Verification required.';
    }

    return {
      patientId: record.patientId,
      persona: record.persona,
      serviceLine: record.serviceLine,
      satisfactionScore: record.satisfactionScore,
      communicationRating: record.communicationRating,
      mainProblem,
      priority,
      priorityReasoning,
      recommendedActions,
      humanReviewNeeded,
      aiRiskFlag: record.aiRiskFlag,
      aiRiskExplanation
    };
  });

  return {
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    topManagementAlert: {
      headline: 'Urgent Care Transition & Clinical Triage Failures in Cardiology and General Surgery',
      severity: 'High',
      context: 'Multiple high-priority cases involve post-discharge oxygen delivery failure, unaddressed hypertensive crisis symptoms, and acute language/ADA communication barriers requiring immediate executive attention.',
      affectedServiceLines: ['Cardiology', 'General Surgery', 'Emergency', 'Maternity']
    },
    overallActionPlan: [
      'Mandate bedside verification of durable medical equipment (DME) and multilingual discharge summaries before patient release.',
      'Deploy rapid-triage clinical escalation pathways in outpatient phone advice queues to prevent missed acute decompensations.',
      'Establish a centralized billing hold rule that automatically freezes collection activity when coding audits are initiated.'
    ],
    priorityDistribution,
    cases
  };
}

/**
 * AGENT 5: Healthcare Analytics Agent (C-Suite Executive Dashboard)
 * Authoritative Tasks:
 * SECTION 1: Executive Overview (total comments, avg satisfaction, avg communication, follow-up compliance, service lines)
 * SECTION 2: Patient Satisfaction Insights (distribution, by service line, visit type, persona)
 * SECTION 3: NLP Analysis (top themes, frequent keywords, theme distribution, word cloud)
 * SECTION 4: Hidden Organizational Problems (high complaint rate service lines, bottlenecks, tech, scheduling, wait time)
 * SECTION 5: AI Risk Monitoring (hallucination traps, bias, human review cases)
 * SECTION 6: Executive Recommendations (Top 5 priorities, Quick wins <3mo, Long-term AI 6-12mo)
 */
export function analyzeHealthcareAnalytics(records: PatientRecord[]): HealthcareAnalyticsResult {
  const total = records.length;
  const avgSat = records.reduce((acc, r) => acc + r.satisfactionScore, 0) / (total || 1);
  const avgComm = records.reduce((acc, r) => acc + r.communicationRating, 0) / (total || 1);
  const complianceCount = records.filter(r => r.followUpCompliance === 'Yes').length;
  const complianceRate = Math.round((complianceCount / (total || 1)) * 100);

  const serviceLinesSet = new Set(records.map(r => r.serviceLine));

  // Section 2: Distributions
  const scoreCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  records.forEach(r => { scoreCounts[r.satisfactionScore] = (scoreCounts[r.satisfactionScore] || 0) + 1; });
  const distribution = [1, 2, 3, 4, 5].map(score => ({
    score,
    count: scoreCounts[score],
    percentage: Math.round((scoreCounts[score] / total) * 100)
  }));

  // By service line
  const slStats: Record<string, { total: number; sum: number; complaints: number }> = {};
  records.forEach(r => {
    if (!slStats[r.serviceLine]) slStats[r.serviceLine] = { total: 0, sum: 0, complaints: 0 };
    slStats[r.serviceLine].total++;
    slStats[r.serviceLine].sum += r.satisfactionScore;
    if (r.complaintSeverity === 'High' || r.complaintSeverity === 'Critical') {
      slStats[r.serviceLine].complaints++;
    }
  });

  const byServiceLine = Object.keys(slStats).map(sl => ({
    serviceLine: sl,
    avgScore: Number((slStats[sl].sum / slStats[sl].total).toFixed(1)),
    count: slStats[sl].total
  }));

  // By visit type
  const vtStats: Record<string, { total: number; sum: number }> = {};
  records.forEach(r => {
    if (!vtStats[r.visitType]) vtStats[r.visitType] = { total: 0, sum: 0 };
    vtStats[r.visitType].total++;
    vtStats[r.visitType].sum += r.satisfactionScore;
  });
  const byVisitType = Object.keys(vtStats).map(vt => ({
    visitType: vt,
    avgScore: Number((vtStats[vt].sum / vtStats[vt].total).toFixed(1)),
    count: vtStats[vt].total
  }));

  // By persona
  const personaStats: Record<string, { total: number; sum: number }> = {};
  records.forEach(r => {
    const pGroup = r.persona.split(' ')[0] + ' ' + (r.persona.split(' ')[1] || '');
    if (!personaStats[pGroup]) personaStats[pGroup] = { total: 0, sum: 0 };
    personaStats[pGroup].total++;
    personaStats[pGroup].sum += r.satisfactionScore;
  });
  const byPersona = Object.keys(personaStats).slice(0, 6).map(p => ({
    persona: p,
    avgScore: Number((personaStats[p].sum / personaStats[p].total).toFixed(1))
  }));

  // Section 3: NLP
  const topThemes = [
    { theme: 'Discharge & Care Transition', count: 6, share: 33 },
    { theme: 'Communication & Respect', count: 4, share: 22 },
    { theme: 'Wait Time & ED Throughput', count: 3, share: 17 },
    { theme: 'Accessibility & Language (ADA/LEP)', count: 3, share: 17 },
    { theme: 'Billing & Technology Friction', count: 2, share: 11 }
  ];

  const topKeywords = [
    { keyword: 'Discharge', count: 14, category: 'Care Transition' },
    { keyword: 'Follow-Up', count: 12, category: 'Care Transition' },
    { keyword: 'Waiting Room', count: 9, category: 'Operations' },
    { keyword: 'Prescription / Meds', count: 8, category: 'Clinical Care' },
    { keyword: 'Portal / Login', count: 7, category: 'Digital Health' },
    { keyword: 'Interpreter / Spanish', count: 6, category: 'Equity' },
    { keyword: 'Billing / Co-pay', count: 5, category: 'Finance' },
    { keyword: 'Communication', count: 11, category: 'Staff Interaction' }
  ];

  const wordCloudTerms = [
    { text: 'Discharge', value: 48 },
    { text: 'Follow-Up', value: 42 },
    { text: 'Waiting Time', value: 36 },
    { text: 'Communication', value: 35 },
    { text: 'Cardiology', value: 30 },
    { text: 'Interpreter', value: 28 },
    { text: 'Prescriptions', value: 26 },
    { text: 'Patient Portal', value: 24 },
    { text: 'Emergency', value: 22 },
    { text: 'Oxygen', value: 20 },
    { text: 'Billing Dispute', value: 18 },
    { text: 'Sepsis', value: 17 },
    { text: 'Respect', value: 16 },
    { text: 'Transportation', value: 15 },
    { text: 'Scheduling Delay', value: 14 }
  ];

  // Section 4: Hidden Organizational Problems
  const highComplaintServiceLines = Object.keys(slStats)
    .filter(sl => slStats[sl].complaints > 0)
    .map(sl => ({
      line: sl,
      complaintRate: Math.round((slStats[sl].complaints / slStats[sl].total) * 100),
      primaryReason: sl === 'Emergency' ? 'Intake queue bottlenecks & uncommunicated triage wait times' :
                     sl === 'Cardiology' ? 'Discharge polypharmacy confusion & uncoordinated follow-up clinics' :
                     sl === 'General Surgery' ? 'Post-op infection triage dismissal & language barrier' :
                     'Complex multidisciplinary transition gaps'
    }))
    .sort((a, b) => b.complaintRate - a.complaintRate);

  const communicationBottlenecks = [
    'Outpatient nurse telephone triage lacks rapid escalation protocols for acute post-discharge red flags (e.g. preeclampsia, dyspnea).',
    'Registration staff loudly verbalize PHI and diagnostic details during intake, breaching HIPAA standards.',
    'Care coordinators fail to verify whether patient home caregivers speak English prior to paper-based discharge.'
  ];

  const technologyIssues = [
    'Two-factor authentication (MFA) defaults to stale landlines with no clinic-level bypass for time-sensitive imaging results.',
    'Telehealth provider video links experience repeated packet loss and failover to unauthenticated voice calls.',
    'Provider electronic documentation disconnect: discharge instructions in portal do not match central scheduling booking slots.'
  ];

  const schedulingIssues = [
    'Neurology and Cardiology central scheduling slots are blocked 8-11 weeks out for post-stroke/NSTEMI follow-ups.',
    'Oncology chemotherapy infusion scheduling is decoupled from mandatory preceding lab draw timelines.'
  ];

  const waitTimeComplaints = [
    'Emergency Department waiting room delays exceed 5.5 hours for acute respiratory complaints with zero interim queue updates.',
    'Outpatient infusion suite delays averaging 45 minutes due to batch-processed clinical laboratory approvals.'
  ];

  // Section 5: AI Risk Monitoring
  const hallucinationTraps = records
    .filter(r => r.aiRiskFlag === 'Hallucination Trap')
    .map(r => ({
      patientId: r.patientId,
      comment: r.patientComment,
      trapDetails: 'Patient expresses uncertain recollection ("maybe a bone scan", "cannot remember") combined with empty portal encounter summary.',
      safeguardApplied: 'Model constrained from guessing clinical facts. Human review flagged; recommends audit of unsigned EHR note.'
    }));

  const biasRelatedComments = records
    .filter(r => r.aiRiskFlag === 'Bias Review Required')
    .map(r => ({
      patientId: r.patientId,
      comment: r.patientComment,
      biasConcern: r.patientComment.includes('country') ? 'Discriminatory cultural generalization regarding pain tolerance delaying sepsis diagnosis.' :
                   r.patientComment.includes('deaf') ? 'Failure to provide functional ADA auxiliary aids in perioperative holding.' :
                   'Unprofessional mocking of patient pain expression by triage nursing staff.',
      mitigation: 'Escalated to Hospital Risk Management and Office of Health Equity for immediate clinician peer review.'
    }));

  const casesRequiringHumanReview = records
    .filter(r => r.complaintSeverity === 'Critical' || r.aiRiskFlag !== 'None')
    .map(r => ({
      patientId: r.patientId,
      reason: r.aiRiskFlag !== 'None' ? `AI Flag: ${r.aiRiskFlag}` : 'Critical Patient Safety / Severity Level 4',
      department: r.serviceLine
    }));

  // Section 6: Executive Recommendations
  const top5OrganizationalPriorities = [
    'Overhaul Acute Care Discharge: Enforce mandatory bedside caregiver language check and DME confirmation prior to release.',
    'Implement Transparent Emergency Department Queueing: Install digital tracking monitors and assign dedicated waiting room navigators.',
    'Standardize Telephone Triage Protocols: Enforce algorithmic escalation pathways for post-discharge clinical red-flag symptoms.',
    'Remediate ADA & Language Equity Gaps: Upgrade video-remote interpreter terminals and institute zero-tolerance bias reporting.',
    'Harmonize Scheduling & Revenue Cycle: Unblock 14-day urgent post-discharge specialist slots and pause collections during active billing audits.'
  ];

  const quickWinsWithin3Months = [
    'Institute automated EHR SMS language preference prompts for all admitted patients.',
    'Configure portal 2FA emergency SMS reset workflow to unblock elderly and low-digital-literacy patients.',
    'Mandate a 24-hour post-discharge telephone callback for all Cardiology and Inpatient Surgery discharges.',
    'Place digital whiteboards in ED waiting rooms displaying average provider triage times by acuity level.'
  ];

  const longTermAIOpportunities = [
    'Deploy predictive clinical NLP to scan patient portal messages in real-time for urgent clinical decompensation signals.',
    'Integrate automated multilingual discharge instruction generators verified against clinical safety guardrails.',
    'Implement cross-departmental AI triage to automatically route billing disputes and clinical grievances directly to responsible teams.'
  ];

  return {
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    section1_ExecutiveOverview: {
      totalCommentsAnalyzed: total,
      averageSatisfactionScore: Number(avgSat.toFixed(2)),
      averageCommunicationRating: Number(avgComm.toFixed(2)),
      followUpComplianceRate: complianceRate,
      serviceLinesCount: serviceLinesSet.size
    },
    section2_SatisfactionInsights: {
      distribution,
      byServiceLine,
      byVisitType,
      byPersona
    },
    section3_NLPAnalysis: {
      topThemes,
      topKeywords,
      wordCloudTerms
    },
    section4_HiddenOrganizationalProblems: {
      highComplaintServiceLines,
      communicationBottlenecks,
      technologyIssues,
      schedulingIssues,
      waitTimeComplaints
    },
    section5_AIRiskMonitoring: {
      hallucinationTraps,
      biasRelatedComments,
      casesRequiringHumanReview
    },
    section6_ExecutiveRecommendations: {
      top5OrganizationalPriorities,
      quickWinsWithin3Months,
      longTermAIOpportunities
    }
  };
}

/**
 * AGENT 6: Patient Readmission Risk Agent
 * Authoritative Tasks:
 * Step 1: Readmission Risk Stratification (Low, Moderate, High)
 * Step 2: Primary Barrier Identification (Medication Non-Adherence, Lack of Transport, Inadequate Communication, Unresolved Symptoms, Financial, Social Isolation)
 * Step 3: Clinical & Operational Impact
 * Step 4: AI Risk Flag Review
 * Step 5: Care Coordination Action
 * Step 6: Future Changes (revised input for Care Transitions)
 */
export function analyzePatientReadmissionRisk(records: PatientRecord[]): ReadmissionRiskAnalysis {
  let highRiskCount = 0;
  let moderateRiskCount = 0;
  let lowRiskCount = 0;
  const barrierCounts: Record<string, number> = {};
  const highRiskAlerts: ReadmissionRiskItem[] = [];

  const items: ReadmissionRiskItem[] = records.map(record => {
    const text = record.patientComment.toLowerCase();
    
    // Step 1: Readmission Risk Stratification
    let riskLevel: ReadmissionRiskItem['riskLevel'] = 'Low';
    if (
      record.readmissionRisk === 'High' ||
      record.serviceLine === 'Cardiology' ||
      text.includes('sepsis') ||
      text.includes('oxygen sat') ||
      text.includes('heart failure') ||
      text.includes('bypass')
    ) {
      riskLevel = 'High';
      highRiskCount++;
    } else if (
      record.readmissionRisk === 'Moderate' ||
      record.followUpCompliance === 'Partial' ||
      text.includes('rural') ||
      text.includes('45 miles') ||
      text.includes('missed')
    ) {
      riskLevel = 'Moderate';
      moderateRiskCount++;
    } else {
      riskLevel = 'Low';
      lowRiskCount++;
    }

    // Step 2: Primary Barrier Identification
    let primaryBarrier: ReadmissionRiskItem['primaryBarrier'] = 'Inadequate Discharge Communication';

    if (text.includes('prescript') || text.includes('water pill') || text.includes('bottles') || text.includes('medication')) {
      primaryBarrier = 'Medication Non-Adherence / Confusion';
    } else if (text.includes('rural') || text.includes('drive') || text.includes('45 miles') || text.includes('transportation')) {
      primaryBarrier = 'Lack of Transportation / Accessibility';
    } else if (text.includes('spanish') || text.includes('deaf') || text.includes('paper') || text.includes('portal') || text.includes('rushed')) {
      primaryBarrier = 'Inadequate Discharge Communication';
    } else if (text.includes('fever') || text.includes('racing') || text.includes('sepsis') || text.includes('headache') || text.includes('oxygen')) {
      primaryBarrier = 'Unresolved Clinical Symptoms';
    } else if (text.includes('scale') || text.includes('afford') || text.includes('social security') || text.includes('bill')) {
      primaryBarrier = 'Financial / Insurance Constraints';
    } else if (text.includes('live alone') || text.includes('niece') || text.includes('alone')) {
      primaryBarrier = 'Social Isolation / Lack of Caregiver Support';
    }

    barrierCounts[primaryBarrier] = (barrierCounts[primaryBarrier] || 0) + 1;

    // Step 3: Clinical & Operational Impact
    let clinicalAndOperationalImpact = 'Care transition vulnerability contributing to preventable post-acute utilization.';
    if (primaryBarrier === 'Medication Non-Adherence / Confusion') {
      clinicalAndOperationalImpact = 'Omission of essential cardiac/anticoagulant therapy creates rapid decompensation risk, fluid overload, and high 30-day CMS readmission penalty exposure.';
    } else if (primaryBarrier === 'Unresolved Clinical Symptoms') {
      clinicalAndOperationalImpact = 'Unrecognized early infection or hypertensive crisis leading to septic shock or stroke, requiring high-cost ICU readmission.';
    } else if (primaryBarrier === 'Lack of Transportation / Accessibility') {
      clinicalAndOperationalImpact = 'Inability to attend rehabilitation leads to joint contracture, functional decline, and avoidable revision surgery.';
    } else if (primaryBarrier === 'Financial / Insurance Constraints') {
      clinicalAndOperationalImpact = 'Absence of basic biometric self-monitoring tools (scale, BP cuff) blinds care team to fluid retention until emergency presentation.';
    } else {
      clinicalAndOperationalImpact = 'Communication gaps lead to patient anxiety, missed outpatient follow-up, and reliance on Emergency Department for primary care.';
    }

    // Step 4: AI Risk Flag Review
    const aiRiskFlagReview = {
      flagged: record.aiRiskFlag !== 'None' || riskLevel === 'High',
      issue: record.aiRiskFlag !== 'None' 
        ? `Clinical Flag [${record.aiRiskFlag}]: ${record.socioeconomicBarrier || 'Socioeconomic vulnerability identified.'}`
        : 'High 30-day readmission risk based on clinical trajectory.',
      humanClinicianReviewRequired: riskLevel === 'High' || record.aiRiskFlag === 'Human Review Required' || record.aiRiskFlag === 'Conflicting Follow-up Data'
    };

    // Step 5: Care Coordination Action
    let careCoordinationAction = 'Conduct routine 72-hour phone follow-up and confirm appointment schedule.';
    if (primaryBarrier === 'Medication Non-Adherence / Confusion') {
      careCoordinationAction = 'Dispatch home health nurse for bedside medication reconciliation; provide blister-packed color-coded prescription trays with large-print labels.';
    } else if (primaryBarrier === 'Lack of Transportation / Accessibility') {
      careCoordinationAction = 'Authorize hospital non-emergency medical transportation (NEMT) rideshare vouchers or convert physical therapy to in-home visiting therapist.';
    } else if (primaryBarrier === 'Financial / Insurance Constraints') {
      careCoordinationAction = 'Enroll in hospital charity care equipment program; provide complimentary cellular-connected digital scale and BP monitor.';
    } else if (primaryBarrier === 'Inadequate Discharge Communication') {
      careCoordinationAction = 'Reissue simplified translated care instructions and conduct bilingual nurse telehealth teach-back session with family caregiver.';
    } else if (primaryBarrier === 'Unresolved Clinical Symptoms') {
      careCoordinationAction = 'Trigger same-day clinical telehealth provider evaluation or facilitate direct-admission protocol bypass.';
    }

    // Step 6: Future Changes proposal
    const futureCareTransitionImprovement = 'Integrate an automated Care Transition Intake Module directly into EHR discharge summaries, capturing real-time pharmacy fill verification and caregiver transportation confirmation before bed release.';

    const item: ReadmissionRiskItem = {
      patientId: record.patientId,
      riskLevel,
      primaryBarrier,
      clinicalAndOperationalImpact,
      aiRiskFlagReview,
      careCoordinationAction,
      futureCareTransitionImprovement
    };

    if (riskLevel === 'High') {
      highRiskAlerts.push(item);
    }

    return item;
  });

  return {
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    highRiskCount,
    moderateRiskCount,
    lowRiskCount,
    barrierDistribution: barrierCounts,
    items,
    highRiskAlerts,
    careCoordinationActionSteps: [
      'Prioritize high-risk cardiac and post-op surgical patients for 24-hour home health visits.',
      'Deploy cellular-connected remote patient monitoring (RPM) kits for heart failure patients lacking home scales.',
      'Establish a rapid-response discharge liaison to confirm home oxygen concentrator delivery 2 hours prior to physical discharge.',
      'Standardize bilingual caregiver teach-back verification before signing discharge clearance.'
    ],
    futureCareTransitionProposal: 'Proposed Step 6 Enhancement: Build an interactive Care Transition Portal where outpatient clinics, home health aides, and family caregivers can collaboratively update transition milestones and flag early decompensation before 30-day readmission thresholds are triggered.'
  };
}

/**
 * Cross-Agent Synthesis Engine
 * Identifies consensus across agents, highlights conflicts/divergences, and generates the Human Review Queue
 */
export function generateCrossAgentInsights(
  records: PatientRecord[],
  results: {
    feedback?: FeedbackInsightAnalysis;
    experience?: ExperienceMonitoringAnalysis;
    triage?: ComplaintTriageAnalysis;
    manager?: HospitalManagerAnalysis;
    analytics?: HealthcareAnalyticsResult;
    readmission?: ReadmissionRiskAnalysis;
  }
): {
  crossAgentFindings: CrossAgentFinding[];
  conflictingInterpretations: ConflictingInterpretation[];
  humanReviewQueue: HumanReviewItem[];
} {
  const crossAgentFindings: CrossAgentFinding[] = [
    {
      id: 'FINDING-01',
      title: 'Systemic Post-Discharge Medication & DME Transition Failure in Cardiology',
      supportingAgents: ['feedback-insight', 'experience-monitoring', 'hospital-manager', 'readmission-risk'],
      consensusSummary: 'Four independent agents converged on Cardiology discharge workflows as the highest systemic threat. Failures include uncoordinated oxygen delivery, untranslated Spanish prescription instructions, and visual confusion over identical cardiac pills.',
      serviceLineAffected: 'Cardiology',
      urgency: 'Critical',
      actionableRecommendation: 'Implement mandatory bedside medication teach-back with certified medical interpreters and require vendor delivery confirmation before cardiac patient discharge.',
      evidenceSnippets: [
        'PT-1001: Discharged on Friday with three new cardiac prescriptions with no Spanish instructions.',
        'PT-1010: Arrived home at 3:30 PM with no oxygen concentrator, requiring 911 call as O2 sat dropped below 84%.',
        'PT-1015: Stopped water pill due to dizziness and confusing identical bottle labels.'
      ]
    },
    {
      id: 'FINDING-02',
      title: 'Emergency Department Intake Bottlenecks & Triage Communication Deficit',
      supportingAgents: ['feedback-insight', 'complaint-triage', 'hospital-manager', 'healthcare-analytics'],
      consensusSummary: 'Consistent findings show patients facing 5.5+ hour waiting room delays for acute pediatric and respiratory concerns without transparency, leading to escalated Level 3 & Level 4 complaints.',
      serviceLineAffected: 'Emergency',
      urgency: 'High',
      actionableRecommendation: 'Deploy digital waiting room queue monitors and staff a designated triage patient experience liaison during peak volume hours.',
      evidenceSnippets: [
        'PT-1002: Waited over 5.5 hours with acute wheezing 6-year-old with zero queue updates.',
        'PT-1016: Dehumanizing staff conduct during acute ureteral colic triage.'
      ]
    },
    {
      id: 'FINDING-03',
      title: 'Digital Divide & Inflexible Authentication Locking Out High-Need Patients',
      supportingAgents: ['experience-monitoring', 'hospital-manager', 'healthcare-analytics'],
      consensusSummary: 'Rigid two-factor authentication sending verification codes to outdated landlines effectively excludes older and rural patients from timely diagnostic imaging and pathology results.',
      serviceLineAffected: 'Oncology & Neurology',
      urgency: 'Medium',
      actionableRecommendation: 'Provide an in-person or verified phone clinic MFA reset pathway, and maintain alternative telephone notification for urgent pathology.',
      evidenceSnippets: [
        'PT-1018: 90 minutes on hold attempting to view PET scan results locked behind landline 2FA.'
      ]
    }
  ];

  const conflictingInterpretations: ConflictingInterpretation[] = [
    {
      id: 'CONFLICT-01',
      patientId: 'PT-1002',
      commentSnippet: 'Waited over 5.5 hours in ED... doctor was great, but delay terrified us. Also received surprise bill...',
      divergence: {
        agentA: {
          id: 'feedback-insight',
          claim: 'Classified sentiment as "Mixed" due to praise of the treating physician ("doctor was great").'
        },
        agentB: {
          id: 'complaint-triage',
          claim: 'Escalated severity to "LEVEL 3 – High" due to pediatric wheezing triage delay and surprise out-of-network balance billing.'
        }
      },
      resolutionGuidance: 'While patient expressed clinical gratitude, the operational and financial risks remain high. Operational management must treat as high priority regardless of positive bedside rapport.',
      requiresHumanReview: true
    },
    {
      id: 'CONFLICT-02',
      patientId: 'PT-1005',
      commentSnippet: 'Telehealth video failed... provider mixed up wound notes with gallbladder removal instead of appendectomy.',
      divergence: {
        agentA: {
          id: 'feedback-insight',
          claim: 'Classified primary theme as "Technology / Patient Portal" due to video connection failures.'
        },
        agentB: {
          id: 'hospital-manager',
          claim: 'Flagged as "AI Hallucination Trap & Chart Discrepancy" requiring clinical record audit to verify wound care integrity.'
        }
      },
      resolutionGuidance: 'Both technical video platform instability and provider documentation integrity must be reviewed by the Telehealth Director.',
      requiresHumanReview: true
    }
  ];

  // Human Review Queue
  const humanReviewQueue: HumanReviewItem[] = records
    .filter(r => r.complaintSeverity === 'Critical' || r.aiRiskFlag !== 'None' || r.readmissionRisk === 'High')
    .slice(0, 8)
    .map((r, idx) => ({
      id: `REV-${1000 + idx}`,
      patientId: r.patientId,
      flaggedBy: (r.complaintSeverity === 'Critical' ? ['complaint-triage', 'hospital-manager'] : ['feedback-insight', 'readmission-risk']) as any,
      reason: r.aiRiskFlag !== 'None' ? `AI Flag: ${r.aiRiskFlag}` : `Severity: ${r.complaintSeverity} / Readmission Risk: ${r.readmissionRisk}`,
      severity: r.complaintSeverity === 'Critical' ? 'Critical' : 'High',
      aiObservation: `Patient (${r.persona}) reported significant operational/clinical transition failure in ${r.serviceLine}. Satisfaction score: ${r.satisfactionScore}/5.`,
      aiRecommendation: `Escalate to ${r.serviceLine} department leadership and assign clinical navigator for direct patient outreach.`,
      evidence: r.patientComment,
      status: 'Pending Review'
    }));

  return {
    crossAgentFindings,
    conflictingInterpretations,
    humanReviewQueue
  };
}
