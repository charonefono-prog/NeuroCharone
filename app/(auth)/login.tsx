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

          {/* Login Button */}
          <TouchableOpacity
            onPress={startOAuthLogin}
            className="bg-primary rounded-lg p-4 items-center"
          >
            <Text className="text-background font-semibold text-base">Fazer Login</Text>
          </TouchableOpacity>

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
