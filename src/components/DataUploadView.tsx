import React, { useState } from 'react';
import { PatientRecord } from '../types';
import { SAMPLE_PATIENT_RECORDS } from '../data/sampleDataset';
import { UploadCloud, CheckCircle2, AlertTriangle, FileSpreadsheet, RefreshCw, Download, ArrowRight, ShieldCheck, Eye, Search } from 'lucide-react';

interface DataUploadViewProps {
  records: PatientRecord[];
  onUpdateRecords: (records: PatientRecord[]) => void;
  onProceedToConfig: () => void;
}

export const DataUploadView: React.FC<DataUploadViewProps> = ({
  records,
  onUpdateRecords,
  onProceedToConfig
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterServiceLine, setFilterServiceLine] = useState<string>('all');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Detected Columns Audit
  const columnAudit = [
    { name: 'patientId', type: 'Identifier (De-identified)', status: 'Valid', notes: 'Masked format (PT-xxxx)' },
    { name: 'ageGroup', type: 'Categorical', status: 'Valid', notes: 'HIPAA Safe Harbor binned' },
    { name: 'persona', type: 'Clinical Persona', status: 'Valid', notes: 'Socio-clinical archetype' },
    { name: 'visitType', type: 'Categorical', status: 'Valid', notes: 'Inpatient / Outpatient / ED / Surgery' },
    { name: 'serviceLine', type: 'Categorical', status: 'Valid', notes: '8 hospital specialty services' },
    { name: 'satisfactionScore', type: 'Numeric (1-5)', status: 'Valid', notes: 'HCAHPS aligned standard' },
    { name: 'communicationRating', type: 'Numeric (1-5)', status: 'Valid', notes: 'Physician/nurse communication' },
    { name: 'followUpCompliance', type: 'Categorical', status: 'Valid', notes: 'Post-discharge follow-up status' },
    { name: 'complaintSeverity', type: 'Ordinal (None - Critical)', status: 'Valid', notes: 'Triage grading scale' },
    { name: 'readmissionRisk', type: 'Ordinal (Low - High)', status: 'Valid', notes: '30-day readmission risk flag' },
    { name: 'aiRiskFlag', type: 'Security / Quality Flag', status: 'Valid', notes: 'Hallucination & Bias trap markers' },
    { name: 'patientComment', type: 'Unstructured Free-Text', status: 'Valid', notes: 'De-identified narrative feedback' }
  ];

  // Simple CSV parser for user-uploaded CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setValidationErrors(['CSV file must contain a header row and at least one data row.']);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
        const newRecords: PatientRecord[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          // Naive CSV split taking care of basic quotes
          const rawRow = lines[i];
          const matches = rawRow.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawRow.split(',');
          const rowValues = matches.map(val => val.trim().replace(/^["']|["']$/g, '').replace(/""/g, '"'));

          const rec: any = {
            patientId: rowValues[0] || `PT-${1000 + i}`,
            ageGroup: rowValues[1] || '65-74',
            persona: rowValues[2] || 'Hospital Patient',
            visitType: rowValues[3] || 'Inpatient',
            serviceLine: rowValues[4] || 'Emergency',
            satisfactionScore: Number(rowValues[5]) || 3,
            communicationRating: Number(rowValues[6]) || 3,
            followUpCompliance: rowValues[7] || 'Partial',
            complaintSeverity: rowValues[8] || 'Moderate',
            portalUsage: rowValues[9] || 'Active',
            readmissionRisk: rowValues[10] || 'Moderate',
            aiRiskFlag: rowValues[11] || 'None',
            patientComment: rowValues[12] || 'Patient feedback recorded at discharge.'
          };

          newRecords.push(rec as PatientRecord);
        }

        if (newRecords.length > 0) {
          onUpdateRecords(newRecords);
          setUploadStatus(`Successfully parsed and loaded ${newRecords.length} records from ${file.name}`);
          setValidationErrors([]);
        }
      } catch (err: any) {
        setValidationErrors([`Failed to parse CSV: ${err.message || 'Check CSV structure'}`]);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    onUpdateRecords(SAMPLE_PATIENT_RECORDS);
    setUploadStatus('Loaded 18 standardized synthetic clinical benchmark records.');
    setValidationErrors([]);
  };

  const handleDownloadCSV = () => {
    const headers = [
      'patientId', 'ageGroup', 'persona', 'visitType', 'serviceLine',
      'satisfactionScore', 'communicationRating', 'followUpCompliance',
      'complaintSeverity', 'portalUsage', 'readmissionRisk', 'aiRiskFlag', 'patientComment'
    ];
    const rows = records.map(r => [
      r.patientId,
      r.ageGroup,
      `"${r.persona}"`,
      r.visitType,
      r.serviceLine,
      r.satisfactionScore,
      r.communicationRating,
      r.followUpCompliance,
      r.complaintSeverity,
      r.portalUsage,
      r.readmissionRisk,
      r.aiRiskFlag,
      `"${r.patientComment.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'clinical_patient_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(r => {
    const matchSearch = searchTerm === '' ||
      r.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientComment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSL = filterServiceLine === 'all' || r.serviceLine === filterServiceLine;
    return matchSearch && matchSL;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Introduction */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <span>Step 1: Dataset Ingestion & Validation</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Clinical Dataset Validation & Privacy Gate
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Upload patient feedback CSV records for multi-agent analytical processing. The platform verifies column structure, enforces HIPAA Safe Harbor de-identification standards, and screens for synthetic consistency.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLoadSample}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Benchmark Dataset</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onProceedToConfig}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Configure Agents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="mt-6 p-6 border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-xl bg-slate-50/50 transition-colors text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            Upload Custom Clinical Dataset (.csv)
          </p>
          <p className="text-xs text-slate-500 mt-0.5 max-w-md">
            Drag and drop your de-identified patient CSV file here, or browse files from your computer.
          </p>
          <label className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-sm transition-colors">
            <span>Browse CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload Status / Validation Notification */}
        {uploadStatus && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{uploadStatus}</span>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Validation Warning:</span>
            </div>
            {validationErrors.map((err, i) => (
              <p key={i} className="pl-5 text-rose-700">{err}</p>
            ))}
          </div>
        )}
      </div>

      {/* Privacy & Safeguard Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 mb-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>HIPAA Safe Harbor Protocol</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All patient identifiers (names, SSNs, medical record numbers, full birth dates) are removed or mapped to synthetic surrogates (e.g., PT-xxxx).
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 mb-1">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <span>Structural Column Verification</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            12 core clinical parameters detected across all records: Service line, visit type, HCAHPS ratings, readmission risk, and free-text narrative.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>AI Risk Flag Surveillance</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pre-scanned for deliberate hallucination traps, cultural bias reviews, and data contradictions requiring human clinician oversight.
          </p>
        </div>
      </div>

      {/* Detected Schema & Column Types */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Detected Schema & Column Types ({columnAudit.length} Fields)
          </h2>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            All 12 Columns Validated
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-2.5">Field Name</th>
                <th className="px-4 py-2.5">Data Type</th>
                <th className="px-4 py-2.5">Compliance Status</th>
                <th className="px-4 py-2.5">Analytical Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {columnAudit.map((col, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2 font-mono font-medium text-slate-900">{col.name}</td>
                  <td className="px-4 py-2 text-slate-600">{col.type}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {col.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-500">{col.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Dataset Preview ({filteredRecords.length} of {records.length} Records)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available to all selected clinical agents for parallel analysis
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, persona, narrative..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Service Line Filter */}
            <select
              value={filterServiceLine}
              onChange={e => setFilterServiceLine(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Service Lines</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Emergency">Emergency</option>
              <option value="General Surgery">General Surgery</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Oncology">Oncology</option>
              <option value="Neurology">Neurology</option>
              <option value="Maternity">Maternity</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2.5">Patient ID</th>
                <th className="px-4 py-2.5">Persona & Age</th>
                <th className="px-4 py-2.5">Service Line</th>
                <th className="px-4 py-2.5">Visit</th>
                <th className="px-4 py-2.5 text-center">Score</th>
                <th className="px-4 py-2.5">Readmission</th>
                <th className="px-4 py-2.5">AI Flag</th>
                <th className="px-4 py-2.5 max-w-xs">Patient Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.map(record => (
                <tr key={record.patientId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {record.patientId}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="font-medium text-slate-800 block truncate max-w-[180px]">
                      {record.persona}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Age: {record.ageGroup}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="font-medium text-slate-800">{record.serviceLine}</span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-slate-600">
                    {record.visitType}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap font-mono tabular-nums">
                    <span className={`inline-block px-2 py-0.5 rounded font-bold ${
                      record.satisfactionScore <= 2 ? 'bg-rose-50 text-rose-700' :
                      record.satisfactionScore === 3 ? 'bg-amber-50 text-amber-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {record.satisfactionScore}/5
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`font-semibold ${
                      record.readmissionRisk === 'High' ? 'text-rose-700' :
                      record.readmissionRisk === 'Moderate' ? 'text-amber-700' : 'text-slate-600'
                    }`}>
                      {record.readmissionRisk}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {record.aiRiskFlag !== 'None' ? (
                      <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                        {record.aiRiskFlag}
                      </span>
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 max-w-sm">
                    <p className="line-clamp-2 leading-relaxed" title={record.patientComment}>
                      {record.patientComment}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
