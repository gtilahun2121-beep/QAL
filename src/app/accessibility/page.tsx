'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Language, defaultLanguage } from '@/i18n/config';
import { translations } from '@/i18n/translations';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AccessibilityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>((searchParams?.get('lang') as Language) || defaultLanguage);
  const t = translations[lang];

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    router.push(`/accessibility?lang=${newLang}`);
  };

  const requirements = [
    { title: 'Screen Reader Support', desc: 'Full screen reader compatibility' },
    { title: 'Font Scaling', desc: 'Supports zoom up to 200%' },
    { title: 'Color Contrast', desc: 'Minimum 4.5:1 contrast' },
    { title: 'Keyboard Navigation', desc: 'Full keyboard support' },
    { title: 'Touch Targets', desc: 'Minimum 44x44dp touch' },
  ];

  return (
    <main>
      <Header lang={lang} onLanguageChange={handleLanguageChange} />

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.a11yTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-16">
            QalNet adheres to WCAG 2.1 AA standards for inclusive design
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {requirements.map((req, idx) => (
              <div key={idx} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-8 border border-emerald-200">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{req.title}</h3>
                <p className="text-gray-600">{req.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded">
            <h3 className="font-bold text-blue-900 mb-2">WCAG 2.1 AA Compliance</h3>
            <p className="text-blue-800">
              This platform is designed to be accessible to users with disabilities including:
              visual impairments, motor impairments, cognitive disabilities, and deaf/hard of hearing users.
            </p>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}

export default function AccessibilityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccessibilityContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
