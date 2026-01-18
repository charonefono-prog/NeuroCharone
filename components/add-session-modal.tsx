import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";
import { saveSession } from "@/lib/local-storage";
import { Helmet3DSelector } from "./helmet-3d-selector";
import * as Haptics from "expo-haptics";

interface AddSessionModalProps {
  visible: boolean;
  patientId: string;
  planId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddSessionModal({ visible, patientId, planId, onClose, onSuccess }: AddSessionModalProps) {
  const colors = useColors();
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [observations, setObservations] = useState("");
  const [patientReactions, setPatientReactions] = useState("");
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    // Validações
    if (selectedPoints.length === 0) {
      setError("Selecione pelo menos um ponto de estimulação");
      return;
    }

    if (!duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) {
      setError("Duração inválida (digite apenas números)");
      return;
    }

    try {
      setLoading(true);

      await saveSession({
        patientId,
        planId,
        sessionDate: new Date().toISOString(),
        duration: Number(duration),
        stimulatedPoints: selectedPoints,
        intensity: intensity.trim() || undefined,
        observations: observations.trim() || undefined,
        patientReactions: patientReactions.trim() || undefined,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Limpar formulário
      setDuration("");
      setIntensity("");
      setObservations("");
      setPatientReactions("");
      setSelectedPoints([]);
      setError("");

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving session:", err);
      setError("Erro ao salvar sessão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDuration("");
    setIntensity("");
    setObservations("");
    setPatientReactions("");
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
                Registrar Sessão
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

            {/* Visualização 3D do Capacete */}
            <Helmet3DSelector
              selectedPoints={selectedPoints}
              onPointsChange={setSelectedPoints}
              title="Pontos de Estimulação *"
            />

            {/* Campos */}
            <View style={{ gap: 16 }}>
              {/* Duração */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Duração (minutos) *
                </Text>
                <TextInput
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="Ex: 30"
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

              {/* Intensidade */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Intensidade
                </Text>
                <TextInput
                  value={intensity}
                  onChangeText={setIntensity}
                  placeholder="Ex: Média (5mA)"
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

              {/* Observações */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Observações
                </Text>
                <TextInput
                  value={observations}
                  onChangeText={setObservations}
                  placeholder="Observações sobre a sessão"
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

              {/* Reações do Paciente */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Reações do Paciente
                </Text>
                <TextInput
                  value={patientReactions}
                  onChangeText={setPatientReactions}
                  placeholder="Como o paciente reagiu ao tratamento"
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
    </Modal>
  );
}
