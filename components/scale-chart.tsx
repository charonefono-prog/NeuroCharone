import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse, getScale, ScaleType } from "@/lib/clinical-scales";
import {
  isInverseScale,
  getScoreDirection,
  calculateAbsoluteImprovement,
  calculateImprovementPercentage,
} from "@/lib/improvement-calculator";

interface ScaleChartProps {
  data: ScaleResponse[];
  scaleType: string;
}

// Cores padrão científico
const SCIENTIFIC_COLORS = {
  baseline: "#1E40AF",     // Azul escuro para baseline/pré
  improvement: "#16A34A",  // Verde para melhora
  decline: "#DC2626",      // Vermelho para piora
  neutral: "#6B7280",      // Cinza para sem alteração
  gridLine: "#E5E7EB",     // Cinza claro para grade
  axisText: "#374151",     // Cinza escuro para texto dos eixos
  labelText: "#6B7280",    // Cinza médio para rótulos
};

/**
 * Gera os níveis do eixo Y baseado no range de scores.
 * Retorna valores arredondados para facilitar leitura.
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
 * Componente de gráfico de evolução para escalas clínicas
 * Padrão visual baseado em publicações científicas (Nature, ResearchGate)
 * 
 * Características:
 * - Eixo Y com rótulo "Score" e valores numéricos
 * - Eixo X com datas das avaliações
 * - Linhas de grade horizontais sutis
 * - Valores numéricos acima de cada barra
 * - Legenda com terminologia científica
 * - Cores padronizadas (azul=baseline, verde=melhora, vermelho=piora)
 */
export function ScaleChart({ data, scaleType }: ScaleChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 48;

  if (data.length === 0) {
    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: SCIENTIFIC_COLORS.gridLine,
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <Text style={{ fontSize: 14, color: SCIENTIFIC_COLORS.labelText }}>
          Sem dados para exibir gráfico
        </Text>
      </View>
    );
  }

  const scores = data.map((d) => d.totalScore);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  
  // Gerar eixo Y com valores "bonitos"
  const yAxisLevels = generateYAxisLevels(Math.min(0, minScore), maxScore);
  const yMin = yAxisLevels[0];
  const yMax = yAxisLevels[yAxisLevels.length - 1];
  const yRange = yMax - yMin || 1;

  const chartHeight = 180;
  const yAxisWidth = 40;
  const barAreaWidth = chartWidth - yAxisWidth - 16;
  const barWidth = Math.min(48, Math.max(24, (barAreaWidth - 16) / data.length - 8));

  // Calcular variação usando o calculador centralizado
  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const overallDirection = getScoreDirection(scaleType, firstScore, lastScore);
  const absImprovement = calculateAbsoluteImprovement(scaleType, firstScore, lastScore);
  const pctImprovement = calculateImprovementPercentage(scaleType, firstScore, lastScore);

  // Obter nome da escala
  const scaleInfo = getScale(scaleType as ScaleType);
  const scaleName = scaleInfo?.name || scaleType.toUpperCase();

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: SCIENTIFIC_COLORS.gridLine,
        padding: 16,
        gap: 12,
      }}
    >
      {/* Título no estilo científico */}
      <View style={{ gap: 2 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: SCIENTIFIC_COLORS.axisText }}>
          Evolução do Score
        </Text>
        <Text style={{ fontSize: 11, color: SCIENTIFIC_COLORS.labelText, fontStyle: "italic" }}>
          {isInverseScale(scaleType) 
            ? "Score menor = melhor resultado clínico" 
            : "Score maior = melhor resultado clínico"}
        </Text>
      </View>

      {/* Área do gráfico com eixo Y */}
      <View style={{ flexDirection: "row", height: chartHeight + 30 }}>
        {/* Eixo Y - Rótulo e valores */}
        <View style={{ width: yAxisWidth, height: chartHeight, justifyContent: "space-between" }}>
          {[...yAxisLevels].reverse().map((level, index) => (
            <Text
              key={`y-${index}`}
              style={{
                fontSize: 10,
                color: SCIENTIFIC_COLORS.labelText,
                textAlign: "right",
                paddingRight: 4,
              }}
            >
              {level}
            </Text>
          ))}
        </View>

        {/* Área das barras com grade */}
        <View style={{ flex: 1, height: chartHeight }}>
          {/* Linhas de grade horizontais */}
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
                  backgroundColor: SCIENTIFIC_COLORS.gridLine,
                }}
              />
            );
          })}

          {/* Barras */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "flex-end",
            }}
          >
            {scores.map((score, index) => {
              const barH = Math.max(2, ((score - yMin) / yRange) * chartHeight);
              
              // Cor da barra baseada na direção da mudança
              let barColor = SCIENTIFIC_COLORS.baseline;
              if (index > 0) {
                const direction = getScoreDirection(scaleType, scores[index - 1], score);
                if (direction === "improvement") barColor = SCIENTIFIC_COLORS.improvement;
                else if (direction === "decline") barColor = SCIENTIFIC_COLORS.decline;
                else barColor = SCIENTIFIC_COLORS.neutral;
              }

              return (
                <View key={index} style={{ alignItems: "center" }}>
                  {/* Valor acima da barra */}
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: SCIENTIFIC_COLORS.axisText,
                      marginBottom: 2,
                    }}
                  >
                    {score}
                  </Text>
                  <View
                    style={{
                      width: barWidth,
                      height: barH,
                      backgroundColor: barColor,
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Eixo X - Datas */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginLeft: yAxisWidth,
          borderTopWidth: 1,
          borderTopColor: SCIENTIFIC_COLORS.axisText,
          paddingTop: 4,
        }}
      >
        {data.map((d, index) => (
          <Text
            key={index}
            style={{
              fontSize: 9,
              color: SCIENTIFIC_COLORS.labelText,
              textAlign: "center",
              width: barWidth + 8,
            }}
          >
            {new Date(d.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })}
          </Text>
        ))}
      </View>

      {/* Rótulo do eixo X */}
      <Text
        style={{
          fontSize: 10,
          color: SCIENTIFIC_COLORS.labelText,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Data da avaliação
      </Text>

      {/* Legenda científica */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 16,
          paddingTop: 4,
          borderTopWidth: 1,
          borderTopColor: SCIENTIFIC_COLORS.gridLine,
        }}
      >
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, backgroundColor: SCIENTIFIC_COLORS.baseline }} />
          <Text style={{ fontSize: 10, color: SCIENTIFIC_COLORS.labelText }}>Baseline</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, backgroundColor: SCIENTIFIC_COLORS.improvement }} />
          <Text style={{ fontSize: 10, color: SCIENTIFIC_COLORS.labelText }}>Melhora</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, backgroundColor: SCIENTIFIC_COLORS.decline }} />
          <Text style={{ fontSize: 10, color: SCIENTIFIC_COLORS.labelText }}>Piora</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, backgroundColor: SCIENTIFIC_COLORS.neutral }} />
          <Text style={{ fontSize: 10, color: SCIENTIFIC_COLORS.labelText }}>Sem alteração</Text>
        </View>
      </View>

      {/* Resumo estatístico */}
      <View
        style={{
          backgroundColor: "#F9FAFB",
          borderRadius: 6,
          padding: 12,
          gap: 6,
          borderWidth: 1,
          borderColor: SCIENTIFIC_COLORS.gridLine,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "700", color: SCIENTIFIC_COLORS.axisText, marginBottom: 2 }}>
          Resumo Estatístico
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 11, color: SCIENTIFIC_COLORS.labelText }}>Baseline (1a avaliação):</Text>
          <Text style={{ fontSize: 11, fontWeight: "600", color: SCIENTIFIC_COLORS.baseline }}>
            {firstScore} pts
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 11, color: SCIENTIFIC_COLORS.labelText }}>Follow-up (última):</Text>
          <Text style={{ fontSize: 11, fontWeight: "600", color: SCIENTIFIC_COLORS.axisText }}>
            {lastScore} pts
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 6,
            borderTopWidth: 1,
            borderTopColor: SCIENTIFIC_COLORS.gridLine,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "600", color: SCIENTIFIC_COLORS.axisText }}>
            Variação:
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: overallDirection === "improvement"
                ? SCIENTIFIC_COLORS.improvement
                : overallDirection === "decline"
                ? SCIENTIFIC_COLORS.decline
                : SCIENTIFIC_COLORS.neutral,
            }}
          >
            {overallDirection === "improvement"
              ? `Melhora de ${pctImprovement.toFixed(1)}% (${absImprovement} pts)`
              : overallDirection === "decline"
              ? `Piora de ${Math.abs(lastScore - firstScore)} pts`
              : "Sem alteração significativa"}
          </Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Gráfico de tendência com linha e marcadores circulares
 * Estilo baseado em publicações científicas (PHQ-9 trend charts)
 * 
 * Características:
 * - Linha conectando pontos com marcadores circulares
 * - Eixo Y com escala numérica
 * - Eixo X com datas
 * - Fundo limpo com grade sutil
 */
export function ScaleLineChart({ data }: { data: ScaleResponse[] }) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 48;

  if (data.length < 2) {
    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: SCIENTIFIC_COLORS.gridLine,
          padding: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 12, color: SCIENTIFIC_COLORS.labelText }}>
          Necessário pelo menos 2 avaliações para visualizar tendência
        </Text>
      </View>
    );
  }

  const scores = data.map((d) => d.totalScore);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  
  const yAxisLevels = generateYAxisLevels(Math.min(0, minScore), maxScore, 4);
  const yMin = yAxisLevels[0];
  const yMax = yAxisLevels[yAxisLevels.length - 1];
  const yRange = yMax - yMin || 1;

  const chartHeight = 140;
  const yAxisWidth = 36;
  const plotWidth = chartWidth - yAxisWidth - 24;
  const pointSpacing = plotWidth / (scores.length - 1);

  // Calcular posições dos pontos
  const points = scores.map((score, index) => ({
    x: index * pointSpacing,
    y: chartHeight - ((score - yMin) / yRange) * chartHeight,
    score,
  }));

  // Obter nome da escala
  const scaleType = data[0]?.scaleType || "";
  const scaleInfo = getScale(scaleType as ScaleType);

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: SCIENTIFIC_COLORS.gridLine,
        padding: 16,
        gap: 8,
      }}
    >
      <View style={{ gap: 2 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: SCIENTIFIC_COLORS.axisText }}>
          Tendência Temporal
        </Text>
        <Text style={{ fontSize: 10, color: SCIENTIFIC_COLORS.labelText, fontStyle: "italic" }}>
          n = {data.length} avaliações
        </Text>
      </View>

      {/* Área do gráfico */}
      <View style={{ flexDirection: "row", height: chartHeight + 8 }}>
        {/* Eixo Y */}
        <View style={{ width: yAxisWidth, height: chartHeight, justifyContent: "space-between" }}>
          {[...yAxisLevels].reverse().map((level, index) => (
            <Text
              key={`y-${index}`}
              style={{
                fontSize: 9,
                color: SCIENTIFIC_COLORS.labelText,
                textAlign: "right",
                paddingRight: 4,
              }}
            >
              {level}
            </Text>
          ))}
        </View>

        {/* Área do plot */}
        <View style={{ flex: 1, height: chartHeight, paddingHorizontal: 8 }}>
          {/* Linhas de grade */}
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
                  backgroundColor: SCIENTIFIC_COLORS.gridLine,
                }}
              />
            );
          })}

          {/* Linhas conectando pontos */}
          {points.map((point, index) => {
            if (index === 0) return null;
            const prev = points[index - 1];
            const dx = point.x - prev.x;
            const dy = point.y - prev.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            const direction = getScoreDirection(scaleType, scores[index - 1], scores[index]);
            const lineColor = direction === "improvement" 
              ? SCIENTIFIC_COLORS.improvement 
              : direction === "decline" 
              ? SCIENTIFIC_COLORS.decline 
              : SCIENTIFIC_COLORS.neutral;

            return (
              <View
                key={`line-${index}`}
                style={{
                  position: "absolute",
                  left: prev.x + 8,
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

          {/* Marcadores circulares nos pontos */}
          {points.map((point, index) => (
            <View key={`point-${index}`}>
              {/* Círculo externo (borda) */}
              <View
                style={{
                  position: "absolute",
                  left: point.x + 8 - 7,
                  top: point.y - 7,
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 2,
                  borderColor: index === 0 
                    ? SCIENTIFIC_COLORS.baseline 
                    : getScoreDirection(scaleType, scores[index - 1], scores[index]) === "improvement"
                    ? SCIENTIFIC_COLORS.improvement
                    : getScoreDirection(scaleType, scores[index - 1], scores[index]) === "decline"
                    ? SCIENTIFIC_COLORS.decline
                    : SCIENTIFIC_COLORS.neutral,
                  zIndex: 10,
                }}
              />
              {/* Valor do score acima do ponto */}
              <Text
                style={{
                  position: "absolute",
                  left: point.x + 8 - 16,
                  top: point.y - 22,
                  width: 32,
                  fontSize: 9,
                  fontWeight: "700",
                  color: SCIENTIFIC_COLORS.axisText,
                  textAlign: "center",
                }}
              >
                {point.score}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Eixo X - Datas */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: yAxisWidth + 8,
          marginRight: 8,
          borderTopWidth: 1,
          borderTopColor: SCIENTIFIC_COLORS.axisText,
          paddingTop: 4,
        }}
      >
        {data.map((d, index) => (
          <Text
            key={index}
            style={{
              fontSize: 8,
              color: SCIENTIFIC_COLORS.labelText,
              textAlign: "center",
            }}
          >
            {new Date(d.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })}
          </Text>
        ))}
      </View>
    </View>
  );
}

/**
 * Componente de comparação de duas avaliações (Pré vs Pós)
 * Estilo baseado em publicações científicas
 */
export function ScaleComparison({
  before,
  after,
}: {
  before: ScaleResponse;
  after: ScaleResponse;
}) {
  const colors = useColors();
  
  const scaleType = before.scaleType;
  const direction = getScoreDirection(scaleType, before.totalScore, after.totalScore);
  const absImprovement = calculateAbsoluteImprovement(scaleType, before.totalScore, after.totalScore);
  const pctImprovement = calculateImprovementPercentage(scaleType, before.totalScore, after.totalScore);
  const improved = direction === "improvement";

  const maxVal = Math.max(before.totalScore, after.totalScore, 1);
  const barMaxHeight = 120;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: SCIENTIFIC_COLORS.gridLine,
        padding: 16,
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: "700", color: SCIENTIFIC_COLORS.axisText }}>
        Comparação Pré vs Pós-tratamento
      </Text>

      {/* Barras lado a lado */}
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 32,
            height: barMaxHeight + 30,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: SCIENTIFIC_COLORS.axisText,
          }}
        >
          {/* Barra Pré */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: SCIENTIFIC_COLORS.axisText, marginBottom: 4 }}>
              {before.totalScore}
            </Text>
            <View
              style={{
                width: 52,
                height: Math.max(4, (before.totalScore / maxVal) * barMaxHeight),
                backgroundColor: SCIENTIFIC_COLORS.baseline,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
          </View>

          {/* Barra Pós */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: SCIENTIFIC_COLORS.axisText, marginBottom: 4 }}>
              {after.totalScore}
            </Text>
            <View
              style={{
                width: 52,
                height: Math.max(4, (after.totalScore / maxVal) * barMaxHeight),
                backgroundColor: improved 
                  ? SCIENTIFIC_COLORS.improvement 
                  : direction === "decline" 
                  ? SCIENTIFIC_COLORS.decline 
                  : SCIENTIFIC_COLORS.neutral,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
          </View>
        </View>

        {/* Rótulos do eixo X */}
        <View style={{ flexDirection: "row", gap: 32, marginTop: 6 }}>
          <View style={{ width: 52, alignItems: "center" }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: SCIENTIFIC_COLORS.axisText }}>Pré</Text>
            <Text style={{ fontSize: 9, color: SCIENTIFIC_COLORS.labelText }}>
              {new Date(before.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
            </Text>
          </View>
          <View style={{ width: 52, alignItems: "center" }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: SCIENTIFIC_COLORS.axisText }}>Pós</Text>
            <Text style={{ fontSize: 9, color: SCIENTIFIC_COLORS.labelText }}>
              {new Date(after.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
            </Text>
          </View>
        </View>
      </View>

      {/* Legenda */}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 16 }}>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, backgroundColor: SCIENTIFIC_COLORS.baseline }} />
          <Text style={{ fontSize: 10, color: SCIENTIFIC_COLORS.labelText }}>Pré-tratamento</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <View style={{ width: 10, height: 10, backgroundColor: improved ? SCIENTIFIC_COLORS.improvement : direction === "decline" ? SCIENTIFIC_COLORS.decline : SCIENTIFIC_COLORS.neutral }} />
          <Text style={{ fontSize: 10, color: SCIENTIFIC_COLORS.labelText }}>Pós-tratamento</Text>
        </View>
      </View>

      {/* Resultado */}
      <View
        style={{
          backgroundColor: improved ? "#F0FDF4" : direction === "decline" ? "#FEF2F2" : "#F9FAFB",
          borderRadius: 6,
          padding: 12,
          alignItems: "center",
          gap: 4,
          borderWidth: 1,
          borderColor: improved ? "#BBF7D0" : direction === "decline" ? "#FECACA" : SCIENTIFIC_COLORS.gridLine,
        }}
      >
        {improved && (
          <>
            <Text style={{ fontSize: 12, color: SCIENTIFIC_COLORS.improvement, fontWeight: "600" }}>
              Redução clinicamente observada
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "700", color: SCIENTIFIC_COLORS.improvement }}>
              {pctImprovement.toFixed(1)}% de melhora
            </Text>
            <Text style={{ fontSize: 11, color: SCIENTIFIC_COLORS.labelText }}>
              Variação absoluta: {absImprovement} pontos
            </Text>
          </>
        )}
        {direction === "decline" && (
          <>
            <Text style={{ fontSize: 12, color: SCIENTIFIC_COLORS.decline, fontWeight: "600" }}>
              Aumento do score observado
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "700", color: SCIENTIFIC_COLORS.decline }}>
              Piora de {Math.abs(after.totalScore - before.totalScore)} pts
            </Text>
          </>
        )}
        {direction === "stable" && (
          <>
            <Text style={{ fontSize: 12, color: SCIENTIFIC_COLORS.neutral, fontWeight: "600" }}>
              Sem alteração significativa
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: SCIENTIFIC_COLORS.neutral }}>
              Score mantido
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
