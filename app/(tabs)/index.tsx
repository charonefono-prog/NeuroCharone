import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { data: user } = trpc.auth.me.useQuery();
  const { data: stats, isLoading } = trpc.patients.getStats.useQuery(undefined, {
    enabled: !!user,
  });

  if (!user) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Faça login para acessar o aplicativo</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Olá, {user.name || "Profissional"}
            </Text>
            <Text className="text-base text-muted">
              Bem-vindo ao Mapeamento de Neuromodulação
            </Text>
          </View>

          {/* Estatísticas */}
          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View className="gap-4">
              <Text className="text-xl font-semibold text-foreground">Estatísticas</Text>
              <View className="flex-row flex-wrap gap-4">
                <View className="flex-1 min-w-[45%] bg-surface rounded-2xl p-4 border border-border">
                  <Text className="text-3xl font-bold text-primary">
                    {stats?.totalPatients || 0}
                  </Text>
                  <Text className="text-sm text-muted mt-1">Total de Pacientes</Text>
                </View>

                <View className="flex-1 min-w-[45%] bg-surface rounded-2xl p-4 border border-border">
                  <Text className="text-3xl font-bold text-success">
                    {stats?.activePatients || 0}
                  </Text>
                  <Text className="text-sm text-muted mt-1">Pacientes Ativos</Text>
                </View>

                <View className="flex-1 min-w-[45%] bg-surface rounded-2xl p-4 border border-border">
                  <Text className="text-3xl font-bold text-warning">
                    {stats?.pausedPatients || 0}
                  </Text>
                  <Text className="text-sm text-muted mt-1">Pausados</Text>
                </View>

                <View className="flex-1 min-w-[45%] bg-surface rounded-2xl p-4 border border-border">
                  <Text className="text-3xl font-bold text-muted">
                    {stats?.completedPatients || 0}
                  </Text>
                  <Text className="text-sm text-muted mt-1">Concluídos</Text>
                </View>
              </View>
            </View>
          )}

          {/* Ações Rápidas */}
          <View className="gap-4">
            <Text className="text-xl font-semibold text-foreground">Ações Rápidas</Text>
            
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/patients")}
              activeOpacity={0.7}
              className="bg-primary rounded-xl p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <IconSymbol name="person.2.fill" size={24} color="#FFFFFF" />
                <Text className="text-lg font-semibold text-white">
                  Ver Todos os Pacientes
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {/* TODO: Implementar modal de adicionar paciente */}}
              activeOpacity={0.7}
              className="bg-secondary rounded-xl p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <IconSymbol name="plus.circle.fill" size={24} color="#FFFFFF" />
                <Text className="text-lg font-semibold text-white">
                  Adicionar Novo Paciente
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Informações do Desenvolvedor */}
          <View className="mt-auto pt-6 border-t border-border">
            <Text className="text-xs text-muted text-center">
              Desenvolvido por Carlos Charone
            </Text>
            <Text className="text-xs text-muted text-center">
              CREFITO: 9-10025-5
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
