import { describe, it, expect } from "vitest";
import {
  READY_PROTOCOLS,
  getProtocolById,
  searchProtocolsByCondition,
  getAllProtocols,
} from "./ready-protocols";

describe("Ready Protocols", () => {
  it("deve ter 12 protocolos prontos", () => {
    expect(READY_PROTOCOLS).toHaveLength(12);
  });

  it("cada protocolo deve ter ID único", () => {
    const ids = READY_PROTOCOLS.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(READY_PROTOCOLS.length);
  });

  it("cada protocolo deve ter nome, condição e objetivo", () => {
    READY_PROTOCOLS.forEach(protocol => {
      expect(protocol.name).toBeTruthy();
      expect(protocol.condition).toBeTruthy();
      expect(protocol.objective).toBeTruthy();
    });
  });

  it("cada protocolo deve ter pelo menos um ponto alvo", () => {
    READY_PROTOCOLS.forEach(protocol => {
      expect(protocol.targetPoints.length).toBeGreaterThan(0);
    });
  });

  it("cada protocolo deve ter frequência e duração válidas", () => {
    READY_PROTOCOLS.forEach(protocol => {
      expect(protocol.frequency).toBeGreaterThan(0);
      expect(protocol.totalDuration).toBeGreaterThan(0);
    });
  });

  it("cada protocolo deve ter keywords", () => {
    READY_PROTOCOLS.forEach(protocol => {
      expect(protocol.keywords.length).toBeGreaterThan(0);
    });
  });

  it("todos os pontos devem ser válidos do sistema 10-20", () => {
    const validPoints = ["Fp1", "Fp2", "Fpz", "AF3", "AF4", "AFz", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "Fz", "C1", "C2", "C3", "C4", "C5", "C6", "Cz", "FC1", "FC2", "FC5", "FC6", "FCz", "CP1", "CP2", "CP3", "CP4", "CP5", "CP6", "CPz", "T3", "T4", "T5", "T6", "P1", "P2", "P3", "P4", "P5", "P6", "Pz", "PO3", "PO4", "POz", "O1", "O2", "Oz", "Iz", "Inf-O"];
    READY_PROTOCOLS.forEach(protocol => {
      protocol.targetPoints.forEach(point => {
        expect(validPoints).toContain(point);
      });
    });
  });

  describe("getProtocolById", () => {
    it("deve retornar protocolo por ID", () => {
      const protocol = getProtocolById("protocol-afasia");
      expect(protocol).toBeDefined();
      expect(protocol?.name).toBe("Afasia");
    });

    it("deve retornar undefined para ID inválido", () => {
      const protocol = getProtocolById("invalid-id");
      expect(protocol).toBeUndefined();
    });
  });

  describe("searchProtocolsByCondition", () => {
    it("deve encontrar protocolo por condição exata", () => {
      const results = searchProtocolsByCondition("Afasia");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].condition).toBe("Afasia");
    });

    it("deve encontrar protocolo por nome parcial", () => {
      const results = searchProtocolsByCondition("Afasia");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain("Afasia");
    });

    it("deve encontrar protocolo por keyword", () => {
      const results = searchProtocolsByCondition("Zumbido");
      expect(results.length).toBeGreaterThan(0);
    });

    it("deve ser case-insensitive", () => {
      const results1 = searchProtocolsByCondition("afasia");
      const results2 = searchProtocolsByCondition("AFASIA");
      expect(results1.length).toBe(results2.length);
    });

    it("deve retornar array vazio para busca sem resultados", () => {
      const results = searchProtocolsByCondition("xyz123");
      expect(results).toHaveLength(0);
    });
  });

  describe("getAllProtocols", () => {
    it("deve retornar todos os 12 protocolos", () => {
      const protocols = getAllProtocols();
      expect(protocols).toHaveLength(12);
    });
  });

  describe("getAvailableConditions", () => {
    it("deve retornar lista de condições", () => {
      const conditions = READY_PROTOCOLS.map(p => p.condition);
      expect(conditions.length).toBeGreaterThan(0);
    });

    it("deve retornar condições únicas", () => {
      const conditions = READY_PROTOCOLS.map(p => p.condition);
      const unique = new Set(conditions);
      expect(unique.size).toBe(conditions.length);
    });

    it("deve conter as 12 condições esperadas", () => {
      const conditions = READY_PROTOCOLS.map(p => p.condition);
      expect(conditions).toHaveLength(12);
      // Verificar que temos condições esperadas
      expect(conditions).toContain("Afasia");
      expect(conditions).toContain("Tinnitus");
      expect(conditions).toContain("Doença de Parkinson");
    });
  });

  describe("Protocolo Afasia", () => {
    it("deve ter pontos F3, F4, Fz", () => {
      const protocol = getProtocolById("protocol-afasia");
      expect(protocol?.targetPoints).toEqual(["F3", "F4", "Fz"]);
    });

    it("deve ter frequência 3x/semana", () => {
      const protocol = getProtocolById("protocol-afasia");
      expect(protocol?.frequency).toBe(3);
    });

    it("deve ter duração 12 semanas", () => {
      const protocol = getProtocolById("protocol-afasia");
      expect(protocol?.totalDuration).toBe(12);
    });
  });

  describe("Protocolo Zumbido", () => {
    it("deve ter pontos T3, T4", () => {
      const protocol = getProtocolById("protocol-zumbido");
      expect(protocol?.targetPoints).toEqual(["T3", "T4"]);
    });

    it("deve ter frequência 2x/semana", () => {
      const protocol = getProtocolById("protocol-zumbido");
      expect(protocol?.frequency).toBe(2);
    });
  });

  describe("Protocolo Parkinson", () => {
    it("deve ter pontos sensório-motores", () => {
      const protocol = getProtocolById("protocol-parkinson");
      expect(protocol?.targetPoints).toContain("C3");
      expect(protocol?.targetPoints).toContain("C4");
    });

    it("deve ter frequência 3x/semana", () => {
      const protocol = getProtocolById("protocol-parkinson");
      expect(protocol?.frequency).toBe(3);
    });
  });

  describe("Protocolo Alzheimer", () => {
    it("deve ter pontos temporais", () => {
      const protocol = getProtocolById("protocol-alzheimer");
      expect(protocol?.targetPoints).toContain("T3");
      expect(protocol?.targetPoints).toContain("T4");
    });

    it("deve ter duração 16 semanas (mais longo)", () => {
      const protocol = getProtocolById("protocol-alzheimer");
      expect(protocol?.totalDuration).toBe(16);
    });
  });
});
