import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useState } from "react";
import { getSessions, getPatients, getPlans, saveSession, type Session, type Patient, type TherapeuticPlan } from "@/lib/local-storage";
import { TherapeuticPlanDisplay } from "@/components/therapeutic-plan-display";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function SessionsScreen() {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [plans, setPlans] = useState<TherapeuticPlan[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [activePlan, setActivePlan] = useState<TherapeuticPlan | null>(null);

  // Formulário de nova sessão
  const [durationMinutes, setDurationMinutes] = useState("");
  const [joules, setJoules] = useState("");
  const [observations, setObservations] = useState("");
  const [patientReactions, setPatientReactions] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, patientsData, plansData] = await Promise.all([
        getSessions(),
        getPatients(),
        getPlans(),
      ]);
      setSessions(sessionsData);
      setPatients(patientsData);
      setPlans(plansData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient?.fullName || "Paciente desconhecido";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNewSession = (patient: Patient) => {
    setSelectedPatient(patient);
    
    // Buscar plano ativo do paciente
    const patientPlan = plans.find((p) => p.patientId === patient.id && p.isActive);
    setActivePlan(patientPlan || null);
    
    // Limpar formulário
    setDurationMinutes("");
    setJoules("");
    setObservations("");
    setPatientReactions("");
    
    setShowNewSessionForm(true);
  };

  const handleSaveSession = async () => {
    if (!selectedPatient || !activePlan) {
      Alert.alert("Erro", "Paciente ou plano não selecionado");
      return;
    }

    if (!durationMinutes) {
      Alert.alert("Erro", "Por favor, informe a duração da sessão");
      return;
    }

    try {
      const newSession = await saveSession({
        patientId: selectedPatient.id,
        planId: activePlan.id,
        sessionDate: new Date().toISOString(),
        durationMinutes: parseInt(durationMinutes),
        stimulatedPoints: activePlan.targetPoints,
        joules: joules ? parseInt(joules) : undefined,
        observations: observations || undefined,
        patientReactions: patientReactions || undefined,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Recarregar sessões
      const updatedSessions = await getSessions();
      setSessions(updatedSessions);

      // Fechar formulário
      setShowNewSessionForm(false);
      setSelectedPatient(null);
      setActivePlan(null);

      Alert.alert("Sucesso", "Sessão registrada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a sessão");
      console.error("Erro ao salvar sessão:", error);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const sortedSessions = [...sessions].sort((a, b) => {
    return new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
  });

  // Agrupar sessões por paciente
  const sessionsByPatient = patients.map((patient) => ({
    patient,
    sessions: sortedSessions.filter((s) => s.patientId === patient.id),
  }));

  if (showNewSessionForm && selectedPatient && activePlan) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ gap: 16 }}>
            {/* Header */}
            <View style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowNewSessionForm(false);
                  setSelectedPatient(null);
                  setActivePlan(null);
                }}
              >
                <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>
                  ← Voltar
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>
                Nova Sessão
              </Text>
            </View>

            {/* Plano Terapêutico */}
            <TherapeuticPlanDisplay
              plan={activePlan}
              patientName={selectedPatient.fullName}
            />

            {/* Formulário de Nova Sessão */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>
                Registrar Sessão
              </Text>

              {/* Duração */}
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                  Duração (minutos) *
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    color: colors.foreground,
                    fontSize: 14,
                  }}
                  placeholder="Ex: 30"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  value={durationMinutes}
                  onChangeText={setDurationMinutes}
                />
              </View>

              {/* Joules */}
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                  Joules (opcional)
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    color: colors.foreground,
                    fontSize: 14,
                  }}
                  placeholder="Ex: 5"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  value={joules}
                  onChangeText={setJoules}
                />
              </View>

              {/* Observações */}
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                  Observações (opcional)
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    color: colors.foreground,
                    fontSize: 14,
                    minHeight: 80,
                    textAlignVertical: "top",
                  }}
                  placeholder="Observações sobre a sessão..."
                  placeholderTextColor={colors.muted}
                  multiline
                  value={observations}
                  onChangeText={setObservations}
                />
              </View>

              {/* Reações do Paciente */}
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                  Reações do Paciente (opcional)
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    color: colors.foreground,
                    fontSize: 14,
                    minHeight: 80,
                    textAlignVertical: "top",
                  }}
                  placeholder="Reações observadas..."
                  placeholderTextColor={colors.muted}
                  multiline
                  value={patientReactions}
                  onChangeText={setPatientReactions}
                />
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity
                onPress={handleSaveSession}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  padding: 14,
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.background }}>
                  Salvar Sessão
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, gap: 16 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>
              Histórico de Sessões
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              {sessions.length} sessão(ões) registrada(s)
            </Text>
          </View>

          {/* Lista de Pacientes com Sessões */}
          <View style={{ gap: 16 }}>
            {sessionsByPatient.length === 0 ? (
              <View style={{ padding: 32, alignItems: "center" }}>
                <IconSymbol name="house.fill" size={48} color={colors.muted} />
                <Text style={{ fontSize: 14, color: colors.muted, marginTop: 16, textAlign: "center" }}>
                  Nenhuma sessão registrada
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 8, textAlign: "center" }}>
                  As sessões aparecerão aqui após serem registradas
                </Text>
              </View>
            ) : (
              sessionsByPatient.map((group) => (
                <View key={group.patient.id} style={{ gap: 12 }}>
                  {/* Header do Paciente */}
                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>
                        {group.patient.fullName}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleNewSession(group.patient)}
                        style={{
                          backgroundColor: colors.primary,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.background }}>
                          + Nova
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.muted }}>
                      {group.sessions.length} sessão(ões)
                    </Text>
                  </View>

                  {/* Sessões do Paciente */}
                  {group.sessions.length === 0 ? (
                    <View
                      style={{
                        backgroundColor: colors.surface,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.border,
                        padding: 16,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 13, color: colors.muted }}>
                        Nenhuma sessão registrada para este paciente
                      </Text>
                    </View>
                  ) : (
                    group.sessions.map((session) => (
                      <View
                        key={session.id}
                        style={{
                          backgroundColor: colors.surface,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: colors.border,
                          padding: 16,
                          gap: 12,
                        }}
                      >
                        {/* Header da Sessão */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 4 }}>
                              {formatDate(session.sessionDate)} às {formatTime(session.sessionDate)}
                            </Text>
                          </View>
                          <View
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 4,
                              borderRadius: 12,
                              backgroundColor: colors.primary + "20",
                            }}
                          >
                            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                              {session.durationMinutes} min
                            </Text>
                          </View>
                        </View>

                        {/* Pontos Estimulados */}
                        <View style={{ gap: 4 }}>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                            Pontos Estimulados
                          </Text>
                          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                            {session.stimulatedPoints.map((point, index) => (
                              <View
                                key={index}
                                style={{
                                  paddingHorizontal: 8,
                                  paddingVertical: 4,
                                  borderRadius: 8,
                                  backgroundColor: colors.primary + "15",
                                }}
                              >
                                <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "500" }}>
                                  {point}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        {/* Joules */}
                        {session.joules && (
                          <View style={{ gap: 4 }}>
                            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                              Joules
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.foreground }}>
                              {session.joules} J
                            </Text>
                          </View>
                        )}

                        {/* Observações */}
                        {session.observations && (
                          <View style={{ gap: 4 }}>
                            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                              Observações
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
                              {session.observations}
                            </Text>
                          </View>
                        )}

                        {/* Reações do Paciente */}
                        {session.patientReactions && (
                          <View style={{ gap: 4 }}>
                            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                              Reações do Paciente
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
                              {session.patientReactions}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
