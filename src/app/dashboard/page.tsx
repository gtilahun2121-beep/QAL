'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Language, defaultLanguage } from '@/i18n/config';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { ToastContainer, useToast } from '@/app/components/notifications/Toast';
import MemberDrawer from '@/app/components/dashboard/MemberDrawer';
import PinVerifyModal from '@/app/components/dashboard/PinVerifyModal';
import { equbAPI, walletAPI } from '@/app/services/api';
import {
  DashboardService,
  DashboardState,
  DashboardEqub,
} from '@/app/services/dashboardService';

const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr' },
  { id: 'cbe', name: 'CBE' },
  { id: 'abyssinia', name: 'Abyssinia Bank' },
  { id: 'dashen', name: 'Dashen Bank' },
  { id: 'awash', name: 'Awash Bank' },
  { id: 'nib', name: 'NIB' },
];

const CREATE_CATEGORIES = ['Savings', 'Business', 'Community', 'Education', 'Family'];

const todayISO = (): string => new Date().toISOString().split('T')[0];

const daysUntil = (dateStr: string, now: number): number => {
  const target = new Date(dateStr).getTime();
  if (Number.isNaN(target)) return 0;
  return Math.max(0, Math.ceil((target - now) / 86400000));
};

interface DashboardContentProps {
  uid: string;
  lang: Language;
  setLang: (lang: Language) => void;
  newUser: boolean;
  displayName: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [lang, setLang] = useState<Language>(defaultLanguage);

  if (!isAuthenticated || !user || !user.id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-4">
            {lang === 'en' ? 'Please log in first' : 'በመጀመሪያ ግባ'}
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            {lang === 'en' ? 'Go to Home' : 'ወደ ቤት ሂድ'}
          </Link>
        </div>
      </main>
    );
  }

  const newUser = user.id.includes('user_') || !user.firstName;

  return (
    <DashboardContent
      uid={user.id}
      lang={lang}
      setLang={setLang}
      newUser={newUser}
      displayName={user.firstName || user.phoneNumber || 'Member'}
    />
  );
}

function DashboardContent({ uid, lang, setLang, newUser, displayName }: DashboardContentProps) {
  const router = useRouter();
  const toast = useToast();
  const { signout, user: authUser } = useAuth();

  const [state, setState] = useState<DashboardState>(() => DashboardService.loadState(uid));
  const [now] = useState(() => Date.now());

  // Load the user's real DB-backed dashboard (equbs + wallet balance) on mount.
  useEffect(() => {
    let active = true;
    DashboardService.loadFromApi(uid)
      .then((loaded) => {
        if (active) setState(loaded);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [uid]);

  // Actions that mutate the DB update local cache optimistically, then
  // re-fetch the authoritative API state so balances / lists stay correct.
  const refresh = async () => {
    const loaded = await DashboardService.loadFromApi(uid);
    setState(loaded);
    return loaded;
  };

  // Support deep links like /dashboard?equb=<id> or /dashboard?create=1
  const [selectedEqub, setSelectedEqub] = useState<DashboardEqub | null>(() => {
    try {
      const equbId = new URLSearchParams(window.location.search).get('equb');
      return equbId ? state.equbs.find((e) => e.id === equbId) ?? null : null;
    } catch {
      return null;
    }
  });
  const [showCreate, setShowCreate] = useState<boolean>(() => {
    try {
      return new URLSearchParams(window.location.search).get('create') === '1';
    } catch {
      return false;
    }
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAction, setPinAction] = useState<'withdraw' | 'payment' | null>(null);
  const [pinResult, setPinResult] = useState<'success' | 'error' | 'cancel' | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [supportCategory, setSupportCategory] = useState('Help Center');

  const handleDrawerOpen = () => setShowDrawer(true);
  const handleDrawerClose = () => setShowDrawer(false);

  const handlePinVerify = (action: 'withdraw' | 'payment') => {
    setPinAction(action);
    setPinResult(null);
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setPinResult('success');
    setShowPinModal(false);
    if (pinAction === 'withdraw') {
      setShowWithdraw(true);
    } else if (pinAction === 'payment') {
      setShowPayment(true);
    }
  };

  const handlePinCancel = () => {
    setPinResult('cancel');
    setShowPinModal(false);
  };

  // Forms
  const [createForm, setCreateForm] = useState({
    name: '',
    category: 'Savings',
    amount: '',
    members: '',
    description: '',
  });
  const [paymentForm, setPaymentForm] = useState({
    equbId: '',
    amount: '',
    method: 'telebirr',
  });
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawForm, setWithdrawForm] = useState({ method: 'telebirr', phone: '', amount: '' });
  const [invitePhones, setInvitePhones] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  const dashboard = state;
  const isNewUser = newUser && dashboard.startedSteps.length < 5;

  const persist = (next: DashboardState) => {
    DashboardService.persist(uid, next);
    setState(next);
  };

  // ── Actions ─────────────────────────────────────────────────────────────

  const handleSignOut = () => {
    signout();
    router.push('/');
  };

  const handleDeposit = async () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      toast.error('Invalid Amount', 'Please enter a valid deposit amount.');
      return;
    }
    try {
      const result = await walletAPI.deposit(amount);
      await refresh();
      setShowDeposit(false);
      setDepositAmount('');
      toast.success(
        'Deposit Successful',
        `${amount.toLocaleString()} ETB added to your wallet.`
      );
    } catch (error: any) {
      toast.error('Deposit Failed', error?.data?.message || error?.message || 'Could not deposit funds.');
    }
  };

  const handleWithdraw = async () => {
    if (pinAction === 'withdraw') {
      if (pinResult === 'success') {
        // PIN was already verified earlier. Now proceed.
      }
    }
    const amount = Number(withdrawForm.amount);
    if (!amount || amount <= 0) {
      toast.error('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }
    if (amount > dashboard.walletBalance) {
      toast.error('Insufficient Balance', 'You do not have enough funds to withdraw.');
      return;
    }
    if (!withdrawForm.phone.trim()) {
      toast.error('Phone Required', 'Enter the phone number to withdraw to.');
      return;
    }
    try {
      await walletAPI.withdraw(amount);
      await refresh();
      setShowWithdraw(false);
      setWithdrawForm({ method: 'telebirr', phone: '', amount: '' });
      toast.success(
        'Withdrawal Successful',
        `${amount.toLocaleString()} ETB sent to ${withdrawForm.phone}.`
      );
    } catch (error: any) {
      toast.error('Withdrawal Failed', error?.data?.message || error?.message || 'Could not withdraw funds.');
    }
  };

  const openPaymentFor = (equb: DashboardEqub) => {
    setPaymentForm({ equbId: equb.id, amount: String(equb.contribution), method: 'telebirr' });
    setShowPayment(true);
  };

  const handlePayment = async () => {
    const equb = dashboard.equbs.find((e) => e.id === paymentForm.equbId);
    const amount = Number(paymentForm.amount);
    if (!equb) {
      toast.error('Select an Equb', 'Choose which Equb you want to pay.');
      return;
    }
    if (!amount || amount <= 0 || amount < equb.contribution) {
      toast.error('Invalid Amount', `Payment must be at least ETB ${equb.contribution}.`);
      return;
    }
    if (amount > dashboard.walletBalance) {
      toast.error('Insufficient Balance', 'Please deposit funds before making a payment.');
      return;
    }
    try {
      // Fully DB-backed payment: debit the wallet and record the contribution.
      await walletAPI.withdraw(amount);
      await equbAPI.contribute(equb.id, {
        amount,
        paymentMethod: paymentForm.method === 'telebirr' ? 'telebirr' : 'wallet',
      });
      await refresh();
      setShowPayment(false);
      toast.success(
        'Payment Successful',
        `${amount.toLocaleString()} ETB paid to ${equb.name}.`
      );
    } catch (error: any) {
      toast.error('Payment Failed', error?.data?.message || error?.message || 'Could not record payment.');
    }
  };

  const handleCreateEqub = async () => {
    const name = createForm.name.trim();
    const amount = Number(createForm.amount);
    const members = Number(createForm.members);
    if (!name) {
      toast.error('Name Required', 'Please give your Equb a name.');
      return;
    }
    if (!amount || amount <= 0) {
      toast.error('Invalid Contribution', 'Please enter a valid monthly contribution.');
      return;
    }
    if (!members || members < 2) {
      toast.error('Invalid Members', 'An Equb needs at least 2 members.');
      return;
    }
    try {
      const result = await equbAPI.create({
        name,
        category: createForm.category,
        contributionAmount: amount,
        totalMembers: members,
        description: createForm.description.trim() || 'A new Equb circle.',
        startDate: todayISO(),
      });
      const equbId = result?.equbId || result?.equb?.id;
      if (equbId) {
        // The host's first contribution is recorded immediately.
        await equbAPI.contribute(equbId, {
          amount,
          paymentMethod: 'wallet',
        }).catch(() => {});
      }
      await refresh();
      setShowCreate(false);
      setCreateForm({ name: '', category: 'Savings', amount: '', members: '', description: '' });
      toast.success('Equb Created', `${name} is now active.`);
    } catch (error: any) {
      toast.error('Creation Failed', error?.data?.message || error?.message || 'Could not create the Equb.');
    }
  };

  const handleInvite = async () => {
    const phones = invitePhones
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (phones.length === 0) {
      toast.error('No Phone Numbers', 'Enter at least one phone number to invite.');
      return;
    }
    // Pick the currently-viewed equb, or the first one if none selected.
    const targetEqub = selectedEqub ?? dashboard.equbs[0];
    if (!targetEqub) {
      toast.error('No Equbs', 'Create or join an Equb before inviting friends.');
      return;
    }
    try {
      await equbAPI.inviteMembers(targetEqub.id, phones);
      await refresh();
      setShowInvite(false);
      setInvitePhones('');
      toast.success('Invites Sent', `Invitation sent to ${phones.join(', ')}.`);
    } catch (error: any) {
      toast.error('Invite Failed', error?.data?.message || error?.message || 'Could not send invites.');
    }
  };

  const handleSupport = () => {
    if (!supportMessage.trim()) {
      toast.error('Message Required', 'Please describe how we can help you.');
      return;
    }
    let next = dashboard;
    next = DashboardService.addActivity(next, {
      action: `${supportCategory}: ${supportMessage}`,
    });
    persist(next);
    setShowSupport(false);
    setSupportMessage('');
    toast.success('Message Sent', 'Our team will get back to you shortly.');
  };

  const markStep = (stepId: string) => {
    if (dashboard.startedSteps.includes(stepId)) return;
    persist({ ...dashboard, startedSteps: [...dashboard.startedSteps, stepId] });
  };

  const startedSteps = [
    {
      id: 'fayda',
      label: lang === 'en' ? 'Fayda Verified' : 'Fayda ታገዙ',
      onClick: () => {
        markStep('fayda');
        toast.success('Step Complete', 'Your Fayda ID is verified.');
      },
    },
    {
      id: 'phone',
      label: lang === 'en' ? 'Phone Verified' : 'ስልክ ታገዙ',
      onClick: () => {
        markStep('phone');
        toast.success('Step Complete', 'Your phone number is verified.');
      },
    },
    {
      id: 'join',
      label: lang === 'en' ? 'Join First Equb' : 'መጀመሪያ Equb ተጠምዱ',
      onClick: () => router.push('/join-equb'),
    },
    {
      id: 'payment',
      label: lang === 'en' ? 'Add Payment Method' : 'ክፍያ ዘዴ ጨምር',
      onClick: () => {
        markStep('payment');
        setShowWithdraw(true);
      },
    },
    {
      id: 'learn',
      label: lang === 'en' ? 'Learn How Equb Works' : 'Equb መሠራት ይወቁ',
      onClick: () => router.push('/docs'),
    },
  ];

  const activeCount = dashboard.equbs.length;
  const monthlyCommitment = dashboard.equbs.reduce((sum, e) => sum + e.contribution, 0);
  const nextPayment = dashboard.equbs
    .map((e) => ({ equb: e, days: daysUntil(e.nextPaymentDate, now) }))
    .sort((a, b) => a.days - b.days)[0];
  const nextPayoutLabel =
    dashboard.equbs.find((e) => e.status === 'active')?.nextPayout || '—';

  const t = (en: string, am: string) => (lang === 'en' ? en : am);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header
        lang={lang}
        onLanguageChange={(newLang) => setLang(newLang)}
        isAuthenticated={true}
      />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleDrawerOpen}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-teal-700 to-teal-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                aria-label={lang === 'en' ? 'Open member menu' : 'የአባል ምናሌ ክፈት'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">
                  {lang === 'en' ? 'Menu' : 'ምናሌ'}
                </span>
              </button>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 break-words">
                {lang === 'en' ? 'Welcome, ' : 'ደህና መጡ, '}
                {displayName} 
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
            >
              {lang === 'en' ? 'Sign Out' : 'ወጣ'}
            </button>
          </div>
          <p className="text-gray-600">
            {lang === 'en'
              ? "Here's your Equb dashboard. Stay updated with your group savings."
              : 'ይህ የእርስዎ Equb ዳሽቦርድ ነው።'}
          </p>
        </div>

        {/* Getting Started for New Users */}
        {isNewUser && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-bold text-blue-900 mb-4">
              {lang === 'en' ? ' Getting Started' : ' ለመጀመር'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {startedSteps.map((step) => {
                const done = dashboard.startedSteps.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={step.onClick}
                    disabled={done}
                    className={`bg-white p-4 rounded-lg text-center hover:shadow-lg transition-all cursor-pointer ${
                      done ? 'opacity-60 border-2 border-blue-300' : ''
                    }`}
                  >
                    <p className="font-bold text-sm text-blue-900">{step.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-100 border border-blue-300 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-800 font-bold text-sm">
                {lang === 'en' ? 'Wallet Balance' : 'ዋሊት ሚዛን'}
              </p>
            </div>
            <p className="text-3xl font-black text-blue-950">
              ETB {dashboard.walletBalance.toLocaleString()}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setShowDeposit(true)}
                className="flex-1 px-3 py-1.5 bg-blue-700 text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition-all"
              >
                 Deposit
              </button>
              <button
                onClick={() => setShowWithdraw(true)}
                className="flex-1 px-3 py-1.5 border-2 border-blue-700 text-blue-800 text-xs font-bold rounded-lg hover:bg-blue-700 hover:text-white transition-all"
              >
                 Withdraw
              </button>
            </div>
          </div>

          {/* Active Equbs */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-700 font-bold text-sm">
                {lang === 'en' ? 'Active Equbs' : 'ንቅናቄ Equbs'}
              </p>
            </div>
            <p className="text-3xl font-black text-blue-900">{activeCount}</p>
            <p className="text-xs text-blue-700 mt-2">
              {lang === 'en' ? 'Groups you\'re part of' : 'ነዋ ክፍሎች'}
            </p>
          </div>

          {/* Next Payment */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-700 font-bold text-sm">
                {lang === 'en' ? 'Next Payment' : 'ቀጣይ ክፍያ'}
              </p>
            </div>
            <p className="text-3xl font-black text-orange-900">
              {nextPayment ? (nextPayment.days === 0 ? 'Today' : `${nextPayment.days} days`) : '—'}
            </p>
            <p className="text-xs text-orange-700 mt-2">
              {nextPayment?.equb.name || (lang === 'en' ? 'No equb payments' : 'ክፍያ የለም')}
            </p>
          </div>

          {/* Next Payout */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-700 font-bold text-sm">
                {lang === 'en' ? 'Next Payout' : 'ቀጣይ ክፍሌ'}
              </p>
            </div>
            <p className="text-3xl font-black text-purple-900">{nextPayoutLabel}</p>
            <p className="text-xs text-purple-700 mt-2">
              {lang === 'en' ? 'When you receive payout' : 'ክፍሌ የሚገኙበት ጊዜ'}
            </p>
          </div>
        </div>

        {/* Three Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* My Equbs */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                   {lang === 'en' ? 'My Equbs' : 'የእኔ Equbs'}
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  {t('Monthly commitment', 'ወርሃዊ ግዴታ')}: ETB {monthlyCommitment.toLocaleString()}
                </span>
              </div>

              {dashboard.equbs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    {lang === 'en' ? 'You haven\'t joined any Equb yet' : 'አሁንም Equb ተጠምዱ አልነበሩም'}
                  </p>
                  <button
                    onClick={() => router.push('/join-equb')}
                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                  >
                    {lang === 'en' ? 'Join an Equb' : 'Equb ተጠምዱ'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboard.equbs.map((equb) => (
                    <div
                      key={equb.id}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{equb.name}</h3>
                          <p className="text-sm text-gray-600">
                            {equb.members} {lang === 'en' ? 'members' : 'አባላት'}
                            {equb.category ? ` · ${equb.category}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {equb.manager && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full">
                               Manager
                            </span>
                          )}
                          <span className="px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs rounded-full">
                             {lang === 'en' ? 'Active' : 'ንቅናቄ'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">
                            {lang === 'en' ? 'Your Position' : 'ቦታ'}
                          </p>
                          <p className="text-xl font-bold text-gray-900">#{equb.position}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">
                            {lang === 'en' ? 'Contribution' : 'አስተዋጽዖ'}
                          </p>
                          <p className="text-xl font-bold text-gray-900">ETB {equb.contribution}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">
                            {lang === 'en' ? 'Next Payment' : 'ቀጣይ ክፍያ'}
                          </p>
                          <p className="text-xl font-bold text-orange-600">
                            {daysUntil(equb.nextPaymentDate, now) === 0
                              ? t('Today', 'ዛሬ')
                              : `${daysUntil(equb.nextPaymentDate, now)}d`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">
                            {lang === 'en' ? 'Your Payout' : 'ክፍሌ'}
                          </p>
                          <p className="text-xl font-bold text-purple-600">{equb.nextPayout}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setSelectedEqub(equb)}
                          className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all text-sm"
                        >
                          {lang === 'en' ? 'View Details' : 'ዝርዝር ይመልከቱ'}
                        </button>
                        <button
                          onClick={() => openPaymentFor(equb)}
                          className="px-4 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-all text-sm"
                        >
                           {lang === 'en' ? 'Make Payment' : 'ክፍያ ክፍል'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 {lang === 'en' ? 'Quick Actions' : 'ፈጣን ድርጊቶች'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/join-equb')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-bold hover:shadow-lg transition-all text-center"
                >
                   {lang === 'en' ? 'Join an Equb' : 'Equb ተጠምዱ'}
                </button>
                <button
                  onClick={() => setShowCreate(true)}
                  className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-6 py-4 rounded-lg font-bold hover:shadow-lg transition-all text-center"
                >
                   {lang === 'en' ? 'Create an Equb' : 'Equb ፍጠር'}
                </button>
                <button
                  onClick={() => {
                    if (dashboard.equbs.length > 0) {
                      openPaymentFor(dashboard.equbs[0]);
                    } else {
                      toast.info('No Equbs', 'Join or create an Equb first.');
                    }
                  }}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg font-bold hover:shadow-lg transition-all text-center"
                >
                   {lang === 'en' ? 'Make Payment' : 'ክፍያ ክፍል'}
                </button>
                <button
                  onClick={() => setShowInvite(true)}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 rounded-lg font-bold hover:shadow-lg transition-all text-center"
                >
                   {lang === 'en' ? 'Invite Friends' : 'ጓደኞቹን ጋብዝ'}
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Notifications & Activity */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                 {lang === 'en' ? 'Notifications' : 'ማስታወቂያዎች'}
              </h2>
              <div className="space-y-3">
                {dashboard.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{notif.title}</p>
                        <p className="text-xs text-gray-600">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                 {lang === 'en' ? 'Recent Activity' : 'ቅርብ ጊዜ ሕይወት'}
              </h2>
              <div className="space-y-3">
                {dashboard.activity.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {lang === 'en' ? 'Need Help?' : 'እርዳታ ያስፈልገ?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/docs')}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
            >
               {lang === 'en' ? 'Help Center' : 'ረዳት ማእከል'}
            </button>
            <button
              onClick={() => {
                setSupportCategory(lang === 'en' ? 'Live Chat' : 'ቀጥታ ውይይት');
                setShowSupport(true);
              }}
              className="px-6 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-all"
            >
               {lang === 'en' ? 'Live Chat' : 'ቀጥታ ውይይት'}
            </button>
            <button
              onClick={() => {
                setSupportCategory(lang === 'en' ? 'Report Issue' : 'ችግር ሪፖርት');
                setShowSupport(true);
              }}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all"
            >
               {lang === 'en' ? 'Report Issue' : 'ችግር ሪፖርት'}
            </button>
          </div>
        </div>
      </div>

      <Footer lang={lang} />

      {/* ── Equb Detail Modal ─────────────────────────────────────────────── */}
      {selectedEqub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEqub(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-black text-gray-900">{selectedEqub.name}</h3>
              <button onClick={() => setSelectedEqub(null)} className="text-2xl text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            {selectedEqub.description && (
              <p className="text-sm text-gray-600 mb-4">{selectedEqub.description}</p>
            )}
            <div className="space-y-3 text-sm">
              {[
                ['Members', String(selectedEqub.members)],
                ['Your Position', `#${selectedEqub.position}`],
                ['Monthly Contribution', `ETB ${selectedEqub.contribution}`],
                ['Next Payment', selectedEqub.nextPaymentDate],
                ['Next Payout', selectedEqub.nextPayout],
                ['Category', selectedEqub.category || '—'],
                ['Role', selectedEqub.manager ? 'Manager' : 'Member'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600 font-semibold">{label}</span>
                  <span className="font-bold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => {
                  openPaymentFor(selectedEqub);
                }}
                className="px-4 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-all"
              >
                 Make Payment
              </button>
              <button
                onClick={() => {
                  setShowInvite(true);
                }}
                className="px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all"
              >
                 Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Equb Modal ─────────────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                 {lang === 'en' ? 'Create an Equb' : 'Equb ፍጠር'}
              </h3>
              <button onClick={() => setShowCreate(false)} className="text-2xl text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Equb Name</label>
                <input
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Neighborhood Savings"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Contribution (ETB)</label>
                  <input
                    type="number"
                    value={createForm.amount}
                    onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                    placeholder="500"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Number of Members</label>
                  <input
                    type="number"
                    value={createForm.members}
                    onChange={(e) => setCreateForm({ ...createForm, members: e.target.value })}
                    placeholder="12"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                >
                  {CREATE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="What is this Equb about?"
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>
              <p className="text-xs text-gray-500">
                {t('Your first contribution will be deducted from your wallet.', 'የመጀመሪያ መዋጮዎ ከዋሊትዎ ይቀነሳል።')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  {lang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  onClick={handleCreateEqub}
                  className="flex-1 px-4 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
                >
                  {lang === 'en' ? 'Create Equb' : 'Equb ፍጠር'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Make Payment Modal ────────────────────────────────────────────── */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPayment(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                 {lang === 'en' ? 'Make Payment' : 'ክፍያ ክፍል'}
              </h3>
              <button onClick={() => setShowPayment(false)} className="text-2xl text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Equb</label>
                <select
                  value={paymentForm.equbId}
                  onChange={(e) => {
                    const eq = dashboard.equbs.find((x) => x.id === e.target.value);
                    setPaymentForm({
                      ...paymentForm,
                      equbId: e.target.value,
                      amount: eq ? String(eq.contribution) : paymentForm.amount,
                    });
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                >
                  <option value="">{lang === 'en' ? 'Select an Equb' : 'Equb ይምረጡ'}</option>
                  {dashboard.equbs.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} — ETB {eq.contribution}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount (ETB)</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PAYMENT_METHODS.slice(0, 6).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentForm({ ...paymentForm, method: m.id })}
                      className={`p-2 rounded-lg border-2 transition-all text-center ${
                        paymentForm.method === m.id
                          ? 'border-[#16357a] bg-blue-100 font-bold'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-[11px] font-semibold">{m.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-600">Available</span>
                <span className="font-black text-blue-800">
                  ETB {dashboard.walletBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  {lang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 px-4 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
                >
                  {lang === 'en' ? 'Pay Now' : 'ክፈል'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Deposit Modal ─────────────────────────────────────────────────── */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeposit(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                 {lang === 'en' ? 'Deposit Funds' : 'ተወገዱ'}
              </h3>
              <button onClick={() => setShowDeposit(false)} className="text-2xl text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount (ETB)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeposit(false);
                    setDepositAmount('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  {lang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  onClick={handleDeposit}
                  className="flex-1 px-4 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
                >
                  {lang === 'en' ? 'Deposit' : 'ተወገዱ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Withdraw Modal ────────────────────────────────────────────────── */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowWithdraw(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                 {lang === 'en' ? 'Withdraw Funds' : 'ዘግቡ'}
              </h3>
              <button onClick={() => setShowWithdraw(false)} className="text-2xl text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  {lang === 'en' ? 'Payment Method' : 'ክፍያ ዘዴ'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setWithdrawForm({ ...withdrawForm, method: m.id })}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        withdrawForm.method === m.id
                          ? 'border-[#16357a] bg-blue-100 font-bold'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-xs font-semibold">{m.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {withdrawForm.method === 'telebirr' ? 'Telebirr Phone' : 'Account Phone Number'}
                </label>
                <input
                  type="tel"
                  value={withdrawForm.phone}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, phone: e.target.value })}
                  placeholder="+2519xxxxxxxx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount (ETB)</label>
                <p className="text-xs text-gray-500 mb-2">
                  Available: ETB {dashboard.walletBalance.toLocaleString()}
                </p>
                <input
                  type="number"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowWithdraw(false);
                    setWithdrawForm({ method: 'telebirr', phone: '', amount: '' });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  {lang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
                >
                  {lang === 'en' ? 'Withdraw' : 'ዘግቡ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Invite Friends Modal ──────────────────────────────────────────── */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInvite(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                 {lang === 'en' ? 'Invite Friends' : 'ጓደኞቹን ጋብዝ'}
              </h3>
              <button onClick={() => setShowInvite(false)} className="text-2xl text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {lang === 'en' ? 'Phone Numbers (comma separated)' : 'ስልክ ቁጥሮች (በነጠላ ሰረዝ)'}
                </label>
                <textarea
                  value={invitePhones}
                  onChange={(e) => setInvitePhones(e.target.value)}
                  placeholder="+251911111111, +251922222222"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInvite(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  {lang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  onClick={handleInvite}
                  className="flex-1 px-4 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
                >
                  {lang === 'en' ? 'Send Invites' : 'ጋብዝ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Support Modal ─────────────────────────────────────────────────── */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSupport(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">{supportCategory}</h3>
              <button onClick={() => setShowSupport(false)} className="text-2xl text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {lang === 'en' ? 'How can we help?' : 'እንዴት መርዳት እንችላለን?'}
                </label>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  rows={4}
                  placeholder={lang === 'en' ? 'Type your message...' : 'መልእክትዎን ይጻፉ...'}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSupport(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  {lang === 'en' ? 'Cancel' : 'ሰርዝ'}
                </button>
                <button
                  onClick={handleSupport}
                  className="flex-1 px-4 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
                >
                  {lang === 'en' ? 'Send' : 'ላክ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

      {/* ── Member Drawer ─────────────────────────────────────────────────── */}
      <MemberDrawer
        open={showDrawer}
        lang={lang}
        user={{
          name: authUser?.firstName || displayName,
          phone: authUser?.phoneNumber || '—',
          role: authUser?.role || 'member',
          email: authUser?.email || undefined,
        }}
        userId={uid}
        walletBalance={dashboard.walletBalance}
        equbs={dashboard.equbs}
        transactions={dashboard.transactions}
        notifications={dashboard.notifications}
        activity={dashboard.activity}
        onClose={handleDrawerClose}
        onDeposit={() => setShowDeposit(true)}
        onWithdraw={() => setShowWithdraw(true)}
        onMakePayment={(equb) => openPaymentFor(equb)}
        onVerifyPin={() => handlePinVerify('withdraw')}
        onSupport={(category) => {
          setSupportCategory(category);
          setShowSupport(true);
        }}
        onSignOut={handleSignOut}
      />

      {/* ── PIN Verify Modal ─────────────────────────────────────────────── */}
      <PinVerifyModal
        open={showPinModal}
        userId={uid}
        phoneNumber={authUser?.phoneNumber || ''}
        lang={lang}
        title={
          lang === 'en'
            ? 'Confirm Your PIN'
            : 'PINዎን ያረጋግጡ'
        }
        description={
          pinAction === 'payment'
            ? lang === 'en'
              ? 'Enter your PIN to process this payment.'
              : 'ይህን ክፍያ ለማከናወን PINዎን ያስገቡ።'
            : lang === 'en'
              ? 'Enter your PIN to authorize this withdrawal.'
              : 'ይህን ገንዘብ ማውጣት ለማፍቀድ PINዎን ያስገቡ።'
        }
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
      />
    </main>
  );
}
