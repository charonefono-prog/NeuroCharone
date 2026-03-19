import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthUser {
  id?: number;
  email: string;
  fullName?: string;
  name?: string;
  role?: "user" | "admin";
  accessLevel?: "user" | "professional" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("auth_user");
        const storedToken = await AsyncStorage.getItem("auth_token");
        
        // Only restore session if both user and token exist
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        } else {
          // Clear invalid session
          await AsyncStorage.removeItem("auth_user");
          await AsyncStorage.removeItem("auth_token");
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        // Clear on error
        await AsyncStorage.removeItem("auth_user");
        await AsyncStorage.removeItem("auth_token");
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call backend login endpoint using new auth API
      const response = await fetch("/api/auth.login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user data
      const userData = data.user;
      setUser(userData);
      await AsyncStorage.setItem("auth_user", JSON.stringify(userData));
      await AsyncStorage.setItem("auth_token", data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      // Call backend register endpoint using new auth API
      const response = await fetch("/api/auth.register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      // After registration, user needs approval
      // Show message to user
      alert("Registration successful! Please wait for administrator approval.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      await AsyncStorage.removeItem("auth_user");
      await AsyncStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: user !== null,
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
