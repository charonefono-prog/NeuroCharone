import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useEffect } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated, loading, startOAuthLogin } = useAuth();
  const { error } = router.query;

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-muted">Carregando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center gap-8">
          {/* Error Message */}
          {error === "pending_approval" && (
            <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <Text className="font-bold">Acesso Pendente</Text>
              <Text className="block sm:inline">Seu acesso está aguardando aprovação. Por favor, aguarde ou entre em contato com o administrador.</Text>
            </View>
          )}

          {/* Header */}
          <View className="items-center gap-4">
            <Text className="text-4xl font-bold text-foreground">NeuroLaserMap</Text>
            <Text className="text-base text-muted text-center">
              Gerenciamento profissional de neuromodulação
            </Text>
          </View>

          {/* Features */}
          <View className="gap-4">
            <FeatureItem
              icon="✓"
              title="Pacientes"
              description="Gerencie seus pacientes com segurança"
              colors={colors}
            />
            <FeatureItem
              icon="✓"
              title="Planos Terapêuticos"
              description="Crie planos personalizados"
              colors={colors}
            />
            <FeatureItem
              icon="✓"
              title="Sincronização"
              description="Acesse de qualquer dispositivo"
              colors={colors}
            />
          </View>

          {/* Login Buttons */}
          <View className="gap-4">
            <TouchableOpacity
              onPress={() => startOAuthLogin("google")}
              className="bg-red-500 rounded-lg p-4 items-center"
            >
              <Text className="text-white font-semibold text-base">Login com Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startOAuthLogin("microsoft")}
              className="bg-blue-500 rounded-lg p-4 items-center"
            >
              <Text className="text-white font-semibold text-base">Login com Microsoft</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => startOAuthLogin("apple")}
              className="bg-gray-800 rounded-lg p-4 items-center"
            >
              <Text className="text-white font-semibold text-base">Login com Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text className="text-xs text-muted text-center">
            Ao fazer login, você concorda com nossa Política de Privacidade
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  colors,
}: {
  icon: string;
  title: string;
  description: string;
  colors: any;
}) {
  return (
    <View className="flex-row gap-3 bg-surface rounded-lg p-4">
      <Text className="text-2xl">{icon}</Text>
      <View className="flex-1">
        <Text className="font-semibold text-foreground">{title}</Text>
        <Text className="text-sm text-muted">{description}</Text>
      </View>
    </View>
  );
}
