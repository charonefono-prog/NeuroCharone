import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getPlanTemplates,
  savePlanTemplate,
  updatePlanTemplate,
  deletePlanTemplate,
  type PlanTemplate,
} from "@/lib/plan-templates";
import { Helmet3DSelector } from "@/components/helmet-3d-selector";
import { helmetRegions } from "@/shared/helmet-data";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function TemplatesScreen() {
  const router = useRouter();
  const colors = useColors();
  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PlanTemplate | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [frequency, setFrequency] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | undefined>();
  const [error, setError] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

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

  const isDefaultTemplate = (template: PlanTemplate) => {
    return template.name.includes("Protocolo Padrão");
  };

  const handleEdit = (template: PlanTemplate) => {
    if (isDefaultTemplate(template)) {
      Alert.alert(
        "Template Padrão",
        "Templates padrão não podem ser editados. Você pode criar um novo template baseado neste."
      );
      return;
    }

    setEditingTemplate(template);
    setName(template.name);
    setObjective(template.objective);
    setFrequency(template.frequency.toString());
    setTotalDuration(template.totalDuration.toString());
    setNotes(template.notes || "");
    setSelectedPoints(template.targetPoints);
    setShowForm(true);
  };

  const handleDelete = (template: PlanTemplate) => {
    if (isDefaultTemplate(template)) {
      Alert.alert("Erro", "Templates padrão não podem ser excluídos");
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o template "${template.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlanTemplate(template.id);
              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              loadTemplates();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o template");
            }
          },
        },
      ]
    );
  };

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

  const handleSave = async () => {
    setError("");

    // Validações
    if (!name.trim()) {
      setError("Nome do template é obrigatório");
      return;
    }

    if (!objective.trim()) {
      setError("Objetivo é obrigatório");
      return;
    }

    if (selectedPoints.length === 0) {
      setError("Selecione pelo menos um ponto");
      return;
    }

    if (!frequency.trim() || isNaN(Number(frequency)) || Number(frequency) <= 0) {
      setError("Frequência inválida");
      return;
    }

    if (!totalDuration.trim() || isNaN(Number(totalDuration)) || Number(totalDuration) <= 0) {
      setError("Duração inválida");
      return;
    }

    try {
      const targetRegions = getRegionsFromPoints(selectedPoints);

      if (editingTemplate) {
        await updatePlanTemplate(editingTemplate.id, {
          name: name.trim(),
          objective: objective.trim(),
          targetRegions,
          targetPoints: selectedPoints,
          frequency: Number(frequency),
          totalDuration: Number(totalDuration),
          notes: notes.trim() || undefined,
        });
      } else {
        await savePlanTemplate({
          name: name.trim(),
          objective: objective.trim(),
          targetRegions,
          targetPoints: selectedPoints,
          frequency: Number(frequency),
          totalDuration: Number(totalDuration),
          notes: notes.trim() || undefined,
        });
      }

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      handleCancel();
      loadTemplates();
    } catch (error) {
      setError("Erro ao salvar template");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setName("");
    setObjective("");
    setFrequency("");
    setTotalDuration("");
    setNotes("");
    setSelectedPoints([]);
    setError("");
  };

  if (showForm) {
    return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
          {/* Header */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
              <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.foreground }}>
              {editingTemplate ? "Editar Template" : "Novo Template"}
            </Text>
            <View style={{ width: 24 }} />
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
              <Text style={{ color: colors.error }}>{error}</Text>
            </View>
          ) : null}

          {/* Nome */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
              Nome do Template *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex: Protocolo Personalizado"
              placeholderTextColor={colors.muted}
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

          {/* Objetivo */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
              Objetivo *
            </Text>
            <TextInput
              value={objective}
              onChangeText={setObjective}
              placeholder="Descreva o objetivo terapêutico"
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

          {/* Seleção de Pontos */}
          <Helmet3DSelector
            selectedPoints={selectedPoints}
            onPointsChange={setSelectedPoints}
            title="Pontos de Estimulação *"
            selectedPointId={selectedPointId}
            onPointIdChange={setSelectedPointId}
          />

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
                placeholder="Ex: 8"
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

          {/* Notas */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
              Notas (opcional)
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Observações sobre este template"
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
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={handleCancel}
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
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: colors.primary,
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.foreground }}>
            Templates de Planos
          </Text>
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Templates */}
        {loading ? (
          <View style={{ padding: 32, alignItems: "center" }}>
            <Text style={{ color: colors.muted }}>Carregando...</Text>
          </View>
        ) : templates.length === 0 ? (
          <View style={{ padding: 32, alignItems: "center", gap: 24 }}>
            <Text style={{ color: colors.muted, textAlign: "center", fontSize: 16 }}>
              Nenhum template criado ainda.
            </Text>
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                + Criar Novo Plano
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {templates.map((template) => (
              <View
                key={template.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 16,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                        {template.name}
                      </Text>
                      {isDefaultTemplate(template) && (
                        <View
                          style={{
                            backgroundColor: colors.primary + "20",
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}
                        >
                          <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>
                            PADRÃO
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontSize: 14, color: colors.muted }}>{template.objective}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
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

                {!isDefaultTemplate(template) && (
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => handleEdit(template)}
                      activeOpacity={0.7}
                      style={{
                        flex: 1,
                        backgroundColor: colors.primary + "20",
                        padding: 12,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                        Editar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(template)}
                      activeOpacity={0.7}
                      style={{
                        flex: 1,
                        backgroundColor: colors.error + "20",
                        padding: 12,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.error }}>
                        Excluir
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}
