import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { getPatients, getSessions, type Patient, type Session } from '@/lib/local-storage';

// Re-export types for TypeScript
export type { Patient, Session };

interface TherapyComparison {
  patientId: string;
  patientName: string;
  laserSessions: number;
  tdcsSessions: number;
  laserImprovement: number;
  tdcsImprovement: number;
}

export default function ComparisonScreen() {
  const colors = useColors();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [comparisons, setComparisons] = useState<TherapyComparison[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const patientsData = await getPatients();
      const sessionsData = await getSessions();
      setPatients(patientsData);
      setSessions(sessionsData);
      calculateComparisons(patientsData, sessionsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const calculateComparisons = (patientsData: Patient[], sessionsData: Session[]) => {
    const comparisonData: TherapyComparison[] = patientsData.map((patient) => {
      const patientSessions = sessionsData.filter((s) => s.patientId === patient.id);
      
      // Separar sessões LASER e tDCS (primeira metade LASER, segunda metade tDCS)
      const laserSessions = patientSessions.slice(0, Math.floor(patientSessions.length / 2));
      const tdcsSessions = patientSessions.slice(Math.floor(patientSessions.length / 2));

      // Calcular melhora média baseada em symptomScore
      const laserImprovement = laserSessions.length > 0
        ? laserSessions.reduce((sum, s) => sum + (s.symptomScore || 0), 0) / laserSessions.length
        : 0;

      const tdcsImprovement = tdcsSessions.length > 0
        ? tdcsSessions.reduce((sum, s) => sum + (s.symptomScore || 0), 0) / tdcsSessions.length
        : 0;

      return {
        patientId: patient.id,
        patientName: patient.fullName,
        laserSessions: laserSessions.length,
        tdcsSessions: tdcsSessions.length,
        laserImprovement: Math.max(0, laserImprovement),
        tdcsImprovement: Math.max(0, tdcsImprovement),
      };
    });

    setComparisons(comparisonData.filter((c) => c.laserSessions > 0 || c.tdcsSessions > 0));
  };

  const getComparisonSummary = () => {
    const totalLaserSessions = comparisons.reduce((sum, c) => sum + c.laserSessions, 0);
    const totalTdcsSessions = comparisons.reduce((sum, c) => sum + c.tdcsSessions, 0);
    const avgLaserImprovement = comparisons.length > 0
      ? comparisons.reduce((sum, c) => sum + c.laserImprovement, 0) / comparisons.length
      : 0;
    const avgTdcsImprovement = comparisons.length > 0
      ? comparisons.reduce((sum, c) => sum + c.tdcsImprovement, 0) / comparisons.length
      : 0;

    return {
      totalLaserSessions,
      totalTdcsSessions,
      avgLaserImprovement: Math.max(0, avgLaserImprovement),
      avgTdcsImprovement: Math.max(0, avgTdcsImprovement),
      patientCount: comparisons.length,
    };
  };

  const renderSimpleChart = (title: string, data: Array<{ name: string; laser: number; tdcs: number }>) => {
    const maxValue = Math.max(...data.flatMap(d => [d.laser, d.tdcs]));
    
    return (
      <View style={{ marginVertical: 16 }}>
        <Text style={[styles.chartTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
          {data.map((item, idx) => (
            <View key={idx} style={styles.chartRow}>
              <Text style={[styles.chartLabel, { color: colors.muted, width: 60 }]}>
                {item.name}
              </Text>
              <View style={{ flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${maxValue > 0 ? (item.laser / maxValue) * 100 : 0}%`,
                        backgroundColor: '#FF6B6B',
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barValue, { color: '#FF6B6B', width: 30 }]}>
                  {item.laser.toFixed(0)}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${maxValue > 0 ? (item.tdcs / maxValue) * 100 : 0}%`,
                        backgroundColor: '#4ECDC4',
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barValue, { color: '#4ECDC4', width: 30 }]}>
                  {item.tdcs.toFixed(0)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const summary = getComparisonSummary();

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Comparação LASER vs tDCS
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Análise comparativa de resultados terapêuticos
          </Text>
        </View>

        {/* Summary Cards */}
        {comparisons.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                    Pacientes
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.primary }]}>
                    {summary.patientCount}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                    Sessões LASER
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#FF6B6B' }]}>
                    {summary.totalLaserSessions}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                    Sessões tDCS
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#4ECDC4' }]}>
                    {summary.totalTdcsSessions}
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                    Melhora LASER
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#FF6B6B' }]}>
                    {Math.max(0, summary.avgLaserImprovement).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                    Melhora tDCS
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#4ECDC4' }]}>
                    {Math.max(0, summary.avgTdcsImprovement).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                    Diferença
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      {
                        color:
                          summary.avgLaserImprovement > summary.avgTdcsImprovement
                            ? '#22C55E'
                            : '#EF4444',
                      },
                    ]}
                  >
                    {Math.abs(summary.avgLaserImprovement - summary.avgTdcsImprovement).toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* View Mode Toggle */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <Pressable
            onPress={() => setViewMode('list')}
            style={[
              styles.modeButton,
              {
                backgroundColor: viewMode === 'list' ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                {
                  color: viewMode === 'list' ? '#FFFFFF' : colors.foreground,
                },
              ]}
            >
              Lista
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('chart')}
            style={[
              styles.modeButton,
              {
                backgroundColor: viewMode === 'chart' ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                {
                  color: viewMode === 'chart' ? '#FFFFFF' : colors.foreground,
                },
              ]}
            >
              Gráficos
            </Text>
          </Pressable>
        </View>

        {/* Charts View */}
        {viewMode === 'chart' && comparisons.length > 0 && (
          <>
            {renderSimpleChart(
              'Comparação de Melhora (%)',
              comparisons.slice(0, 5).map(c => ({
                name: c.patientName.substring(0, 8),
                laser: c.laserImprovement,
                tdcs: c.tdcsImprovement,
              }))
            )}
            {renderSimpleChart(
              'Número de Sessões',
              comparisons.slice(0, 5).map(c => ({
                name: c.patientName.substring(0, 8),
                laser: c.laserSessions,
                tdcs: c.tdcsSessions,
              }))
            )}
          </>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <View>
            {comparisons.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={[styles.emptyText, { color: colors.muted }]}>
                  Nenhuma comparação disponível
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.muted }]}>
                  Registre sessões de LASER e tDCS para comparar resultados
                </Text>
              </View>
            ) : (
              comparisons.map((comparison) => (
                <View
                  key={comparison.patientId}
                  style={[
                    styles.comparisonCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={{ marginBottom: 12 }}>
                    <Text style={[styles.patientName, { color: colors.foreground }]}>
                      {comparison.patientName}
                    </Text>
                  </View>

                  <View style={styles.comparisonGrid}>
                    {/* LASER Column */}
                    <View style={styles.comparisonColumn}>
                      <Text style={[styles.therapyLabel, { color: '#FF6B6B' }]}>
                        LASER
                      </Text>
                      <View style={styles.comparisonData}>
                        <Text style={[styles.dataLabel, { color: colors.muted }]}>
                          Sessões
                        </Text>
                        <Text style={[styles.dataValue, { color: colors.foreground }]}>
                          {comparison.laserSessions}
                        </Text>
                      </View>
                      <View style={styles.comparisonData}>
                        <Text style={[styles.dataLabel, { color: colors.muted }]}>
                          Melhora
                        </Text>
                        <Text style={[styles.dataValue, { color: '#FF6B6B' }]}>
                          {Math.max(0, comparison.laserImprovement).toFixed(1)}%
                        </Text>
                      </View>
                    </View>

                    {/* Divider */}
                    <View style={[styles.columnDivider, { backgroundColor: colors.border }]} />

                    {/* tDCS Column */}
                    <View style={styles.comparisonColumn}>
                      <Text style={[styles.therapyLabel, { color: '#4ECDC4' }]}>
                        tDCS
                      </Text>
                      <View style={styles.comparisonData}>
                        <Text style={[styles.dataLabel, { color: colors.muted }]}>
                          Sessões
                        </Text>
                        <Text style={[styles.dataValue, { color: colors.foreground }]}>
                          {comparison.tdcsSessions}
                        </Text>
                      </View>
                      <View style={styles.comparisonData}>
                        <Text style={[styles.dataLabel, { color: colors.muted }]}>
                          Melhora
                        </Text>
                        <Text style={[styles.dataValue, { color: '#4ECDC4' }]}>
                          {Math.max(0, comparison.tdcsImprovement).toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Winner Badge */}
                  {(comparison.laserSessions > 0 || comparison.tdcsSessions > 0) && (
                    <View style={{ marginTop: 12 }}>
                      <Text style={[styles.winnerLabel, { color: colors.muted }]}>
                        Melhor resultado:
                      </Text>
                      <Text
                        style={[
                          styles.winner,
                          {
                            color:
                              comparison.laserImprovement > comparison.tdcsImprovement
                                ? '#FF6B6B'
                                : '#4ECDC4',
                          },
                        ]}
                      >
                        {comparison.laserImprovement > comparison.tdcsImprovement
                          ? 'LASER'
                          : comparison.tdcsImprovement > comparison.laserImprovement
                          ? 'tDCS'
                          : 'Equivalente'}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  barFill: {
    height: 20,
    borderRadius: 4,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '600',
  },
  comparisonCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  comparisonColumn: {
    flex: 1,
  },
  therapyLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  comparisonData: {
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  columnDivider: {
    width: 1,
  },
  winnerLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  winner: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});
