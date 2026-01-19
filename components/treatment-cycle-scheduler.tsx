import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Platform, Alert } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import type { TherapeuticPlan, Session, Patient } from '@/lib/local-storage';
import * as Haptics from 'expo-haptics';
import { exportCycleToPDF, shareCycleReport } from '@/lib/cycle-pdf-export';
import type { CycleReportData } from '@/lib/cycle-report-generator';

interface TreatmentCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  protocol: string;
  frequency: number;
  expectedSessions: number;
  notes: string;
  status: 'planned' | 'active' | 'completed';
}

interface TreatmentCycleSchedulerProps {
  currentPlan: TherapeuticPlan | null;
  sessions: Session[];
  onCreateCycle: (cycle: TreatmentCycle) => void;
}

export function TreatmentCycleScheduler({
  currentPlan,
  sessions,
  onCreateCycle,
}: TreatmentCycleSchedulerProps) {
  const colors = useColors();
  const [showModal, setShowModal] = useState(false);
  const [cycleName, setCycleName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationWeeks, setDurationWeeks] = useState('4');
  const [frequency, setFrequency] = useState('3');
  const [notes, setNotes] = useState('');

  const suggestedCycles = useMemo(() => {
    if (!currentPlan || sessions.length === 0) return [];

    const lastSession = new Date(sessions[sessions.length - 1].sessionDate);
    const suggestions: TreatmentCycle[] = [];

    // Sugerir próximo ciclo baseado no histórico
    const cycleStartDate = new Date(lastSession);
    cycleStartDate.setDate(cycleStartDate.getDate() + 7); // Uma semana após última sessão

    for (let i = 0; i < 3; i++) {
      const cycleEnd = new Date(cycleStartDate);
      cycleEnd.setDate(cycleEnd.getDate() + 28 + i * 7); // 4, 5, 6 semanas

      const weeksCount = Math.ceil((cycleEnd.getTime() - cycleStartDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const expectedSessions = weeksCount * currentPlan.frequency;

      suggestions.push({
        id: `cycle_${i}`,
        name: `Ciclo ${i + 1} - ${weeksCount} semanas`,
        startDate: cycleStartDate.toISOString().split('T')[0],
        endDate: cycleEnd.toISOString().split('T')[0],
        protocol: currentPlan.objective,
        frequency: currentPlan.frequency,
        expectedSessions,
        notes: `Continuação do protocolo ${currentPlan.objective}`,
        status: 'planned',
      });
    }

    return suggestions;
  }, [currentPlan, sessions]);

  const handleCreateCycle = () => {
    if (!cycleName.trim() || !startDate || !durationWeeks) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + parseInt(durationWeeks) * 7);

    const expectedSessions = parseInt(durationWeeks) * parseInt(frequency);

    const newCycle: TreatmentCycle = {
      id: `cycle_${Date.now()}`,
      name: cycleName,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      protocol: currentPlan?.objective || 'Personalizado',
      frequency: parseInt(frequency),
      expectedSessions,
      notes,
      status: 'planned',
    };

    onCreateCycle(newCycle);

    // Reset form
    setCycleName('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDurationWeeks('4');
    setFrequency('3');
    setNotes('');
    setShowModal(false);

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const renderCycleCard = (cycle: TreatmentCycle, isSuggestion: boolean = false) => {
    const startDate = new Date(cycle.startDate);
    const endDate = new Date(cycle.endDate);
    const daysTotal = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const weeksTotal = Math.ceil(daysTotal / 7);

    const statusColor = {
      planned: colors.warning,
      active: colors.primary,
      completed: colors.success,
    }[cycle.status];

    return (
      <TouchableOpacity
        key={cycle.id}
        activeOpacity={0.7}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: statusColor,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: colors.foreground,
                marginBottom: 4,
              }}
            >
              {cycle.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
              }}
            >
              {cycle.protocol}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: statusColor + '20',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: statusColor,
                textTransform: 'capitalize',
              }}
            >
              {cycle.status === 'planned' ? 'Planejado' : cycle.status === 'active' ? 'Ativo' : 'Concluído'}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 10,
                color: colors.muted,
                marginBottom: 2,
              }}
            >
              Duração
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: colors.foreground,
              }}
            >
              {weeksTotal}s
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 10,
                color: colors.muted,
                marginBottom: 2,
              }}
            >
              Frequência
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: colors.foreground,
              }}
            >
              {cycle.frequency}x/sem
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 10,
                color: colors.muted,
                marginBottom: 2,
              }}
            >
              Sessões
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: colors.foreground,
              }}
            >
              {cycle.expectedSessions}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 12, gap: 6 }}>
          <Text
            style={{
              fontSize: 11,
              color: colors.muted,
            }}
          >
            📅 {startDate.toLocaleDateString('pt-BR')} até {endDate.toLocaleDateString('pt-BR')}
          </Text>
          {cycle.notes && (
            <Text
              style={{
                fontSize: 11,
                color: colors.muted,
                fontStyle: 'italic',
              }}
            >
              {cycle.notes}
            </Text>
          )}
        </View>

        {isSuggestion && (
          <TouchableOpacity
            onPress={() => {
              setCycleName(cycle.name);
              setStartDate(cycle.startDate);
              const weeks = Math.ceil((new Date(cycle.endDate).getTime() - new Date(cycle.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000));
              setDurationWeeks(weeks.toString());
              setFrequency(cycle.frequency.toString());
              setNotes(cycle.notes);
              setShowModal(true);
            }}
            style={{
              marginTop: 12,
              backgroundColor: colors.primary,
              paddingVertical: 8,
              borderRadius: 6,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#FFFFFF',
              }}
            >
              Usar Sugestão
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={{ gap: 20 }}>
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
            Agendador de Ciclos
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
            }}
          >
            Planeje próximos ciclos de tratamento
          </Text>
        </View>

        {/* Botão Criar Ciclo */}
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#FFFFFF',
            }}
          >
            + Novo Ciclo
          </Text>
        </TouchableOpacity>

        {/* Ciclos Sugeridos */}
        {suggestedCycles.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              Ciclos Sugeridos
            </Text>
            {suggestedCycles.map(cycle => renderCycleCard(cycle, true))}
          </View>
        )}

        {/* Modal de Criação */}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                paddingBottom: 40,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: colors.foreground,
                  }}
                >
                  Novo Ciclo de Tratamento
                </Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text
                    style={{
                      fontSize: 24,
                      color: colors.muted,
                    }}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 400, marginBottom: 20 }}>
                {/* Nome */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: colors.muted,
                      marginBottom: 6,
                    }}
                  >
                    Nome do Ciclo
                  </Text>
                  <TextInput
                    value={cycleName}
                    onChangeText={setCycleName}
                    placeholder="Ex: Ciclo de Manutenção"
                    placeholderTextColor={colors.muted}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: 12,
                      color: colors.foreground,
                      fontSize: 14,
                    }}
                  />
                </View>

                {/* Data Início */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: colors.muted,
                      marginBottom: 6,
                    }}
                  >
                    Data de Início
                  </Text>
                  <TextInput
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.muted}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: 12,
                      color: colors.foreground,
                      fontSize: 14,
                    }}
                  />
                </View>

                {/* Duração */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: colors.muted,
                      marginBottom: 6,
                    }}
                  >
                    Duração (semanas)
                  </Text>
                  <TextInput
                    value={durationWeeks}
                    onChangeText={setDurationWeeks}
                    placeholder="4"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: 12,
                      color: colors.foreground,
                      fontSize: 14,
                    }}
                  />
                </View>

                {/* Frequência */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: colors.muted,
                      marginBottom: 6,
                    }}
                  >
                    Frequência (vezes por semana)
                  </Text>
                  <TextInput
                    value={frequency}
                    onChangeText={setFrequency}
                    placeholder="3"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: 12,
                      color: colors.foreground,
                      fontSize: 14,
                    }}
                  />
                </View>

                {/* Notas */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: colors.muted,
                      marginBottom: 6,
                    }}
                  >
                    Notas (opcional)
                  </Text>
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Adicione observações..."
                    placeholderTextColor={colors.muted}
                    multiline
                    numberOfLines={3}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: 12,
                      color: colors.foreground,
                      fontSize: 14,
                      textAlignVertical: 'top',
                    }}
                  />
                </View>
              </ScrollView>

              {/* Botões */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.foreground,
                    }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreateCycle}
                  style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#FFFFFF',
                    }}
                  >
                    Criar Ciclo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
