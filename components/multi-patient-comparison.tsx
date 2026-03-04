import React, { useMemo } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse } from "@/lib/clinical-scales";
import {
  calculateImprovementPercentage,
  getScoreDirection,
} from "@/lib/improvement-calculator";

export interface PatientComparisonData {
  patientName: string;
  patientId: string;
  scaleResponses: ScaleResponse[];
}

export interface MultiPatientComparisonProps {
  patientsData: PatientComparisonData[];
  scaleName?: string;
}

/**
 * Componente de comparação multi-paciente
 * Exibe evolução de múltiplos pacientes lado a lado
 * 
 * Usa o calculador centralizado para determinar melhora/piora
 * respeitando a direção de cada escala (direta vs inversa).
 */
export function MultiPatientComparison({ patientsData, scaleName }: MultiPatientComparisonProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;

  // Filtrar e processar dados
  const comparisonData = useMemo(() => {
    return patientsData.map((patient) => {
      const responses = scaleName
        ? patient.scaleResponses.filter((r) => r.scaleName === scaleName)
        : patient.scaleResponses;

      const sortedResponses = [...responses].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const firstScore = sortedResponses[0]?.totalScore || 0;
      const lastScore = sortedResponses[sortedResponses.length - 1]?.totalScore || 0;
      const scaleType = sortedResponses[0]?.scaleType || "";

      // Usar calculador centralizado
      const improvement = calculateImprovementPercentage(scaleType, firstScore, lastScore);
      const direction = getScoreDirection(scaleType, firstScore, lastScore);

      return {
        patientName: patient.patientName,
        patientId: patient.patientId,
        totalApplications: sortedResponses.length,
        firstScore,
        lastScore,
        scaleType,
        improvement, // Sempre >= 0 (é porcentagem de melhora)
        direction,   // "improvement" | "decline" | "stable"
        avgScore: sortedResponses.length > 0
          ? sortedResponses.reduce((sum, r) => sum + (r.totalScore || 0), 0) / sortedResponses.length
          : 0,
      };
    });
  }, [patientsData, scaleName]);

  if (comparisonData.length === 0) {
    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 14, color: colors.muted }}>
          Nenhum dado de paciente disponível para comparação
        </Text>
      </View>
    );
  }

  // Encontrar valores máx para normalização de barras
  const maxScore = Math.max(...comparisonData.map((d) => Math.max(d.firstScore, d.lastScore)), 1);

  // Calcular melhora média (apenas dos que melhoraram)
  const improvedPatients = comparisonData.filter((d) => d.direction === "improvement");
  const avgImprovement = improvedPatients.length > 0
    ? improvedPatients.reduce((sum, d) => sum + d.improvement, 0) / improvedPatients.length
    : 0;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        gap: 16,
      }}
    >
      {/* Header */}
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
          Comparação de Pacientes
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>
          {comparisonData.length} paciente(s) com dados disponíveis
        </Text>
      </View>

      {/* Tabela de Comparação */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ gap: 12 }}>
          {/* Header da Tabela */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              paddingBottom: 8,
              borderBottomWidth: 2,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ width: 120 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted }}>
                Paciente
              </Text>
            </View>
            <View style={{ width: 60, alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted }}>
                Aplicações
              </Text>
            </View>
            <View style={{ width: 60, alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted }}>
                Inicial
              </Text>
            </View>
            <View style={{ width: 60, alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted }}>
                Final
              </Text>
            </View>
            <View style={{ width: 70, alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted }}>
                Resultado
              </Text>
            </View>
            <View style={{ width: 60, alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted }}>
                Média
              </Text>
            </View>
          </View>

          {/* Linhas da Tabela */}
          {comparisonData.map((data, index) => {
            const dirColor = data.direction === "improvement"
              ? colors.success
              : data.direction === "decline"
              ? colors.error
              : colors.muted;

            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  gap: 12,
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{ width: 120 }}>
                  <Text
                    style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}
                    numberOfLines={1}
                  >
                    {data.patientName}
                  </Text>
                </View>

                <View style={{ width: 60, alignItems: "center" }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                    {data.totalApplications}
                  </Text>
                </View>

                <View style={{ width: 60, alignItems: "center" }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.warning }}>
                    {data.firstScore.toFixed(0)}
                  </Text>
                </View>

                <View style={{ width: 60, alignItems: "center" }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: dirColor }}>
                    {data.lastScore.toFixed(0)}
                  </Text>
                </View>

                <View style={{ width: 70, alignItems: "center" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: dirColor }}>
                    {data.direction === "improvement"
                      ? `+${data.improvement.toFixed(1)}%`
                      : data.direction === "decline"
                      ? "Piora"
                      : "Estável"}
                  </Text>
                </View>

                <View style={{ width: 60, alignItems: "center" }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                    {data.avgScore.toFixed(0)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Gráfico de Barras Comparativo */}
      <View style={{ gap: 12, marginTop: 12 }}>
        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
          Evolução Visual
        </Text>

        <View style={{ gap: 12 }}>
          {comparisonData.map((data, index) => {
            const dirColor = data.direction === "improvement"
              ? colors.success
              : data.direction === "decline"
              ? colors.error
              : colors.muted;

            return (
              <View key={index} style={{ gap: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: colors.foreground }}>
                  {data.patientName}
                </Text>

                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                  {/* Barra Inicial */}
                  <View
                    style={{
                      height: 24,
                      width: Math.max(20, (data.firstScore / maxScore) * 150),
                      backgroundColor: colors.warning,
                      borderRadius: 4,
                      justifyContent: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "white", fontWeight: "600" }}>
                      {data.firstScore.toFixed(0)}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 14, color: colors.muted }}>→</Text>

                  {/* Barra Final */}
                  <View
                    style={{
                      height: 24,
                      width: Math.max(20, (data.lastScore / maxScore) * 150),
                      backgroundColor: dirColor,
                      borderRadius: 4,
                      justifyContent: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "white", fontWeight: "600" }}>
                      {data.lastScore.toFixed(0)}
                    </Text>
                  </View>

                  {/* Resultado */}
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: dirColor,
                      minWidth: 50,
                    }}
                  >
                    {data.direction === "improvement"
                      ? `+${data.improvement.toFixed(1)}%`
                      : data.direction === "decline"
                      ? "Piora"
                      : "Estável"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Resumo Estatístico */}
      <View
        style={{
          backgroundColor: colors.background,
          borderRadius: 8,
          padding: 12,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
          Resumo Geral
        </Text>

        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 11, color: colors.muted }}>Total de Pacientes</Text>
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.foreground }}>
              {comparisonData.length}
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 11, color: colors.muted }}>Total de Aplicações</Text>
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.foreground }}>
              {comparisonData.reduce((sum, d) => sum + d.totalApplications, 0)}
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 11, color: colors.muted }}>Pacientes com Melhora</Text>
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.success }}>
              {improvedPatients.length} de {comparisonData.length}
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 11, color: colors.muted }}>Melhora Média</Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: avgImprovement > 0 ? colors.success : colors.muted,
              }}
            >
              {avgImprovement > 0 ? `+${avgImprovement.toFixed(1)}%` : "0%"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
