import { describe, it, expect } from "vitest";
import {
  searchPlanTemplates,
  searchPlanTemplatesMultiple,
  getSearchSuggestions,
} from "./plan-search";
import { PlanTemplate } from "./plan-templates";

const mockTemplates: PlanTemplate[] = [
  {
    id: "1",
    name: "Afasia de Broca",
    objective: "Melhorar linguagem expressiva e compreensão",
    targetRegions: ["Área de Broca", "Córtex pré-frontal"],
    targetPoints: ["F3", "F4", "Fp1"],
    frequency: 3,
    totalDuration: 12,
    notes: "Estimulação da área de Broca para afasia não-fluente",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Disfagia",
    objective: "Melhorar deglutição e coordenação faríngea",
    targetRegions: ["Córtex motor", "Ínsula"],
    targetPoints: ["C3", "C4", "Cz"],
    frequency: 2,
    totalDuration: 8,
    notes: "Estimulação do córtex motor para melhorar deglutição",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Zumbido",
    objective: "Reduzir percepção de zumbido",
    targetRegions: ["Córtex auditivo", "Ínsula"],
    targetPoints: ["T3", "T4", "T5"],
    frequency: 2,
    totalDuration: 10,
    notes: "Laser infravermelho para zumbido",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe("Plan Search Functions", () => {
  describe("searchPlanTemplates", () => {
    it("deve retornar todos os templates quando query está vazia", () => {
      const results = searchPlanTemplates(mockTemplates, "");
      expect(results).toHaveLength(3);
    });

    it("deve encontrar template por nome", () => {
      const results = searchPlanTemplates(mockTemplates, "Afasia");
      expect(results).toHaveLength(1);
      expect(results[0].template.name).toBe("Afasia de Broca");
      expect(results[0].matchScore).toBe(100);
      expect(results[0].matchType).toBe("name");
    });

    it("deve encontrar template por objetivo", () => {
      const results = searchPlanTemplates(mockTemplates, "deglutição");
      expect(results).toHaveLength(1);
      expect(results[0].template.name).toBe("Disfagia");
      expect(results[0].matchScore).toBe(90);
      expect(results[0].matchType).toBe("objective");
    });

    it("deve encontrar template por região", () => {
      const results = searchPlanTemplates(mockTemplates, "Área de Broca");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].matchType).toBe("region");
    });

    it("deve encontrar template por ponto", () => {
      const results = searchPlanTemplates(mockTemplates, "C3");
      expect(results).toHaveLength(1);
      expect(results[0].template.name).toBe("Disfagia");
      expect(results[0].matchType).toBe("point");
    });

    it("deve encontrar template por notas", () => {
      const results = searchPlanTemplates(mockTemplates, "infravermelho");
      expect(results).toHaveLength(1);
      expect(results[0].template.name).toBe("Zumbido");
      expect(results[0].matchType).toBe("notes");
    });

    it("deve ser case-insensitive", () => {
      const results1 = searchPlanTemplates(mockTemplates, "afasia");
      const results2 = searchPlanTemplates(mockTemplates, "AFASIA");
      expect(results1).toHaveLength(results2.length);
    });

    it("deve ordenar resultados por score (descendente)", () => {
      const results = searchPlanTemplates(mockTemplates, "motor");
      if (results.length > 1) {
        for (let i = 0; i < results.length - 1; i++) {
          expect(results[i].matchScore).toBeGreaterThanOrEqual(
            results[i + 1].matchScore
          );
        }
      }
    });

    it("deve retornar array vazio para query que não existe", () => {
      const results = searchPlanTemplates(mockTemplates, "xyz123");
      expect(results).toHaveLength(0);
    });
  });

  describe("searchPlanTemplatesMultiple", () => {
    it("deve retornar todos os templates quando keywords está vazio", () => {
      const results = searchPlanTemplatesMultiple(mockTemplates, []);
      expect(results).toHaveLength(3);
    });

    it("deve encontrar templates que contêm TODOS os keywords", () => {
      const results = searchPlanTemplatesMultiple(mockTemplates, [
        "Afasia",
        "Broca",
      ]);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Afasia de Broca");
    });

    it("deve retornar array vazio quando nenhum template contém todos os keywords", () => {
      const results = searchPlanTemplatesMultiple(mockTemplates, [
        "Afasia",
        "Zumbido",
      ]);
      expect(results).toHaveLength(0);
    });

    it("deve ser case-insensitive", () => {
      const results1 = searchPlanTemplatesMultiple(mockTemplates, ["afasia"]);
      const results2 = searchPlanTemplatesMultiple(mockTemplates, ["AFASIA"]);
      expect(results1).toHaveLength(results2.length);
    });
  });

  describe("getSearchSuggestions", () => {
    it("deve retornar todas as sugestões quando query está vazio", () => {
      const suggestions = getSearchSuggestions("");
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it("deve filtrar sugestões por query", () => {
      const suggestions = getSearchSuggestions("afasia");
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.toLowerCase().includes("afasia"))).toBe(true);
    });

    it("deve ser case-insensitive", () => {
      const suggestions1 = getSearchSuggestions("afasia");
      const suggestions2 = getSearchSuggestions("AFASIA");
      expect(suggestions1.length).toBe(suggestions2.length);
    });

    it("deve retornar array vazio para query que não existe", () => {
      const suggestions = getSearchSuggestions("xyz123");
      expect(suggestions).toHaveLength(0);
    });
  });
});
