import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useColors } from '@/hooks/use-colors';

export interface FacialParalysisData {
  grade: number;
  symmetryScore: number;
  eyeFunctionScore: number;
  mouthFunctionScore: number;
  overallScore: number;
}

export function FacialParalysisAnalysis({ data }: { data: FacialParalysisData }) {
  const colors = useColors();

  const getGradeDescription = (grade: number): string => {
    const descriptions: Record<number, string> = {
      1: 'Normal - Função facial normal em todas as áreas',
      2: 'Disfunção Leve - Fraqueza notável apenas à inspeção',
      3: 'Disfunção Moderada - Diferença óbvia mas não desfigurante',
      4: 'Disfunção Moderadamente Severa - Fraqueza óbvia e/ou assimetria desfigurante',
      5: 'Disfunção Severa - Apenas uma movimentação discretamente perceptível',
      6: 'Paralisia Total - Nenhum movimento',
    };
    return descriptions[grade] || 'Desconhecido';
  };

  const getRecommendations = (grade: number): string[] => {
    const recommendations: Record<number, string[]> = {
      1: [
        'Acompanhamento regular',
        'Monitorar para mudanças',
        'Manutenção da função normal',
      ],
      2: [
        'Fisioterapia facial leve',
        'Exercícios de mobilidade',
        'Acompanhamento mensal',
        'Considerar neuromodulação se progressivo',
      ],
      3: [
        'Fisioterapia facial intensiva',
        'Exercícios de simetria',
        'Terapia de neuromodulação',
        'Acompanhamento quinzenal',
        'Possível tratamento farmacológico',
      ],
      4: [
        'Neuromodulação intensiva',
        'Fisioterapia diária',
        'Avaliação oftalmológica (risco de ceratite)',
        'Proteção ocular (óculos, lubrificante)',
        'Acompanhamento semanal',
      ],
      5: [
        'Neuromodulação agressiva',
        'Fisioterapia especializada',
        'Proteção ocular rigorosa',
        'Possível cirurgia de reabilitação',
        'Acompanhamento intensivo (2x/semana)',
      ],
      6: [
        'Avaliação urgente de causa',
        'Proteção ocular máxima',
        'Neuromodulação intensiva',
        'Possível cirurgia de reabilitação',
        'Acompanhamento diário',
        'Encaminhamento para especialista',
      ],
    };
    return recommendations[grade] || [];
  };

  const getSeverityColor = (score: number): string => {
    if (score <= 6) return '#22c55e'; // green
    if (score <= 12) return '#eab308'; // yellow
    if (score <= 18) return '#f97316'; // orange
    if (score <= 24) return '#ef4444'; // red
    return '#991b1b'; // dark red
  };

  const getSeverityLabel = (score: number): string => {
    if (score <= 6) return 'Ausente/Mínima';
    if (score <= 12) return 'Leve';
    if (score <= 18) return 'Moderada';
    if (score <= 24) return 'Moderadamente Severa';
    return 'Severa';
  };

  const ScoreBar = ({ label, score, max = 36 }: { label: string; score: number; max?: number }) => {
    const percentage = (score / max) * 100;
    const barColor = getSeverityColor(score);

    return (
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground }}>
            {label}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: barColor }}>
            {score}/{max}
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
              width: `${percentage}%`,
              backgroundColor: barColor,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 20 }}>
        {/* Título */}
        <View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground }}>
            Análise de Paralisia Facial
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
            Avaliação baseada na Escala de House-Brackmann e Sakiva
          </Text>
        </View>

        {/* Score Geral */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 8 }}>
            SCORE GERAL
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: getSeverityColor(data.overallScore) + '20',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  color: getSeverityColor(data.overallScore),
                }}
              >
                {data.overallScore}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                {getSeverityLabel(data.overallScore)}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                {getGradeDescription(data.grade)}
              </Text>
            </View>
          </View>
        </View>

        {/* Componentes Avaliados */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 16 }}>
            Componentes Avaliados
          </Text>
          <ScoreBar label="Simetria Facial" score={data.symmetryScore} max={12} />
          <ScoreBar label="Função Ocular" score={data.eyeFunctionScore} max={12} />
          <ScoreBar label="Função Oral" score={data.mouthFunctionScore} max={12} />
        </View>

        {/* Recomendações */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>
            Recomendações de Tratamento
          </Text>
          <View style={{ gap: 8 }}>
            {getRecommendations(data.grade).map((rec, idx) => (
              <View key={idx} style={{ flexDirection: 'row', gap: 12 }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: colors.primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
                    {idx + 1}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: colors.foreground,
                    lineHeight: 18,
                  }}
                >
                  {rec}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notas Clínicas */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>
            Notas Clínicas
          </Text>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
              • A paralisia facial em Parkinson frequentemente melhora com neuromodulação
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
              • Proteção ocular é essencial para evitar ceratite
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
              • Fisioterapia facial acelera recuperação
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
              • Acompanhamento regular é crucial para monitorar progressão
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
