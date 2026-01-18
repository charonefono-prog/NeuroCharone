import { ScrollView, Text, View, TouchableOpacity, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { shareBackup, suggestBackupIfNeeded } from "@/lib/backup-system";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const colors = useColors();

  useEffect(() => {
    // Sugerir backup se necessário
    suggestBackupIfNeeded();
  }, []);

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
                  CREFONO: 9-10025-5
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
