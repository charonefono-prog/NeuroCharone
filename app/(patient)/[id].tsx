import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getPatients,
  getPlansByPatient,
  getSessionsByPatient,
  updatePatient,
  type Patient,
  type TherapeuticPlan,
  type Session,
  type MediaItem,
} from "@/lib/local-storage";
import { AddSessionModal } from "@/components/add-session-modal";
import { AddPlanModal } from "@/components/add-plan-modal";
import { EditPatientModal } from "@/components/edit-patient-modal";
import { PatientMediaGallery } from "@/components/patient-media-gallery";
import { BeforeAfterComparison } from "@/components/before-after-comparison";
import { SymptomEvolutionChart } from "@/components/symptom-evolution-chart";
import { SessionHelmetViewer } from "@/components/session-helmet-viewer";
import { generatePatientPDFReport } from "@/lib/pdf-generator-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

type Tab = "info" | "plan" | "evolution" | "nextSession" | "history";

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [plans, setPlans] = useState<TherapeuticPlan[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Salvar última aba visualizada
  useEffect(() => {
    if (activeTab && id) {
      localStorage?.setItem(`patient-${id}-lastTab`, activeTab);
    }
  }, [activeTab, id]);

  // Carregar última aba visualizada
  useEffect(() => {
    if (id) {
      const lastTab = localStorage?.getItem(`patient-${id}-lastTab`) as Tab | null;
      if (lastTab && ["info", "plan", "evolution", "nextSession", "history"].includes(lastTab)) {
        setActiveTab(lastTab);
      }
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddMedia = async (newMedia: MediaItem) => {
    if (!patient) return;

    const updatedPatient = {
      ...patient,
      media: [...(patient.media || []), newMedia],
    };

    await updatePatient(patient.id, updatedPatient);
    setPatient(updatedPatient);
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!patient) return;

    const updatedPatient = {
      ...patient,
      media: (patient.media || []).filter((item) => item.id !== mediaId),
    };

    await updatePatient(patient.id, updatedPatient);
    setPatient(updatedPatient);
  };

  const handleGenerateReport = async () => {
    if (!patient) return;

    try {
      setGeneratingReport(true);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      await generatePatientPDFReport(
        patient,
        activePlan || null,
        sessions
      );

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert("Erro ao gerar relatório. Tente novamente.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const patients = await getPatients();
      const foundPatient = patients.find((p) => p.id === id);
      
      if (!foundPatient) {
        router.back();
        return;
      }

      const [plansData, sessionsData] = await Promise.all([
        getPlansByPatient(id!),
        getSessionsByPatient(id!),
      ]);

      setPatient(foundPatient);
      setPlans(plansData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error loading patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "paused":
        return "Pausado";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!patient) {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <Text style={{ fontSize: 16, color: colors.muted }}>Paciente não encontrado</Text>
      </ScreenContainer>
    );
  }

  const activePlan = plans.find((p) => p.isActive);
  const nextSession = sessions.find((s) => new Date(s.sessionDate) > new Date());

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              backgroundColor: colors.primary,
              padding: 24,
              paddingTop: 60,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                <IconSymbol name="chevron.right" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGenerateReport}
                disabled={generatingReport}
                activeOpacity={0.7}
                style={{
                  backgroundColor: "#FFFFFF30",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  opacity: generatingReport ? 0.6 : 1,
                  zIndex: 1000,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF", pointerEvents: "none" }}>
                  {generatingReport ? "Gerando..." : "📄 Relatório"}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#FFFFFF" }}>
                  {patient.fullName}
                </Text>
                <Text style={{ fontSize: 16, color: "#FFFFFF", opacity: 0.9, marginTop: 4 }}>
                  {calculateAge(patient.birthDate)} anos
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: "#FFFFFF30",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFFFFF" }}>
                  {getStatusLabel(patient.status)}
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs - Reorganizadas */}
          <View
            style={{
              backgroundColor: colors.background,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={true} pointerEvents="box-none">
              <View style={{ flexDirection: "row", gap: 12 }}>
                {[
                  { key: "info" as Tab, label: "Info", emoji: "📋" },
                  { key: "plan" as Tab, label: "Plano", emoji: "📝" },
                  { key: "evolution" as Tab, label: "Evolução", emoji: "📊" },
                  { key: "nextSession" as Tab, label: "Próxima", emoji: "📅" },
                  { key: "history" as Tab, label: "Histórico", emoji: "📜" },
                ].map((tab) => (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    activeOpacity={0.8}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor: activeTab === tab.key ? colors.primary : colors.surface,
                      borderWidth: 1.5,
                      borderColor: activeTab === tab.key ? colors.primary : colors.border,
                      shadowColor: activeTab === tab.key ? colors.primary : "transparent",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: activeTab === tab.key ? 0.3 : 0,
                      shadowRadius: 4,
                      elevation: activeTab === tab.key ? 4 : 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: activeTab === tab.key ? "#FFFFFF" : colors.foreground,
                        textAlign: "center",
                      }}
                    >
                      {tab.emoji} {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Content */}
          <View style={{ padding: 24, gap: 20 }}>
            {/* ABA: INFO */}
            {activeTab === "info" && (
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 20, fontWeight: "600", color: colors.foreground }}>
                    Informações Pessoais
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowEditPatientModal(true)}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: colors.primary,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <IconSymbol name="house.fill" size={16} color="#FFFFFF" />
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}>
                      Editar
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ gap: 12 }}>
                  <View style={{ gap: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                      Data de Nascimento
                    </Text>
                    <Text style={{ fontSize: 16, color: colors.foreground }}>
                      {formatDate(patient.birthDate)}
                    </Text>
                  </View>

                  {patient.phone && (
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                        Telefone
                      </Text>
                      <Text style={{ fontSize: 16, color: colors.foreground }}>
                        {patient.phone}
                      </Text>
                    </View>
                  )}

                  {patient.email && (
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                        Email
                      </Text>
                      <Text style={{ fontSize: 16, color: colors.foreground }}>
                        {patient.email}
                      </Text>
                    </View>
                  )}

                  {patient.diagnosis && (
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                        Diagnóstico
                      </Text>
                      <Text style={{ fontSize: 16, color: colors.foreground, lineHeight: 24 }}>
                        {patient.diagnosis}
                      </Text>
                    </View>
                  )}

                  {patient.medicalNotes && (
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                        Observações Médicas
                      </Text>
                      <Text style={{ fontSize: 16, color: colors.foreground, lineHeight: 24 }}>
                        {patient.medicalNotes}
                      </Text>
                    </View>
                  )}

                  {patient.initialSymptomScore !== undefined && (
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                        Avaliação Inicial
                      </Text>
                      <Text style={{ fontSize: 16, color: colors.foreground }}>
                        {patient.initialSymptomScore}/10
                      </Text>
                    </View>
                  )}
                </View>

                {/* Galeria de Mídia */}
                <View style={{ marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <PatientMediaGallery
                    media={patient.media || []}
                    onAddMedia={handleAddMedia}
                    onDeleteMedia={handleDeleteMedia}
                  />
                </View>
              </View>
            )}

            {/* ABA: PLANO */}
            {activeTab === "plan" && (
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 20, fontWeight: "600", color: colors.foreground }}>
                    Plano Terapêutico
                  </Text>
                  {!activePlan && (
                    <TouchableOpacity
                      onPress={() => setShowAddPlanModal(true)}
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: colors.primary,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <IconSymbol name="house.fill" size={16} color="#FFFFFF" />
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}>
                        Criar
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {activePlan ? (
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
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                        Objetivo
                      </Text>
                      <Text style={{ fontSize: 16, color: colors.foreground, lineHeight: 24 }}>
                        {activePlan.objective}
                      </Text>
                    </View>

                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                        Regiões Alvo
                      </Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                        {activePlan.targetRegions.map((region, index) => (
                          <View
                            key={index}
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: colors.primary + "20",
                            }}
                          >
                            <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "500" }}>
                              {region}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                        Pontos de Estimulação
                      </Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                        {activePlan.targetPoints.map((point, index) => (
                          <View
                            key={index}
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: colors.success + "20",
                            }}
                          >
                            <Text style={{ fontSize: 12, color: colors.success, fontWeight: "500" }}>
                              {point}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", gap: 16 }}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                          Frequência
                        </Text>
                        <Text style={{ fontSize: 16, color: colors.foreground }}>
                          {activePlan.frequency}x por semana
                        </Text>
                      </View>

                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                          Duração Total
                        </Text>
                        <Text style={{ fontSize: 16, color: colors.foreground }}>
                          {activePlan.totalDuration} semanas
                        </Text>
                      </View>
                    </View>

                    {activePlan.notes && (
                      <View style={{ gap: 4 }}>
                        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                          Observações
                        </Text>
                        <Text style={{ fontSize: 16, color: colors.foreground, lineHeight: 24 }}>
                          {activePlan.notes}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={{ padding: 32, alignItems: "center" }}>
                    <IconSymbol name="house.fill" size={48} color={colors.muted} />
                    <Text style={{ fontSize: 16, color: colors.muted, marginTop: 16, textAlign: "center" }}>
                      Nenhum plano terapêutico ativo
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* ABA: EVOLUÇÃO */}
            {activeTab === "evolution" && (
              <View style={{ gap: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: "600", color: colors.foreground }}>
                  Evolução do Tratamento
                </Text>

                {/* Gráfico de Evolução */}
                {sessions.length > 0 && (
                  <View style={{ marginBottom: 8 }}>
                    <SymptomEvolutionChart patient={patient} sessions={sessions} />
                  </View>
                )}

                {/* Comparação Antes/Depois */}
                {sessions.length > 0 && (
                  <View style={{ marginBottom: 8 }}>
                    <BeforeAfterComparison patient={patient} sessions={sessions} plans={plans} />
                  </View>
                )}

                {/* Sessões com Pontos Usados */}
                <View style={{ gap: 16 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                      Sessões Realizadas
                    </Text>
                    {activePlan && (
                      <TouchableOpacity
                        onPress={() => setShowAddSessionModal(true)}
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: colors.primary,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <IconSymbol name="house.fill" size={16} color="#FFFFFF" />
                        <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}>
                          Nova
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {sessions.length > 0 ? (
                    <View style={{ gap: 12 }}>
                      {sessions
                        .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
                        .map((session) => (
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
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                                {formatDate(session.sessionDate)}
                              </Text>
                              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                                {session.durationMinutes} min • {session.joules}J
                              </Text>
                            </View>

                            <SessionHelmetViewer session={session} />

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
                          </View>
                        ))}
                    </View>
                  ) : (
                    <View style={{ padding: 32, alignItems: "center" }}>
                      <IconSymbol name="house.fill" size={48} color={colors.muted} />
                      <Text style={{ fontSize: 16, color: colors.muted, marginTop: 16, textAlign: "center" }}>
                        Nenhuma sessão registrada
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* ABA: PRÓXIMA SESSÃO */}
            {activeTab === "nextSession" && (
              <View style={{ gap: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: "600", color: colors.foreground }}>
                  Próxima Sessão
                </Text>

                {nextSession ? (
                  <View
                    style={{
                      backgroundColor: colors.primary + "15",
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: colors.primary,
                      padding: 20,
                      gap: 16,
                    }}
                  >
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                        Data e Hora
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
                        {formatDateTime(nextSession.sessionDate)}
                      </Text>
                    </View>

                    {activePlan && (
                      <>
                        <View style={{ gap: 4 }}>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                            Duração Planejada
                          </Text>
                          <Text style={{ fontSize: 16, color: colors.foreground }}>
                            {nextSession.durationMinutes} minutos
                          </Text>
                        </View>

                        <View style={{ gap: 4 }}>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                            Intensidade (Joules)
                          </Text>
                          <Text style={{ fontSize: 16, color: colors.foreground }}>
                            {nextSession.joules}J
                          </Text>
                        </View>

                        <View style={{ gap: 4 }}>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                            Pontos Planejados
                          </Text>
                          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                            {activePlan.targetPoints.map((point, index) => (
                              <View
                                key={index}
                                style={{
                                  paddingHorizontal: 12,
                                  paddingVertical: 6,
                                  borderRadius: 8,
                                  backgroundColor: colors.primary + "20",
                                }}
                              >
                                <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "500" }}>
                                  {point}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        <View style={{ gap: 4 }}>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                            Regiões Alvo
                          </Text>
                          <Text style={{ fontSize: 14, color: colors.foreground }}>
                            {activePlan.targetRegions.join(", ")}
                          </Text>
                        </View>

                        {nextSession.observations && (
                          <View style={{ gap: 4 }}>
                            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                              Observações
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
                              {nextSession.observations}
                            </Text>
                          </View>
                        )}
                      </>
                    )}

                    <TouchableOpacity
                      onPress={() => setShowAddSessionModal(true)}
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: colors.primary,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                        Registrar Sessão Realizada
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ padding: 32, alignItems: "center" }}>
                    <IconSymbol name="house.fill" size={48} color={colors.muted} />
                    <Text style={{ fontSize: 16, color: colors.muted, marginTop: 16, textAlign: "center" }}>
                      Nenhuma sessão agendada
                    </Text>
                    {activePlan && (
                      <TouchableOpacity
                        onPress={() => setShowAddSessionModal(true)}
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: colors.primary,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          marginTop: 16,
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}>
                          Agendar Sessão
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* ABA: HISTÓRICO */}
            {activeTab === "history" && (
              <View style={{ gap: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: "600", color: colors.foreground }}>
                  Histórico de Sessões
                </Text>

                {sessions.length > 0 ? (
                  <View style={{ gap: 12 }}>
                    {sessions
                      .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
                      .map((session) => (
                        <View
                          key={session.id}
                          style={{
                            backgroundColor: colors.surface,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: colors.border,
                            padding: 16,
                            gap: 8,
                          }}
                        >
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                              {formatDate(session.sessionDate)}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.muted }}>
                              {session.durationMinutes} min
                            </Text>
                          </View>

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
                                    borderRadius: 6,
                                    backgroundColor: colors.primary + "15",
                                  }}
                                >
                                  <Text style={{ fontSize: 11, fontWeight: "600", color: colors.primary }}>
                                    {point}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>

                          {session.observations && (
                            <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
                              {session.observations}
                            </Text>
                          )}
                        </View>
                      ))}
                  </View>
                ) : (
                  <View style={{ padding: 32, alignItems: "center" }}>
                    <IconSymbol name="house.fill" size={48} color={colors.muted} />
                    <Text style={{ fontSize: 16, color: colors.muted, marginTop: 16, textAlign: "center" }}>
                      Nenhuma sessão registrada
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Registro de Sessão */}
      {activePlan && (
        <AddSessionModal
          visible={showAddSessionModal}
          patientId={id!}
          planId={activePlan.id}
          onClose={() => setShowAddSessionModal(false)}
          onSuccess={loadData}
        />
      )}

      {/* Modal de Criar Plano */}
      <AddPlanModal
        visible={showAddPlanModal}
        patientId={id!}
        onClose={() => setShowAddPlanModal(false)}
        onSuccess={loadData}
      />

      {/* Modal de Editar Paciente */}
      {patient && (
        <EditPatientModal
          visible={showEditPatientModal}
          patient={patient}
          onClose={() => setShowEditPatientModal(false)}
          onSuccess={loadData}
        />
      )}
    </ScreenContainer>
  );
}
