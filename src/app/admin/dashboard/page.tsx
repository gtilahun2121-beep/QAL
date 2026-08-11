'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AdminUser, AdminRole, roleDisplay, Member, KYCDocument, Dispute, FinancialRecord } from '@/app/types/admin';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Language, defaultLanguage } from '@/i18n/config';

export default function AdminDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>(defaultLanguage);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'kyc' | 'disputes' | 'finance' | 'admin'>('overview');
  const [loading, setLoading] = useState(true);

  // Sample data for demo
  const [members] = useState<Member[]>([
    {
      id: '1',
      phoneNumber: '+251911223344',
      fullName: 'Aisha Mohammed',
      pin: '1234',
      faydaNumber: '12345678',
      email: 'aisha@example.com',
      status: 'active',
      kycStatus: 'approved',
      registeredAt: new Date().toISOString(),
    },
    {
      id: '2',
      phoneNumber: '+251922334455',
      fullName: 'Tigst Kebede',
      pin: '5678',
      faydaNumber: '87654321',
      email: 'tigst@example.com',
      status: 'active',
      kycStatus: 'pending',
      registeredAt: new Date().toISOString(),
    },
  ]);

  const [kycDocs] = useState<KYCDocument[]>([
    {
      id: 'kyc1',
      memberId: '2',
      memberName: 'Tigst Kebede',
      memberPhone: '+251922334455',
      documentType: 'id_photo',
      documentUrl: '/mock-id.jpg',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    },
  ]);

  const [disputes] = useState<Dispute[]>([
    {
      id: 'disp1',
      complainantId: '1',
      complainantName: 'Aisha Mohammed',
      respondentId: '2',
      respondentName: 'Tigst Kebede',
      description: 'Payment not received for round 2',
      status: 'open',
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [records] = useState<FinancialRecord[]>([
    {
      id: 'fin1',
      memberId: '1',
      memberName: 'Aisha Mohammed',
      type: 'payment',
      amount: 500,
      currency: 'ETB',
      description: 'Equb round payment',
      status: 'completed',
      date: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('qalnet_admin_token');
    const adminRole = localStorage.getItem('qalnet_admin_role');

    if (!adminToken || !adminRole) {
      router.push('/auth');
      return;
    }

    // Load admin data
    const adminData = localStorage.getItem(`qalnet_admin_${adminToken}`);
    if (adminData) {
      const parsedAdmin = JSON.parse(adminData);
      setAdmin(parsedAdmin);
    } else {
      router.push('/auth');
    }

    setLoading(false);
  }, [router]);

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-black text-[#16357a]">Loading...</div>
      </div>
    );
  }

  const hasPermission = (permission: string) => admin.permissions.includes(permission as any);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Header lang={lang} onLanguageChange={setLang} />

      <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#ece8e3] py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top header area */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 mb-6 shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#16357a]">Good evening, Admin 👋</h1>
                <p className="text-sm text-gray-600">Here's the current status of the QalNet platform.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Aug 9, 2026 · 10:45 PM</div>
                <button className="px-4 py-2 bg-[#16357a] text-white rounded-lg font-bold">Export Report</button>
              </div>
            </div>
          </motion.div>

          {/* Main grid: left nav, main content, right sidebar */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left navigation (small) */}
            <aside className="col-span-12 md:col-span-2">
              <div className="bg-white rounded-2xl p-4 shadow-md sticky top-6">
                {/* Reuse LeftNav if present; fallback to simple list */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="mb-4">
                  <h3 className="font-black text-[#16357a]">QalNet</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="px-3 py-2 bg-[#e8f6f3] rounded-lg font-bold text-[#16357a]">Dashboard</li>
                  <li className="px-3 py-2 rounded-lg hover:bg-gray-50">Users</li>
                  <li className="px-3 py-2 rounded-lg hover:bg-gray-50">Equbs</li>
                  <li className="px-3 py-2 rounded-lg hover:bg-gray-50">Transactions</li>
                  <li className="px-3 py-2 rounded-lg hover:bg-gray-50">Withdrawals</li>
                  <li className="px-3 py-2 rounded-lg hover:bg-gray-50">Verifications</li>
                </ul>
              </div>
            </aside>

            {/* Main content */}
            <main className="col-span-12 md:col-span-7">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Users" value="12,485" sub="+8.4% this month" />
                <StatCard label="Active Equbs" value="342" sub="+12.1% this month" />
                <StatCard label="Total Contributions" value="ETB 4.82M" sub="+15.8% this month" />
                <StatCard label="Pending Payments" value="47" sub="Requires attention" />
              </div>

              {/* Platform activity chart */}
              <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg text-[#16357a]">Platform Activity</h3>
                  <div className="text-sm text-gray-600">7 Days · Contributions</div>
                </div>
                <div className="h-48 bg-gradient-to-b from-teal-50 to-white rounded-lg flex items-end justify-center">
                  {/* Placeholder chart */}
                  <div className="w-full h-full flex items-end">
                    <div className="mx-auto w-[85%] h-[80%] bg-gradient-to-t from-[#bdeedd] to-[#e6faf6] rounded-lg flex items-end justify-center">
                      <div className="text-sm text-gray-600 p-4">[Chart Placeholder]</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions + Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h4 className="font-black text-[#16357a] mb-4">Recent Transactions</h4>
                  <div className="space-y-3 text-sm">
                    {records.map((r: any) => (
                      <div key={r.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-bold">{r.memberName}</div>
                          <div className="text-xs text-gray-500">{r.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black">ETB {r.amount}</div>
                          <div className="text-xs text-gray-500">{new Date(r.date).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h4 className="font-black text-[#16357a] mb-4">Member Verification</h4>
                  <div className="space-y-3 text-sm">
                    {kycDocs.map((d: any) => (
                      <div key={d.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{d.memberName}</div>
                          <div className="text-xs text-gray-500">Submitted {new Date(d.submittedAt).toLocaleHoursString?.() || 'recently'}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold">Approve</button>
                          <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            {/* Right sidebar */}
            <aside className="col-span-12 md:col-span-3">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <h4 className="font-black text-[#16357a] mb-3">Pending Actions</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                      <div>
                        <div className="font-bold">18 Equbs awaiting approval</div>
                        <div className="text-xs text-gray-500">Review new Equb registrations</div>
                      </div>
                      <button className="px-3 py-1 bg-white text-[#16357a] rounded-lg text-xs font-bold">Review</button>
                    </li>
                    <li className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
                      <div>
                        <div className="font-bold">31 users awaiting verification</div>
                        <div className="text-xs text-gray-500">Identity verification required</div>
                      </div>
                      <button className="px-3 py-1 bg-white text-[#16357a] rounded-lg text-xs font-bold">Review</button>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <h4 className="font-black text-[#16357a] mb-3">Top Equbs</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">WDR Telebirr Equb</div>
                        <div className="text-xs text-gray-500">12 Members</div>
                      </div>
                      <div className="text-sm font-black text-green-700">ETB 1,100</div>
                    </li>
                    <li className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">Family Equb</div>
                        <div className="text-xs text-gray-500">8 Members</div>
                      </div>
                      <div className="text-sm font-black text-green-700">ETB 500</div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <h4 className="font-black text-[#16357a] mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="px-3 py-3 rounded-lg bg-green-50 text-[#16357a] font-bold">Add User</button>
                    <button className="px-3 py-3 rounded-lg bg-blue-50 text-[#16357a] font-bold">Create Equb</button>
                    <button className="px-3 py-3 rounded-lg bg-gray-50 text-[#16357a] font-bold">View Reports</button>
                    <button className="px-3 py-3 rounded-lg bg-indigo-50 text-[#16357a] font-bold">System Settings</button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </>
  );
}

// Overview Tab Component
function OverviewTab({ members, kycDocs, disputes, records }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Total Members" value={members.length.toString()} />
      <StatCard label="Pending KYC" value={kycDocs.filter((d: any) => d.status === 'pending').length.toString()} />
      <StatCard label="Open Disputes" value={disputes.filter((d: any) => d.status === 'open').length.toString()} />
      <StatCard label="Total Transactions" value={records.length.toString()} />
    </div>
  );
}

function StatCard({ label, value }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg p-4 border-2 border-[#d4af37] shadow-md hover:shadow-lg transition-all"
    >
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-black text-[#16357a]">{value}</p>
    </motion.div>
  );
}

// Members Tab Component
function MembersTab({ members, admin }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <h2 className="text-2xl font-black text-[#16357a] mb-6">Members Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#d4af37]">
              <th className="text-left py-3 font-black text-[#16357a]">Name</th>
              <th className="text-left py-3 font-black text-[#16357a]">Phone</th>
              <th className="text-left py-3 font-black text-[#16357a]">Status</th>
              <th className="text-left py-3 font-black text-[#16357a]">KYC</th>
              <th className="text-left py-3 font-black text-[#16357a]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member: any) => (
              <tr key={member.id} className="border-b border-gray-200 hover:bg-[#f5f3f0] transition-all">
                <td className="py-3 font-bold text-[#16357a]">{member.fullName}</td>
                <td className="py-3">{member.phoneNumber}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    member.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {member.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    member.kycStatus === 'approved'
                      ? 'bg-blue-100 text-blue-800'
                      : member.kycStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {member.kycStatus.toUpperCase()}
                  </span>
                </td>
                <td className="py-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-[#16357a] text-white rounded-lg text-xs font-bold hover:shadow-md transition-all"
                  >
                    View
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// KYC Tab Component
function KYCTab({ documents }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {documents.map((doc: any) => (
        <motion.div
          key={doc.id}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-4 border-2 border-[#d4af37] shadow-md"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-black text-[#16357a]">{doc.memberName}</h3>
              <p className="text-sm text-gray-600">{doc.memberPhone}</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
              {doc.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm mb-4">Document Type: <strong>{doc.documentType.replace('_', ' ').toUpperCase()}</strong></p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-2 bg-blue-1000 text-white font-bold rounded-lg hover:shadow-md transition-all"
            >
               Approve
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:shadow-md transition-all"
            >
               Reject
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Disputes Tab Component
function DisputesTab({ disputes }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {disputes.map((dispute: any) => (
        <motion.div
          key={dispute.id}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-4 border-2 border-[#d4af37] shadow-md"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-black text-[#16357a]">
                {dispute.complainantName} vs {dispute.respondentName}
              </h3>
              <p className="text-sm text-gray-600">{dispute.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              dispute.priority === 'critical' ? 'bg-red-100 text-red-700'
              : dispute.priority === 'high' ? 'bg-orange-100 text-orange-700'
              : 'bg-yellow-100 text-yellow-700'
            }`}>
              {dispute.priority.toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:shadow-md transition-all"
            >
               Investigate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-2 bg-blue-1000 text-white font-bold rounded-lg hover:shadow-md transition-all"
            >
              ✓ Resolve
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Finance Tab Component
function FinanceTab({ records }: any) {
  const totalAmount = records.reduce((sum: number, r: any) => sum + r.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 mb-6 shadow-md"
      >
        <p className="text-sm">Total Transactions</p>
        <p className="text-3xl font-black">ETB {totalAmount.toLocaleString()}</p>
      </motion.div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-black text-[#16357a] mb-6">Transaction Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#d4af37]">
                <th className="text-left py-3 font-black text-[#16357a]">Member</th>
                <th className="text-left py-3 font-black text-[#16357a]">Type</th>
                <th className="text-left py-3 font-black text-[#16357a]">Amount</th>
                <th className="text-left py-3 font-black text-[#16357a]">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record: any) => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-[#f5f3f0] transition-all">
                  <td className="py-3 font-bold text-[#16357a]">{record.memberName}</td>
                  <td className="py-3 capitalize">{record.type}</td>
                  <td className="py-3 font-bold">ETB {record.amount}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      record.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// Admin Users Tab Component
function AdminUsersTab({ admin }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <h2 className="text-2xl font-black text-[#16357a] mb-6">Admin Users Management</h2>
      <p className="text-gray-600 mb-6">Manage admin accounts, roles, and permissions</p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-gradient-to-r from-[#16357a] to-[#d4af37] text-white font-black rounded-full hover:shadow-lg transition-all mb-6"
      >
        Add New Admin
      </motion.button>

      <div className="bg-[#f5f3f0] border-2 border-[#d4af37] rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-black text-[#16357a]">{admin.fullName}</p>
            <p className="text-sm text-gray-600">{admin.email}</p>
            <p className="text-xs font-bold text-[#d4af37]">{admin.role.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
