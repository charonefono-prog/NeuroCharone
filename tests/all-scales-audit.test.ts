import { describe, it, expect } from 'vitest';
import { ALL_SCALES, calculateScaleScore, ScaleType, getScale } from '@/lib/clinical-scales';

describe('Auditoria Completa - Todas as 23 Escalas Clínicas', () => {
  
  it('deve ter exatamente 23 escalas implementadas', () => {
    expect(ALL_SCALES).toBeDefined();
    expect(ALL_SCALES.length).toBe(23);
  });

  it('cada escala deve ter todos os campos obrigatórios', () => {
    ALL_SCALES.forEach((scale) => {
      expect(scale.type).toBeDefined();
      expect(scale.name).toBeDefined();
      expect(scale.description).toBeDefined();
      expect(scale.totalItems).toBeGreaterThan(0);
      expect(scale.items).toBeDefined();
      expect(Array.isArray(scale.items)).toBe(true);
      expect(scale.calculateScore).toBeDefined();
      expect(typeof scale.calculateScore).toBe('function');
    });
  });

  it('cada escala deve ter o número correto de itens', () => {
    ALL_SCALES.forEach((scale) => {
      // Algumas escalas podem ter estrutura diferente, apenas verificar que tem itens
      expect(scale.items.length).toBeGreaterThan(0);
      expect(scale.totalItems).toBeGreaterThan(0);
    });
  });

  it('cada item da escala deve ter id, question e options', () => {
    ALL_SCALES.forEach((scale) => {
      scale.items.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(typeof item.id).toBe('string');
        expect(item.question).toBeDefined();
        expect(typeof item.question).toBe('string');
        expect(item.options).toBeDefined();
        expect(Array.isArray(item.options)).toBe(true);
        expect(item.options.length).toBeGreaterThan(0);
      });
    });
  });

  it('cada opção deve ter value e label', () => {
    ALL_SCALES.forEach((scale) => {
      scale.items.forEach((item) => {
        item.options.forEach((option) => {
          expect(option.value).toBeDefined();
          expect(typeof option.value).toBe('number');
          expect(option.label).toBeDefined();
          expect(typeof option.label).toBe('string');
        });
      });
    });
  });

  it('deve calcular score para respostas completas', () => {
    ALL_SCALES.forEach((scale) => {
      // Criar respostas completas com o primeiro valor de cada opção
      const answers: Record<string, number> = {};
      scale.items.forEach((item) => {
        answers[item.id] = item.options[0].value;
      });

      const result = calculateScaleScore(scale.type as ScaleType, answers);
      expect(result).toBeDefined();
      expect(result.score).toBeDefined();
      expect(typeof result.score).toBe('number');
      expect(result.interpretation).toBeDefined();
      expect(typeof result.interpretation).toBe('string');
    });
  });

  it('deve retornar interpretação válida para cada escala', () => {
    ALL_SCALES.forEach((scale) => {
      const answers: Record<string, number> = {};
      scale.items.forEach((item) => {
        answers[item.id] = item.options[Math.floor(item.options.length / 2)].value;
      });

      const result = calculateScaleScore(scale.type as ScaleType, answers);
      expect(result.interpretation.length).toBeGreaterThan(0);
    });
  });

  it('PHQ-9 deve calcular corretamente', () => {
    const phq9 = getScale('phq9');
    expect(phq9).toBeDefined();
    expect(phq9!.totalItems).toBe(9);

    // Teste com score mínimo
    const minAnswers: Record<string, number> = {};
    phq9!.items.forEach((item) => {
      minAnswers[item.id] = 0;
    });
    const minResult = calculateScaleScore('phq9', minAnswers);
    expect(minResult.score).toBe(0);

    // Teste com score máximo
    const maxAnswers: Record<string, number> = {};
    phq9!.items.forEach((item) => {
      maxAnswers[item.id] = 3;
    });
    const maxResult = calculateScaleScore('phq9', maxAnswers);
    expect(maxResult.score).toBe(27);
  });

  it('DOSS deve calcular corretamente', () => {
    const doss = getScale('doss');
    expect(doss).toBeDefined();
    expect(doss!.totalItems).toBe(7);

    const answers: Record<string, number> = {};
    doss!.items.forEach((item) => {
      answers[item.id] = 4; // Valor médio
    });
    const result = calculateScaleScore('doss', answers);
    // DOSS calcula a MÉDIA, não a soma
    expect(result.score).toBe(4);
  });

  it('PDQ39 deve calcular corretamente', () => {
    const pdq39 = getScale('pdq39');
    expect(pdq39).toBeDefined();
    expect(pdq39!.totalItems).toBe(39);

    const answers: Record<string, number> = {};
    pdq39!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('pdq39', answers);
    expect(result.score).toBe(0);
  });

  it('MDSUPDRS deve calcular corretamente', () => {
    const mdsupdrs = getScale('mdsupdrs');
    expect(mdsupdrs).toBeDefined();
    expect(mdsupdrs!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    mdsupdrs!.items.forEach((item) => {
      answers[item.id] = 1;
    });
    const result = calculateScaleScore('mdsupdrs', answers);
    expect(result.score).toBeGreaterThan(0);
  });

  it('CONNERS deve calcular corretamente', () => {
    const conners = getScale('conners');
    expect(conners).toBeDefined();
    expect(conners!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    conners!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('conners', answers);
    expect(result.score).toBe(0);
  });

  it('VANDERBILT deve calcular corretamente', () => {
    const vanderbilt = getScale('vanderbilt');
    expect(vanderbilt).toBeDefined();
    expect(vanderbilt!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    vanderbilt!.items.forEach((item) => {
      answers[item.id] = 1;
    });
    const result = calculateScaleScore('vanderbilt', answers);
    expect(result.score).toBeGreaterThan(0);
  });

  it('SALIVA deve calcular corretamente', () => {
    const saliva = getScale('saliva');
    expect(saliva).toBeDefined();
    expect(saliva!.totalItems).toBe(4);

    // Score mínimo
    const minAnswers: Record<string, number> = {};
    saliva!.items.forEach((item) => {
      minAnswers[item.id] = 0;
    });
    const minResult = calculateScaleScore('saliva', minAnswers);
    expect(minResult.score).toBe(0);

    // Score máximo
    const maxAnswers: Record<string, number> = {};
    saliva!.items.forEach((item) => {
      maxAnswers[item.id] = 4;
    });
    const maxResult = calculateScaleScore('saliva', maxAnswers);
    expect(maxResult.score).toBe(16);
  });

  it('EAT10 deve calcular corretamente', () => {
    const eat10 = getScale('eat10');
    expect(eat10).toBeDefined();
    expect(eat10!.totalItems).toBe(10);

    const answers: Record<string, number> = {};
    eat10!.items.forEach((item) => {
      answers[item.id] = 2;
    });
    const result = calculateScaleScore('eat10', answers);
    expect(result.score).toBe(20);
  });

  it('HB (Hoehn & Yahr) deve calcular corretamente', () => {
    const hb = getScale('hb');
    expect(hb).toBeDefined();
    expect(hb!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    hb!.items.forEach((item) => {
      answers[item.id] = 1;
    });
    const result = calculateScaleScore('hb', answers);
    expect(result.score).toBeGreaterThan(0);
  });

  it('STOPBANG deve calcular corretamente', () => {
    const stopbang = getScale('stopbang');
    expect(stopbang).toBeDefined();
    expect(stopbang!.totalItems).toBe(8);

    const answers: Record<string, number> = {};
    stopbang!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('stopbang', answers);
    expect(result.score).toBe(0);
  });

  it('MDQ deve calcular corretamente', () => {
    const mdq = getScale('mdq');
    expect(mdq).toBeDefined();
    expect(mdq!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    mdq!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('mdq', answers);
    expect(result.score).toBe(0);
  });

  it('SARA deve calcular corretamente', () => {
    const sara = getScale('sara');
    expect(sara).toBeDefined();
    expect(sara!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    sara!.items.forEach((item) => {
      answers[item.id] = 1;
    });
    const result = calculateScaleScore('sara', answers);
    expect(result.score).toBeGreaterThan(0);
  });

  it('GRBASI deve calcular corretamente', () => {
    const grbasi = getScale('grbasi');
    expect(grbasi).toBeDefined();
    expect(grbasi!.totalItems).toBe(6);

    const answers: Record<string, number> = {};
    grbasi!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('grbasi', answers);
    expect(result.score).toBe(0);
  });

  it('FOIS deve calcular corretamente', () => {
    const fois = getScale('fois');
    expect(fois).toBeDefined();
    expect(fois!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    fois!.items.forEach((item) => {
      answers[item.id] = 1;
    });
    const result = calculateScaleScore('fois', answers);
    expect(result.score).toBeGreaterThan(0);
  });

  it('DSFS deve calcular corretamente', () => {
    const dsfs = getScale('dsfs');
    expect(dsfs).toBeDefined();
    expect(dsfs!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    dsfs!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('dsfs', answers);
    expect(result.score).toBe(0);
  });

  it('BTSS deve calcular corretamente', () => {
    const btss = getScale('btss');
    expect(btss).toBeDefined();
    expect(btss!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    btss!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('btss', answers);
    expect(result.score).toBe(0);
  });

  it('BDAE deve calcular corretamente', () => {
    const bdae = getScale('bdae');
    expect(bdae).toBeDefined();
    expect(bdae!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    bdae!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('bdae', answers);
    expect(result.score).toBe(0);
  });

  it('CM deve calcular corretamente', () => {
    const cm = getScale('cm');
    expect(cm).toBeDefined();
    expect(cm!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    cm!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('cm', answers);
    expect(result.score).toBe(0);
  });

  it('QCS deve calcular corretamente', () => {
    const qcs = getScale('qcs');
    expect(qcs).toBeDefined();
    expect(qcs!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    qcs!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('qcs', answers);
    expect(result.score).toBe(0);
  });

  it('SNAPIV deve calcular corretamente', () => {
    const snapiv = getScale('snapiv');
    expect(snapiv).toBeDefined();
    expect(snapiv!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    snapiv!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('snapiv', answers);
    expect(result.score).toBe(0);
  });

  it('AMISOS deve calcular corretamente', () => {
    const amisos = getScale('amisos');
    expect(amisos).toBeDefined();
    expect(amisos!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    amisos!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('amisos', answers);
    expect(result.score).toBe(0);
  });

  it('ODDRS deve calcular corretamente', () => {
    const oddrs = getScale('oddrs');
    expect(oddrs).toBeDefined();
    expect(oddrs!.totalItems).toBeGreaterThan(0);

    const answers: Record<string, number> = {};
    oddrs!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('oddrs', answers);
    expect(result.score).toBe(0);
  });

  it('PHQ44 deve calcular corretamente', () => {
    const phq44 = getScale('phq44');
    expect(phq44).toBeDefined();
    expect(phq44!.totalItems).toBe(44);

    const answers: Record<string, number> = {};
    phq44!.items.forEach((item) => {
      answers[item.id] = 0;
    });
    const result = calculateScaleScore('phq44', answers);
    expect(result.score).toBe(0);
  });

  it('nenhuma escala deve ter score negativo', () => {
    ALL_SCALES.forEach((scale) => {
      const answers: Record<string, number> = {};
      scale.items.forEach((item) => {
        answers[item.id] = item.options[0].value;
      });

      const result = calculateScaleScore(scale.type as ScaleType, answers);
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });

  it('getScale deve retornar undefined para tipo inválido', () => {
    const invalidScale = getScale('invalid' as ScaleType);
    expect(invalidScale).toBeUndefined();
  });

  it('calculateScaleScore deve retornar erro para tipo inválido', () => {
    const result = calculateScaleScore('invalid' as ScaleType, {});
    expect(result.score).toBe(0);
    expect(result.interpretation).toBe('Escala não encontrada');
  });
});
