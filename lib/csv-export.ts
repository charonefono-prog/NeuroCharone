import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { Patient, Session, TherapeuticPlan } from "./local-storage";

// Função auxiliar para escapar valores CSV
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Exportar pacientes para CSV
export async function exportPatientsToCSV(patients: Patient[]): Promise<string | null> {
  try {
    // Cabeçalho
    const headers = [
      "ID",
      "Nome Completo",
      "Data de Nascimento",
      "CPF",
      "Telefone",
      "Email",
      "Endereço",
      "Diagnóstico",
      "Status",
      "Data de Cadastro",
    ];

    // Linhas de dados
    const rows = patients.map((patient) => [
      escapeCSV(patient.id),
      escapeCSV(patient.fullName),
      escapeCSV(patient.birthDate),
      escapeCSV(patient.cpf),
      escapeCSV(patient.phone),
      escapeCSV(patient.email),
      escapeCSV(patient.address),
      escapeCSV(patient.diagnosis),
      escapeCSV(patient.status),
      escapeCSV(new Date(patient.createdAt).toLocaleString("pt-BR")),
    ]);

    // Montar CSV
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    // Salvar arquivo
    const fileName = `pacientes_${new Date().toISOString().split("T")[0]}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Compartilhar arquivo
    if (Platform.OS !== "web") {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath);
      }
    }

    return filePath;
  } catch (error) {
    console.error("Erro ao exportar pacientes:", error);
    return null;
  }
}

// Exportar sessões para CSV
export async function exportSessionsToCSV(
  sessions: Session[],
  patients: Patient[]
): Promise<string | null> {
  try {
    // Criar mapa de pacientes para lookup rápido
    const patientMap = new Map(patients.map((p) => [p.id, p.fullName]));

    // Cabeçalho
    const headers = [
      "ID",
      "Paciente",
      "Data da Sessão",
      "Duração (min)",
      "Joules",
      "Pontos Estimulados",
      "Observações",
      "Próxima Sessão",
    ];

    // Linhas de dados
    const rows = sessions.map((session) => [
      escapeCSV(session.id),
      escapeCSV(patientMap.get(session.patientId) || "Desconhecido"),
      escapeCSV(new Date(session.sessionDate).toLocaleString("pt-BR")),
      escapeCSV(session.durationMinutes),
      escapeCSV(session.joules),
      escapeCSV(session.stimulatedPoints.join(", ")),
      escapeCSV(session.observations),
      escapeCSV(session.nextSessionDate ? new Date(session.nextSessionDate).toLocaleString("pt-BR") : ""),
    ]);

    // Montar CSV
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    // Salvar arquivo
    const fileName = `sessoes_${new Date().toISOString().split("T")[0]}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Compartilhar arquivo
    if (Platform.OS !== "web") {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath);
      }
    }

    return filePath;
  } catch (error) {
    console.error("Erro ao exportar sessões:", error);
    return null;
  }
}

// Exportar estatísticas para CSV
export async function exportStatisticsToCSV(
  patients: Patient[],
  sessions: Session[],
  plans: TherapeuticPlan[]
): Promise<string | null> {
  try {
    // Estatísticas de diagnósticos
    const diagnosisStats = patients.reduce((acc, patient) => {
      const diagnosis = patient.diagnosis || "Não especificado";
      acc[diagnosis] = (acc[diagnosis] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Estatísticas de regiões
    const regionStats = sessions.reduce((acc, session) => {
      session.stimulatedPoints.forEach((point) => {
        acc[point] = (acc[point] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Cabeçalho
    const headers = ["Categoria", "Item", "Quantidade"];

    // Linhas de dados
    const rows: string[][] = [];

    // Adicionar diagnósticos
    Object.entries(diagnosisStats).forEach(([diagnosis, count]) => {
      rows.push([escapeCSV("Diagnóstico"), escapeCSV(diagnosis), escapeCSV(count)]);
    });

    // Adicionar regiões
    Object.entries(regionStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([region, count]) => {
        rows.push([escapeCSV("Região Estimulada"), escapeCSV(region), escapeCSV(count)]);
      });

    // Adicionar estatísticas gerais
    rows.push([escapeCSV("Geral"), escapeCSV("Total de Pacientes"), escapeCSV(patients.length)]);
    rows.push([escapeCSV("Geral"), escapeCSV("Total de Sessões"), escapeCSV(sessions.length)]);
    rows.push([escapeCSV("Geral"), escapeCSV("Total de Planos"), escapeCSV(plans.length)]);

    // Montar CSV
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    // Salvar arquivo
    const fileName = `estatisticas_${new Date().toISOString().split("T")[0]}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Compartilhar arquivo
    if (Platform.OS !== "web") {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath);
      }
    }

    return filePath;
  } catch (error) {
    console.error("Erro ao exportar estatísticas:", error);
    return null;
  }
}
