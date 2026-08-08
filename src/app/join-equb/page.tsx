'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Language, defaultLanguage } from '@/i18n/config';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { ToastContainer, useToast } from '@/app/components/notifications/Toast';
import {
  DashboardService,
  DashboardState,
  DashboardEqub,
  AVAILABLE_EQUBS,
  makeId,
} from '@/app/services/dashboardService';

const todayISO = (): string => new Date().toISOString().split('T')[0];
const inDays = (days: number): string =>
  new Date(Date.now() + days * 86400000).toISOString().split('T')[0];

interface JoinContentProps {
  uid: string;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function JoinEqubPage() {
  const { user, isAuthenticated } = useAuth();
  const [lang, setLang] = useState<Language>(defaultLanguage);

  if (!isAuthenticated || !user || !user.id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-bold">{lang === 'en' ? 'Please log in' : 'ግባ'}</p>
      </main>
    );
  }

  return <JoinContent uid={user.id} lang={lang} setLang={setLang} />;
}

function JoinContent({ uid, lang, setLang }: JoinContentProps) {
  const router = useRouter();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [state, setState] = useState<DashboardState>(() => DashboardService.loadState(uid));

  const dashboard = state;
  const joinedNames = new Set(dashboard.equbs.map((e) => e.name));

  const categories = Array.from(new Set(AVAILABLE_EQUBS.map((e) => e.category)));

  const filtered = AVAILABLE_EQUBS.filter((equb) => {
    const matchesSearch =
      !search || equb.name.toLowerCase().includes(search.toLowerCase());
    const matchesSize =
      sizeFilter === 'all' ||
      (sizeFilter === '5-10' && equb.size >= 5 && equb.size <= 10) ||
      (sizeFilter === '10-20' && equb.size >= 10 && equb.size <= 20) ||
      (sizeFilter === '20+' && equb.size > 20);
    const matchesCategory = categoryFilter === 'all' || equb.category === categoryFilter;
    return matchesSearch && matchesSize && matchesCategory;
  });

  const handleJoin = (name: string) => {
    const available = AVAILABLE_EQUBS.find((e) => e.name === name);
    if (!available) return;
    if (available.openSlots === 0) return;
    if (joinedNames.has(name)) {
      toast.info('Already Joined', `You are already a member of ${name}.`);
      return;
    }
    if (available.contribution > dashboard.walletBalance) {
      toast.error('Insufficient Balance', 'Please add funds to your wallet before joining.');
      return;
    }

    const newEqub: DashboardEqub = {
      id: `equb_${makeId()}_${name.replace(/\s+/g, '_').toLowerCase()}`,
      name: available.name,
      members: available.size,
      position: available.size - available.openSlots + 1,
      contribution: available.contribution,
      nextPaymentDate: inDays(30),
      nextPayout: `${Math.max(1, Math.ceil(available.durationMonths / 2))} months`,
      status: 'active',
      category: available.category,
      description: available.description,
    };

    let next: DashboardState = {
      ...dashboard,
      walletBalance: dashboard.walletBalance - available.contribution,
      equbs: [newEqub, ...dashboard.equbs],
    };
    next = DashboardService.addTransaction(next, {
      type: 'Payment',
      equb: available.name,
      amount: -available.contribution,
      date: todayISO(),
      status: 'Completed',
    });
    next = DashboardService.addNotification(next, {
      title: `Joined ${available.name}`,
      type: 'member',
    });
    next = DashboardService.addActivity(next, {
      action: `Joined ${available.name} · first contribution paid`,
    });
    DashboardService.persist(uid, next);
    setState(next);
    toast.success('Joined!', `You joined ${available.name}. First contribution of ETB ${available.contribution} paid.`);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} isAuthenticated={true} />

      <div className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-black text-gray-900">
              {lang === 'en' ? 'Join an Equb ' : 'Equb ይቀላቀሉ '}
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-[#0d7e4d] text-white font-bold rounded-lg hover:bg-[#0a5c38] transition-all"
            >
              ← {lang === 'en' ? 'Back to Dashboard' : 'ወደ ዳሽቦርድ'}
            </button>
          </div>
          <p className="text-gray-600 mb-8">
            {lang === 'en' ? 'Browse available Equb groups and join one that fits your needs' : 'Equb ቡድን ይመልከቱ'}
          </p>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {lang === 'en' ? 'Search' : 'ፈልግ'}
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={lang === 'en' ? 'Search Equbs...' : 'ፈልግ...'}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {lang === 'en' ? 'Size' : 'መጠን'}
                </label>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                >
                  <option value="all">{lang === 'en' ? 'All Sizes' : 'ሁሉ'}</option>
                  <option value="5-10">5-10 members</option>
                  <option value="10-20">10-20 members</option>
                  <option value="20+">20+ members</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {lang === 'en' ? 'Category' : 'ምድብ'}
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                >
                  <option value="all">{lang === 'en' ? 'All Categories' : 'ሁሉ'}</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setSearch('');
                  setSizeFilter('all');
                  setCategoryFilter('all');
                }}
                className="bg-gray-200 text-gray-700 font-bold px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                ✕ {lang === 'en' ? 'Clear' : 'አጥፋ'}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                {filtered.length} {lang === 'en' ? 'Equbs found' : 'Equbs ተገኝተዋል'}
              </p>
              <p className="text-xs text-gray-400">
                {lang === 'en' ? 'Wallet balance' : 'ዋሊት'}: ETB {dashboard.walletBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Equb Listings */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-lg font-bold text-gray-800 mb-2">
                {lang === 'en' ? 'No Equbs match your search' : 'ምንም Equbs አልተገኙም'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {lang === 'en' ? 'Try adjusting your filters.' : 'ማጣሪያዎችን ያስተካክሉ።'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((equb) => {
                const joined = joinedNames.has(equb.name);
                const full = equb.openSlots === 0;
                return (
                  <div key={equb.name} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-[#0d7e4d]">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{equb.name}</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full">
                        {equb.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">{equb.description}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{lang === 'en' ? 'Members' : 'አባሎች'}</span>
                        <span className="font-bold">{equb.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{lang === 'en' ? 'Monthly Contribution' : 'ወር መዋጮ'}</span>
                        <span className="font-bold text-[#0d7e4d]">ETB {equb.contribution.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{lang === 'en' ? 'Duration' : 'ጊዜ'}</span>
                        <span className="font-bold">{equb.durationMonths} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{lang === 'en' ? 'Open Slots' : 'ክፍት ቦታ'}</span>
                        <span className={`font-bold ${full ? 'text-red-600' : 'text-green-600'}`}>
                          {equb.openSlots}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoin(equb.name)}
                      disabled={full || joined}
                      className={`w-full font-bold py-2 rounded-lg transition-all ${
                        joined
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : full
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-[#0d7e4d] text-white hover:bg-[#0a5c38]'
                      }`}
                    >
                      {joined
                        ? '✓ Joined'
                        : full
                        ? (lang === 'en' ? 'Full' : 'ሙላ')
                        : (lang === 'en' ? 'Join Now' : 'ተቀላቀል')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer lang={lang} />
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </main>
  );
}
