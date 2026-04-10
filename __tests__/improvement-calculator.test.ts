import { describe, it, expect } from "vitest";
import {
  isInverseScale,
  isDirectScale,
  calculateAbsoluteImprovement,
  calculateImprovementPercentage,
  calculateVariation,
  calculateVariationPercentage,
  hasImproved,
  getScoreDirection,
  calculateDisplayImprovement,
  INVERSE_SCALES,
  DIRECT_SCALES,
} from "../lib/improvement-calculator";

/**
 * Testes abrangentes para o módulo de cálculo de melhora.
 * 
 * REGRA FUNDAMENTAL:
 * - Escalas INVERSAS (18): score alto = pior → melhora = score DIMINUI
 * - Escalas DIRETAS (5): score alto = melhor → melhora = score AUMENTA
 * 
 * NUNCA deve haver valores negativos em porcentagens de melhora.
 */

describe("Classificação de Escalas", () => {
  it("deve ter 18 escalas inversas", () => {
    expect(INVERSE_SCALES).toHaveLength(18);
  });

  it("deve ter 5 escalas diretas", () => {
    expect(DIRECT_SCALES).toHaveLength(5);
  });

  it("deve ter 23 escalas no total", () => {
    expect(INVERSE_SCALES.length + DIRECT_SCALES.length).toBe(23);
  });

  it("não deve ter escalas duplicadas", () => {
    const all = [...INVERSE_SCALES, ...DIRECT_SCALES];
    const unique = new Set(all);
    expect(unique.size).toBe(all.length);
  });

  // Verificar cada escala inversa individualmente
  const inverseScales = [
    "eat10", "grbasi", "phq9", "phq44", "mdq", "conners",
    "vanderbilt", "oddrs", "snapiv", "mdsupdrs", "amisos",
    "dsfs", "stopbang", "sara", "pdq39", "saliva", "btss", "hb"
  ];

  inverseScales.forEach((scale) => {
    it(`${scale} deve ser classificada como INVERSA`, () => {
      expect(isInverseScale(scale)).toBe(true);
      expect(isDirectScale(scale)).toBe(false);
    });
  });

  // Verificar cada escala direta individualmente
  const directScales = ["doss", "bdae", "cm", "qcs", "fois"];

  directScales.forEach((scale) => {
    it(`${scale} deve ser classificada como DIRETA`, () => {
      expect(isDirectScale(scale)).toBe(true);
      expect(isInverseScale(scale)).toBe(false);
    });
  });
});

describe("calculateImprovementPercentage - Escalas INVERSAS", () => {
  // EAT-10: 0=sem risco, 40=risco severo (INVERSA)
  describe("EAT-10 (inversa)", () => {
    it("38→0 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("eat10", 38, 0);
      expect(result).toBe(100);
    });

    it("38→19 deve ser 50% de melhora", () => {
      const result = calculateImprovementPercentage("eat10", 38, 19);
      expect(result).toBe(50);
    });

    it("38→38 deve ser 0% (sem alteração)", () => {
      const result = calculateImprovementPercentage("eat10", 38, 38);
      expect(result).toBe(0);
    });

    it("0→38 deve ser 0% (piorou, não melhorou)", () => {
      const result = calculateImprovementPercentage("eat10", 0, 38);
      expect(result).toBe(0);
    });

    it("19→38 deve ser 0% (piorou, NUNCA negativo)", () => {
      const result = calculateImprovementPercentage("eat10", 19, 38);
      expect(result).toBe(0);
    });

    it("10→5 deve ser 50% de melhora", () => {
      const result = calculateImprovementPercentage("eat10", 10, 5);
      expect(result).toBe(50);
    });
  });

  // GRBASI: 0%=voz normal, 100%=alteração severa (INVERSA)
  describe("GRBASI (inversa)", () => {
    it("100→0 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("grbasi", 100, 0);
      expect(result).toBe(100);
    });

    it("80→40 deve ser 50% de melhora", () => {
      const result = calculateImprovementPercentage("grbasi", 80, 40);
      expect(result).toBe(50);
    });

    it("40→80 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("grbasi", 40, 80);
      expect(result).toBe(0);
    });
  });

  // PHQ-9: 0=sem depressão, 27=severa (INVERSA)
  describe("PHQ-9 (inversa)", () => {
    it("27→0 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("phq9", 27, 0);
      expect(result).toBe(100);
    });

    it("20→10 deve ser 50% de melhora", () => {
      const result = calculateImprovementPercentage("phq9", 20, 10);
      expect(result).toBe(50);
    });

    it("10→20 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("phq9", 10, 20);
      expect(result).toBe(0);
    });
  });

  // HB: 1=normal, 6=paralisia total (INVERSA)
  describe("HB (inversa)", () => {
    it("6→1 deve mostrar melhora", () => {
      const result = calculateImprovementPercentage("hb", 6, 1);
      expect(result).toBeGreaterThan(0);
    });

    it("1→6 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("hb", 1, 6);
      expect(result).toBe(0);
    });

    it("4→2 deve ser 50% de melhora", () => {
      const result = calculateImprovementPercentage("hb", 4, 2);
      expect(result).toBe(50);
    });
  });

  // BTSS: 0=sem zumbido, 24=severo (INVERSA)
  describe("BTSS (inversa)", () => {
    it("24→0 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("btss", 24, 0);
      expect(result).toBe(100);
    });

    it("0→24 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("btss", 0, 24);
      expect(result).toBe(0);
    });

    it("20→10 deve ser 50% de melhora", () => {
      const result = calculateImprovementPercentage("btss", 20, 10);
      expect(result).toBe(50);
    });
  });

  // SARA: 0=sem ataxia, 40=severa (INVERSA)
  describe("SARA (inversa)", () => {
    it("40→0 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("sara", 40, 0);
      expect(result).toBe(100);
    });

    it("30→15 deve ser 50% de melhora", () => {
      const result = calculateImprovementPercentage("sara", 30, 15);
      expect(result).toBe(50);
    });

    it("15→30 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("sara", 15, 30);
      expect(result).toBe(0);
    });
  });

  // STOP-Bang: 0=baixo risco, 8=alto risco (INVERSA)
  describe("STOP-Bang (inversa)", () => {
    it("8→0 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("stopbang", 8, 0);
      expect(result).toBe(100);
    });

    it("0→8 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("stopbang", 0, 8);
      expect(result).toBe(0);
    });
  });

  // PDQ-39: 0%=QV excelente, 100%=prejudicada (INVERSA)
  describe("PDQ-39 (inversa)", () => {
    it("80→40 deve ser 50% de melhora", () => {
      const result = calculateImprovementPercentage("pdq39", 80, 40);
      expect(result).toBe(50);
    });

    it("40→80 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("pdq39", 40, 80);
      expect(result).toBe(0);
    });
  });
});

describe("calculateImprovementPercentage - Escalas DIRETAS", () => {
  // DOSS: 1=disfagia severa, 7=função normal (DIRETA)
  describe("DOSS (direta)", () => {
    it("1→7 deve mostrar melhora", () => {
      const result = calculateImprovementPercentage("doss", 1, 7);
      expect(result).toBeGreaterThan(0);
    });

    it("3→6 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("doss", 3, 6);
      expect(result).toBe(100);
    });

    it("7→1 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("doss", 7, 1);
      expect(result).toBe(0);
    });

    it("7→7 deve ser 0% (sem alteração)", () => {
      const result = calculateImprovementPercentage("doss", 7, 7);
      expect(result).toBe(0);
    });
  });

  // BDAE: 0=afasia severa, 25=sem afasia (DIRETA)
  describe("BDAE (direta)", () => {
    it("5→25 deve mostrar melhora", () => {
      const result = calculateImprovementPercentage("bdae", 5, 25);
      expect(result).toBeGreaterThan(0);
    });

    it("10→20 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("bdae", 10, 20);
      expect(result).toBe(100);
    });

    it("25→5 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("bdae", 25, 5);
      expect(result).toBe(0);
    });
  });

  // CM: 0%=comunicação mínima, 100%=excelente (DIRETA)
  describe("CM (direta)", () => {
    it("20→80 deve mostrar melhora", () => {
      const result = calculateImprovementPercentage("cm", 20, 80);
      expect(result).toBeGreaterThan(0);
    });

    it("50→100 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("cm", 50, 100);
      expect(result).toBe(100);
    });

    it("80→20 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("cm", 80, 20);
      expect(result).toBe(0);
    });
  });

  // QCS: 0%=severamente prejudicada, 100%=excelente (DIRETA)
  describe("QCS (direta)", () => {
    it("30→90 deve mostrar melhora", () => {
      const result = calculateImprovementPercentage("qcs", 30, 90);
      expect(result).toBeGreaterThan(0);
    });

    it("90→30 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("qcs", 90, 30);
      expect(result).toBe(0);
    });
  });

  // FOIS: 1=nenhuma ingestão oral, 7=total sem restrições (DIRETA)
  describe("FOIS (direta)", () => {
    it("1→7 deve mostrar melhora", () => {
      const result = calculateImprovementPercentage("fois", 1, 7);
      expect(result).toBeGreaterThan(0);
    });

    it("7→1 deve ser 0% (piorou)", () => {
      const result = calculateImprovementPercentage("fois", 7, 1);
      expect(result).toBe(0);
    });

    it("3→6 deve ser 100% de melhora", () => {
      const result = calculateImprovementPercentage("fois", 3, 6);
      expect(result).toBe(100);
    });
  });
});

describe("NUNCA valores negativos", () => {
  const allScales = [...INVERSE_SCALES, ...DIRECT_SCALES];

  allScales.forEach((scale) => {
    it(`${scale}: calculateImprovementPercentage NUNCA retorna negativo`, () => {
      // Testar vários cenários
      const testCases = [
        [0, 0], [0, 10], [10, 0], [5, 5], [1, 100], [100, 1],
        [0, 1], [1, 0], [50, 100], [100, 50], [3, 7], [7, 3],
      ];

      testCases.forEach(([first, last]) => {
        const result = calculateImprovementPercentage(scale, first, last);
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });
  });
});

describe("getScoreDirection", () => {
  // Escalas inversas: score diminuir = improvement
  it("EAT-10: 38→19 deve ser improvement", () => {
    expect(getScoreDirection("eat10", 38, 19)).toBe("improvement");
  });

  it("EAT-10: 19→38 deve ser decline", () => {
    expect(getScoreDirection("eat10", 19, 38)).toBe("decline");
  });

  it("EAT-10: 20→20 deve ser stable", () => {
    expect(getScoreDirection("eat10", 20, 20)).toBe("stable");
  });

  // Escalas diretas: score aumentar = improvement
  it("DOSS: 3→6 deve ser improvement", () => {
    expect(getScoreDirection("doss", 3, 6)).toBe("improvement");
  });

  it("DOSS: 6→3 deve ser decline", () => {
    expect(getScoreDirection("doss", 6, 3)).toBe("decline");
  });

  it("BDAE: 10→20 deve ser improvement", () => {
    expect(getScoreDirection("bdae", 10, 20)).toBe("improvement");
  });

  it("BDAE: 20→10 deve ser decline", () => {
    expect(getScoreDirection("bdae", 20, 10)).toBe("decline");
  });

  // BTSS e HB (antes classificadas errado)
  it("BTSS: 20→10 deve ser improvement (score diminuiu = melhora)", () => {
    expect(getScoreDirection("btss", 20, 10)).toBe("improvement");
  });

  it("BTSS: 10→20 deve ser decline (score aumentou = piora)", () => {
    expect(getScoreDirection("btss", 10, 20)).toBe("decline");
  });

  it("HB: 5→2 deve ser improvement (score diminuiu = melhora)", () => {
    expect(getScoreDirection("hb", 5, 2)).toBe("improvement");
  });

  it("HB: 2→5 deve ser decline (score aumentou = piora)", () => {
    expect(getScoreDirection("hb", 2, 5)).toBe("decline");
  });
});

describe("hasImproved", () => {
  // Escalas inversas
  it("PHQ-9: 20→10 deve ter melhorado", () => {
    expect(hasImproved("phq9", 20, 10)).toBe(true);
  });

  it("PHQ-9: 10→20 NÃO melhorou", () => {
    expect(hasImproved("phq9", 10, 20)).toBe(false);
  });

  // Escalas diretas
  it("FOIS: 3→6 deve ter melhorado", () => {
    expect(hasImproved("fois", 3, 6)).toBe(true);
  });

  it("FOIS: 6→3 NÃO melhorou", () => {
    expect(hasImproved("fois", 6, 3)).toBe(false);
  });
});

describe("calculateVariation", () => {
  // Escalas inversas: variação positiva = melhora
  it("EAT-10: 38→19 deve ter variação positiva (melhora)", () => {
    const result = calculateVariation("eat10", 38, 19);
    expect(result).toBe(19); // 38 - 19 = 19 (positivo = melhora)
  });

  it("EAT-10: 19→38 deve ter variação negativa (piora)", () => {
    const result = calculateVariation("eat10", 19, 38);
    expect(result).toBe(-19); // 19 - 38 = -19 (negativo = piora)
  });

  // Escalas diretas: variação positiva = melhora
  it("DOSS: 3→6 deve ter variação positiva (melhora)", () => {
    const result = calculateVariation("doss", 3, 6);
    expect(result).toBe(3); // 6 - 3 = 3 (positivo = melhora)
  });

  it("DOSS: 6→3 deve ter variação negativa (piora)", () => {
    const result = calculateVariation("doss", 6, 3);
    expect(result).toBe(-3); // 3 - 6 = -3 (negativo = piora)
  });
});

describe("calculateAbsoluteImprovement", () => {
  it("EAT-10: 38→19 deve ser 19 pontos de melhora", () => {
    expect(calculateAbsoluteImprovement("eat10", 38, 19)).toBe(19);
  });

  it("EAT-10: 19→38 deve ser 0 (não melhorou)", () => {
    expect(calculateAbsoluteImprovement("eat10", 19, 38)).toBe(0);
  });

  it("DOSS: 3→6 deve ser 3 pontos de melhora", () => {
    expect(calculateAbsoluteImprovement("doss", 3, 6)).toBe(3);
  });

  it("DOSS: 6→3 deve ser 0 (não melhorou)", () => {
    expect(calculateAbsoluteImprovement("doss", 6, 3)).toBe(0);
  });
});

describe("calculateDisplayImprovement", () => {
  it("EAT-10: 38→0 deve mostrar 100% de melhora", () => {
    const result = calculateDisplayImprovement("eat10", 38, 0);
    expect(result.percentageImprovement).toBe(100);
    expect(result.hasImproved).toBe(true);
    expect(result.direction).toBe("improvement");
    expect(result.label).toContain("100");
    expect(result.label).toContain("melhora");
  });

  it("EAT-10: 0→38 deve mostrar piora", () => {
    const result = calculateDisplayImprovement("eat10", 0, 38);
    expect(result.percentageImprovement).toBe(0);
    expect(result.hasImproved).toBe(false);
    expect(result.direction).toBe("decline");
    expect(result.label).toContain("Piora");
  });

  it("DOSS: 3→6 deve mostrar melhora", () => {
    const result = calculateDisplayImprovement("doss", 3, 6);
    expect(result.percentageImprovement).toBe(100);
    expect(result.hasImproved).toBe(true);
    expect(result.direction).toBe("improvement");
  });

  it("DOSS: 6→3 deve mostrar piora", () => {
    const result = calculateDisplayImprovement("doss", 6, 3);
    expect(result.percentageImprovement).toBe(0);
    expect(result.hasImproved).toBe(false);
    expect(result.direction).toBe("decline");
  });

  it("qualquer escala: mesmos scores deve ser estável", () => {
    const result = calculateDisplayImprovement("eat10", 20, 20);
    expect(result.percentageImprovement).toBe(0);
    expect(result.hasImproved).toBe(false);
    expect(result.direction).toBe("stable");
    expect(result.label).toContain("Sem alteração");
  });
});

describe("Cenários edge case", () => {
  it("scores 0→0 deve ser 0% para qualquer escala", () => {
    expect(calculateImprovementPercentage("eat10", 0, 0)).toBe(0);
    expect(calculateImprovementPercentage("doss", 0, 0)).toBe(0);
  });

  it("score inicial 0 para escala direta com aumento deve retornar 100%", () => {
    expect(calculateImprovementPercentage("doss", 0, 5)).toBe(100);
  });

  it("score inicial 0 para escala inversa com aumento deve retornar 0%", () => {
    expect(calculateImprovementPercentage("eat10", 0, 5)).toBe(0);
  });

  it("scores muito grandes não devem causar overflow", () => {
    const result = calculateImprovementPercentage("eat10", 1000, 0);
    expect(result).toBe(100);
    expect(isFinite(result)).toBe(true);
  });

  it("scores decimais devem funcionar corretamente", () => {
    const result = calculateImprovementPercentage("eat10", 10.5, 5.25);
    expect(result).toBe(50);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});
