import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getPatients, type Patient } from "@/lib/local-storage";
import { getPatientScaleResponses } from "@/lib/scale-storage";
import { useProfessionalInfo } from "@/hooks/use-professional-info";
import { exportAndShareEffectivenessReport } from "@/lib/effectiveness-pdf-generator";
import { ScaleResponse } from "@/lib/clinical-scales";
import { EvolutionChart } from "@/components/evolution-chart";
import { ComparativeCharts } from "@/components/comparative-charts";
import * as Haptics from "expo-haptics";

export default function EffectivenessScreen() {
  const colors = useColors();
  const { professional } = useProfessionalInfo();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [scaleResponses, setScaleResponses] = useState<ScaleResponse[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPatientSelector, setShowPatientSelector] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientData = async (patient: Patient) => {
    try {
      setLoading(true);
      const responses = await getPatientScaleResponses(patient.id);
      
      // Calcular estatísticas gerais
      const uniqueScales = new Set(responses.map(r => r.scaleType));
      const stats = {
        totalApplications: responses.length,
        uniqueScales: uniqueScales.size,
      };
      
      setSelectedPatient(patient);
      setScaleResponses(responses);
      setStatistics(stats);
      setShowPatientSelector(false);
    } catch (error) {
      console.error("Erro ao carregar dados do paciente:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do paciente");
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    if (!selectedPatient || scaleResponses.length === 0) {
      Alert.alert("Aviso", "Nenhuma escala aplicada a este paciente");
      return;
    }

    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const success = await exportAndShareEffectivenessReport(
        selectedPatient,
        scaleResponses,
        statistics,
        professional
      );

      if (success) {
        Alert.alert("Sucesso", "Relatório de efetividade exportado com sucesso!");
      } else {
        Alert.alert("Erro", "Erro ao exportar relatório");
      }
    } catch (error) {
      console.error("Erro ao exportar:", error);
      Alert.alert("Erro", "Erro ao exportar relatório");
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return colors.error;
    if (percentage >= 60) return colors.warning;
    return colors.success;
  };

  if (loading && !selectedPatient) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, gap: 24 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground }}>
              Efetividade
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Acompanhamento e evolução das escalas
            </Text>
          </View>

          {/* Seletor de Paciente */}
          {!selectedPatient ? (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                Selecione um Paciente
              </Text>
              {patients.length === 0 ? (
                <View style={{ padding: 32, alignItems: "center" }}>
                  <IconSymbol name="person.fill" size={48} color={colors.muted} />
                  <Text style={{ fontSize: 16, color: colors.muted, marginTop: 16, textAlign: "center" }}>
                    Nenhum paciente encontrado
                  </Text>
                </View>
              ) : (
                patients.map((patient) => (
                  <TouchableOpacity
                    key={patient.id}
                    onPress={() => loadPatientData(patient)}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: 16,
                      gap: 8,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                      {patient.fullName}
                    </Text>
                    {patient.diagnosis && (
                      <Text style={{ fontSize: 14, color: colors.muted }}>
                        {patient.diagnosis}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
          ) : (
            <>
              {/* Informações do Paciente */}
              <View
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
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                      {selectedPatient.fullName}
                    </Text>
                    {selectedPatient.diagnosis && (
                      <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                        {selectedPatient.diagnosis}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedPatient(null)}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: colors.border,
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <IconSymbol name="chevron.right" size={20} color={colors.foreground} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Estatísticas Gerais */}
              {statistics && (
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                    Resumo
                  </Text>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: colors.surface,
                        padding: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
                        Total de Escalas
                      </Text>
                      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.primary }}>
                        {statistics.totalApplications || 0}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: colors.surface,
                        padding: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
                        Escalas Únicas
                      </Text>
                      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.primary }}>
                        {statistics.uniqueScales || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Gráficos de Evolução */}
              {scaleResponses.length > 1 && (
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                    Gráficos de Evolução
                  </Text>
                  {Array.from(new Set(scaleResponses.map((r) => r.scaleName))).map((scaleName) => (
                    <ComparativeCharts
                      key={scaleName}
                      scaleResponses={scaleResponses}
                      scaleName={scaleName}
                    />
                  ))}
                </View>
              )}

              {/* Lista de Escalas */}
              {scaleResponses.length > 0 ? (
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                    Escalas Aplicadas
                  </Text>
                  {scaleResponses.map((response, index) => (
                    <View
                      key={response.id}
                      style={{
                        backgroundColor: colors.surface,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.border,
                        padding: 16,
                        gap: 12,
                      }}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                            {response.scaleName}
                          </Text>
                          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                            {new Date(response.date).toLocaleDateString("pt-BR")}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: colors.primary + "20",
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "700",
                              color: colors.primary,
                            }}
                          >
                            {response.totalScore}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          backgroundColor: colors.background,
                          padding: 12,
                          borderRadius: 8,
                          gap: 8,
                        }}
                      >
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: 12, color: colors.muted }}>Pontuação:</Text>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                            {response.totalScore}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: colors.muted, fontStyle: "italic" }}>
                          {response.interpretation}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={{ padding: 32, alignItems: "center" }}>
                  <IconSymbol name="paperplane.fill" size={48} color={colors.muted} />
                  <Text style={{ fontSize: 16, color: colors.muted, marginTop: 16, textAlign: "center" }}>
                    Nenhuma escala aplicada
                  </Text>
                </View>
              )}

              {/* Botão de Exportar */}
              {scaleResponses.length > 0 && (
                <TouchableOpacity
                  onPress={handleExportReport}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.primary,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: "center",
                    marginTop: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                    📄 Exportar Relatório de Efetividade
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
