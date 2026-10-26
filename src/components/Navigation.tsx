import React from 'react';
import { ActiveScreen } from '../types';
import { Building2, ShieldCheck, Database, Play, BarChart3, Users } from 'lucide-react';

interface NavigationProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  selectedCount: number;
  totalRecords: number;
  isProcessingAny: boolean;
  onStartAnalysis: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeScreen,
  onNavigate,
  selectedCount,
  totalRecords,
  isProcessingAny,
  onStartAnalysis
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('virtual-office')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-cyan-700 flex items-center justify-center text-white shadow-sm shadow-teal-900/10 group-hover:from-teal-800 group-hover:to-cyan-800 transition-colors">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight font-sans">
                ClinicaSuite
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-tight block">
                Clinical Virtual-Office Portal
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onNavigate('virtual-office')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeScreen === 'virtual-office'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Virtual Offices
          </button>

          <button
            onClick={() => onNavigate('data-upload')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeScreen === 'data-upload'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            Data & Validation
            <span className="text-[10px] font-mono text-slate-500 bg-slate-200/70 px-1.5 py-0.2 rounded">
              {totalRecords}
            </span>
          </button>

          <button
            onClick={() => onNavigate('agent-config')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeScreen === 'agent-config'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Task Config
            {selectedCount > 0 && (
              <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded font-bold">
                {selectedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('live-processing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeScreen === 'live-processing'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isProcessingAny ? 'text-amber-500 animate-spin' : 'text-slate-500'}`} />
            Live Processing
          </button>

          <button
            onClick={() => onNavigate('agent-results')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeScreen === 'agent-results'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            Agent Results
          </button>

          <button
            onClick={() => onNavigate('combined-dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeScreen === 'combined-dashboard'
                ? 'bg-teal-50 text-teal-900 border border-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Executive Synthesis
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartAnalysis}
            disabled={isProcessingAny || selectedCount === 0}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              isProcessingAny
                ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed'
                : selectedCount === 0
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-teal-700 text-white hover:bg-teal-800 active:scale-[0.98]'
            }`}
          >
            {isProcessingAny ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Processing {selectedCount} Agents...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run {selectedCount === 6 ? 'All 6' : selectedCount} Selected</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
