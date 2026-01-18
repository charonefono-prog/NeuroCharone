import { View, Text, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Patient, TherapeuticPlan, Session } from "@/lib/local-storage";
import { EffectivenessAnalysis } from "./effectiveness-analysis";
import { ComparativeEffectivenessReport } from "./comparative-effectiveness-report";

interface AdvancedStatisticsProps {
  patients: Patient[];
  plans: TherapeuticPlan[];
  sessions: Session[];
}

export function AdvancedStatistics({ patients, plans, sessions }: AdvancedStatisticsProps) {
  const colors = useColors();

  // Estatísticas de diagnósticos
  const diagnosisStats = patients.reduce((acc, patient) => {
    const diagnosis = patient.diagnosis || "Não especificado";
    acc[diagnosis] = (acc[diagnosis] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const diagnosisData = Object.entries(diagnosisStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Estatísticas de regiões mais estimuladas
  const regionStats = sessions.reduce((acc, session) => {
    session.stimulatedPoints.forEach((point: string) => {
      acc[point] = (acc[point] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const regionData = Object.entries(regionStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Taxa de adesão ao tratamento (sessões realizadas vs planejadas)
  const adherenceData = patients.map((patient) => {
    const patientPlans = plans.filter((p) => p.patientId === patient.id);
    const patientSessions = sessions.filter((s) => s.patientId === patient.id);
    
    let plannedSessions = 0;
    patientPlans.forEach((plan) => {
      if (plan.frequency && plan.totalDuration) {
        plannedSessions += plan.frequency * plan.totalDuration;
      }
    });

    const completedSessions = patientSessions.length;
    const adherenceRate = plannedSessions > 0 ? (completedSessions / plannedSessions) * 100 : 0;

    return {
      name: patient.fullName,
      adherence: Math.min(adherenceRate, 100),
      completed: completedSessions,
      planned: plannedSessions,
    };
  }).filter((p) => p.planned > 0).sort((a, b) => b.adherence - a.adherence);

  const maxDiagnosis = Math.max(...diagnosisData.map((d) => d[1]), 1);
  const maxRegion = Math.max(...regionData.map((r) => r[1]), 1);

  return (
    <View style={{ gap: 24 }}>
      <ScrollView contentContainerStyle={{ gap: 24 }}>
      {/* Distribuição de Diagnósticos */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
          Distribuição de Diagnósticos
        </Text>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            gap: 12,
          }}
        >
          {diagnosisData.length > 0 ? (
            diagnosisData.map(([diagnosis, count]) => {
              const percentage = (count / maxDiagnosis) * 100;
              return (
                <View key={diagnosis} style={{ gap: 6 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 14, color: colors.foreground, flex: 1 }}>
                      {diagnosis}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                      {count} {count === 1 ? "paciente" : "pacientes"}
                    </Text>
                  </View>
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
                        height: "100%",
                        width: `${percentage}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
              Nenhum dado disponível
            </Text>
          )}
        </View>
      </View>

      {/* Regiões Mais Estimuladas */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
          Pontos Mais Estimulados
        </Text>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            gap: 12,
          }}
        >
          {regionData.length > 0 ? (
            regionData.map(([region, count]) => {
              const percentage = (count / maxRegion) * 100;
              return (
                <View key={region} style={{ gap: 6 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                      {region}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.success }}>
                      {count} {count === 1 ? "sessão" : "sessões"}
                    </Text>
                  </View>
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
                        height: "100%",
                        width: `${percentage}%`,
                        backgroundColor: colors.success,
                      }}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
              Nenhuma sessão registrada
            </Text>
          )}
        </View>
      </View>

      {/* Taxa de Adesão ao Tratamento */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
          Taxa de Adesão ao Tratamento
        </Text>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            gap: 12,
          }}
        >
          {adherenceData.length > 0 ? (
            adherenceData.map((patient) => {
              const color =
                patient.adherence >= 80
                  ? colors.success
                  : patient.adherence >= 50
                  ? colors.warning
                  : colors.error;

              return (
                <View key={patient.name} style={{ gap: 6 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 14, color: colors.foreground, flex: 1 }}>
                      {patient.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      {patient.completed}/{patient.planned}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: "600", color, marginLeft: 8 }}>
                      {patient.adherence.toFixed(0)}%
                    </Text>
                  </View>
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
                        height: "100%",
                        width: `${patient.adherence}%`,
                        backgroundColor: color,
                      }}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
              Nenhum plano terapêutico com sessões planejadas
            </Text>
          )}
        </View>
      </View>

      {/* Resumo Geral */}
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
          Resumo Geral
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          <View
            style={{
              flex: 1,
              minWidth: 150,
              backgroundColor: colors.primary + "20",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.primary,
              padding: 16,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.primary }}>
              {patients.length}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>Total de Pacientes</Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: 150,
              backgroundColor: colors.success + "20",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.success,
              padding: 16,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.success }}>
              {sessions.length}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>Sessões Realizadas</Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: 150,
              backgroundColor: colors.warning + "20",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.warning,
              padding: 16,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.warning }}>
              {plans.length}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>Planos Ativos</Text>
          </View>
        </View>
      </View>

      {/* Análise de Efetividade por Região */}
      <EffectivenessAnalysis patients={patients} sessions={sessions} />

      {/* Relat\u00f3rio Comparativo de Efetividade */}
      <ComparativeEffectivenessReport patients={patients} sessions={sessions} />
      </ScrollView>
    </View>
  );
}
