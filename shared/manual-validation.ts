/**
 * Validação de Fidelidade ao Manual
 * Verifica se todos os pontos e regiões estão corretos conforme o manual
 */

import { COLORED_POINTS, COLORED_REGIONS } from "./manual-colored-points";
import { READY_PROTOCOLS } from "./ready-protocols";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateManualFidelity(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar que todos os pontos coloridos estão definidos
  const coloredPointNames = COLORED_POINTS.map(p => p.name);
  
  // Validar que todos os protocolos usam apenas pontos coloridos
  READY_PROTOCOLS.forEach(protocol => {
    protocol.targetPoints.forEach(point => {
      if (!coloredPointNames.includes(point)) {
        errors.push(`Protocolo "${protocol.name}" usa ponto inválido: ${point}`);
      }
    });
  });

  // Validar cores dos pontos
  const colorMap: Record<string, string> = {
    // Rosa - Frontal Anterior
    "Fp1": "#FF69B4",
    "Fp2": "#FF69B4",
    "Fpz": "#FF69B4",
    // Laranja - Frontal Média
    "AF3": "#FFA500",
    "AF4": "#FFA500",
    "AFz": "#FFA500",
    // Amarelo - Frontal Central
    "F3": "#FFFF00",
    "F4": "#FFFF00",
    "F7": "#FFFF00",
    "F8": "#FFFF00",
    "Fz": "#FFFF00",
    // Ciano - Central / Sensório-Motora
    "C1": "#00CED1",
    "C2": "#00CED1",
    "C3": "#00CED1",
    "C4": "#00CED1",
    "C5": "#00CED1",
    "C6": "#00CED1",
    "Cz": "#00CED1",
    "FC1": "#00CED1",
    "FC2": "#00CED1",
    "FC5": "#00CED1",
    "FC6": "#00CED1",
    "FCz": "#00CED1",
    "CP1": "#00CED1",
    "CP2": "#00CED1",
    "CP5": "#00CED1",
    "CP6": "#00CED1",
    "CPz": "#00CED1",
    // Verde - Temporal
    "T3": "#00FF00",
    "T4": "#00FF00",
    "T5": "#00FF00",
    "T6": "#00FF00",
    // Roxo - Parietal e Parieto-Occipital
    "P3": "#9370DB",
    "P4": "#9370DB",
    "Pz": "#9370DB",
    "PO3": "#9370DB",
    "PO4": "#9370DB",
    "POz": "#9370DB",
    // Rosa claro - Occipital
    "O1": "#FFB6C1",
    "O2": "#FFB6C1",
    "Oz": "#FFB6C1",
  };

  COLORED_POINTS.forEach(point => {
    const expectedColor = colorMap[point.name];
    if (expectedColor && point.color !== expectedColor) {
      errors.push(`Ponto ${point.name} tem cor incorreta. Esperado: ${expectedColor}, Obtido: ${point.color}`);
    }
  });

  // Validar que não há pontos cinzas
  const grayColors = ["#CCCCCC", "#DDDDDD", "#EEEEEE", "#FFFFFF", "#808080"];
  COLORED_POINTS.forEach(point => {
    if (grayColors.includes(point.color)) {
      errors.push(`Ponto ${point.name} tem cor cinza (não colorida): ${point.color}`);
    }
  });

  // Validar que todas as regiões têm aplicações
  COLORED_REGIONS.forEach(region => {
    if (!region.applications || region.applications.length === 0) {
      warnings.push(`Região ${region.name} não tem aplicações definidas`);
    }
  });

  // Validar que todos os protocolos têm descrição
  READY_PROTOCOLS.forEach(protocol => {
    if (!protocol.description || protocol.description.length === 0) {
      warnings.push(`Protocolo ${protocol.name} não tem descrição`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function printValidationReport(): void {
  const result = validateManualFidelity();
  
  console.log("\n=== VALIDAÇÃO DE FIDELIDADE AO MANUAL ===\n");
  
  if (result.isValid) {
    console.log("✅ VALIDAÇÃO PASSOU!");
  } else {
    console.log("❌ VALIDAÇÃO FALHOU!\n");
    console.log("ERROS:");
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log("\n⚠️ AVISOS:");
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log("\n=== RESUMO ===");
  console.log(`Pontos coloridos: ${COLORED_POINTS.length}`);
  console.log(`Regiões: ${COLORED_REGIONS.length}`);
  console.log(`Protocolos: ${READY_PROTOCOLS.length}`);
  console.log(`Erros: ${result.errors.length}`);
  console.log(`Avisos: ${result.warnings.length}\n`);
}
