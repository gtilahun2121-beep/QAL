'use client';

import { useState } from 'react';
import { Language, defaultLanguage } from '@/i18n/config';
import { translations } from '@/i18n/translations';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function JoinEqubPage() {
  const { isAuthenticated } = useAuth();
  const [lang, setLang] = useState<Language>(defaultLanguage);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold">{lang === 'en' ? 'Please log in' : 'ግባ'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} isAuthenticated={true} />

      <div className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            {lang === 'en' ? 'Join an Equb ➕' : 'Equb ይቀላቀሉ ➕'}
          </h1>
          <p className="text-gray-600 mb-8">
            {lang === 'en' ? 'Browse available Equb groups and join one that fits your needs' : 'Equb ቡድን ይመልከቱ'}
          </p>

          {/* Filter Options */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder={lang === 'en' ? 'Search Equbs...' : 'ፈልግ...'} className="border border-gray-300 rounded-lg px-4 py-2 w-full" />
              <select className="border border-gray-300 rounded-lg px-4 py-2">
                <option>{lang === 'en' ? 'All Sizes' : 'ሁሉ'}</option>
                <option>5-10 members</option>
                <option>10-20 members</option>
                <option>20+ members</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-4 py-2">
                <option>{lang === 'en' ? 'All Categories' : 'ሁሉ'}</option>
                <option>Savings</option>
                <option>Business</option>
                <option>Education</option>
              </select>
              <button className="bg-[#0d7e4d] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#0a5c38]">
                {lang === 'en' ? 'Search' : 'ፈልግ'}
              </button>
            </div>
          </div>

          {/* Equb Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Silver Savers', size: 8, contribution: 'ETB 5,000', duration: '12 months', openSlots: 2 },
              { name: 'Business Boost', size: 15, contribution: 'ETB 10,000', duration: '18 months', openSlots: 3 },
              { name: 'Education Fund', size: 10, contribution: 'ETB 7,500', duration: '12 months', openSlots: 1 },
              { name: 'Family Circle', size: 12, contribution: 'ETB 6,000', duration: '24 months', openSlots: 4 },
              { name: 'Emergency Fund', size: 6, contribution: 'ETB 3,000', duration: '12 months', openSlots: 5 },
              { name: 'Investment Club', size: 20, contribution: 'ETB 15,000', duration: '36 months', openSlots: 0 },
            ].map((equb, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-[#0d7e4d]">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{equb.name}</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{lang === 'en' ? 'Members' : 'አባሎች'}</span>
                    <span className="font-bold">{equb.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{lang === 'en' ? 'Monthly Contribution' : 'ወር መዋጮ'}</span>
                    <span className="font-bold text-[#0d7e4d]">{equb.contribution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{lang === 'en' ? 'Duration' : 'ጊዜ'}</span>
                    <span className="font-bold">{equb.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{lang === 'en' ? 'Open Slots' : 'ክፍት ቦታ'}</span>
                    <span className={`font-bold ${equb.openSlots === 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {equb.openSlots}
                    </span>
                  </div>
                </div>
                <button
                  disabled={equb.openSlots === 0}
                  className={`w-full font-bold py-2 rounded-lg transition-all ${
                    equb.openSlots === 0
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-[#0d7e4d] text-white hover:bg-[#0a5c38]'
                  }`}
                >
                  {equb.openSlots === 0 ? (lang === 'en' ? 'Full' : 'ሙላ') : (lang === 'en' ? 'Join Now' : 'ተቀላቀል')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}
