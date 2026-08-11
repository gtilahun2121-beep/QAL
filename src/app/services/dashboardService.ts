/**
 * Dashboard Service
 * DB-backed per-user dashboard state.
 *
 * Reads the user's real Equbs, wallet balance and contribution/payout history
 * from the backend API and caches a mirror in localStorage so the dashboard,
 * wallet, my-equbs and join-equb pages stay in sync and work offline.
 */

import { equbAPI, walletAPI } from '@/app/services/api';

export interface DashboardEqub {
  id: string;
  name: string;
  members: number;
  position: number;
  contribution: number;
  nextPaymentDate: string; // ISO date
  nextPayout: string;      // human label, e.g. "3 months"
  status: 'active' | 'pending_contribution' | 'pending' | 'rejected';
  category?: string;
  description?: string;
  manager?: boolean;
}

export interface DashboardTransaction {
  id: string;
  type: 'Payment' | 'Payout' | 'Deposit' | 'Withdrawal';
  equb: string;
  amount: number; // positive = credit, negative = debit
  date: string;   // ISO date
  status: 'Completed' | 'Pending';
}

export interface DashboardNotification {
  id: string;
  title: string;
  time: string;
  type: string;
}

export interface DashboardActivity {
  id: string;
  action: string;
  time: string;
}

export interface DashboardState {
  walletBalance: number;
  equbs: DashboardEqub[];
  transactions: DashboardTransaction[];
  notifications: DashboardNotification[];
  activity: DashboardActivity[];
  startedSteps: string[];
}

export interface AvailableEqub {
  name: string;
  size: number;
  contribution: number;
  durationMonths: number;
  openSlots: number;
  category: string;
  description: string;
}

export const AVAILABLE_EQUBS: AvailableEqub[] = [
  {
    name: 'Silver Savers',
    size: 8,
    contribution: 5000,
    durationMonths: 12,
    openSlots: 2,
    category: 'Savings',
    description: 'A steady monthly savings circle for families.',
  },
  {
    name: 'Business Boost',
    size: 15,
    contribution: 10000,
    durationMonths: 18,
    openSlots: 3,
    category: 'Business',
    description: 'Capital pooling for small business owners.',
  },
  {
    name: 'Education Fund',
    size: 10,
    contribution: 7500,
    durationMonths: 12,
    openSlots: 1,
    category: 'Education',
    description: 'Save together for school and tuition costs.',
  },
  {
    name: 'Family Circle',
    size: 12,
    contribution: 6000,
    durationMonths: 24,
    openSlots: 4,
    category: 'Community',
    description: 'A long-term community savings circle.',
  },
  {
    name: 'Emergency Fund',
    size: 6,
    contribution: 3000,
    durationMonths: 12,
    openSlots: 5,
    category: 'Savings',
    description: 'Quick-access savings for unexpected expenses.',
  },
  {
    name: 'Investment Club',
    size: 20,
    contribution: 15000,
    durationMonths: 36,
    openSlots: 0,
    category: 'Business',
    description: 'High-contribution circle for serious investors.',
  },
];

const STORAGE_PREFIX = 'qalnet_dashboard_';

export const makeId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const today = (): string => new Date().toISOString();

/**
 * Neutral, per-user default dashboard state.
 *
 * Security / privacy: every account starts empty with their own ETB 0 wallet.
 * No fake or shared data is shown — each member only ever sees their own
 * balance, equbs and transactions loaded from the backend.
 */
function seedState(): DashboardState {
  return {
    walletBalance: 0,
    equbs: [],
    transactions: [],
    notifications: [],
    activity: [],
    startedSteps: [],
  };
}

export const DashboardService = {
  storageKey(userId: string): string {
    return `${STORAGE_PREFIX}${userId}`;
  },

  loadState(userId: string): DashboardState {
    if (typeof window === 'undefined') return seedState();
    try {
      const raw = localStorage.getItem(this.storageKey(userId));
      if (raw) {
        return { ...seedState(), ...(JSON.parse(raw) as DashboardState) };
      }
    } catch (error) {
      console.error('Failed to load dashboard state:', error);
    }
    return seedState();
  },

  persist(userId: string, state: DashboardState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey(userId), JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
    }
  },

  /**
   * Load real DB-backed dashboard state from the backend API and merge it
   * with any locally persisted preferences (notifications, activity, steps).
   * Falls back to local state if the API is unreachable.
   */
  async loadFromApi(userId: string): Promise<DashboardState> {
    const local = this.loadState(userId);

    try {
      const [equbs, wallet, walletTxns] = await Promise.all([
        equbAPI.myEqubs(),
        walletAPI.get(),
        walletAPI.transactions().catch(() => [] as any[]),
      ]);

      const dashboardState: DashboardState = {
        ...local,
        walletBalance: wallet ? Number(wallet.balance) : local.walletBalance,
        equbs: equbs.map((e: any) => this.toDashboardEqub(e, userId)),
      };

      // Build transaction history from the user's OWN wallet activity and
      // their equb contributions — never from shared/seed data.
      const equbTxns = await this.fetchTransactionsEqubs(dashboardState.equbs);
      const mergedTxns = this.mergeTransactions(walletTxns, equbTxns);
      if (mergedTxns.length > 0) {
        dashboardState.transactions = mergedTxns;
      }

      // Keep a mirror so the UI is instant on next visit.
      this.persist(userId, dashboardState);
      return dashboardState;
    } catch (error) {
      console.warn('Dashboard API load failed, using local state:', error);
      return local;
    }
  },

  /**
   * Merges wallet deposits/withdrawals with equb contribution payments into
   * one per-user transaction list, newest first.
   */
  mergeTransactions(walletTxns: any[], equbTxns: DashboardTransaction[]): DashboardTransaction[] {
    const mapped: DashboardTransaction[] = (walletTxns || []).map((tx: any) => ({
      id: `wallet_${tx.id || `${Date.now()}_${Math.random()}`}`,
      type: tx.type === 'Deposit' ? 'Deposit' : tx.type === 'Withdrawal' ? 'Withdrawal' : 'Payment',
      equb: tx.note || 'Wallet',
      amount: Number(tx.amount) || 0,
      date: tx.createdAt || new Date().toISOString(),
      status: 'Completed',
    }));

    return [...mapped, ...equbTxns].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 30);
  },

  /**
   * Maps a backend equb record (toEqubResponse shape) into the DashboardEqub UI model.
   */
  toDashboardEqub(e: any, userId: string): DashboardEqub {
    const cycleDays = Number(e.frequency || 30) || 30;
    const currentRound = Number(e.currentRound) || 1;
    const base = e.startDate ? new Date(e.startDate).getTime() : Date.now();
    const nextPaymentDate = new Date(
      base + (currentRound - 1) * cycleDays * 86400000
    ).toISOString().split('T')[0];

    return {
      id: e.id,
      name: e.name,
      members: Number(e.totalMembers) || 0,
      position: currentRound,
      contribution: Number(e.contributionAmount) || 0,
      nextPaymentDate,
      nextPayout:
        e.status === 'active' && Number(e.totalMembers) > 1
          ? `${Math.max(1, Math.ceil((Number(e.totalMembers) || currentRound) / 2))} months`
          : '—',
      status:
        e.status === 'active'
          ? 'active'
          : e.status === 'pending'
            ? 'pending'
            : e.status === 'rejected'
              ? 'rejected'
              : 'pending_contribution',
      category: e.category,
      description: e.description,
      manager: Boolean(e.isManager),
    };
  },

  /**
   * Builds transaction rows from each equb's contribution/payout data in the DB.
   */
  async fetchTransactionsEqubs(equbs: DashboardEqub[]): Promise<DashboardTransaction[]> {
    const txns: DashboardTransaction[] = [];

    await Promise.all(
      equbs.map(async (equb) => {
        try {
          const dashboard = await equbAPI.memberDashboard(equb.id);
          const contributed = Number(dashboard?.totalPaid) || 0;
          const count = Number(dashboard?.contributionsMade) || 0;

          if (count > 0 && contributed > 0) {
            txns.push({
              id: `db_txn_pay_${equb.id}`,
              type: 'Payment',
              equb: equb.name,
              amount: -contributed,
              date: equb.nextPaymentDate,
              status: 'Completed',
            });
          }
        } catch {
          // Skip equbs that fail to load their dashboard detail.
        }
      })
    );

    return txns.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 20);
  },

  addNotification(
    state: DashboardState,
    n: Omit<DashboardNotification, 'id' | 'time'>
  ): DashboardState {
    return {
      ...state,
      notifications: [
        { ...n, id: makeId(), time: 'Just now' },
        ...state.notifications,
      ].slice(0, 10),
    };
  },

  addActivity(
    state: DashboardState,
    a: Omit<DashboardActivity, 'id' | 'time'>
  ): DashboardState {
    return {
      ...state,
      activity: [{ ...a, id: makeId(), time: 'Just now' }, ...state.activity].slice(
        0,
        10
      ),
    };
  },

  addTransaction(
    state: DashboardState,
    t: Omit<DashboardTransaction, 'id'>
  ): DashboardState {
    return {
      ...state,
      transactions: [{ ...t, id: makeId(), date: t.date || today() }, ...state.transactions].slice(0, 20),
    };
  },
};

export default DashboardService;
