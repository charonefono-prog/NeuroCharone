import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Ou um componente de carregamento
  }

  if (!user || user.role !== "admin") {
    // Apenas administradores podem acessar esta rota
    return <Redirect href="/login" />;
  }

  return <Stack />;
}
