import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/lib/auth-context";

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/(auth)/login");
            } catch (err) {
              Alert.alert("Erro", "Não foi possível fazer logout");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header com logout */}
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-foreground">Perfil</Text>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-error px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Sair</Text>
            </TouchableOpacity>
          </View>

          {/* Informações do usuário */}
          <View className="bg-surface rounded-lg p-4 gap-3">
            <Text className="text-sm text-muted">Email</Text>
            <Text className="text-lg font-semibold text-foreground">{user?.email}</Text>
            
            <Text className="text-sm text-muted mt-4">Função</Text>
            <Text className="text-lg font-semibold text-foreground capitalize">
              {user?.role === "admin" ? "Administrador" : "Profissional"}
            </Text>
          </View>

          {/* Placeholder para mais conteúdo */}
          <View className="bg-surface rounded-lg p-4">
            <Text className="text-lg font-semibold text-foreground mb-2">Configurações</Text>
            <Text className="text-sm text-muted">
              Mais opções de configuração em breve...
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
