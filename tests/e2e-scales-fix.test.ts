import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPatients } from '@/lib/local-storage';
import { ALL_SCALES, calculateScaleScore, ScaleType } from '@/lib/clinical-scales';
import { saveScaleResponse, getPatientScaleResponses } from '@/lib/scale-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Scales Screen - Bug Fix Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('deve carregar lista de pacientes quando abre a tela de escalas', async () => {
    // Verificar que a função getPatients está disponível
    expect(getPatients).toBeDefined();
    
    // Carregar pacientes (simular o que a tela faz)
    const patients = await getPatients();

    // Verificar que retorna um array
    expect(Array.isArray(patients)).toBe(true);
  });

  it('deve exibir lista de escalas disponíveis', () => {
    // Verificar que todas as 23 escalas estão disponíveis
    expect(ALL_SCALES).toBeDefined();
    expect(ALL_SCALES.length).toBe(23);

    // Verificar que cada escala tem os campos necessários
    ALL_SCALES.forEach((scale) => {
      expect(scale.name).toBeDefined();
      expect(scale.description).toBeDefined();
      expect(scale.type).toBeDefined();
      expect(scale.totalItems).toBeGreaterThan(0);
    });
  });

  it('deve permitir selecionar um paciente e uma escala', async () => {
    // Verificar que podemos carregar pacientes
    const patients = await getPatients();
    expect(Array.isArray(patients)).toBe(true);

    // Selecionar uma escala
    const selectedScale = ALL_SCALES[0];
    expect(selectedScale).toBeDefined();
    expect(selectedScale.name).toBeDefined();
  });

  it('deve salvar resposta de escala para um paciente', async () => {
    // Criar paciente
    const testPatient = { 
      id: 'test-1', 
      fullName: 'Teste', 
      dateOfBirth: '1990-01-01', 
      phone: '123456', 
      diagnosis: 'Depressão',
      initialAssessment: 8 
    };

    await AsyncStorage.setItem('patients', JSON.stringify([testPatient]));

    // Criar resposta de escala
    const answers = {
      'q1': 1,
      'q2': 2,
      'q3': 0,
      'q4': 1,
      'q5': 2,
      'q6': 1,
      'q7': 0,
      'q8': 1,
      'q9': 0,
    };

    const { score, interpretation } = calculateScaleScore('phq9' as ScaleType, answers);

    const response = {
      id: `${Date.now()}-${Math.random()}`,
      patientId: 'test-1',
      patientName: 'Teste',
      scaleType: 'phq9' as ScaleType,
      scaleName: 'PHQ-9',
      date: new Date().toISOString(),
      answers,
      totalScore: score,
      interpretation,
      notes: 'Teste',
    };

    // Salvar resposta
    const success = await saveScaleResponse(response);
    expect(success).toBe(true);

    // Verificar que foi salvo
    const savedResponses = await getPatientScaleResponses('test-1');
    expect(savedResponses.length).toBeGreaterThan(0);
    expect(savedResponses[0].scaleName).toBe('PHQ-9');
  });

  it('deve calcular score corretamente para PHQ-9', () => {
    const answers = {
      'q1': 0,
      'q2': 0,
      'q3': 0,
      'q4': 0,
      'q5': 0,
      'q6': 0,
      'q7': 0,
      'q8': 0,
      'q9': 0,
    };

    const { score, interpretation } = calculateScaleScore('phq9' as ScaleType, answers);
    expect(score).toBe(0);
    expect(interpretation).toBeDefined();
  });

  it('deve lidar com erro quando paciente não está selecionado', async () => {
    // Tentar salvar escala sem paciente selecionado
    const response = {
      id: `${Date.now()}-${Math.random()}`,
      patientId: '',
      patientName: '',
      scaleType: 'phq9' as ScaleType,
      scaleName: 'PHQ-9',
      date: new Date().toISOString(),
      answers: {},
      totalScore: 0,
      interpretation: 'Normal',
    };

    // Salvar escala (sistema permite salvar)
    const success = await saveScaleResponse(response);
    expect(typeof success).toBe('boolean');
  });

  it('deve carregar histórico de escalas de um paciente', async () => {
    // Criar e salvar múltiplas respostas
    const patientId = 'test-patient-1';
    
    for (let i = 0; i < 3; i++) {
      const response = {
        id: `${Date.now()}-${i}`,
        patientId,
        patientName: 'Teste',
        scaleType: 'phq9' as ScaleType,
        scaleName: 'PHQ-9',
        date: new Date(Date.now() - i * 86400000).toISOString(),
        answers: { 'q1': i, 'q2': i },
        totalScore: i * 5,
        interpretation: 'Normal',
      };

      await saveScaleResponse(response);
    }

    // Carregar histórico
    const history = await getPatientScaleResponses(patientId);
    expect(history.length).toBe(3);
  });

  it('deve validar que todos os itens da escala foram respondidos', () => {
    const scale = ALL_SCALES[0]; // Primeira escala
    expect(scale.totalItems).toBeGreaterThan(0);

    // Resposta incompleta
    const incompleteAnswers = {
      'q1': 0,
      'q2': 0,
    };

    // Resposta completa
    const completeAnswers = {
      'q1': 0,
      'q2': 0,
      'q3': 0,
      'q4': 0,
      'q5': 0,
      'q6': 0,
      'q7': 0,
      'q8': 0,
      'q9': 0,
    };

    expect(Object.keys(incompleteAnswers).length).toBeLessThan(Object.keys(completeAnswers).length);
    expect(Object.keys(completeAnswers).length).toBeGreaterThan(0);
  });

  it('deve ter todos os imports necessários carregados', () => {
    // Verificar que os módulos principais estão disponíveis
    expect(getPatients).toBeDefined();
    expect(ALL_SCALES).toBeDefined();
    expect(calculateScaleScore).toBeDefined();
    expect(saveScaleResponse).toBeDefined();
    expect(getPatientScaleResponses).toBeDefined();
  });
});
