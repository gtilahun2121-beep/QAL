'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type UserRole = 'guest' | 'member' | 'admin';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profession: string;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (phoneNumber: string, pin: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  signout: () => void;
  resetPin: (phoneNumber: string, newPin: string) => Promise<void>;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profession: string;
  fayda: string;
  guarantor: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('qalnet_user');
      const storedToken = localStorage.getItem('qalnet_token');
      
      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setRole(parsedUser.role || 'member');
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('qalnet_user');
          localStorage.removeItem('qalnet_token');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const signin = useCallback(async (phoneNumber: string, pin: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful signin
      const mockUser: User = {
        id: `user_${Date.now()}`,
        firstName: 'Abebe',
        lastName: 'Tekle',
        email: 'abebe.tekle@example.com',
        phoneNumber,
        profession: 'Tech & Digital Freelancers',
        role: 'member',
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      setRole('member');
      localStorage.setItem('qalnet_user', JSON.stringify(mockUser));
      localStorage.setItem('qalnet_token', `token_${Date.now()}`);
    } catch (error) {
      throw new Error('Sign in failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful signup
      const mockUser: User = {
        id: `user_${Date.now()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profession: data.profession || 'Not specified',
        role: 'member',
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      setRole('member');
      localStorage.setItem('qalnet_user', JSON.stringify(mockUser));
      localStorage.setItem('qalnet_token', `token_${Date.now()}`);
    } catch (error) {
      throw new Error('Sign up failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signout = useCallback(() => {
    setUser(null);
    setRole('guest');
    localStorage.removeItem('qalnet_user');
    localStorage.removeItem('qalnet_token');
  }, []);

  const resetPin = useCallback(async (phoneNumber: string, newPin: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // PIN reset successful - user needs to sign in again with new PIN
      signout();
    } catch (error) {
      throw new Error('PIN reset failed');
    } finally {
      setIsLoading(false);
    }
  }, [signout]);

  const value: AuthContextType = {
    user,
    role,
    isAuthenticated: user !== null,
    isLoading,
    signin,
    signup,
    signout,
    resetPin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
