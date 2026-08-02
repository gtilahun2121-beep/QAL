'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Language, defaultLanguage } from '@/i18n/config';
import { translations } from '@/i18n/translations';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import RegistrationForm from './components/RegistrationForm';

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>(defaultLanguage);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
  };

  const handleRegistrationSuccess = () => {
    setShowSignUpModal(false);
    router.push('/dashboard');
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onSignUpClick={() => setShowSignUpModal(true)}
        isAuthenticated={false}
      />

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <button
                onClick={() => setShowSignUpModal(false)}
                className="text-2xl text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <RegistrationForm onSuccess={handleRegistrationSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* Homepage Content */}
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0d7e4d] via-[#0a5c38] to-[#ce1126] text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-lg">
              {lang === 'en' ? 'Welcome to QalNet' : lang === 'am' ? 'ወደ QalNet ደህና መጡ' : 'Gara QalNet'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {lang === 'en'
                ? 'Ethiopia\'s trusted digital Equb platform. Secure, transparent, and built for communities.'
                : lang === 'am'
                ? 'የኢትዮጵያ ታማኝ ዲጂታል Equb መድረክ።'
                : 'Tuulee digaalaa Equb biiroo Itoophiyaatiin.'}
            </p>
            <button
              onClick={() => setShowSignUpModal(true)}
              className="bg-white text-[#0d7e4d] px-8 py-4 font-bold text-lg rounded-full hover:shadow-2xl transition-all"
            >
              🚀 Get Started
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-gray-800 mb-12 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🔒', title: 'Secure', desc: 'Bank-level encryption' },
                { icon: '👥', title: 'Community', desc: 'Connect with members' },
                { icon: '💰', title: 'Transparent', desc: 'Track payments' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-gray-50 p-8 rounded-xl border-l-4 border-[#0d7e4d]">
                  <p className="text-4xl mb-4">{feature.icon}</p>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#0d7e4d] to-[#ce1126] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-6">Ready to Join?</h2>
            <button
              onClick={() => setShowSignUpModal(true)}
              className="bg-white text-[#0d7e4d] px-8 py-4 font-bold text-lg rounded-full"
            >
              ✍️ Sign Up
            </button>
          </div>
        </section>
      </div>

      <Footer lang={lang} />
    </main>
  );
}
