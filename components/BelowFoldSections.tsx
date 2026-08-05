import React from 'react';
import { ArrowRight, Star, CheckCircle, CheckCircle2, X, ChevronDown, Download } from 'lucide-react';
import {
  PROBLEM_POINTS, TRANSFORMATION_STORIES, FEAR_STATS,
  VALUE_STACK_ITEMS, TESTIMONIALS_LANDING, FAQ_ITEMS_LANDING,
  PAGE_PREVIEWS_ROW1, PAGE_PREVIEWS_ROW2
} from '../pages/LandingHelpers';
import { useCountry } from '../lib/CountryContext';

interface BelowFoldSectionsProps {
  openFaqIndex: number | null;
  setOpenFaqIndex: (index: number | null) => void;
  openPaymentModal: () => void;
  formatTime: (v: number) => string;
  timeLeft: { h: number; m: number; s: number };
}

export const BelowFoldSections: React.FC<BelowFoldSectionsProps> = ({
  openFaqIndex,
  setOpenFaqIndex,
  openPaymentModal,
  formatTime,
  timeLeft,
}) => {
  const { country } = useCountry();

  return (
    <>
      {/* ═══ 7. STUDENT TRANSFORMATIONS & RENDER SHOWCASE ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12 cv-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mb-2">
            Real Student Case Studies & Render Gallery
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">See what our students create in just 15 to 30 days.</p>
        </div>

        {/* Student Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {TRANSFORMATION_STORIES.map((story, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 text-left shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{story.name}</h4>
                  <p className="text-xs text-blue-600 font-medium">{story.role}</p>
                </div>
                <span className="text-2xl">{story.emoji}</span>
              </div>
              <p className="text-xs text-slate-600 mb-2"><strong>Before:</strong> {story.before}</p>
              <p className="text-xs text-slate-900 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100"><strong>After 15 Days:</strong> {story.after}</p>
            </div>
          ))}
        </div>

        {/* Render Carousels */}
        <div className="flex flex-col gap-3 relative w-full overflow-hidden">
          <div className="flex gap-3 animate-scroll-left hover:pause w-max">
            {[...PAGE_PREVIEWS_ROW1, ...PAGE_PREVIEWS_ROW1].map((src, i) => (
              <div key={`full-ren1-${i}`} className="w-[200px] sm:w-[260px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-slate-100 shrink-0">
                <img src={src} alt="Student Render" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 animate-scroll-right hover:pause w-max">
            {[...PAGE_PREVIEWS_ROW2, ...PAGE_PREVIEWS_ROW2].map((src, i) => (
              <div key={`full-ren2-${i}`} className="w-[200px] sm:w-[260px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-slate-100 shrink-0">
                <img src={src} alt="Student Render" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. PROOF STATS (AI & Industry Shift) ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12 cv-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">
            Don't Fear AI. Partner With It.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-xl mx-auto">
            Top global studios use AI to generate 50 concepts in 10 minutes, then render them in Lumion & V-Ray.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEAR_STATS.map((item, i) => (
              <div key={i} className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl text-center">
                <span className="text-2xl block mb-1">{item.icon}</span>
                <span className="text-xl sm:text-2xl font-black text-yellow-400 block">{item.stat}</span>
                <p className="text-[11px] text-zinc-400 font-medium leading-snug mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. TEAM MANIFESTO ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12 cv-auto">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950 mb-3">
            A Message From Our Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 font-medium">
            Learning complex 3D software alone is overwhelming. That's why our program includes <strong>24/7 team support</strong>. From software download links to fixing rendering lighting at date night or 2 AM, our team is always ready to guide you step-by-step!
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-orange-500" /> 12 Courses Included</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-orange-500" /> Direct Free Software Links</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-orange-500" /> 24/7 Hand-Holding Support</span>
          </div>
        </div>
      </section>

      {/* ═══ 10. OLD VS NEW SYSTEM ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12 cv-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mb-2">
            The Frustrating Path vs. Our Hand-Holding System
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-left">
            <h3 className="font-bold text-red-600 text-base mb-3 flex items-center gap-2">
              <X size={20} /> The Frustrating Path
            </h3>
            <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5">
              {PROBLEM_POINTS.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="shrink-0">{p.emoji}</span>
                  <span>{p.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-left">
            <h3 className="font-bold text-emerald-700 text-base mb-3 flex items-center gap-2">
              <CheckCircle size={20} /> Our Hand-Holding System
            </h3>
            <ul className="text-xs sm:text-sm text-slate-800 space-y-2.5 font-medium">
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Clear step-by-step pipeline: AutoCAD → Revit → SketchUp → V-Ray → AI</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" /> 3 real paid freelance projects included ($300 USD value)</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Free software student download links provided</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" /> 24/7 technical team support whenever you get stuck</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ 11. VALUE STACK ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12 cv-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mb-2">
            Everything Included With Your Access Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">A complete learning ecosystem for a single low price.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          {VALUE_STACK_ITEMS.map((item, i) => (
            <div key={i} className="flex justify-between items-center px-6 py-4 border-b border-slate-100 text-xs sm:text-sm">
              <span className="text-slate-800 font-medium">{item.name}</span>
              <span className="font-bold text-slate-500">{item.value}</span>
            </div>
          ))}
          <div className="bg-emerald-50 px-6 py-4 flex justify-between items-center text-xs sm:text-sm font-bold text-emerald-900 border-t border-emerald-100">
            <span>All Software (Free/Student Edition Links)</span>
            <span className="text-emerald-600 font-black">INCLUDED</span>
          </div>
        </div>
      </section>

      {/* ═══ 12. STUDENT REVIEWS & GLOBAL MENTORS ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12 text-center cv-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mb-2">
            Student Reviews & Global Mentors
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">50,000+ learners • 4.9★ average rating</p>
        </div>

        {/* Testimonial Cards Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x mb-8" style={{ scrollbarWidth: 'none' }}>
          {[...TESTIMONIALS_LANDING, ...TESTIMONIALS_LANDING].map((t, i) => (
            <div key={i} className="w-[300px] shrink-0 bg-white border border-slate-200 p-5 rounded-2xl text-left shadow-xs">
              <div className="flex gap-1 mb-2">{[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-amber-400 text-amber-400" />)}</div>
              <p className="text-slate-700 text-xs leading-relaxed mb-4 italic">"{t.content}"</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">{t.name[0]}</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{t.name}</p>
                  <p className="text-[10px] text-slate-500">{t.role} • {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mentors */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
          {[
            { name: 'Alex Mercer', role: 'Lead 3D Artist', image: 'https://images.unsplash.com/photo-1678282342910-a135f7b900ae?q=80&w=1296&auto=format&fit=crop' },
            { name: 'Elena Rossi', role: 'Architectural Visualizer', image: 'https://images.pexels.com/photos/36813835/pexels-photo-36813835.jpeg' },
            { name: 'Julian Vance', role: 'Senior Interior Designer', image: 'https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?q=80&w=2671&auto=format' },
          ].map((mentor, idx) => (
            <div key={idx} className="shrink-0 w-[150px] sm:w-[170px] bg-slate-900 rounded-2xl overflow-hidden text-white text-left p-2.5 shadow-sm">
              <img src={mentor.image} alt={mentor.name} className="w-full aspect-[4/5] object-cover rounded-xl mb-2" />
              <p className="font-bold text-xs leading-tight">{mentor.name}</p>
              <p className="text-[10px] text-blue-300 font-medium">{mentor.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 13. FAQ & FINAL CHECKOUT CARD ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12 cv-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mb-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 mb-10 text-left max-w-3xl mx-auto">
          {FAQ_ITEMS_LANDING.map((faq, i) => (
            <details key={i} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden p-4 shadow-xs" open={openFaqIndex === i}>
              <summary className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center" onClick={(e) => { e.preventDefault(); setOpenFaqIndex(openFaqIndex === i ? null : i); }}>
                <span>{faq.question}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
              </summary>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-medium">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* CHECKOUT CARD */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-block bg-yellow-400 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full mb-3">
            🚨 STUDENTS WEEK DISCOUNT ({country.formattedPrice})
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white mb-2">
            Start Learning Architecture & 3D Design Today
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-lg mx-auto">
            Get instant access to all 12 courses, free software links, and 24/7 team guidance.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700/80 px-6 py-2.5 rounded-2xl">
              <span className="text-xs font-mono text-zinc-400 uppercase">Offer Ends In</span>
              <div className="flex items-center gap-1.5 font-mono text-yellow-400 font-bold text-sm sm:text-base">
                <span>{formatTime(timeLeft.h)}h</span>
                <span>:</span>
                <span>{formatTime(timeLeft.m)}m</span>
                <span>:</span>
                <span>{formatTime(timeLeft.s)}s</span>
              </div>
            </div>
          </div>

          <button onClick={openPaymentModal} className="w-full max-w-md mx-auto py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span>Claim Offer & Download ({country.formattedPrice})</span>
            <ArrowRight size={20} />
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-wider">
            <span>🛡️ 7-Day 100% Money-Back Guarantee</span>
            <span>•</span>
            <span>⚡ Instant Access</span>
            <span>•</span>
            <span>💬 24/7 WhatsApp Support</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default BelowFoldSections;
