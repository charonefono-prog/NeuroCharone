import { describe, it, expect } from "vitest";
import {
  DOSS_SCALE,
  BTSS_SCALE,
  BDAE_SCALE,
  CM_SCALE,
  SARA_SCALE,
  QCS_SCALE,
  calculateScaleScore,
  getScale,
} from "../clinical-scales";

describe("Clinical Scales", () => {
  describe("DOSS Scale", () => {
    it("should have correct structure", () => {
      expect(DOSS_SCALE.type).toBe("doss");
      expect(DOSS_SCALE.name).toBe("Escala do Comer (DOSS)");
      expect(DOSS_SCALE.totalItems).toBe(7);
      expect(DOSS_SCALE.items).toHaveLength(7);
    });

    it("should calculate score correctly", () => {
      const answers = {
        doss_1: 7,
        doss_2: 7,
        doss_3: 7,
        doss_4: 7,
        doss_5: 7,
        doss_6: 7,
        doss_7: 7,
      };

      const { score, interpretation } = DOSS_SCALE.calculateScore(answers);
      expect(score).toBe(7);
      expect(interpretation).toBe("Função normal ou mínimas dificuldades");
    });

    it("should interpret low scores correctly", () => {
      const answers = {
        doss_1: 1,
        doss_2: 1,
        doss_3: 1,
        doss_4: 1,
        doss_5: 1,
        doss_6: 1,
        doss_7: 1,
      };

      const { interpretation } = DOSS_SCALE.calculateScore(answers);
      expect(interpretation).toBe("Disfagia severa");
    });
  });

  describe("BTSS Scale", () => {
    it("should have correct structure", () => {
      expect(BTSS_SCALE.type).toBe("btss");
      expect(BTSS_SCALE.name).toBe("Escala Breve de Zumbido (BTSS)");
      expect(BTSS_SCALE.totalItems).toBe(3);
    });

    it("should calculate score correctly for mild tinnitus", () => {
      const answers = {
        btss_1: 2,
        btss_2: 2,
        btss_3: 2,
      };

      const { score, interpretation } = BTSS_SCALE.calculateScore(answers);
      expect(score).toBe(6);
      expect(interpretation).toBe("Zumbido leve");
    });

    it("should calculate score correctly for severe tinnitus", () => {
      const answers = {
        btss_1: 10,
        btss_2: 10,
        btss_3: 10,
      };

      const { score, interpretation } = BTSS_SCALE.calculateScore(answers);
      expect(score).toBe(30);
      expect(interpretation).toBe("Zumbido severo");
    });
  });

  describe("BDAE Scale", () => {
    it("should have correct structure", () => {
      expect(BDAE_SCALE.type).toBe("bdae");
      expect(BDAE_SCALE.name).toBe("Escala de Boston (BDAE)");
      expect(BDAE_SCALE.totalItems).toBe(6);
    });

    it("should calculate score for normal function", () => {
      const answers = {
        bdae_1: 4,
        bdae_2: 4,
        bdae_3: 4,
        bdae_4: 4,
        bdae_5: 4,
        bdae_6: 4,
      };

      const { score, interpretation } = BDAE_SCALE.calculateScore(answers);
      expect(score).toBe(24);
      expect(interpretation).toBe("Sem afasia ou afasia mínima");
    });

    it("should calculate score for severe aphasia", () => {
      const answers = {
        bdae_1: 0,
        bdae_2: 0,
        bdae_3: 0,
        bdae_4: 0,
        bdae_5: 0,
        bdae_6: 0,
      };

      const { score, interpretation } = BDAE_SCALE.calculateScore(answers);
      expect(score).toBe(0);
      expect(interpretation).toBe("Afasia severa");
    });
  });

  describe("Communication Matrix", () => {
    it("should have correct structure", () => {
      expect(CM_SCALE.type).toBe("cm");
      expect(CM_SCALE.name).toBe("Communication Matrix");
      expect(CM_SCALE.totalItems).toBe(5);
    });

    it("should calculate percentage correctly", () => {
      const answers = {
        cm_1: 4,
        cm_2: 4,
        cm_3: 4,
        cm_4: 4,
        cm_5: 4,
      };

      const { score, interpretation } = CM_SCALE.calculateScore(answers);
      expect(score).toBe(100);
      expect(interpretation).toBe("Comunicação funcional excelente");
    });

    it("should interpret low scores", () => {
      const answers = {
        cm_1: 0,
        cm_2: 0,
        cm_3: 0,
        cm_4: 0,
        cm_5: 0,
      };

      const { score, interpretation } = CM_SCALE.calculateScore(answers);
      expect(score).toBe(0);
      expect(interpretation).toBe("Comunicação funcional mínima");
    });
  });

  describe("SARA Scale", () => {
    it("should have correct structure", () => {
      expect(SARA_SCALE.type).toBe("sara");
      expect(SARA_SCALE.name).toBe("Escala SARA");
      expect(SARA_SCALE.totalItems).toBe(8);
    });

    it("should calculate score for no ataxia", () => {
      const answers = {
        sara_1: 0,
        sara_2: 0,
        sara_3: 0,
        sara_4: 0,
        sara_5: 0,
        sara_6: 0,
        sara_7: 0,
        sara_8: 0,
      };

      const { score, interpretation } = SARA_SCALE.calculateScore(answers);
      expect(score).toBe(0);
      expect(interpretation).toBe("Sem ataxia");
    });

    it("should calculate score for severe ataxia", () => {
      const answers = {
        sara_1: 4,
        sara_2: 4,
        sara_3: 4,
        sara_4: 1,
        sara_5: 4,
        sara_6: 4,
        sara_7: 3,
        sara_8: 1,
      };

      const { score, interpretation } = SARA_SCALE.calculateScore(answers);
      expect(score).toBe(25);
      expect(interpretation).toBe("Ataxia moderada a severa");
    });
  });

  describe("QCS Scale", () => {
    it("should have correct structure", () => {
      expect(QCS_SCALE.type).toBe("qcs");
      expect(QCS_SCALE.name).toBe("Questionário de Comunicação Social (QCS)");
      expect(QCS_SCALE.totalItems).toBe(6);
    });

    it("should calculate percentage for excellent communication", () => {
      const answers = {
        qcs_1: 5,
        qcs_2: 5,
        qcs_3: 5,
        qcs_4: 5,
        qcs_5: 5,
        qcs_6: 5,
      };

      const { score, interpretation } = QCS_SCALE.calculateScore(answers);
      expect(score).toBe(100);
      expect(interpretation).toBe("Comunicação social excelente");
    });

    it("should calculate percentage for poor communication", () => {
      const answers = {
        qcs_1: 1,
        qcs_2: 1,
        qcs_3: 1,
        qcs_4: 1,
        qcs_5: 1,
        qcs_6: 1,
      };

      const { score, interpretation } = QCS_SCALE.calculateScore(answers);
      expect(score).toBe(20);
      expect(interpretation).toBe("Comunicação social prejudicada");
    });
  });

  describe("getScale function", () => {
    it("should return correct scale for each type", () => {
      expect(getScale("doss")).toBe(DOSS_SCALE);
      expect(getScale("btss")).toBe(BTSS_SCALE);
      expect(getScale("bdae")).toBe(BDAE_SCALE);
      expect(getScale("cm")).toBe(CM_SCALE);
      expect(getScale("sara")).toBe(SARA_SCALE);
      expect(getScale("qcs")).toBe(QCS_SCALE);
    });

    it("should return undefined for invalid scale type", () => {
      expect(getScale("invalid" as any)).toBeUndefined();
    });
  });

  describe("calculateScaleScore function", () => {
    it("should calculate score using the scale's method", () => {
      const answers = {
        doss_1: 7,
        doss_2: 7,
        doss_3: 7,
        doss_4: 7,
        doss_5: 7,
        doss_6: 7,
        doss_7: 7,
      };

      const { score, interpretation } = calculateScaleScore("doss", answers);
      expect(score).toBe(7);
      expect(interpretation).toBe("Função normal ou mínimas dificuldades");
    });

    it("should return error message for invalid scale", () => {
      const { interpretation } = calculateScaleScore("invalid" as any, {});
      expect(interpretation).toBe("Escala não encontrada");
    });
  });

  describe("Scale items validation", () => {
    it("DOSS should have all required items", () => {
      const itemIds = DOSS_SCALE.items.map((item) => item.id);
      expect(itemIds).toContain("doss_1");
      expect(itemIds).toContain("doss_7");
      expect(itemIds).toHaveLength(7);
    });

    it("BTSS should have all required items", () => {
      const itemIds = BTSS_SCALE.items.map((item) => item.id);
      expect(itemIds).toHaveLength(3);
    });

    it("Each item should have options", () => {
      const allScales = [DOSS_SCALE, BTSS_SCALE, BDAE_SCALE, CM_SCALE, SARA_SCALE, QCS_SCALE];
      allScales.forEach((scale) => {
        scale.items.forEach((item) => {
          expect(item.options.length).toBeGreaterThan(0);
          item.options.forEach((option) => {
            expect(option.value).toBeDefined();
            expect(option.label).toBeDefined();
          });
        });
      });
    });
  });
});
