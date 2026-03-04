import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse } from "@/lib/clinical-scales";
import {
  calculateImprovementPercentage,
  calculateAbsoluteImprovement,
  getScoreDirection,
  isInverseScale,
} from "@/lib/improvement-calculator";

export interface ComparativeChartsProps {
  scaleResponses: ScaleResponse[];
  scaleName?: string;
}

/**
 * Componente de gráficos comparativos
 * Exibe gráfico de linha (evolução) e barras (antes/depois)
 * 
 * Usa o calculador centralizado para determinar melhora/piora
 * respeitando a direção de cada escala (direta vs inversa).
 */
export function ComparativeCharts({ scaleResponses, scaleName }: ComparativeChartsProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 48;

  const filteredResponses = useMemo(() => {
    if (!scaleName) return scaleResponses;
    return scaleResponses.filter((r) => r.scaleName === scaleName);
  }, [scaleResponses, scaleName]);

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

  // Determinar o tipo de escala a partir das respostas
  const scaleType = sortedResponses[0]?.scaleType || "";
  const inverse = isInverseScale(scaleType);

  // Calcular scores - usar o score real, não normalizar para 100
  const scores = sortedResponses.map((r) => r.totalScore || 0);
  const maxScoreInData = Math.max(...scores, 1);

  const chartData = sortedResponses.map((response) => ({
    date: new Date(response.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    score: response.totalScore || 0,
    normalizedHeight: ((response.totalScore || 0) / maxScoreInData) * 100,
  }));

  // Dados para gráfico de barras (antes/depois) usando calculador centralizado
  const beforeAfterData = useMemo(() => {
    if (sortedResponses.length < 2) return null;

    const firstResponse = sortedResponses[0];
    const lastResponse = sortedResponses[sortedResponses.length - 1];
    const firstScore = firstResponse.totalScore || 0;
    const lastScore = lastResponse.totalScore || 0;

    const pctImprovement = calculateImprovementPercentage(scaleType, firstScore, lastScore);
    const absImprovement = calculateAbsoluteImprovement(scaleType, firstScore, lastScore);
    const direction = getScoreDirection(scaleType, firstScore, lastScore);

    return {
      before: firstScore,
      after: lastScore,
      improvement: pctImprovement,
      absoluteImprovement: absImprovement,
      direction,
    };
  }, [sortedResponses, scaleType]);

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
          Evolução ao Longo do Tempo
        </Text>

        <View style={{ height: maxChartHeight, justifyContent: "flex-end", gap: 8 }}>
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
            {chartData.map((data, index) => {
              // Determinar cor da barra usando calculador centralizado
              let barColor = colors.primary;
              if (index > 0) {
                const dir = getScoreDirection(scaleType, chartData[index - 1].score, data.score);
                if (dir === "improvement") barColor = colors.success;
                else if (dir === "decline") barColor = colors.error;
              }

              return (
                <View key={index} style={{ alignItems: "center", gap: 8 }}>
                  <View
                    style={{
                      width: 8,
                      height: (data.normalizedHeight / 100) * maxChartHeight,
                      backgroundColor: barColor,
                      borderRadius: 4,
                    }}
                  />
                  <Text style={{ fontSize: 10, color: colors.muted }}>
                    {data.date}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Dados numéricos */}
        <View style={{ gap: 8, marginTop: 12 }}>
          {chartData.map((data, index) => {
            let changeLabel = "";
            let changeColor = colors.muted;
            if (index > 0) {
              const dir = getScoreDirection(scaleType, chartData[index - 1].score, data.score);
              const diff = Math.abs(data.score - chartData[index - 1].score);
              if (dir === "improvement") {
                changeLabel = ` (↑ melhora)`;
                changeColor = colors.success;
              } else if (dir === "decline") {
                changeLabel = ` (↓ piora)`;
                changeColor = colors.error;
              }
            }

            return (
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
                <Text style={{ fontSize: 12, fontWeight: "600", color: changeColor }}>
                  {data.score} pontos{changeLabel}
                </Text>
              </View>
            );
          })}
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
            Comparação Antes/Depois
          </Text>

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
                  height: Math.max(4, (beforeAfterData.before / maxScoreInData) * 150),
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
                  height: Math.max(4, (beforeAfterData.after / maxScoreInData) * 150),
                  backgroundColor: beforeAfterData.direction === "improvement" ? colors.success : beforeAfterData.direction === "decline" ? colors.error : colors.primary,
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
              <Text style={{ fontSize: 12, fontWeight: "600", color: beforeAfterData.direction === "improvement" ? colors.success : beforeAfterData.direction === "decline" ? colors.error : colors.muted }}>
                {beforeAfterData.after} pontos
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                backgroundColor: beforeAfterData.direction === "improvement"
                  ? colors.success + "10"
                  : beforeAfterData.direction === "decline"
                  ? colors.error + "10"
                  : colors.muted + "10",
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                {beforeAfterData.direction === "improvement" ? "Melhora" : beforeAfterData.direction === "decline" ? "Piora" : "Sem Alteração"}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: beforeAfterData.direction === "improvement"
                    ? colors.success
                    : beforeAfterData.direction === "decline"
                    ? colors.error
                    : colors.muted,
                }}
              >
                {beforeAfterData.direction === "improvement"
                  ? `+${beforeAfterData.improvement.toFixed(1)}%`
                  : beforeAfterData.direction === "decline"
                  ? "Piora detectada"
                  : "0%"}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
