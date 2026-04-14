import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "./trpc";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: "user" | "admin" | "pending";
  specialty?: string;
  professionalId?: string;
  photoUrl?: string;
  isApproved?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    fullName: string,
    password: string,
    specialty?: string,
    professionalId?: string,
    inviteCode?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recuperar usuário do AsyncStorage na inicialização
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("auth_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await trpc.auth.login.mutate({
        email,
        password,
      });

      if (!result.success) {
        throw new Error(result.reason || "Login failed");
      }

      const userData: AuthUser = {
        id: result.user!.id,
        email: result.user!.email,
        fullName: result.user!.fullName,
        role: result.user!.role,
        specialty: result.user!.specialty,
        professionalId: result.user!.professionalId,
      };

      setUser(userData);
      await AsyncStorage.setItem("auth_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  // Register
  const register = useCallback(
    async (
      email: string,
      fullName: string,
      password: string,
      specialty?: string,
      professionalId?: string,
      inviteCode?: string
    ) => {
      try {
        const result = await trpc.auth.register.mutate({
          email,
          fullName,
          password,
          specialty,
          professionalId,
          inviteCode,
        });

        if (!result.success) {
          throw new Error(result.message || "Registration failed");
        }

        // Após registro, usuário precisa ser aprovado antes de fazer login
        // Então apenas limpamos o estado
        setUser(null);
        await AsyncStorage.removeItem("auth_user");
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    []
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await trpc.auth.logout.mutate();
      setUser(null);
      await AsyncStorage.removeItem("auth_user");
    } catch (error) {
      console.error("Logout error:", error);
      // Mesmo se falhar, limpar localmente
      setUser(null);
      await AsyncStorage.removeItem("auth_user");
    }
  }, []);

  // Refresh user (obter dados atualizados do servidor)
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await trpc.auth.me.query();
      if (currentUser) {
        const userData: AuthUser = {
          id: currentUser.id,
          email: currentUser.email,
          fullName: currentUser.fullName,
          role: currentUser.role,
          specialty: currentUser.specialty,
          professionalId: currentUser.professionalId,
          photoUrl: currentUser.photoUrl,
          isApproved: currentUser.isApproved,
        };
        setUser(userData);
        await AsyncStorage.setItem("auth_user", JSON.stringify(userData));
      } else {
        setUser(null);
        await AsyncStorage.removeItem("auth_user");
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      await AsyncStorage.removeItem("auth_user");
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
