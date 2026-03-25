import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse, getScale, ScaleType } from "@/lib/clinical-scales";
import {
  calculateImprovementPercentage,
  calculateAbsoluteImprovement,
  getScoreDirection,
  isInverseScale,
} from "@/lib/improvement-calculator";

// Cores padrão científico (consistentes com scale-chart.tsx)
const SCI = {
  baseline: "#1E40AF",
  improvement: "#16A34A",
  decline: "#DC2626",
  neutral: "#6B7280",
  grid: "#E5E7EB",
  axis: "#374151",
  label: "#6B7280",
  bgWhite: "#FFFFFF",
  bgLight: "#F9FAFB",
};

export interface ComparativeChartsProps {
  scaleResponses: ScaleResponse[];
  scaleName?: string;
}

/**
 * Gera os níveis do eixo Y baseado no range de scores.
 */
function generateYAxisLevels(minVal: number, maxVal: number, steps: number = 5): number[] {
  const range = maxVal - minVal;
  if (range === 0) return [minVal];
  const rawStep = range / steps;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalizedStep = rawStep / magnitude;
  let niceStep: number;
  if (normalizedStep <= 1.5) niceStep = 1;
  else if (normalizedStep <= 3) niceStep = 2;
  else if (normalizedStep <= 7) niceStep = 5;
  else niceStep = 10;
  niceStep *= magnitude;
  const niceMin = Math.floor(minVal / niceStep) * niceStep;
  const niceMax = Math.ceil(maxVal / niceStep) * niceStep;
  const levels: number[] = [];
  for (let v = niceMin; v <= niceMax; v += niceStep) {
    levels.push(Math.round(v * 100) / 100);
  }
  return levels;
}

/**
 * Componente de gráficos comparativos com padrão de publicação científica.
 * 
 * Inclui:
 * 1. Gráfico de linha temporal com marcadores circulares e linhas de grade
 * 2. Gráfico de barras Pré vs Pós com eixos rotulados
 * 3. Tabela de dados numéricos
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
        <Text style={{ fontSize: 14, color: SCI.label }}>
          Nenhuma resposta de escala disponível
        </Text>
      </View>
    );
  }

  const scaleType = sortedResponses[0]?.scaleType || "";
  const scaleInfo = getScale(scaleType as ScaleType);
  const scores = sortedResponses.map((r) => r.totalScore || 0);
  const maxScoreInData = Math.max(...scores, 1);
  const minScoreInData = Math.min(...scores, 0);

  // Eixo Y
  const yAxisLevels = generateYAxisLevels(Math.min(0, minScoreInData), maxScoreInData, 4);
  const yMin = yAxisLevels[0];
  const yMax = yAxisLevels[yAxisLevels.length - 1];
  const yRange = yMax - yMin || 1;

  // Dados para barras pré/pós
  const beforeAfterData = useMemo(() => {
    if (sortedResponses.length < 2) return null;
    const firstResponse = sortedResponses[0];
    const lastResponse = sortedResponses[sortedResponses.length - 1];
    const firstScore = firstResponse.totalScore || 0;
    const lastScore = lastResponse.totalScore || 0;
    return {
      before: firstScore,
      after: lastScore,
      beforeDate: firstResponse.date,
      afterDate: lastResponse.date,
      improvement: calculateImprovementPercentage(scaleType, firstScore, lastScore),
      absoluteImprovement: calculateAbsoluteImprovement(scaleType, firstScore, lastScore),
      direction: getScoreDirection(scaleType, firstScore, lastScore),
    };
  }, [sortedResponses, scaleType]);

  const chartHeight = 160;
  const yAxisWidth = 36;
  const plotWidth = chartWidth - yAxisWidth - 24;

  return (
    <View style={{ gap: 20 }}>
      {/* ===== GRÁFICO DE LINHA TEMPORAL ===== */}
      <View
        style={{
          backgroundColor: SCI.bgWhite,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: SCI.grid,
          padding: 16,
          gap: 10,
        }}
      >
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: SCI.axis }}>
            Evolução Temporal do Score
          </Text>
          <Text style={{ fontSize: 10, color: SCI.label, fontStyle: "italic" }}>
            {isInverseScale(scaleType)
              ? "Score menor = melhor resultado clínico"
              : "Score maior = melhor resultado clínico"}
            {" · n = "}{sortedResponses.length}{" avaliações"}
          </Text>
        </View>

        {sortedResponses.length >= 2 ? (
          <>
            {/* Área do gráfico de linha */}
            <View style={{ flexDirection: "row", height: chartHeight + 8 }}>
              {/* Eixo Y */}
              <View style={{ width: yAxisWidth, height: chartHeight, justifyContent: "space-between" }}>
                {[...yAxisLevels].reverse().map((level, index) => (
                  <Text
                    key={`y-${index}`}
                    style={{ fontSize: 9, color: SCI.label, textAlign: "right", paddingRight: 4 }}
                  >
                    {level}
                  </Text>
                ))}
              </View>

              {/* Plot area */}
              <View style={{ flex: 1, height: chartHeight, paddingHorizontal: 8 }}>
                {/* Grade horizontal */}
                {yAxisLevels.map((level, index) => {
                  const yPos = chartHeight - ((level - yMin) / yRange) * chartHeight;
                  return (
                    <View
                      key={`grid-${index}`}
                      style={{
                        position: "absolute",
                        top: yPos,
                        left: 0,
                        right: 0,
                        height: 1,
                        backgroundColor: SCI.grid,
                      }}
                    />
                  );
                })}

                {/* Linhas e pontos */}
                {(() => {
                  const pointSpacing = scores.length > 1 ? plotWidth / (scores.length - 1) : plotWidth / 2;
                  const points = scores.map((score, index) => ({
                    x: scores.length > 1 ? index * pointSpacing : plotWidth / 2,
                    y: chartHeight - ((score - yMin) / yRange) * chartHeight,
                    score,
                  }));

                  return (
                    <>
                      {/* Linhas conectoras */}
                      {points.map((point, index) => {
                        if (index === 0) return null;
                        const prev = points[index - 1];
                        const dx = point.x - prev.x;
                        const dy = point.y - prev.y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                        const dir = getScoreDirection(scaleType, scores[index - 1], scores[index]);
                        const lineColor = dir === "improvement" ? SCI.improvement : dir === "decline" ? SCI.decline : SCI.neutral;

                        return (
                          <View
                            key={`line-${index}`}
                            style={{
                              position: "absolute",
                              left: prev.x,
                              top: prev.y,
                              width: length,
                              height: 2,
                              backgroundColor: lineColor,
                              transform: [{ rotate: `${angle}deg` }],
                              transformOrigin: "left center",
                            }}
                          />
                        );
                      })}

                      {/* Marcadores circulares */}
                      {points.map((point, index) => {
                        const dir = index > 0 ? getScoreDirection(scaleType, scores[index - 1], scores[index]) : "stable";
                        const pointColor = index === 0 ? SCI.baseline : dir === "improvement" ? SCI.improvement : dir === "decline" ? SCI.decline : SCI.neutral;
                        return (
                          <View key={`point-${index}`}>
                            <View
                              style={{
                                position: "absolute",
                                left: point.x - 6,
                                top: point.y - 6,
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: SCI.bgWhite,
                                borderWidth: 2,
                                borderColor: pointColor,
                                zIndex: 10,
                              }}
                            />
                            <Text
                              style={{
                                position: "absolute",
                                left: point.x - 14,
                                top: point.y - 20,
                                width: 28,
                                fontSize: 9,
                                fontWeight: "700",
                                color: SCI.axis,
                                textAlign: "center",
                              }}
                            >
                              {point.score}
                            </Text>
                          </View>
                        );
                      })}
                    </>
                  );
                })()}
              </View>
            </View>

            {/* Eixo X */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: yAxisWidth + 8,
                marginRight: 8,
                borderTopWidth: 1,
                borderTopColor: SCI.axis,
                paddingTop: 4,
              }}
            >
              {sortedResponses.map((r, index) => (
                <Text key={index} style={{ fontSize: 8, color: SCI.label, textAlign: "center" }}>
                  {new Date(r.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                </Text>
              ))}
            </View>
          </>
        ) : (
          <View style={{ height: 80, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: SCI.label }}>
              Necessário pelo menos 2 avaliações para gráfico de tendência
            </Text>
          </View>
        )}

        {/* Tabela de dados */}
        <View style={{ gap: 0, borderWidth: 1, borderColor: SCI.grid, borderRadius: 6, overflow: "hidden", marginTop: 4 }}>
          {/* Cabeçalho */}
          <View style={{ flexDirection: "row", backgroundColor: SCI.bgLight, borderBottomWidth: 1, borderBottomColor: SCI.grid }}>
            <Text style={{ flex: 1, fontSize: 10, fontWeight: "700", color: SCI.axis, padding: 6 }}>Avaliação</Text>
            <Text style={{ width: 60, fontSize: 10, fontWeight: "700", color: SCI.axis, padding: 6, textAlign: "center" }}>Data</Text>
            <Text style={{ width: 50, fontSize: 10, fontWeight: "700", color: SCI.axis, padding: 6, textAlign: "center" }}>Score</Text>
            <Text style={{ width: 70, fontSize: 10, fontWeight: "700", color: SCI.axis, padding: 6, textAlign: "right" }}>Variação</Text>
          </View>
          {/* Linhas de dados */}
          {sortedResponses.map((r, index) => {
            const score = r.totalScore || 0;
            let changeText = "—";
            let changeColor = SCI.neutral;
            if (index > 0) {
              const prevScore = sortedResponses[index - 1].totalScore || 0;
              const dir = getScoreDirection(scaleType, prevScore, score);
              const diff = Math.abs(score - prevScore);
              if (dir === "improvement") {
                changeText = `↓ ${diff}`;
                if (isInverseScale(scaleType)) changeText = `↓ ${diff}`;
                else changeText = `↑ ${diff}`;
                changeColor = SCI.improvement;
              } else if (dir === "decline") {
                if (isInverseScale(scaleType)) changeText = `↑ ${diff}`;
                else changeText = `↓ ${diff}`;
                changeColor = SCI.decline;
              } else {
                changeText = "=";
              }
            }

            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderBottomWidth: index < sortedResponses.length - 1 ? 1 : 0,
                  borderBottomColor: SCI.grid,
                  backgroundColor: index % 2 === 0 ? SCI.bgWhite : SCI.bgLight,
                }}
              >
                <Text style={{ flex: 1, fontSize: 10, color: SCI.axis, padding: 6 }}>
                  {index === 0 ? "Baseline" : `Follow-up ${index}`}
                </Text>
                <Text style={{ width: 60, fontSize: 10, color: SCI.label, padding: 6, textAlign: "center" }}>
                  {new Date(r.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                </Text>
                <Text style={{ width: 50, fontSize: 10, fontWeight: "600", color: SCI.axis, padding: 6, textAlign: "center" }}>
                  {score}
                </Text>
                <Text style={{ width: 70, fontSize: 10, fontWeight: "600", color: changeColor, padding: 6, textAlign: "right" }}>
                  {changeText}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ===== GRÁFICO DE BARRAS PRÉ vs PÓS ===== */}
      {beforeAfterData && (
        <View
          style={{
            backgroundColor: SCI.bgWhite,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: SCI.grid,
            padding: 16,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "700", color: SCI.axis }}>
            Comparação Pré vs Pós-tratamento
          </Text>

          {/* Barras lado a lado */}
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: 40,
                height: 140,
                paddingBottom: 24,
                borderBottomWidth: 1,
                borderBottomColor: SCI.axis,
              }}
            >
              {/* Barra Pré */}
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: SCI.axis, marginBottom: 4 }}>
                  {beforeAfterData.before}
                </Text>
                <View
                  style={{
                    width: 56,
                    height: Math.max(4, (beforeAfterData.before / maxScoreInData) * 110),
                    backgroundColor: SCI.baseline,
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                  }}
                />
              </View>

              {/* Barra Pós */}
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: SCI.axis, marginBottom: 4 }}>
                  {beforeAfterData.after}
                </Text>
                <View
                  style={{
                    width: 56,
                    height: Math.max(4, (beforeAfterData.after / maxScoreInData) * 110),
                    backgroundColor: beforeAfterData.direction === "improvement" ? SCI.improvement : beforeAfterData.direction === "decline" ? SCI.decline : SCI.neutral,
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                  }}
                />
              </View>
            </View>

            {/* Rótulos */}
            <View style={{ flexDirection: "row", gap: 40, marginTop: 6 }}>
              <View style={{ width: 56, alignItems: "center" }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: SCI.axis }}>Pré</Text>
                <Text style={{ fontSize: 9, color: SCI.label }}>
                  {new Date(beforeAfterData.beforeDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                </Text>
              </View>
              <View style={{ width: 56, alignItems: "center" }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: SCI.axis }}>Pós</Text>
                <Text style={{ fontSize: 9, color: SCI.label }}>
                  {new Date(beforeAfterData.afterDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                </Text>
              </View>
            </View>
          </View>

          {/* Legenda */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 16 }}>
            <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
              <View style={{ width: 10, height: 10, backgroundColor: SCI.baseline }} />
              <Text style={{ fontSize: 10, color: SCI.label }}>Pré-tratamento</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
              <View style={{ width: 10, height: 10, backgroundColor: beforeAfterData.direction === "improvement" ? SCI.improvement : beforeAfterData.direction === "decline" ? SCI.decline : SCI.neutral }} />
              <Text style={{ fontSize: 10, color: SCI.label }}>Pós-tratamento</Text>
            </View>
          </View>

          {/* Resultado */}
          <View
            style={{
              backgroundColor: beforeAfterData.direction === "improvement" ? "#F0FDF4" : beforeAfterData.direction === "decline" ? "#FEF2F2" : SCI.bgLight,
              borderRadius: 6,
              padding: 12,
              gap: 4,
              borderWidth: 1,
              borderColor: beforeAfterData.direction === "improvement" ? "#BBF7D0" : beforeAfterData.direction === "decline" ? "#FECACA" : SCI.grid,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: SCI.axis }}>
                {beforeAfterData.direction === "improvement" ? "Melhora observada" : beforeAfterData.direction === "decline" ? "Piora observada" : "Sem alteração significativa"}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: beforeAfterData.direction === "improvement" ? SCI.improvement : beforeAfterData.direction === "decline" ? SCI.decline : SCI.neutral,
                }}
              >
                {beforeAfterData.direction === "improvement"
                  ? `${beforeAfterData.improvement.toFixed(1)}%`
                  : beforeAfterData.direction === "decline"
                  ? `+${Math.abs(beforeAfterData.after - beforeAfterData.before)} pts`
                  : "0%"}
              </Text>
            </View>
            {beforeAfterData.direction === "improvement" && (
              <Text style={{ fontSize: 10, color: SCI.label }}>
                Variação absoluta: {beforeAfterData.absoluteImprovement} pontos
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
