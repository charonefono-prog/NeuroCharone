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

// Decode JWT to check expiration
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    if (!exp) return false; // No expiration
    
    // Check if expired (add 60s buffer)
    return Date.now() >= (exp * 1000) - 60000;
  } catch (e) {
    console.error("Failed to decode token:", e);
    return true;
  }
}

// Get the API base URL depending on the platform
function getApiBaseUrl(): string {
  if (Platform.OS === "web") {
    // On web, check the current hostname to determine the API URL
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      
      // If on localhost, use localhost:3000
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000';
      }
      
      // If on Manus sandbox (8081 port), use the exposed server URL
      if (hostname.includes('8081') || hostname.includes('manus.computer')) {
        // Extract the base domain and use port 3000
        // e.g., 8081-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer -> 3000-ipwt1mvxgwoomsk324iqs-ca7ba40a.us2.manus.computer
        const baseDomain = hostname.replace(/^\d+-/, '3000-');
        return `${protocol}//${baseDomain}`;
      }
      
      // Default: use the same origin
      return `${protocol}//${hostname}`;
    }
    return "";
  }
  // On native (Expo Go), use the server URL from environment or constants
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (apiUrl) return apiUrl;
  // Default to localhost for development
  return "http://localhost:3000";
}

const API_BASE = getApiBaseUrl();

// Helper to get/set auth data with localStorage fallback
const getAuthStorage = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    return window.localStorage.getItem(key);
  }
  return AsyncStorage.getItem(key);
};

const setAuthStorage = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === "web") {
    return Promise.resolve(window.localStorage.setItem(key, value));
  } else {
    return AsyncStorage.setItem(key, value);
  }
};

const removeAuthStorage = async (key: string): Promise<void> => {
  if (Platform.OS === "web") {
    return Promise.resolve(window.localStorage.removeItem(key));
  } else {
    return AsyncStorage.removeItem(key);
  }
};

// Helper to fetch with timeout
const fetchWithTimeout = (url: string, options: RequestInit = {}, timeoutMs: number = 5000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
};

export function AuthProvider({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  console.log("[AUTH] AuthProvider mounted");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      console.log("[AUTH] Starting session restore...");
      try {
        const storedToken = await getAuthStorage("pwa_auth_token");
        const storedUser = await getAuthStorage("pwa_auth_user");
        console.log("[AUTH] Stored token:", storedToken ? "exists" : "null");
        console.log("[AUTH] Stored user:", storedUser ? "exists" : "null");
        
        if (storedToken && storedUser) {
          // Verify token is still valid by calling /me endpoint
          try {
            const response = await fetchWithTimeout(`${API_BASE}/api/pwa-auth/me`, {
              method: "GET",
              headers: { 
                "Authorization": `Bearer ${storedToken}`,
                "Content-Type": "application/json"
              },
            }, 5000);
            
            if (response.ok) {
              const data = await response.json();
              const userData: AuthUser = {
                email: data.user.email,
                name: data.user.name,
                accessLevel: data.user.accessLevel,
                isApproved: data.user.isApproved,
              };
              console.log("[AUTH] Token valid, user:", userData.email, "approved:", userData.isApproved);
              setUser(userData);
              setToken(storedToken);
            } else {
              // Token expired or invalid (401, 403, etc)
              console.warn("[AUTH] Token validation failed:", response.status);
              await removeAuthStorage("pwa_auth_token");
              await removeAuthStorage("pwa_auth_user");
              setUser(null);
              setToken(null);
            }
          } catch (validationError) {
            // Network error or timeout during validation - clear auth to be safe
            console.error("[AUTH] Token validation error:", validationError);
            await removeAuthStorage("pwa_auth_token");
            await removeAuthStorage("pwa_auth_user");
            setUser(null);
            setToken(null);
          }
        } else {
          console.log("[AUTH] No stored token/user, user is unauthenticated");
        }
      } catch (error) {
        console.error("[AUTH] Failed to restore session:", error);
        // Clear auth data on any error
        try {
          await removeAuthStorage("pwa_auth_token");
          await removeAuthStorage("pwa_auth_user");
        } catch (_) {
          // ignore
        }
      } finally {
        console.log("[AUTH] Session restore complete. isAuthenticated:", user !== null && user.isApproved === true);
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ needsApproval?: boolean }> => {
    console.log('[AUTH] Attempting login with email:', email);
    setIsLoading(true);
    try {
      console.log('[AUTH] Calling API:', `${API_BASE}/api/pwa-auth/login`);
      const response = await fetchWithTimeout(`${API_BASE}/api/pwa-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }, 8000);

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
      await setAuthStorage("pwa_auth_token", data.token);
      await setAuthStorage("pwa_auth_user", JSON.stringify(userData));

      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string): Promise<{ needsApproval?: boolean }> => {
    setIsLoading(true);
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/pwa-auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      }, 8000);

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
      // Clear auth state first
      setUser(null);
      setToken(null);
      // Then clear storage
      await removeAuthStorage("pwa_auth_token");
      await removeAuthStorage("pwa_auth_user");
      // Optional: Call logout endpoint to invalidate token server-side
      try {
        if (token) {
          await fetchWithTimeout(`${API_BASE}/api/pwa-auth/logout`, {
            method: "POST",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }, 3000);
        }
      } catch (_) {
        // Ignore logout endpoint errors
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = user !== null && user.isApproved === true;
  console.log("[AUTH] Context value updated. user:", user?.email, "isAuthenticated:", isAuthenticated);
  
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
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
