import React from 'react';
import { AgentId, AgentStatus } from '../types';

interface AgentAvatarProps {
  agentId: AgentId;
  status: AgentStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAnimation?: boolean;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agentId,
  status,
  size = 'md',
  showAnimation = true
}) => {
  const isProcessing = status === 'processing';
  const isSelected = status === 'selected';
  const isCompleted = status === 'completed';

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  }[size];

  // Colors & visual motifs per agent
  const palette = {
    'feedback-insight': {
      bg: 'from-teal-600 to-teal-800',
      scrub: '#0f766e',
      coat: '#f8fafc',
      accent: '#2dd4bf',
      glow: 'shadow-teal-500/20',
      badgeColor: '#14b8a6'
    },
    'experience-monitoring': {
      bg: 'from-indigo-600 to-indigo-800',
      scrub: '#4338ca',
      coat: '#1e1b4b',
      accent: '#818cf8',
      glow: 'shadow-indigo-500/20',
      badgeColor: '#6366f1'
    },
    'complaint-triage': {
      bg: 'from-rose-600 to-rose-800',
      scrub: '#be123c',
      coat: '#881337',
      accent: '#fb7185',
      glow: 'shadow-rose-500/20',
      badgeColor: '#f43f5e'
    },
    'hospital-manager': {
      bg: 'from-amber-700 to-amber-900',
      scrub: '#78350f',
      coat: '#312e81',
      accent: '#fbbf24',
      glow: 'shadow-amber-500/20',
      badgeColor: '#f59e0b'
    },
    'healthcare-analytics': {
      bg: 'from-cyan-700 to-cyan-900',
      scrub: '#0e7490',
      coat: '#164e63',
      accent: '#38bdf8',
      glow: 'shadow-cyan-500/20',
      badgeColor: '#06b6d4'
    },
    'readmission-risk': {
      bg: 'from-emerald-700 to-emerald-900',
      scrub: '#047857',
      coat: '#064e3b',
      accent: '#34d399',
      glow: 'shadow-emerald-500/20',
      badgeColor: '#10b981'
    }
  }[agentId];

  return (
    <div className={`relative ${sizeClasses} select-none transition-transform duration-300 ${isProcessing && showAnimation ? 'scale-105' : ''}`}>
      {/* Dynamic Processing Aura / Scanning Glow */}
      {isProcessing && showAnimation && (
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-teal-400/30 via-indigo-400/30 to-emerald-400/30 blur-md animate-pulse pointer-events-none" />
      )}

      {/* Main Avatar Container */}
      <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b ${palette.bg} shadow-md ${isProcessing ? palette.glow : ''} border ${
        isSelected ? 'border-teal-400 ring-2 ring-teal-400/40' :
        isProcessing ? 'border-amber-300 ring-2 ring-amber-300/50' :
        isCompleted ? 'border-emerald-400' : 'border-slate-700/30'
      }`}>
        
        {/* Workstation Background Glow & Medical Wall Texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px]" />

        {/* Ambient Monitor Screen Glow in Office */}
        <div className={`absolute top-1 right-1 w-8 h-6 rounded bg-slate-900/70 border border-slate-600/50 flex flex-col justify-center items-center p-0.5 ${
          isProcessing ? 'border-teal-300/80 shadow-[0_0_8px_rgba(45,212,191,0.5)]' : ''
        }`}>
          {/* Simulated chart / waveform lines */}
          <div className="w-full flex items-end justify-between h-2 px-0.5 gap-0.5">
            <span className={`w-0.5 bg-teal-400 rounded-full transition-all duration-300 ${isProcessing ? 'h-2 animate-bounce' : 'h-1'}`} />
            <span className={`w-0.5 bg-cyan-300 rounded-full transition-all duration-300 ${isProcessing ? 'h-3 animate-pulse delay-75' : 'h-1.5'}`} />
            <span className={`w-0.5 bg-amber-400 rounded-full transition-all duration-300 ${isProcessing ? 'h-2.5 animate-bounce delay-150' : 'h-1'}`} />
            <span className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-300 ${isProcessing ? 'h-1.5 animate-pulse delay-200' : 'h-0.5'}`} />
          </div>
          {isProcessing && (
            <div className="w-full h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 mt-0.5 animate-pulse" />
          )}
        </div>

        {/* SVG Portrait Character with Distinct Clinical Features */}
        <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
          <defs>
            <linearGradient id={`grad-skin-${agentId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7d0b3" />
              <stop offset="100%" stopColor="#eab592" />
            </linearGradient>
            <linearGradient id={`grad-hair-${agentId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={agentId === 'hospital-manager' ? '#4b5563' : agentId === 'healthcare-analytics' ? '#92400e' : '#1f2937'} />
              <stop offset="100%" stopColor={agentId === 'hospital-manager' ? '#374151' : '#111827'} />
            </linearGradient>
            <linearGradient id={`scan-beam-${agentId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(45,212,191,0)" />
              <stop offset="50%" stopColor="rgba(45,212,191,0.5)" />
              <stop offset="100%" stopColor="rgba(45,212,191,0)" />
            </linearGradient>
          </defs>

          {/* Torso & Uniform */}
          <g className={`transition-transform duration-300 ${isProcessing ? 'translate-y-[-1px]' : ''}`}>
            {/* Shoulders / Lab Coat / Scrubs */}
            <path
              d="M18 100 C 18 72, 32 68, 50 68 C 68 68, 82 72, 82 100 Z"
              fill={palette.scrub}
            />

            {/* V-Neck / Shirt Collar */}
            <path d="M42 68 L50 82 L58 68 Z" fill="#ffffff" />
            
            {/* Stethoscope for Readmission & Triage agents */}
            {(agentId === 'readmission-risk' || agentId === 'complaint-triage') && (
              <path
                d="M38 72 C 38 88, 62 88, 62 72"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Neck */}
            <rect x="44" y="54" width="12" height="16" fill={`url(#grad-skin-${agentId})`} rx="2" />

            {/* Head */}
            <ellipse cx="50" cy="44" rx="16" ry="19" fill={`url(#grad-skin-${agentId})`} />

            {/* Ears */}
            <circle cx="33" cy="45" r="3.5" fill="#eab592" />
            <circle cx="67" cy="45" r="3.5" fill="#eab592" />

            {/* Headset for Complaint Triage */}
            {agentId === 'complaint-triage' && (
              <g>
                <path d="M32 44 C 32 24, 68 24, 68 44" fill="none" stroke="#334155" strokeWidth="2.5" />
                <rect x="30" y="40" width="5" height="9" rx="2" fill="#0f172a" />
                <path d="M33 48 C 36 56, 42 56, 46 54" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                <circle cx="46" cy="54" r="1.5" fill="#ef4444" />
              </g>
            )}

            {/* Hair Styles */}
            {agentId === 'feedback-insight' && (
              <g>
                {/* Neat professional updo */}
                <path d="M33 38 C 33 22, 67 22, 67 38 C 65 32, 58 26, 50 26 C 42 26, 35 32, 33 38 Z" fill={`url(#grad-hair-${agentId})`} />
                <ellipse cx="50" cy="22" rx="7" ry="6" fill={`url(#grad-hair-${agentId})`} />
              </g>
            )}

            {agentId === 'experience-monitoring' && (
              /* Short cropped professional side-part */
              <path d="M33 38 C 33 24, 67 22, 67 38 C 65 28, 55 27, 45 28 C 38 29, 34 33, 33 38 Z" fill={`url(#grad-hair-${agentId})`} />
            )}

            {agentId === 'hospital-manager' && (
              /* Distinguished parted executive hair with subtle silver temples */
              <g>
                <path d="M32 40 C 32 23, 68 23, 68 40 C 66 28, 56 27, 48 27 C 40 28, 35 32, 32 40 Z" fill={`url(#grad-hair-${agentId})`} />
                <path d="M32 36 L36 34" stroke="#9ca3af" strokeWidth="1.5" />
                <path d="M68 36 L64 34" stroke="#9ca3af" strokeWidth="1.5" />
              </g>
            )}

            {agentId === 'healthcare-analytics' && (
              /* Sleek modern bob cut */
              <path d="M32 44 C 31 30, 69 30, 68 44 C 69 49, 67 56, 64 58 C 66 42, 65 30, 50 29 C 35 30, 34 42, 36 58 C 33 56, 31 49, 32 44 Z" fill={`url(#grad-hair-${agentId})`} />
            )}

            {agentId === 'readmission-risk' && (
              /* Clean taper fade haircut */
              <path d="M33 38 C 33 24, 67 24, 67 38 C 66 28, 58 26, 50 26 C 42 26, 34 28, 33 38 Z" fill={`url(#grad-hair-${agentId})`} />
            )}

            {/* Eyes */}
            <ellipse cx="44" cy="44" rx="2" ry="2.5" fill="#1e293b" />
            <ellipse cx="56" cy="44" rx="2" ry="2.5" fill="#1e293b" />
            <circle cx="44.5" cy="43.5" r="0.7" fill="#ffffff" />
            <circle cx="56.5" cy="43.5" r="0.7" fill="#ffffff" />

            {/* Eyeglasses for Analytics & Feedback Insight */}
            {(agentId === 'healthcare-analytics' || agentId === 'feedback-insight') && (
              <g stroke="#334155" strokeWidth="1.2" fill="rgba(255,255,255,0.2)">
                <rect x="40" y="40" width="8" height="7" rx="2" />
                <rect x="52" y="40" width="8" height="7" rx="2" />
                <line x1="48" y1="43" x2="52" y2="43" />
              </g>
            )}

            {/* Eyebrows */}
            <path d="M41 39 Q44 38 47 39" stroke="#475569" strokeWidth="1" fill="none" />
            <path d="M53 39 Q56 38 59 39" stroke="#475569" strokeWidth="1" fill="none" />

            {/* Nose */}
            <path d="M50 44 L49 49 L52 49" stroke="#d97706" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />

            {/* Mouth */}
            <path
              d={isProcessing ? "M46 54 Q50 56 54 54" : "M46 54 Q50 57 54 54"}
              stroke="#9a3412"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* ID Badge Lanyard */}
            <path d="M47 82 L47 92" stroke="#64748b" strokeWidth="1.2" />
            <rect x="44" y="90" width="12" height="10" rx="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            <rect x="46" y="93" width="8" height="2" fill={palette.badgeColor} />
            <rect x="46" y="96" width="5" height="1.5" fill="#94a3b8" />
          </g>

          {/* Active Workstation / Typing Desk in foreground */}
          <g>
            {/* Desk Surface */}
            <rect x="10" y="92" width="80" height="8" rx="2" fill="#1e293b" />
            
            {/* Keyboard / Tablet in front */}
            <rect x="36" y="90" width="28" height="6" rx="1" fill="#334155" />
            
            {/* Typing Hands with subtle animation when processing */}
            {isProcessing ? (
              <g className="animate-pulse">
                <circle cx="38" cy="89" r="2.5" fill="#f7d0b3" />
                <circle cx="62" cy="89" r="2.5" fill="#f7d0b3" />
              </g>
            ) : (
              <g>
                <circle cx="39" cy="91" r="2.2" fill="#f7d0b3" opacity="0.9" />
                <circle cx="61" cy="91" r="2.2" fill="#f7d0b3" opacity="0.9" />
              </g>
            )}
          </g>

          {/* Scanning Beam Animation when processing */}
          {isProcessing && showAnimation && (
            <rect
              x="0"
              y="0"
              width="100"
              height="35"
              fill={`url(#scan-beam-${agentId})`}
              className="animate-[pulse_1.5s_ease-in-out_infinite]"
            />
          )}
        </svg>

        {/* Live Status Pip in Corner */}
        <div className="absolute bottom-1.5 right-1.5 z-10 flex items-center justify-center">
          {isProcessing ? (
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white" />
            </span>
          ) : isCompleted ? (
            <span className="inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
          ) : isSelected ? (
            <span className="inline-flex rounded-full h-3.5 w-3.5 bg-teal-500 border-2 border-white" />
          ) : (
            <span className="inline-flex rounded-full h-3 w-3 bg-slate-400/80 border-2 border-slate-900" />
          )}
        </div>
      </div>
    </div>
  );
};
