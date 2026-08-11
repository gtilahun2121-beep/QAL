/**
 * API Service
 * Centralized HTTP client for all backend API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export class APIError extends Error {
  constructor(
    public status: number,
    public data?: any,
    message?: string
  ) {
    super(message || `API Error: ${status}`);
    this.name = 'APIError';
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

/**
 * Make an API request
 */
async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...init } = options;

  // Build URL with query parameters
  let url = `${API_BASE_URL}/api/${API_VERSION}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  }

  // Get auth token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // Set default headers
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new APIError(
        response.status,
        data,
        data?.message || `HTTP ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(`API Request Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Authentication API Endpoints
 */
export const authAPI = {
  /**
   * Sign up - Create new account
   */
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    fayda?: string;
    profession?: string;
    guarantor?: string;
  }) =>
    request<{
      accessToken: string;
      refreshToken: string;
      user: any;
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Sign in - Login with phone and PIN
   */
  signin: (phoneNumber: string, pin: string) =>
    request<{
      accessToken: string;
      refreshToken: string;
      user: any;
    }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, pin }),
    }),

  /**
   * Verify OTP
   */
  verifyOTP: (phoneNumber: string, otp: string) =>
    request<{ verified: boolean }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
    }),

  /**
   * Verify Fayda ID
   */
  verifyFayda: (fayda: string) =>
    request<{ verified: boolean; name?: string }>('/auth/verify-fayda', {
      method: 'POST',
      body: JSON.stringify({ fayda }),
    }),

  /**
   * Request password reset
   */
  forgotPin: (phoneNumber: string) =>
    request<{ success: boolean; message: string }>('/auth/forgot-pin', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    }),

  /**
   * Reset PIN with OTP
   */
  resetPin: (phoneNumber: string, otp: string, newPin: string) =>
    request<{ success: boolean }>('/auth/reset-pin', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp, newPin }),
    }),

  /**
   * Refresh access token
   */
  refreshToken: (refreshToken: string) =>
    request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  /**
   * Get current user
   */
  getCurrentUser: () =>
    request<any>('/auth/me', {
      method: 'GET',
    }),

  /**
   * Logout
   */
  logout: () =>
    request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    }),
};

/**
 * User API Endpoints
 */
export const userAPI = {
  /**
   * Get current authenticated user profile
   */
  getProfile: () =>
    request<any>('/auth/me', {
      method: 'GET',
    }),

  /**
   * Update user profile (extends /auth me)
   */
  updateProfile: (userId: string, data: any) =>
    request<any>(`/auth/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

/**
 * Equb API Endpoints (matches backend /equbs routes)
 */
export const equbAPI = {
  /**
   * Get all equbs (requires auth)
   */
  getAll: () =>
    request<any[]>('/equbs', {
      method: 'GET',
    }),

  /**
   * Get equb by ID
   */
  getById: (id: string) =>
    request<any>(`/equbs/${id}`, {
      method: 'GET',
    }),

  /**
   * Create new equb
   */
  create: (data: any) =>
    request<any>('/equbs/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * List the equbs the current user is a member of
   */
  myEqubs: () =>
    request<any[]>('/equbs/member/my-equbs', {
      method: 'GET',
    }),

  /**
   * Accept an invitation to join an equb
   */
  acceptInvitation: (equbId: string) =>
    request<any>(`/equbs/${equbId}/accept-invitation`, {
      method: 'POST',
    }),

  /**
   * Invite members by phone number
   */
  inviteMembers: (equbId: string, memberPhones: string[]) =>
    request<any>(`/equbs/${equbId}/invite-members`, {
      method: 'POST',
      body: JSON.stringify({ memberPhones }),
    }),

  /**
   * Record a contribution for the current round
   */
  contribute: (equbId: string, dto: { amount: number; paymentMethod: string }) =>
    request<any>(`/equbs/${equbId}/contribute`, {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  /**
   * Member dashboard for a given equb
   */
  memberDashboard: (equbId: string) =>
    request<any>(`/equbs/${equbId}/member-dashboard`, {
      method: 'GET',
    }),

  /**
   * Payout history for an equb
   */
  payoutHistory: (equbId: string) =>
    request<any>(`/equbs/${equbId}/payout-history`, {
      method: 'GET',
    }),

  /**
   * Contribution status for a round
   */
  contributionStatus: (equbId: string) =>
    request<any>(`/equbs/${equbId}/contributions/status`, {
      method: 'GET',
    }),
};

/**
 * Wallet API Endpoints (mirror backend /api/v1/wallet)
 */
export const walletAPI = {
  /**
   * Get current user wallet balance
   */
  get: () =>
    request<{ walletId: string; balance: number; currency: string }>('/wallet', {
      method: 'GET',
    }),

  /**
   * Get the current user's own wallet transaction history
   */
  transactions: () =>
    request<{ id: string; type: string; amount: number; currency: string; note: string; status: string; createdAt: string }[]>(
      '/wallet/transactions',
      {
        method: 'GET',
      }
    ),

  /**
   * Credit wallet
   */
  deposit: (amount: number) =>
    request<{ success: boolean; message: string; balance: number; currency: string }>(
      '/wallet/deposit',
      {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }
    ),

  /**
   * Debit wallet
   */
  withdraw: (amount: number) =>
    request<{ success: boolean; message: string; balance: number; currency: string }>(
      '/wallet/withdraw',
      {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }
    ),
};

/**
 * Admin API Endpoints (guarded by the admin session token)
 */
export const adminAPI = {
  adminHeaders(): Record<string, string> {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('qalnet_admin_token') : null;
    return token ? { 'x-admin-token': token } : {};
  },

  /**
   * List every Equb on the platform (admin view)
   */
  getEqubs: () =>
    request<any[]>(`/admin/equbs`, {
      method: 'GET',
      headers: adminAPI.adminHeaders(),
    }),

  /**
   * Approve / reject / pause / complete an Equb
   */
  setEqubStatus: (equbId: string, status: string) =>
    request<any>(`/admin/equbs/${equbId}/status`, {
      method: 'POST',
      headers: adminAPI.adminHeaders(),
      body: JSON.stringify({ status }),
    }),

  /**
   * List every registered member (admin view)
   */
  getMembers: () =>
    request<any[]>(`/admin/members`, {
      method: 'GET',
      headers: adminAPI.adminHeaders(),
    }),
};

/**
 * Payment API Endpoints (mirror backend /api/v1/payments + bid)
 */
export const paymentService = {
  /**
   * Initiate wallet deduction or gateway checkout
   */
  initiate: (data: {
    equbId: string;
    roundNumber: number;
    amount: number;
    method: 'telebirr' | 'cbe' | 'wallet';
  }) =>
    request<any>('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({
        equb_id: data.equbId,
        round_number: data.roundNumber,
        payment_method: data.method === 'wallet' ? 'wallet' : 'telebirr',
      }),
    }),

  /**
   * Get pending payments for a round
   */
  getPending: (equbId: string, round?: number) =>
    request<any>(`/payments/pending?equb_id=${equbId}${round ? `&round=${round}` : ''}`, {
      method: 'GET',
    }),

  /**
   * Submit a discount bid (B_r)
   */
  bid: (equbId: string, data: any) =>
    request<any>(`/equbs/${equbId}/bid`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Verify payment status via payout history lookup
   */
  verify: (equbId: string) =>
    request<any>(`/equbs/${equbId}/payout-history`, {
      method: 'GET',
    }),
};

/**
 * Health Check
 */
export const healthAPI = {
  /**
   * Check if backend is running
   */
  check: () =>
    request<{ status: string; timestamp: string }>('/health', {
      method: 'GET',
    }),
};

export default {
  authAPI,
  userAPI,
  equbAPI,
  walletAPI,
  adminAPI,
  paymentService,
  healthAPI,
  request,
  APIError,
};
