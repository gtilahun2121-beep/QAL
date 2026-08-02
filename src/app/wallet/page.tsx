'use client';

import { useState } from 'react';
import { Language, defaultLanguage } from '@/i18n/config';
import { translations } from '@/i18n/translations';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function WalletPage() {
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
          <h1 className="text-4xl font-black text-gray-900 mb-8">
            {lang === 'en' ? 'Wallet 💰' : 'ዋሊት 💰'}
          </h1>

          {/* Wallet Balance */}
          <div className="bg-gradient-to-r from-[#0d7e4d] to-[#d4af37] text-white rounded-2xl shadow-lg p-8 mb-8">
            <p className="text-sm opacity-90">{lang === 'en' ? 'Current Balance' : 'አሁን ሚዛን'}</p>
            <h2 className="text-5xl font-black mb-4">ETB 12,500</h2>
            <div className="flex gap-4">
              <button className="bg-white text-[#0d7e4d] font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                {lang === 'en' ? 'Deposit' : 'ተወገዱ'}
              </button>
              <button className="bg-white/20 text-white font-bold px-6 py-2 rounded-lg hover:bg-white/30 transition-all">
                {lang === 'en' ? 'Withdraw' : 'ዘግቡ'}
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {lang === 'en' ? 'Transaction History' : 'ተግባር ታሪክ'}
            </h2>
            <div className="space-y-4">
              {[
                { type: 'Payment', equb: 'Gold Equb', amount: '-ETB 5,000', date: '2024-02-10', status: '✓ Completed' },
                { type: 'Payout', equb: 'Community Fund', amount: '+ETB 8,000', date: '2024-02-05', status: '✓ Completed' },
                { type: 'Payment', equb: 'Business Support', amount: '-ETB 5,000', date: '2024-02-01', status: '✓ Completed' },
                { type: 'Deposit', equb: 'Bank Transfer', amount: '+ETB 10,000', date: '2024-01-28', status: '✓ Completed' },
              ].map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0">
                  <div>
                    <p className="font-bold text-gray-900">{txn.type}: {txn.equb}</p>
                    <p className="text-sm text-gray-500">{txn.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${txn.amount.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                      {txn.amount}
                    </p>
                    <p className="text-xs text-green-600">{txn.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}
