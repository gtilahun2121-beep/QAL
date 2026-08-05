/**
 * Auth Service Layer
 * Handles all authentication business logic, validation, and data persistence
 * Separated from UI components for testability and reusability
 */

import { EqubCategory } from '@/app/data/equbCategories';

// Types
export interface RegistrationData {
  equbId: string;
  phoneNumber: string;
  fullName: string;
  pin: string;
  faydaNumber: string;
}

export interface LoginCredentials {
  phoneNumber: string;
  pin: string;
}

export interface UserAccount extends RegistrationData {
  id: string;
  registeredAt: string;
  equbDetails?: EqubCategory;
}

export interface AdminCredentials {
  email: string;
  masterPassword: string;
}

export interface AdminUser {
  id: string;
  email: string;
  masterPassword: string;
  role: 'super_admin' | 'kyc_approver' | 'dispute_manager' | 'finance_auditor';
  permissions: string[];
  lastLogin?: string;
}

// Auth Service Class
export class AuthService {
  private static readonly STORAGE_PREFIX = 'qalnet_';
  private static readonly USER_KEY = `${AuthService.STORAGE_PREFIX}user_`;
  private static readonly AUTH_TOKEN_KEY = `${AuthService.STORAGE_PREFIX}auth_token`;
  private static readonly ADMIN_KEY = `${AuthService.STORAGE_PREFIX}admin`;

  /**
   * Registration Service
   */
  static async registerUser(data: RegistrationData): Promise<UserAccount> {
    // Validate input
    this.validateRegistrationData(data);

    // Check if user already exists
    if (this.userExists(data.phoneNumber)) {
      throw new Error('User already registered with this phone number');
    }

    // Create user account
    const userAccount: UserAccount = {
      ...data,
      id: this.generateUserId(),
      registeredAt: new Date().toISOString(),
    };

    // Persist to storage
    this.persistUser(userAccount);

    // Set auth token
    this.setAuthToken(data.phoneNumber);

    return userAccount;
  }

  /**
   * Login Service
   */
  static async loginUser(credentials: LoginCredentials): Promise<UserAccount> {
    // Validate credentials
    this.validateLoginCredentials(credentials);

    // Retrieve user
    const user = this.getUserByPhone(credentials.phoneNumber);
    if (!user) {
      throw new Error('User not found. Please register first');
    }

    // Verify PIN
    if (user.pin !== credentials.pin) {
      throw new Error('Invalid PIN. Please try again');
    }

    // Set auth token
    this.setAuthToken(credentials.phoneNumber);

    return user;
  }

  /**
   * Forgot PIN Service
   */
  static async resetPin(phoneNumber: string, newPin: string): Promise<void> {
    // Validate phone and PIN
    if (!this.isValidPhone(phoneNumber)) {
      throw new Error('Invalid phone number');
    }
    if (!this.isValidPin(newPin)) {
      throw new Error('PIN must be exactly 4 digits');
    }

    // Get user
    const user = this.getUserByPhone(phoneNumber);
    if (!user) {
      throw new Error('User not found');
    }

    // Update PIN
    user.pin = newPin;
    this.persistUser(user);
  }

  /**
   * Admin Authentication Service
   */
  static async adminLogin(credentials: AdminCredentials): Promise<AdminUser> {
    // In production: validate against secure backend
    const admin = this.getAdminByEmail(credentials.email);
    if (!admin) {
      throw new Error('Admin account not found');
    }

    if (admin.masterPassword !== credentials.masterPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    admin.lastLogin = new Date().toISOString();
    this.persistAdmin(admin);

    return admin;
  }

  /**
   * User Retrieval
   */
  static getCurrentUser(): UserAccount | null {
    const token = this.getAuthToken();
    if (!token) return null;
    return this.getUserByPhone(token);
  }

  static getUserByPhone(phoneNumber: string): UserAccount | null {
    try {
      const data = localStorage.getItem(`${this.USER_KEY}${phoneNumber}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static userExists(phoneNumber: string): boolean {
    return this.getUserByPhone(phoneNumber) !== null;
  }

  /**
   * Admin Retrieval
   */
  static getAdminByEmail(email: string): AdminUser | null {
    try {
      // In production: fetch from secure backend
      const admins = this.getAllAdmins();
      return admins.find((a) => a.email === email) || null;
    } catch {
      return null;
    }
  }

  static getAllAdmins(): AdminUser[] {
    try {
      const data = localStorage.getItem(this.ADMIN_KEY);
      return data ? JSON.parse(data) : this.getDefaultAdmins();
    } catch {
      return this.getDefaultAdmins();
    }
  }

  /**
   * Validation Methods
   */
  private static validateRegistrationData(data: RegistrationData): void {
    if (!data.equbId) throw new Error('Equb selection is required');
    if (!this.isValidPhone(data.phoneNumber)) throw new Error('Invalid phone number');
    if (!data.fullName?.trim()) throw new Error('Full name is required');
    if (!this.isValidPin(data.pin)) throw new Error('PIN must be exactly 4 digits');
    if (!data.faydaNumber?.trim()) throw new Error('Fayda number is required');
  }

  private static validateLoginCredentials(credentials: LoginCredentials): void {
    if (!this.isValidPhone(credentials.phoneNumber)) {
      throw new Error('Invalid phone number format');
    }
    if (!this.isValidPin(credentials.pin)) {
      throw new Error('PIN must be exactly 4 digits');
    }
  }

  static isValidPhone(phone: string): boolean {
    return /^\+?[1-9]\d{1,14}$/.test(phone);
  }

  static isValidPin(pin: string): boolean {
    return /^\d{4}$/.test(pin);
  }

  /**
   * Token Management
   */
  private static setAuthToken(phoneNumber: string): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, phoneNumber);
  }

  private static getAuthToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  static clearAuthToken(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  /**
   * Persistence
   */
  private static persistUser(user: UserAccount): void {
    localStorage.setItem(`${this.USER_KEY}${user.phoneNumber}`, JSON.stringify(user));
  }

  private static persistAdmin(admin: AdminUser): void {
    const admins = this.getAllAdmins();
    const index = admins.findIndex((a) => a.id === admin.id);
    if (index >= 0) {
      admins[index] = admin;
    } else {
      admins.push(admin);
    }
    localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admins));
  }

  /**
   * Utility
   */
  private static generateUserId(): string {
    return `USER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getDefaultAdmins(): AdminUser[] {
    return [
      {
        id: 'admin_1',
        email: 'super@qalnet.com',
        role: 'super_admin',
        masterPassword: 'master123',
        permissions: ['all'],
      },
      {
        id: 'admin_2',
        email: 'kyc@qalnet.com',
        role: 'kyc_approver',
        masterPassword: 'kyc123',
        permissions: ['approve_kyc', 'view_members'],
      },
      {
        id: 'admin_3',
        email: 'dispute@qalnet.com',
        role: 'dispute_manager',
        masterPassword: 'dispute123',
        permissions: ['manage_disputes', 'view_transactions'],
      },
      {
        id: 'admin_4',
        email: 'finance@qalnet.com',
        role: 'finance_auditor',
        masterPassword: 'finance123',
        permissions: ['view_finance', 'audit_reports'],
      },
    ];
  }
}

export default AuthService;
