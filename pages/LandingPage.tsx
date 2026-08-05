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

      <main>
        {/* 1. HERO — The Hook */}
        <section className="relative pt-0 pb-4 md:pb-6 overflow-hidden bg-white grid-bg">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none">
            <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-500/8 blur-[180px] rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-indigo-400/6 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-cyan-400/5 blur-[120px] rounded-full" />
          </div>
          <div className="max-w-5xl mx-auto px-5 relative z-10">
            <div className="flex flex-col items-center text-center pt-6 md:pt-12">
              
              {/* 🚨 PROVOKING POSTER HOOK — Fun Poster Style with Yellow & Red Highlights */}
              <div className="w-full max-w-4xl mx-auto mb-6 relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50 via-yellow-50/50 to-red-50/40 text-slate-900 p-4 sm:p-6 md:p-8 shadow-[0_12px_40px_-12px_rgba(239,68,68,0.2)] border-2 border-red-200 text-center">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-300/40 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-400/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                  {/* Poster Sticker Tagline */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 border border-yellow-500 text-red-950 text-[10px] md:text-xs font-black uppercase tracking-wider mb-3 rounded-full shadow-sm">
                    <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-full text-[9px] font-black">MUST READ</span>
                    <span>Interior Design Shortcut ⚡</span>
                  </div>

                  {/* Main Provoking Statement — Small but Impactful Poster Title */}
                  <h1 className="text-lg sm:text-xl md:text-2xl font-display font-black tracking-tight leading-snug text-slate-900 mb-4 max-w-3xl">
                    You don't need a{' '}
                    <span className="bg-yellow-300 text-slate-900 px-2 py-0.5 rounded-md border border-yellow-400 shadow-xs inline-block font-black">
                      degree in Design
                    </span>{' '}
                    to Start{' '}
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded-md shadow-xs inline-block font-black">
                      Interior Design Career.
                    </span>
                  </h1>

                  {/* Poster Cut the Crap Box */}
                  <div className="w-full max-w-3xl bg-white border-2 border-red-500/80 rounded-2xl p-2.5 sm:p-3.5 my-2 text-center shadow-md relative">
                    <div className="inline-block bg-red-600 text-white text-[10px] sm:text-[11px] md:text-xs font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-sm mb-1.5">
                      ⚡ CUT THE CRAP & SIMPLY LEARN
                    </div>

                    {/* Single line steps row */}
                    <div className="flex flex-nowrap items-center justify-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap py-1 overflow-x-auto">
                      <span className="bg-yellow-400 text-slate-900 border border-yellow-500 font-black px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs rounded-xl shadow-xs tracking-tight">
                        1. PLANNING
                      </span>
                      <span className="text-red-500 text-[10px] sm:text-xs font-black">→</span>
                      <span className="bg-red-600 text-white font-black px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs rounded-xl shadow-xs tracking-tight">
                        2. DESIGNING
                      </span>
                      <span className="text-red-500 text-[10px] sm:text-xs font-black">→</span>
                      <span className="bg-yellow-400 text-slate-900 border border-yellow-500 font-black px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs rounded-xl shadow-xs tracking-tight">
                        3. RENDERING
                      </span>
                    </div>

                    {/* Single line bottom yellow box */}
                    <div className="mt-1.5 flex justify-center">
                      <span className="bg-yellow-200 text-slate-900 text-[10px] sm:text-xs md:text-xs font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl border border-yellow-300 inline-block shadow-xs whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                        That’s <span className="underline decoration-red-600 decoration-2 font-black text-red-700">ALL</span> needed to make money in this industry! 💰
                      </span>
                    </div>
                  </div>

                  {/* We Teach You Exactly What Is Required */}
                  <div className="mt-3 inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-1.5 text-xs md:text-sm font-bold text-slate-800 shadow-xs">
                    <span>✅</span>
                    <p className="leading-tight text-center">
                      We teach you <span className="bg-yellow-300 text-slate-900 font-black px-1.5 py-0.5 rounded">EXACTLY</span> what is required.
                      <span className="text-red-600 font-extrabold ml-1">Nothing less, nothing more.</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Story & Video Section — Poster Styled */}
              <div className="w-full max-w-4xl mx-auto mb-10 text-left bg-gradient-to-b from-white via-amber-50/20 to-red-50/20 p-5 md:p-8 rounded-3xl shadow-lg border-2 border-amber-200/80 relative">
                {/* Hero Video inside card with Video Facade for PageSpeed 90+ */}
                <div style={{ position: 'relative', paddingTop: '56.25%' }} className="rounded-2xl overflow-hidden mb-6 shadow-md border border-slate-200 group bg-slate-950">
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
                  
                  {/* Overlay Banner Over The Video Top */}
                  <div className="absolute top-1.5 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[96%] text-center pointer-events-none">
                    <h2 className="inline-block bg-yellow-400/95 backdrop-blur-sm border border-slate-900 text-slate-950 text-[9px] sm:text-xs md:text-xs font-semibold px-2 py-0.5 sm:px-3.5 sm:py-1 rounded-lg sm:rounded-xl shadow-sm tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      🏡 Learn To Design Complete Homes, Offices and Villas
                    </h2>
                  </div>
                </div>

                <div className="bg-yellow-100/90 border-l-4 border-yellow-500 p-3.5 md:p-4 rounded-r-xl mb-4 shadow-xs">
                  <p className="text-sm md:text-base font-display font-bold text-slate-900 leading-snug">
                    "In our business of Architecture and Design, <span className="bg-yellow-300 text-slate-950 font-black px-1.5 py-0.5 rounded">Planning, Design and Rendering</span> matter the most."
                  </p>
                </div>

                <div className="bg-red-600 text-white rounded-2xl p-4 md:p-5 mb-4 shadow-md text-center">
                  <p className="text-xs md:text-sm uppercase tracking-wider font-extrabold text-yellow-300 mb-1">
                    THE BIG QUESTION ISN'T IF YOU CAN...
                  </p>
                  <p className="text-base md:text-xl font-display font-black text-white tracking-wide">
                    ⚡ How to do it <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-md">FASTER & BETTER?</span>
                  </p>
                </div>

                <div className="w-full bg-white border border-red-200 rounded-xl p-3.5 md:p-4 shadow-sm">
                  <p className="text-slate-800 text-xs md:text-sm font-medium leading-relaxed">
                    That's exactly why we built this: A complete step-by-step blueprint from software basics to client-ready renders designed to make you <span className="bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded border border-red-200">job or business ready in 30 days!</span> 🚀
                  </p>
                </div>
              </div>

              {/* 🌱 Start from absolute zero badge — Poster Sticker Style */}
              <div className="mb-4 inline-flex items-center gap-2 text-xs md:text-sm font-black text-slate-900 bg-yellow-400 border-2 border-slate-900 px-4 py-2 rounded-full shadow-[3px_3px_0px_#000]">
                <span>🌱</span>
                <span>Start from absolute zero <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-black ml-1">No Experience Needed</span></span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                <button onClick={openPaymentModal} className="px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white rounded-2xl font-black text-base md:text-lg border-2 border-slate-900 shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all flex items-center gap-3 group whitespace-nowrap">
                  <Download size={18} className="shrink-0" />
                  Get All Courses & 24/7 Team Support <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              </div>
              <div className="bg-amber-100/70 border border-amber-300 px-3 py-1.5 rounded-xl text-[11px] md:text-xs text-slate-800 font-extrabold mb-8 inline-block shadow-xs">
                ✨ 24/7 Team Support • Free Software Links Included • 7-Day Money-Back Guarantee
              </div>
              
              {/* ═══════ YOU CAN SECTION — Poster Cards ═══════ */}
              <div className="w-full mt-2">
                <div className="inline-block bg-red-600 text-white font-black text-xs md:text-sm uppercase tracking-wider px-4 py-1.5 rounded-full shadow-xs mb-4">
                  🎯 AFTER THIS COURSE YOU CAN
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-yellow-100/90 border-2 border-yellow-400 rounded-2xl p-4 md:p-5 flex flex-col gap-1 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl bg-yellow-300 p-1.5 rounded-lg border border-yellow-400">💼</span>
                      <span className="font-display font-black text-slate-900 text-sm md:text-base">Get a Higher-Paying Job</span>
                    </div>
                    <p className="text-slate-700 text-xs md:text-sm pl-10 font-bold">Land high-paying design & rendering roles fast</p>
                  </div>
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 md:p-5 flex flex-col gap-1 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl bg-red-200 p-1.5 rounded-lg border border-red-300">🏢</span>
                      <span className="font-display font-black text-slate-900 text-sm md:text-base">Launch Your Own Studio</span>
                    </div>
                    <p className="text-slate-700 text-xs md:text-sm pl-10 font-bold">Take freelance clients & build your firm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ COURSE SLIDESHOW — Master Every Tool ═══════ */}
        <section className="pt-2 md:pt-4 pb-8 md:pb-16 bg-white border-b border-gray-100 overflow-hidden relative">
           <div className="container mx-auto px-4 mb-6">
             <div className="text-center reveal flex flex-col items-center">
                 {/* 🎓 DIPLOMA CERTIFICATE NOTE (OVER All 12 Premium Courses Included) */}
                 <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/50 rounded-full text-slate-900 font-extrabold text-xs md:text-sm shadow-sm backdrop-blur-sm animate-[pulse_3s_infinite] hover:scale-[1.02] transition-transform mb-3">
                   <span className="text-base">🎓</span>
                   <span className="text-amber-950 font-black tracking-tight">
                     You will get Design Management certificate equivalent to Diploma
                   </span>
                   <Award size={16} className="text-amber-600 shrink-0" />
                 </div>

                 {/* 💡 BEST REASON TO JOIN NOTE */}
                 <div className="w-full max-w-2xl mx-auto bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-300/80 rounded-2xl p-3.5 md:p-4 text-center shadow-sm mb-4">
                   <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider rounded-full mb-1.5">
                     <span>💡 BEST REASON TO JOIN?</span>
                   </div>
                   <p className="text-xs md:text-sm font-black text-slate-900 leading-snug">
                     💰 3 Paid Freelance Projects <span className="font-bold text-emerald-800">for every student of our course —</span> build connections in community and keep growing!
                   </p>
                 </div>

                 <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
                   <Sparkles size={14} />
                   All 12 Premium Courses Included
                 </div>

                 <h2 className="text-2xl md:text-4xl font-display font-black text-gray-900 leading-tight">Master Every Tool Needed<br/>For Professional Design</h2>
             </div>
           </div>
           
           <div className="flex flex-col gap-3 md:gap-4 relative w-full overflow-hidden pb-4">
            {/* ROW 1: Courses 1 to 6 */}
            <div className="flex gap-3 md:gap-4 animate-scroll-right hover:pause w-max pl-4 md:pl-6">
              {[...COURSES.slice(0, 6), ...COURSES.slice(0, 6)].map((course, i) => {
                const globalIndex = i % 6;
                return (
                  <div key={`row1-${course.id}-${i}`} className="w-[105px] sm:w-[115px] md:w-[125px] shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img src={course.imageUrl} alt={course.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      {/* Number Badge */}
                      <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center font-display font-bold text-gray-900 shadow-sm text-[10px] border border-gray-200">
                        {globalIndex + 1}
                      </div>
                      
                      {/* Software Badge */}
                      <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full shadow-sm border border-gray-200">
                        {course.software}
                      </div>
                      
                      {/* View Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg">
                          <Eye size={14} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <h3 className="font-display font-bold text-gray-900 text-xs md:text-sm mb-1 line-clamp-1 leading-tight" title={course.title}>{course.title}</h3>
                      <div className="mt-1 pt-1 border-t border-gray-100">
                        <div className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-center gap-1 border border-emerald-100 w-full">
                          <CheckCircle2 size={8}/> Included
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* ROW 2: Courses 7 to 12 */}
            <div className="flex gap-3 md:gap-4 animate-scroll-right hover:pause w-max pl-4 md:pl-6" style={{ animationDelay: '-22.5s' }}>
              {[...COURSES.slice(6, 12), ...COURSES.slice(6, 12)].map((course, i) => {
                const globalIndex = (i % 6) + 6;
                return (
                  <div key={`row2-${course.id}-${i}`} className="w-[105px] sm:w-[115px] md:w-[125px] shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img src={course.imageUrl} alt={course.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      {/* Number Badge */}
                      <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center font-display font-bold text-gray-900 shadow-sm text-[10px] border border-gray-200">
                        {globalIndex + 1}
                      </div>
                      
                      {/* Software Badge */}
                      <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full shadow-sm border border-gray-200">
                        {course.software}
                      </div>
                      
                      {/* View Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg">
                          <Eye size={14} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <h3 className="font-display font-bold text-gray-900 text-xs md:text-sm mb-1 line-clamp-1 leading-tight" title={course.title}>{course.title}</h3>
                      <div className="mt-1 pt-1 border-t border-gray-100">
                        <div className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-center gap-1 border border-emerald-100 w-full">
                          <CheckCircle2 size={8}/> Included
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>



        {/* ═══════ CTA #1 — After Course Showcase ═══════ */}
        <section className="py-8 md:py-10 px-4 md:px-5">
          <div className="max-w-3xl mx-auto">
            <CtaWithTimer timeLeft={timeLeft} onClick={openPaymentModal} variant="orange" />
          </div>
        </section>

        {/* NEW SECTION: Nigerian Students */}
        <section className="py-16 bg-slate-50 border-b border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5 text-center">
            <div className="reveal mb-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">10,000+ {country.name} Students {country.flag}</h2>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 reveal">
              <img src="/student1.jpg" alt="Nigerian Students 1" className="rounded-2xl shadow-xl w-full md:w-1/2 object-cover border border-slate-200 hover:scale-[1.02] transition-transform" />
              <img src="/student2.jpg" alt="Nigerian Students 2" className="rounded-2xl shadow-xl w-full md:w-1/2 object-cover border border-slate-200 hover:scale-[1.02] transition-transform" />
            </div>
          </div>
        </section>


        {/* 6. INCOME TIERS — The ROI */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Invest in Yourself Today. <br className="hidden md:block" /><span className="text-emerald-600">Start making money in the industry.</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {INCOME_TIERS.map((tier, i) => (
                <div key={i} className="reveal bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-400/40 transition-all shadow-soft flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4"><span className="text-sm font-bold text-slate-900 leading-tight w-2/3">{tier.label}</span><span className="text-3xl">{tier.icon}</span></div>
                  <div className="flex items-center justify-between">
                    <div><p className="text-[10px] font-mono text-slate-500 uppercase">Before</p><p className="text-slate-400 text-sm line-through">{tier.before}</p></div>
                    <ArrowRight size={16} className="text-blue-400" />
                    <div className="text-right"><p className="text-[10px] font-mono text-blue-500 uppercase">After</p><p className="text-emerald-600 text-sm font-bold">{tier.after}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* 4. STUDENT WORK CAROUSEL — Visual Proof */}
        <section className="py-16 md:py-24 bg-slate-50 overflow-hidden border-b border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5 mb-12 text-center">
            <div className="reveal">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">See What Our <span className="text-orange-600">Students Have Achieved</span></h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto italic font-serif">"With 24/7 team support, these students transformed their portfolios and confidence."</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex gap-3 md:gap-8 animate-scroll-left hover:pause">
              {[...PAGE_PREVIEWS_ROW1, ...PAGE_PREVIEWS_ROW1].map((img, i) => (
                <div key={i} className="w-[200px] md:w-[400px] shrink-0 aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group bg-slate-100">
                  <img src={img} alt="Student Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 md:gap-8 animate-scroll-right hover:pause">
              {[...PAGE_PREVIEWS_ROW2, ...PAGE_PREVIEWS_ROW2].map((img, i) => (
                <div key={i} className="w-[200px] md:w-[400px] shrink-0 aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group bg-slate-100">
                  <img src={img} alt="Student Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 2. PROOF STATS */}
        <section className="py-10 bg-slate-50 border-y border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEAR_STATS.map((s, i) => (
              <div key={i} className="text-center reveal">
                <span className="text-2xl mb-2 block">{s.icon}</span>
                <span className="text-3xl md:text-4xl font-display font-black text-blue-500">{s.stat}</span>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. MANIFESTO — The Story & The Gap */}
        <section className="py-16 md:py-28 grid-bg bg-white border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal text-center mb-12">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-4">A Supportive Message from Our Team</p>
              <h2 className="text-3xl md:text-5xl font-serif italic text-slate-900 mb-8 leading-snug">"We believe in practical, hands-on learning with experts who are always ready to help you."</h2>
            </div>
            <div className="reveal space-y-6 text-slate-600 text-base md:text-lg leading-relaxed">
              <p>Learning complex software can feel overwhelming <strong className="text-slate-900">when you're doing it alone.</strong></p>
              <p>That's why our program is built differently. You aren't just getting tutorial videos; you're joining a community where our team reviews your work, answers your technical questions, and cheers you on as you improve.</p>
              <p>Whether you are a student, a freelancer, or a studio owner, <strong className="text-orange-600">we are here to support your transition</strong> into modern, high-quality 3D rendering. No more struggling with endless YouTube tutorials that leave you confused.</p>
              <p>You don't need to spend millions of naira on expensive, outdated courses to build a portfolio you can be incredibly proud of.</p>
              
              <div className="my-10 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 md:p-8 shadow-soft">
                <p className="font-bold text-slate-900 text-xl mb-4">Here is How We Support You:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800">12 Comprehensive Courses structured compassionately for beginners.</span></li>
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800">Direct links to free/student versions so you save your money.</span></li>
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800">24/7 support from team, installation help to course doubts—whenever you're stuck, we're here.</span></li>
                </ul>
                <div className="mt-6 pt-6 border-t border-orange-100 flex items-center justify-between">
                  <span className="text-slate-600 text-sm italic font-bold">A complete learning ecosystem for just {country.formattedPrice}.</span>
                  <button onClick={openPaymentModal} className="text-orange-600 font-bold text-sm hover:text-orange-800 flex items-center gap-1 group">Join Our Community <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
                </div>
              </div>

              <p className="text-slate-900 font-semibold text-lg md:text-xl border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded-r-xl">Investing in your education is the best step you can take for your creative journey. Our team is excited to welcome you and help you build something amazing.</p>
            </div>
          </div>
        </section>


        {/* 5. OLD vs NEW — The Contrast */}
        <section className="py-16 md:py-24 bg-white grid-bg">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-12"><h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">The Lonely, Frustrating Path <br className="hidden md:block" />vs. <span className="text-emerald-600">Our Hand-Holding Blueprint</span></h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="reveal grid-bg border border-red-200 rounded-2xl p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><X size={20} className="text-red-500" /></div><h3 className="text-xl font-bold text-red-500">The Old Struggle</h3></div>
                <ul className="space-y-4">
                  {PROBLEM_POINTS.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm"><span className="mt-1 shrink-0 text-base">{item.emoji}</span>{item.text}</li>
                  ))}
                  {['Searching random YouTube tutorials that leave you confused and frustrated', 'Paying expensive monthly subscriptions for software you barely know how to use', 'Graduating from college but lacking a truly stunning portfolio to get hired'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm"><X size={14} className="text-red-500 mt-1 shrink-0" />{item}</li>
                  ))}
                </ul>
              </div>
              <div className="reveal bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 shadow-soft">
                <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><CheckCircle size={20} className="text-emerald-600" /></div><h3 className="text-xl font-bold text-slate-900">Our Supportive System</h3></div>
                <ul className="space-y-4">
                  {['A friendly, step-by-step pipeline: AutoCAD → SketchUp → V-Ray → Lumion → AI', 'AI handles the heavy lifting. You focus on creativity. 10x your output stress-free.', 'A stunning, professional portfolio built safely in just 15 days—even from zero', 'All necessary software links provided—say goodbye to expensive licenses', '24/7 support from team, installation help to course doubts'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle size={14} className="text-blue-500 mt-1 shrink-0" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7. WHAT YOU GET — The Offer */}
        <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-10">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-3">Included with enrollment</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Everything You Need to Succeed, <span className="text-orange-600">Provided Today</span></h2>
              <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">A supportive bundle filled with all the software guides, 24/7 team support, and tools you need.</p>
            </div>
            <div className="reveal max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft">
              {VALUE_STACK_ITEMS.map((item, i) => (
                <div key={i} className={`flex justify-between items-center px-6 py-4 ${i !== VALUE_STACK_ITEMS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-blue-500 shrink-0" /><span className="text-sm text-slate-800 font-medium">{item.name}</span></div>
                  <span className="text-sm font-bold text-slate-500">{item.value}</span>
                </div>
              ))}
              
              <div className="bg-emerald-50 border-t border-emerald-100 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-600 shrink-0" /><span className="text-sm text-emerald-900 font-bold">All Software (Free/Student Edition Links)</span></div>
                <span className="text-sm font-black text-emerald-600">INCLUDED</span>
              </div>

              <div className="bg-blue-50/50 border-t border-blue-200 px-6 py-6 flex flex-col items-center gap-6 justify-center">
                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
                  <span className="text-slate-900 font-bold text-center">Lifetime Access + Free Updates</span>
                </div>
                <button onClick={openPaymentModal} className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group premium-stroke">
                  <Download size={16} /> Access Everything Instantly <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ CTA #2 — After Value Stack ═══════ */}
        <section className="py-8 md:py-10 px-4 md:px-5 bg-white">
          <div className="max-w-3xl mx-auto">
            <CtaWithTimer timeLeft={timeLeft} onClick={openPaymentModal} variant="blue" />
          </div>
        </section>

        {/* 8. TESTIMONIALS — Social Proof */}
        <section className="py-16 md:py-24 bg-white overflow-hidden grid-bg">
          <div className="max-w-5xl mx-auto px-5 mb-12">
            <div className="text-center mb-12">
              <p className="text-blue-500 text-xs font-mono uppercase tracking-widest mb-4">Student Reviews</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Students & <span className="text-blue-500">Professionals</span></h2>
              <p className="text-slate-600 text-lg">50,000+ learners • 4.9★ average rating</p>
            </div>

            {/* Featured Transformations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {TRANSFORMATION_STORIES.map((story, i) => (
                <div key={i} className="reveal bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-8 shadow-soft relative overflow-hidden transition-all hover:border-blue-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                  <span className="text-4xl mb-4 block">{story.emoji}</span>
                  <div className="flex items-center gap-2 mb-6"><span className="font-bold text-slate-900 text-lg">{story.name}</span><span className="text-sm font-medium text-blue-600">• {story.role}</span></div>
                  <div className="mb-4"><p className="text-[10px] font-mono uppercase text-slate-400 mb-1 tracking-wider">Before</p><p className="text-slate-600 text-sm leading-relaxed">{story.before}</p></div>
                  <div><p className="text-[10px] font-mono uppercase text-blue-500 mb-1 tracking-wider">After</p><p className="text-slate-900 text-base font-bold leading-relaxed">{story.after}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-6 animate-scroll-left hover:pause">
              {[...TESTIMONIALS_LANDING, ...TESTIMONIALS_LANDING].map((t, i) => (
                <div key={i} className="w-[350px] shrink-0 bg-white border border-slate-200 p-8 rounded-3xl hover:border-blue-200 transition-all shadow-soft">
                  <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-blue-500 text-blue-500" />)}</div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600">{t.name[0]}</div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1">{t.name} <CheckCircle size={12} className="text-emerald-600" /></p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-5 mt-16 md:mt-24 text-center reveal">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Learn From Global Experts</h2>
            <p className="text-slate-600 text-base mb-12">Our mentors bring decades of combined experience from top international studios.</p>
            {/* Mentors Gallery Slider */}
            <div 
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`.flex::-webkit-scrollbar { display: none; }`}</style>
              {[
                { name: 'Alex Mercer', role: 'Lead 3D Artist', image: 'https://images.unsplash.com/photo-1678282342910-a135f7b900ae?q=80&w=1296&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
                { name: 'Elena Rossi', role: 'Architectural Visualizer', image: 'https://images.pexels.com/photos/36813835/pexels-photo-36813835.jpeg' },
                { name: 'Julian Vance', role: 'Senior Interior Designer', image: 'https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
                { name: 'Sophia Sterling', role: 'AI Design Specialist', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=560&fit=crop&crop=face' },
                { name: 'Liam Chen', role: 'VFX Supervisor', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=560&fit=crop&crop=face' },
                { name: 'Maya Patel', role: 'Concept Artist', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=560&fit=crop&crop=face' },
              ].map((mentor, idx) => (
                <div key={idx} className="shrink-0 w-[160px] sm:w-[180px] md:w-[220px] snap-center bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all group">
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4 text-left">
                      <h3 className="text-white font-display font-bold text-base md:text-lg mb-0.5 leading-tight">{mentor.name}</h3>
                      <p className="text-blue-300 text-[10px] md:text-xs font-medium">{mentor.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FAQ + FINAL CTA */}
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200 grid-bg">
          <div className="max-w-3xl mx-auto px-5 mb-16">
            <div className="reveal text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Common Questions</h2>
              <p className="text-slate-600 text-base">All your questions, answered.</p>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS_LANDING.map((faq, i) => (
                <details key={i} className="reveal group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft" open={openFaqIndex === i}>
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none" onClick={(e) => { e.preventDefault(); setOpenFaqIndex(openFaqIndex === i ? null : i); }}>
                    <span className="text-sm md:text-base font-semibold text-slate-900 pr-6">{faq.question}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform shrink-0 ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                  </summary>
                  <div className="px-5 pb-5"><p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p></div>
                </details>
              ))}
            </div>
          </div>

          {/* ═══════ CTA #3 — Final CTA ═══════ */}
          <div className="max-w-3xl mx-auto px-4 md:px-5">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-3xl font-display font-bold text-slate-900 mb-2">Let us hold your hand towards a brighter future.</h3>
              <p className="text-slate-500 text-xs md:text-sm">AI is moving fast, but you don't have to face it alone. 50,000+ students chose our supportive community.</p>
            </div>
            <CtaWithTimer timeLeft={timeLeft} onClick={openPaymentModal} variant="dark" />
          </div>
        </section>
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
