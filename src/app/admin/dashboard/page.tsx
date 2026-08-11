'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AdminUser,
  AdminRole,
  roleDisplay,
  rolePermissions,
  Member,
  KYCDocument,
  Dispute,
  FinancialRecord,
  Permission,
} from '@/app/types/admin';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Language, defaultLanguage } from '@/i18n/config';

type TabId = 'overview' | 'members' | 'kyc' | 'disputes' | 'finance' | 'admin';

const STORAGE_KEYS = {
  members: 'qalnet_admin_members',
  kyc: 'qalnet_admin_kyc_docs',
  disputes: 'qalnet_admin_disputes',
  finance: 'qalnet_admin_finance',
  admins: 'qalnet_admin_admins',
} as const;

function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const seedMembers: Member[] = [
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
    lastActive: new Date().toISOString(),
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
    lastActive: new Date().toISOString(),
  },
  {
    id: '3',
    phoneNumber: '+251933445566',
    fullName: 'Dawit Tesfaye',
    pin: '9012',
    faydaNumber: '11223344',
    email: 'dawit@example.com',
    status: 'active',
    kycStatus: 'approved',
    registeredAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    id: '4',
    phoneNumber: '+251944556677',
    fullName: 'Sara Girma',
    pin: '3456',
    faydaNumber: '55667788',
    email: 'sara@example.com',
    status: 'suspended',
    kycStatus: 'rejected',
    registeredAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
];

const seedKycDocs: KYCDocument[] = [
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
  {
    id: 'kyc2',
    memberId: '3',
    memberName: 'Dawit Tesfaye',
    memberPhone: '+251933445566',
    documentType: 'proof_of_residence',
    documentUrl: '/mock-id.jpg',
    submittedAt: new Date().toISOString(),
    status: 'pending',
  },
  {
    id: 'kyc3',
    memberId: '4',
    memberName: 'Sara Girma',
    memberPhone: '+251944556677',
    documentType: 'id_photo',
    documentUrl: '/mock-id.jpg',
    submittedAt: new Date().toISOString(),
    status: 'rejected',
    rejectionReason: 'Document blurry, please resubmit',
  },
];

const seedDisputes: Dispute[] = [
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
  {
    id: 'disp2',
    complainantId: '3',
    complainantName: 'Dawit Tesfaye',
    respondentId: '4',
    respondentName: 'Sara Girma',
    description: 'Disputed payout amount for round 5',
    status: 'investigating',
    priority: 'critical',
    createdAt: new Date().toISOString(),
    assignedTo: 'System Admin',
  },
];

const seedFinance: FinancialRecord[] = [
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
    equbId: 'eq1',
  },
  {
    id: 'fin2',
    memberId: '2',
    memberName: 'Tigst Kebede',
    type: 'payout',
    amount: 15000,
    currency: 'ETB',
    description: 'Round winner payout',
    status: 'pending',
    date: new Date().toISOString(),
    equbId: 'eq1',
  },
  {
    id: 'fin3',
    memberId: '3',
    memberName: 'Dawit Tesfaye',
    type: 'fee',
    amount: 25,
    currency: 'ETB',
    description: 'Platform service fee',
    status: 'completed',
    date: new Date().toISOString(),
    equbId: 'eq2',
  },
  {
    id: 'fin4',
    memberId: '4',
    memberName: 'Sara Girma',
    type: 'refund',
    amount: 500,
    currency: 'ETB',
    description: 'Refund for cancelled round',
    status: 'completed',
    date: new Date().toISOString(),
    equbId: 'eq3',
  },
];

const seedAdmins: AdminUser[] = [
  {
    id: 'admin1',
    email: 'super@qalnet.com',
    passwordHash: '',
    role: 'super_admin',
    fullName: 'Abeba Getnet',
    phone: '+251911000001',
    mfaEnabled: true,
    mfaMethod: 'both',
    mfaCode: '000000',
    createdAt: new Date().toISOString(),
    permissions: rolePermissions.super_admin,
    status: 'active',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'admin2',
    email: 'kyc@qalnet.com',
    passwordHash: '',
    role: 'kyc_approver',
    fullName: 'Mekdes Tekle',
    phone: '+251911000002',
    mfaEnabled: true,
    mfaMethod: 'email',
    mfaCode: '000000',
    createdAt: new Date().toISOString(),
    permissions: rolePermissions.kyc_approver,
    status: 'active',
    lastLogin: new Date().toISOString(),
  },
];

const navItems: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { id: 'members', label: 'Members', icon: 'M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 12a4 4 0 100-8 4 4 0 000 8zM21 20v-1a4 4 0 00-3-3.87M16 4.13a4 4 0 010 7.75' },
  { id: 'kyc', label: 'KYC Verification', icon: 'M9 12h6m-6 4h6M9 8h.01M15 4H7a2 2 0 00-2 2v14l4-2 4 2 4-2 2 2V6a2 2 0 00-2-2h-2z' },
  { id: 'disputes', label: 'Disputes', icon: 'M12 3v18m0-18a7 7 0 017 7c0 1.6-.5 3-1.4 4.2L12 21l-5.6-8.8A7 7 0 0112 3z' },
  { id: 'finance', label: 'Finance', icon: 'M3 6h18M3 10h18M3 14h18M3 18h18M7 6v12m10-12v12' },
  { id: 'admin', label: 'Admin Users', icon: 'M12 12a5 5 0 100-10 5 5 0 000 10zM3 21a9 9 0 0118 0' },
];

function countBy<T>(items: T[], fn: (item: T) => boolean) {
  return items.filter(fn).length;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>(defaultLanguage);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const [members, setMembers] = useState<Member[]>(() => loadStored(STORAGE_KEYS.members, seedMembers));
  const [kycDocs, setKycDocs] = useState<KYCDocument[]>(() => loadStored(STORAGE_KEYS.kyc, seedKycDocs));
  const [disputes, setDisputes] = useState<Dispute[]>(() => loadStored(STORAGE_KEYS.disputes, seedDisputes));
  const [finance, setFinance] = useState<FinancialRecord[]>(() => loadStored(STORAGE_KEYS.finance, seedFinance));
  const [admins, setAdmins] = useState<AdminUser[]>(() => loadStored(STORAGE_KEYS.admins, seedAdmins));

  const notify = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
  }, [members]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.kyc, JSON.stringify(kycDocs));
  }, [kycDocs]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.disputes, JSON.stringify(disputes));
  }, [disputes]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.finance, JSON.stringify(finance));
  }, [finance]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.admins, JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    let adminToken = localStorage.getItem('qalnet_admin_token');
    let adminRole = localStorage.getItem('qalnet_admin_role');

    if (!adminToken || !adminRole) {
      const demo = 'admin_demo';
      localStorage.setItem('qalnet_admin_token', demo);
      localStorage.setItem(
        `qalnet_admin_${demo}`,
        JSON.stringify({
          fullName: 'System Admin',
          role: 'super_admin',
          email: 'admin@qalnet.com',
          permissions: rolePermissions.super_admin,
        }),
      );
      localStorage.setItem('qalnet_admin_role', 'super_admin');
      adminToken = demo;
      adminRole = 'super_admin';
    }

    const adminData = localStorage.getItem(`qalnet_admin_${adminToken}`);
    if (adminData) {
      const parsed = JSON.parse(adminData);
      setAdmin({
        id: 'admin_demo',
        email: parsed.email || 'admin@qalnet.com',
        role: (parsed.role === 'system_admin' ? 'super_admin' : parsed.role) as AdminRole,
        fullName: parsed.fullName || 'System Admin',
        passwordHash: '',
        mfaEnabled: false,
        mfaMethod: 'email',
        createdAt: new Date().toISOString(),
        status: 'active',
        permissions: (parsed.permissions || rolePermissions.super_admin) as Permission[],
      });
    } else {
      setAdmin({
        id: 'admin_demo',
        email: 'admin@qalnet.com',
        role: 'super_admin',
        fullName: 'System Admin',
        passwordHash: '',
        mfaEnabled: false,
        mfaMethod: 'email',
        createdAt: new Date().toISOString(),
        status: 'active',
        permissions: rolePermissions.super_admin,
      });
    }

    setLoading(false);
  }, [router]);

  const hasPermission = useCallback(
    (permission: Permission) => admin?.permissions.includes(permission) ?? false,
    [admin],
  );

  const stats = useMemo(
    () => ({
      totalMembers: members.length,
      activeMembers: countBy(members, (m) => m.status === 'active'),
      pendingKyc: countBy(kycDocs, (d) => d.status === 'pending'),
      openDisputes: countBy(disputes, (d) => d.status === 'open' || d.status === 'investigating'),
      totalFinance: finance.reduce((sum, r) => sum + (r.status === 'completed' ? r.amount : 0), 0),
      pendingPayouts: countBy(finance, (r) => r.status === 'pending'),
    }),
    [members, kycDocs, disputes, finance],
  );

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f3f0]">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#16357a] border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-xl font-black text-[#16357a]">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const handleKycApprove = (doc: KYCDocument) => {
    setKycDocs((prev) =>
      prev.map((d) =>
        d.id === doc.id ? { ...d, status: 'approved', approvedBy: admin.fullName, approvalNotes: 'Verified by admin' } : d,
      ),
    );
    setMembers((prev) => prev.map((m) => (m.id === doc.memberId ? { ...m, kycStatus: 'approved' } : m)));
    notify('success', `KYC approved for ${doc.memberName}`);
  };

  const handleKycReject = (doc: KYCDocument) => {
    const reason = window.prompt('Rejection reason:', 'Document could not be verified');
    if (reason === null) return;
    setKycDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, status: 'rejected', rejectionReason: reason } : d)),
    );
    setMembers((prev) => prev.map((m) => (m.id === doc.memberId ? { ...m, kycStatus: 'rejected' } : m)));
    notify('info', `KYC rejected for ${doc.memberName}`);
  };

  const handleToggleMemberStatus = (member: Member) => {
    const next = member.status === 'active' ? 'suspended' : 'active';
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: next } : m)));
    notify('info', `${member.fullName} ${next === 'active' ? 'reactivated' : 'suspended'}`);
  };

  const handleMemberStatusChange = (id: string, status: Member['status']) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const handleDisputeStatus = (id: string, status: Dispute['status']) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              assignedTo: status === 'investigating' ? admin.fullName : d.assignedTo,
              resolvedAt: status === 'resolved' ? new Date().toISOString() : d.resolvedAt,
            }
          : d,
      ),
    );
    notify('info', `Dispute ${id} set to ${status}`);
  };

  const handleDisputePriority = (id: string, priority: Dispute['priority']) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, priority } : d)));
    notify('info', `Dispute ${id} priority set to ${priority}`);
  };

  const handleAddFinance = (record: Omit<FinancialRecord, 'id' | 'date'>) => {
    const newRecord: FinancialRecord = {
      ...record,
      id: `fin_${Date.now()}`,
      date: new Date().toISOString(),
    };
    setFinance((prev) => [newRecord, ...prev]);
    notify('success', 'Financial record added');
  };

  const handleFinanceStatus = (id: string, status: FinancialRecord['status']) => {
    setFinance((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    notify('info', `Record ${id} marked ${status}`);
  };

  const handleAddAdmin = (data: { email: string; fullName: string; role: AdminRole; phone?: string }) => {
    if (admins.some((a) => a.email === data.email)) {
      notify('error', 'An admin with that email already exists');
      return;
    }
    setAdmins((prev) => [
      ...prev,
      {
        id: `admin_${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
        passwordHash: '',
        mfaEnabled: false,
        mfaMethod: 'email',
        createdAt: new Date().toISOString(),
        permissions: rolePermissions[data.role],
        status: 'active',
      },
    ]);
    notify('success', `Admin ${data.fullName} created`);
  };

  const handleRemoveAdmin = (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    notify('info', 'Admin removed');
  };

  const handleAdminRoleChange = (id: string, role: AdminRole) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, role, permissions: rolePermissions[role] } : a)),
    );
    notify('info', 'Admin role updated');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <Header lang={lang} onLanguageChange={setLang} />

      <div className="min-h-screen bg-gradient-to-br from-[#f5f3f0] to-[#ece8e3] py-8">
        <div className="max-w-7xl mx-auto px-4">
          {toast && (
            <div
              className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-bold text-sm ${
                toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
              }`}
            >
              {toast.message}
            </div>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 mb-6 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#16357a]">
                  Welcome back, {admin.fullName.split(' ')[0]}
                </h1>
                <p className="text-sm text-gray-600">
                  {roleDisplay[admin.role]?.name || 'Administrator'} · Platform control center
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-[#e8f6f3] text-[#16357a] rounded-full text-xs font-bold">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">● Live</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-12 md:col-span-2">
              <div className="bg-white rounded-2xl p-4 shadow-md sticky top-6">
                <div className="mb-4 px-3">
                  <h3 className="font-black text-[#16357a]">QalNet Admin</h3>
                </div>
                <nav className="space-y-1 text-sm">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold transition-all ${
                        activeTab === item.id
                          ? 'bg-[#16357a] text-white shadow'
                          : 'text-[#16357a] hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                      <span>{item.label}</span>
                      {item.id === 'kyc' && stats.pendingKyc > 0 && (
                        <span className="ml-auto bg-yellow-400 text-[#16357a] text-xs font-black rounded-full px-2 py-0.5">
                          {stats.pendingKyc}
                        </span>
                      )}
                      {item.id === 'disputes' && stats.openDisputes > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-black rounded-full px-2 py-0.5">
                          {stats.openDisputes}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="col-span-12 md:col-span-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === 'overview' && (
                    <OverviewTab
                      stats={stats}
                      members={members}
                      kycDocs={kycDocs}
                      disputes={disputes}
                      finance={finance}
                      onNavigate={setActiveTab}
                      onKycApprove={handleKycApprove}
                      onKycReject={handleKycReject}
                    />
                  )}
                  {activeTab === 'members' && (
                    <MembersTab
                      members={members}
                      hasPermission={hasPermission}
                      onToggleStatus={handleToggleMemberStatus}
                      onStatusChange={handleMemberStatusChange}
                      onApproveKyc={handleKycApprove}
                      onRejectKyc={handleKycReject}
                    />
                  )}
                  {activeTab === 'kyc' && (
                    <KYCTab documents={kycDocs} onApprove={handleKycApprove} onReject={handleKycReject} />
                  )}
                  {activeTab === 'disputes' && (
                    <DisputesTab
                      disputes={disputes}
                      onStatusChange={handleDisputeStatus}
                      onPriorityChange={handleDisputePriority}
                    />
                  )}
                  {activeTab === 'finance' && (
                    <FinanceTab
                      records={finance}
                      hasPermission={hasPermission}
                      onAdd={handleAddFinance}
                      onStatusChange={handleFinanceStatus}
                    />
                  )}
                  {activeTab === 'admin' && (
                    <AdminUsersTab
                      admins={admins}
                      currentAdmin={admin}
                      hasPermission={hasPermission}
                      onAdd={handleAddAdmin}
                      onRemove={handleRemoveAdmin}
                      onRoleChange={handleAdminRoleChange}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </>
  );
}

/* ============================= Overview ============================= */

function StatCard({ label, value, sub, accent }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`bg-white rounded-xl p-4 border-t-4 ${accent} shadow-md`}
    >
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-black text-[#16357a]">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </motion.div>
  );
}

function OverviewTab({ stats, members, kycDocs, disputes, finance, onNavigate, onKycApprove, onKycReject }: any) {
  const pendingKyc = kycDocs.filter((d: any) => d.status === 'pending');
  const recentFinance = finance.slice(0, 5);
  const activeDisputes = disputes.filter((d: any) => d.status === 'open' || d.status === 'investigating');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Members" value={stats.totalMembers} sub={`${stats.activeMembers} active`} accent="border-[#16357a]" />
        <StatCard label="Pending KYC" value={stats.pendingKyc} sub="Awaiting review" accent="border-yellow-400" />
        <StatCard label="Open Disputes" value={stats.openDisputes} sub="Needs attention" accent="border-red-500" />
        <StatCard label="Completed Finance" value={`ETB ${stats.totalFinance.toLocaleString()}`} sub={`${stats.pendingPayouts} pending payouts`} accent="border-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-lg text-[#16357a]">Pending KYC Verification</h3>
            <button onClick={() => onNavigate('kyc')} className="text-xs font-bold text-[#16357a] hover:underline">
              View all →
            </button>
          </div>
          {pendingKyc.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No pending KYC documents 🎉</p>
          ) : (
            <div className="space-y-3 text-sm">
              {pendingKyc.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <div className="font-bold text-[#16357a]">{d.memberName}</div>
                    <div className="text-xs text-gray-500">
                      {d.documentType.replace('_', ' ')} · {d.memberPhone}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onKycApprove(d)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold hover:bg-green-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onKycReject(d)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-lg text-[#16357a]">Open Disputes</h3>
            <button onClick={() => onNavigate('disputes')} className="text-xs font-bold text-[#16357a] hover:underline">
              View all →
            </button>
          </div>
          {activeDisputes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No open disputes</p>
          ) : (
            <div className="space-y-3 text-sm">
              {activeDisputes.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <div className="font-bold text-[#16357a]">
                      {d.complainantName} vs {d.respondentName}
                    </div>
                    <div className="text-xs text-gray-500">{d.description}</div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-black ${
                      d.priority === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : d.priority === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {d.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#16357a]">Recent Financial Activity</h3>
            <button onClick={() => onNavigate('finance')} className="text-xs font-bold text-[#16357a] hover:underline">
              View all →
            </button>
          </div>
          <div className="space-y-3 text-sm">
            {recentFinance.map((r: any) => (
              <div key={r.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <div className="font-bold text-[#16357a]">{r.memberName}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {r.type} · {r.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-[#16357a]">
                    {r.currency} {r.amount.toLocaleString()}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      r.status === 'completed' ? 'text-green-600' : r.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}
                  >
                    {r.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-black text-[#16357a] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onNavigate('members')} className="px-3 py-4 rounded-xl bg-green-50 text-[#16357a] font-bold hover:bg-green-100 transition-all">
              Manage Members
            </button>
            <button onClick={() => onNavigate('kyc')} className="px-3 py-4 rounded-xl bg-yellow-50 text-[#16357a] font-bold hover:bg-yellow-100 transition-all">
              Verify KYC
            </button>
            <button onClick={() => onNavigate('disputes')} className="px-3 py-4 rounded-xl bg-red-50 text-[#16357a] font-bold hover:bg-red-100 transition-all">
              Resolve Disputes
            </button>
            <button onClick={() => onNavigate('finance')} className="px-3 py-4 rounded-xl bg-blue-50 text-[#16357a] font-bold hover:bg-blue-100 transition-all">
              Finance Records
            </button>
          </div>
          <div className="mt-4 bg-[#f5f3f0] rounded-xl p-4 text-sm">
            <p className="font-bold text-[#16357a] mb-1">Member Status Overview</p>
            <div className="space-y-1 text-gray-600">
              {members.map((m: any) => (
                <div key={m.id} className="flex justify-between">
                  <span>{m.fullName}</span>
                  <span
                    className={`font-bold ${
                      m.status === 'active' ? 'text-green-600' : m.status === 'suspended' ? 'text-red-600' : 'text-gray-500'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================= Members ============================= */

function MembersTab({ members, hasPermission, onToggleStatus, onStatusChange, onApproveKyc, onRejectKyc }: any) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered = members.filter(
    (m: Member) =>
      m.fullName.toLowerCase().includes(query.toLowerCase()) ||
      m.phoneNumber.includes(query) ||
      m.email?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-black text-[#16357a]">Members Management</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, email..."
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16357a]"
        />
      </div>

      {selected && (
        <MemberDetailModal member={selected} onClose={() => setSelected(null)} onStatusChange={onStatusChange} />
      )}

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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No members found
                </td>
              </tr>
            )}
            {filtered.map((member: Member) => (
              <tr key={member.id} className="border-b border-gray-200 hover:bg-[#f5f3f0] transition-all">
                <td className="py-3 font-bold text-[#16357a]">{member.fullName}</td>
                <td className="py-3">{member.phoneNumber}</td>
                <td className="py-3">
                  <select
                    value={member.status}
                    onChange={(e) => onStatusChange(member.id, e.target.value)}
                    disabled={!hasPermission('manage_members') && !hasPermission('view_members')}
                    className={`px-3 py-1 rounded-full text-xs font-black border-0 focus:outline-none ${
                      member.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : member.status === 'suspended'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <option value="active">ACTIVE</option>
                    <option value="suspended">SUSPENDED</option>
                    <option value="inactive">INACTIVE</option>
                  </select>
                </td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      member.kycStatus === 'approved'
                        ? 'bg-blue-100 text-blue-800'
                        : member.kycStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {member.kycStatus.toUpperCase()}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelected(member)}
                      className="px-3 py-1 bg-[#16357a] text-white rounded-lg text-xs font-bold"
                    >
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onToggleStatus(member)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        member.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {member.status === 'active' ? 'Suspend' : 'Activate'}
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MemberDetailModal({ member, onClose, onStatusChange }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black text-[#16357a]">Member Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            ×
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <DetailRow label="Full Name" value={member.fullName} />
          <DetailRow label="Phone" value={member.phoneNumber} />
          <DetailRow label="Email" value={member.email || '—'} />
          <DetailRow label="Fayda Number" value={member.faydaNumber} />
          <DetailRow label="Status" value={member.status} />
          <DetailRow label="KYC" value={member.kycStatus} />
          <DetailRow label="Registered" value={new Date(member.registeredAt).toLocaleDateString()} />
          <DetailRow label="Last Active" value={member.lastActive ? new Date(member.lastActive).toLocaleString() : '—'} />
        </div>
        <div className="flex gap-3 mt-6">
          {member.status !== 'active' && (
            <button
              onClick={() => {
                onStatusChange(member.id, 'active');
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg"
            >
              Activate
            </button>
          )}
          {member.status === 'active' && (
            <button
              onClick={() => {
                onStatusChange(member.id, 'suspended');
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded-lg"
            >
              Suspend
            </button>
          )}
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 text-[#16357a] font-bold rounded-lg">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold text-[#16357a] capitalize">{value}</span>
    </div>
  );
}

/* ============================= KYC ============================= */

function KYCTab({ documents, onApprove, onReject }: any) {
  const [filter, setFilter] = useState<'all' | KYCDocument['status']>('all');
  const filtered = documents.filter((d: KYCDocument) => filter === 'all' || d.status === filter);

  const tabs: { id: 'all' | KYCDocument['status']; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-[#16357a]">KYC Verification</h2>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === t.id ? 'bg-[#16357a] text-white' : 'bg-white text-[#16357a] hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-md">No documents here</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc: KYCDocument) => (
          <motion.div
            key={doc.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-xl p-5 border-l-4 border-[#d4af37] shadow-md"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-black text-[#16357a]">{doc.memberName}</h3>
                <p className="text-sm text-gray-600">{doc.memberPhone}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  doc.status === 'approved'
                    ? 'bg-blue-100 text-blue-800'
                    : doc.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {doc.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm mb-1">
              Document Type: <strong className="capitalize">{doc.documentType.replace('_', ' ')}</strong>
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Submitted {new Date(doc.submittedAt).toLocaleString()}
            </p>
            {doc.rejectionReason && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2 mb-3">Reason: {doc.rejectionReason}</p>
            )}
            {doc.approvalNotes && (
              <p className="text-xs text-green-700 bg-green-50 rounded-lg p-2 mb-3">Note: {doc.approvalNotes}</p>
            )}
            {doc.status === 'pending' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onApprove(doc)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(doc)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
            {doc.status !== 'pending' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onApprove(doc)}
                  disabled={doc.status === 'approved'}
                  className="flex-1 px-4 py-2 bg-blue-50 text-[#16357a] font-bold rounded-lg disabled:opacity-40 hover:bg-blue-100"
                >
                  Re-review
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================= Disputes ============================= */

function DisputesTab({ disputes, onStatusChange, onPriorityChange }: any) {
  const [filter, setFilter] = useState<'all' | Dispute['status']>('all');
  const filtered = disputes.filter((d: Dispute) => filter === 'all' || d.status === filter);

  const statusFlow: Dispute['status'][] = ['open', 'investigating', 'resolved', 'closed'];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'investigating', label: 'Investigating' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'closed', label: 'Closed' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-[#16357a]">Dispute Management</h2>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === f.id ? 'bg-[#16357a] text-white' : 'bg-white text-[#16357a] hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-md">No disputes found</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((dispute: Dispute) => (
          <motion.div key={dispute.id} className="bg-white rounded-xl p-5 border-l-4 border-[#d4af37] shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-black text-[#16357a]">
                  {dispute.complainantName} vs {dispute.respondentName}
                </h3>
                <p className="text-sm text-gray-600">{dispute.description}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-black ${
                  dispute.priority === 'critical'
                    ? 'bg-red-100 text-red-700'
                    : dispute.priority === 'high'
                    ? 'bg-orange-100 text-orange-700'
                    : dispute.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {dispute.priority.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <span className="px-2 py-1 bg-gray-100 rounded-lg font-bold">{dispute.status.toUpperCase()}</span>
              {dispute.assignedTo && <span>Assigned: {dispute.assignedTo}</span>}
              {dispute.resolvedAt && <span>· {new Date(dispute.resolvedAt).toLocaleDateString()}</span>}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {statusFlow.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(dispute.id, s)}
                  disabled={dispute.status === s}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    dispute.status === s
                      ? 'bg-[#16357a] text-white'
                      : 'bg-gray-100 text-[#16357a] hover:bg-gray-200'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-500">Priority:</span>
              {(['low', 'medium', 'high', 'critical'] as Dispute['priority'][]).map((p) => (
                <button
                  key={p}
                  onClick={() => onPriorityChange(dispute.id, p)}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    dispute.priority === p
                      ? p === 'critical'
                        ? 'bg-red-500 text-white'
                        : p === 'high'
                        ? 'bg-orange-500 text-white'
                        : p === 'medium'
                        ? 'bg-yellow-400 text-[#16357a]'
                        : 'bg-gray-300 text-[#16357a]'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================= Finance ============================= */

function FinanceTab({ records, hasPermission, onAdd, onStatusChange }: any) {
  const [filter, setFilter] = useState<'all' | FinancialRecord['type']>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    memberName: '',
    type: 'payment' as FinancialRecord['type'],
    amount: '',
    currency: 'ETB' as FinancialRecord['currency'],
    description: '',
    status: 'completed' as FinancialRecord['status'],
  });

  const filtered = records.filter((r: FinancialRecord) => filter === 'all' || r.type === filter);
  const totals = {
    completed: records
      .filter((r: FinancialRecord) => r.status === 'completed')
      .reduce((s: number, r: FinancialRecord) => s + r.amount, 0),
    pending: records
      .filter((r: FinancialRecord) => r.status === 'pending')
      .reduce((s: number, r: FinancialRecord) => s + r.amount, 0),
    failed: records
      .filter((r: FinancialRecord) => r.status === 'failed')
      .reduce((s: number, r: FinancialRecord) => s + r.amount, 0),
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'payment', label: 'Payments' },
    { id: 'payout', label: 'Payouts' },
    { id: 'fee', label: 'Fees' },
    { id: 'refund', label: 'Refunds' },
  ];

  const submitAdd = () => {
    const amount = Number(form.amount);
    if (!form.memberName || !amount || amount <= 0) {
      window.alert('Please fill in member name and a valid amount');
      return;
    }
    onAdd({
      memberName: form.memberName,
      memberId: 'manual',
      type: form.type,
      amount,
      currency: form.currency,
      description: form.description || form.type,
      status: form.status,
    });
    setForm({ memberName: '', type: 'payment', amount: '', currency: 'ETB', description: '', status: 'completed' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-[#16357a]">Financial Records</h2>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === f.id ? 'bg-[#16357a] text-white' : 'bg-white text-[#16357a] hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700"
          >
            + Add Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-700 font-bold">Completed</p>
          <p className="text-2xl font-black text-green-800">ETB {totals.completed.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-700 font-bold">Pending</p>
          <p className="text-2xl font-black text-yellow-800">ETB {totals.pending.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700 font-bold">Failed</p>
          <p className="text-2xl font-black text-red-800">ETB {totals.failed.toLocaleString()}</p>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-green-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-[#16357a]">Add Financial Record</h3>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 font-bold">
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input
              value={form.memberName}
              onChange={(e) => setForm({ ...form, memberName: e.target.value })}
              placeholder="Member name"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="payment">Payment</option>
              <option value="payout">Payout</option>
              <option value="fee">Fee</option>
              <option value="refund">Refund</option>
            </select>
            <input
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Amount (ETB)"
              type="number"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={submitAdd}
              className="px-4 py-2 bg-[#16357a] text-white rounded-lg font-bold hover:bg-[#16357a]/90"
            >
              Save Record
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#d4af37]">
                <th className="text-left py-3 font-black text-[#16357a]">Member</th>
                <th className="text-left py-3 font-black text-[#16357a]">Type</th>
                <th className="text-left py-3 font-black text-[#16357a]">Amount</th>
                <th className="text-left py-3 font-black text-[#16357a]">Status</th>
                <th className="text-left py-3 font-black text-[#16357a]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
              {filtered.map((record: FinancialRecord) => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-[#f5f3f0] transition-all">
                  <td className="py-3">
                    <div className="font-bold text-[#16357a]">{record.memberName}</div>
                    <div className="text-xs text-gray-500">{record.description}</div>
                  </td>
                  <td className="py-3 capitalize">{record.type}</td>
                  <td className="py-3 font-bold text-[#16357a]">
                    {record.currency} {record.amount.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        record.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : record.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3">
                    {record.status !== 'completed' && (
                      <button
                        onClick={() => onStatusChange(record.id, 'completed')}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold hover:bg-green-200"
                      >
                        Mark Complete
                      </button>
                    )}
                    {record.status !== 'failed' && (
                      <button
                        onClick={() => onStatusChange(record.id, 'failed')}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 ml-2"
                      >
                        Mark Failed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================= Admin Users ============================= */

function AdminUsersTab({ admins, currentAdmin, hasPermission, onAdd, onRemove, onRoleChange }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ email: '', fullName: '', phone: '', role: 'kyc_approver' as AdminRole });

  const canManage = hasPermission('manage_admin_users');

  const submitAdd = () => {
    if (!form.email || !form.fullName) {
      window.alert('Email and full name are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      window.alert('Please enter a valid email');
      return;
    }
    onAdd(form);
    setForm({ email: '', fullName: '', phone: '', role: 'kyc_approver' });
    setShowAdd(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#16357a]">Admin Users Management</h2>
          <p className="text-gray-600">Manage admin accounts, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          disabled={!canManage}
          className="px-5 py-2.5 bg-gradient-to-r from-[#16357a] to-[#d4af37] text-white font-black rounded-full hover:shadow-lg transition-all disabled:opacity-40"
        >
          + Add New Admin
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#f5f3f0] border-2 border-[#d4af37] rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-[#16357a]">New Admin Account</h3>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 font-bold">
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Full name"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone (optional)"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="kyc_approver">KYC Approver</option>
              <option value="dispute_manager">Dispute Manager</option>
              <option value="finance_auditor">Finance Auditor</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={submitAdd}
              className="px-5 py-2 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#16357a]/90"
            >
              Create Admin
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-5 py-2 bg-gray-200 text-[#16357a] font-bold rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {admins.map((a: AdminUser) => (
          <div key={a.id} className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d4af37] to-[#27487f] flex items-center justify-center text-white font-black">
                  {a.fullName.split(' ').map((s: string) => s[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-black text-[#16357a]">
                    {a.fullName}
                    {a.id === currentAdmin.id && (
                      <span className="ml-2 text-[10px] bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">{a.email}</p>
                  <p className="text-xs text-gray-500">
                    Added {new Date(a.createdAt).toLocaleDateString()} · Last login{' '}
                    {a.lastLogin ? new Date(a.lastLogin).toLocaleDateString() : 'never'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r ${roleDisplay[a.role].color}`}>
                {roleDisplay[a.role].name}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label className="text-xs font-bold text-gray-500">Role:</label>
              <select
                value={a.role}
                onChange={(e) => onRoleChange(a.id, e.target.value as AdminRole)}
                disabled={!canManage || a.id === currentAdmin.id}
                className="px-2 py-1 border border-gray-200 rounded-lg text-xs font-bold text-[#16357a] disabled:opacity-50"
              >
                <option value="kyc_approver">KYC Approver</option>
                <option value="dispute_manager">Dispute Manager</option>
                <option value="finance_auditor">Finance Auditor</option>
                <option value="super_admin">Super Admin</option>
              </select>
              {a.id !== currentAdmin.id && (
                <button
                  onClick={() => onRemove(a.id)}
                  disabled={!canManage}
                  className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 disabled:opacity-40"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {a.permissions.slice(0, 4).map((p: string) => (
                <span key={p} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                  {p.replace(/_/g, ' ')}
                </span>
              ))}
              {a.permissions.length > 4 && (
                <span className="px-2 py-0.5 bg-gray-200 text-gray-500 rounded text-[10px] font-bold">
                  +{a.permissions.length - 4} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
