import React from 'react';
import { GraduationCap, Award, Sparkles, Scroll } from 'lucide-react';

export const DiplomaBadge: React.FC = () => {
  return (
    <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 px-5 py-3 md:px-6 md:py-3.5 bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-amber-400/40 rounded-2xl shadow-[0_4px_25px_-5px_rgba(245,158,11,0.2)] backdrop-blur-md relative overflow-hidden group hover:border-amber-400/70 transition-all duration-300 mb-4 max-w-2xl mx-auto">
      {/* Animated shimmer glow line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

      {/* Animated Icons Container */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30 relative transform group-hover:scale-105 transition-transform duration-300">
          <GraduationCap size={20} className="text-slate-950 animate-[bounce_3s_infinite]" />
          <Sparkles size={10} className="absolute -top-1 -right-1 text-amber-200 fill-amber-200 animate-pulse" />
        </div>
        <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-600">
          <Scroll size={15} className="animate-[pulse_2s_infinite]" />
        </div>
      </div>

      {/* Badge Text Content */}
      <div className="text-center sm:text-left relative z-10">
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
          <Award size={12} className="text-amber-600 shrink-0" />
          <span>Official Certification</span>
        </div>
        <p className="text-xs md:text-sm lg:text-base font-extrabold text-slate-900 leading-snug tracking-tight">
          You will get <span className="text-amber-700 underline decoration-amber-400/60 underline-offset-2">Design Management certificate</span> equivalent to Diploma 📜
        </p>
      </div>
    </div>
  );
};
