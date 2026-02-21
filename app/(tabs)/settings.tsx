import { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useProfessionalInfo, type ProfessionalInfo } from "@/hooks/use-professional-info";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const colors = useColors();
  const { professional, loading, saveProfessionalInfo } = useProfessionalInfo();
  const [formData, setFormData] = useState<ProfessionalInfo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (professional) {
      setFormData(professional);
    }
  }, [professional]);

  const handleSave = async () => {
    if (!formData) return;

    try {
      setSaving(true);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const success = await saveProfessionalInfo(formData);
      if (success) {
        alert("Dados do profissional salvos com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar dados do profissional");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ padding: 24, gap: 24 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground }}>
              ⚙️ Configurações
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Dados do Profissional
            </Text>
          </View>

          {/* Formulário */}
          <View style={{ gap: 16 }}>
            {/* Título */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                TÍTULO
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, title: "Dr" })}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor:
                      formData.title === "Dr" ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor:
                      formData.title === "Dr" ? colors.primary : colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      color:
                        formData.title === "Dr" ? "white" : colors.foreground,
                    }}
                  >
                    Dr
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, title: "Dra" })}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor:
                      formData.title === "Dra" ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor:
                      formData.title === "Dra" ? colors.primary : colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      color:
                        formData.title === "Dra" ? "white" : colors.foreground,
                    }}
                  >
                    Dra
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Primeiro Nome */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                PRIMEIRO NOME
              </Text>
              <TextInput
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
                placeholder="Ex: João"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.foreground,
                  fontSize: 14,
                }}
              />
            </View>

            {/* Último Nome */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                ÚLTIMO NOME
              </Text>
              <TextInput
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData({ ...formData, lastName: text })
                }
                placeholder="Ex: Silva"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.foreground,
                  fontSize: 14,
                }}
              />
            </View>

            {/* CRM */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                CRM / REGISTRO PROFISSIONAL
              </Text>
              <TextInput
                value={formData.registrationNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, registrationNumber: text })
                }
                placeholder="Ex: CRM 123456/SP"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.foreground,
                  fontSize: 14,
                }}
              />
            </View>

            {/* Especialidade */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                ESPECIALIDADE
              </Text>
              <TextInput
                value={formData.specialty}
                onChangeText={(text) =>
                  setFormData({ ...formData, specialty: text })
                }
                placeholder="Ex: Fonoaudiologia"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.foreground,
                  fontSize: 14,
                }}
              />
            </View>

            {/* Email */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                EMAIL (OPCIONAL)
              </Text>
              <TextInput
                value={formData.email || ""}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                placeholder="Ex: profissional@email.com"
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.foreground,
                  fontSize: 14,
                }}
              />
            </View>

            {/* Telefone */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                TELEFONE (OPCIONAL)
              </Text>
              <TextInput
                value={formData.phone || ""}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                placeholder="Ex: (11) 98765-4321"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: colors.foreground,
                  fontSize: 14,
                }}
              />
            </View>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
                💾 Salvar Dados
              </Text>
            )}
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
              ℹ️ INFORMAÇÃO
            </Text>
            <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
              Estes dados aparecerão em todos os PDFs exportados. Configure-os uma única vez.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

import { Platform } from "react-native";
