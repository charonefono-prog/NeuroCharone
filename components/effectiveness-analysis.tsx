import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { Patient, Session } from "@/lib/local-storage";
import { helmetRegions } from "@/shared/helmet-data";

interface EffectivenessAnalysisProps {
  patients: Patient[];
  sessions: Session[];
}

interface RegionEffectiveness {
  region: string;
  improvementSum: number;
  sessionCount: number;
  avgImprovement: number;
  patientCount: number;
}

export function EffectivenessAnalysis({ patients, sessions }: EffectivenessAnalysisProps) {
  const colors = useColors();

  // Calcular efetividade por região
  const calculateEffectiveness = (): RegionEffectiveness[] => {
    const regionData = new Map<string, { improvementSum: number; sessionCount: number; patientIds: Set<string> }>();

    // Para cada sessão com avaliação de sintomas
    sessions.forEach((session) => {
      if (session.symptomScore === undefined) return;

      // Encontrar paciente
      const patient = patients.find((p) => p.id === session.patientId);
      if (!patient || patient.initialSymptomScore === undefined) return;

      // Symptom scores são INVERSOS: score menor = melhor (0=sem sintomas, 10=muito intenso)
      // improvement positivo = melhora (score diminuiu)
      const improvement = patient.initialSymptomScore - session.symptomScore;

      // Para cada ponto estimulado, encontrar a região
      session.stimulatedPoints.forEach((point) => {
        const region = helmetRegions.find((r) => r.points.includes(point));
        if (!region) return;

        const regionName = region.name;
        const existing = regionData.get(regionName) || {
          improvementSum: 0,
          sessionCount: 0,
          patientIds: new Set<string>(),
        };

        existing.improvementSum += improvement;
        existing.sessionCount += 1;
        existing.patientIds.add(session.patientId);

        regionData.set(regionName, existing);
      });
    });

    // Converter para array e calcular média
    const results: RegionEffectiveness[] = [];
    regionData.forEach((data, region) => {
      results.push({
        region,
        improvementSum: data.improvementSum,
        sessionCount: data.sessionCount,
        avgImprovement: data.improvementSum / data.sessionCount,
        patientCount: data.patientIds.size,
      });
    });

    // Ordenar por efetividade média (maior primeiro)
    return results.sort((a, b) => b.avgImprovement - a.avgImprovement);
  };

  const effectiveness = calculateEffectiveness();

  if (effectiveness.length === 0) {
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
          Dados insuficientes para análise de efetividade.{"\n"}
          Registre avaliações de sintomas nas sessões para visualizar esta análise.
        </Text>
      </View>
    );
  }

  const maxImprovement = Math.max(...effectiveness.map((e) => Math.abs(e.avgImprovement)));

  return (
    <View style={{ gap: 16 }}>
      {/* Header */}
      <View>
        <Text style={{ fontSize: 20, fontWeight: "600", color: colors.foreground, marginBottom: 4 }}>
          Efetividade por Região Cerebral
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted }}>
          Análise da melhora média dos sintomas por região estimulada
        </Text>
      </View>

      {/* Ranking de Regiões */}
      <View style={{ gap: 12 }}>
        {effectiveness.map((item, index) => {
          const isPositive = item.avgImprovement > 0;
          const barWidth = (Math.abs(item.avgImprovement) / maxImprovement) * 100;
          const barColor = isPositive ? colors.success : colors.error;

          return (
            <View
              key={item.region}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
              }}
            >
              {/* Ranking e Nome da Região */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: index < 3 ? colors.primary + "20" : colors.muted + "20",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: index < 3 ? colors.primary : colors.muted,
                    }}
                  >
                    {index + 1}º
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
                    {item.region}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                    {item.sessionCount} sessões • {item.patientCount} pacientes
                  </Text>
                </View>
              </View>

              {/* Barra de Efetividade */}
              <View style={{ marginBottom: 8 }}>
                <View
                  style={{
                    height: 8,
                    backgroundColor: colors.border,
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      width: `${barWidth}%`,
                      height: "100%",
                      backgroundColor: barColor,
                    }}
                  />
                </View>
              </View>

              {/* Estatísticas */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                  <Text style={{ fontSize: 12, color: colors.muted }}>Melhora Média</Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: barColor,
                      marginTop: 2,
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {item.avgImprovement.toFixed(1)} pontos
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>Efetividade</Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: barColor,
                      marginTop: 2,
                    }}
                  >
                    {((Math.abs(item.avgImprovement) / 10) * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
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
          • <Text style={{ fontWeight: "600" }}>Valores positivos</Text> indicam redução dos sintomas (melhora)
          {"\n"}• <Text style={{ fontWeight: "600" }}>Valores negativos</Text> indicam aumento dos sintomas (piora)
          {"\n"}• A análise considera a diferença entre a avaliação inicial do paciente e as avaliações nas sessões
          {"\n"}• Regiões com mais sessões e pacientes fornecem resultados mais confiáveis
        </Text>
      </View>
    </View>
  );
}
