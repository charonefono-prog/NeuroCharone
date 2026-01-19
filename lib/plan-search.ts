import { PlanTemplate } from "./plan-templates";
import { getAllKeywords, searchRegionsByKeyword } from "../shared/manual-reference";

/**
 * Interface para resultados de busca
 */
export interface SearchResult {
  template: PlanTemplate;
  matchScore: number; // 0-100, quanto maior melhor
  matchType: "name" | "objective" | "region" | "point" | "notes" | "manual_keyword";
}

/**
 * Buscar templates por keywords
 * Suporta busca em: nome, objetivo, regiões, pontos, notas e palavras-chave do manual
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

  // Verificar se a query é uma palavra-chave do manual
  const manualKeywords = getAllKeywords();
  const isManualKeyword = manualKeywords.some((k: string) => k.toLowerCase() === lowerQuery);

  templates.forEach((template) => {
    const matches: SearchResult[] = [];

    // Se for palavra-chave do manual, dar prioridade máxima
    if (isManualKeyword) {
      const regions = searchRegionsByKeyword(lowerQuery);
      const regionNames = regions.map((r: any) => r.name.toLowerCase());
      
      const templateText = (
        template.name +
        " " +
        template.objective +
        " " +
        template.targetRegions.join(" ") +
        " " +
        (template.notes || "")
      ).toLowerCase();
      
      for (const regionName of regionNames) {
        if (templateText.includes(regionName)) {
          matches.push({
            template,
            matchScore: 110, // Score maior que 100 para palavras-chave do manual
            matchType: "manual_keyword",
          });
          break;
        }
      }
    }

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
 * Obter sugestões de busca baseadas no manual
 * Retorna palavras-chave do documento fidedigno
 */
export function getSearchSuggestions(query: string): string[] {
  const manualKeywords = getAllKeywords();
  
  if (!query.trim()) {
    return manualKeywords.slice(0, 20); // Retornar primeiras 20 sugestões
  }

  const lowerQuery = query.toLowerCase();
  return manualKeywords.filter((keyword: string) =>
    keyword.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Obter todas as palavras-chave disponíveis do manual
 */
export function getAllManualKeywords(): string[] {
  return getAllKeywords();
}
