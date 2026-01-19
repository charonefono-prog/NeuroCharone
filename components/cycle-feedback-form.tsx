/**
 * Formulário de Feedback Pós-Ciclo
 * Coleta avaliação do paciente sobre o impacto do tratamento
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { saveCycleFeedback, type CycleFeedback } from '@/lib/feedback-service';

interface CycleFeedbackFormProps {
  visible: boolean;
  cycleId: string;
  patientId: string;
  onClose: () => void;
  onSuccess: (feedback: CycleFeedback) => void;
}

export function CycleFeedbackForm({
  visible,
  cycleId,
  patientId,
  onClose,
  onSuccess,
}: CycleFeedbackFormProps) {
  const colors = useColors();
  const [loading, setLoading] = useState(false);

  // Avaliações (1-10)
  const [symptomReduction, setSymptomReduction] = useState(5);
  const [painLevel, setPainLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [moodImprovement, setMoodImprovement] = useState(5);
  const [overallSatisfaction, setOverallSatisfaction] = useState(5);

  // Booleanos
  const [recommendToOthers, setRecommendToOthers] = useState(true);
  const [willingToContinue, setWillingToContinue] = useState(true);

  // Comparação
  const [comparedToPreviousCycle, setComparedToPreviousCycle] = useState<'better' | 'same' | 'worse' | 'first_cycle'>('first_cycle');

  // Textos
  const [positiveEffects, setPositiveEffects] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [suggestedChanges, setSuggestedChanges] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const feedback: CycleFeedback = {
        id: `feedback_${Date.now()}`,
        cycleId,
        patientId,
        createdAt: new Date().toISOString(),
        symptomReduction,
        painLevel,
        energyLevel,
        sleepQuality,
        moodImprovement,
        overallSatisfaction,
        recommendToOthers,
        willingToContinue,
        positiveEffects,
        sideEffects,
        additionalNotes,
        comparedToPreviousCycle,
        suggestedChanges,
      };

      await saveCycleFeedback(feedback);

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert('Sucesso', 'Feedback registrado com sucesso!');
      onSuccess(feedback);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar feedback:', error);
      Alert.alert('Erro', 'Falha ao salvar feedback. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const RatingSlider = ({
    label,
    value,
    onChange,
    description,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    description?: string;
  }) => (
    <View style={{ marginBottom: 20 }}>
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground }}>
          {label}
        </Text>
        {description && (
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
            {description}
          </Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => {
              onChange(num);
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
            style={{
              flex: 1,
              paddingVertical: 8,
              backgroundColor: value === num ? colors.primary : colors.surface,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: value === num ? colors.primary : colors.border,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: value === num ? '700' : '500',
                color: value === num ? '#FFFFFF' : colors.foreground,
              }}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <Text style={{ fontSize: 10, color: colors.muted }}>Pior</Text>
        <Text style={{ fontSize: 10, color: colors.muted }}>Melhor</Text>
      </View>
    </View>
  );

  const BooleanButton = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() => {
            onChange(true);
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            backgroundColor: value ? colors.success : colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: value ? colors.success : colors.border,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: value ? '700' : '500',
              color: value ? '#FFFFFF' : colors.foreground,
            }}
          >
            Sim
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onChange(false);
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            backgroundColor: !value ? colors.error : colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: !value ? colors.error : colors.border,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: !value ? '700' : '500',
              color: !value ? '#FFFFFF' : colors.foreground,
            }}
          >
            Não
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 16,
            paddingTop: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
            Avaliação do Ciclo
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1, padding: 16 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção 1: Avaliação de Sintomas */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 16 }}>
              📊 Avaliação de Sintomas
            </Text>

            <RatingSlider
              label="Redução de Sintomas"
              value={symptomReduction}
              onChange={setSymptomReduction}
              description="Como você avalia a redução de seus sintomas?"
            />

            <RatingSlider
              label="Nível de Dor"
              value={painLevel}
              onChange={setPainLevel}
              description="Qual é seu nível de dor agora? (1=Máxima, 10=Nenhuma)"
            />

            <RatingSlider
              label="Nível de Energia"
              value={energyLevel}
              onChange={setEnergyLevel}
              description="Como está seu nível de energia?"
            />

            <RatingSlider
              label="Qualidade do Sono"
              value={sleepQuality}
              onChange={setSleepQuality}
              description="Como está a qualidade do seu sono?"
            />

            <RatingSlider
              label="Melhora do Humor"
              value={moodImprovement}
              onChange={setMoodImprovement}
              description="Houve melhora no seu humor?"
            />
          </View>

          {/* Seção 2: Satisfação Geral */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 16 }}>
              😊 Satisfação Geral
            </Text>

            <RatingSlider
              label="Satisfação com o Tratamento"
              value={overallSatisfaction}
              onChange={setOverallSatisfaction}
              description="Qual é seu nível de satisfação geral?"
            />

            <BooleanButton
              label="Você recomendaria este tratamento a outras pessoas?"
              value={recommendToOthers}
              onChange={setRecommendToOthers}
            />

            <BooleanButton
              label="Você gostaria de continuar com o tratamento?"
              value={willingToContinue}
              onChange={setWillingToContinue}
            />
          </View>

          {/* Seção 3: Comparação */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>
              📈 Comparação com Ciclo Anterior
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {['first_cycle', 'better', 'same', 'worse'].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setComparedToPreviousCycle(option as any);
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor:
                      comparedToPreviousCycle === option ? colors.primary : colors.surface,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor:
                      comparedToPreviousCycle === option ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: comparedToPreviousCycle === option ? '700' : '500',
                      color:
                        comparedToPreviousCycle === option ? '#FFFFFF' : colors.foreground,
                    }}
                  >
                    {option === 'first_cycle'
                      ? 'Primeiro Ciclo'
                      : option === 'better'
                        ? 'Melhor'
                        : option === 'same'
                          ? 'Igual'
                          : 'Pior'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Seção 4: Observações */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>
              💬 Observações
            </Text>

            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 6 }}>
              Efeitos Positivos Observados
            </Text>
            <TextInput
              placeholder="Ex: Redução de dor, melhor sono, mais energia..."
              value={positiveEffects}
              onChangeText={setPositiveEffects}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.foreground,
                marginBottom: 16,
                textAlignVertical: 'top',
              }}
              placeholderTextColor={colors.muted}
            />

            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 6 }}>
              Efeitos Colaterais (se houver)
            </Text>
            <TextInput
              placeholder="Descreva qualquer efeito colateral observado..."
              value={sideEffects}
              onChangeText={setSideEffects}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.foreground,
                marginBottom: 16,
                textAlignVertical: 'top',
              }}
              placeholderTextColor={colors.muted}
            />

            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 6 }}>
              Sugestões de Mudanças
            </Text>
            <TextInput
              placeholder="Sugestões para melhorar o próximo ciclo..."
              value={suggestedChanges}
              onChangeText={setSuggestedChanges}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.foreground,
                marginBottom: 16,
                textAlignVertical: 'top',
              }}
              placeholderTextColor={colors.muted}
            />

            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 6 }}>
              Notas Adicionais
            </Text>
            <TextInput
              placeholder="Qualquer informação adicional que deseje compartilhar..."
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.foreground,
                marginBottom: 16,
                textAlignVertical: 'top',
              }}
              placeholderTextColor={colors.muted}
            />
          </View>
        </ScrollView>

        {/* Footer com Botões */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            disabled={loading}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.primary,
              alignItems: 'center',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: colors.primary,
              alignItems: 'center',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
              {loading ? 'Salvando...' : 'Enviar Feedback'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
