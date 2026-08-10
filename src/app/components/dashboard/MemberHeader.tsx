'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Language, languages } from '@/i18n/config';
import ProfileAvatar from '@/app/components/dashboard/ProfileAvatar';

interface MemberHeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  user: { name: string; phone: string; email?: string; role: string };
  uid: string;
  unreadCount: number;
  searchValue: string;
  onSearchChange: (q: string) => void;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onSignOut: () => void;
}

export default function MemberHeader({
  lang,
  onLanguageChange,
  user,
  uid,
  unreadCount,
  searchValue,
  onSearchChange,
  onOpenMenu,
  onOpenNotifications,
  onSignOut,
}: MemberHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = (en: string, am: string) => (lang === 'en' ? en : am);

  return (
    <header className="bg-gradient-to-r from-teal-800 to-teal-600 shadow-2xl sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <span className="text-white font-black text-lg">Q</span>
            </div>
            <div className="min-w-0">
              <span className="font-black text-xl text-white drop-shadow-lg truncate">QalNet</span>
              <p className="hidden sm:block text-[10px] text-white/80 font-semibold -mt-1">
                {t('Ethiopia\'s Digital Equb', 'የኢትዮጵያ ዲጂታል ኢቅብ')}
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:flex items-center bg-white/15 rounded-full px-4 py-2 gap-2 focus-within:bg-white/25 transition-all">
            <svg className="w-4 h-4 text-white/80 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('Search equbs, members, transactions...', 'Equbs፣ አባላት፣ ግብይቶችን ይፈልጉ...')}
              className="w-full bg-transparent text-white placeholder-white/70 text-sm outline-none"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <select
              value={lang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="px-2 py-1.5 rounded-full text-xs sm:text-sm bg-white text-teal-900 font-bold cursor-pointer outline-none"
            >
              {(Object.keys(languages) as Language[]).map((l) => (
                <option key={l} value={l}>
                  {languages[l]}
                </option>
              ))}
            </select>

            {/* Notification bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 hover:bg-white/20 rounded-full transition-all text-white"
              aria-label={t('Notifications', 'ማሳወቂያዎች')}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10 21a2 2 0 0 0 4 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Menu trigger */}
            <button
              onClick={onOpenMenu}
              className="hidden sm:inline-flex p-2 hover:bg-white/20 rounded-full transition-all text-white"
              aria-label={t('Menu', 'ምናሌ')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Avatar */}
            <button
              onClick={onOpenMenu}
              className="rounded-full ring-2 ring-white/40 hover:ring-white transition-all flex-shrink-0"
              aria-label={t('Open profile', 'መገለጫ ክፈት')}
            >
              <ProfileAvatar uid={uid} name={user.name} size={38} />
            </button>

            {/* Sign out */}
            <button
              onClick={onSignOut}
              className="hidden md:inline-flex px-4 py-2 bg-white text-teal-800 font-bold rounded-full hover:shadow-lg transition-all text-sm"
            >
              {t('Sign Out', 'ውጣ')}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 hover:bg-white/20 rounded-full transition-all text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search + actions */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-3 bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <div className="flex items-center bg-white/15 rounded-full px-4 py-2 gap-2">
              <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('Search...', 'ይፈልጉ...')}
                className="w-full bg-transparent text-white placeholder-white/70 text-sm outline-none"
              />
            </div>
            <button
              onClick={onOpenMenu}
              className="w-full px-4 py-3 bg-white text-teal-800 font-bold rounded-xl"
            >
              {t('Member Menu', 'የአባል ምናሌ')}
            </button>
            <button
              onClick={onSignOut}
              className="w-full px-4 py-3 bg-red-600 text-white font-bold rounded-xl"
            >
              {t('Sign Out', 'ውጣ')}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}