import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";
import { savePlan } from "@/lib/local-storage";
import { Helmet3DSelector } from "./helmet-3d-selector";
import { helmetRegions } from "@/shared/helmet-data";
import { TemplateSelectorModal } from "./template-selector-modal";
import { type PlanTemplate } from "@/lib/plan-templates";
import * as Haptics from "expo-haptics";

interface AddPlanModalProps {
  visible: boolean;
  patientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPlanModal({ visible, patientId, onClose, onSuccess }: AddPlanModalProps) {
  const colors = useColors();
  const [objective, setObjective] = useState("");
  const [frequency, setFrequency] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const getRegionsFromPoints = (points: string[]): string[] => {
    const regions = new Set<string>();
    points.forEach((point) => {
      const region = helmetRegions.find((r) => r.points.includes(point));
      if (region) {
        regions.add(region.name);
      }
    });
    return Array.from(regions);
  };

  const handleApplyTemplate = (template: PlanTemplate) => {
    setObjective(template.objective);
    setFrequency(template.frequency.toString());
    setTotalDuration(template.totalDuration.toString());
    setNotes(template.notes || "");
    setSelectedPoints(template.targetPoints);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSave = async () => {
    setError("");

    // Validações
    if (!objective.trim()) {
      setError("Objetivo do tratamento é obrigatório");
      return;
    }

    if (selectedPoints.length === 0) {
      setError("Selecione pelo menos um ponto de estimulação");
      return;
    }

    if (!frequency.trim() || isNaN(Number(frequency)) || Number(frequency) <= 0) {
      setError("Frequência inválida (digite apenas números)");
      return;
    }

    if (!totalDuration.trim() || isNaN(Number(totalDuration)) || Number(totalDuration) <= 0) {
      setError("Duração total inválida (digite apenas números)");
      return;
    }

    try {
      setLoading(true);

      const targetRegions = getRegionsFromPoints(selectedPoints);

      await savePlan({
        patientId,
        objective: objective.trim(),
        targetRegions,
        targetPoints: selectedPoints,
        frequency: Number(frequency),
        totalDuration: Number(totalDuration),
        notes: notes.trim() || undefined,
        isActive: true,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Limpar formulário
      setObjective("");
      setFrequency("");
      setTotalDuration("");
      setNotes("");
      setSelectedPoints([]);
      setError("");

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving plan:", err);
      setError("Erro ao salvar plano terapêutico. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setObjective("");
    setFrequency("");
    setTotalDuration("");
    setNotes("");
    setSelectedPoints([]);
    setError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "95%",
          }}
        >
          <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
                Novo Plano Terapêutico
              </Text>
              <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
                <IconSymbol name="house.fill" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Erro */}
            {error ? (
              <View
                style={{
                  backgroundColor: colors.error + "20",
                  padding: 12,
                  borderRadius: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.error,
                }}
              >
                <Text style={{ color: colors.error, fontSize: 14 }}>{error}</Text>
              </View>
            ) : null}

            {/* Botão de Template */}
            <TouchableOpacity
              onPress={() => setShowTemplateSelector(true)}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.primary + "20",
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.primary,
                borderStyle: "dashed",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                📋 Usar Template de Plano
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                Preencher automaticamente com um modelo pré-configurado
              </Text>
            </TouchableOpacity>

            {/* Campos Básicos */}
            <View style={{ gap: 16 }}>
              {/* Objetivo */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Objetivo do Tratamento *
                </Text>
                <TextInput
                  value={objective}
                  onChangeText={setObjective}
                  placeholder="Ex: Redução de sintomas depressivos"
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.foreground,
                    minHeight: 80,
                  }}
                />
              </View>

              {/* Frequência e Duração */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    Frequência (x/semana) *
                  </Text>
                  <TextInput
                    value={frequency}
                    onChangeText={setFrequency}
                    placeholder="Ex: 3"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: colors.foreground,
                    }}
                  />
                </View>

                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    Duração (semanas) *
                  </Text>
                  <TextInput
                    value={totalDuration}
                    onChangeText={setTotalDuration}
                    placeholder="Ex: 12"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: colors.foreground,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Visualização 3D do Capacete */}
            <Helmet3DSelector
              selectedPoints={selectedPoints}
              onPointsChange={setSelectedPoints}
              title="Pontos de Estimulação *"
            />

            {/* Observações */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Observações
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Observações adicionais sobre o plano"
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  color: colors.foreground,
                  minHeight: 80,
                }}
              />
            </View>

            {/* Botões */}
            <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
              <TouchableOpacity
                onPress={handleCancel}
                disabled={loading}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                  {loading ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Modal de Seleção de Template */}
      <TemplateSelectorModal
        visible={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleApplyTemplate}
      />
    </Modal>
  );
}
