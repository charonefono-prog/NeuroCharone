import { View, Text, TouchableOpacity, ScrollView, Alert, Switch, TextInput, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { shareBackup, suggestBackupIfNeeded } from "@/lib/backup-system";
import { useThemeContext } from "@/lib/theme-provider";
import { getReminderAdvance, setReminderAdvance, requestNotificationPermissions } from "@/lib/notifications";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";
  const [reminderAdvance, setReminderAdvanceState] = useState<number>(60);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Sugerir backup se necessário
    suggestBackupIfNeeded();
    // Carregar configuração de lembretes
    loadReminderSettings();
  }, []);

  const loadReminderSettings = async () => {
    const advance = await getReminderAdvance();
    setReminderAdvanceState(advance);
    const hasPermission = await requestNotificationPermissions();
    setNotificationsEnabled(hasPermission);
  };

  const handleReminderAdvanceChange = async (value: string) => {
    const minutes = parseInt(value, 10);
    if (!isNaN(minutes) && minutes > 0) {
      setReminderAdvanceState(minutes);
      await setReminderAdvance(minutes);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleBackup = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Fazer Backup",
      "Deseja exportar todos os dados do aplicativo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Exportar",
          onPress: async () => {
            const success = await shareBackup();
            if (success) {
              Alert.alert("Sucesso", "Backup criado e compartilhado com sucesso!");
            }
          },
        },
      ]
    );
  };

  const toggleTheme = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setColorScheme(isDark ? "light" : "dark");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, gap: 24 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.foreground }}>
              Perfil
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Informações do profissional
            </Text>
          </View>

          {/* Card do Profissional */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 20,
              gap: 16,
            }}
          >
            {/* Avatar e Nome */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.primary + "20",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.primary }}>
                  CC
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                  Carlos Charone
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted, marginTop: 2 }}>
                  CRFa 9 - 10025-5
                </Text>
              </View>
            </View>

            {/* Informações */}
            <View style={{ gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                  Especialidade
                </Text>
                <Text style={{ fontSize: 16, color: colors.foreground }}>
                  Neuromodulação Craniana
                </Text>
              </View>

              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                  Email
                </Text>
                <Text style={{ fontSize: 16, color: colors.foreground }}>
                  carlos.charone@email.com
                </Text>
              </View>

              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                  Telefone
                </Text>
                <Text style={{ fontSize: 16, color: colors.foreground }}>
                  (11) 99999-9999
                </Text>
              </View>
            </View>
          </View>

          {/* Sobre o Aplicativo */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 20,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Sobre o NeuroLaserMap
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}>
              Sistema profissional para mapeamento de neuromodulação craniana, permitindo registro de
              pacientes, criação de planos terapêuticos e acompanhamento de sessões de tratamento.
            </Text>
            <View style={{ gap: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                Versão 1.0.0
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                Desenvolvido por Carlos Charone
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                CREFONO: 9-10025-5
              </Text>
            </View>
          </View>

          {/* Lembretes de Sessões */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Lembretes de Sessões
            </Text>
            
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
                gap: 16,
              }}
            >
              {/* Status das notificações */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: notificationsEnabled ? colors.success + "20" : colors.error + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{notificationsEnabled ? "🔔" : "🔕"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    Notificações
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                    {notificationsEnabled ? "Ativadas" : "Desativadas - Ative nas configurações do sistema"}
                  </Text>
                </View>
              </View>

              {/* Antecedência do lembrete */}
              {notificationsEnabled && (
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    Antecedência do Lembrete
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <TextInput
                      value={reminderAdvance.toString()}
                      onChangeText={handleReminderAdvanceChange}
                      keyboardType="number-pad"
                      style={{
                        flex: 1,
                        backgroundColor: colors.background,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 14,
                        color: colors.foreground,
                      }}
                    />
                    <Text style={{ fontSize: 14, color: colors.muted }}>minutos antes</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    Você será notificado {reminderAdvance} minutos antes de cada sessão agendada
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Tema */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Aparência
            </Text>
            
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primary + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{isDark ? "🌙" : "☀️"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    Modo Escuro
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                    {isDark ? "Ativado" : "Desativado"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Templates de Planos */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Templates de Planos
            </Text>
            
            <TouchableOpacity
              onPress={() => router.push("/templates")}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.primary + "20",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.primary,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary + "20",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>📋</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                  Gerenciar Templates
                </Text>
                <Text style={{ fontSize: 12, color: colors.primary, marginTop: 2, opacity: 0.8 }}>
                  Criar e editar templates personalizados
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Backup e Restauração */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Backup de Dados
            </Text>
            
            <TouchableOpacity
              onPress={handleBackup}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.success + "20",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.success,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.success,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>💾</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Exportar Backup
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                  Salvar todos os dados em arquivo JSON
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: colors.warning + "10",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.warning + "30",
                padding: 12,
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 16 }}>⚠️</Text>
              <Text style={{ flex: 1, fontSize: 12, color: colors.muted, lineHeight: 18 }}>
                Recomendamos fazer backup semanal dos seus dados. Os dados são armazenados localmente no dispositivo.
              </Text>
            </View>
          </View>

          {/* Funcionalidades */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Funcionalidades
            </Text>
            
            <View style={{ gap: 8 }}>
              {[
                { icon: "house.fill", title: "Gerenciamento de Pacientes", desc: "Cadastro e acompanhamento completo" },
                { icon: "house.fill", title: "Planos Terapêuticos", desc: "Criação de protocolos personalizados" },
                { icon: "house.fill", title: "Mapeamento do Capacete", desc: "Visualização dos pontos de estimulação" },
                { icon: "house.fill", title: "Registro de Sessões", desc: "Histórico detalhado de tratamentos" },
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.primary + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconSymbol name={item.icon as any} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                      {item.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
