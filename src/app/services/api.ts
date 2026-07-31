// ========================================================================
// API SERVICE LAYER - QALNET ENTERPRISE BACKEND INTEGRATION
// ========================================================================

import { 
  User, 
  AuthToken, 
  AuthCredentials, 
  Wallet, 
  CreditScore, 
  EqubGroup, 
  Payment, 
  Payout,
  type Notification,
  ReconciliationTicket 
} from '../data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const API_TIMEOUT = 30000; // 30 seconds

interface ApiErrorResponse {
  status: number;
  error: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add JWT token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers instanceof Object ? Object.fromEntries(
        options.headers instanceof Headers ? options.headers.entries() : Object.entries(options.headers as Record<string, string>)
      ) : {}) },
      signal: controller.signal,
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json().catch(() => ({
        status: response.status,
        error: response.statusText,
      }));
      throw new ApiError(response.status, error.message || error.error, error);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// ========================================================================
// AUTHENTICATION SERVICES
// ========================================================================

export const authService = {
  async register(phone: string, email: string, password: string): Promise<User> {
    return apiCall<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, email, password }),
    });
  },

  async login(credentials: AuthCredentials): Promise<AuthToken> {
    const token = await apiCall<AuthToken>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token.accessToken);
      if (token.refreshToken) {
        localStorage.setItem('refreshToken', token.refreshToken);
      }
    }

    return token;
  },

  async verifyOtp(phone: string, otp: string): Promise<AuthToken> {
    return apiCall<AuthToken>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  async requestOtp(phone: string): Promise<{ message: string }> {
    return apiCall<{ message: string }>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async getCurrentUser(): Promise<User> {
    return apiCall<User>('/auth/me', { method: 'GET' });
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    await apiCall('/auth/logout', { method: 'POST' });
  },

  async refreshToken(): Promise<AuthToken> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    if (!refreshToken) {
      throw new ApiError(401, 'No refresh token available');
    }

    const token = await apiCall<AuthToken>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token.accessToken);
    }
    return token;
  },
};

// ========================================================================
// WALLET SERVICES
// ========================================================================

export const walletService = {
  async getWallet(): Promise<Wallet> {
    return apiCall<Wallet>('/wallets/me', { method: 'GET' });
  },

  async linkBankAccount(accountDetails: {
    bankCode: string;
    accountNumber: string;
  }): Promise<{ id: string; status: string }> {
    return apiCall<{ id: string; status: string }>('/wallets/link-bank', {
      method: 'POST',
      body: JSON.stringify(accountDetails),
    });
  },

  async getLinkedAccounts(): Promise<any[]> {
    return apiCall<any[]>('/wallets/linked-accounts', { method: 'GET' });
  },

  async getTransactionHistory(limit = 50, offset = 0): Promise<any[]> {
    return apiCall<any[]>(`/wallets/transactions?limit=${limit}&offset=${offset}`, {
      method: 'GET',
    });
  },
};

// ========================================================================
// CREDIT & TRUST SERVICES
// ========================================================================

export const creditService = {
  async getCreditScore(): Promise<CreditScore> {
    return apiCall<CreditScore>('/credit/score', { method: 'GET' });
  },

  async getTrustBadges(): Promise<{ badges: string[] }> {
    return apiCall<{ badges: string[] }>('/credit/badges', { method: 'GET' });
  },

  async getPaymentHistory(): Promise<any[]> {
    return apiCall<any[]>('/credit/payment-history', { method: 'GET' });
  },
};

// ========================================================================
// EQUB & POOL SERVICES
// ========================================================================

export const equbService = {
  async getActiveEqubs(): Promise<EqubGroup[]> {
    return apiCall<EqubGroup[]>('/equbs/active', { method: 'GET' });
  },

  async getDiscoverEqubs(filters?: {
    minContribution?: number;
    maxContribution?: number;
    cycleFrequency?: string;
  }): Promise<EqubGroup[]> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    return apiCall<EqubGroup[]>(`/equbs/discover?${query}`, { method: 'GET' });
  },

  async getEqubDetails(equbId: string): Promise<EqubGroup> {
    return apiCall<EqubGroup>(`/equbs/${equbId}`, { method: 'GET' });
  },

  async createEqub(data: {
    name: string;
    description?: string;
    totalAmount: number;
    contributionAmount: number;
    cycleDays: number;
    totalRounds: number;
    payoutMechanism: 'lottery' | 'auction';
  }): Promise<EqubGroup> {
    return apiCall<EqubGroup>('/equbs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async joinEqub(equbId: string, options?: {
    autoDebit?: boolean;
  }): Promise<{ id: string; status: string }> {
    return apiCall<{ id: string; status: string }>(`/equbs/${equbId}/join`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    });
  },

  async leaveEqub(equbId: string): Promise<{ status: string }> {
    return apiCall<{ status: string }>(`/equbs/${equbId}/leave`, {
      method: 'POST',
    });
  },

  async getMembers(equbId: string): Promise<any[]> {
    return apiCall<any[]>(`/equbs/${equbId}/members`, { method: 'GET' });
  },

  async getEqubParticipationLedger(): Promise<any[]> {
    return apiCall<any[]>('/equbs/participation-ledger', { method: 'GET' });
  },
};

// ========================================================================
// PAYMENT SERVICES
// ========================================================================

export const paymentService = {
  async initiatePayment(equbId: string, roundNumber: number): Promise<{
    paymentId: string;
    gatewayUrl: string;
    amount: number;
  }> {
    return apiCall<{
      paymentId: string;
      gatewayUrl: string;
      amount: number;
    }>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ equbId, roundNumber }),
    });
  },

  async confirmPayment(paymentId: string, reference: string): Promise<Payment> {
    return apiCall<Payment>('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentId, reference }),
    });
  },

  async setupAutoDebit(equbId: string, bankAccount: {
    bankCode: string;
    accountNumber: string;
  }): Promise<{ status: string; token: string }> {
    return apiCall<{ status: string; token: string }>('/payments/setup-auto-debit', {
      method: 'POST',
      body: JSON.stringify({ equbId, bankAccount }),
    });
  },

  async getPayments(equbId?: string): Promise<Payment[]> {
    const query = equbId ? `?equbId=${equbId}` : '';
    return apiCall<Payment[]>(`/payments${query}`, { method: 'GET' });
  },

  async getPaymentStatus(paymentId: string): Promise<Payment> {
    return apiCall<Payment>(`/payments/${paymentId}`, { method: 'GET' });
  },

  async handleWebhook(data: any): Promise<{ status: string }> {
    return apiCall<{ status: string }>('/payments/webhook', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ========================================================================
// PAYOUT & LOTTERY SERVICES
// ========================================================================

export const payoutService = {
  async getPayouts(equbId: string): Promise<Payout[]> {
    return apiCall<Payout[]>(`/payouts?equbId=${equbId}`, { method: 'GET' });
  },

  async getPayout(payoutId: string): Promise<Payout> {
    return apiCall<Payout>(`/payouts/${payoutId}`, { method: 'GET' });
  },

  async getLotteryDraw(equbId: string, roundNumber: number): Promise<any> {
    return apiCall<any>(`/payouts/lottery/${equbId}/${roundNumber}`, {
      method: 'GET',
    });
  },

  async placeBid(equbId: string, roundNumber: number, bidAmount: number): Promise<{
    bidId: string;
    status: string;
  }> {
    return apiCall<{ bidId: string; status: string }>('/payouts/place-bid', {
      method: 'POST',
      body: JSON.stringify({ equbId, roundNumber, bidAmount }),
    });
  },

  async approvePayout(payoutId: string): Promise<{ status: string }> {
    return apiCall<{ status: string }>(`/payouts/${payoutId}/approve`, {
      method: 'POST',
    });
  },

  async tradeWinningSlot(equbId: string, roundNumber: number, buyerUserId: string, premiumPrice: number): Promise<{
    tradeId: string;
    status: string;
  }> {
    return apiCall<{ tradeId: string; status: string }>('/payouts/trade-slot', {
      method: 'POST',
      body: JSON.stringify({ equbId, roundNumber, buyerUserId, premiumPrice }),
    });
  },
};

// ========================================================================
// NOTIFICATION SERVICES
// ========================================================================

export const notificationService = {
  async getNotifications(limit = 50, offset = 0): Promise<Notification[]> {
    return apiCall<Notification[]>(
      `/notifications?limit=${limit}&offset=${offset}`,
      { method: 'GET' }
    );
  },

  async markAsRead(notificationId: string): Promise<{ status: string }> {
    return apiCall<{ status: string }>(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  },

  async markAllAsRead(): Promise<{ status: string }> {
    return apiCall<{ status: string }>('/notifications/read-all', {
      method: 'POST',
    });
  },

  async deleteNotification(notificationId: string): Promise<{ status: string }> {
    return apiCall<{ status: string }>(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },

  subscribeToSSE(callback: (data: Notification) => void): { close: () => void } {
    if (typeof window === 'undefined') {
      return { close: () => {} };
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    let eventSource: EventSource | null = null;
    
    try {
      eventSource = new EventSource(
        `${API_BASE_URL}/notifications/stream?token=${token}`
      );

      eventSource.onmessage = (event) => {
        try {
          const notif = JSON.parse(event.data) as Notification;
          callback(notif);
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      };

      eventSource.onerror = () => {
        console.error('SSE connection error');
        if (eventSource) {
          eventSource.close();
        }
      };
    } catch (error) {
      console.error('Failed to initialize SSE:', error);
    }

    return {
      close: () => {
        if (eventSource) {
          eventSource.close();
        }
      },
    };
  },
};

// ========================================================================
// SUPPORT & RECONCILIATION SERVICES
// ========================================================================

export const supportService = {
  async createTicket(data: {
    category: string;
    subject: string;
    description: string;
    attachments?: File[];
  }): Promise<ReconciliationTicket> {
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('subject', data.subject);
    formData.append('description', data.description);

    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const response = await fetch(`${API_BASE_URL}/support/tickets`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to create support ticket');
    }

    return response.json();
  },

  async getTickets(): Promise<ReconciliationTicket[]> {
    return apiCall<ReconciliationTicket[]>('/support/tickets', { method: 'GET' });
  },

  async getTicket(ticketId: string): Promise<ReconciliationTicket> {
    return apiCall<ReconciliationTicket>(`/support/tickets/${ticketId}`, {
      method: 'GET',
    });
  },

  async addTicketComment(ticketId: string, comment: string): Promise<{ status: string }> {
    return apiCall<{ status: string }>(`/support/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  },

  async reconcilePayment(data: {
    transactionReference: string;
    reportedAmount: number;
    bankReference?: string;
  }): Promise<{ status: string; ticketId: string }> {
    return apiCall<{ status: string; ticketId: string }>('/support/reconcile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ========================================================================
// SOCIAL & GOVERNANCE SERVICES
// ========================================================================

export const socialService = {
  async getProposals(equbId: string): Promise<any[]> {
    return apiCall<any[]>(`/social/proposals?equbId=${equbId}`, {
      method: 'GET',
    });
  },

  async createProposal(equbId: string, data: {
    title: string;
    description: string;
    budget: number;
  }): Promise<{ id: string; status: string }> {
    return apiCall<{ id: string; status: string }>('/social/proposals', {
      method: 'POST',
      body: JSON.stringify({ equbId, ...data }),
    });
  },

  async voteOnProposal(proposalId: string, vote: boolean): Promise<{ status: string }> {
    return apiCall<{ status: string }>(`/social/proposals/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote }),
    });
  },
};

export default {
  authService,
  walletService,
  creditService,
  equbService,
  paymentService,
  payoutService,
  notificationService,
  supportService,
  socialService,
};
