import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { Session, Patient } from "@/lib/local-storage";

interface SymptomProgressChartProps {
  patient: Patient;
  sessions: Session[];
}

export function SymptomProgressChart({ patient, sessions }: SymptomProgressChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 64;
  const chartHeight = 200;

  // Filtrar sessões com avaliação de sintomas e ordenar por data
  const sessionsWithScores = sessions
    .filter((s) => s.symptomScore !== undefined)
    .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());

  if (sessionsWithScores.length === 0 && !patient.initialSymptomScore) {
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: colors.surface,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.muted, textAlign: "center" }}>
          Nenhuma avaliação de sintomas registrada ainda.{"\n"}
          Adicione avaliações nas sessões para visualizar o progresso.
        </Text>
      </View>
    );
  }

  // Preparar dados do gráfico
  const dataPoints: { date: string; score: number; label: string }[] = [];

  // Adicionar avaliação inicial se existir
  if (patient.initialSymptomScore !== undefined) {
    dataPoints.push({
      date: patient.createdAt,
      score: patient.initialSymptomScore,
      label: "Inicial",
    });
  }

  // Adicionar avaliações das sessões
  sessionsWithScores.forEach((session, index) => {
    dataPoints.push({
      date: session.sessionDate,
      score: session.symptomScore!,
      label: `S${index + 1}`,
    });
  });

  // Calcular melhora percentual
  const initialScore = dataPoints[0].score;
  const latestScore = dataPoints[dataPoints.length - 1].score;
  const improvement = initialScore > 0 ? ((initialScore - latestScore) / initialScore) * 100 : 0;
  const improvementText =
    improvement > 0
      ? `Melhora de ${improvement.toFixed(0)}%`
      : improvement < 0
      ? `Piora de ${Math.abs(improvement).toFixed(0)}%`
      : "Sem alteração";

  // Calcular posições dos pontos
  const maxScore = 10;
  const padding = 40;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  const points = dataPoints.map((point, index) => {
    const x = padding + (graphWidth / (dataPoints.length - 1 || 1)) * index;
    const y = padding + graphHeight - (point.score / maxScore) * graphHeight;
    return { ...point, x, y };
  });

  // Criar path da linha
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

  return (
    <View style={{ gap: 16 }}>
      {/* Indicador de Melhora */}
      <View
        style={{
          backgroundColor:
            improvement > 0
              ? colors.success + "20"
              : improvement < 0
              ? colors.error + "20"
              : colors.muted + "20",
          padding: 16,
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor:
            improvement > 0 ? colors.success : improvement < 0 ? colors.error : colors.muted,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 4 }}>
          Progresso do Tratamento
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: improvement > 0 ? colors.success : improvement < 0 ? colors.error : colors.muted,
          }}
        >
          {improvementText}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
          Avaliação inicial: {initialScore}/10 → Atual: {latestScore}/10
        </Text>
      </View>

      {/* Gráfico */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 16 }}>
          Evolução dos Sintomas
        </Text>

        {/* SVG Chart (simulado com Views) */}
        <View style={{ width: chartWidth, height: chartHeight, position: "relative" }}>
          {/* Linhas de grade horizontais */}
          {[0, 2, 4, 6, 8, 10].map((value) => {
            const y = padding + graphHeight - (value / maxScore) * graphHeight;
            return (
              <View
                key={value}
                style={{
                  position: "absolute",
                  left: padding,
                  right: padding,
                  top: y,
                  height: 1,
                  backgroundColor: colors.border,
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

          {/* Pontos e linha */}
          {points.map((point, index) => (
            <View key={index}>
              {/* Linha conectando pontos */}
              {index > 0 && (
                <View
                  style={{
                    position: "absolute",
                    left: points[index - 1].x,
                    top: points[index - 1].y,
                    width: Math.sqrt(
                      Math.pow(point.x - points[index - 1].x, 2) +
                        Math.pow(point.y - points[index - 1].y, 2)
                    ),
                    height: 2,
                    backgroundColor: colors.primary,
                    transform: [
                      {
                        rotate: `${
                          Math.atan2(
                            point.y - points[index - 1].y,
                            point.x - points[index - 1].x
                          ) *
                          (180 / Math.PI)
                        }deg`,
                      },
                    ],
                    transformOrigin: "left center",
                  }}
                />
              )}

              {/* Ponto */}
              <View
                style={{
                  position: "absolute",
                  left: point.x - 6,
                  top: point.y - 6,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: colors.primary,
                  borderWidth: 2,
                  borderColor: colors.background,
                }}
              />

              {/* Label */}
              <Text
                style={{
                  position: "absolute",
                  left: point.x - 15,
                  top: chartHeight - padding + 10,
                  fontSize: 10,
                  color: colors.muted,
                  textAlign: "center",
                  width: 30,
                }}
              >
                {point.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Legenda */}
        <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "center", gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: colors.primary,
              }}
            />
            <Text style={{ fontSize: 12, color: colors.muted }}>Avaliação dos sintomas (0-10)</Text>
          </View>
        </View>

        <Text style={{ fontSize: 11, color: colors.muted, marginTop: 12, textAlign: "center" }}>
          Escala: 0 = Sem sintomas | 10 = Sintomas muito intensos
        </Text>
      </View>
    </View>
  );
}
