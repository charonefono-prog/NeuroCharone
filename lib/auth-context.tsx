import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpc } from './trpc';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuário ao iniciar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const isAuth = await AsyncStorage.getItem('isAuthenticated');
      if (isAuth === 'true') {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
          setError(null);
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar usuário:', err);
      setError(err.message || 'Erro ao carregar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: AuthUser) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      setUser(userData);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      setError(err.message || 'Erro ao fazer login');
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Removendo dados do AsyncStorage...');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('isAuthenticated');
      console.log('AuthContext: Limpando estado do usuário...');
      setUser(null);
      setError(null);
      console.log('AuthContext: Logout concluído');
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err);
      setError(err.message || 'Erro ao fazer logout');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
