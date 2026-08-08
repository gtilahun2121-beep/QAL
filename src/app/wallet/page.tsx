'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Language, defaultLanguage } from '@/i18n/config';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { ToastContainer, useToast } from '@/app/components/notifications/Toast';
import { DashboardService, DashboardState } from '@/app/services/dashboardService';

const todayISO = (): string => new Date().toISOString().split('T')[0];

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

  const dashboard = state;
  const balance = dashboard.walletBalance;

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!depositAmount || amount <= 0) {
      toast.error('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    let next = { ...dashboard, walletBalance: balance + amount };
    next = DashboardService.addTransaction(next, {
      type: 'Deposit',
      equb: 'Bank Transfer',
      amount,
      date: todayISO(),
      status: 'Completed',
    });
    next = DashboardService.addActivity(next, {
      action: `Deposited ${amount.toLocaleString()} ETB`,
    });
    DashboardService.persist(uid, next);
    setState(next);
    setShowDepositModal(false);
    setDepositAmount('');
    toast.success('Deposit Successful', `${amount.toLocaleString()} ETB added to your wallet.`);
  };

  const handleWithdraw = () => {
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

    const methodName = PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod)?.name || 'Bank Transfer';

    let next = { ...dashboard, walletBalance: balance - amount };
    next = DashboardService.addTransaction(next, {
      type: 'Withdrawal',
      equb: `${methodName} (${phoneNumber})`,
      amount: -amount,
      date: todayISO(),
      status: 'Completed',
    });
    next = DashboardService.addActivity(next, {
      action: `Withdrew ${amount.toLocaleString()} ETB via ${methodName}`,
    });
    DashboardService.persist(uid, next);
    setState(next);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setPhoneNumber('');
    setSelectedPaymentMethod('telebirr');
    toast.success('Withdrawal Successful', `${amount.toLocaleString()} ETB sent to ${phoneNumber}.`);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} isAuthenticated={true} />

      <div className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black text-gray-900">
              {lang === 'en' ? 'Wallet ' : 'ዋሊት '}
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-[#0d7e4d] text-white font-bold rounded-lg hover:bg-[#0a5c38] transition-all"
            >
              ← {lang === 'en' ? 'Back to Dashboard' : 'ወደ ዳሽቦርድ'}
            </button>
          </div>

          {/* Wallet Balance */}
          <div className="bg-gradient-to-r from-[#0d7e4d] to-[#d4af37] text-white rounded-2xl shadow-lg p-8 mb-8">
            <p className="text-sm opacity-90">{lang === 'en' ? 'Current Balance' : 'አሁን ሚዛን'}</p>
            <h2 className="text-5xl font-black mb-4">ETB {balance.toLocaleString()}</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDepositModal(true)}
                className="bg-white text-[#0d7e4d] font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all"
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
                      <p className={`font-bold text-lg ${txn.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {txn.amount < 0 ? '-' : '+'}ETB {Math.abs(txn.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600">✓ {txn.status}</p>
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7e4d]"
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
                  className="flex-1 px-4 py-3 bg-[#0d7e4d] text-white font-bold rounded-lg hover:bg-[#0a5c38] transition-all"
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
                          ? 'border-[#0d7e4d] bg-green-50 font-bold'
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7e4d]"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7e4d]"
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
                  className="flex-1 px-4 py-3 bg-[#0d7e4d] text-white font-bold rounded-lg hover:bg-[#0a5c38] transition-all"
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
