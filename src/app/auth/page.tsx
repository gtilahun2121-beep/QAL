'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Language, defaultLanguage } from '@/i18n/config';
import { translations } from '@/i18n/translations';
import RegistrationFormRefactored from '../components/auth/RegistrationFormRefactored';
import LoginForm from '../components/auth/LoginForm';
import AdminLoginFormRefactored from '../components/auth/AdminLoginFormRefactored';
import ForgotPinFormRefactored from '../components/auth/ForgotPinFormRefactored';
import GuestOverviewRefactored from '../components/auth/GuestOverviewRefactored';
import { ToastContainer, useToast } from '../components/notifications/Toast';

function AuthContent() {
  const [mode, setMode] = useState<'guest' | 'register' | 'login' | 'admin' | 'forgot'>('guest');
  const [lang, setLang] = useState<Language>(defaultLanguage);
  const { toasts, removeToast, success, error } = useToast();

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
  };

  return (
    <>
      <Header lang={lang} onLanguageChange={handleLanguageChange} />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#ece8e3] py-12 md:py-20">
        <div className="max-w-md mx-auto px-4">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
            <button
              onClick={() => setMode('guest')}
              className={`py-3 px-2 sm:px-4 font-black rounded-full transition-all duration-300 text-xs sm:text-base ${
                mode === 'guest'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-blue-600 border-2 border-blue-500'
              }`}
            >
              👁️ Guest
            </button>
            <button
              onClick={() => setMode('register')}
              className={`py-3 px-2 sm:px-4 font-black rounded-full transition-all duration-300 text-xs sm:text-base ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#0d7e4d] to-[#d4af37] text-white shadow-lg'
                  : 'bg-white text-[#0d7e4d] border-2 border-[#0d7e4d]'
              }`}
            >
              ✍️ Sign Up
            </button>
            <button
              onClick={() => setMode('login')}
              className={`py-3 px-2 sm:px-4 font-black rounded-full transition-all duration-300 text-xs sm:text-base ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#ce1126] to-[#d4af37] text-white shadow-lg'
                  : 'bg-white text-[#ce1126] border-2 border-[#ce1126]'
              }`}
            >
              🔐 Sign In
            </button>
            <button
              onClick={() => setMode('forgot')}
              className={`py-3 px-2 sm:px-4 font-black rounded-full transition-all duration-300 text-xs sm:text-base ${
                mode === 'forgot'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-white text-orange-600 border-2 border-orange-500'
              }`}
            >
              🆘 Forgot
            </button>
            <button
              onClick={() => setMode('admin')}
              className={`py-3 px-2 sm:px-4 font-black rounded-full transition-all duration-300 text-xs sm:text-base ${
                mode === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-red-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 border-2 border-purple-600'
              }`}
            >
              👑 Admin
            </button>
          </div>

          {/* Forms */}
          {mode === 'guest' && (
            <GuestOverviewRefactored lang={lang} />
          )}
          {mode === 'register' && (
            <RegistrationFormRefactored lang={lang} onSuccess={success} onError={error} />
          )}
          {mode === 'login' && (
            <LoginForm lang={lang} onSuccess={success} onError={error} />
          )}
          {mode === 'forgot' && (
            <ForgotPinFormRefactored onSuccess={success} onError={error} />
          )}
          {mode === 'admin' && (
            <AdminLoginFormRefactored onSuccess={success} onError={error} />
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
