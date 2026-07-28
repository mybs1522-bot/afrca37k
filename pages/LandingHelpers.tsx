import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, CheckCircle, Users, X } from 'lucide-react';
import { useCountry } from '../lib/CountryContext';

export const getDriveUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;

export const RAW_JOINERS = [
  { name: "Chioma A.", city: "Lagos", time: "2 min ago" },
  { name: "Emeka N.", city: "Abuja", time: "5 min ago" },
  { name: "Ngozi O.", city: "Ibadan", time: "8 min ago" },
  { name: "Tunde B.", city: "Port Harcourt", time: "12 min ago" },
  { name: "Amara E.", city: "Enugu", time: "15 min ago" },
  { name: "Chinedu O.", city: "Lagos", time: "18 min ago" },
];

export const PROBLEM_POINTS = [
  { emoji: "⏰", text: "Spending countless frustrating hours on a single 3D view while clients constantly ask for more revisions?" },
  { emoji: "😰", text: "Feeling overwhelmed by complex software, fearing you'll never catch up to the top studios?" },
  { emoji: "🤖", text: "Watching AI generate beautiful designs in seconds and worrying your traditional skills will soon be irrelevant?" }
];

export const TRANSFORMATION_STORIES = [
  { name: "Ngozi A.", role: "Freelance Designer", before: "Struggling alone with YouTube tutorials. Designs looked fake, took days, and clients wouldn't pay well without arguments.", after: "Joined our community. With 24/7 team support, she mastered V-Ray + AI. She now charges premium rates and finishes in a fraction of the time.", emoji: "✨" },
  { name: "Emeka N.", role: "Architecture Student", before: "Terrified of AI taking his future job. Felt his university degree wasn't teaching practical, modern software skills.", after: "We held his hand through the workflow. He now uses AI to generate concepts and V-Ray for final polish. Just landed a massive internship.", emoji: "🎓" }
];

export const PAGE_PREVIEWS_ROW1 = [
  '/renders/RENDER-1.jpg', '/renders/RENDER-2.jpg', '/renders/RENDER-3.jpg',
  '/renders/RENDER-4.jpg', '/renders/RENDER-5.jpg', '/renders/RENDER-6.jpg',
  '/renders/RENDER-7.jpg', '/renders/RENDER-8.jpg', '/renders/RENDER-9.jpg',
  '/renders/RENDER-10.jpg', '/renders/RENDER-11.jpg', '/renders/RENDER-12.jpg',
  '/renders/RENDER-13.jpg',
];
export const PAGE_PREVIEWS_ROW2 = [
  '/renders/RENDER-14.jpg', '/renders/RENDER-15.jpg', '/renders/RENDER-16.jpg',
  '/renders/RENDER-17.jpg', '/renders/RENDER-18.jpg', '/renders/RENDER-19.jpg',
  '/renders/RENDER-20.jpg', '/renders/RENDER-21.jpg', '/renders/RENDER-22.jpg',
  '/renders/RENDER-23.jpg', '/renders/RENDER-24.jpg', '/renders/RENDER-25.jpg',
];

export const FEAR_STATS = [
  { stat: '82%', label: 'of traditional 3D visualization tasks are actively being replaced by AI rendering tools right now.', icon: '📉' },
  { stat: '10x', label: 'faster output when you learn to comfortably partner with AI instead of fearing it.', icon: '🚀' },
  { stat: '24/7', label: 'Support from our team. We hold your hand through every single software hurdle so you never feel alone.', icon: '🤝' },
  { stat: '15 Days', label: 'From feeling stuck and overwhelmed, to creating portfolio-ready designs with total confidence.', icon: '⏳' },
];

/* ─── LOGO ─── */
export const Logo = () => (
  <div className="flex flex-col items-center text-center cursor-pointer group" onClick={() => window.location.href = '/'}>
    <span className="font-display font-bold text-lg tracking-tight leading-none text-slate-900 whitespace-nowrap">Avada</span>
    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-600 whitespace-nowrap mt-1">Design</span>
  </div>
);

/* ─── FLIP CLOCK ─── */
const FlipDigit = ({ value }: { value: string }) => (
  <div className="flip-digit-wrapper"><div className="flip-digit"><span>{value}</span></div></div>
);

/* ─── CTA WIDGET ─── */
export const CallToActionWidget = ({ timeLeft, onClick, headline, subtext }: { timeLeft: { h: number; m: number; s: number }; onClick: () => void; headline?: string; subtext?: string }) => {
  const { country } = useCountry();
  const f = (v: number) => v.toString().padStart(2, '0');
  const h = f(timeLeft.h), m = f(timeLeft.m), s = f(timeLeft.s);
  return (
    <div className="relative py-12 md:py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="max-w-2xl mx-auto relative z-10 text-center">
        {headline && <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 tracking-tight">{headline}</h3>}
        {subtext && <p className="text-zinc-400 text-sm mb-6">{subtext}</p>}
        {!headline && <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-6">🚨 TIMER IS TICKING. DON'T REGRET MISSING THIS.</p>}
        <div className="flex items-center justify-center gap-1 md:gap-2 mb-6">
          <div className="flip-clock-group"><div className="flex gap-1"><FlipDigit value={h[0]} /><FlipDigit value={h[1]} /></div><span className="flip-clock-label">HRS</span></div>
          <span className="text-xl md:text-3xl font-bold text-zinc-600 -mt-4">:</span>
          <div className="flip-clock-group"><div className="flex gap-1"><FlipDigit value={m[0]} /><FlipDigit value={m[1]} /></div><span className="flip-clock-label">MIN</span></div>
          <span className="text-xl md:text-3xl font-bold text-zinc-600 -mt-4">:</span>
          <div className="flip-clock-group"><div className="flex gap-1"><FlipDigit value={s[0]} /><FlipDigit value={s[1]} /></div><span className="flip-clock-label">SEC</span></div>
        </div>
        <div className="mb-6">
          <p className="text-red-400 font-semibold text-sm mt-2">Students Week Offer — Get the bundle for {country.formattedPrice} {country.flag}</p>
        </div>
        <div className="w-full max-w-md mx-auto">
          <button onClick={onClick} className="cta-primary w-full text-white px-8 py-4 md:py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-[1.03] active:scale-[0.98] premium-stroke" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', boxShadow: '0 6px 20px -4px rgba(249,115,22,0.5), 0 12px 40px -8px rgba(234,88,12,0.3)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span className="text-lg md:text-xl font-display font-bold uppercase tracking-widest relative z-10">Claim Your High-Paying Career</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> 7-Day Money-Back</div>
          <div className="w-[1px] h-3 bg-zinc-700"></div>
          <div className="flex items-center gap-1.5"><Zap size={14} className="text-blue-400" /> Instant Access</div>
          <div className="w-[1px] h-3 bg-zinc-700 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-1.5"><Users size={14} className="text-blue-400" /> All Software Included Free</div>
        </div>
      </div>
    </div>
  );
};

/* ─── DYNAMIC SOCIAL PROOF TOAST (Adapts to visitor country) ─── */
export const SocialProofToast: React.FC = () => {
  const { country } = useCountry();
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);

  const cityList = country.cities && country.cities.length > 0
    ? country.cities
    : [{ name: "Chinedu O.", city: "Lagos" }, { name: "Adaeze N.", city: "Abuja" }];

  useEffect(() => {
    const show = () => {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => setIdx(p => (p + 1) % cityList.length), 500);
      }, 4000);
    };
    const t1 = setTimeout(show, 6000);
    const t2 = setInterval(show, 15000);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, [cityList.length]);

  const j = cityList[idx % cityList.length];

  return (
    <div className={`fixed bottom-20 left-4 z-[70] transition-all duration-500 ${visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 max-w-xs">
        <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center shrink-0"><CheckCircle size={16} className="text-emerald-600" /></div>
        <div>
          <p className="text-sm font-bold text-slate-900">{j.name} from {j.city}, {country.name} {country.flag}</p>
          <p className="text-xs text-slate-500">just enrolled • 2 min ago</p>
        </div>
      </div>
    </div>
  );
};

/* ─── CONSTANTS ─── */
export const VALUE_STACK_ITEMS = [
  { name: 'AutoCAD Precision Drafting Course', value: 'Included' },
  { name: 'SketchUp 3D Modeling Course', value: 'Included' },
  { name: 'V-Ray Photo-Realism Masterclass', value: 'Included' },
  { name: 'Lumion Cinematic Walkthroughs', value: 'Included' },
  { name: 'D5 Real-Time Rendering', value: 'Included' },
  { name: 'AI Design & Rendering Course', value: 'Included' },
  { name: '10,000+ Premium Texture Library', value: 'Included' },
  { name: '2,000+ Drag-and-Drop 3D Models', value: 'Included' },
  { name: 'Software Installation Hub', value: 'Included' },
  { name: '24/7 Team Access & Portfolio Review', value: 'Included' },
  { name: 'Freelancing Pricing Playbook', value: 'Included' },
  { name: 'Certified Digital Diploma', value: 'Included' },
];

export const TESTIMONIALS_LANDING = [
  { name: 'Ngozi A.', role: 'Freelance Designer', location: 'Design Studio', content: 'I used to cry when V-Ray crashed. Literally. The support team is so incredibly kind and patient. Now I use AI so well that I feel completely secure in my career.' },
  { name: 'Chinedu O.', role: 'Senior Architect', location: 'Architectural Firm', content: 'I feared AI would replace my studio. But Avada held my hand through the transition. We now use it to generate gorgeous concepts for clients in minutes.' },
  { name: 'Amara E.', role: '3D Visualizer', location: 'Rendering Studio', content: 'The step-by-step guidance is amazing for beginners. Whenever my scene looks dark or weird, I just ask the support team. They are absolute lifesavers.' },
  { name: 'Emeka N.', role: 'Architecture Student', location: 'University Student', content: 'I felt so behind in university because they still teach completely outdated methods. Within two weeks here, I gained the confidence to start taking well-paying projects.' },
  { name: 'Aisha M.', role: 'Interior Designer', location: 'Interior Studio', content: 'To have someone to actually look at your screen and say "Oh, simply press this button" saves weeks of frustration. Best decision I ever made.' },
  { name: 'Tunde B.', role: 'Landscape Architect', location: 'Landscape Firm', content: 'The continuous support makes learning stress-free. D5 Render combined with AI generation is just magical. It took away all my anxiety about falling behind.' },
];

export const FAQ_ITEMS_LANDING = [
  { question: "I'm terrified of AI taking my job. Will this help?", answer: "We completely understand that fear! AI is scary if you ignore it, but it's an incredible superpower when you master it. We will hold your hand and teach you exactly how to use AI as your personal assistant, making you brilliantly fast and completely irreplaceable." },
  { question: "I am a complete beginner and get overwhelmed easily. Is this for me?", answer: "Yes, this program was built exactly with you in mind. We know learning software can be intimidating. We start from the absolute basics ('how to click here') and our team is always a WhatsApp message away to hold your hand when you feel stuck." },
  { question: "Are you really going to help me, or is this just another course?", answer: "This is a true 24/7 support community. When your render looks weird or your software crashes, you don't have to figure it out alone. You reach out to us, and we patiently help you fix it. Your success is our personal mission." },
  { question: "Is the pricing really affordable? What's the catch?", answer: "No catch! We simply want to make high-quality, supportive design education accessible to everyone. It's a one-time payment for lifetime access to the courses and our 24/7 support team." },
  { question: "Do I need to buy expensive software subscriptions?", answer: "Not at all. We will show you exactly how to easily access official free or student versions of the software. We want you earning safely, not spending unnecessarily on expensive licenses." },
  { question: "What if I feel like it's not working for me?", answer: "We want this to be completely stress-free for you. If you join and feel it's not a comforting and productive fit, just email us within 7 days. We will refund your payment immediately, no questions asked, and we'll still be rooting for you!" },
  { question: "Can I access the training safely on my mobile?", answer: "Yes! All courses are hosted clearly online and work perfectly on any device — laptop, tablet, or phone. You can learn comfortably at your own pace anywhere." },
];

export const INCOME_TIERS = [
  { label: 'Single Render Charge', before: 'Struggling with low rates', after: 'Confidently quoting 10x higher rates', icon: '🖼️' },
  { label: 'Interior Design Project', before: 'Rejected for poor 3D quality', after: 'Winning major luxury contracts', icon: '🏠' },
  { label: 'Time to Finish a Room', before: '3 Frustrating, Sleepless Nights', after: '2 Easy Hours with our AI Workflow', icon: '⏱️' },
  { label: 'Your Career Confidence', before: 'Constantly Anxious & Overwhelmed', after: 'Relaxed, In-Demand Professional', icon: '🌟' }
];

export const COURSES_LANDING = [
  {
    id: '1', title: 'AutoCAD Mastery', software: 'AutoCAD', students: '42.5k',
    description: 'Feeling slow and clunky drawing floor plans? We will patiently teach you the industry shortcuts so you can draft precision plans stress-free in half the time.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR',
    learningPoints: ['Friendly, step-by-step drafting basics', 'Speed shortcuts that reduce your eye-strain', 'Clean detailing that builders will easily understand'],
    workflowImpact: 'Stop dreading revisions. Make changes easily in seconds.'
  },
  {
    id: '3', title: 'SketchUp 3D', software: 'SketchUp', students: '55k',
    description: 'Struggling to visualize your 2D ideas? Let us guide you through building your first 3D home. It\'s much easier than building blocks when shown correctly.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo',
    learningPoints: ['Overcome the anxiety of a blank 3D screen', 'Organize models safely so they never crash your PC', 'Download beautiful pre-made models effortlessly'],
    workflowImpact: 'See your imagination comfortably come to life instantly.'
  },
  {
    id: '5', title: 'V-Ray Realism', software: 'V-Ray', students: '48k',
    description: 'Are your renders feeling cartoonish or fake looking? We\'ll hold your hand through the scary lighting settings until your images look like real photography.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8',
    learningPoints: ['Simple lighting setups that always work reliably', 'Creating comforting materials that feel real to touch', 'Gentle editing tricks to make any render pop beautifully'],
    workflowImpact: 'Relax and watch your clients gasp when they see their future home.'
  },
  {
    id: '6', title: 'Lumion Cinema', software: 'Lumion', students: '31k',
    description: 'Want to tell a story but animation seems too hard? We\'ll show you how to easily create beautiful, gentle walking tours of your designs that win over any client.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1XW2DDHVa1Qc15NcZ3wUKMFRT7LkyZMCt',
    learningPoints: ['Adding life effortlessly: waving trees and walking people', 'Setting up cameras without the confusing tech setups', 'Rendering video smoothly on your machine safely'],
    workflowImpact: 'Win projects easily by making clients emotionally feel the space.'
  },
  {
    id: '7', title: 'D5 Render', software: 'D5 Render', students: '19k',
    description: 'Hate waiting frustrating hours for a single image to load? We\'ll teach you this real-time engine safely so you can see your beautiful changes instantly as you work.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr',
    learningPoints: ['Set up D5 safely without overwhelming your computer', 'Painting comforting lights and materials in real-time', 'Creating cinematic 4K images effortlessly in seconds'],
    workflowImpact: 'Confidently make live design changes while the client watches.'
  },
  {
    id: '9', title: 'AI Advantage', software: 'AI Architecture', students: '75k',
    description: 'AI is changing fast, and we entirely understand it feels scary. We are here to guide you to generate concepts easily so you never have to stare at a blank page again.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1s-HzZVKpc9F92mLW2gMOPk0kVrKAqUIS',
    learningPoints: ['Safely turn a simple sketch into a full 3D concept in seconds', 'Use friendly AI to fix rendering mistakes automatically', 'Become the highly sought-after, irreplaceable designer'],
    workflowImpact: 'Turn your fear of AI confidently into your biggest professional advantage.'
  },
];
