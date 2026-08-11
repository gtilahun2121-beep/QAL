'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Language, defaultLanguage } from '@/i18n/config';
import { translations } from '@/i18n/translations';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/modals/AuthModal';
import { ToastContainer, useToast } from './components/notifications/Toast';

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [lang, setLang] = useState<Language>(defaultLanguage);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
  };

  const handleAuthSuccess = (title: string, message: string, duration?: number) => {
    console.log(' handleAuthSuccess called - closing modal and redirecting to /dashboard');
    setShowAuthModal(false);
    toast.success(title, message, duration || 3000);
    // Add a small delay to ensure modal closes before redirect
    setTimeout(() => {
      console.log(' Redirecting to /dashboard...');
      router.push('/dashboard');
    }, 500);
  };

  const handleAuthError = (title: string, message: string, duration?: number) => {
    toast.error(title, message, duration || 5000);
  };

  useEffect(() => {
    try {
      if (searchParams?.get('auth') === '1') setShowAuthModal(true);
    } catch (e) {
      // ignore
    }
  }, [searchParams]);

  return (
    <main className="flex flex-col min-h-screen">
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onSignUpClick={() => setShowAuthModal(true)}
        isAuthenticated={false}
      />

      {/* Auth Modal - New Choice Flow */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="choice"
        lang={lang}
        onSuccess={handleAuthSuccess}
        onError={handleAuthError}
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

      {/* Homepage Content */}
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0a1f3d] via-[#16357a] to-[#27487f] text-white py-20 px-4">
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
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-[#0a1f3d] px-8 py-4 font-bold text-lg rounded-full hover:shadow-2xl transition-all"
            >
               Get Started
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-[#0a1f3d]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-white mb-12 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Secure', desc: 'Bank-level encryption' },
                { title: 'Community', desc: 'Connect with members' },
                { title: 'Transparent', desc: 'Track payments' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-[#16357a] p-8 rounded-xl border-l-4 border-[#d4af37]">
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/70">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#16357a] to-[#27487f] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-6">Ready to Join?</h2>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-[#0a1f3d] px-8 py-4 font-bold text-lg rounded-full"
            >
               Sign Up
            </button>
          </div>
        </section>
      </div>

      <Footer lang={lang} />
    </main>
  );
}
