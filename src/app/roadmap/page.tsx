'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Language, defaultLanguage } from '@/i18n/config';
import { translations } from '@/i18n/translations';
import Header from '../components/Header';
import Footer from '../components/Footer';

function RoadmapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>((searchParams?.get('lang') as Language) || defaultLanguage);
  const t = translations[lang];

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    router.push(`/roadmap?lang=${newLang}`);
  };

  const phases = [
    {
      title: t.phase1,
      duration: t.phase1Duration,
      items: t.phase1Items,
      status: 'In Progress'
    },
    {
      title: t.phase2,
      duration: t.phase2Duration,
      items: t.phase2Items,
      status: 'Planned'
    },
    {
      title: t.phase3,
      duration: t.phase3Duration,
      items: t.phase3Items,
      status: 'Planned'
    },
    {
      title: t.phase4,
      duration: t.phase4Duration,
      items: t.phase4Items,
      status: 'Planned'
    }
  ];

  return (
    <>
      <Header lang={lang} onLanguageChange={handleLanguageChange} />

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.roadmapTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-16">
            12-week implementation timeline with 4 phases
          </p>

          <div className="space-y-6">
            {phases.map((phase, idx) => (
              <div
                key={idx}
                className="border-l-4 border-emerald-600 pl-8 py-4 relative"
              >
                <div className="absolute -left-3 top-6 w-6 h-6 bg-emerald-600 rounded-full"></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{phase.title}</h3>
                    <p className="text-emerald-600 font-semibold">{phase.duration}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    phase.status === 'In Progress' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {phase.status}
                  </span>
                </div>

                <ul className="space-y-2">
                  {(Array.isArray(phase.items) ? phase.items : []).map((item: string, i: number) => (
                    <li key={i} className="text-gray-700 flex items-start">
                      <span className="text-emerald-600 mr-3 font-bold">◆</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-8 border border-emerald-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-emerald-600">12</div>
                <p className="text-gray-600">weeks to production</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">2,500</div>
                <p className="text-gray-600">TPS target</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">&lt;500ms</div>
                <p className="text-gray-600">API latency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </>
  );
}

export default function RoadmapPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <RoadmapContent />
      </Suspense>
    </main>
  );
}
