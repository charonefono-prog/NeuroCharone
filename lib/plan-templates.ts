import AsyncStorage from "@react-native-async-storage/async-storage";
import { READY_PROTOCOLS } from "../shared/ready-protocols";

export interface PlanTemplate {
  id: string;
  name: string;
  objective: string;
  targetRegions: string[];
  targetPoints: string[];
  frequency: number; // sessões por semana
  totalDuration: number; // duração total em semanas
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const TEMPLATES_KEY = "@neurolasermap:plan_templates";

// Obter todos os templates (incluindo protocolos prontos)
export async function getPlanTemplates(): Promise<PlanTemplate[]> {
  try {
    const data = await AsyncStorage.getItem(TEMPLATES_KEY);
    const customTemplates = data ? JSON.parse(data) : [];
    
    // Converter protocolos prontos para o formato de template
    const readyTemplates: PlanTemplate[] = READY_PROTOCOLS.map(protocol => ({
      id: protocol.id,
      name: protocol.name,
      objective: protocol.objective,
      targetRegions: protocol.targetRegions,
      targetPoints: protocol.targetPoints,
      frequency: protocol.frequency,
      totalDuration: protocol.totalDuration,
      notes: protocol.notes,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    }));
    
    // Combinar protocolos prontos com templates customizados
    return [...readyTemplates, ...customTemplates];
  } catch (error) {
    console.error("Erro ao carregar templates:", error);
    return [];
  }
}

// Salvar novo template
export async function savePlanTemplate(
  template: Omit<PlanTemplate, "id" | "createdAt" | "updatedAt">
): Promise<PlanTemplate> {
  try {
    const templates = await getPlanTemplates();
    const newTemplate: PlanTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    templates.push(newTemplate);
    await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return newTemplate;
  } catch (error) {
    console.error("Erro ao salvar template:", error);
    throw error;
  }
}

// Atualizar template existente
export async function updatePlanTemplate(
  id: string,
  updates: Partial<PlanTemplate>
): Promise<PlanTemplate | null> {
  try {
    const templates = await getPlanTemplates();
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return null;

    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return templates[index];
  } catch (error) {
    console.error("Erro ao atualizar template:", error);
    throw error;
  }
}

// Excluir template
export async function deletePlanTemplate(id: string): Promise<boolean> {
  try {
    const templates = await getPlanTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Erro ao excluir template:", error);
    return false;
  }
}

// Obter template por ID
export async function getPlanTemplateById(id: string): Promise<PlanTemplate | null> {
  const templates = await getPlanTemplates();
  return templates.find((t) => t.id === id) || null;
}

// Inicializar templates padrão (apenas customizados, protocolos prontos são carregados automaticamente)
export async function initializeDefaultTemplates(): Promise<void> {
  const data = await AsyncStorage.getItem(TEMPLATES_KEY);
  if (data) return; // Já tem templates customizados
  
  // Inicializar com array vazio - protocolos prontos são carregados via READY_PROTOCOLS
  await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify([]));
}
