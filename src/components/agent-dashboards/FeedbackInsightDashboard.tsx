import React, { useState } from 'react';
import { FeedbackInsightAnalysis } from '../../types';
import { Search, Filter, ShieldAlert, CheckCircle2, MessageSquare, AlertTriangle, ArrowUpDown, Download } from 'lucide-react';

interface FeedbackInsightDashboardProps {
  analysis: FeedbackInsightAnalysis;
}

export const FeedbackInsightDashboard: React.FC<FeedbackInsightDashboardProps> = ({ analysis }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');

  const filteredItems = analysis.items.filter(item => {
    const matchSearch = searchTerm === '' ||
      item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.operationalIssue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTheme = selectedTheme === 'all' || item.theme === selectedTheme;
    const matchSentiment = selectedSentiment === 'all' || item.sentiment === selectedSentiment;
    return matchSearch && matchTheme && matchSentiment;
  });

  const exportCSV = () => {
    const headers = ['Patient ID', 'Theme', 'Sentiment', 'Operational Issue', 'Risk or Bias Concern', 'Recommended Action', 'Comment'];
    const rows = analysis.items.map(i => [
      i.patientId,
      i.theme,
      i.sentiment,
      `"${i.operationalIssue.replace(/"/g, '""')}"`,
      `"${i.riskOrBiasConcern.replace(/"/g, '""')}"`,
      `"${i.recommendedAction.replace(/"/g, '""')}"`,
      `"${i.comment.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'agent1_feedback_insights.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Metric Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <span>Agent 1 Result Canvas</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-mono">Analyzed at {analysis.completedAt}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Patient Feedback Insight Dashboard
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Structured six-step qualitative analysis: Theme, Sentiment, Reasoning, Operational Issue, Risk/Bias Concern, and Recommended Action.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Findings</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Comments</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{analysis.totalComments}</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-700 block">High Risk / Bias Flags</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-800">{analysis.highRiskCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
            <span className="text-[11px] font-semibold text-teal-700 block">Top Theme</span>
            <span className="text-sm font-bold text-teal-900 truncate block mt-1">Discharge & Follow-Up</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-700 block">Sentiment Ratio</span>
            <span className="text-xs font-semibold text-amber-900 block mt-1">
              {analysis.sentimentDistribution['Negative'] || 0} Neg / {analysis.sentimentDistribution['Mixed'] || 0} Mixed / {analysis.sentimentDistribution['Positive'] || 0} Pos
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search comment narratives, operational issues, patient IDs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTheme}
            onChange={e => setSelectedTheme(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 py-2 px-2.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All 9 Themes</option>
            <option value="Communication">Communication</option>
            <option value="Scheduling">Scheduling</option>
            <option value="Wait Time">Wait Time</option>
            <option value="Technology / Patient Portal">Technology / Portal</option>
            <option value="Billing">Billing</option>
            <option value="Clinical Care">Clinical Care</option>
            <option value="Discharge / Follow-Up">Discharge / Follow-Up</option>
            <option value="Accessibility / Equity">Accessibility / Equity</option>
            <option value="Mixed or Ambiguous">Mixed or Ambiguous</option>
          </select>

          <select
            value={selectedSentiment}
            onChange={e => setSelectedSentiment(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 py-2 px-2.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Neutral">Neutral</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Case-by-Case 6-Step Analytical Cards */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <div
            key={item.patientId}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4"
          >
            {/* Case Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {item.patientId}
                </span>
                <span className="text-xs font-semibold text-teal-800">
                  Theme: {item.theme}
                </span>
                <span className="text-slate-300">·</span>
                <span className={`text-xs font-semibold ${
                  item.sentiment === 'Negative' ? 'text-rose-700' :
                  item.sentiment === 'Positive' ? 'text-emerald-700' :
                  item.sentiment === 'Mixed' ? 'text-amber-700' : 'text-slate-600'
                }`}>
                  Sentiment: {item.sentiment}
                </span>
              </div>
            </div>

            {/* Original Patient Comment */}
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Patient Free-Text Comment (De-identified)
              </span>
              <p className="text-xs text-slate-800 italic leading-relaxed">
                "{item.comment}"
              </p>
            </div>

            {/* Steps 3, 4, 5, 6 Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              
              {/* Step 3: Reasoning */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-semibold text-slate-700 block mb-0.5">
                  Step 3. Reasoning
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {item.reasoning}
                </p>
              </div>

              {/* Step 4: Operational Issue */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="font-semibold text-slate-700 block mb-0.5">
                  Step 4. Operational Healthcare Issue
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {item.operationalIssue}
                </p>
              </div>

              {/* Step 5: Risk or Bias Concern */}
              <div className={`p-3 rounded-xl border ${
                item.riskOrBiasConcern.includes('High')
                  ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                  : 'bg-slate-50 border-slate-200/70 text-slate-700'
              }`}>
                <span className="font-semibold block mb-0.5 flex items-center gap-1.5">
                  {item.riskOrBiasConcern.includes('High') && <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
                  <span>Step 5. Risk or Bias Concern</span>
                </span>
                <p className="leading-relaxed">
                  {item.riskOrBiasConcern}
                </p>
              </div>

              {/* Step 6: Recommended Action */}
              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200 text-teal-950">
                <span className="font-semibold block mb-0.5 flex items-center gap-1.5 text-teal-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Step 6. Managerial Action Recommendation</span>
                </span>
                <p className="leading-relaxed text-teal-900">
                  {item.recommendedAction}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
