import React, { useMemo } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse } from "@/lib/clinical-scales";

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
 */
export function MultiPatientComparison({ patientsData, scaleName }: MultiPatientComparisonProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 48;

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
      const improvement = firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0;

      return {
        patientName: patient.patientName,
        patientId: patient.patientId,
        totalApplications: sortedResponses.length,
        firstScore,
        lastScore,
        improvement,
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

  // Encontrar valores mín/máx para normalização
  const maxScore = Math.max(...comparisonData.map((d) => d.lastScore || 0), 100);
  const maxImprovement = Math.max(...comparisonData.map((d) => Math.abs(d.improvement)), 50);

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
          👥 Comparação de Pacientes
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
            <View style={{ width: 60, alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted }}>
                Melhora
              </Text>
            </View>
            <View style={{ width: 60, alignItems: "center" }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.muted }}>
                Média
              </Text>
            </View>
          </View>

          {/* Linhas da Tabela */}
          {comparisonData.map((data, index) => (
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
              {/* Nome do Paciente */}
              <View style={{ width: 120 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: colors.foreground,
                  }}
                  numberOfLines={1}
                >
                  {data.patientName}
                </Text>
              </View>

              {/* Total de Aplicações */}
              <View style={{ width: 60, alignItems: "center" }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                  {data.totalApplications}
                </Text>
              </View>

              {/* Score Inicial */}
              <View style={{ width: 60, alignItems: "center" }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.warning }}>
                  {data.firstScore.toFixed(0)}
                </Text>
              </View>

              {/* Score Final */}
              <View style={{ width: 60, alignItems: "center" }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.success }}>
                  {data.lastScore.toFixed(0)}
                </Text>
              </View>

              {/* Melhora */}
              <View style={{ width: 60, alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: data.improvement > 0 ? colors.success : colors.error,
                  }}
                >
                  {data.improvement > 0 ? "+" : ""}
                  {data.improvement.toFixed(1)}%
                </Text>
              </View>

              {/* Média */}
              <View style={{ width: 60, alignItems: "center" }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                  {data.avgScore.toFixed(0)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Gráfico de Barras Comparativo */}
      <View style={{ gap: 12, marginTop: 12 }}>
        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
          Evolução Visual
        </Text>

        <View style={{ gap: 12 }}>
          {comparisonData.map((data, index) => (
            <View key={index} style={{ gap: 6 }}>
              {/* Nome do Paciente */}
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.foreground }}>
                {data.patientName}
              </Text>

              {/* Barras de Evolução */}
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                {/* Barra Inicial */}
                <View
                  style={{
                    height: 24,
                    width: (data.firstScore / maxScore) * 150,
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

                {/* Seta */}
                <Text style={{ fontSize: 14, color: colors.muted }}>→</Text>

                {/* Barra Final */}
                <View
                  style={{
                    height: 24,
                    width: (data.lastScore / maxScore) * 150,
                    backgroundColor: data.improvement > 0 ? colors.success : colors.error,
                    borderRadius: 4,
                    justifyContent: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ fontSize: 10, color: "white", fontWeight: "600" }}>
                    {data.lastScore.toFixed(0)}
                  </Text>
                </View>

                {/* Percentual de Melhora */}
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: data.improvement > 0 ? colors.success : colors.error,
                    minWidth: 50,
                  }}
                >
                  {data.improvement > 0 ? "+" : ""}
                  {data.improvement.toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
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
            <Text style={{ fontSize: 11, color: colors.muted }}>Melhora Média</Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color:
                  comparisonData.reduce((sum, d) => sum + d.improvement, 0) / comparisonData.length > 0
                    ? colors.success
                    : colors.error,
              }}
            >
              {(comparisonData.reduce((sum, d) => sum + d.improvement, 0) / comparisonData.length).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
