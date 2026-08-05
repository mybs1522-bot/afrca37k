import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, CheckCircle, CheckCircle2, X, ChevronDown, Sparkles, Eye, Download, Phone, Mail, Lock, Loader2, Timer, Check, Award, Play } from 'lucide-react';
import { COURSES } from '../constants';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { openSelarCheckout } from '../services/razorpay';
import { ReviewTicker } from '../components/ReviewTicker';
import { trackInitiateCheckout, trackLead, trackAddPaymentInfo, trackSubmitApplication, trackPurchase, trackCompleteRegistration } from '../lib/pixel';
import { useCountry } from '../lib/CountryContext';

import {
  Logo, SocialProofToast,
  PROBLEM_POINTS, TRANSFORMATION_STORIES, FEAR_STATS,
  VALUE_STACK_ITEMS, TESTIMONIALS_LANDING, FAQ_ITEMS_LANDING, INCOME_TIERS,
  COURSES_LANDING, PAGE_PREVIEWS_ROW1, PAGE_PREVIEWS_ROW2
} from './LandingHelpers';

/* ─── REUSABLE CTA WITH TIMER (Apple-style proportions) ─── */
const CtaWithTimer = ({ timeLeft, onClick, variant = 'orange' }: { timeLeft: { h: number; m: number; s: number }; onClick: () => void; variant?: 'orange' | 'dark' | 'blue' }) => {
  const { country } = useCountry();
  const f = (v: number) => v.toString().padStart(2, '0');
  const bgClass = variant === 'dark'
    ? 'bg-slate-900'
    : variant === 'blue'
      ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
      : 'bg-gradient-to-br from-orange-500 to-orange-600';
  const btnClass = variant === 'dark'
    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25'
    : variant === 'blue'
      ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-white/15'
      : 'bg-slate-900 hover:bg-black shadow-lg shadow-black/25';
  const textColor = 'text-white';
  const btnTextColor = variant === 'blue' ? 'text-blue-700' : 'text-white';
  const timerAccent = variant === 'orange' ? 'text-yellow-200' : variant === 'blue' ? 'text-blue-200' : 'text-orange-400';
  const timerBg = variant === 'dark' ? 'bg-slate-800 border-slate-700' : variant === 'blue' ? 'bg-white/15 border-white/20' : 'bg-white/20 border-white/30';

  return (
    <div className={`${bgClass} rounded-2xl md:rounded-3xl px-5 py-6 md:p-10 relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center gap-4 md:gap-5">
        {/* Timer label */}
        <div className="flex items-center gap-1.5">
          <Timer size={14} className={`${timerAccent} animate-pulse`} />
          <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${timerAccent}`}>Students Week Offer Ends In</span>
        </div>

        {/* Timer digits - compact on mobile */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          {[{ val: f(timeLeft.h), label: 'HRS' }, { val: f(timeLeft.m), label: 'MIN' }, { val: f(timeLeft.s), label: 'SEC' }].map((unit, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className={`${timerBg} border rounded-lg md:rounded-xl px-3 py-1.5 md:px-4 md:py-2.5`}>
                  <span className={`text-xl md:text-3xl font-display font-black tabular-nums ${textColor}`}>{unit.val}</span>
                </div>
                <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-1 ${variant === 'dark' ? 'text-slate-500' : 'text-white/50'}`}>{unit.label}</span>
              </div>
              {i < 2 && <span className={`text-lg md:text-2xl font-bold ${variant === 'dark' ? 'text-slate-600' : 'text-white/30'} -mt-3`}>:</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Price - tighter on mobile */}
        <div className="flex items-baseline gap-2">
          <span className={`text-sm md:text-lg ${variant === 'dark' ? 'text-slate-500' : 'text-white/50'} line-through font-bold`}>{country.formattedOriginalPrice}</span>
          <span className={`text-3xl md:text-4xl font-display font-black ${textColor}`}>{country.formattedPrice}</span>
          <span className={`${variant === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/20 text-white'} text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>66% OFF</span>
        </div>

        {/* Button - full width on mobile, auto on desktop */}
        <button
          onClick={onClick}
          className={`${btnClass} ${btnTextColor} font-bold text-sm md:text-base px-6 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto`}
        >
          <Download size={16} className="shrink-0" />
          <span>Download All 12 Courses ({country.formattedPrice})</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        <p className={`text-[10px] md:text-xs font-medium ${variant === 'dark' ? 'text-slate-500' : 'text-white/50'}`}>Lifetime access • All software included • 7-day money-back</p>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const { country } = useCountry();
  const [timeLeft, setTimeLeft] = useState(() => { const D = (3 * 3600 + 36 * 60 + 20) * 1000, r = D - (Date.now() % D); return { h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) }; });
  const [showStickyBar, setShowStickyBar] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (paymentSuccess) {
      trackPurchase({ transaction_id: paymentSuccess, value: country.price, currency: country.currencyCode });
      trackCompleteRegistration({ status: true });
    }
  }, [paymentSuccess, country]);

  useEffect(() => {
    // Non-blocking automatic video autoplay after initial DOM paint (1.2s)
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const calc = () => { const D = (3 * 3600 + 36 * 60 + 20) * 1000, now = Date.now(), r = D - (now % D); setTimeLeft({ h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) }); };
    const t = setInterval(calc, 1000); calc(); return () => clearInterval(t);
  }, []);
  useEffect(() => { const h = () => setShowStickyBar(window.scrollY > 600); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const openPaymentModal = () => {
    setShowPaymentModal(true);
    trackInitiateCheckout({ value: country.price, currency: country.currencyCode });
  };

  const handlePayment = () => {
    let hasError = false;
    if (!fullName.trim()) { setFullNameError(true); hasError = true; } else { setFullNameError(false); }
    if (!email || !validateEmail(email)) { setEmailError(true); hasError = true; } else { setEmailError(false); }
    if (hasError) return;

    const userData = { email, name: fullName.trim() };
    trackLead({ content_name: 'Landing Page Form Submission', value: country.price, currency: country.currencyCode }, userData);
    trackSubmitApplication({ name: fullName.trim(), email, value: country.price, currency: country.currencyCode }, userData);
    trackAddPaymentInfo({ content_name: 'Selar Quick Checkout', value: country.price, currency: country.currencyCode }, userData);

    openSelarCheckout({
      email,
      name: fullName.trim(),
      currency: country.currencyCode,
      baseUrl: country.selarCheckoutBase
    });
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 grid-bg">
      {/* ═══ DYNAMIC ANNOUNCEMENT BANNER (Auto-detected by IP) ═══ */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white py-2.5 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center gap-2 text-sm md:text-base font-bold">
          <span>{country.bannerText}</span>
        </div>
      </div>

      <main className="bg-amber-50/40 py-4 sm:py-8 min-h-screen">
        {/* 📰 SHORT STORY EDITORIAL DISPATCH CONTAINER */}
        <article className="max-w-4xl mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white shadow-2xl rounded-3xl border border-slate-200/90 text-slate-900 font-sans relative">
          
          {/* MASTHEAD HEADER */}
          <header className="border-b-2 border-slate-900 pb-6 mb-8 text-center">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-100 pb-2">
              <span className="font-bold text-red-600">📰 THE ARCHITECTURE & DESIGN DISPATCH</span>
              <span>ISSUE #42 • NIGERIA EDITION</span>
              <span className="font-bold text-slate-700">6 MIN READ</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight leading-snug text-slate-950 mb-4 text-left">
              The Unspoken Shortcut to a High-Paying Interior & Architectural Design Career in Nigeria{' '}
              <span className="bg-yellow-300 text-slate-950 px-2 py-0.5 rounded-md border border-yellow-400 font-black inline-block">
                (Without Spending 4 Years in University)
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-slate-600 font-serif italic text-left leading-relaxed">
              A personal story & step-by-step master guide for every creative, student, and architect in Lagos, Abuja, Port Harcourt, and across Nigeria.
            </p>

            {/* Author Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 text-base shadow-sm">
                  🇳🇬
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-900">By Avada Learn Academy</p>
                  <p className="text-[11px] text-slate-500 font-medium">Dedicated to Nigerian Designers & Architects</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
                ✓ Complete Story Edition
              </span>
            </div>
          </header>

          {/* EDITORIAL SHORT STORY BODY */}
          <div className="space-y-6 text-sm md:text-base text-slate-800 leading-relaxed font-normal">
            
            {/* PROLOGUE LETTER */}
            <p className="font-serif italic text-base md:text-lg text-slate-900 font-bold border-l-4 border-yellow-400 pl-4 py-1 bg-yellow-50/60 rounded-r-xl">
              Dear Friend & Future Design Pioneer,
            </p>

            <p>
              If you are reading this from <strong>Lagos, Abuja, Port Harcourt, Ibadan, Enugu</strong>, or anywhere across Nigeria—let's have a completely honest conversation about building a career in architecture and interior design today.
            </p>

            <p>
              Most Nigerian universities teach 10-year-old architectural theory that hasn't changed since 2010. But when you sit across a high-value client in <em>Victoria Island, Lekki Phase 1, or Maitama</em>, they don't ask to see your university certificate.
            </p>

            {/* PULL QUOTE */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 md:p-5 text-slate-900 text-center shadow-xs">
              <p className="text-xs uppercase font-black tracking-wider text-red-600 mb-1">THE ONLY QUESTION CLIENTS CARE ABOUT</p>
              <p className="text-base md:text-xl font-display font-black text-slate-950 leading-snug">
                "Can you show me a photorealistic 3D render of how my living room, office, or villa will look <span className="bg-yellow-300 text-slate-950 px-1.5 py-0.5 rounded">BEFORE I pay?</span>"
              </p>
            </div>

            {/* 🎥 CHAPTER 1: THE DEMONSTRATION */}
            <div className="my-8 pt-2">
              <div className="bg-slate-900 text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-t-xl inline-block border-t border-x border-slate-700">
                CHAPTER 1: THE VIDEO DEMONSTRATION 📹
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-slate-900 relative bg-slate-950">
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  {isVideoLoaded ? (
                    <iframe src="https://iframe.mediadelivery.net/embed/494628/1f7b76dd-7d47-4f39-87af-bff5a6b02d08?autoplay=true&loop=true&muted=true&responsive=true" loading="lazy" style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }} allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" allowFullScreen={true}></iframe>
                  ) : (
                    <div 
                      onClick={() => setIsVideoLoaded(true)}
                      className="absolute inset-0 cursor-pointer bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center group"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-2xl group-hover:scale-110 transition-all duration-300 relative z-10">
                        <Play size={32} className="fill-slate-950 translate-x-0.5" />
                        <span className="absolute inset-0 rounded-full bg-yellow-400/40 animate-ping pointer-events-none"></span>
                      </div>
                      <span className="mt-3 text-xs sm:text-sm font-black text-yellow-300 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-yellow-400/30">
                        ▶ Click To Play Video Preview
                      </span>
                    </div>
                  )}

                  {/* Overlay Banner */}
                  <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[96%] text-center pointer-events-none">
                    <h2 className="inline-block bg-yellow-400/95 backdrop-blur-sm border border-slate-900 text-slate-950 text-[9px] sm:text-xs font-semibold px-3 py-1 rounded-xl shadow-sm tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      🏡 Learn To Design Complete Homes, Offices and Villas
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* CHAPTER 2: THE 3-STEP SHORTCUT */}
            <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 pt-4 border-t border-slate-100">
              Chapter 2: The 3-Pillar Shortcut
            </h2>

            <p>
              To run a profitable design business or land high-paying remote roles, you don't need academic fluff. You only need to master <strong>3 core pillars:</strong>
            </p>

            {/* STEPS BOX */}
            <div className="w-full bg-white border-2 border-red-500 rounded-2xl p-4 my-4 text-center shadow-md">
              <div className="inline-block bg-red-600 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                ⚡ THE ONLY 3 PILLARS YOU NEED
              </div>

              <div className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2.5 whitespace-nowrap py-1 overflow-x-auto">
                <span className="bg-yellow-400 text-slate-900 border border-yellow-500 font-black px-2.5 py-1 text-xs rounded-xl shadow-xs">
                  1. PLANNING
                </span>
                <span className="text-red-500 font-black">→</span>
                <span className="bg-red-600 text-white font-black px-2.5 py-1 text-xs rounded-xl shadow-xs">
                  2. DESIGNING
                </span>
                <span className="text-red-500 font-black">→</span>
                <span className="bg-yellow-400 text-slate-900 border border-yellow-500 font-black px-2.5 py-1 text-xs rounded-xl shadow-xs">
                  3. RENDERING & AI
                </span>
              </div>

              <p className="mt-2 text-xs font-extrabold text-slate-800">
                That's <span className="underline decoration-red-600 font-black text-red-700">EXACTLY</span> what we teach you in this master bundle. Nothing less, nothing more. 💰
              </p>
            </div>

            {/* SPECIAL FREELANCE BONUS */}
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 sm:p-5 my-4 text-slate-900 shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider rounded-full mb-2">
                💰 SPECIAL NIGERIAN STUDENT BONUS
              </div>
              <h3 className="text-base sm:text-lg font-display font-black text-slate-950 mb-1">
                3 Freelance Paid Projects For Every Student in Nigeria (Worth $300 USD)
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                Every student who completes our course gets <strong>3 real paid freelance design projects</strong> inside our community to build real-world experience and earnings!
              </p>
            </div>

            {/* CHAPTER 3: THE 10,000+ NIGERIAN STUDENTS */}
            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 mb-3">
                Chapter 3: Joined by 10,000+ Nigerian Students {country.flag}
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                You are not walking this path alone. Over 10,000 students across Lagos, Abuja, Port Harcourt, and Ibadan have taken this exact blueprint to upgrade their careers.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-4">
                <img src="/student1.jpg" alt="Nigerian Students 1" loading="lazy" className="rounded-2xl shadow-md w-full sm:w-1/2 object-cover border border-slate-200" />
                <img src="/student2.jpg" alt="Nigerian Students 2" loading="lazy" className="rounded-2xl shadow-md w-full sm:w-1/2 object-cover border border-slate-200" />
              </div>
            </div>

            {/* CHAPTER 4: INCOME TIERS (ROI STORY) */}
            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 mb-3">
                Chapter 4: The Financial Transformation (Real Earnings ROI)
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Here is what happens to your earning potential when you upgrade from simple drawings to high-end 3D & AI visualization:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
                {INCOME_TIERS.map((tier, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-900 leading-tight w-2/3">{tier.label}</span>
                      <span className="text-2xl">{tier.icon}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[9px] font-mono text-slate-400 uppercase">Before</p>
                        <p className="text-slate-400 line-through">{tier.before}</p>
                      </div>
                      <ArrowRight size={14} className="text-blue-500" />
                      <div className="text-right">
                        <p className="text-[9px] font-mono text-blue-500 uppercase">After</p>
                        <p className="text-emerald-600 font-bold">{tier.after}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAPTER 5: WHAT YOU CAN ACHIEVE */}
            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 mb-3">
                Chapter 5: What You Can Achieve After 30 Days
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-yellow-100/90 border-2 border-yellow-400 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl bg-yellow-300 p-1.5 rounded-lg border border-yellow-400">💼</span>
                    <span className="font-display font-black text-slate-900 text-sm sm:text-base">Get a Higher-Paying Job</span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm pl-10 font-bold">Land high-paying design & rendering roles in top Nigerian firms or remote international agencies.</p>
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl bg-red-200 p-1.5 rounded-lg border border-red-300">🏢</span>
                    <span className="font-display font-black text-slate-900 text-sm sm:text-base">Launch Your Own Studio</span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm pl-10 font-bold">Take private freelance clients, design luxury apartments, shortlets, and commercial offices.</p>
                </div>
              </div>
            </div>

          </div>

          {/* CHAPTER 6: MASTER ALL 12 TOOLS (SLIDESHOW) */}
          <section className="mt-10 pt-8 border-t-2 border-slate-900">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/50 rounded-full text-slate-900 font-extrabold text-xs shadow-sm mb-2">
                <span>🎓</span>
                <span className="text-amber-950 font-black">You will get Design Management certificate equivalent to Diploma</span>
              </div>
              <h2 className="text-xl md:text-3xl font-display font-black text-slate-950">
                Chapter 6: Master All 12 Premium Software Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-serif italic mt-1">
                AutoCAD, Revit, SketchUp, 3ds Max, V-Ray, Lumion, D5 Render, Enscape, Midjourney AI, Stable Diffusion, Unreal Engine 5, Photoshop.
              </p>
            </div>

            {/* SLIDESHOW CAROUSEL */}
            <div className="flex flex-col gap-3 relative w-full overflow-hidden pb-4">
              <div className="flex gap-3 animate-scroll-right hover:pause w-max">
                {[...COURSES.slice(0, 6), ...COURSES.slice(0, 6)].map((course, i) => (
                  <div key={`nls-row1-${course.id}-${i}`} className="w-[105px] sm:w-[115px] md:w-[125px] shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img src={course.imageUrl} alt={course.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-1 left-1 w-5 h-5 bg-white/95 rounded-full flex items-center justify-center font-bold text-gray-900 text-[9px] border border-gray-200">{(i % 6) + 1}</div>
                      <div className="absolute top-1 right-1 bg-white/95 text-gray-900 text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-full border border-gray-200">{course.software}</div>
                    </div>
                    <div className="p-1.5">
                      <h3 className="font-display font-bold text-gray-900 text-[11px] md:text-xs mb-0.5 line-clamp-1 leading-tight">{course.title}</h3>
                      <div className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-1 py-0.5 rounded text-center border border-emerald-100">✓ Included</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 animate-scroll-right hover:pause w-max" style={{ animationDelay: '-22.5s' }}>
                {[...COURSES.slice(6, 12), ...COURSES.slice(6, 12)].map((course, i) => (
                  <div key={`nls-row2-${course.id}-${i}`} className="w-[105px] sm:w-[115px] md:w-[125px] shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img src={course.imageUrl} alt={course.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-1 left-1 w-5 h-5 bg-white/95 rounded-full flex items-center justify-center font-bold text-gray-900 text-[9px] border border-gray-200">{(i % 6) + 7}</div>
                      <div className="absolute top-1 right-1 bg-white/95 text-gray-900 text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-full border border-gray-200">{course.software}</div>
                    </div>
                    <div className="p-1.5">
                      <h3 className="font-display font-bold text-gray-900 text-[11px] md:text-xs mb-0.5 line-clamp-1 leading-tight">{course.title}</h3>
                      <div className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-1 py-0.5 rounded text-center border border-emerald-100">✓ Included</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CHAPTER 7: STUDENT CASE STUDIES & RENDER GALLERY */}
          <section className="pt-8 border-t border-slate-100">
            <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 mb-3 text-center">
              Chapter 7: Real Student Case Studies & Render Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              {TRANSFORMATION_STORIES.map((story, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{story.name}</h4>
                      <p className="text-[11px] text-blue-600 font-medium">{story.role}</p>
                    </div>
                    <span className="text-xl">{story.emoji}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2"><strong>Before:</strong> {story.before}</p>
                  <p className="text-xs text-slate-900 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100"><strong>After 15 Days:</strong> {story.after}</p>
                </div>
              ))}
            </div>

            {/* RENDER SHOWCASE ROW */}
            <div className="flex flex-col gap-3 relative w-full overflow-hidden my-4">
              <div className="flex gap-3 animate-scroll-left hover:pause w-max">
                {[...PAGE_PREVIEWS_ROW1, ...PAGE_PREVIEWS_ROW1].map((src, i) => (
                  <div key={`st-r1-${i}`} className="w-[180px] sm:w-[220px] aspect-[4/3] rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-slate-100 shrink-0">
                    <img src={src} alt="Student Render" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CHAPTER 8: INDUSTRY SHIFT & PROOF STATS */}
          <section className="pt-8 border-t border-slate-100 text-center">
            <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 mb-2">
              Chapter 8: Don't Fear AI. Partner With It.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              {FEAR_STATS.map((item, i) => (
                <div key={i} className="bg-slate-900 text-white p-3.5 rounded-xl text-center">
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <span className="text-lg md:text-xl font-black text-yellow-400 block">{item.stat}</span>
                  <p className="text-[10px] text-zinc-400 font-normal leading-tight mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CHAPTER 9: TEAM MANIFESTO */}
          <section className="pt-8 border-t border-slate-100">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">Chapter 9: A Message From Our Team</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                Learning complex software alone is frustrating. That's why our program includes <strong>24/7 team support</strong>. From software installation links to render debugging at 2 AM, our team is always ready to hold your hand!
              </p>
            </div>
          </section>

          {/* CHAPTER 10: OLD VS NEW SYSTEM */}
          <section className="pt-8 border-t border-slate-100">
            <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 mb-3 text-center">
              Chapter 10: The Frustrating Path vs Our System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <h4 className="font-bold text-red-600 text-sm mb-2">❌ The Frustrating Path</h4>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {PROBLEM_POINTS.map((p, i) => <li key={i}>• {p.text}</li>)}
                </ul>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <h4 className="font-bold text-emerald-700 text-sm mb-2">✅ Our Hand-Holding System</h4>
                <ul className="text-xs text-slate-800 space-y-1.5 font-medium">
                  <li>• Step-by-step pipeline: AutoCAD → Revit → SketchUp → V-Ray → AI</li>
                  <li>• 3 real paid freelance projects included ($300 USD value)</li>
                  <li>• 24/7 technical team support whenever you get stuck</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CHAPTER 11: VALUE STACK */}
          <section className="pt-8 border-t border-slate-100">
            <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 mb-3 text-center">
              Chapter 11: Everything Included With Your Access Today
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs my-4">
              {VALUE_STACK_ITEMS.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-slate-100 text-xs">
                  <span className="text-slate-800 font-medium">{item.name}</span>
                  <span className="font-bold text-slate-500">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CHAPTER 12: STUDENT REVIEWS & GLOBAL MENTORS */}
          <section className="pt-8 border-t border-slate-100 text-center">
            <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 mb-3">
              Chapter 12: Student Reviews & Global Mentors
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x my-3" style={{ scrollbarWidth: 'none' }}>
              {[
                { name: 'Alex Mercer', role: 'Lead 3D Artist', image: 'https://images.unsplash.com/photo-1678282342910-a135f7b900ae?q=80&w=1296&auto=format&fit=crop' },
                { name: 'Elena Rossi', role: 'Architectural Visualizer', image: 'https://images.pexels.com/photos/36813835/pexels-photo-36813835.jpeg' },
                { name: 'Julian Vance', role: 'Senior Interior Designer', image: 'https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?q=80&w=2671&auto=format' },
              ].map((mentor, idx) => (
                <div key={idx} className="shrink-0 w-[140px] bg-slate-900 rounded-xl overflow-hidden text-white text-left p-2">
                  <img src={mentor.image} alt={mentor.name} className="w-full aspect-[4/5] object-cover rounded-lg mb-1.5" />
                  <p className="font-bold text-xs leading-tight">{mentor.name}</p>
                  <p className="text-[9px] text-blue-300">{mentor.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CHAPTER 13: FAQ & FINAL OFFER */}
          <footer className="mt-10 pt-8 border-t-2 border-slate-900">
            <h2 className="text-xl md:text-2xl font-display font-black text-slate-950 mb-4 text-center">
              Chapter 13: Frequently Asked Questions
            </h2>
            <div className="space-y-2 mb-8 text-left">
              {FAQ_ITEMS_LANDING.map((faq, i) => (
                <details key={i} className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-3" open={openFaqIndex === i}>
                  <summary className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center" onClick={(e) => { e.preventDefault(); setOpenFaqIndex(openFaqIndex === i ? null : i); }}>
                    <span>{faq.question}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                  </summary>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>

            {/* CHECKOUT CARD */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
              <div className="inline-block bg-yellow-400 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                🚨 LIMITED TIME STUDENTS WEEK OFFER
              </div>
              <h2 className="text-xl sm:text-3xl font-display font-black text-white mb-2">
                Get All 12 Courses + 3 Freelance Projects + 24/7 Team Support
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mb-6 max-w-xl mx-auto font-serif italic">
                Get lifetime access to all 12 master courses for only <strong className="text-yellow-400 not-italic font-black text-base">{country.formattedPrice} {country.flag}</strong> (Students Week Special Price).
              </p>

              <button onClick={openPaymentModal} className="w-full max-w-md mx-auto py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <span>Claim Your Special Offer Now</span>
                <ArrowRight size={20} />
              </button>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-wider">
                <span>🛡️ 7-Day Money-Back Guarantee</span>
                <span>•</span>
                <span>⚡ Instant Lifetime Access</span>
                <span>•</span>
                <span>💬 24/7 WhatsApp Support</span>
              </div>
            </div>
          </footer>

        </article>
      </main>

      <footer className="bg-slate-900 py-12 px-6 text-center border-t border-slate-800 text-white/70">
        <p className="text-xs uppercase tracking-[0.2em] mb-4">Avada Design & Architecture • 2026</p>
        <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>Privacy</span><span>Terms</span><span>Support</span></div>
      </footer>

      {/* ═══ STICKY BOTTOM BAR ═══ */}
      <div className={`fixed bottom-0 left-0 right-0 z-[70] bg-white/95 backdrop-blur-xl border-t border-slate-200 p-2 shadow-[0_-4px_30px_rgba(15,23,42,0.08)] transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto">
          <button onClick={openPaymentModal} className="w-full relative group overflow-hidden text-white rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all py-2.5 flex items-center px-4" style={{ background: 'linear-gradient(90deg,#f97316,#ea580c,#f97316)', boxShadow: '0 0 20px rgba(249,115,22,0.4)' }}>
            <div className="relative z-10 w-full flex items-center justify-between">
              <div className="flex flex-col items-start leading-tight gap-1">
                <span className="text-[11px] md:text-sm font-black uppercase tracking-widest text-yellow-200 animate-pulse bg-black/20 px-2 py-0.5 rounded-md inline-block">⚠️ Students Week Offer Ends In {formatTime(timeLeft.h)}:{formatTime(timeLeft.m)}:{formatTime(timeLeft.s)}</span>
                <span className="text-[15px] md:text-lg font-black uppercase tracking-[0.05em] text-white">Download All Courses</span>
              </div>
              <ArrowRight size={24} className="text-white group-hover:translate-x-1 transition-transform drop-shadow-md" />
            </div>
          </button>
        </div>
      </div>

      {/* ═══════ PAYMENT MODAL ═══════ */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 gap-3">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isLoading && setShowPaymentModal(false)} />
          
          {/* Timer above the modal */}
          <div className="relative z-10 w-full max-w-md bg-red-50 rounded-2xl p-3 flex items-center justify-between border border-red-100 shadow-lg animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-2">
              <Timer size={14} className="text-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-gray-900">Students Week Offer ends in:</span>
            </div>
            <div className="flex items-center gap-0.5 font-display font-bold text-sm tabular-nums text-blue-600 bg-white px-2.5 py-1 rounded-md border border-red-100 shadow-sm">
              <span>{formatTime(timeLeft.h)}</span>
              <span className="text-gray-400">:</span>
              <span>{formatTime(timeLeft.m)}</span>
              <span className="text-gray-400">:</span>
              <span>{formatTime(timeLeft.s)}</span>
            </div>
          </div>

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            <button aria-label="Close payment modal" onClick={() => !isLoading && setShowPaymentModal(false)} className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors cursor-pointer">
              <X size={16} />
            </button>

            {/* Header */}
            <div className="bg-gray-900 text-white p-6 pb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">
                  <Sparkles size={14} className="fill-yellow-400" />
                  Complete Bundle
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">All {COURSES.length} Courses</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black">{country.formattedPrice} {country.flag}</span>
                  <span className="text-gray-400 text-sm line-through">{country.formattedOriginalPrice}</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">66% OFF</span>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="p-6 pb-3">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["12 Premium Courses", "10,000+ Textures", "Software Guides", "Official Certificate", "24/7 Team Support", "Lifetime Access"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>



              {/* Contact Inputs */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setFullNameError(false); }}
                    className={`w-full px-4 py-2.5 bg-gray-50 border ${fullNameError ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                  />
                  {fullNameError && <p className="text-red-500 text-[10px] mt-1 px-1 font-bold">Enter your full name</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${emailError ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-[10px] mt-1 px-1 font-bold">Enter a valid email address</p>}
                </div>
              </div>

              {paymentError && <p className="text-red-500 text-xs mb-3 text-center bg-red-50 p-2 rounded">{paymentError}</p>}

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <><Loader2 className="animate-spin" size={20} /> Processing...</>
                ) : (
                  <>
                    <Download size={18} />
                    Download Courses
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <ReviewTicker />
              <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-gray-400">
                <Lock size={10} /> SSL Secured Payment • 7-Day Money-Back Guarantee
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ PAYMENT SUCCESS OVERLAY ═══════ */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.5s_ease]">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Check size={40} className="text-blue-600" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-display font-black text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Your payment of <span className="font-bold text-gray-900">{country.formattedPrice}</span> was received. Welcome to Avada!
            </p>
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">Your Course Access Link:</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Click the link below to access all your courses on Google Drive. <strong>Please bookmark or save this link securely.</strong>
              </p>
              <a
                href="https://drive.google.com/drive/folders/1CCyv9u82HiYI8jnyULISfBoGMcbcqd9U?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 px-4 rounded-xl text-center border border-blue-200 transition-colors break-all text-xs sm:text-sm"
              >
                Access Courses on Google Drive
              </a>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Receipt Number</div>
                <div className="font-mono text-xs text-gray-600 truncate">{paymentSuccess}</div>
              </div>
              <div className="sm:text-right w-full sm:w-auto p-3 bg-white rounded-lg border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Support / WhatsApp</div>
                <a href="https://wa.me/2348185450153" target="_blank" rel="noopener noreferrer" className="font-bold text-green-600 hover:text-green-700">WhatsApp Support</a>
              </div>
            </div>
            <button
              onClick={() => setPaymentSuccess(null)}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Close & Start Learning
            </button>
          </div>
        </div>
      )}

      <WhatsAppButton />
      <SocialProofToast />
    </div>
  );
};

export default LandingPage;
