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
