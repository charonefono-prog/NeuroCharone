import { Modal, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useColors } from "@/hooks/use-colors";
import { getPlanTemplates, type PlanTemplate } from "@/lib/plan-templates";
import { PlanSearchModal } from "./plan-search-modal";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface TemplateSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PlanTemplate) => void;
}

export function TemplateSelectorModal({
  visible,
  onClose,
  onSelectTemplate,
}: TemplateSelectorModalProps) {
  const colors = useColors();
  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    if (visible) {
      loadTemplates();
    }
  }, [visible]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getPlanTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
      Alert.alert("Erro", "Não foi possível carregar os templates");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: PlanTemplate) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "80%",
            paddingTop: 20,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.foreground, flex: 1 }}>
              Selecionar Template
            </Text>
            <TouchableOpacity
              onPress={() => setShowSearchModal(true)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: colors.primary + "20",
              }}
            >
              <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>🔍 Buscar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text style={{ fontSize: 16, color: colors.primary }}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Templates */}
          <ScrollView style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {loading ? (
              <View style={{ padding: 32, alignItems: "center" }}>
                <Text style={{ color: colors.muted }}>Carregando templates...</Text>
              </View>
            ) : templates.length === 0 ? (
              <View style={{ padding: 32, alignItems: "center" }}>
                <Text style={{ color: colors.muted, textAlign: "center" }}>
                  Nenhum template disponível.{"\n"}
                  Crie templates personalizados nas configurações.
                </Text>
              </View>
            ) : (
              templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  onPress={() => handleSelectTemplate(template)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.foreground,
                      marginBottom: 8,
                    }}
                  >
                    {template.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.muted,
                      marginBottom: 8,
                    }}
                  >
                    {template.objective}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    <View
                      style={{
                        backgroundColor: colors.primary + "20",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: colors.primary }}>
                        {template.frequency}x/semana
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: colors.primary + "20",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: colors.primary }}>
                        {template.totalDuration} semanas
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: colors.primary + "20",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: colors.primary }}>
                        {template.targetPoints.length} pontos
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>

      {/* Modal de busca */}
      {showSearchModal && (
        <Modal
          visible={showSearchModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowSearchModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 20 }}>
            <PlanSearchModal
              templates={templates}
              onSelectTemplate={(template) => {
                handleSelectTemplate(template);
                setShowSearchModal(false);
              }}
              onClose={() => setShowSearchModal(false)}
            />
          </View>
        </Modal>
      )}
    </Modal>
  );
}
