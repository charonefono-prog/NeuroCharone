import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Modal, Platform } from "react-native";
import { useState, useEffect, useMemo } from "react";
import { useColors } from "@/hooks/use-colors";
import { useProfessionalInfo } from "@/hooks/use-professional-info";
import { getPatientScaleResponses, getScaleStatistics } from "@/lib/scale-storage";
import { ALL_SCALES } from "@/lib/clinical-scales";
import { exportAndShareScaleResult } from "@/lib/pdf-export-service";
import { ScaleChart, ScaleLineChart } from "./scale-chart";

interface PatientScalesSectionProps {
  patientId: string;
  patientName: string;
}

export function PatientScalesSection({ patientId, patientName }: PatientScalesSectionProps) {
  const colors = useColors();
  const { professional } = useProfessionalInfo();
  const [loading, setLoading] = useState(true);
  const [scalesByType, setScalesByType] = useState<Record<string, any[]>>({});
  const [statistics, setStatistics] = useState<Record<string, any>>({});
  const [selectedScaleType, setSelectedScaleType] = useState<string | null>(null);
  const [showScaleDetail, setShowScaleDetail] = useState(false);

  useEffect(() => {
    loadScales();
  }, [patientId]);

  const loadScales = async () => {
    try {
      setLoading(true);
      const allScales: Record<string, any[]> = {};
      const allStats: Record<string, any> = {};

      // Carregar escalas de cada tipo
      const allResponses = await getPatientScaleResponses(patientId);
      
      // Agrupar por tipo de escala
      const grouped: Record<string, any[]> = {};
      allResponses.forEach((response) => {
        if (!grouped[response.scaleType]) {
          grouped[response.scaleType] = [];
        }
        grouped[response.scaleType].push(response);
      });
      
      // Carregar estatisticas para cada tipo
      for (const scaleType of Object.keys(grouped)) {
        allScales[scaleType] = grouped[scaleType];
        const stats = await getScaleStatistics(patientId, scaleType as any);
        allStats[scaleType] = stats;
      }

      setScalesByType(allScales);
      setStatistics(allStats);
    } catch (error) {
      console.error("Erro ao carregar escalas:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScaleInfo = (scaleType: string) => {
    return ALL_SCALES.find((s) => s.type === scaleType);
  };

  const getScoreColor = (score: number, scaleType: string) => {
    const scale = getScaleInfo(scaleType);
    if (!scale) return colors.muted;

    // Cores baseadas na interpretação
    if (scaleType === "doss") {
      return score >= 6 ? colors.success : score >= 4 ? colors.warning : colors.error;
    } else if (scaleType === "btss") {
      return score <= 10 ? colors.success : score <= 20 ? colors.warning : colors.error;
    } else if (scaleType === "bdae") {
      return score >= 20 ? colors.success : score >= 10 ? colors.warning : colors.error;
    } else if (scaleType === "cm" || scaleType === "qcs") {
      return score >= 80 ? colors.success : score >= 50 ? colors.warning : colors.error;
    } else if (scaleType === "sara") {
      return score <= 10 ? colors.success : score <= 20 ? colors.warning : colors.error;
    }

    return colors.primary;
  };

  if (loading) {
    return (
      <View style={{ padding: 24, alignItems: "center", justifyContent: "center", minHeight: 200 }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.muted }}>Carregando escalas...</Text>
      </View>
    );
  }

  const hasScales = Object.keys(scalesByType).length > 0;

  if (!hasScales) {
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: colors.muted, textAlign: "center" }}>
          Nenhuma escala aplicada ainda
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 8, textAlign: "center" }}>
          Acesse a aba "Escalas" para aplicar uma escala clínica
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      {/* Header */}
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
          📊 Escalas Clínicas
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>
          {Object.keys(scalesByType).length} escala(s) aplicada(s)
        </Text>
      </View>

      {/* Lista de Escalas */}
      <View style={{ gap: 12 }}>
        {Object.entries(scalesByType).map(([scaleType, responses]) => {
          const scaleInfo = getScaleInfo(scaleType);
          const lastResponse = responses[responses.length - 1];
          const stats = statistics[scaleType];
          const scoreColor = getScoreColor(lastResponse.totalScore, scaleType);

          return (
            <TouchableOpacity
              key={scaleType}
              onPress={() => {
                setSelectedScaleType(scaleType);
                setShowScaleDetail(true);
              }}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
                gap: 12,
              }}
            >
              {/* Cabeçalho da Escala */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    {scaleInfo?.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    {responses.length} aplicação(ões)
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: scoreColor + "20",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "700", color: scoreColor }}>
                    {lastResponse.totalScore}
                  </Text>
                </View>
              </View>

              {/* Interpretação */}
              <View
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 8,
                  padding: 10,
                  borderLeftWidth: 3,
                  borderLeftColor: scoreColor,
                }}
              >
                <Text style={{ fontSize: 12, color: colors.foreground, lineHeight: 18 }}>
                  {lastResponse.interpretation}
                </Text>
              </View>

              {/* Estatísticas */}
              {stats && (
                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 11, color: colors.muted }}>Primeira avaliação:</Text>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.foreground }}>
                      {responses[0].totalScore}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 11, color: colors.muted }}>Última avaliação:</Text>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.foreground }}>
                      {lastResponse.totalScore}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 11, color: colors.muted }}>Tendência:</Text>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color:
                          stats.trend === "improving"
                            ? colors.success
                            : stats.trend === "declining"
                            ? colors.error
                            : colors.muted,
                      }}
                    >
                      {stats.trend === "improving"
                        ? "📈 Melhorando"
                        : stats.trend === "declining"
                        ? "📉 Piorando"
                        : "➡️ Estável"}
                    </Text>
                  </View>
                </View>
              )}

              {/* Data da última avaliação */}
              <Text style={{ fontSize: 10, color: colors.muted, marginTop: 4 }}>
                Última avaliação: {new Date(lastResponse.date).toLocaleDateString("pt-BR")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal - Detalhes da Escala */}
      <Modal visible={showScaleDetail} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ padding: 24, gap: 24 }}>
              {selectedScaleType && scalesByType[selectedScaleType] && (
                <>
                  {/* Header */}
                  <View style={{ gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => setShowScaleDetail(false)}
                      style={{ marginBottom: 8 }}
                    >
                      <Text style={{ fontSize: 16, color: colors.primary, fontWeight: "600" }}>
                        ← Voltar
                      </Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>
                      {getScaleInfo(selectedScaleType)?.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      Paciente: {patientName}
                    </Text>
                  </View>

                  {/* Gráfico de Evolução */}
                  <ScaleChart
                    data={scalesByType[selectedScaleType]}
                    scaleType={selectedScaleType}
                  />

                  {/* Gráfico de Linha */}
                  <ScaleLineChart data={scalesByType[selectedScaleType]} />

                  {/* Botao de Exportar */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.success,
                      borderRadius: 12,
                      padding: 16,
                      alignItems: "center",
                    }}
                    onPress={async () => {
                      try {
                        const lastResponse = scalesByType[selectedScaleType][scalesByType[selectedScaleType].length - 1];
                        const success = await exportAndShareScaleResult(
                          lastResponse,
                          professional,
                          { id: patientId, fullName: patientName }
                        );
                        if (!success) alert("Erro ao exportar PDF");
                      } catch (error) {
                        console.error("Erro:", error);
                        alert("Erro ao exportar PDF");
                      }
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "white", fontWeight: "600" }}>
                      Exportar Evolucao em PDF
                    </Text>
                  </TouchableOpacity>

                  {/* Historico Detalhado */}
                  <View style={{ gap: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                      Historico Completo
                    </Text>
                    {scalesByType[selectedScaleType].map((response, index) => (
                      <View
                        key={response.id}
                        style={{
                          backgroundColor: colors.surface,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: colors.border,
                          padding: 12,
                          gap: 8,
                        }}
                      >
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: 12, color: colors.muted }}>
                            Avaliação #{index + 1}
                          </Text>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                            {new Date(response.date).toLocaleDateString("pt-BR")}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <Text style={{ fontSize: 12, color: colors.muted }}>Score:</Text>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "700",
                              color: getScoreColor(response.totalScore, selectedScaleType),
                            }}
                          >
                            {response.totalScore}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: colors.background,
                            borderRadius: 8,
                            padding: 10,
                            borderLeftWidth: 3,
                            borderLeftColor: getScoreColor(response.totalScore, selectedScaleType),
                          }}
                        >
                          <Text style={{ fontSize: 12, color: colors.foreground, lineHeight: 18 }}>
                            {response.interpretation}
                          </Text>
                        </View>
                        {response.notes && (
                          <View
                            style={{
                              backgroundColor: colors.warning + "15",
                              borderRadius: 8,
                              padding: 10,
                              borderLeftWidth: 3,
                              borderLeftColor: colors.warning,
                            }}
                          >
                            <Text style={{ fontSize: 11, color: colors.muted, fontStyle: "italic" }}>
                              Notas: {response.notes}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
