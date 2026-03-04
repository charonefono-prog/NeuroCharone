import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse } from "@/lib/clinical-scales";
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

/**
 * Componente de gráfico de evolução para escalas clínicas
 * Mostra visualmente a progressão dos scores ao longo do tempo
 * 
 * LÓGICA DE CORES:
 * - Verde (success): score mudou na direção de MELHORA
 * - Vermelho (error): score mudou na direção de PIORA
 * - Azul (primary): primeiro ponto ou sem mudança
 */
export function ScaleChart({ data, scaleType }: ScaleChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 48;

  if (data.length === 0) {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <Text style={{ fontSize: 14, color: colors.muted }}>
          Sem dados para exibir gráfico
        </Text>
      </View>
    );
  }

  const scores = data.map((d) => d.totalScore);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const range = maxScore - minScore || 1;

  const barHeight = 150;
  const barWidth = Math.max(30, (chartWidth - 40) / data.length);
  const spacing = 8;

  // Calcular variação usando o calculador centralizado
  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const overallDirection = getScoreDirection(scaleType, firstScore, lastScore);
  const absImprovement = calculateAbsoluteImprovement(scaleType, firstScore, lastScore);
  const pctImprovement = calculateImprovementPercentage(scaleType, firstScore, lastScore);

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
      <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
        Evolução da Escala
      </Text>

      {/* Gráfico de barras */}
      <View
        style={{
          height: barHeight + 40,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-around",
          paddingHorizontal: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        {scores.map((score, index) => {
          const normalizedHeight = ((score - minScore) / range) * barHeight || barHeight / 2;
          
          // Usar calculador centralizado para determinar cor
          let barColor = colors.primary; // Primeiro ponto ou estável
          if (index > 0) {
            const direction = getScoreDirection(scaleType, scores[index - 1], score);
            if (direction === "improvement") barColor = colors.success;
            else if (direction === "decline") barColor = colors.error;
          }

          return (
            <View key={index} style={{ alignItems: "center", gap: 4 }}>
              <View
                style={{
                  width: Math.min(barWidth - spacing, 40),
                  height: normalizedHeight,
                  backgroundColor: barColor,
                  borderRadius: 4,
                  opacity: 0.8,
                }}
              />
              <Text style={{ fontSize: 10, color: colors.muted, fontWeight: "600" }}>
                {score}
              </Text>
              <Text style={{ fontSize: 8, color: colors.muted }}>
                {new Date(data[index].date).toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Legenda */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: colors.success }} />
          <Text style={{ fontSize: 12, color: colors.muted }}>Melhora</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: colors.error }} />
          <Text style={{ fontSize: 12, color: colors.muted }}>Piora</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: colors.primary }} />
          <Text style={{ fontSize: 12, color: colors.muted }}>Estável</Text>
        </View>
      </View>

      {/* Resumo */}
      <View
        style={{
          backgroundColor: colors.background,
          borderRadius: 8,
          padding: 12,
          gap: 8,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>Primeiro score:</Text>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
            {firstScore}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>Último score:</Text>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
            {lastScore}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>Variação:</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: overallDirection === "improvement"
                ? colors.success
                : overallDirection === "decline"
                ? colors.error
                : colors.muted,
            }}
          >
            {overallDirection === "improvement"
              ? `Melhora de ${pctImprovement.toFixed(1)}%`
              : overallDirection === "decline"
              ? "Piora detectada"
              : "Sem alteração"}
          </Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Componente de gráfico de linha simples (ASCII-like)
 */
export function ScaleLineChart({ data }: { data: ScaleResponse[] }) {
  const colors = useColors();

  if (data.length < 2) {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 12, color: colors.muted }}>
          Necessário pelo menos 2 avaliações para visualizar tendência
        </Text>
      </View>
    );
  }

  const scores = data.map((d) => d.totalScore);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const range = maxScore - minScore || 1;

  const lines: string[] = [];
  const height = 5;

  for (let y = height; y >= 0; y--) {
    let line = "";
    for (let x = 0; x < scores.length; x++) {
      const normalizedScore = (scores[x] - minScore) / range;
      const normalizedHeight = normalizedScore * height;

      if (Math.abs(normalizedHeight - y) < 0.5) {
        line += "●";
      } else if (normalizedHeight > y) {
        line += "│";
      } else {
        line += " ";
      }

      if (x < scores.length - 1) {
        line += " ";
      }
    }
    lines.push(line);
  }

  return (
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
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
        Tendência
      </Text>
      <View
        style={{
          backgroundColor: colors.background,
          borderRadius: 8,
          padding: 12,
        }}
      >
        {lines.map((line, index) => (
          <Text
            key={index}
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: colors.muted,
              lineHeight: 16,
            }}
          >
            {line}
          </Text>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 4,
        }}
      >
        <Text style={{ fontSize: 10, color: colors.muted }}>
          {new Date(data[0].date).toLocaleDateString("pt-BR")}
        </Text>
        <Text style={{ fontSize: 10, color: colors.muted }}>
          {new Date(data[data.length - 1].date).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </View>
  );
}

/**
 * Componente de comparação de duas avaliações
 * Usa o calculador centralizado para determinar melhora/piora
 */
export function ScaleComparison({
  before,
  after,
}: {
  before: ScaleResponse;
  after: ScaleResponse;
}) {
  const colors = useColors();
  
  // Usar calculador centralizado
  const scaleType = before.scaleType;
  const direction = getScoreDirection(scaleType, before.totalScore, after.totalScore);
  const absImprovement = calculateAbsoluteImprovement(scaleType, before.totalScore, after.totalScore);
  const pctImprovement = calculateImprovementPercentage(scaleType, before.totalScore, after.totalScore);
  const improved = direction === "improvement";

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
      <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
        Comparação
      </Text>

      <View style={{ flexDirection: "row", gap: 16, justifyContent: "space-between" }}>
        {/* Antes */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted }}>Antes</Text>
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.primary }}>
            {before.totalScore}
          </Text>
          <Text style={{ fontSize: 10, color: colors.muted, textAlign: "center" }}>
            {new Date(before.date).toLocaleDateString("pt-BR")}
          </Text>
        </View>

        {/* Seta */}
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              color: improved ? colors.success : direction === "decline" ? colors.error : colors.muted,
            }}
          >
            →
          </Text>
        </View>

        {/* Depois */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted }}>Depois</Text>
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.primary }}>
            {after.totalScore}
          </Text>
          <Text style={{ fontSize: 10, color: colors.muted, textAlign: "center" }}>
            {new Date(after.date).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>

      {/* Resultado */}
      {improved && (
        <View
          style={{
            backgroundColor: colors.success + "20",
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.success, fontWeight: "600" }}>
            ✓ Melhora de {pctImprovement.toFixed(1)}%
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.success }}>
            {absImprovement} pontos
          </Text>
        </View>
      )}
      
      {direction === "decline" && (
        <View
          style={{
            backgroundColor: colors.error + "20",
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.error, fontWeight: "600" }}>
            ✗ Piora detectada
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.error }}>
            {Math.abs(after.totalScore - before.totalScore)} pontos
          </Text>
        </View>
      )}

      {direction === "stable" && (
        <View
          style={{
            backgroundColor: colors.muted + "20",
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "600" }}>
            ℹ Sem alteração
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.muted }}>
            0
          </Text>
        </View>
      )}
    </View>
  );
}
