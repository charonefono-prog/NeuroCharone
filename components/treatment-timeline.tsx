import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import type { Session, TherapeuticPlan } from '@/lib/local-storage';

interface TimelineEvent {
  id: string;
  date: string;
  protocol: string;
  region: string;
  points: string[];
  status: 'completed' | 'scheduled' | 'cancelled';
  notes?: string;
}

interface TreatmentTimelineProps {
  sessions: Session[];
  plans: TherapeuticPlan[];
}

export function TreatmentTimeline({ sessions, plans }: TreatmentTimelineProps) {
  const colors = useColors();

  // Converter sessões em eventos de timeline
  const events: TimelineEvent[] = sessions
    .map(session => {
      const plan = plans.find(p => p.id === session.planId);
      const isCompleted = new Date(session.sessionDate) < new Date();
      return {
        id: session.id,
        date: new Date(session.sessionDate).toLocaleDateString('pt-BR'),
        protocol: plan?.objective || 'Protocolo desconhecido',
        region: plan?.targetRegions?.[0] || 'N/A',
        points: plan?.targetPoints || [],
        status: isCompleted ? 'completed' : 'scheduled' as 'completed' | 'scheduled' | 'cancelled',
        notes: session.observations,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'scheduled':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓ Concluída';
      case 'scheduled':
        return '⏱ Agendada';
      case 'cancelled':
        return '✕ Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  const renderTimelineEvent = ({ item }: { item: TimelineEvent }) => (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 20,
        paddingLeft: 16,
      }}
    >
      {/* Linha vertical */}
      <View
        style={{
          width: 3,
          backgroundColor: getStatusColor(item.status),
          marginRight: 16,
          borderRadius: 2,
        }}
      />

      {/* Card do evento */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.surface,
          borderRadius: 8,
          padding: 14,
          borderLeftWidth: 4,
          borderLeftColor: getStatusColor(item.status),
        }}
      >
        {/* Header do evento */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.foreground,
            }}
          >
            {item.date}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: getStatusColor(item.status),
              backgroundColor: getStatusColor(item.status) + '15',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>

        {/* Protocolo */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: colors.primary,
            marginBottom: 6,
          }}
        >
          {item.protocol}
        </Text>

        {/* Região */}
        <Text
          style={{
            fontSize: 12,
            color: colors.muted,
            marginBottom: 8,
          }}
        >
          Região: <Text style={{ fontWeight: '600' }}>{item.region}</Text>
        </Text>

        {/* Pontos */}
        {item.points.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 11,
                color: colors.muted,
                marginBottom: 4,
              }}
            >
              Pontos estimulados:
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              {item.points.slice(0, 6).map((point, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: colors.primary + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: colors.primary,
                    }}
                  >
                    {point}
                  </Text>
                </View>
              ))}
              {item.points.length > 6 && (
                <View
                  style={{
                    backgroundColor: colors.muted + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: colors.muted,
                    }}
                  >
                    +{item.points.length - 6} mais
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Notas */}
        {item.notes && (
          <View
            style={{
              backgroundColor: colors.background,
              padding: 8,
              borderRadius: 4,
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: colors.muted,
                fontStyle: 'italic',
              }}
            >
              {item.notes}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (events.length === 0) {
    return (
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
          Nenhuma sessão registrada
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.muted,
          }}
        >
          As sessões aparecerão aqui conforme forem agendadas
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: colors.foreground,
            marginBottom: 12,
          }}
        >
          Histórico de Tratamentos
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.muted,
            marginBottom: 16,
          }}
        >
          Total de sessões: <Text style={{ fontWeight: '600' }}>{events.length}</Text>
        </Text>
      </View>

      <FlatList
        data={events}
        renderItem={renderTimelineEvent}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
    </View>
  );
}
