import { ScrollView, Text, View, ActivityIndicator, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useProfessionalInfo } from "@/hooks/use-professional-info";
import { useEffect, useState } from "react";
import { getSessions, getPatients, type Session, type Patient } from "@/lib/local-storage";
import { generateSessionPDF } from "@/lib/session-pdf-generator";

export default function SessionsScreen() {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, patientsData] = await Promise.all([
        getSessions(),
        getPatients(),
      ]);
      setSessions(sessionsData);
      setPatients(patientsData);
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

  const { professional } = useProfessionalInfo();

  const validateProfessionalData = (): boolean => {
    if (!professional.firstName.trim() || !professional.lastName.trim()) {
      Alert.alert(
        "Perfil Incompleto",
        "Por favor, preencha seu nome completo no Perfil antes de exportar PDFs."
      );
      return false;
    }
    if (!professional.registrationNumber.trim()) {
      Alert.alert(
        "Perfil Incompleto",
        "Por favor, preencha seu número de registro no Perfil antes de exportar PDFs."
      );
      return false;
    }
    return true;
  };

  const exportSessionPDF = async (session: Session, patientName: string) => {
    if (!validateProfessionalData()) {
      return;
    }
    try {
      await generateSessionPDF(session, patientName);
      Alert.alert("Sucesso", "PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      Alert.alert("Erro", "Falha ao exportar PDF. Tente novamente.");
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

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, gap: 16 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>
              Nova Sessão
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              {sessions.length} sessão(ões) registrada(s)
            </Text>
          </View>

          {/* Lista de Sessões */}
          <View style={{ gap: 12 }}>
            {sortedSessions.length === 0 ? (
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
              sortedSessions.map((session) => (
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
                      <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                        {getPatientName(session.patientId)}
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
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

                  {/* Botão Visualizar Prévia */}
                  <Pressable
                    onPress={() => Alert.alert("Visualização Prévia", "Prévia do PDF será exibida em breve. Clique em Exportar PDF para salvar.")}
                    style={({ pressed }) => [
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.primary,
                        borderWidth: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <IconSymbol name="doc.text.fill" size={16} color={colors.primary} />
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                      Visualizar
                    </Text>
                  </Pressable>

                  {/* Botão Exportar PDF */}
                  <Pressable
                    onPress={() => exportSessionPDF(session, getPatientName(session.patientId))}
                    style={({ pressed }) => [
                      {
                        backgroundColor: colors.primary,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <IconSymbol name="paperplane.fill" size={16} color="white" />
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>
                      Exportar PDF
                    </Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
