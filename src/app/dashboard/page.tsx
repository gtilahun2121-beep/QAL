'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Language, defaultLanguage } from '@/i18n/config';
import { translations } from '@/i18n/translations';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function DashboardPage() {
  const { user, isAuthenticated, signout } = useAuth();
  const [lang, setLang] = useState<Language>(defaultLanguage);
  const t = translations[lang];

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800">
            {lang === 'en' ? 'Please log in first' : 'በመጀመሪያ ግባ'}
          </p>
        </div>
      </main>
    );
  }

  const isNewUser = false; // Toggle this to show "Getting Started" for new users

  // Mock data
  const walletBalance = 12500;
  const activeEqubs = 3;
  const nextPaymentDays = 5;
  const nextPayoutMonths = 3;

  const equbs = [
    { id: 1, name: 'Gold Equb', members: 12, position: 3, nextPayout: '3 months', status: '✅ Active' },
    { id: 2, name: 'Community Fund', members: 8, position: 5, nextPayout: '4 months', status: '✅ Active' },
    { id: 3, name: 'Business Support', members: 15, position: 7, nextPayout: '6 months', status: '✅ Active' },
  ];

  const notifications = [
    { icon: '📅', title: lang === 'en' ? 'Payment Due Tomorrow' : 'ክፍያ ነገ ነው', time: '1 day' },
    { icon: '👥', title: lang === 'en' ? 'New Member Joined' : 'አዲስ አባል ተቀላቀለ', time: '2 hours' },
    { icon: '💰', title: lang === 'en' ? 'You Received Your Payout' : 'ክፍሌ ተቀበሉ', time: '1 week' },
  ];

  const recentActivity = [
    { icon: '✅', action: lang === 'en' ? 'Payment Completed' : 'ክፍያ ተጠናቀቀ', time: '2 hours ago' },
    { icon: '➕', action: lang === 'en' ? 'Joined Gold Equb' : 'Gold Equb ተጠምዱ', time: '1 day ago' },
    { icon: '📝', action: lang === 'en' ? 'Profile Updated' : 'መገለጫ ተመሳሰለ', time: '3 days ago' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        lang={lang}
        onLanguageChange={setLang}
        isAuthenticated={true}
      />

      <div className="flex-grow py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              {lang === 'en' ? `Welcome, ${user.firstName}! 👋` : `ሰላም, ${user.firstName}! 👋`}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {lang === 'en'
                ? 'Manage your Equb groups and stay updated'
                : 'Equb ቡድንዎን ያስተዳድሩ'}
            </p>
          </div>

          {/* Getting Started (for new users) */}
          {isNewUser && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-black text-blue-900 mb-6">
                {lang === 'en' ? '🚀 Getting Started' : '🚀 ጀምር'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { icon: '✅', label: lang === 'en' ? 'Verify Fayda' : 'Fayda አረጋግጡ', done: true },
                  { icon: '✅', label: lang === 'en' ? 'Complete Profile' : 'መገለጫ ያጠናቅቁ', done: true },
                  { icon: '➕', label: lang === 'en' ? 'Join First Equb' : 'Equb ይቀላቀሉ', done: false },
                  { icon: '💳', label: lang === 'en' ? 'Add Payment' : 'ክፍያ ይጨምሩ', done: false },
                  { icon: '📖', label: lang === 'en' ? 'Learn How It Works' : 'እንዴት ይሠራል', done: false },
                ].map((step, idx) => (
                  <button
                    key={idx}
                    className={`p-4 rounded-lg font-bold transition-all text-center ${
                      step.done
                        ? 'bg-green-100 text-green-900 hover:shadow-md'
                        : 'bg-white text-gray-700 border-2 border-blue-200 hover:border-blue-400'
                    }`}
                  >
                    <p className="text-2xl mb-2">{step.icon}</p>
                    <p className="text-sm font-bold">{step.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 1: What is my current Equb status? - Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Wallet Balance */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-bold">{lang === 'en' ? 'Wallet Balance' : 'ዋሊት ሚዛን'}</h3>
                <span className="text-3xl">💰</span>
              </div>
              <p className="text-4xl font-black text-purple-600">ETB {walletBalance.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">{lang === 'en' ? 'Available funds' : 'ሊገኙ የሚችሉ ገንዘብ'}</p>
            </div>

            {/* Active Equbs */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-bold">{lang === 'en' ? 'Active Equbs' : 'ንቁ Equbs'}</h3>
                <span className="text-3xl">👥</span>
              </div>
              <p className="text-4xl font-black text-green-600">{activeEqubs}</p>
              <p className="text-xs text-gray-500 mt-2">{lang === 'en' ? 'Groups you are in' : 'አንተ ነበርክበት ቡድን'}</p>
            </div>

            {/* Next Payment */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-bold">{lang === 'en' ? 'Next Payment' : 'ቀጣይ ክፍያ'}</h3>
                <span className="text-3xl">📅</span>
              </div>
              <p className="text-4xl font-black text-blue-600">{nextPaymentDays}d</p>
              <p className="text-xs text-gray-500 mt-2">{lang === 'en' ? 'Days remaining' : 'ቀሪ ቀናት'}</p>
            </div>

            {/* Next Payout */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-bold">{lang === 'en' ? 'Next Payout' : 'ቀጣይ ክፍሌ'}</h3>
                <span className="text-3xl">🏆</span>
              </div>
              <p className="text-4xl font-black text-amber-600">{nextPayoutMonths}m</p>
              <p className="text-xs text-gray-500 mt-2">{lang === 'en' ? 'Months away' : 'ወሩ ርቁ'}</p>
            </div>
          </div>

          {/* QUESTION 2: What should I do next? - Quick Actions & Profile Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {lang === 'en' ? '⚡ Quick Actions' : '⚡ ፈጣን ተግባር'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { icon: '➕', label: lang === 'en' ? 'Join Equb' : 'Equb ይቀላቀሉ', href: '/join-equb' },
                  { icon: '🏗️', label: lang === 'en' ? 'Create Equb' : 'Equb ይፍጠሩ', href: '#' },
                  { icon: '💳', label: lang === 'en' ? 'Pay Now' : 'አሁን ይክፈሉ', href: '#' },
                  { icon: '👛', label: lang === 'en' ? 'Wallet' : 'ዋሊት', href: '/wallet' },
                  { icon: '🤝', label: lang === 'en' ? 'Invite' : 'ጋብዙ', href: '#' },
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.href}
                    className="bg-gradient-to-br from-[#0d7e4d] to-[#0a5c38] text-white font-bold py-4 px-3 rounded-xl hover:shadow-lg transition-all hover:scale-105 text-center text-sm flex flex-col items-center justify-center"
                  >
                    <p className="text-2xl mb-1">{action.icon}</p>
                    <p className="text-xs font-bold">{action.label}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-4">
                {lang === 'en' ? '✓ Profile Status' : '✓ መገለጫ ሁኔታ'}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-green-600">✅</span>
                  <span className="text-sm font-semibold text-gray-700">{lang === 'en' ? 'Fayda Verified' : 'Fayda ታገዩ'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-green-600">✅</span>
                  <span className="text-sm font-semibold text-gray-700">{lang === 'en' ? 'Phone Verified' : 'ስልክ ታገዩ'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-green-600">✅</span>
                  <span className="text-sm font-semibold text-gray-700">{lang === 'en' ? 'Email Verified' : 'ኢሜል ታገዩ'}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2 font-bold">
                    {lang === 'en' ? 'Profile Completion' : 'መገለጫ ተጠናቀቀ'}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-sm font-black text-green-600 mt-2">100%</p>
                </div>
              </div>
            </div>
          </div>

          {/* QUESTION 3: What has happened recently? */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {lang === 'en' ? '📋 Recent Activity' : '📋 ቅርብ ሥራ'}
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <span className="text-2xl">{activity.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {lang === 'en' ? '🔔 Notifications' : '🔔 ማስታወቂያ'}
              </h2>
              <div className="space-y-4">
                {notifications.map((notif, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 bg-blue-50 p-3 rounded-lg">
                    <span className="text-2xl">{notif.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{notif.title}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My Equbs Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">
                {lang === 'en' ? '👥 My Equbs' : '👥 ስሌዎ Equbs'}
              </h2>
              <Link href="/my-equbs" className="text-[#0d7e4d] font-bold hover:underline">
                {lang === 'en' ? 'View All →' : 'ሁሉ ይመልከቱ →'}
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-4 font-bold text-gray-700">{lang === 'en' ? 'Group Name' : 'ቡድን ስም'}</th>
                    <th className="text-center py-2 px-4 font-bold text-gray-700">{lang === 'en' ? 'Members' : 'አባሎች'}</th>
                    <th className="text-center py-2 px-4 font-bold text-gray-700">{lang === 'en' ? 'Position' : 'ሥራ'}</th>
                    <th className="text-center py-2 px-4 font-bold text-gray-700">{lang === 'en' ? 'Next Payout' : 'ቀጣይ ክፍሌ'}</th>
                    <th className="text-center py-2 px-4 font-bold text-gray-700">{lang === 'en' ? 'Status' : 'ሁኔታ'}</th>
                  </tr>
                </thead>
                <tbody>
                  {equbs.map((equb) => (
                    <tr key={equb.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{equb.name}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{equb.members}</td>
                      <td className="py-3 px-4 text-center font-bold text-[#0d7e4d]">#{equb.position}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{equb.nextPayout}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          {equb.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Support & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Support */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {lang === 'en' ? '💬 Support' : '💬 ተገባኝ'}
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-semibold">
                  {lang === 'en' ? '📚 Help Center' : '📚 ረዳት ማዕከል'}
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-semibold">
                  {lang === 'en' ? '💬 Live Chat' : '💬 ብቁ ውይይት'}
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-semibold">
                  {lang === 'en' ? '⚠️ Report Issue' : '⚠️ ችግር ሪፖርት'}
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {lang === 'en' ? '⚙️ Account' : '⚙️ መስተዋወቅ'}
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-semibold">
                  {lang === 'en' ? 'Profile Settings' : 'መገለጫ ቅንብር'}
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-semibold">
                  {lang === 'en' ? 'Security' : 'ደህንነት'}
                </button>
                <button
                  onClick={() => signout()}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold"
                >
                  {lang === 'en' ? '🚪 Logout' : '🚪 ወጣ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}
