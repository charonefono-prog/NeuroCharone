import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { Patient, Session } from "@/lib/local-storage";

interface ComparativeEffectivenessReportProps {
  patients: Patient[];
  sessions: Session[];
}

interface DiagnosisStats {
  diagnosis: string;
  patientCount: number;
  avgSessionCount: number;
  avgTreatmentDays: number;
  avgImprovement: number;
  improvementRate: number; // Percentual de pacientes com melhora
}

export function ComparativeEffectivenessReport({ patients, sessions }: ComparativeEffectivenessReportProps) {
  const colors = useColors();

  // Agrupar dados por diagnóstico
  const diagnosisStats: Record<string, DiagnosisStats> = {};

  patients.forEach((patient) => {
    const diagnosis = patient.diagnosis || "Não especificado";
    
    if (!diagnosisStats[diagnosis]) {
      diagnosisStats[diagnosis] = {
        diagnosis,
        patientCount: 0,
        avgSessionCount: 0,
        avgTreatmentDays: 0,
        avgImprovement: 0,
        improvementRate: 0,
      };
    }

    diagnosisStats[diagnosis].patientCount++;

    // Calcular sessões do paciente
    const patientSessions = sessions.filter((s) => s.patientId === patient.id);
    diagnosisStats[diagnosis].avgSessionCount += patientSessions.length;

    // Calcular duração do tratamento
    if (patientSessions.length > 0) {
      const firstSession = new Date(patientSessions[0].sessionDate);
      const lastSession = new Date(patientSessions[patientSessions.length - 1].sessionDate);
      const treatmentDays = Math.ceil((lastSession.getTime() - firstSession.getTime()) / (1000 * 60 * 60 * 24));
      diagnosisStats[diagnosis].avgTreatmentDays += treatmentDays;
    }

    // Calcular melhora
    if (patient.initialSymptomScore !== undefined) {
      const sessionsWithScores = patientSessions.filter((s) => s.symptomScore !== undefined);
      if (sessionsWithScores.length > 0) {
        const latestScore = sessionsWithScores[sessionsWithScores.length - 1].symptomScore!;
        const improvement = patient.initialSymptomScore - latestScore;
        diagnosisStats[diagnosis].avgImprovement += improvement;
        
        if (improvement > 0) {
          diagnosisStats[diagnosis].improvementRate++;
        }
      }
    }
  });

  // Calcular médias
  Object.values(diagnosisStats).forEach((stats) => {
    if (stats.patientCount > 0) {
      stats.avgSessionCount = stats.avgSessionCount / stats.patientCount;
      stats.avgTreatmentDays = stats.avgTreatmentDays / stats.patientCount;
      stats.avgImprovement = stats.avgImprovement / stats.patientCount;
      stats.improvementRate = (stats.improvementRate / stats.patientCount) * 100;
    }
  });

  // Ordenar por taxa de melhora
  const sortedStats = Object.values(diagnosisStats).sort((a, b) => b.improvementRate - a.improvementRate);

  if (sortedStats.length === 0) {
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
          Dados insuficientes para relatório comparativo.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      {/* Header */}
      <View>
        <Text style={{ fontSize: 20, fontWeight: "600", color: colors.foreground, marginBottom: 4 }}>
          Relatório Comparativo de Efetividade
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted }}>
          Comparação de resultados por diagnóstico para identificar protocolos mais eficazes
        </Text>
      </View>

      {/* Tabela Comparativa */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        {/* Header da Tabela */}
        <View
          style={{
            backgroundColor: colors.primary + "20",
            flexDirection: "row",
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ flex: 2, fontSize: 12, fontWeight: "600", color: colors.foreground }}>Diagnóstico</Text>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: colors.foreground, textAlign: "center" }}>
            Pacientes
          </Text>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: colors.foreground, textAlign: "center" }}>
            Sessões Médias
          </Text>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: colors.foreground, textAlign: "center" }}>
            Dias de Trat.
          </Text>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: colors.foreground, textAlign: "center" }}>
            Melhora Média
          </Text>
          <Text style={{ flex: 1, fontSize: 12, fontWeight: "600", color: colors.foreground, textAlign: "center" }}>
            Taxa Melhora
          </Text>
        </View>

        {/* Linhas da Tabela */}
        {sortedStats.map((stats, index) => (
          <View
            key={stats.diagnosis}
            style={{
              flexDirection: "row",
              padding: 12,
              borderBottomWidth: index < sortedStats.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
              backgroundColor: index % 2 === 0 ? "transparent" : colors.background,
            }}
          >
            <Text style={{ flex: 2, fontSize: 13, color: colors.foreground }}>{stats.diagnosis}</Text>
            <Text style={{ flex: 1, fontSize: 13, color: colors.foreground, textAlign: "center" }}>
              {stats.patientCount}
            </Text>
            <Text style={{ flex: 1, fontSize: 13, color: colors.foreground, textAlign: "center" }}>
              {stats.avgSessionCount.toFixed(1)}
            </Text>
            <Text style={{ flex: 1, fontSize: 13, color: colors.foreground, textAlign: "center" }}>
              {stats.avgTreatmentDays.toFixed(0)}
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: stats.avgImprovement > 0 ? colors.success : colors.error,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {stats.avgImprovement > 0 ? "+" : ""}
              {stats.avgImprovement.toFixed(1)}
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: stats.improvementRate >= 70 ? colors.success : stats.improvementRate >= 50 ? colors.warning : colors.error,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {stats.improvementRate.toFixed(0)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Insights */}
      <View
        style={{
          backgroundColor: colors.success + "20",
          borderRadius: 12,
          padding: 16,
          borderLeftWidth: 4,
          borderLeftColor: colors.success,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>
          💡 Insights
        </Text>
        {sortedStats.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
              • <Text style={{ fontWeight: "600" }}>{sortedStats[0].diagnosis}</Text> apresenta a maior taxa de melhora (
              {sortedStats[0].improvementRate.toFixed(0)}%)
            </Text>
            <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
              • Tempo médio de tratamento: <Text style={{ fontWeight: "600" }}>
                {(sortedStats.reduce((sum, s) => sum + s.avgTreatmentDays, 0) / sortedStats.length).toFixed(0)} dias
              </Text>
            </Text>
            <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 20 }}>
              • Número médio de sessões: <Text style={{ fontWeight: "600" }}>
                {(sortedStats.reduce((sum, s) => sum + s.avgSessionCount, 0) / sortedStats.length).toFixed(1)} sessões
              </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
