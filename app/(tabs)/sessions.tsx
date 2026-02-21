import { ScrollView, Text, View, ActivityIndicator, Pressable, Alert, TouchableOpacity, Modal, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useState } from "react";
import { getSessions, getPatients, type Session, type Patient } from "@/lib/local-storage";
import { generateSessionPDF } from "@/lib/session-pdf-generator";

export default function SessionsScreen() {
  const colors = useColors();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [formData, setFormData] = useState({
    durationMinutes: '30',
    stimulatedPoints: [] as string[],
    joules: '',
    observations: '',
    patientReactions: '',
  });

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

  const exportSessionPDF = async (session: Session, patientName: string) => {
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

  const saveSession = async () => {
    if (!selectedPatient) {
      Alert.alert('Erro', 'Por favor, selecione um paciente');
      return;
    }
    if (formData.stimulatedPoints.length === 0) {
      Alert.alert('Erro', 'Por favor, selecione pelo menos um ponto estimulado');
      return;
    }

    const newSession: Session = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      sessionDate: new Date().toISOString(),
      durationMinutes: parseInt(formData.durationMinutes),
      stimulatedPoints: formData.stimulatedPoints,
      joules: formData.joules ? parseFloat(formData.joules) : undefined,
      observations: formData.observations,
      patientReactions: formData.patientReactions,
      createdAt: new Date().toISOString(),
    };

    const updated = [...sessions, newSession];
    setSessions(updated);

    setFormData({
      durationMinutes: '30',
      stimulatedPoints: [],
      joules: '',
      observations: '',
      patientReactions: '',
    });
    setSelectedPatient(null);
    setShowForm(false);

    Alert.alert('Sucesso', 'Sessão criada com sucesso!');
  };

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

          {/* Botão Nova Sessão */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => setShowForm(!showForm)}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
              {showForm ? '✕ Cancelar' : '+ Nova Sessão'}
            </Text>
          </TouchableOpacity>

          {/* Formulário Nova Sessão */}
          {showForm && (
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              gap: 12,
            }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>Criar Nova Sessão</Text>

              {/* Seletor de Paciente */}
              <View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 8 }}>Paciente *</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => setShowPatientModal(true)}
                >
                  <Text style={{ color: selectedPatient ? colors.foreground : colors.muted, fontWeight: selectedPatient ? '600' : '400' }}>
                    {selectedPatient ? selectedPatient.fullName : 'Selecione um paciente...'}
                  </Text>
                  <Text style={{ color: colors.primary, fontSize: 18 }}>›</Text>
                </TouchableOpacity>
              </View>

              {/* Modal de Pacientes */}
              <Modal visible={showPatientModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                  <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80%' }}>
                    <ScrollView>
                      {patients.map((patient) => (
                        <TouchableOpacity
                          key={patient.id}
                          style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}
                          onPress={() => {
                            setSelectedPatient(patient);
                            setShowPatientModal(false);
                          }}
                        >
                          <Text style={{ fontSize: 16, color: colors.foreground }}>{patient.fullName}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>

              {/* Duração */}
              <View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 8 }}>Duração (minutos)</Text>
                <TextInput
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: colors.foreground,
                  }}
                  placeholder="30"
                  placeholderTextColor={colors.muted}
                  value={formData.durationMinutes}
                  onChangeText={(text) => setFormData({ ...formData, durationMinutes: text })}
                  keyboardType="numeric"
                />
              </View>

              {/* Joules */}
              <View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 8 }}>Joules</Text>
                <TextInput
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: colors.foreground,
                  }}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  value={formData.joules}
                  onChangeText={(text) => setFormData({ ...formData, joules: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Observações */}
              <View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 8 }}>Observações</Text>
                <TextInput
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: colors.foreground,
                    minHeight: 80,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Digite observações..."
                  placeholderTextColor={colors.muted}
                  value={formData.observations}
                  onChangeText={(text) => setFormData({ ...formData, observations: text })}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Reações do Paciente */}
              <View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 8 }}>Reações do Paciente</Text>
                <TextInput
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: colors.foreground,
                    minHeight: 80,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Digite reações..."
                  placeholderTextColor={colors.muted}
                  value={formData.patientReactions}
                  onChangeText={(text) => setFormData({ ...formData, patientReactions: text })}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={saveSession}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>Salvar Sessão</Text>
              </TouchableOpacity>
            </View>
          )}

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
