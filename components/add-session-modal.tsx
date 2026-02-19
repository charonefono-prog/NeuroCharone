import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform, Switch } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";
import { saveSession, getPatients } from "@/lib/local-storage";
import { Helmet3DSelector } from "./helmet-3d-selector";
import { scheduleSessionReminder } from "@/lib/notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";

interface AddSessionModalProps {
  visible: boolean;
  patientId: string;
  planId: string;
  plans?: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export function AddSessionModal({ visible, patientId, planId, plans = [], onClose, onSuccess }: AddSessionModalProps) {
  const colors = useColors();
  const [durationMinutes, setDurationMinutes] = useState("");
  const [joules, setJoules] = useState("");
  const [symptomScore, setSymptomScore] = useState("");
  const [observations, setObservations] = useState("");
  const [patientReactions, setPatientReactions] = useState("");
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(planId);

  const handleSave = async () => {
    setError("");

    // Validações
    if (selectedPoints.length === 0) {
      setError("Selecione pelo menos um ponto de estimulação");
      return;
    }

    if (!durationMinutes.trim() || isNaN(Number(durationMinutes)) || Number(durationMinutes) <= 0) {
      setError("Duração inválida (digite apenas números)");
      return;
    }

    if (joules.trim() && (isNaN(Number(joules)) || Number(joules) <= 0)) {
      setError("Joules inválido (digite apenas números)");
      return;
    }

    // Validar data agendada
    if (isScheduled && scheduledDate <= new Date()) {
      setError("Data agendada deve ser futura");
      return;
    }

    try {
      setLoading(true);

      let notificationId: string | null = null;

      // Se for sessão agendada, criar notificação
      if (isScheduled) {
        const patients = await getPatients();
        const patient = patients.find((p) => p.id === patientId);
        if (patient) {
          notificationId = await scheduleSessionReminder(patient.fullName, scheduledDate);
        }
      }

      await saveSession({
        patientId,
        planId: selectedPlanId,
        sessionDate: isScheduled ? scheduledDate.toISOString() : new Date().toISOString(),
        scheduledDate: isScheduled ? scheduledDate.toISOString() : undefined,
        notificationId: notificationId || undefined,
        durationMinutes: Number(durationMinutes),
        stimulatedPoints: selectedPoints,
        joules: joules.trim() ? Number(joules) : undefined,
        symptomScore: symptomScore.trim() ? Number(symptomScore) : undefined,
        observations: observations.trim() || undefined,
        patientReactions: patientReactions.trim() || undefined,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Limpar formulário
      setDurationMinutes("");
      setJoules("");
      setSymptomScore("");
      setObservations("");
      setPatientReactions("");
      setSelectedPoints([]);
      setIsScheduled(false);
      setScheduledDate(new Date());
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
    setDurationMinutes("");
    setJoules("");
    setSymptomScore("");
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
              selectedPointId={selectedPointId}
              onPointIdChange={setSelectedPointId}
            />

            {/* Campos */}
            <View style={{ gap: 16 }}>
              {/* Duração */}
              {/* Agendar Sess\u00e3o */}
              <View
                style={{
                  backgroundColor: colors.primary + "10",
                  borderRadius: 12,
                  padding: 16,
                  gap: 12,
                  borderWidth: 1,
                  borderColor: colors.primary + "30",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                      Agendar Sessão Futura
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                      Ative para agendar uma sessão futura com notificação
                    </Text>
                  </View>
                  <Switch
                    value={isScheduled}
                    onValueChange={setIsScheduled}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {isScheduled && (
                  <View style={{ gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={{
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>Data</Text>
                      <Text style={{ fontSize: 16, color: colors.foreground }}>
                        {scheduledDate.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setShowTimePicker(true)}
                      style={{
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>Horário</Text>
                      <Text style={{ fontSize: 16, color: colors.foreground }}>
                        {scheduledDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={scheduledDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setScheduledDate(selectedDate);
                          }
                        }}
                        minimumDate={new Date()}
                      />
                    )}

                    {showTimePicker && (
                      <DateTimePicker
                        value={scheduledDate}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowTimePicker(false);
                          if (selectedDate) {
                            setScheduledDate(selectedDate);
                          }
                        }}
                      />
                    )}
                  </View>
                )}
              </View>

              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Duração (minutos) *
                </Text>
                <TextInput
                  value={durationMinutes}
                  onChangeText={setDurationMinutes}
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

              {/* Joules */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Joules (opcional)
                </Text>
                <TextInput
                  value={joules}
                  onChangeText={setJoules}
                  placeholder="Ex: 5"
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

              {/* Avaliação de Sintomas */}
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Avaliação dos Sintomas (0-10)
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: -4 }}>
                  0 = Sem sintomas | 10 = Sintomas muito intensos
                </Text>
                <TextInput
                  value={symptomScore}
                  onChangeText={(text) => {
                    // Limitar entre 0 e 10
                    const num = Number(text);
                    if (text === "" || (num >= 0 && num <= 10)) {
                      setSymptomScore(text);
                    }
                  }}
                  placeholder="Ex: 5"
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
