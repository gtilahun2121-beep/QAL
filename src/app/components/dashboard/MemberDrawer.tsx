'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Language } from '@/i18n/config';
import {
  DashboardEqub,
  DashboardTransaction,
  DashboardNotification,
  DashboardActivity,
} from '@/app/services/dashboardService';
import PinSession from '@/app/services/pinSession';
import ProfileAvatar from '@/app/components/dashboard/ProfileAvatar';

interface MemberDrawerProps {
  open: boolean;
  lang: Language;
  user: { name: string; phone: string; role: string; email?: string };
  userId: string;
  initialTab?: string | null;
  walletBalance: number;
  equbs: DashboardEqub[];
  transactions: DashboardTransaction[];
  notifications: DashboardNotification[];
  activity: DashboardActivity[];
  onClose: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onMakePayment: (equb: DashboardEqub) => void;
  onVerifyPin: () => void;
  onSupport: (category: string) => void;
  onSignOut: () => void;
}

type TabId =
  | 'dashboard'
  | 'equbs'
  | 'payments'
  | 'transactions'
  | 'members'
  | 'notifications'
  | 'reports'
  | 'help'
  | 'settings'
  | 'profile'
  | 'language';

type SettingsSub = 'information' | 'notifications' | 'appearance' | 'privacy';

const t = (lang: Language, en: string, am: string) => (lang === 'en' ? en : am);

const iconMap: Record<string, ReactNode> = {
  dashboard: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 12h8v9h-8zM3 15h8v6H3z" />
    </svg>
  ),
  equbs: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  payments: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  transactions: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 10h16M4 14h10M4 18h10" />
    </svg>
  ),
  members: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
      <path d="M16 4a4 4 0 0 1 0 8" />
      <path d="M19 21v-1a6 6 0 0 0-4-5.6" />
    </svg>
  ),
  notifications: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  ),
  reports: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 15v-4M12 15V7M17 15v-6" />
    </svg>
  ),
  help: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .8-1 1.7" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.02a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.02a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  profile: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </svg>
  ),
  language: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

const NAV_ITEMS: { id: TabId; labelEn: string; labelAm: string }[] = [
  { id: 'dashboard', labelEn: 'Dashboard', labelAm: 'ዳሽቦርድ' },
  { id: 'equbs', labelEn: 'My Equbs', labelAm: 'የእኔ Equbs' },
  { id: 'payments', labelEn: 'Payments', labelAm: 'ክፍያዎች' },
  { id: 'transactions', labelEn: 'Transactions', labelAm: 'ግብይቶች' },
  { id: 'members', labelEn: 'Members', labelAm: 'አባላት' },
  { id: 'notifications', labelEn: 'Notifications', labelAm: 'ማሳወቂያዎች' },
  { id: 'reports', labelEn: 'Reports', labelAm: 'ሪፖርቶች' },
  { id: 'help', labelEn: 'Help Center', labelAm: 'እርዳታ' },
  { id: 'settings', labelEn: 'Settings', labelAm: 'ቅንብሮች' },
];

function SectionTitle({ children }: { children: ReactNode }) {
  return <h4 className="font-bold text-gray-900 text-sm mb-3">{children}</h4>;
}

function Badge({ children, color = 'teal' }: { children: ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${colors[color] || colors.teal}`}>
      {children}
    </span>
  );
}

function MiniCalendar({ dueDay }: { dueDay: string }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const today = new Date();
  const first = new Date(month.y, month.m, 1);
  const offset = first.getDay();
  const daysInMonth = new Date(month.y, month.m + 1, 0).getDate();
  const isCurrent = month.y === today.getFullYear() && month.m === today.getMonth();
  const grid = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }).map((_, i) => i - offset + 1);
  const monthName = new Date(month.y, month.m, 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setMonth({ y: month.y, m: month.m === 0 ? 11 : month.m - 1 })}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          aria-label="Previous month"
        >
          ‹
        </button>
        <p className="text-xs font-bold text-gray-900">{monthName}</p>
        <button
          onClick={() => setMonth({ y: month.y, m: month.m === 11 ? 0 : month.m + 1 })}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[9px] font-bold text-gray-500 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 text-center text-[10px]">
        {grid.map((day, i) => {
          if (day < 1 || day > daysInMonth) return <span key={i} />;
          const dateStr = `${month.y}-${String(month.m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isDue = dueDay === dateStr;
          return (
            <span
              key={i}
              className={`w-6 h-6 mx-auto flex items-center justify-center rounded-full ${
                isDue
                  ? 'bg-teal-600 text-white font-black'
                  : isCurrent && day === today.getDate()
                    ? 'bg-teal-50 text-teal-700 font-bold'
                    : 'text-gray-700'
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-teal-600 to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function MemberDrawer({
  open,
  lang,
  user,
  userId,
  initialTab,
  walletBalance,
  equbs,
  transactions,
  notifications,
  activity,
  onClose,
  onDeposit,
  onWithdraw,
  onMakePayment,
  onVerifyPin,
  onSupport,
  onSignOut,
}: MemberDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [settingsSub, setSettingsSub] = useState<SettingsSub>('information');
  const [remaining, setRemaining] = useState(PinSession.MAX_ATTEMPTS);
  const [locked, setLocked] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!open) return;
    if (initialTab && NAV_ITEMS.some((n) => n.id === initialTab)) {
      setActiveTab(initialTab as TabId);
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const refresh = () => {
      setRemaining(PinSession.remainingAttempts(userId));
      setLocked(PinSession.isLocked(userId));
    };
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [open, userId, now]);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [open]);

  const lockSeconds = Math.max(0, Math.ceil(PinSession.lockRemainingMs(userId) / 1000));
  const memberCount = equbs.reduce((sum, e) => sum + e.members, 0);
  const totalContributions = Math.abs(
    transactions.filter((tx) => tx.type === 'Payment').reduce((sum, tx) => sum + tx.amount, 0)
  );
  const totalPayouts = transactions
    .filter((tx) => tx.type === 'Payout')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const pendingCount = equbs.filter((e) => e.status === 'pending_contribution').length;
  const nextPayment = equbs.slice().sort((a, b) => (a.nextPaymentDate < b.nextPaymentDate ? -1 : 1))[0];
  const nextDueDate = nextPayment?.nextPaymentDate || '';
  const balancePctChange = walletBalance > 0 ? 8.4 : 0;
  const savedTotal = totalContributions > 0 ? totalContributions : walletBalance > 0 ? walletBalance : 0;
  const growthPct = savedTotal > 0 ? 12.6 : 0;

  const go = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'settings') setSettingsSub('information');
  };

  const initials = (user.name || 'M')
    .split(' ')
    .map((p) => p[0]).join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Design-style panel: internal sidebar (nav + user card) + content */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed left-0 top-0 bottom-0 w-[860px] max-w-[96vw] bg-gray-50 z-[60] shadow-2xl flex overflow-hidden"
          >
            {/* ── Internal sidebar ─────────────────────────────── */}
            <div className="w-[230px] shrink-0 bg-white border-r border-gray-200 flex flex-col">
              {/* Brand */}
              <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 text-white flex items-center justify-center font-black text-sm">
                  Q
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm leading-tight">QalNet</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    {t(lang, 'Member Portal', 'የአባል ፖርታል')}
                  </p>
                </div>
              </div>

              {/* Close (mobile) */}
              <div className="p-2">
                <button
                  onClick={onClose}
                  className="w-full py-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t(lang, 'Close', 'ዝጋ')}
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 overflow-y-auto px-2 pb-2">
                <div className="space-y-0.5">
                  {NAV_ITEMS.map((item) => {
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => go(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          active
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className={`${active ? 'text-teal-600' : 'text-gray-400'}`}>{iconMap[item.id]}</span>
                        {t(lang, item.labelEn, item.labelAm)}
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* User card */}
              <div className="border-t border-gray-100 p-3">
                <div className="flex items-center gap-2.5 px-1 mb-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                    {initials || 'M'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-gray-900 text-sm truncate leading-tight">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate leading-tight">{user.email || user.phone}</p>
                  </div>
                  <Badge color="green">{t(lang, 'Active Member', 'ንቁ አባል')}</Badge>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => go('profile')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'profile' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    {iconMap.profile}
                    {t(lang, 'My Profile', 'የእኔ መገለጫ')}
                  </button>
                  <button
                    onClick={() => go('settings')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'settings' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    {iconMap.settings}
                    {t(lang, 'Account Settings', 'የመለያ ቅንብሮች')}
                  </button>
                  <button
                    onClick={() => go('settings')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    {t(lang, 'Security & Privacy', 'ደህንነት እና ግላዊነት')}
                  </button>
                  <button
                    onClick={() => go('notifications')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all flex items-center gap-2"
                  >
                    {iconMap.notifications}
                    {t(lang, 'Notifications', 'ማሳወቂያዎች')}
                  </button>
                  <button
                    onClick={() => go('language')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${
                      activeTab === 'language' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    {iconMap.language}
                    {t(lang, 'Language', 'ቋንቋ')}
                  </button>
                  <button
                    onClick={() => go('help')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all flex items-center gap-2"
                  >
                    {iconMap.help}
                    {t(lang, 'Help & Support', 'እርዳታ')}
                  </button>
                </div>
                <button
                  onClick={onSignOut}
                  className="mt-2.5 w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  {t(lang, 'Sign Out', 'ውጣ')}
                </button>
              </div>
            </div>

            {/* ── Content area ─────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-4">
              {activeTab === 'dashboard' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">
                      {t(lang, `Welcome back, ${user.name}`, `እንኳን ደህና መጡ, ${user.name}`)}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t(lang, "Here's what's happening with your Equbs today.", 'ዛሬ ስለ Equbs ምን እየተከሰተ እንዳለ እነሆ።')}
                    </p>
                  </div>

                  {/* KPI cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <p className="text-xs font-bold text-gray-500">
                        {t(lang, 'Total Balance', 'ጠቅላላ ቀሪ ሂሳብ')}
                      </p>
                      <div className="flex items-end justify-between mt-2">
                        <p className="text-3xl font-black text-gray-900">ETB {walletBalance.toLocaleString()}</p>
                        {balancePctChange > 0 && (
                          <Badge color="green">+{balancePctChange}%</Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {t(lang, 'from last month', 'ካለፈው ወር')}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <p className="text-xs font-bold text-gray-500">
                        {t(lang, 'Total Saved', 'ጠቅላላ ቁጠባ')}
                      </p>
                      <div className="flex items-end justify-between mt-2">
                        <p className="text-3xl font-black text-teal-700">ETB {savedTotal.toLocaleString()}</p>
                        {growthPct > 0 && (
                          <Badge color="green">+{growthPct}%</Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {t(lang, 'from last month', 'ካለፈው ወር')}
                      </p>
                    </div>
                  </div>

                  {/* My Equbs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-black text-gray-900">{t(lang, 'My Equbs', 'የእኔ Equbs')}</h3>
                      {equbs.length > 0 && (
                        <button onClick={() => go('equbs')} className="text-xs font-bold text-teal-600 hover:underline">
                          {t(lang, 'View all', 'ሁሉንም ይመልከቱ')}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {equbs.length === 0 ? (
                        <div className="lg:col-span-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                          {t(lang, 'No Equbs yet. Join or create one to begin.', 'እስካሁን Equb የለም። ይቀላቀሉ ወይም ይፍጠሩ።')}
                        </div>
                      ) : (
                        equbs.map((equb) => {
                          const progress = equb.members > 0 ? (equb.position / equb.members) * 100 : 0;
                          return (
                            <div key={equb.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="font-bold text-gray-900">{equb.name}</p>
                                  <p className="text-[11px] text-gray-500">
                                    {equb.members} {t(lang, 'Members', 'አባላት')} · {t(lang, 'Pos', 'ቦታ')} #{equb.position}
                                  </p>
                                </div>
                                <Badge color={equb.manager ? 'purple' : 'teal'}>
                                  {equb.manager ? t(lang, 'Manager', 'አስተዳዳሪ') : t(lang, 'Active', 'ንቁ')}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-gray-400 mb-1">{t(lang, 'Progress', 'እድገት')}</p>
                              <ProgressBar value={progress} />
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs font-black text-teal-700">ETB {equb.contribution.toLocaleString()}</span>
                                <button
                                  onClick={() => onMakePayment(equb)}
                                  className="px-3 py-1.5 bg-teal-600 text-white text-[11px] font-bold rounded-lg hover:bg-teal-700 transition-all"
                                >
                                  {t(lang, 'Make Payment', 'ክፍያ ክፈል')}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Next Payment + calendar */}
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-black text-gray-900 text-sm">{t(lang, 'Next Payment', 'ቀጣይ ክፍያ')}</h3>
                          {equbs.length > 0 && (
                            <button onClick={() => go('payments')} className="text-[11px] font-bold text-teal-600 hover:underline">
                              {t(lang, 'View all', 'ሁሉንም')}
                            </button>
                          )}
                        </div>
                        {nextPayment ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">{t(lang, 'Next Payment', 'ክፍያ')}</p>
                              <p className="font-black text-gray-900">ETB {nextPayment.contribution.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">{t(lang, 'Due on', 'ቀን')}</p>
                              <p className="font-bold text-orange-600 text-sm">{nextPayment.nextPaymentDate}</p>
                            </div>
                            <div className="pt-1">
                              <MiniCalendar dueDay={nextDueDate} />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">{t(lang, 'No upcoming payment.', 'ምንም ክፍያ የለም።')}</p>
                        )}
                      </div>

                      {/* Important payment */}
                      {nextPayment && (
                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-black text-orange-900 text-sm">
                              {t(lang, 'Important Payment', 'አስፈላጊ ክፍያ')}
                            </p>
                            {pendingCount > 0 && <Badge color="orange">{pendingCount} {t(lang, 'Pending', 'በመጠበቅ')}</Badge>}
                          </div>
                          <p className="text-xs text-orange-700 font-bold">{nextPayment.name}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-black text-orange-900">ETB {nextPayment.contribution.toLocaleString()}</span>
                            <button
                              onClick={() => onMakePayment(nextPayment)}
                              className="px-3.5 py-1.5 bg-orange-600 text-white text-[11px] font-bold rounded-lg hover:bg-orange-700 transition-all"
                            >
                              {t(lang, 'Make Payment', 'ክፍያ ክፈል')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <h3 className="font-black text-gray-900 text-sm mb-3">{t(lang, 'Quick Actions', 'ፈጣን ድርጊቶች')}</h3>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => go('equbs')}
                            className="flex items-center justify-center gap-2 py-3 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-all"
                          >
                            {iconMap.equbs}
                            {t(lang, 'Join Equb', 'Equb ተቀላቀል')}
                          </button>
                          <button
                            onClick={() => onMakePayment(nextPayment || equbs[0])}
                            disabled={equbs.length === 0}
                            className="flex items-center justify-center gap-2 py-3 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 disabled:opacity-40 transition-all"
                          >
                            {iconMap.payments}
                            {t(lang, 'Make Payment', 'ክፍያ ክፈል')}
                          </button>
                          <button
                            onClick={() => go('equbs')}
                            className="flex items-center justify-center gap-2 py-3 bg-teal-700 text-white text-xs font-bold rounded-xl hover:bg-teal-800 transition-all"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                            {t(lang, 'Create Equb', 'Equb ፍጠር')}
                          </button>
                          <button
                            onClick={() => go('members')}
                            className="flex items-center justify-center gap-2 py-3 bg-purple-700 text-white text-xs font-bold rounded-xl hover:bg-purple-800 transition-all"
                          >
                            {iconMap.members}
                            {t(lang, 'Invite Members', 'አባላትን ጋብዝ')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'equbs' && (
                <div className="space-y-3">
                  <SectionTitle>
                    {t(lang, 'My Equbs', 'የእኔ Equbs')} <span className="text-gray-400">({equbs.length})</span>
                  </SectionTitle>
                  {equbs.length === 0 ? (
                    <p className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      {t(lang, 'No Equbs yet. Join or create one to begin.', 'እስካሁን Equb የለም። ይቀላቀሉ ወይም ይፍጠሩ።')}
                    </p>
                  ) : (
                    equbs.map((equb) => {
                      const progress = equb.members > 0 ? (equb.position / equb.members) * 100 : 0;
                      return (
                        <div key={equb.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-bold text-gray-900">{equb.name}</p>
                              <p className="text-[11px] text-gray-500">
                                {equb.members} {t(lang, 'members', 'አባላት')}
                                {equb.category ? ` · ${equb.category}` : ''}
                              </p>
                            </div>
                            <Badge color={equb.manager ? 'purple' : 'teal'}>
                              {equb.manager ? t(lang, 'Manager', 'አስተዳዳሪ') : t(lang, 'Active', 'ንቁ')}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-gray-400 mb-1">{t(lang, 'Progress', 'እድገት')}</p>
                          <ProgressBar value={progress} />
                          <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                            <div>
                              <p className="text-gray-400 font-medium">{t(lang, 'Position', 'ቦታ')}</p>
                              <p className="font-bold text-gray-900">#{equb.position}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-medium">{t(lang, 'Contribution', 'መዋጮ')}</p>
                              <p className="font-bold text-gray-900">ETB {equb.contribution}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-medium">{t(lang, 'Next Payment', 'ቀጣይ ክፍያ')}</p>
                              <p className="font-bold text-orange-600">{equb.nextPaymentDate}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => onMakePayment(equb)}
                              className="flex-1 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-all"
                            >
                              {t(lang, 'Make Payment', 'ክፍያ ክፈል')}
                            </button>
                            <button
                              onClick={() => go('profile')}
                              className="flex-1 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all"
                            >
                              {t(lang, 'View Equb', 'Equb ይመልከቱ')}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-3">
                  <SectionTitle>{t(lang, 'Payments', 'ክፍያዎች')}</SectionTitle>
                  <div className="bg-gradient-to-br from-teal-700 to-teal-600 rounded-2xl p-5 text-white shadow-md">
                    <p className="text-[11px] opacity-80 font-bold mb-1">
                      {t(lang, 'Available Balance', 'የሚገኝ ቀሪ ሂሳብ')}
                    </p>
                    <p className="text-3xl font-black">ETB {walletBalance.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={onDeposit}
                      className="px-4 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition-all"
                    >
                      {t(lang, 'Deposit', 'ገንዘብ ጨምር')}
                    </button>
                    <button
                      onClick={onWithdraw}
                      className="px-4 py-2.5 border-2 border-teal-600 text-teal-700 text-sm font-bold rounded-xl hover:bg-teal-600 hover:text-white transition-all"
                    >
                      {t(lang, 'Withdraw', 'ገንዘብ አውጣ')}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600">
                      {t(lang, 'Quick payments', 'ፈጣን ክፍያዎች')}
                    </p>
                    {equbs.length === 0 ? (
                      <p className="text-xs text-gray-500">{t(lang, 'No equbs to pay for.', 'ምንም Equb አይገኝም።')}</p>
                    ) : (
                      equbs.map((equb) => (
                        <button
                          key={equb.id}
                          onClick={() => onMakePayment(equb)}
                          className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 shadow-sm transition-all"
                        >
                          <span className="font-bold text-gray-900">{equb.name}</span>
                          <span className="text-xs font-bold text-teal-700">ETB {equb.contribution}</span>
                        </button>
                      ))
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {t(
                      lang,
                      'Withdrawals require your 4-digit PIN (max 3 attempts).',
                      'ገንዘብ ለማውጣት ባለ 4-አሃዝ PIN ያስፈልጋል (ቢበዛ 3 ሙከራዎች)።'
                    )}
                  </p>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-3">
                  <SectionTitle>{t(lang, 'Transactions', 'ግብይቶች')}</SectionTitle>
                  {transactions.length === 0 ? (
                    <p className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      {t(lang, 'No transactions yet.', 'እስካሁን ምንም ክፍያ የለም።')}
                    </p>
                  ) : (
                    transactions.slice(0, 15).map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{txn.equb}</p>
                          <p className="text-[11px] text-gray-500">{txn.type} · {txn.date}</p>
                        </div>
                        <span className={`font-black text-sm ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.amount >= 0 ? '+' : ''}
                          {txn.amount.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'members' && (
                <div className="space-y-3">
                  <SectionTitle>
                    {t(lang, 'Members', 'አባላት')} <span className="text-gray-400">({memberCount})</span>
                  </SectionTitle>
                  {equbs.length === 0 ? (
                    <p className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      {t(lang, 'No equbs to show members.', 'ምንም Equb የለም።')}
                    </p>
                  ) : (
                    equbs.map((equb) => (
                      <div key={equb.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-bold text-gray-900">{equb.name}</p>
                          <Badge color="purple">{equb.members} {t(lang, 'Members', 'አባላት')}</Badge>
                        </div>
                        <div className="space-y-2">
                          {Array.from({ length: Math.min(equb.members, 6) }).map((_, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                                {String.fromCharCode(65 + ((i + equb.position) % 26))}
                              </span>
                              <span className="text-gray-700">
                                {i + 1 === equb.position ? t(lang, 'You', 'እርስዎ') : t(lang, 'Member', 'አባል')} {i + 1}
                              </span>
                              {i + 1 === equb.position && (
                                <Badge color="green">{t(lang, 'You', 'እርስዎ')}</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-3">
                  <SectionTitle>{t(lang, 'Notifications', 'ማሳወቂያዎች')}</SectionTitle>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      {t(lang, 'No notifications yet.', 'እስካሁን ማሳወቂያ የለም።')}
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <span className="text-teal-600">{iconMap.notifications}</span>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{notif.title}</p>
                          <p className="text-[11px] text-gray-500">{notif.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-3">
                  <SectionTitle>{t(lang, 'Reports', 'ሪፖርቶች')}</SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-teal-100 rounded-xl p-3 shadow-sm">
                      <p className="text-[10px] text-gray-500 font-semibold">{t(lang, 'Active Equbs', 'ንቁ Equbs')}</p>
                      <p className="text-xl font-black text-teal-700">{equbs.length}</p>
                    </div>
                    <div className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm">
                      <p className="text-[10px] text-gray-500 font-semibold">{t(lang, 'Total Members', 'ጠቅላላ አባላት')}</p>
                      <p className="text-xl font-black text-purple-700">{memberCount}</p>
                    </div>
                    <div className="bg-white border border-green-100 rounded-xl p-3 shadow-sm">
                      <p className="text-[10px] text-gray-500 font-semibold">{t(lang, 'Contributed (ETB)', 'የተከፈለ (ETB)')}</p>
                      <p className="text-xl font-black text-green-700">{totalContributions.toLocaleString()}</p>
                    </div>
                    <div className="bg-white border border-orange-100 rounded-xl p-3 shadow-sm">
                      <p className="text-[10px] text-gray-500 font-semibold">{t(lang, 'Payouts (ETB)', 'ክፍያዎች (ETB)')}</p>
                      <p className="text-xl font-black text-orange-700">{totalPayouts.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <p className="font-bold text-gray-900 text-sm mb-2">{t(lang, 'Recent Activity', 'የቅርብ ጊዜ እንቅስቃሴ')}</p>
                    {activity.length === 0 ? (
                      <p className="text-xs text-gray-500">{t(lang, 'No activity yet.', 'እስካሁን እንቅስቃሴ የለም።')}</p>
                    ) : (
                      activity.slice(0, 5).map((act) => (
                        <div key={act.id} className="py-2 border-b border-gray-100 last:border-0">
                          <p className="text-xs font-bold text-gray-800">{act.action}</p>
                          <p className="text-[10px] text-gray-500">{act.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {pendingCount > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-800 font-semibold">
                      {t(lang, `${pendingCount} equb(s) awaiting contribution`, `${pendingCount} Equb መዋጮ ይጠብቃል`)}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-3">
                  <SectionTitle>{t(lang, 'Help Center', 'እርዳታ')}</SectionTitle>
                  <button
                    onClick={() => onSupport('Help Center')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-800 shadow-sm transition-all"
                  >
                    {iconMap.help}
                    {t(lang, 'Help Center', 'ረዳት ማእከል')}
                  </button>
                  <button
                    onClick={() => onSupport('Live Chat')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-800 shadow-sm transition-all"
                  >
                    <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {t(lang, 'Live Chat', 'ቀጥታ ውይይት')}
                  </button>
                  <button
                    onClick={() => onSupport('Report Issue')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-800 shadow-sm transition-all"
                  >
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                      <path d="M12 9v4M12 17h.01" />
                    </svg>
                    {t(lang, 'Report Issue', 'ችግር ሪፖርት')}
                  </button>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-3">
                  <SectionTitle>{t(lang, 'Account Settings', 'የመለያ ቅንብሮች')}</SectionTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        ['information', 'Information', 'መረጃ'],
                        ['notifications', 'Notifications', 'ማሳወቂያዎች'],
                        ['appearance', 'Appearance', 'መልክ'],
                        ['privacy', 'Privacy & Security', 'ግላዊነት እና ደህንነት'],
                      ] as [SettingsSub, string, string][]
                    ).map(([id, en, am]) => (
                      <button
                        key={id}
                        onClick={() => setSettingsSub(id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          settingsSub === id
                            ? 'bg-teal-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {t(lang, en, am)}
                      </button>
                    ))}
                  </div>

                  {settingsSub === 'information' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
                      <p className="font-bold text-gray-900 text-sm">{t(lang, 'Personal Information', 'የግል መረጃ')}</p>
                      <p className="text-xs text-gray-500">
                        {t(lang, 'Update your email and profile details.', 'ኢሜይልዎን እና የመገለጫ ዝርዝሮችዎን ያዘምኑ።')}
                      </p>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t(lang, 'Name', 'ስም')}</span>
                        <span className="font-bold text-gray-900">{user.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t(lang, 'Email', 'ኢሜይል')}</span>
                        <span className="font-bold text-gray-900">{user.email || '—'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t(lang, 'Phone', 'ስልክ')}</span>
                        <span className="font-bold text-gray-900">{user.phone}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t(lang, 'Role', 'ሚና')}</span>
                        <span className="font-bold text-gray-900 capitalize">{user.role}</span>
                      </div>
                    </div>
                  )}

                  {settingsSub === 'notifications' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
                      <p className="font-bold text-gray-900 text-sm">{t(lang, 'Notification Preferences', 'የማሳወቂያ ምርጫዎች')}</p>
                      <p className="text-xs text-gray-500">
                        {t(lang, 'Choose when you want to receive updates.', 'መቼ ማሳወቂያ እንደሚፈልጉ ይምረጡ።')}
                      </p>
                      {['Payment reminders', 'Payout alerts', 'New member joined', 'Weekly summary'].map((label) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700">{t(lang, label, label)}</span>
                          <span className="w-9 h-5 bg-teal-600 rounded-full relative">
                            <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {settingsSub === 'appearance' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
                      <p className="font-bold text-gray-900 text-sm">{t(lang, 'Appearance', 'መልክ')}</p>
                      <p className="text-xs text-gray-500">
                        {t(lang, 'Language and region settings.', 'የቋንቋ እና የክልል ቅንብሮች።')}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => go('language')}
                          className="flex-1 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-all"
                        >
                          {t(lang, 'Language & Region', 'ቋንቋ እና ክልል')}
                        </button>
                        <button className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all">
                          {t(lang, 'Theme', 'ገጽታ')}
                        </button>
                      </div>
                    </div>
                  )}

                  {settingsSub === 'privacy' && (
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-bold text-gray-900 text-sm">{t(lang, 'PIN Protection', 'PIN ጥበቃ')}</p>
                          {locked ? (
                            <Badge color="red">{t(lang, 'Locked', 'ተቆልፏል')}</Badge>
                          ) : (
                            <Badge color="green">{t(lang, 'Active', 'ንቁ')}</Badge>
                          )}
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-900 mb-1">{t(lang, 'PIN attempts remaining', 'የቀሩ PIN ሙከራዎች')}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {Array.from({ length: PinSession.MAX_ATTEMPTS }).map((_, i) => (
                                <span key={i} className={`w-3.5 h-3.5 rounded-full transition-all ${i < remaining ? 'bg-teal-500' : 'bg-gray-200'}`} />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-gray-900">{remaining} / {PinSession.MAX_ATTEMPTS}</span>
                          </div>
                        </div>
                        {locked ? (
                          <p className="text-xs text-red-700">
                            {t(lang, `Account locked. Try again in ${lockSeconds}s`, `መለያ ተቆልፏል። በ${lockSeconds}ሰከንድ በድጋሚ ይሞክሩ`)}
                          </p>
                        ) : (
                          <button
                            onClick={onVerifyPin}
                            className="w-full py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition-all"
                          >
                            {t(lang, 'Verify PIN', 'PIN አረጋግጥ')}
                          </button>
                        )}
                        <div className="mt-3 space-y-1 text-xs text-gray-600">
                          <p className="font-bold text-gray-900">{t(lang, 'How it works', 'እንዴት ይሰራል')}</p>
                          <p>✓ {t(lang, 'Maximum of 3 PIN attempts', 'ቢበዛ 3 PIN ሙከራዎች')}</p>
                          <p>✓ {t(lang, 'Account locks for 5 minutes after 3 failed attempts', 'ከ3 የተሳሳቱ ሙከራዎች በኋላ መለያ ለ5 ደቂቃ ይቆለፋል')}</p>
                          <p>✓ {t(lang, 'Required before withdrawals and payments', 'ከገንዘብ ከማውጣት እና ከክፍያ በፊት ያስፈልጋል')}</p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
                        <p className="font-bold text-gray-900 text-sm">{t(lang, 'Security', 'ደህንነት')}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-semibold">{t(lang, 'Change Password', 'የይለፍ ቃል ቀይር')}</span>
                          <span className="text-teal-600">›</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-semibold">{t(lang, 'Two-Factor Authentication', 'ሁለት-ደረጃ ማረጋገጫ')}</span>
                          <Badge color="gray">Off</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-semibold">{t(lang, 'Sessions', 'ክፍለ ጊዜዎች')}</span>
                          <span className="font-bold text-gray-900">1</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-semibold">{t(lang, 'Connected Accounts', 'የተገናኙ መለያዎች')}</span>
                          <span className="font-bold text-gray-900">0</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-3">
                  <SectionTitle>{t(lang, 'My Profile', 'የእኔ መገለጫ')}</SectionTitle>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 text-white flex items-center justify-center font-black text-xl">
                      {initials || 'M'}
                    </div>
                    <div>
                      <p className="font-black text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email || user.phone}</p>
                      <p className="mt-1 inline-block">
                        <Badge color="green">{t(lang, 'Active Member', 'ንቁ አባል')}</Badge>
                      </p>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
                    <p className="font-bold text-gray-900 text-sm">{t(lang, 'Personal Information', 'የግል መረጃ')}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{t(lang, 'Phone', 'ስልክ')}</span>
                      <span className="font-bold text-gray-900">{user.phone}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{t(lang, 'Email', 'ኢሜይል')}</span>
                      <span className="font-bold text-gray-900">{user.email || '—'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{t(lang, 'Member since', 'አባል ከ')}</span>
                      <span className="font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{t(lang, 'Address', 'አድራሻ')}</span>
                      <span className="font-bold text-gray-900">Addis Ababa, Ethiopia</span>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <p className="font-bold text-gray-900 text-sm mb-2">{t(lang, 'Contribution Progress', 'የመዋጮ እድገት')}</p>
                    {equbs.length === 0 ? (
                      <p className="text-xs text-gray-500">{t(lang, 'No contributions yet.', 'እስካሁን መዋጮ የለም።')}</p>
                    ) : (
                      equbs.map((equb) => (
                        <div key={equb.id} className="mb-3 last:mb-0">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-gray-700">{equb.name}</span>
                            <span className="text-teal-700 font-black">#{equb.position} / {equb.members}</span>
                          </div>
                          <ProgressBar value={equb.members > 0 ? (equb.position / equb.members) * 100 : 0} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-3">
                  <SectionTitle>{t(lang, 'Language & Region', 'ቋንቋ እና ክልል')}</SectionTitle>
                  <p className="text-sm text-gray-500">
                    {t(lang, 'Choose your preferred language.', 'የሚመርጡትን ቋንቋ ይምረጡ።')}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button className={`p-4 rounded-xl border-2 text-left transition-all ${lang === 'en' ? 'border-teal-600 bg-teal-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <p className="text-sm font-black text-gray-900">English</p>
                      <p className="text-[11px] text-gray-500">Default</p>
                    </button>
                    <button className={`p-4 rounded-xl border-2 text-left transition-all ${lang === 'am' ? 'border-teal-600 bg-teal-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <p className="text-sm font-black text-gray-900">አማርኛ</p>
                      <p className="text-[11px] text-gray-500">Amharic</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}