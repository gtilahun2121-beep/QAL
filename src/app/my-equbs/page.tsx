'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Language, defaultLanguage } from '@/i18n/config';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { DashboardService, DashboardState } from '@/app/services/dashboardService';

const daysUntil = (dateStr: string, now: number): number => {
  const target = new Date(dateStr).getTime();
  if (Number.isNaN(target)) return 0;
  return Math.max(0, Math.ceil((target - now) / 86400000));
};

interface MyEqubsContentProps {
  uid: string;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function MyEqubsPage() {
  const { user, isAuthenticated } = useAuth();
  const [lang, setLang] = useState<Language>(defaultLanguage);

  if (!isAuthenticated || !user || !user.id) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold">{lang === 'en' ? 'Please log in' : 'ግባ'}</p>
      </main>
    );
  }

  return <MyEqubsContent uid={user.id} lang={lang} setLang={setLang} />;
}

function MyEqubsContent({ uid, lang, setLang }: MyEqubsContentProps) {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>(() => DashboardService.loadState(uid));
  const [now] = useState(() => Date.now());

  useEffect(() => {
    let active = true;
    DashboardService.loadFromApi(uid)
      .then((loaded) => {
        if (active) setState(loaded);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [uid]);

  const dashboard = state;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} isAuthenticated={true} />

      <div className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 break-words">
              {lang === 'en' ? 'My Equbs ' : 'ስሌዎ Equbs '}
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto px-4 py-2 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
            >
              ← {lang === 'en' ? 'Back to Dashboard' : 'ወደ ዳሽቦርድ'}
            </button>
          </div>
          <p className="text-gray-600 mb-8">
            {lang === 'en' ? 'Manage your Equb groups and track contributions' : 'Equb ቡድንዎን ያስተዳድሩ'}
          </p>

          {dashboard.equbs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-lg font-bold text-gray-800 mb-4">
                {lang === 'en' ? 'No Equbs yet' : 'እስካሁን Equbs የሉም'}
              </p>
              <button
                onClick={() => router.push('/join-equb')}
                className="px-6 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
              >
                 {lang === 'en' ? 'Join an Equb' : 'Equb ተጠምዱ'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboard.equbs.map((equb) => (
                <div
                  key={equb.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-[#16357a]"
                  onClick={() => router.push(`/dashboard?equb=${equb.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{equb.name}</h3>
                    {equb.manager && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full">
                         Manager
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{lang === 'en' ? 'Members' : 'አባሎች'}</span>
                      <span className="font-bold text-gray-900">{equb.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{lang === 'en' ? 'Contribution' : 'መዋጮ'}</span>
                      <span className="font-bold text-blue-700">ETB {equb.contribution.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{lang === 'en' ? 'Your Position' : 'ቦታ'}</span>
                      <span className="font-bold text-gray-900">#{equb.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{lang === 'en' ? 'Next Payment' : 'ቀጣይ ክፍያ'}</span>
                      <span className="font-bold text-orange-600">
                        {equb.nextPaymentDate} ({daysUntil(equb.nextPaymentDate, now)}d)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{lang === 'en' ? 'Next Payout' : 'ቀጣይ ክፍሌ'}</span>
                      <span className="font-bold text-purple-600">{equb.nextPayout}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard?equb=${equb.id}`);
                    }}
                    className="w-full bg-[#16357a] text-white font-bold py-2 rounded-lg hover:bg-[#27487f] transition-all"
                  >
                    {lang === 'en' ? 'View Details' : 'ዝርዝር ይመልከቱ'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}
