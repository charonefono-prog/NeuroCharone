import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Stack } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

interface UserItem {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'pending' | 'user' | 'admin' | 'rejected';
}

export default function AdminUsersScreen() {
  const { user: currentUser } = useAuth();
  const { data, isLoading, refetch } = trpc.admin.getUsers.useQuery(undefined, {
    enabled: currentUser?.role === "admin",
  });
  const updateUserRoleMutation = trpc.admin.updateUserRole.useMutation();
  const [usersList, setUsersList] = useState<UserItem[]>([]);

  useEffect(() => {
    if (data?.users) {
      setUsersList(data.users);
    }
  }, [data]);

  const handleUpdateRole = async (userId: number, newRole: 'pending' | 'user' | 'admin' | 'rejected') => {
    Alert.alert(
      "Confirmar Ação",
      `Tem certeza que deseja mudar a função do usuário para '${newRole}'?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await updateUserRoleMutation.mutateAsync({ userId, role: newRole });
              Alert.alert("Sucesso", "Função do usuário atualizada com sucesso!");
              refetch(); // Refetch users to update the list
            } catch (error: any) {
              Alert.alert("Erro", error.message || "Falha ao atualizar a função do usuário.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Carregando usuários...</Text>
      </View>
    );
  }

  if (currentUser?.role !== "admin") {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Acesso negado. Apenas administradores podem acessar esta página.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Stack.Screen options={{ title: "Gerenciar Usuários" }} />
      <Text className="text-2xl font-bold mb-4">Gerenciar Usuários</Text>
      <FlatList
        data={usersList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-3 border-b border-gray-200">
            <View className="flex-1">
              <Text className="font-semibold">{item.name || "N/A"}</Text>
              <Text className="text-gray-600">{item.email || item.openId}</Text>
              <Text className="text-sm text-gray-500">Função: {item.role}</Text>
            </View>
            <View className="flex-row space-x-2">
              {item.role === "pending" && (
                <TouchableOpacity
                  className="bg-green-500 px-3 py-1 rounded-md"
                  onPress={() => handleUpdateRole(item.id, "user")}
                >
                  <Text className="text-white">Aprovar</Text>
                </TouchableOpacity>
              )}
              {item.role !== "rejected" && (
                <TouchableOpacity
                  className="bg-red-500 px-3 py-1 rounded-md"
                  onPress={() => handleUpdateRole(item.id, "rejected")}
                >
                  <Text className="text-white">Rejeitar</Text>
                </TouchableOpacity>
              )}
              {item.role !== "admin" && item.role !== "pending" && (
                <TouchableOpacity
                  className="bg-blue-500 px-3 py-1 rounded-md"
                  onPress={() => handleUpdateRole(item.id, "admin")}
                >
                  <Text className="text-white">Tornar Admin</Text>
                </TouchableOpacity>
              )}
              {item.role === "admin" && (
                <TouchableOpacity
                  className="bg-yellow-500 px-3 py-1 rounded-md"
                  onPress={() => handleUpdateRole(item.id, "user")}
                >
                  <Text className="text-white">Remover Admin</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}
