import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";

/**
 * Hook para proteger rotas que requerem autenticação
 * Redireciona para login se o usuário não estiver autenticado
 */
export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return {
    isAuthenticated,
    isLoading,
    user,
  };
}

/**
 * Hook para proteger rotas que requerem role de admin
 */
export function useAdminRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, user, router]);

  return {
    isAuthenticated,
    isLoading,
    user,
    isAdmin: user?.role === "admin",
  };
}
