import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse } from "@/lib/clinical-scales";

export interface ComparativeChartsProps {
  scaleResponses: ScaleResponse[];
  scaleName?: string;
}

/**
 * Componente de gráficos comparativos
 * Exibe gráfico de linha (evolução) e barras (antes/depois)
 */
export function ComparativeCharts({ scaleResponses, scaleName }: ComparativeChartsProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 48; // padding

  // Filtrar respostas pela escala se especificada
  const filteredResponses = useMemo(() => {
    if (!scaleName) return scaleResponses;
    return scaleResponses.filter((r) => r.scaleName === scaleName);
  }, [scaleResponses, scaleName]);

  // Ordenar por data
  const sortedResponses = useMemo(() => {
    return [...filteredResponses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredResponses]);

  if (sortedResponses.length === 0) {
    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 14, color: colors.muted }}>
          Nenhuma resposta de escala disponível
        </Text>
      </View>
    );
  }

  // Calcular scores normalizados (0-100)
  const maxScore = 100;
  const chartData = sortedResponses.map((response) => ({
    date: new Date(response.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    score: response.totalScore || 0,
    normalizedScore: ((response.totalScore || 0) / maxScore) * 100,
  }));

  // Dados para gráfico de barras (antes/depois)
  const beforeAfterData = useMemo(() => {
    if (sortedResponses.length < 2) return null;

    const firstResponse = sortedResponses[0];
    const lastResponse = sortedResponses[sortedResponses.length - 1];

    return {
      before: firstResponse.totalScore || 0,
      after: lastResponse.totalScore || 0,
      improvement: ((lastResponse.totalScore || 0) - (firstResponse.totalScore || 0)) / (firstResponse.totalScore || 1) * 100,
    };
  }, [sortedResponses]);

  // Altura máxima do gráfico
  const maxChartHeight = 200;

  return (
    <View style={{ gap: 24 }}>
      {/* Gráfico de Linha - Evolução */}
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
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
          📈 Evolução ao Longo do Tempo
        </Text>

        {/* Gráfico de Linha ASCII */}
        <View style={{ height: maxChartHeight, justifyContent: "flex-end", gap: 8 }}>
          {/* Linhas de grade */}
          {[0, 25, 50, 75, 100].map((value) => (
            <View
              key={`grid-${value}`}
              style={{
                height: 1,
                backgroundColor: colors.border,
                opacity: 0.3,
              }}
            />
          ))}

          {/* Pontos do gráfico */}
          <View
            style={{
              position: "absolute",
              width: chartWidth - 32,
              height: maxChartHeight,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "flex-end",
              paddingHorizontal: 16,
            }}
          >
            {chartData.map((data, index) => (
              <View
                key={index}
                style={{
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {/* Barra */}
                <View
                  style={{
                    width: 8,
                    height: (data.normalizedScore / 100) * maxChartHeight,
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                  }}
                />
                {/* Label */}
                <Text style={{ fontSize: 10, color: colors.muted }}>
                  {data.date}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Legenda */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>0%</Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>50%</Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>100%</Text>
        </View>

        {/* Dados numéricos */}
        <View style={{ gap: 8, marginTop: 12 }}>
          {chartData.map((data, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 4,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.foreground }}>
                {data.date}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                {data.score} pontos ({data.normalizedScore.toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Gráfico de Barras - Antes/Depois */}
      {beforeAfterData && (
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
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
            📊 Comparação Antes/Depois
          </Text>

          {/* Gráfico de Barras */}
          <View
            style={{
              height: 180,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "flex-end",
              gap: 24,
              paddingVertical: 16,
            }}
          >
            {/* Barra Antes */}
            <View style={{ alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 40,
                  height: (beforeAfterData.before / maxScore) * 150,
                  backgroundColor: colors.warning,
                  borderRadius: 8,
                }}
              />
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                {beforeAfterData.before}
              </Text>
              <Text style={{ fontSize: 11, color: colors.muted }}>Antes</Text>
            </View>

            {/* Barra Depois */}
            <View style={{ alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 40,
                  height: (beforeAfterData.after / maxScore) * 150,
                  backgroundColor: colors.success,
                  borderRadius: 8,
                }}
              />
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                {beforeAfterData.after}
              </Text>
              <Text style={{ fontSize: 11, color: colors.muted }}>Depois</Text>
            </View>
          </View>

          {/* Estatísticas */}
          <View style={{ gap: 8, marginTop: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.muted }}>Score Inicial</Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.warning }}>
                {beforeAfterData.before} pontos
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.muted }}>Score Final</Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.success }}>
                {beforeAfterData.after} pontos
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                backgroundColor: beforeAfterData.improvement > 0 ? colors.success + "10" : colors.error + "10",
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                Melhora
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: beforeAfterData.improvement > 0 ? colors.success : colors.error,
                }}
              >
                {beforeAfterData.improvement > 0 ? "+" : ""}
                {beforeAfterData.improvement.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
