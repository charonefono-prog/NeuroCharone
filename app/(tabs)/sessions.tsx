import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { LoginScreen } from "@/components/login-button";

export default function SessionsScreen() {
  const colors = useColors();
  const { data: user } = trpc.auth.me.useQuery();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Sessões</Text>
            <Text className="text-base text-muted">
              Agende e gerencie sessões de tratamento
            </Text>
          </View>

          {/* Placeholder */}
          <View className="flex-1 items-center justify-center py-12">
            <IconSymbol name="calendar" size={64} color={colors.muted} />
            <Text className="text-lg text-muted mt-4 text-center">
              Nenhuma sessão agendada
            </Text>
            <Text className="text-sm text-muted mt-2 text-center px-8">
              As sessões aparecerão aqui quando você criar planos terapêuticos para seus pacientes
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
