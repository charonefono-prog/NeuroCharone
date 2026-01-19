import { PlanTemplate } from "./plan-templates";

/**
 * Interface para resultados de busca
 */
export interface SearchResult {
  template: PlanTemplate;
  matchScore: number; // 0-100, quanto maior melhor
  matchType: "name" | "objective" | "region" | "point" | "notes";
}

/**
 * Buscar templates por keywords
 * Suporta busca em: nome, objetivo, regiões, pontos e notas
 */
export function searchPlanTemplates(
  templates: PlanTemplate[],
  query: string
): SearchResult[] {
  if (!query.trim()) {
    return templates.map((template) => ({
      template,
      matchScore: 0,
      matchType: "name",
    }));
  }

  const lowerQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  templates.forEach((template) => {
    const matches: SearchResult[] = [];

    // Buscar no nome
    if (template.name.toLowerCase().includes(lowerQuery)) {
      matches.push({
        template,
        matchScore: 100,
        matchType: "name",
      });
    }

    // Buscar no objetivo
    if (template.objective.toLowerCase().includes(lowerQuery)) {
      matches.push({
        template,
        matchScore: 90,
        matchType: "objective",
      });
    }

    // Buscar nas regiões
    const regionMatch = template.targetRegions.some((region) =>
      region.toLowerCase().includes(lowerQuery)
    );
    if (regionMatch) {
      matches.push({
        template,
        matchScore: 80,
        matchType: "region",
      });
    }

    // Buscar nos pontos
    const pointMatch = template.targetPoints.some((point) =>
      point.toLowerCase().includes(lowerQuery)
    );
    if (pointMatch) {
      matches.push({
        template,
        matchScore: 75,
        matchType: "point",
      });
    }

    // Buscar nas notas
    if (template.notes && template.notes.toLowerCase().includes(lowerQuery)) {
      matches.push({
        template,
        matchScore: 70,
        matchType: "notes",
      });
    }

    // Se encontrou algum match, adicionar o melhor
    if (matches.length > 0) {
      const bestMatch = matches.reduce((prev, current) =>
        prev.matchScore > current.matchScore ? prev : current
      );
      results.push(bestMatch);
    }
  });

  // Ordenar por score (descendente)
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Buscar templates por múltiplas keywords (AND logic)
 * Todos os keywords devem estar presentes
 */
export function searchPlanTemplatesMultiple(
  templates: PlanTemplate[],
  keywords: string[]
): PlanTemplate[] {
  if (keywords.length === 0) {
    return templates;
  }

  return templates.filter((template) => {
    const templateText = `
      ${template.name}
      ${template.objective}
      ${template.targetRegions.join(" ")}
      ${template.targetPoints.join(" ")}
      ${template.notes || ""}
    `.toLowerCase();

    return keywords.every((keyword) =>
      templateText.includes(keyword.toLowerCase())
    );
  });
}

/**
 * Sugestões de busca baseadas em keywords comuns
 */
export const SEARCH_SUGGESTIONS = [
  "Afasia",
  "Broca",
  "Wernicke",
  "Linguagem",
  "Depressão",
  "Ansiedade",
  "Dor",
  "Insônia",
  "TDAH",
  "Frontal",
  "Temporal",
  "Parietal",
  "Motor",
  "Sensorial",
  "Fala",
  "Compreensão",
];

/**
 * Obter sugestões de busca que correspondem ao query
 */
export function getSearchSuggestions(query: string): string[] {
  if (!query.trim()) {
    return SEARCH_SUGGESTIONS;
  }

  const lowerQuery = query.toLowerCase();
  return SEARCH_SUGGESTIONS.filter((suggestion) =>
    suggestion.toLowerCase().includes(lowerQuery)
  );
}
