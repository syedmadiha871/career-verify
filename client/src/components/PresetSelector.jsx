import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

const PRESETS = [
  {
    id: 'fake-fee-scam',
    type: 'fake',
    title: 'Work From Home - Data Entry Specialist (Registration Fee Required)',
    description: `URGENT WORK FROM HOME DATA ENTRY OPPORTUNITY!
Earn $500 to $1000 daily with no experience required! Guaranteed income for all applicants.

Job Requirements:
- No interview required! Immediate hiring after payment.
- Registration fee of $99 for software setup and identity kit.
- Payment via bank transfer or Telegram.
- Contact recruiter on WhatsApp: +1 (555) 019-2834 or Telegram @career_job_fast
- Submit your Aadhaar card and PAN card copy for instant approval.

Earn money fast from home! Limited slots available, click now!`
  },
  {
    id: 'real-software-dev',
    type: 'real',
    title: 'Senior Full Stack Software Engineer - Acme Corp',
    description: `Senior Full Stack Software Engineer (Python / React / SQL)
Acme Technologies Inc. | San Francisco, CA (Hybrid)

About the Role:
We are seeking an experienced Senior Software Engineer with 4+ years of hands-on experience building scalable web apps using Python, Node.js, React, and SQL database systems.

Key Responsibilities:
- Design, build, and maintain high-performance microservices and API endpoints.
- Collaborate with cross-functional team members, product managers, and UI designers.
- Conduct code reviews and enforce software quality best practices.

Qualifications & Requirements:
- Bachelor's degree in Computer Science, Software Engineering, or equivalent experience.
- Strong proficiency in JavaScript, TypeScript, Python, and SQL databases.
- Excellent communication skills and team collaboration mindset.

Benefits & Perks:
- Competitive salary range: $135,000 - $165,000 / year + equity.
- Comprehensive health insurance, dental, and vision coverage.
- 401(k) matching program and generous paid time off (PTO).
- Equal Opportunity Employer (EOE).`
  }
];

export default function PresetSelector({ onSelectPreset }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Sample Presets</span>
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.description)}
            className={`text-left p-4 rounded-3xl border text-xs transition-all flex items-start space-x-3 group active:scale-95 ${
              preset.type === 'fake'
                ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/70 hover:bg-rose-950/40 text-rose-200'
                : 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 hover:bg-emerald-950/40 text-emerald-200'
            }`}
          >
            {preset.type === 'fake' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            )}
            <div>
              <div className="font-extrabold text-slate-200 group-hover:text-white mb-1">
                {preset.type === 'fake' ? 'Load Sample Fake Job Scam' : 'Load Sample Genuine Job'}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-1 font-medium">{preset.title}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
