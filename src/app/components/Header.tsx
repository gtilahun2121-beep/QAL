'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Language, languages } from '@/i18n/config';
import { translations } from '@/i18n/translations';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onSignUpClick?: () => void;
  isAuthenticated?: boolean;
}

export default function Header({ lang, onLanguageChange, onSignUpClick, isAuthenticated = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<any | null>(null);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const t = translations[lang];

  useEffect(()=>{
    try{
      const token = localStorage.getItem('qalnet_admin_token');
      if(!token) return;
      const raw = localStorage.getItem(`qalnet_admin_${token}`);
      if(raw) {
        setAdmin(JSON.parse(raw));
      }
    }catch(e){
      // ignore
    }
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!adminRef.current) return;
      if (!adminRef.current.contains(e.target as Node)) setAdminMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const navItems = [
    { label: t.home, href: '/' },
    { label: t.features, href: '/features' },
    { label: t.docs, href: '/docs' },
  ];

  return (
    <header className="bg-gradient-to-r from-[#0a1f3d] to-[#16357a] shadow-2xl sticky top-0 z-50 border-b-4 border-[#d4af37]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-lg flex-shrink-0">
              <Image src="/logo.png" alt="QalNet logo" fill className="object-cover" />
            </div>
            <div>
              <span className="font-black text-xl sm:text-2xl text-white drop-shadow-lg truncate">QalNet</span>
              <p className="hidden sm:block text-xs text-white/80 font-semibold -mt-1">Ethiopia's Digital Equb</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white font-bold hover:text-[#d4af37] transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="px-2 sm:px-4 py-2 border-2 border-[#d4af37] rounded-full text-xs sm:text-sm bg-white text-[#0a1f3d] font-bold cursor-pointer"
            >
              {(Object.keys(languages) as Language[]).map((l) => (
                <option key={l} value={l}>
                  {languages[l]}
                </option>
              ))}
            </select>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/20 rounded-full transition-all text-white font-bold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Admin button: ensure navigation — create dev admin if missing then navigate */}
            {!admin && (
              <button
                onClick={() => {
                  try {
                    const token = localStorage.getItem('qalnet_admin_token');
                    if (!token) {
                      const demo = 'admin_demo';
                      localStorage.setItem('qalnet_admin_token', demo);
                      localStorage.setItem(`qalnet_admin_${demo}`, JSON.stringify({
                        fullName: 'System Admin',
                        role: 'system_admin',
                        permissions: ['view_members', 'approve_kyc', 'manage_disputes', 'view_financial_records', 'manage_admin_users'],
                      }));
                      // also set role key expected by admin page
                      localStorage.setItem('qalnet_admin_role', 'system_admin');
                    }
                  } catch (e) {
                    // ignore
                  }
                  // Navigate using explicit origin to avoid relative routing mismatches
                  try {
                    window.location.href = `${window.location.origin}/admin/dashboard`;
                  } catch (e) {
                    // fallback
                    window.location.href = '/admin/dashboard';
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all"
              >
                Admin
              </button>
            )}

            {/* Show system admin if logged in - placed at far right with dropdown */}
            {admin && (
              <div ref={adminRef} className="relative ml-2">
                <button
                  onClick={() => setAdminMenuOpen((s) => !s)}
                  className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-full"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#27487f] flex items-center justify-center text-sm font-black text-[#0a1f3d]">{(admin.fullName || 'A').split(' ').map((s: string)=>s[0]).slice(0,2).join('')}</div>
                  <div className="text-white text-sm">
                    <div className="font-black leading-none">{admin.fullName}</div>
                    <div className="text-xs text-white/80">{admin.role?.replace('_',' ')}</div>
                  </div>
                </button>

                {adminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-[#0a1f3d] z-50">
                    <button
                      onClick={() => {
                        try {
                          window.location.href = `${window.location.origin}/admin/dashboard`;
                        } catch (e) {
                          window.location.href = '/admin/dashboard';
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Open Dashboard
                    </button>
                    <button
                      onClick={() => {
                        try {
                          const token = localStorage.getItem('qalnet_admin_token');
                          if (token) localStorage.removeItem(`qalnet_admin_${token}`);
                          localStorage.removeItem('qalnet_admin_token');
                          localStorage.removeItem('qalnet_admin_role');
                        } catch (e) {
                          // ignore
                        }
                        window.location.href = '/';
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-white/10 backdrop-blur-md rounded-2xl p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-white font-bold hover:bg-white/20 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
