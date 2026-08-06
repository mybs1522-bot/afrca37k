import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowRight, Star, CheckCircle, CheckCircle2, X, ChevronDown, Sparkles, Eye, Download, Phone, Mail, Lock, Loader2, Timer, Check, Award, Play, Users } from 'lucide-react';
const BelowFoldSections = lazy(() => import('../components/BelowFoldSections'));
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

      <main className="bg-slate-50 min-h-screen py-4 sm:py-8 font-sans text-slate-900">
        
        {/* ═══ 1. HERO SECTION ═══ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-8 text-center">
          
          {/* Top Offer Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-yellow-400 border border-yellow-500 text-slate-950 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-4 rounded-full shadow-sm">
            <span>Start charging 50,000–200,000 NGN for designing and rendering.</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-black tracking-tight leading-tight text-slate-950 mb-3 max-w-4xl mx-auto">
            Learn Interior & Exterior Designing in 15 days.{' '}
            <span className="bg-yellow-300 text-slate-950 px-2 py-0.5 rounded-md border border-yellow-400 inline-block">
              Start Earning Fast
            </span>{' '}
            with 3 Paid Freelance Projects.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto mb-6 leading-relaxed">
            No university degree needed. No expensive software to buy. Everything you need is included.
          </p>

          {/* HERO VIDEO PLAYER */}
          <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-900 relative bg-slate-950 mb-8">
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe 
                src="https://iframe.mediadelivery.net/embed/494628/1f7b76dd-7d47-4f39-87af-bff5a6b02d08?autoplay=true&loop=true&muted=true&responsive=true" 
                loading="eager"
                fetchPriority="high"
                style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }} 
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" 
                allowFullScreen={true}
              ></iframe>
              
              {/* Overlay Banner Over Video */}
              <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[96%] text-center pointer-events-none">
                <h2 className="inline-block bg-yellow-400/95 backdrop-blur-sm border border-slate-900 text-slate-950 text-[9px] sm:text-xs font-semibold px-3 py-1 rounded-xl shadow-sm tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  🏡 Learn To Design Complete Homes, Offices and Villas
                </h2>
              </div>
            </div>
          </div>

          {/* Quick CTA Button */}
          <div className="flex flex-col items-center gap-2">
            {/* Pricing */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 line-through text-base sm:text-lg font-bold">₦1,00,000</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">₦37,000</span>
            </div>
            <button onClick={openPaymentModal} className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white rounded-2xl font-black text-base md:text-lg border-2 border-slate-900 shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all inline-flex items-center justify-center gap-3">
              <Download size={20} className="shrink-0" />
              <span>Get All Courses</span>
              <ArrowRight size={20} />
            </button>
            <p className="text-xs text-slate-500 font-bold">✨ Instant Download • 24/7 Support • 7-Day Guarantee</p>
          </div>
        </section>

        {/* ═══ BANNER IMAGES ═══ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 my-8 space-y-6">
          <div className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={openPaymentModal}>
            <img src="/banner-hero.jpg" alt="Learn to Design Homes, Offices & Villas — Build Skills, Design Spaces, Start Earning From First Month" className="w-full h-auto block" loading="eager" fetchPriority="high" />
          </div>
          <div className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={openPaymentModal}>
            <img src="/banner-global-clients.jpg" alt="Best Part? Design for Clients From US, UK, Europe — We Teach You How To Get Those Clients and Make Good Income" className="w-full h-auto block" loading="lazy" decoding="async" />
          </div>
        </section>

        {/* ═══ 3. ALL 12 TOOLS SHOWCASE (Carousel Grid) ═══ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 my-10 overflow-hidden text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 bg-amber-100 border border-amber-300 rounded-full text-slate-900 font-black text-xs mb-2">
              🎓 Includes Official Certificate Equivalent to Diploma
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
              All 12 Software Used in this Industry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">Learn What You Need and Share With Your Friends ❤️</p>
          </div>

          <div className="flex flex-col gap-3 relative w-full overflow-hidden pb-4">
            <div className="flex gap-3 animate-scroll-right hover:pause w-max">
              {[...COURSES.slice(0, 6), ...COURSES.slice(0, 6)].map((course, i) => (
                <div key={`full-row1-${course.id}-${i}`} className="w-[110px] sm:w-[125px] md:w-[135px] shrink-0 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden group">
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img src={course.imageUrl} alt={course.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-1 left-1 w-5 h-5 bg-white/95 rounded-full flex items-center justify-center font-bold text-gray-900 text-[9px] border border-gray-200">{(i % 6) + 1}</div>
                    <div className="absolute top-1 right-1 bg-white/95 text-gray-900 text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-full border border-gray-200">{course.software}</div>
                  </div>
                  <div className="p-2 text-left">
                    <h3 className="font-display font-bold text-gray-900 text-xs mb-0.5 line-clamp-1 leading-tight">{course.title}</h3>
                    <div className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-1 py-0.5 rounded text-center border border-emerald-100">✓ Included</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 animate-scroll-right hover:pause w-max" style={{ animationDelay: '-22.5s' }}>
              {[...COURSES.slice(6, 12), ...COURSES.slice(6, 12)].map((course, i) => (
                <div key={`full-row2-${course.id}-${i}`} className="w-[110px] sm:w-[125px] md:w-[135px] shrink-0 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden group">
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img src={course.imageUrl} alt={course.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-1 left-1 w-5 h-5 bg-white/95 rounded-full flex items-center justify-center font-bold text-gray-900 text-[9px] border border-gray-200">{(i % 6) + 7}</div>
                    <div className="absolute top-1 right-1 bg-white/95 text-gray-900 text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-full border border-gray-200">{course.software}</div>
                  </div>
                  <div className="p-2 text-left">
                    <h3 className="font-display font-bold text-gray-900 text-xs mb-0.5 line-clamp-1 leading-tight">{course.title}</h3>
                    <div className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-1 py-0.5 rounded text-center border border-emerald-100">✓ Included</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 3. THE 3 CORE GAME-CHANGERS ═══ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
              Why 50,000+ Students Choose Avada
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">The 3 game-changing pillars built into your enrollment.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-5">
              <img src="/student1.jpg" alt="Nigerian Students 1" loading="lazy" className="rounded-2xl shadow-md w-full sm:w-1/2 object-cover border border-slate-200" />
              <img src="/student2.jpg" alt="Nigerian Students 2" loading="lazy" className="rounded-2xl shadow-md w-full sm:w-1/2 object-cover border border-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Freelance Projects */}
            <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-sm text-left relative overflow-hidden group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl mb-4">
                💰
              </div>
              <h3 className="font-display font-black text-slate-950 text-lg mb-2">
                3 Paid Freelance Projects Included ($300 Value)
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                We don't just teach theory. Every student receives <strong>3 real paid freelance design projects</strong> upon completion so you start earning income and building real client confidence immediately.
              </p>
            </div>

            {/* Card 2: Community Connections */}
            <div className="bg-white border-2 border-blue-500 rounded-3xl p-6 shadow-sm text-left relative overflow-hidden group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center text-2xl mb-4">
                🤝
              </div>
              <h3 className="font-display font-black text-slate-950 text-lg mb-2">
                Active Community & Connections
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Connect with top architects, interior designers, and studio owners in Lagos, Abuja, and Port Harcourt. Share work, get client referrals, and never feel alone.
              </p>
            </div>

            {/* Card 3: Free Software Links */}
            <div className="bg-white border-2 border-amber-500 rounded-3xl p-6 shadow-sm text-left relative overflow-hidden group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl mb-4">
                💻
              </div>
              <h3 className="font-display font-black text-slate-950 text-lg mb-2">
                Free Software Links & 24/7 Setup Help
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Don't spend millions buying software. We provide direct download links for student/free software versions (AutoCAD, SketchUp, V-Ray, Lumion & AI) + 24/7 team installation support.
              </p>
            </div>

          </div>
        </section>

        {/* ═══ LAZY LOADED OFFSCREEN SECTIONS (CODE SPLIT) ═══ */}
        <Suspense fallback={<div className="py-12 text-center text-slate-400 text-xs font-bold">Loading content...</div>}>
          <BelowFoldSections
            openFaqIndex={openFaqIndex}
            setOpenFaqIndex={setOpenFaqIndex}
            openPaymentModal={openPaymentModal}
            formatTime={(v: number) => v.toString().padStart(2, '0')}
            timeLeft={timeLeft}
          />
        </Suspense>

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
                  <span className="text-3xl font-display font-black">{country.formattedPrice}</span>
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
