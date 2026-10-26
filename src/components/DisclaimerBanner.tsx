import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/80 border-b border-amber-200/80 text-amber-900 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-semibold text-amber-950">Clinical Quality Decision Support Notice:</span>
          <span className="text-amber-800">
            ClinicaSuite AI agents provide decision-support analytics and do not independently diagnose conditions, recommend clinical treatment, or make final compliance determinations. Human oversight is required.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] text-amber-700">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>Synthetic / De-identified Dataset</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>HIPAA Safe Harbor Compliant</span>
        </div>
      </div>
    </div>
  );
};
