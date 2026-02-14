import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { type Session } from "@/lib/local-storage";

interface TreatmentChartProps {
  sessions: Session[];
}

export function TreatmentChart({ sessions }: TreatmentChartProps) {
  const colors = useColors();

  if (sessions.length === 0) {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 32,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
          Nenhuma sessão registrada ainda
        </Text>
      </View>
    );
  }

  // Ordenar sessões por data
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
  );

  // Calcular estatísticas
  const durations = sortedSessions.map((s) => s.durationMinutes);
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const totalSessions = sortedSessions.length;

  // Calcular pontos estimulados mais frequentes
  const pointsCount: Record<string, number> = {};
  sortedSessions.forEach((session) => {
    session.stimulatedPoints.forEach((point) => {
      pointsCount[point] = (pointsCount[point] || 0) + 1;
    });
  });

  const topPoints = Object.entries(pointsCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <View style={{ gap: 16 }}>
      {/* Estatísticas Principais */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 12,
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted }}>Total</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.primary }}>
            {totalSessions}
          </Text>
          <Text style={{ fontSize: 10, color: colors.muted }}>sessões</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 12,
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted }}>Média</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.success }}>
            {avgDuration.toFixed(0)}
          </Text>
          <Text style={{ fontSize: 10, color: colors.muted }}>minutos</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 12,
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: colors.muted }}>Variação</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.warning }}>
            {minDuration}-{maxDuration}
          </Text>
          <Text style={{ fontSize: 10, color: colors.muted }}>minutos</Text>
        </View>
      </View>

      {/* Gráfico de Barras Simples */}
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
        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
          Duração das Últimas Sessões
        </Text>

        <View style={{ gap: 8 }}>
          {sortedSessions.slice(-10).map((session, index) => {
            const percentage = (session.durationMinutes / maxDuration) * 100;
            const date = new Date(session.sessionDate);
            const dateStr = date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            });

            return (
              <View key={session.id} style={{ gap: 4 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{dateStr}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                    {session.durationMinutes} min
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
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {sortedSessions.length > 10 && (
          <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", marginTop: 4 }}>
            Mostrando as 10 sessões mais recentes
          </Text>
        )}
      </View>

      {/* Pontos Mais Estimulados */}
      {topPoints.length > 0 && (
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
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
            Pontos Mais Estimulados
          </Text>

          <View style={{ gap: 8 }}>
            {topPoints.map(([point, count], index) => {
              const percentage = (count / totalSessions) * 100;
              return (
                <View key={point} style={{ gap: 4 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                      {point}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      {count}x ({percentage.toFixed(0)}%)
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 6,
                      backgroundColor: colors.border,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        backgroundColor: colors.success,
                        borderRadius: 3,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Progresso do Plano */}
      <View
        style={{
          backgroundColor: colors.primary + "10",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.primary + "30",
          padding: 16,
          gap: 8,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
            Progresso do Tratamento
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
            {totalSessions} sessões
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: colors.foreground, lineHeight: 18 }}>
          Continue o tratamento conforme o plano terapêutico para melhores resultados. A consistência é fundamental para o sucesso da neuromodulação.
        </Text>
      </View>
    </View>
  );
}
