import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse } from "@/lib/clinical-scales";

interface EvolutionChartProps {
  scaleResponses: ScaleResponse[];
  scaleName: string;
}

export function EvolutionChart({ scaleResponses, scaleName }: EvolutionChartProps) {
  const colors = useColors();
  const windowWidth = Dimensions.get("window").width;

  // Filtrar respostas da escala específica
  const scaleData = scaleResponses
    .filter((r) => r.scaleName === scaleName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (scaleData.length === 0) {
    return null;
  }

  // Encontrar min e max para normalização
  const scores = scaleData.map((r) => r.totalScore);
  const maxScore = Math.max(...scores, 100);
  const minScore = Math.min(...scores, 0);
  const range = maxScore - minScore || 1;

  // Dimensões do gráfico
  const chartWidth = windowWidth - 48;
  const chartHeight = 180;
  const padding = 40;

  // Calcular pontos do gráfico
  const points = scaleData.map((data, index) => {
    const x = (index / Math.max(scaleData.length - 1, 1)) * (chartWidth - padding * 2) + padding;
    const normalizedScore = (data.totalScore - minScore) / range;
    const y = chartHeight - normalizedScore * (chartHeight - padding * 2) - padding;
    return { x, y, score: data.totalScore, date: data.date };
  });

  // Criar linha SVG
  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
        Evolução da Pontuação
      </Text>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
          overflow: "hidden",
        }}
      >
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ marginBottom: 16 }}
        >
          {/* Grid horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = chartHeight - ratio * (chartHeight - padding * 2) - padding;
            const scoreValue = Math.round(minScore + ratio * range);
            return (
              <g key={`grid-${index}`}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  fontSize="10"
                  fill={colors.muted}
                  textAnchor="end"
                >
                  {scoreValue}
                </text>
              </g>
            );
          })}

          {/* Linha do gráfico */}
          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pontos */}
          {points.map((point, index) => (
            <circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={colors.primary}
              stroke={colors.background}
              strokeWidth="2"
            />
          ))}

          {/* Eixo X com datas */}
          {points.map((point, index) => {
            if (scaleData.length > 5 && index % Math.ceil(scaleData.length / 5) !== 0) return null;
            const date = new Date(point.date);
            const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
            return (
              <text
                key={`date-${index}`}
                x={point.x}
                y={chartHeight - 5}
                fontSize="10"
                fill={colors.muted}
                textAnchor="middle"
              >
                {dateStr}
              </text>
            );
          })}
        </svg>

        {/* Legenda */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          {scaleData.map((data, index) => (
            <View
              key={`legend-${index}`}
              style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: 8,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 10, color: colors.muted }}>
                {new Date(data.date).toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: colors.primary,
                  marginTop: 4,
                }}
              >
                {data.totalScore}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
