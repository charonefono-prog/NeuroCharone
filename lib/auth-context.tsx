import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
    // On web, check if we're in development (Metro dev server)
    // In dev, use absolute URL to the backend server
    // In production, use relative URL
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3000';
    }
    return "";
  }
  // On native, use the server URL from environment
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (apiUrl) return apiUrl;
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
    window.localStorage.setItem(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

const removeAuthStorage = async (key: string): Promise<void> => {
  if (Platform.OS === "web") {
    window.localStorage.removeItem(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};

// Helper to fetch with timeout
const fetchWithTimeout = (url: string, options: RequestInit = {}, timeoutMs: number = 5000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("[AUTH] AuthProvider mounted");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      console.log("[AUTH] Starting session restore...");
      let restoredUser: AuthUser | null = null;
      let restoredToken: string | null = null;
      
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
              restoredUser = {
                email: data.user.email,
                name: data.user.name,
                accessLevel: data.user.accessLevel,
                isApproved: data.user.isApproved,
              };
              restoredToken = storedToken;
              console.log("[AUTH] Token valid, user:", restoredUser.email, "approved:", restoredUser.isApproved);
            } else {
              // Token expired or invalid (401, 403, etc)
              console.warn("[AUTH] Token validation failed:", response.status);
              await removeAuthStorage("pwa_auth_token");
              await removeAuthStorage("pwa_auth_user");
            }
          } catch (validationError) {
            // Network error or timeout during validation - clear auth to be safe
            console.error("[AUTH] Token validation error:", validationError);
            await removeAuthStorage("pwa_auth_token");
            await removeAuthStorage("pwa_auth_user");
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
        // Set state after restoration is complete
        setUser(restoredUser);
        setToken(restoredToken);
        console.log("[AUTH] Session restore complete. isAuthenticated:", restoredUser !== null && restoredUser.isApproved === true);
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
      console.log('[AUTH] Login successful');
      return {};
    } catch (error) {
      console.error('[AUTH] Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string): Promise<{ needsApproval?: boolean }> => {
    console.log('[AUTH] Attempting registration with email:', email);
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

      // After registration, user needs approval
      return { needsApproval: true };
    } catch (error) {
      console.error('[AUTH] Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('[AUTH] Logging out');
    try {
      if (token) {
        await fetchWithTimeout(`${API_BASE}/api/pwa-auth/logout`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }, 5000);
      }
    } catch (error) {
      console.error('[AUTH] Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      setUser(null);
      setToken(null);
      await removeAuthStorage("pwa_auth_token");
      await removeAuthStorage("pwa_auth_user");
      console.log('[AUTH] Logout complete');
    }
  };

  const isAuthenticated = user !== null && user.isApproved === true;

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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
