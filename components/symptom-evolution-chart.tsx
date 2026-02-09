import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { Patient, Session } from "@/lib/local-storage";

interface SymptomEvolutionChartProps {
  patient: Patient;
  sessions: Session[];
}

export function SymptomEvolutionChart({ patient, sessions }: SymptomEvolutionChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 80; // 40px padding on each side
  const chartHeight = 250;

  // Filtrar sessões com avaliação de sintomas e ordenar por data
  const sessionsWithScores = sessions
    .filter((s) => s.symptomScore !== undefined)
    .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());

  if (sessionsWithScores.length === 0 || patient.initialSymptomScore === undefined) {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.muted, textAlign: "center" }}>
          Dados insuficientes para gráfico de evolução.{"\n"}
          Registre avaliações de sintomas nas sessões para visualizar a evolução.
        </Text>
      </View>
    );
  }

  // Preparar dados do gráfico (incluindo avaliação inicial)
  const dataPoints = [
    {
      score: patient.initialSymptomScore,
      date: new Date(patient.createdAt),
      label: "Inicial",
      isBaseline: true,
    },
    ...sessionsWithScores.map((session) => ({
      score: session.symptomScore!,
      date: new Date(session.sessionDate),
      label: new Date(session.sessionDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      isBaseline: false,
    })),
  ];

  const maxScore = 10;
  const minScore = 0;
  const scoreRange = maxScore - minScore;

  // Calcular melhora total
  const initialScore = dataPoints[0].score;
  const latestScore = dataPoints[dataPoints.length - 1].score;
  const improvement = initialScore - latestScore;
  const improvementPercentage = (improvement / initialScore) * 100;

  // Calcular posições dos pontos
  const pointSpacing = chartWidth / (dataPoints.length - 1);
  const points = dataPoints.map((point, index) => {
    const x = index * pointSpacing;
    const y = chartHeight - ((point.score - minScore) / scoreRange) * chartHeight;
    return { ...point, x, y };
  });

  // Gerar path do SVG
  const pathData = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `L ${point.x} ${point.y}`;
    })
    .join(" ");

  return (
    <View style={{ gap: 16 }}>
      {/* Header */}
      <View>
        <Text style={{ fontSize: 20, fontWeight: "600", color: colors.foreground, marginBottom: 4 }}>
          Evolução dos Sintomas
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted }}>
          Acompanhamento da intensidade dos sintomas ao longo do tratamento
        </Text>
      </View>

      {/* Indicador de Melhora */}
      <View
        style={{
          backgroundColor: improvement > 0 ? colors.success + "20" : colors.error + "20",
          borderRadius: 12,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontSize: 12, color: colors.muted }}>Melhora Total</Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: improvement > 0 ? colors.success : colors.error,
              marginTop: 4,
            }}
          >
            {improvement > 0 ? "+" : ""}
            {improvement.toFixed(1)} pontos
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>Percentual</Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: improvement > 0 ? colors.success : colors.error,
              marginTop: 4,
            }}
          >
            {improvementPercentage > 0 ? "-" : "+"}
            {Math.abs(improvementPercentage).toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Gráfico */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
        }}
      >
        {/* Área do gráfico */}
        <View style={{ height: chartHeight, position: "relative" }}>
          {/* Linhas de grade horizontais */}
          {[0, 2.5, 5, 7.5, 10].map((value) => {
            const y = chartHeight - ((value - minScore) / scoreRange) * chartHeight;
            return (
              <View
                key={value}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: y,
                  height: 1,
                  backgroundColor: colors.border,
                  opacity: 0.5,
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    left: -30,
                    top: -8,
                    fontSize: 10,
                    color: colors.muted,
                  }}
                >
                  {value}
                </Text>
              </View>
            );
          })}

          {/* Linha do gráfico */}
          <svg width={chartWidth} height={chartHeight} style={{ position: "absolute", left: 0, top: 0 }}>
            <path
              d={pathData}
              stroke={improvement > 0 ? colors.success : colors.error}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Pontos */}
          {points.map((point, index) => (
            <View
              key={index}
              style={{
                position: "absolute",
                left: point.x - 6,
                top: point.y - 6,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: point.isBaseline ? colors.primary : improvement > 0 ? colors.success : colors.error,
                borderWidth: 2,
                borderColor: colors.surface,
              }}
            />
          ))}
        </View>

        {/* Labels das datas */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          {points.map((point, index) => {
            // Mostrar apenas alguns labels para evitar sobreposição
            const showLabel = index === 0 || index === points.length - 1 || points.length <= 5;
            return (
              <Text
                key={index}
                style={{
                  fontSize: 10,
                  color: point.isBaseline ? colors.primary : colors.muted,
                  fontWeight: point.isBaseline ? "600" : "400",
                  opacity: showLabel ? 1 : 0,
                }}
              >
                {point.label}
              </Text>
            );
          })}
        </View>
      </View>

      {/* Legenda */}
      <View
        style={{
          backgroundColor: colors.primary + "20",
          borderRadius: 12,
          padding: 16,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
          💡 Como interpretar
        </Text>
        <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
          • <Text style={{ fontWeight: "600" }}>Linha descendente</Text> indica melhora dos sintomas
          {"\n"}• <Text style={{ fontWeight: "600" }}>Linha ascendente</Text> indica piora dos sintomas
          {"\n"}• O ponto azul representa a avaliação inicial antes do tratamento
          {"\n"}• Cada ponto no gráfico representa uma sessão com avaliação de sintomas
        </Text>
      </View>
    </View>
  );
}
