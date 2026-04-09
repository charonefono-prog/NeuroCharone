import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

interface AuthUser {
  email: string;
  name: string;
  accessLevel: "user" | "professional" | "admin";
  isApproved: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ needsApproval?: boolean }>;
  register: (email: string, name: string, password: string) => Promise<{ needsApproval?: boolean }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get the API base URL depending on the platform
function getApiBaseUrl(): string {
  if (Platform.OS === "web") {
    // On web, use relative URL (works both in dev and production)
    return "";
  }
  // On native, use the server URL from environment
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (apiUrl) return apiUrl;
  return "http://localhost:3000";
}

const API_BASE = getApiBaseUrl();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("pwa_auth_token");
        const storedUser = await AsyncStorage.getItem("pwa_auth_user");
        if (storedToken && storedUser) {
          // Verify token is still valid
          const response = await fetch(`${API_BASE}/api/pwa-auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (response.ok) {
            const data = await response.json();
            const userData: AuthUser = {
              email: data.user.email,
              name: data.user.name,
              accessLevel: data.user.accessLevel,
              isApproved: data.user.isApproved,
            };
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token expired or invalid
            await AsyncStorage.removeItem("pwa_auth_token");
            await AsyncStorage.removeItem("pwa_auth_user");
          }
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        // If network error, still try to use stored user for offline access
        try {
          const storedUser = await AsyncStorage.getItem("pwa_auth_user");
          const storedToken = await AsyncStorage.getItem("pwa_auth_token");
          if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          }
        } catch (_) {
          // ignore
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ needsApproval?: boolean }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/pwa-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsApproval) {
          return { needsApproval: true };
        }
        throw new Error(data.error || "Falha no login");
      }

      const userData: AuthUser = {
        email: data.user.email,
        name: data.user.name,
        accessLevel: data.user.accessLevel,
        isApproved: data.user.isApproved,
      };

      setUser(userData);
      setToken(data.token);
      await AsyncStorage.setItem("pwa_auth_token", data.token);
      await AsyncStorage.setItem("pwa_auth_user", JSON.stringify(userData));

      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string): Promise<{ needsApproval?: boolean }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/pwa-auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha no registro");
      }

      // If auto-approved (admin), log in automatically
      if (data.user?.isApproved) {
        const userData: AuthUser = {
          email: data.user.email,
          name: data.user.name,
          accessLevel: data.user.accessLevel,
          isApproved: true,
        };
        setUser(userData);
        setToken(data.token);
        await AsyncStorage.setItem("pwa_auth_token", data.token);
        await AsyncStorage.setItem("pwa_auth_user", JSON.stringify(userData));
        return {};
      }

      // Needs approval
      return { needsApproval: true };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("pwa_auth_token");
      await AsyncStorage.removeItem("pwa_auth_user");
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: user !== null && user.isApproved,
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
