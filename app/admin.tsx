import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

interface PendingUser {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

export default function AdminPanel() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const getPendingQuery = trpc.pwaAuth.getPendingUsers.useQuery();
  const approveMutation = trpc.pwaAuth.approveUser.useMutation();
  const rejectMutation = trpc.pwaAuth.rejectUser.useMutation();

  useEffect(() => {
    if (getPendingQuery.data) {
      setPendingUsers(getPendingQuery.data as any);
      setLoading(false);
    }
  }, [getPendingQuery.data]);

  const handleApprove = async (userId: number, userName: string) => {
    Alert.alert("Confirmar", `Aprovar ${userName}?`, [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Aprovar",
        onPress: async () => {
          try {
            await approveMutation.mutateAsync({ userId });
            Alert.alert("Sucesso", "Usuário aprovado!");
            // Refresh list
            getPendingQuery.refetch();
          } catch (error: any) {
            Alert.alert("Erro", error.message || "Falha ao aprovar usuário");
          }
        },
        style: "default",
      },
    ]);
  };

  const handleReject = async (userId: number, userName: string) => {
    Alert.alert("Confirmar", `Rejeitar ${userName}?`, [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Rejeitar",
        onPress: async () => {
          try {
            await rejectMutation.mutateAsync({ userId });
            Alert.alert("Sucesso", "Usuário rejeitado!");
            // Refresh list
            getPendingQuery.refetch();
          } catch (error: any) {
            Alert.alert("Erro", error.message || "Falha ao rejeitar usuário");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const renderPendingUser = ({ item }: { item: PendingUser }) => (
    <View className="bg-surface border border-border rounded-lg p-4 mb-3">
      <View className="gap-2 mb-3">
        <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
        <Text className="text-sm text-muted">{item.email}</Text>
        <Text className="text-xs text-muted">
          Cadastrado em: {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 bg-success rounded-lg py-2 items-center"
          onPress={() => handleApprove(item.id, item.name)}
        >
          <Text className="text-white font-semibold">Aprovar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-error rounded-lg py-2 items-center"
          onPress={() => handleReject(item.id, item.name)}
        >
          <Text className="text-white font-semibold">Rejeitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Painel Admin</Text>
          <Text className="text-base text-muted mt-1">Gerenciar aprovações de usuários</Text>
        </View>

        {/* Pending Users Count */}
        <View className="bg-primary rounded-lg p-4 mb-6">
          <Text className="text-white text-lg font-semibold">
            {pendingUsers.length} usuário{pendingUsers.length !== 1 ? "s" : ""} pendente
            {pendingUsers.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Pending Users List */}
        {loading ? (
          <View className="items-center justify-center py-8">
            <Text className="text-muted">Carregando...</Text>
          </View>
        ) : pendingUsers.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-muted">Nenhum usuário pendente de aprovação</Text>
          </View>
        ) : (
          <FlatList
            data={pendingUsers}
            renderItem={renderPendingUser}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        )}

        {/* Loading States */}
        {approveMutation.isPending && (
          <View className="bg-blue-100 border border-blue-300 rounded-lg p-3 mt-4">
            <Text className="text-blue-800 text-center">Aprovando usuário...</Text>
          </View>
        )}

        {rejectMutation.isPending && (
          <View className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-4">
            <Text className="text-yellow-800 text-center">Rejeitando usuário...</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
