import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import { trpc } from './trpc';
import { User } from '@/@types/user';
import { getSessionToken, removeSessionToken, setSessionToken } from './_core/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  startOAuthLogin: (provider: 'google' | 'microsoft' | 'apple') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trpcClient = trpc.useContext();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const fetchedUser = await trpcClient.auth.me.query();
      setUser(fetchedUser);
      setError(null);
    } catch (err: any) {
      setUser(null);
      setError(err.message || 'Failed to fetch user');
      removeSessionToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refresh = async () => {
    await fetchUser();
  };

  const logout = async () => {
    try {
      await trpcClient.auth.logout.mutate();
      setUser(null);
      removeSessionToken();
      // Optionally redirect to login page
      // router.replace('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
    }
  };

  const startOAuthLogin = (provider: 'google' | 'microsoft' | 'apple') => {
    // This is a placeholder. In a real app, you'd construct the OAuth URL
    // and redirect the user's browser to it. For Expo, this often involves
    // `expo-auth-session` or `expo-web-browser`.
    console.warn(`OAuth login for ${provider} not fully implemented yet.`);
    // Example: window.location.href = `/api/auth/oauth/login?provider=${provider}`;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, refresh, logout, startOAuthLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
