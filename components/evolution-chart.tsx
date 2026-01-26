import { View, Text, Dimensions, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScaleResponse } from "@/lib/clinical-scales";

interface EvolutionChartProps {
  scaleResponses: ScaleResponse[];
  scaleName: string;
}

export function EvolutionChart({ scaleResponses, scaleName }: EvolutionChartProps) {
  const colors = useColors();

  // Filtrar respostas da escala específica
  const scaleData = scaleResponses
    .filter((r) => r.scaleName === scaleName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (scaleData.length === 0) {
    return null;
  }

  // Encontrar max para normalização
  const scores = scaleData.map((r) => r.totalScore);
  const maxScore = Math.max(...scores, 100);

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
        }}
      >
        {/* Gráfico de barras */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 120 }}>
            {scaleData.map((data, index) => {
              const heightPercent = (data.totalScore / maxScore) * 100;
              return (
                <View
                  key={`bar-${index}`}
                  style={{
                    flex: 1,
                    height: `${heightPercent}%`,
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                    minHeight: 8,
                  }}
                />
              );
            })}
          </View>
        </View>

        {/* Legenda com scroll horizontal */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {scaleData.map((data, index) => (
              <View
                key={`legend-${index}`}
                style={{
                  backgroundColor: colors.background,
                  padding: 8,
                  borderRadius: 8,
                  alignItems: "center",
                  minWidth: 70,
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
        </ScrollView>
      </View>
    </View>
  );
}
