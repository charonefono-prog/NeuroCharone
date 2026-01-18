import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ProfileScreen() {
  const colors = useColors();
  const { data: user } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    // O sistema de autenticação irá redirecionar automaticamente
  };

  if (!user) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Faça login para acessar</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Perfil</Text>
            <Text className="text-base text-muted">
              Suas informações profissionais
            </Text>
          </View>

          {/* Informações do Usuário */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <View className="items-center gap-3">
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-3xl font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-bold text-foreground">
                  {user.name || "Usuário"}
                </Text>
                {user.email && (
                  <Text className="text-sm text-muted mt-1">{user.email}</Text>
                )}
              </View>
            </View>

            <View className="border-t border-border pt-4 gap-3">
              {user.specialty && (
                <View className="flex-row items-center gap-3">
                  <IconSymbol name="doc.text.fill" size={20} color={colors.muted} />
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Especialidade</Text>
                    <Text className="text-base text-foreground">{user.specialty}</Text>
                  </View>
                </View>
              )}

              {user.professionalId && (
                <View className="flex-row items-center gap-3">
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.muted} />
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Registro Profissional</Text>
                    <Text className="text-base text-foreground">{user.professionalId}</Text>
                  </View>
                </View>
              )}

              {user.phone && (
                <View className="flex-row items-center gap-3">
                  <IconSymbol name="phone.fill" size={20} color={colors.muted} />
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Telefone</Text>
                    <Text className="text-base text-foreground">{user.phone}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Sobre o Aplicativo */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Sobre o Aplicativo
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              Aplicativo de Mapeamento de Neuromodulação desenvolvido para auxiliar profissionais 
              de saúde no posicionamento e registro de tratamentos com capacete anatômico.
            </Text>
            <View className="border-t border-border pt-3 mt-2">
              <Text className="text-xs text-muted">Desenvolvido por</Text>
              <Text className="text-sm font-semibold text-foreground mt-1">
                Carlos Charone
              </Text>
              <Text className="text-xs text-muted mt-1">
                CREFITO: 9-10025-5
              </Text>
            </View>
          </View>

          {/* Botão de Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="bg-error rounded-xl p-4 flex-row items-center justify-center gap-2"
          >
            <Text className="text-lg font-semibold text-white">Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
