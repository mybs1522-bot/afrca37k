import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { COURSES, COURSE_CATEGORIES, BUNDLE_PRICE, TESTIMONIALS, FAQ_ITEMS } from '../constants';
import { ChevronDown, Sparkles, ArrowRight, Timer, Star, CheckCircle2, Zap, Check, Download, Phone, Mail, Lock, Loader2, X, Eye, Award } from 'lucide-react';
import { openSelarCheckout } from '../services/razorpay';
import { CourseDetailModal } from '../components/CourseDetailModal';
import { TextMarquee } from '../components/ui/text-marquee';
import { ReviewTicker } from '../components/ReviewTicker';
import { trackInitiateCheckout, trackLead, trackAddPaymentInfo, trackSubmitApplication, trackPurchase, trackCompleteRegistration } from '../lib/pixel';
import { useCountry } from '../lib/CountryContext';


// Logo Component
const Logo = () => {
  const { country } = useCountry();
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
      <div className="relative w-9 h-9 border-2 border-gray-900 flex items-center justify-center bg-white transition-all duration-300 group-hover:bg-gray-900 group-hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
        <span className="font-display font-black text-lg tracking-tighter relative z-10">AV</span>
      </div>
      <div className="flex flex-col">
        <span className="font-display font-bold text-lg tracking-[0.2em] leading-none text-gray-900">AVADA</span>
        <div className="w-full h-[1px] bg-gray-200 my-0.5"></div>
        <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400 flex justify-between w-full leading-none">
          <span>DESIGN</span>
          <span>•</span>
          <span className="text-brand-primary font-black">{country.formattedPrice}</span>
        </span>
      </div>
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  const { country } = useCountry();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 23, s: 49 });
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [fullNameError, setFullNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);

  const openModal = () => {
    setShowPaymentModal(true);
    trackInitiateCheckout({ value: country.price, currency: country.currencyCode });
  };

  useEffect(() => {
    if (paymentSuccess) {
      trackPurchase({ transaction_id: paymentSuccess, value: country.price, currency: country.currencyCode });
      trackCompleteRegistration({ status: true });
    }
  }, [paymentSuccess, country]);

  // Auto-slide for mobile showcase
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setMobileSlideIndex((prev) => (prev + 1) % COURSES.length);
    }, 2000); // 2 seconds per slide

    return () => clearInterval(slideInterval);
  }, []);

  // Auto-scroll showcase: highlight each course card one-by-one, then scroll back to top
  useEffect(() => {
    const totalCourses = COURSES.length;
    const perCardDelay = 120;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < totalCourses; i++) {
      const t = setTimeout(() => {
        setHighlightIndex(i);
        const el = document.querySelector(`[data-course-index="${i}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }, 400 + i * perCardDelay);
      timeouts.push(t);
    }

    const finishTime = 400 + totalCourses * perCardDelay + 200;
    const tFinish = setTimeout(() => {
      setHighlightIndex(-1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, finishTime);
    timeouts.push(tFinish);

    return () => timeouts.forEach(t => clearTimeout(t));
  }, []);

  // Timer Logic (synced)
  useEffect(() => {
    const calculateTime = () => {
      const DURATION = (2 * 60 * 60 * 1000) + (23 * 60 * 1000) + (49 * 1000);
      const now = Date.now();
      const remaining = DURATION - (now % DURATION);
      const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const m = Math.floor((remaining / (1000 * 60)) % 60);
      const s = Math.floor((remaining / 1000) % 60);
      setTimeLeft({ h, m, s });
    };
    const timerInterval = setInterval(calculateTime, 1000);
    calculateTime();
    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handlePayment = () => {
    let hasError = false;
    if (!fullName.trim()) { setFullNameError(true); hasError = true; } else { setFullNameError(false); }
    if (!email || !validateEmail(email)) { setEmailError(true); hasError = true; } else { setEmailError(false); }
    if (hasError) return;

    const userData = { email, name: fullName.trim() };
    trackLead({ content_name: 'Checkout Form Submission', value: country.price, currency: country.currencyCode }, userData);
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

  const scrollToCourses = () => {
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 grid-bg">
      {/* ═══ DYNAMIC ANNOUNCEMENT BANNER (Auto-detected by IP) ═══ */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white py-2.5 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center gap-2 text-sm md:text-base font-bold">
          <span>{country.bannerText}</span>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes courseHighlight {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); transform: scale(1); }
          50% { box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.4); transform: scale(1.03); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); transform: scale(1); }
        }
        .course-highlight {
          animation: courseHighlight 0.3s ease-out;
          border-color: rgba(37, 99, 235, 0.5) !important;
        }
        
        /* Mobile Slideshow Animations */
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        .slide-enter {
          animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .slide-exit {
          animation: slideOutLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          position: relative;
          overflow: hidden;
        }
        .animate-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0));
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* ═══════ ANNOUNCEMENT BAR ═══════ */}
      <div className="bg-gray-900 text-white py-2.5 px-4 relative overflow-hidden">
        <div className="container mx-auto flex items-center justify-center gap-4 sm:gap-8 text-sm">
          <div className="flex items-center gap-2 shrink-0">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs sm:text-sm font-bold">All 12 courses for just <span className="text-brand-accent">{country.formattedPrice}</span></span>
          </div>
          <div className="w-px h-4 bg-gray-700 hidden sm:block"></div>
          <div className="flex items-center gap-2 shrink-0">
            <Timer size={14} className="text-brand-primary animate-pulse" />
            <div className="flex items-center gap-0.5 font-display font-bold text-sm tabular-nums text-brand-primary bg-gray-800 px-2.5 py-0.5 rounded-md border border-gray-700">
              <span>{formatTime(timeLeft.h)}</span>
              <span className="text-gray-500">:</span>
              <span>{formatTime(timeLeft.m)}</span>
              <span className="text-gray-500">:</span>
              <span>{formatTime(timeLeft.s)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ NAVBAR ═══════ */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Logo />
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-gray-900 text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-black transition-colors"
          >
            <Download size={14} className="text-yellow-400" />
            <span className="hidden sm:inline">Download All Courses</span>
          </button>
        </div>
      </nav>

      <main>
        {/* ═══════ HERO SECTION ═══════ */}
        {/* ═══════ COURSE SLIDESHOW ═══════ */}
        <section className="pt-3 md:pt-6 pb-8 md:pb-16 bg-white border-b border-gray-100 overflow-hidden relative">
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

                 <div className="inline-flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-2">
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
                  <div key={`row1-${course.id}-${i}`} className="w-[140px] md:w-[150px] shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setDetailCourse(course)}>
                      <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
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
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-lg">
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
                  <div key={`row2-${course.id}-${i}`} className="w-[140px] md:w-[150px] shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setDetailCourse(course)}>
                      <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
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
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-lg">
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

        {/* ═══════ HERO SECTION ═══════ */}
        <section className="bg-white py-10 md:py-16 border-b border-gray-100 grid-bg">
          <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl flex flex-col items-center">
            <div className="mb-2 md:mb-6 text-center">
              <h2 className="text-xl md:text-3xl font-display font-black text-gray-900 leading-tight mb-1 tracking-tight">
                Learn <span className="text-brand-primary uppercase">Design, Planning & Rendering</span>
              </h2>
              <p className="text-[10px] md:text-sm text-gray-600 font-medium italic leading-relaxed">
                Because <span className="relative inline-block px-1.5 py-0.5">
                  <span className="relative z-10 font-bold text-gray-900 not-italic uppercase tracking-tight">Skills are more important</span>
                  <span className="absolute inset-x-0 bottom-0.5 h-1.5 bg-yellow-300/40 -rotate-1 rounded-sm transform scale-x-110"></span>
                </span> than degrees.
              </p>
            </div>
            <button
              onClick={openModal}
              className="mt-6 md:mt-8 inline-flex items-center gap-1.5 md:gap-3 px-5 md:px-10 py-3.5 md:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl md:rounded-2xl font-bold text-[13px] md:text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all group w-full sm:w-auto justify-center animate-shimmer border border-blue-400/50"
            >
              <Download size={16} className="md:w-5 md:h-5 shrink-0" />
              <span className="whitespace-nowrap">Download All Courses</span>
              <ArrowRight size={16} className="md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
            <p className="mt-4 text-xs md:text-sm text-gray-500 font-medium max-w-[280px] md:max-w-none mx-auto leading-relaxed">Lifetime access • All software included free • 7-day money-back guarantee</p>
          </div>
        </section>

        <section className="bg-gray-50 border-y border-gray-100 py-6 md:py-10 grid-bg">
          <div className="container mx-auto px-2 md:px-8">
            <div className="text-center mb-6">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Number of Courses</span>
            </div>
            <div className="flex items-center justify-center gap-3 md:gap-12">
              {COURSE_CATEGORIES.map(cat => (
                <div key={cat.title} className="flex flex-col items-center group cursor-pointer shrink-0 min-w-max" onClick={scrollToCourses}>
                  <span className="text-lg md:text-3xl font-display font-black text-gray-900 group-hover:text-brand-primary transition-colors">
                    {cat.ids.length}
                  </span>
                  <span className="text-[7.5px] md:text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-600 transition-colors">
                    {cat.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* ═══════ BUNDLE BANNER ═══════ */}
        <section className="py-12 md:py-16 px-4 md:px-8 bg-white grid-bg">
          <div className="container mx-auto">
            <div className="relative bg-gray-900 rounded-3xl p-8 md:p-14 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary rounded-full blur-[120px] opacity-20 -mr-32 -mt-32 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-lg text-center md:text-left">
                  <div className="inline-flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <Sparkles size={14} className="fill-yellow-400" />
                    Best Value Deal
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                    All {COURSES.length} Courses <span className="text-brand-accent">{country.formattedPrice}</span>
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Lifetime access to every course. Free software included. 7-day money-back guarantee.
                  </p>
                </div>
                <button
                  onClick={openModal}
                  className="px-5 py-4 md:px-10 md:py-5 bg-brand-primary text-white font-bold text-sm md:text-lg rounded-xl md:rounded-2xl shadow-glow hover:shadow-glow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 md:gap-3 group shrink-0 w-full sm:w-auto animate-shimmer border border-blue-400/30"
                >
                  <Download size={16} className="md:w-5 md:h-5 shrink-0" />
                  <span className="whitespace-nowrap">Download All Courses</span>
                  <ArrowRight size={16} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ TESTIMONIALS ═══════ */}
        <section className="py-12 md:py-16 bg-gray-50 overflow-hidden grid-bg">
          <div className="container mx-auto px-4 md:px-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-1">Real Results</h2>
            <p className="text-gray-500 text-sm">From architects and designers like you</p>
          </div>
          <div className="overflow-x-auto no-scrollbar px-4 md:px-8 flex gap-4 snap-x snap-mandatory pb-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="min-w-[300px] md:min-w-[360px] p-6 bg-white rounded-2xl border border-gray-100 shadow-sm snap-center flex flex-col justify-between hover:border-gray-200 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex text-yellow-400 mb-3 gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.content}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ FAQ ═══════ */}
        <section className="py-16 px-4 md:px-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-center mb-8 text-gray-900">Questions?</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all hover:border-gray-200">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-gray-900 text-sm">{item.question}</span>
                  <div className={`transition-transform duration-300 shrink-0 ml-4 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </button>
                <div className={`px-5 text-gray-500 text-sm transition-all duration-300 overflow-hidden ${openFaqIndex === index ? 'max-h-32 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-gray-100 bg-white py-10 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <p className="text-[10px] text-gray-400 tracking-wider">© 2026 Avada Inc. All rights reserved.</p>
        </div>
      </footer>

      {/* ═══════ STICKY BOTTOM BAR ═══════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-gray-900 border-t border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
          <div className="container mx-auto px-4 md:px-8 py-1.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={16} className="text-yellow-400 fill-yellow-400" />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">All {COURSES.length} Courses</div>
                <div className="text-[10px] text-gray-400 leading-tight">Lifetime Access</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openModal}
                className="bg-brand-primary hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-glow hover:shadow-glow-lg text-sm"
              >
                <Download size={14} />
                <span>Download All</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ PAYMENT MODAL ═══════ */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 gap-3">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isLoading && setShowPaymentModal(false)} />
          
          {/* Timer above the modal */}
          <div className="relative z-10 w-full max-w-md bg-red-50 rounded-2xl p-3 flex items-center justify-between border border-red-100 shadow-lg animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-2">
              <Timer size={14} className="text-brand-primary animate-pulse" />
              <span className="text-xs font-bold text-gray-900">Students Week Offer ends in:</span>
            </div>
            <div className="flex items-center gap-0.5 font-display font-bold text-sm tabular-nums text-brand-primary bg-white px-2.5 py-1 rounded-md border border-red-100 shadow-sm">
              <span>{formatTime(timeLeft.h)}</span>
              <span className="text-gray-400">:</span>
              <span>{formatTime(timeLeft.m)}</span>
              <span className="text-gray-400">:</span>
              <span>{formatTime(timeLeft.s)}</span>
            </div>
          </div>

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            {/* Close */}
            <button aria-label="Close payment modal" onClick={() => !isLoading && setShowPaymentModal(false)} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full text-gray-500 hover:text-black hover:bg-gray-200 transition-colors">
              <X size={18} />
            </button>

            {/* Header */}
            <div className="bg-gray-900 text-white p-6 pb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
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
                    className={`w-full px-4 py-2.5 bg-gray-50 border ${fullNameError ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all`}
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
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${emailError ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all`}
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
                className="w-full py-4 bg-brand-primary hover:bg-blue-700 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-glow hover:shadow-glow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
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

      {/* ═══════ COURSE DETAIL MODAL ═══════ */}
      <CourseDetailModal
        course={detailCourse}
        isOpen={detailCourse !== null}
        onClose={() => setDetailCourse(null)}
        isInCart={true}
        onToggleCart={() => {}}
      />

      {/* ═══════ PAYMENT SUCCESS OVERLAY ═══════ */}
      {
        paymentSuccess && (
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
                  <Sparkles size={16} className="text-brand-primary" />
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
                  <a href="https://wa.me/918545015333" target="_blank" rel="noopener noreferrer" className="font-bold text-green-600 hover:text-green-700">WhatsApp Support</a>
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
        )
      }

      {/* Bottom spacer */}
      <div className="h-14"></div>
    </div>
  );
};

export default CheckoutPage;