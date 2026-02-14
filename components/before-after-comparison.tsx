import React, { useMemo } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import type { Session, TherapeuticPlan, Patient } from '@/lib/local-storage';
import { SymptomEvolutionLineChart } from './symptom-evolution-line-chart';

interface BeforeAfterComparisonProps {
  patient: Patient;
  sessions: Session[];
  plans: TherapeuticPlan[];
}

interface ComparisonMetrics {
  initialScore: number;
  currentScore: number;
  improvement: number;
  improvementPercentage: number;
  sessionsCompleted: number;
  treatmentDuration: number;
  regionsTargeted: string[];
}

export function BeforeAfterComparison({
  patient,
  sessions,
  plans,
}: BeforeAfterComparisonProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;

  const metrics = useMemo(() => {
    const allScores = sessions
      .filter(s => s.symptomScore !== undefined)
      .map(s => s.symptomScore || 0)
      .sort((a, b) => a - b);

    const initialScore = allScores.length > 0 ? allScores[0] : 0;
    const currentScore = allScores.length > 0 ? allScores[allScores.length - 1] : 0;
    const improvement = initialScore - currentScore;
    // Calcular percentagem de melhora
    // Se score inicial eh 0, nao ha melhora possivel
    // Caso contrario, calcular a reducao percentual
    let improvementPercentage = 0;
    if (initialScore > 0) {
      // Calcular percentual de reducao: (reducao / score inicial) * 100
      improvementPercentage = (improvement / initialScore) * 100;
      // Garantir que nao seja negativo (se score aumentou)
      if (improvementPercentage < 0) {
        improvementPercentage = 0;
      }
    }

    const completedSessions = sessions.filter(s => new Date(s.sessionDate) < new Date()).length;
    const treatmentDuration = sessions.length > 0
      ? Math.ceil(
          (new Date(sessions[sessions.length - 1].sessionDate).getTime() -
            new Date(sessions[0].sessionDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    const regionsTargeted = Array.from(new Set(plans.flatMap(p => p.targetRegions)));

    return {
      initialScore,
      currentScore,
      improvement,
      improvementPercentage,
      sessionsCompleted: completedSessions,
      treatmentDuration,
      regionsTargeted,
    };
  }, [sessions, plans]);

  const renderProgressBar = (label: string, initial: number, current: number, max: number = 10) => {
    const initialWidth = (initial / max) * 100;
    const currentWidth = (current / max) * 100;

    return (
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: colors.muted,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>

        <View style={{ gap: 12 }}>
          {/* Antes */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: colors.muted,
                }}
              >
                Antes
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: colors.error,
                }}
              >
                {initial.toFixed(1)}
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: colors.border,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${initialWidth}%`,
                  backgroundColor: colors.error,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>

          {/* Depois */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: colors.muted,
                }}
              >
                Depois
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: colors.success,
                }}
              >
                {current.toFixed(1)}
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: colors.border,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${currentWidth}%`,
                  backgroundColor: colors.success,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderComparisonCard = (
    label: string,
    beforeValue: string | number,
    afterValue: string | number,
    unit: string = '',
    icon: string = ''
  ) => (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: colors.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 12,
        }}
      >
        {icon} {label}
      </Text>

      <View style={{ gap: 8 }}>
        <View>
          <Text
            style={{
              fontSize: 10,
              color: colors.muted,
              marginBottom: 2,
            }}
          >
            Antes
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.error,
            }}
          >
            {beforeValue}
            {unit && <Text style={{ fontSize: 12 }}>{unit}</Text>}
          </Text>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
          }}
        />

        <View>
          <Text
            style={{
              fontSize: 10,
              color: colors.muted,
              marginBottom: 2,
            }}
          >
            Depois
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.success,
            }}
          >
            {afterValue}
            {unit && <Text style={{ fontSize: 12 }}>{unit}</Text>}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={{ gap: 24 }}>
        {/* Título */}
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.foreground,
              marginBottom: 4,
            }}
          >
            Comparação Antes & Depois
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
            }}
          >
            Visualize o impacto do tratamento
          </Text>
        </View>

        {/* Melhora Geral */}
        <View
          style={{
            backgroundColor: colors.primary + '15',
            borderRadius: 12,
            padding: 20,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.muted,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            Melhora Geral
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 36,
                fontWeight: '700',
                color: colors.primary,
              }}
            >
              {metrics.improvementPercentage.toFixed(0)}%
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.muted,
              }}
            >
              de redução de sintomas
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
              marginTop: 8,
            }}
          >
            Score: {metrics.initialScore.toFixed(1)} → {metrics.currentScore.toFixed(1)}
          </Text>
        </View>

        {/* Gráfico de Evolução em Linha */}
        <SymptomEvolutionLineChart patient={patient} sessions={sessions} />

        {/* Gráfico de Progresso */}
        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.foreground,
              marginBottom: 16,
            }}
          >
            Evolução de Sintomas
          </Text>
          {renderProgressBar('Score de Sintomas', metrics.initialScore, metrics.currentScore)}
        </View>

        {/* Cards de Comparação */}
        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.foreground,
              marginBottom: 12,
            }}
          >
            Métricas de Tratamento
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            {renderComparisonCard('Sessões', '0', metrics.sessionsCompleted, '', '📅')}
            {renderComparisonCard('Duração', '0d', `${metrics.treatmentDuration}d`, '', '⏱️')}
          </View>
        </View>

        {/* Regiões Tratadas */}
        {metrics.regionsTargeted.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              Regiões Cerebrais Alvo
            </Text>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {metrics.regionsTargeted.map((region, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: colors.primary + '20',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: colors.primary,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: colors.primary,
                      }}
                    >
                      {region}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Resumo de Impacto */}
        <View
          style={{
            backgroundColor: colors.success + '10',
            borderRadius: 8,
            padding: 16,
            borderLeftWidth: 4,
            borderLeftColor: colors.success,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.muted,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            Impacto do Tratamento
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.success,
              lineHeight: 20,
            }}
          >
            {metrics.improvementPercentage > 50
              ? '✓ Excelente progresso! O tratamento está tendo impacto significativo.'
              : metrics.improvementPercentage > 25
              ? '✓ Bom progresso. Continue mantendo a consistência.'
              : metrics.improvementPercentage > 0
              ? '→ Progresso inicial. Mantenha a frequência de sessões.'
              : '○ Sem progresso detectado ainda. Consulte seu médico.'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
