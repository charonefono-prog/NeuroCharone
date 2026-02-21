import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse } from "@/lib/clinical-scales";

interface ScaleChartProps {
  data: ScaleResponse[];
  scaleType: string;
}

/**
 * Componente de gráfico de evolução para escalas clínicas
 * Mostra visualmente a progressão dos scores ao longo do tempo
 */
export function ScaleChart({ data, scaleType }: ScaleChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 48; // 24px padding em cada lado

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

  // Extrair scores
  const scores = data.map((d) => d.totalScore);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const range = maxScore - minScore || 1;

  // Calcular altura de cada barra
  const barHeight = 150;
  const barWidth = Math.max(30, (chartWidth - 40) / data.length);
  const spacing = 8;

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

      {/* Gráfico de barras simples */}
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
          const isImproving = index > 0 && score > scores[index - 1];
          const isDecline = index > 0 && score < scores[index - 1];

          return (
            <View
              key={index}
              style={{
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* Barra */}
              <View
                style={{
                  width: Math.min(barWidth - spacing, 40),
                  height: normalizedHeight,
                  backgroundColor: isImproving
                    ? colors.success
                    : isDecline
                    ? colors.error
                    : colors.primary,
                  borderRadius: 4,
                  opacity: 0.8,
                }}
              />
              {/* Valor */}
              <Text style={{ fontSize: 10, color: colors.muted, fontWeight: "600" }}>
                {score}
              </Text>
              {/* Data */}
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
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: colors.success,
            }}
          />
          <Text style={{ fontSize: 12, color: colors.muted }}>Melhora</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: colors.error,
            }}
          />
          <Text style={{ fontSize: 12, color: colors.muted }}>Piora</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: colors.primary,
            }}
          />
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
            {scores[0]}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>Último score:</Text>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
            {scores[scores.length - 1]}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>Variação:</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color:
                scores[scores.length - 1] > scores[0]
                  ? colors.success
                  : scores[scores.length - 1] < scores[0]
                  ? colors.error
                  : colors.muted,
            }}
          >
            {scores[scores.length - 1] - scores[0] > 0 ? "+" : ""}
            {scores[scores.length - 1] - scores[0]}
          </Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Componente de gráfico de linha simples (ASCII-like)
 * Útil para visualização em texto
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

  // Criar representação visual simples
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
 */
export function ScaleComparison({
  before,
  after,
}: {
  before: ScaleResponse;
  after: ScaleResponse;
}) {
  const colors = useColors();
  const improvement = after.totalScore - before.totalScore;
  const isImprovement = improvement > 0;

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
          <Text
            style={{
              fontSize: 10,
              color: colors.muted,
              textAlign: "center",
            }}
          >
            {new Date(before.date).toLocaleDateString("pt-BR")}
          </Text>
        </View>

        {/* Seta */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: isImprovement ? colors.success : colors.error,
            }}
          >
            {isImprovement ? "→" : "←"}
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
          <Text
            style={{
              fontSize: 10,
              color: colors.muted,
              textAlign: "center",
            }}
          >
            {new Date(after.date).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>

      {/* Mudança */}
      <View
        style={{
          backgroundColor: isImprovement ? colors.success + "20" : colors.error + "20",
          borderRadius: 8,
          padding: 12,
          alignItems: "center",
          gap: 4,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: isImprovement ? colors.success : colors.error,
            fontWeight: "600",
          }}
        >
          {isImprovement ? "✓ Melhora" : "⚠ Piora"}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: isImprovement ? colors.success : colors.error,
          }}
        >
          {isImprovement ? "+" : ""}{improvement}
        </Text>
      </View>
    </View>
  );
}
