'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Language, defaultLanguage } from '@/i18n/config';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { ToastContainer, useToast } from '@/app/components/notifications/Toast';
import { walletAPI } from '@/app/services/api';
import { DashboardService, DashboardState } from '@/app/services/dashboardService';

const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr', },
  { id: 'cbe', name: 'CBE', },
  { id: 'abyssinia', name: 'Abyssinia Bank', },
  { id: 'dashen', name: 'Dashen Bank', },
  { id: 'awash', name: 'Awash Bank', },
  { id: 'nib', name: 'NIB', },
];

interface WalletContentProps {
  uid: string;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function WalletPage() {
  const { user, isAuthenticated } = useAuth();
  const [lang, setLang] = useState<Language>(defaultLanguage);

  if (!isAuthenticated || !user || !user.id) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold">{lang === 'en' ? 'Please log in' : 'ግባ'}</p>
      </main>
    );
  }

  return <WalletContent uid={user.id} lang={lang} setLang={setLang} />;
}

function WalletContent({ uid, lang, setLang }: WalletContentProps) {
  const router = useRouter();
  const toast = useToast();

  const [state, setState] = useState<DashboardState>(() => DashboardService.loadState(uid));
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('telebirr');
  const [phoneNumber, setPhoneNumber] = useState('');

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

  const refresh = async () => {
    const loaded = await DashboardService.loadFromApi(uid);
    setState(loaded);
    return loaded;
  };

  const dashboard = state;
  const balance = dashboard.walletBalance;

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!depositAmount || amount <= 0) {
      toast.error('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    try {
      await walletAPI.deposit(amount);
      await refresh();
      setShowDepositModal(false);
      setDepositAmount('');
      toast.success('Deposit Successful', `${amount.toLocaleString()} ETB added to your wallet.`);
    } catch (error: any) {
      toast.error('Deposit Failed', error?.data?.message || error?.message || 'Could not deposit funds.');
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || amount <= 0) {
      toast.error('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (amount > balance) {
      toast.error('Insufficient Balance', 'You do not have enough funds.');
      return;
    }
    if (!phoneNumber) {
      toast.error('Phone Required', 'Please enter phone number.');
      return;
    }

    try {
      await walletAPI.withdraw(amount);
      await refresh();
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setPhoneNumber('');
      setSelectedPaymentMethod('telebirr');
      toast.success('Withdrawal Successful', `${amount.toLocaleString()} ETB sent to ${phoneNumber}.`);
    } catch (error: any) {
      toast.error('Withdrawal Failed', error?.data?.message || error?.message || 'Could not withdraw funds.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} isAuthenticated={true} />

      <div className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              {lang === 'en' ? 'Wallet ' : 'ዋሊት '}
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto px-4 py-2 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
            >
              ← {lang === 'en' ? 'Back to Dashboard' : 'ወደ ዳሽቦርድ'}
            </button>
          </div>

          {/* Wallet Balance */}
          <div className="bg-gradient-to-r from-[#16357a] to-[#d4af37] text-white rounded-2xl shadow-lg p-8 mb-8">
            <p className="text-sm opacity-90">{lang === 'en' ? 'Current Balance' : 'አሁን ሚዛን'}</p>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 break-words">
              ETB {balance.toLocaleString()}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowDepositModal(true)}
                className="bg-white text-[#16357a] font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                {lang === 'en' ? 'Deposit' : 'ተወገዱ'}
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="bg-white/20 text-white font-bold px-6 py-2 rounded-lg hover:bg-white/30 transition-all"
              >
                {lang === 'en' ? 'Withdraw' : 'ዘግቡ'}
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {lang === 'en' ? 'Transaction History' : 'ተግባር ታሪክ'}
            </h2>
            {dashboard.transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {lang === 'en' ? 'No transactions yet' : 'ምንም ግብይቶች የሉም'}
              </p>
            ) : (
              <div className="space-y-4">
                {dashboard.transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0">
                    <div>
                      <p className="font-bold text-gray-900">{txn.type}: {txn.equb}</p>
                      <p className="text-sm text-gray-500">{txn.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${txn.amount < 0 ? 'text-red-600' : 'text-blue-700'}`}>
                        {txn.amount < 0 ? '-' : '+'}ETB {Math.abs(txn.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-700">✓ {txn.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Deposit Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (ETB)</label>
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
                    setShowDepositModal(false);
                    setDepositAmount('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeposit}
                  className="flex-1 px-4 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
                >
                  Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Withdraw Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        selectedPaymentMethod === method.id
                          ? 'border-[#16357a] bg-blue-100 font-bold'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-xs font-semibold">{method.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedPaymentMethod === 'telebirr' ? 'Telebirr Phone' : 'Account Phone Number'}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+2519xxxxxxxx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (ETB)</label>
                <p className="text-xs text-gray-500 mb-2">Available: ETB {balance.toLocaleString()}</p>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount('');
                    setPhoneNumber('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer lang={lang} />
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </main>
  );
}
