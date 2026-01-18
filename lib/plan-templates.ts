import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Obter todos os templates
export async function getPlanTemplates(): Promise<PlanTemplate[]> {
  try {
    const data = await AsyncStorage.getItem(TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
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

// Inicializar templates padrão
export async function initializeDefaultTemplates(): Promise<void> {
  const templates = await getPlanTemplates();
  if (templates.length > 0) return; // Já tem templates

  // Template para Depressão
  await savePlanTemplate({
    name: "Depressão - Protocolo Padrão",
    objective: "Tratamento de depressão com estimulação do córtex pré-frontal dorsolateral esquerdo",
    targetRegions: ["Frontal Central"],
    targetPoints: ["F3", "F7", "Fp1"],
    frequency: 3,
    totalDuration: 8,
    notes: "Protocolo baseado em estudos para tratamento de depressão moderada a grave",
  });

  // Template para Ansiedade
  await savePlanTemplate({
    name: "Ansiedade - Protocolo Padrão",
    objective: "Redução de sintomas de ansiedade com estimulação bilateral",
    targetRegions: ["Frontal Central", "Temporal"],
    targetPoints: ["F3", "F4", "T3", "T4"],
    frequency: 2,
    totalDuration: 6,
    notes: "Protocolo para ansiedade generalizada com abordagem bilateral",
  });

  // Template para Dor Crônica
  await savePlanTemplate({
    name: "Dor Crônica - Protocolo Padrão",
    objective: "Modulação da percepção de dor através de estimulação do córtex motor",
    targetRegions: ["Central", "Parietal"],
    targetPoints: ["C3", "C4", "Cz", "P3", "P4"],
    frequency: 3,
    totalDuration: 10,
    notes: "Protocolo para dor crônica com foco no córtex motor e somatossensorial",
  });

  // Template para Insônia
  await savePlanTemplate({
    name: "Insônia - Protocolo Padrão",
    objective: "Melhora da qualidade do sono através de regulação do ritmo circadiano",
    targetRegions: ["Frontal Central", "Occipital"],
    targetPoints: ["Fpz", "Fz", "O1", "O2"],
    frequency: 2,
    totalDuration: 4,
    notes: "Protocolo para distúrbios do sono e insônia",
  });

  // Template para TDAH
  await savePlanTemplate({
    name: "TDAH - Protocolo Padrão",
    objective: "Melhora da atenção e controle executivo",
    targetRegions: ["Frontal Central"],
    targetPoints: ["Fpz", "Fz", "F3", "F4", "Cz"],
    frequency: 3,
    totalDuration: 12,
    notes: "Protocolo para Transtorno de Déficit de Atenção e Hiperatividade",
  });
}
