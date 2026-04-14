import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAdminRoute } from "@/hooks/use-protected-route";
import { useAuth } from "@/lib/auth-context";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

interface PendingUser {
  id: number;
  email: string;
  fullName: string;
  specialty?: string;
  professionalId?: string;
  createdAt: Date;
  role: string;
}

export default function AdminScreen() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminRoute();
  const { logout } = useAuth();
  
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "invites">("pending");

  // Carregar usuários pendentes
  useEffect(() => {
    if (!isAdmin) return;
    
    const loadPendingUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const users = await trpc.auth.getPendingUsers.query();
        setPendingUsers(users as any);
      } catch (error) {
        console.error("Failed to load pending users:", error);
        Alert.alert("Erro", "Falha ao carregar usuários pendentes");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadPendingUsers();
  }, [isAdmin]);

  const handleApproveUser = async (userId: number) => {
    try {
      await trpc.auth.approveUser.mutate({ userId });
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      Alert.alert("Sucesso", "Usuário aprovado");
    } catch (error) {
      Alert.alert("Erro", "Falha ao aprovar usuário");
    }
  };

  const handleBlockUser = async (userId: number) => {
    Alert.prompt(
      "Bloquear Usuário",
      "Motivo do bloqueio:",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Bloquear",
          onPress: async (reason) => {
            try {
              await trpc.auth.blockUser.mutate({
                userId,
                reason: reason || "Sem motivo especificado",
              });
              setPendingUsers(pendingUsers.filter(u => u.id !== userId));
              Alert.alert("Sucesso", "Usuário bloqueado");
            } catch (error) {
              Alert.alert("Erro", "Falha ao bloquear usuário");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer logout");
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  if (!isAdmin) {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <Text className="text-lg text-error">Acesso negado</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-foreground">Admin Dashboard</Text>
            <Text className="text-sm text-muted mt-1">Gerenciar usuários e convites</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="px-4 py-2 rounded-lg bg-error/10 border border-error"
          >
            <Text className="text-sm font-semibold text-error">Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2 mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab("pending")}
            className={cn(
              "flex-1 py-3 rounded-lg items-center",
              activeTab === "pending" ? "bg-primary" : "bg-surface border border-border"
            )}
          >
            <Text className={cn(
              "font-semibold text-sm",
              activeTab === "pending" ? "text-background" : "text-foreground"
            )}>
              Pendentes ({pendingUsers.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("invites")}
            className={cn(
              "flex-1 py-3 rounded-lg items-center",
              activeTab === "invites" ? "bg-primary" : "bg-surface border border-border"
            )}
          >
            <Text className={cn(
              "font-semibold text-sm",
              activeTab === "invites" ? "text-background" : "text-foreground"
            )}>
              Convites
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pending Users Tab */}
        {activeTab === "pending" && (
          <View className="gap-3">
            {isLoadingUsers ? (
              <ActivityIndicator size="large" />
            ) : pendingUsers.length === 0 ? (
              <View className="p-4 rounded-lg bg-surface items-center">
                <Text className="text-muted text-sm">Nenhum usuário pendente</Text>
              </View>
            ) : (
              <FlatList
                data={pendingUsers}
                scrollEnabled={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View className="p-4 rounded-lg bg-surface border border-border gap-3">
                    <View>
                      <Text className="font-semibold text-foreground">{item.fullName}</Text>
                      <Text className="text-xs text-muted mt-1">{item.email}</Text>
                      {item.specialty && (
                        <Text className="text-xs text-muted mt-1">
                          Especialidade: {item.specialty}
                        </Text>
                      )}
                      {item.professionalId && (
                        <Text className="text-xs text-muted">
                          Registro: {item.professionalId}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleApproveUser(item.id)}
                        className="flex-1 py-2 rounded-lg bg-success/10 border border-success items-center"
                      >
                        <Text className="text-xs font-semibold text-success">Aprovar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleBlockUser(item.id)}
                        className="flex-1 py-2 rounded-lg bg-error/10 border border-error items-center"
                      >
                        <Text className="text-xs font-semibold text-error">Bloquear</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}

        {/* Invites Tab */}
        {activeTab === "invites" && (
          <View className="gap-3">
            <TouchableOpacity
              onPress={async () => {
                try {
                  const result = await trpc.auth.generateInvite.mutate({
                    expiresInDays: 30,
                  });
                  Alert.alert(
                    "Convite Gerado",
                    `Código: ${result.code}\n\nExpira em: ${new Date(result.expiresAt).toLocaleDateString("pt-BR")}`
                  );
                } catch (error) {
                  Alert.alert("Erro", "Falha ao gerar convite");
                }
              }}
              className="py-3 rounded-lg bg-primary items-center"
            >
              <Text className="font-semibold text-background">+ Gerar Novo Convite</Text>
            </TouchableOpacity>
            <View className="p-4 rounded-lg bg-surface items-center">
              <Text className="text-muted text-sm">Funcionalidade de listagem de convites em desenvolvimento</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
