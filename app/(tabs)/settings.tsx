import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useProfessionalInfo } from "@/hooks/use-professional-info";
import * as Haptics from "expo-haptics";
import { recalculateAllScaleResponses } from "@/lib/scale-storage";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { professional, loading } = useProfessionalInfo();

  if (loading) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  const hasProfile = professional.firstName.trim().length > 0;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 24, gap: 24 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground }}>
              Configurações
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Ferramentas e utilitários do sistema
            </Text>
          </View>

          {/* Card do Profissional - Resumo */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                Dados do Profissional
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/profile")}
                style={{
                  backgroundColor: colors.primary + "15",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                  Editar no Perfil
                </Text>
              </TouchableOpacity>
            </View>

            {hasProfile ? (
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.muted }}>Nome:</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                    {professional.title}. {professional.firstName} {professional.lastName}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.muted }}>Conselho:</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                    {professional.councilNumber || "Não informado"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.muted }}>Registro:</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                    {professional.registrationNumber || "Não informado"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.muted }}>Assinatura:</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: professional.electronicSignature ? colors.success : colors.error }}>
                    {professional.electronicSignature ? "Gerada" : "Não gerada"}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.warning + "15",
                  borderRadius: 8,
                  padding: 12,
                  borderLeftWidth: 3,
                  borderLeftColor: colors.warning,
                }}
              >
                <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
                  Preencha seus dados no Perfil para que apareçam nos documentos exportados e na assinatura eletrônica.
                </Text>
              </View>
            )}
          </View>

          {/* Botão Recalcular Escalas */}
          <TouchableOpacity
            onPress={async () => {
              try {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                const success = await recalculateAllScaleResponses();
                if (success) {
                  Alert.alert("Sucesso", "Todas as escalas foram recalculadas com sucesso!");
                } else {
                  Alert.alert("Erro", "Erro ao recalcular escalas");
                }
              } catch (error) {
                console.error("Erro:", error);
                Alert.alert("Erro", "Erro ao recalcular escalas");
              }
            }}
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
                backgroundColor: colors.warning + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>🔄</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Recalcular Todas as Escalas
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                Recalcula pontuações e interpretações de todas as escalas aplicadas
              </Text>
            </View>
          </TouchableOpacity>

          {/* Informação */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
              padding: 16,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
              INFORMAÇÃO
            </Text>
            <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
              Os dados do profissional são gerenciados na aba "Perfil". Eles aparecem automaticamente em todos os PDFs exportados, relatórios e na assinatura eletrônica dos documentos.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
