import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import type { Session, TherapeuticPlan, Patient } from '@/lib/local-storage';
import { downloadEffectivenessReportHTML, exportEffectivenessReportPDF } from '@/lib/effectiveness-pdf-export';

interface EffectivenessDashboardProps {
  sessions: Session[];
  plans: TherapeuticPlan[];
  patients: Patient[];
}

interface ProtocolStats {
  protocol: string;
  totalSessions: number;
  completedSessions: number;
  averageSymptomScore: number;
  improvementRate: number;
  targetRegions: string[];
}

interface RegionStats {
  region: string;
  sessionCount: number;
  averageSymptomScore: number;
  improvementRate: number;
}

export function EffectivenessDashboard({
  sessions,
  plans,
  patients,
}: EffectivenessDashboardProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  const [exporting, setExporting] = useState(false);

  const handleExportReport = async () => {
    try {
      setExporting(true);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const patient = patients[0];
      if (!patient) return;

      if (Platform.OS === 'web') {
        downloadEffectivenessReportHTML(patient, sessions, plans);
      } else {
        await exportEffectivenessReportPDF(patient, sessions, plans);
      }

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setExporting(false);
    }
  };

  // Calcular estatísticas por protocolo
  const protocolStats = useMemo(() => {
    const stats: Record<string, ProtocolStats> = {};

    plans.forEach(plan => {
      const planSessions = sessions.filter(s => s.planId === plan.id);
      const completedSessions = planSessions.filter(
        s => new Date(s.sessionDate) < new Date()
      );

      const symptomScores = planSessions
        .filter(s => s.symptomScore !== undefined)
        .map(s => s.symptomScore || 0);

      const initialScore = Math.max(...symptomScores, 0);
      const finalScore = Math.min(...symptomScores, 10);
      const improvementRate =
        initialScore > 0 ? ((initialScore - finalScore) / initialScore) * 100 : 0;

      stats[plan.id] = {
        protocol: plan.objective,
        totalSessions: planSessions.length,
        completedSessions: completedSessions.length,
        averageSymptomScore:
          symptomScores.length > 0
            ? symptomScores.reduce((a, b) => a + b) / symptomScores.length
            : 0,
        improvementRate: Math.max(0, improvementRate),
        targetRegions: plan.targetRegions,
      };
    });

    return Object.values(stats).sort(
      (a, b) => b.completedSessions - a.completedSessions
    );
  }, [sessions, plans]);

  // Calcular estatísticas por região
  const regionStats = useMemo(() => {
    const stats: Record<string, RegionStats> = {};

    plans.forEach(plan => {
      plan.targetRegions.forEach(region => {
        if (!stats[region]) {
          stats[region] = {
            region,
            sessionCount: 0,
            averageSymptomScore: 0,
            improvementRate: 0,
          };
        }

        const planSessions = sessions.filter(s => s.planId === plan.id);
        stats[region].sessionCount += planSessions.length;

        const scores = planSessions
          .filter(s => s.symptomScore !== undefined)
          .map(s => s.symptomScore || 0);

        if (scores.length > 0) {
          stats[region].averageSymptomScore =
            (stats[region].averageSymptomScore * (stats[region].sessionCount - planSessions.length) +
              scores.reduce((a, b) => a + b)) /
            stats[region].sessionCount;
        }
      });
    });

    return Object.values(stats).sort((a, b) => b.sessionCount - a.sessionCount);
  }, [sessions, plans]);

  // Calcular métricas gerais
  const generalMetrics = useMemo(() => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(
      s => new Date(s.sessionDate) < new Date()
    ).length;

    const allScores = sessions
      .filter(s => s.symptomScore !== undefined)
      .map(s => s.symptomScore || 0);

    const averageScore =
      allScores.length > 0
        ? allScores.reduce((a, b) => a + b) / allScores.length
        : 0;

    const activePlans = plans.filter(p => p.isActive).length;

    return {
      totalSessions,
      completedSessions,
      averageScore,
      activePlans,
      completionRate:
        totalSessions > 0
          ? Math.round((completedSessions / totalSessions) * 100)
          : 0,
    };
  }, [sessions, plans]);

  const renderMetricCard = (
    label: string,
    value: string | number,
    unit: string = '',
    color: string = colors.primary
  ) => (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 14,
        borderLeftWidth: 4,
        borderLeftColor: color,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: colors.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: colors.foreground,
          }}
        >
          {value}
        </Text>
        {unit && (
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.muted,
            }}
          >
            {unit}
          </Text>
        )}
      </View>
    </View>
  );

  const renderProtocolCard = (stat: ProtocolStats) => (
    <View
      key={stat.protocol}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 14,
        marginBottom: 12,
        borderTopWidth: 3,
        borderTopColor: colors.primary,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: colors.foreground,
            flex: 1,
          }}
        >
          {stat.protocol}
        </Text>
        <View
          style={{
            backgroundColor: colors.success + '20',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: colors.success,
            }}
          >
            {stat.completedSessions}/{stat.totalSessions}
          </Text>
        </View>
      </View>

      {/* Regiões */}
      {stat.targetRegions.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text
            style={{
              fontSize: 10,
              color: colors.muted,
              marginBottom: 4,
            }}
          >
            Regiões:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {stat.targetRegions.map((region, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: colors.primary + '15',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: colors.primary,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
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
      )}

      {/* Métricas */}
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 9,
              color: colors.muted,
              marginBottom: 2,
            }}
          >
            Sintomas
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.foreground,
            }}
          >
            {stat.averageSymptomScore.toFixed(1)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 9,
              color: colors.muted,
              marginBottom: 2,
            }}
          >
            Melhora
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.success,
            }}
          >
            {stat.improvementRate.toFixed(0)}%
          </Text>
        </View>
      </View>
    </View>
  );

  const renderRegionCard = (stat: RegionStats) => (
    <View
      key={stat.region}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: colors.warning,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: colors.foreground,
              marginBottom: 4,
            }}
          >
            {stat.region}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: colors.muted,
            }}
          >
            {stat.sessionCount} sessões
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: colors.foreground,
              marginBottom: 2,
            }}
          >
            {stat.averageSymptomScore.toFixed(1)}
          </Text>
          <Text
            style={{
              fontSize: 9,
              color: colors.muted,
            }}
          >
            Score médio
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
      <View style={{ gap: 20 }}>
        {/* Título e Botão de Exportação */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.foreground,
                marginBottom: 4,
              }}
            >
              Dashboard de Efetividade
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
              }}
            >
              Análise de resultados por protocolo e região
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleExportReport}
            disabled={exporting}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 6,
              opacity: exporting ? 0.6 : 1,
            }}
          >
            {exporting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}
              >
                📄 Exportar
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Métricas Gerais */}
        <View style={{ gap: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.foreground,
            }}
          >
            Resumo Geral
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {renderMetricCard(
              'Sessões',
              generalMetrics.totalSessions,
              '',
              colors.primary
            )}
            {renderMetricCard(
              'Concluídas',
              generalMetrics.completedSessions,
              '',
              colors.success
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {renderMetricCard(
              'Taxa Conclusão',
              generalMetrics.completionRate,
              '%',
              colors.warning
            )}
            {renderMetricCard(
              'Planos Ativos',
              generalMetrics.activePlans,
              '',
              colors.primary
            )}
          </View>
        </View>

        {/* Efetividade por Protocolo */}
        {protocolStats.length > 0 && (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: colors.foreground,
              }}
            >
              Efetividade por Protocolo
            </Text>
            {protocolStats.map(stat => renderProtocolCard(stat))}
          </View>
        )}

        {/* Análise por Região */}
        {regionStats.length > 0 && (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: colors.foreground,
              }}
            >
              Análise por Região Cerebral
            </Text>
            {regionStats.map(stat => renderRegionCard(stat))}
          </View>
        )}

        {/* Mensagem vazia */}
        {protocolStats.length === 0 && regionStats.length === 0 && (
          <View
            style={{
              backgroundColor: colors.surface,
              padding: 24,
              borderRadius: 8,
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.muted,
              }}
            >
              Sem dados disponíveis
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                textAlign: 'center',
              }}
            >
              Crie planos e sessões para visualizar análises de efetividade
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
