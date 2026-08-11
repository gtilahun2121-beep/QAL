'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import AdminLoginForm from '@/app/components/auth/AdminLoginForm';
import { Language, defaultLanguage } from '@/i18n/config';
import { ToastContainer, useToast } from '@/app/components/notifications/Toast';

export default function AdminLoginPage() {
  const [lang, setLang] = useState<Language>(defaultLanguage);
  const toast = useToast();

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#ece8e3]">
      <Header lang={lang} onLanguageChange={setLang} />

      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <h1 className="text-3xl font-black text-[#16357a]">Admin Portal</h1>
            <p className="text-sm text-gray-600 mt-1">
              Restricted area — authorised administrators only
            </p>
          </motion.div>

          <AdminLoginForm
            onSuccess={(title, message, duration) =>
              toast.success(title, message, duration || 3000)
            }
            onError={(title, message, duration) =>
              toast.error(title, message, duration || 5000)
            }
          />

          <p className="text-xs text-gray-500 text-center mt-4">
            Access is monitored and logged. Unauthorised access attempts are
            recorded in the audit log.
          </p>
        </div>
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <Footer lang={lang} />
    </main>
  );
}
