import React from 'react';
import { RiskIcon, PersonalIcon, EsignIcon, BankIcon } from './UI';

const STEP_LABELS = ['Risk Profile', 'Personal Info', 'E-Sign', 'Bank'];
const STEP_ICONS = [RiskIcon, PersonalIcon, EsignIcon, BankIcon];

/**
 * activeStep: 1-4 (which macro step is current)
 * headline: optional supporting line shown under the steps
 * progress: optional 0-100, shows a sub-progress bar (used during the 7 risk questions)
 */
export default function Stepper({ activeStep, headline, progress }) {
  return (
    <div className="bg-gradient-to-br from-[#0C4A3E] to-[#0A3D33] rounded-[20px] px-7 pt-7 pb-5 mb-8 text-white">
      <div className="flex items-start justify-between">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const state = num < activeStep ? 'completed' : num === activeStep ? 'active' : 'upcoming';
          const Icon = STEP_ICONS[i];
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-2 relative">
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`absolute top-5 left-[calc(50%+22px)] w-[calc(100%-44px)] h-[1.5px] ${
                    state === 'completed' ? 'bg-white/45' : 'border-t-[1.5px] border-dashed border-white/20'
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full border-[1.5px] flex items-center justify-center relative z-10 transition-colors ${
                  state === 'active'
                    ? 'border-white/80 bg-white/15 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]'
                    : state === 'completed'
                    ? 'border-white/35 bg-white/10'
                    : 'border-white/20 bg-white/[0.06]'
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] ${
                    state === 'active' ? 'text-white' : state === 'completed' ? 'text-white/60' : 'text-white/35'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-semibold tracking-wide text-center ${
                  state === 'active' ? 'text-white font-bold' : state === 'completed' ? 'text-white/55' : 'text-white/35'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {headline && <div className="text-[15px] font-semibold text-white/85 leading-snug mt-[18px]">{headline}</div>}
      {progress != null && (
        <div className="w-full h-1 bg-white/15 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-white/60 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
