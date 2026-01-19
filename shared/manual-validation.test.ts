import { describe, it, expect } from "vitest";
import { validateManualFidelity } from "./manual-validation";
import { COLORED_POINTS, COLORED_REGIONS } from "./manual-colored-points";
import { READY_PROTOCOLS } from "./ready-protocols";

describe("Manual Validation", () => {
  it("deve ter 35 pontos coloridos", () => {
    expect(COLORED_POINTS).toHaveLength(35);
  });

  it("deve ter 7 regiões coloridas", () => {
    expect(COLORED_REGIONS).toHaveLength(7);
  });

  it("cada ponto deve ter cor definida", () => {
    COLORED_POINTS.forEach(point => {
      expect(point.color).toBeTruthy();
      expect(point.color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it("cada ponto deve ter aplicações definidas", () => {
    COLORED_POINTS.forEach(point => {
      expect(point.applications).toBeDefined();
      expect(point.applications.length).toBeGreaterThan(0);
    });
  });

  it("cada região deve ter aplicações definidas", () => {
    COLORED_REGIONS.forEach(region => {
      expect(region.applications).toBeDefined();
      expect(region.applications.length).toBeGreaterThan(0);
    });
  });

  it("todos os protocolos devem usar apenas pontos coloridos", () => {
    const coloredPointNames = COLORED_POINTS.map(p => p.name);
    
    READY_PROTOCOLS.forEach(protocol => {
      protocol.targetPoints.forEach(point => {
        expect(coloredPointNames).toContain(point);
      });
    });
  });

  it("validação de fidelidade deve passar", () => {
    const result = validateManualFidelity();
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("cores dos pontos devem estar corretas", () => {
    const colorMap: Record<string, string> = {
      // Rosa
      "Fp1": "#FF69B4",
      "Fp2": "#FF69B4",
      "Fpz": "#FF69B4",
      // Laranja
      "AF3": "#FFA500",
      "AF4": "#FFA500",
      "AFz": "#FFA500",
      // Amarelo
      "F3": "#FFFF00",
      "F4": "#FFFF00",
      "F7": "#FFFF00",
      "F8": "#FFFF00",
      "Fz": "#FFFF00",
      // Ciano
      "C1": "#00CED1",
      "C3": "#00CED1",
      "C4": "#00CED1",
      // Verde
      "T3": "#00FF00",
      "T4": "#00FF00",
      "T5": "#00FF00",
      "T6": "#00FF00",
      // Roxo
      "P3": "#9370DB",
      "P4": "#9370DB",
      "Pz": "#9370DB",
      // Rosa claro
      "O1": "#FFB6C1",
      "O2": "#FFB6C1",
      "Oz": "#FFB6C1",
    };

    Object.entries(colorMap).forEach(([pointName, expectedColor]) => {
      const point = COLORED_POINTS.find(p => p.name === pointName);
      expect(point).toBeDefined();
      expect(point?.color).toBe(expectedColor);
    });
  });

  it("não deve haver pontos cinzas", () => {
    const grayColors = ["#CCCCCC", "#DDDDDD", "#EEEEEE", "#FFFFFF", "#808080"];
    
    COLORED_POINTS.forEach(point => {
      expect(grayColors).not.toContain(point.color);
    });
  });

  it("cada protocolo deve ter pontos válidos", () => {
    READY_PROTOCOLS.forEach(protocol => {
      expect(protocol.targetPoints.length).toBeGreaterThan(0);
      protocol.targetPoints.forEach(point => {
        const foundPoint = COLORED_POINTS.find(p => p.name === point);
        expect(foundPoint).toBeDefined();
      });
    });
  });
});
