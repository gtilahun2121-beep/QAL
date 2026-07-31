'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Language, defaultLanguage } from '@/i18n/config';
import { translations } from '@/i18n/translations';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroAnimation from './components/HeroAnimation';
import CountUpStats from './components/CountUpStats';
import HowItWorks from './components/HowItWorks';
import EqubRotation from './components/EqubRotation';
import PromoFeatures from './components/PromoFeatures';
import PromoBanner from './components/PromoBanner';
import PricingComparison from './components/PricingComparison';
import Testimonials from './components/Testimonials';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>((searchParams?.get('lang') as Language) || defaultLanguage);
  const t = translations[lang];

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    router.push(`/?lang=${newLang}`);
  };

  const valueProps = [
    {
      icon: '💰',
      title: t.collateralFree,
      desc: t.collateralFreeDesc,
    },
    {
      icon: '⭐',
      title: t.trustGamification,
      desc: t.trustGamificationDesc,
    },
    {
      icon: '🛍️',
      title: t.saveLater,
      desc: t.saveLaterDesc,
    },
    {
      icon: '🔒',
      title: t.escrow,
      desc: t.escrowDesc,
    },
  ];

  const navFeatures = [
    {
      icon: '👥',
      title: t.myEqubs,
      desc: t.myEqubsDesc,
    },
    {
      icon: '🔍',
      title: t.discover,
      desc: t.discoverDesc,
    },
    {
      icon: '📅',
      title: t.calendar,
      desc: t.calendarDesc,
    },
    {
      icon: '💳',
      title: t.wallet,
      desc: t.walletDesc,
    },
    {
      icon: '⋯',
      title: t.more,
      desc: t.moreDesc,
    },
  ];

  const techStack = [
    { category: t.framework, tech: 'Next.js 14 (App Router)', desc: t.nextjs },
    { category: t.mobile, tech: 'React Native', desc: t.reactNative },
    { category: t.animation, tech: 'HTML5 Canvas + SVG', desc: t.canvas },
    { category: t.persistence, tech: 'SQLite / WatermelonDB', desc: t.offline },
    { category: t.realtime, tech: 'Server-Sent Events', desc: t.sse },
    { category: t.styling, tech: 'Tailwind CSS', desc: t.tailwind },
  ];

  const metrics = [
    { label: t.crossPlatform, value: '5 platforms' },
    { label: t.offlinePercentage, value: '100%' },
    { label: t.languages, value: '4 languages' },
    { label: t.wcagStandard, value: 'WCAG 2.1 AA' },
    { label: t.actionLatency, value: '< 500ms' },
    { label: t.throughput, value: '2,500 TPS' },
  ];

  const phases = [
    {
      title: t.phase1,
      duration: t.phase1Duration,
      items: t.phase1Items,
    },
    {
      title: t.phase2,
      duration: t.phase2Duration,
      items: t.phase2Items,
    },
    {
      title: t.phase3,
      duration: t.phase3Duration,
      items: t.phase3Items,
    },
    {
      title: t.phase4,
      duration: t.phase4Duration,
      items: t.phase4Items,
    },
  ];

  return (
    <>
      <Header lang={lang} onLanguageChange={handleLanguageChange} />

      {/* 1. Hero Section Animation */}
      <HeroAnimation
        heroTitle={t.heroTitle}
        heroSubtitle={t.heroSubtitle}
        heroDescription={t.heroDescription}
        cta={t.cta}
        ctaSecondary={t.ctaSecondary}
      />

      {/* 2. Count-Up Statistics */}
      <CountUpStats
        title="Why QalNet?"
        description="Trusted by thousands of Ethiopians saving together"
        stats={[
          { icon: '👥', label: 'Active Members', value: 10000, suffix: '+' },
          { icon: '💰', label: 'ETB Saved', value: 50, suffix: 'M+' },
          { icon: '🏆', label: 'Successful Payouts', value: 2500, suffix: '+' },
          { icon: '⭐', label: 'On-Time Payments', value: 99, suffix: '%' },
        ]}
      />

      {/* 3. How It Works */}
      <HowItWorks
        title="How Equb Works"
        steps={[
          {
            number: 1,
            title: 'Join',
            description: 'Create or join an Equb group with friends and family',
            icon: '✨',
          },
          {
            number: 2,
            title: 'Make Payments',
            description: 'Contribute your share every payment period',
            icon: '📱',
          },
          {
            number: 3,
            title: 'Your Turn',
            description: 'Receive the full amount when your turn comes',
            icon: '💸',
          },
          {
            number: 4,
            title: 'Repeat',
            description: 'Continue helping others save their goals',
            icon: '🔄',
          },
        ]}
      />

      {/* 4. Equb Rotation Animation */}
      <EqubRotation
        title="Fair Rotation System"
        description="Watch how each member gets their turn to receive the Equb payout"
        memberCount={8}
      />

      {/* 5. Promo Features */}
      <PromoFeatures
        title="Why Choose QalNet Over Traditional Equb?"
        subtitle="Modern technology meets Ethiopian tradition"
        features={[
          {
            icon: '📱',
            title: 'Digital & Secure',
            description: 'Access your Equb anytime, anywhere on any device',
            highlight: 'Bank-level encryption',
          },
          {
            icon: '⚡',
            title: 'Instant Transfers',
            description: 'Get your payout instantly when your turn comes',
            highlight: 'Real-time settlement',
          },
          {
            icon: '📊',
            title: 'Full Transparency',
            description: 'Track every transaction with detailed reports',
            highlight: 'Complete visibility',
          },
          {
            icon: '🌍',
            title: 'Global Access',
            description: 'Join Equbs with anyone, anywhere in the world',
            highlight: 'No borders',
          },
        ]}
      />

      {/* 6. Testimonials */}
      <Testimonials
        testimonials={[
          {
            name: 'Aisha Mohammed',
            role: 'Business Owner, Addis Ababa',
            image: '👩‍💼',
            quote: 'QalNet helped me save ETB 100,000 for my shop expansion. The trust and security made it perfect for my team.',
            rating: 5,
          },
          {
            name: 'Abebe Tekle',
            role: 'Student, Dire Dawa',
            image: '👨‍🎓',
            quote: 'As a student, I couldn\'t manage a traditional Equb. QalNet made it simple and affordable. I saved for my tuition!',
            rating: 5,
          },
          {
            name: 'Fatuma Hassan',
            role: 'Farmer, Oromia',
            image: '👩‍🌾',
            quote: 'My Equb group went from 6 members to 20! QalNet scales perfectly. No more manual record-keeping.',
            rating: 5,
          },
        ]}
      />

      {/* 7. Comparison Banner */}
      <PricingComparison
        title="Traditional Equb vs QalNet"
        subtitle="How we're transforming the way Ethiopians save together"
        features={[
          {
            feature: 'Setup Time',
            traditional: '2-3 days of planning',
            qalnet: '5 minutes to create & join',
          },
          {
            feature: 'Record Keeping',
            traditional: 'Manual notebooks',
            qalnet: 'Automatic digital ledger',
          },
          {
            feature: 'Payout Security',
            traditional: 'Cash handling risk',
            qalnet: '100% encrypted & tracked',
          },
          {
            feature: 'Access Schedule',
            traditional: 'Fixed in-person meetings',
            qalnet: '24/7 mobile access',
          },
          {
            feature: 'Member Scaling',
            traditional: 'Limited to 10-15 people',
            qalnet: 'Unlimited global members',
          },
          {
            feature: 'Verification',
            traditional: 'Manual identity checks',
            qalnet: 'Instant digital verification',
          },
        ]}
      />

      {/* 8. Promo Banner CTA */}
      <PromoBanner
        title="Ready to Join the Savings Revolution?"
        subtitle="Start your Equb today and connect with Ethiopians saving together"
        ctaText="Start Your Equb Now"
        ctaLink="/features"
        features={[
          'No credit card required - completely free to start',
          'Create or join an Equb in under 5 minutes',
          '4 languages supported (Amharic, Oromo, Tigrinya, English)',
          'Join thousands of Ethiopians already saving',
        ]}
      />

      {/* Value Proposition */}
      <section className="py-20 md:py-32 bg-white">
      </section>

      {/* Navigation Features */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[#f5f3f0] to-[#ece8e3] pattern-cross">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-[#ce1126]">
            🎯 {t.uxTitle}
          </h2>
          <p className="text-center text-[#5a5a5a] mb-16 text-lg">5 powerful ways to manage your Equb</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {navFeatures.map((feature, idx) => (
              <div key={idx} className="card-eth p-6 rounded-2xl text-center transform hover:rotate-2 transition-all duration-300 cursor-pointer animate-eth-bounce-in"
                style={{animationDelay: `${idx * 100}ms`}}>
                <div className="text-6xl mb-3 transition-transform group-hover:scale-150 duration-300">{feature.icon}</div>
                <h3 className="font-black text-[#0d7e4d] group-hover:text-[#d4af37] transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-[#0d7e4d]">
            ⚙️ {t.techStackTitle}
          </h2>
          <p className="text-center text-[#5a5a5a] mb-16 max-w-2xl mx-auto text-lg font-semibold">
            {t.techStackDesc}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((item, idx) => (
              <div key={idx} className="card-eth p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-black text-[#d4af37] mb-2">{idx + 1}.</div>
                <div className="text-xs font-bold text-[#ce1126] mb-2 uppercase">{item.category}</div>
                <h3 className="font-black text-lg mb-2 text-[#0d7e4d]">{item.tech}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-[#0d7e4d] to-[#ce1126] text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-eth opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 drop-shadow-lg glow-eth-gold">
            📊 {t.offlineTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics.map((metric, idx) => (
              <div key={idx} className="text-center backdrop-blur-sm bg-white/10 rounded-2xl p-8 border-2 border-white/30 hover:border-[#d4af37] transition-all duration-300 hover:scale-110 group cursor-pointer">
                <div className="text-5xl font-black mb-3 text-[#d4af37] group-hover:text-white transition-colors drop-shadow-lg">{metric.value}</div>
                <p className="text-white/90 font-bold group-hover:text-[#d4af37] transition-colors">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Roadmap */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-[#ce1126]">
            🗺️ {t.roadmapTitle}
          </h2>
          <p className="text-center text-[#5a5a5a] mb-16 text-lg">From vision to reality in 12 weeks</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase, idx) => (
              <div key={idx} className="card-eth p-6 rounded-2xl border-l-4 border-[#d4af37] relative group">
                <div className="absolute -left-4 -top-4 w-8 h-8 bg-[#0d7e4d] rounded-full text-white flex items-center justify-center font-black group-hover:scale-125 transition-transform">{idx + 1}</div>
                <h3 className="font-black text-lg mb-2 text-[#0d7e4d] group-hover:text-[#ce1126] transition-colors">{phase.title}</h3>
                <p className="text-sm text-[#d4af37] mb-4 font-bold">{phase.duration}</p>
                <ul className="space-y-2">
                  {(Array.isArray(phase.items) ? phase.items : []).map((item: string, i: number) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start">
                      <span className="text-[#0d7e4d] mr-2 font-black">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[#ce1126] via-[#0d7e4d] to-[#d4af37] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pattern-eth opacity-20"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-lg">
            🚀 Ready to Transform Ethiopian Finance?
          </h2>
          <p className="text-xl text-white/90 mb-10 font-semibold">
            Join thousands of Ethiopians building the future of digital savings
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-white text-[#0d7e4d] font-black rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-110 text-lg drop-shadow-lg"
          >
            {t.contactUs} 📱
          </Link>
        </div>
      </section>

      <Footer lang={lang} />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
