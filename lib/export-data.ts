import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import type { Patient, Session, TherapeuticPlan } from "./local-storage";

/**
 * Exporta lista de pacientes para Excel
 */
export async function exportPatientsToExcel(patients: Patient[]): Promise<void> {
  const data = patients.map((patient) => ({
    "Nome Completo": patient.fullName,
    "Data de Nascimento": new Date(patient.birthDate).toLocaleDateString("pt-BR"),
    Telefone: patient.phone || "-",
    Email: patient.email || "-",
    Diagnóstico: patient.diagnosis || "-",
    "Avaliação Inicial": patient.initialSymptomScore !== undefined ? patient.initialSymptomScore : "-",
    Status: patient.status === "active" ? "Ativo" : patient.status === "paused" ? "Pausado" : "Concluído",
    "Data de Cadastro": new Date(patient.createdAt).toLocaleDateString("pt-BR"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientes");

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 30 }, // Nome Completo
    { wch: 18 }, // Data de Nascimento
    { wch: 18 }, // Telefone
    { wch: 30 }, // Email
    { wch: 40 }, // Diagnóstico
    { wch: 18 }, // Avaliação Inicial
    { wch: 12 }, // Status
    { wch: 18 }, // Data de Cadastro
  ];
  worksheet["!cols"] = colWidths;

  await saveAndShareWorkbook(workbook, "pacientes");
}

/**
 * Exporta lista de sessões para Excel
 */
export async function exportSessionsToExcel(
  sessions: Session[],
  patients: Patient[],
  plans: TherapeuticPlan[]
): Promise<void> {
  const data = sessions.map((session) => {
    const patient = patients.find((p) => p.id === session.patientId);
    const plan = plans.find((p) => p.id === session.planId);

    return {
      Paciente: patient?.fullName || "Desconhecido",
      "Plano Terap\u00eautico": plan?.objective || "Desconhecido",
      Data: new Date(session.sessionDate).toLocaleDateString("pt-BR"),
      Hor\u00e1rio: new Date(session.sessionDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      "Dura\u00e7\u00e3o": `${session.durationMinutes} min`,
      Joules: session.joules || "-",
      "Pontos Estimulados": session.stimulatedPoints.join(", "),
      "Avalia\u00e7\u00e3o de Sintomas": session.symptomScore !== undefined ? session.symptomScore : "-",
      Observa\u00e7\u00f5es: session.observations || "-",
      "Rea\u00e7\u00f5es do Paciente": session.patientReactions || "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sessões");

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 30 }, // Paciente
    { wch: 40 }, // Plano Terapêutico
    { wch: 12 }, // Data
    { wch: 10 }, // Horário
    { wch: 12 }, // Duração
    { wch: 12 }, // Frequência
    { wch: 10 }, // Joules
    { wch: 40 }, // Pontos Estimulados
    { wch: 20 }, // Avaliação de Sintomas
    { wch: 50 }, // Observações
  ];
  worksheet["!cols"] = colWidths;

  await saveAndShareWorkbook(workbook, "sessoes");
}

/**
 * Exporta estatísticas para Excel
 */
export async function exportStatisticsToExcel(
  patients: Patient[],
  sessions: Session[],
  plans: TherapeuticPlan[]
): Promise<void> {
  const workbook = XLSX.utils.book_new();

  // Aba 1: Resumo Geral
  const summaryData = [
    { Métrica: "Total de Pacientes", Valor: patients.length },
    { Métrica: "Pacientes Ativos", Valor: patients.filter((p) => p.status === "active").length },
    { Métrica: "Pacientes Pausados", Valor: patients.filter((p) => p.status === "paused").length },
    { Métrica: "Pacientes Concluídos", Valor: patients.filter((p) => p.status === "completed").length },
    { Métrica: "Total de Sessões", Valor: sessions.length },
    { Métrica: "Total de Planos Terapêuticos", Valor: plans.length },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 30 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumo Geral");

  // Aba 2: Distribuição de Diagnósticos
  const diagnosisStats = patients.reduce(
    (acc, patient) => {
      const diagnosis = patient.diagnosis || "Não especificado";
      acc[diagnosis] = (acc[diagnosis] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const diagnosisData = Object.entries(diagnosisStats)
    .map(([diagnosis, count]) => ({ Diagnóstico: diagnosis, "Número de Pacientes": count }))
    .sort((a, b) => b["Número de Pacientes"] - a["Número de Pacientes"]);
  const diagnosisSheet = XLSX.utils.json_to_sheet(diagnosisData);
  diagnosisSheet["!cols"] = [{ wch: 40 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, diagnosisSheet, "Diagnósticos");

  // Aba 3: Pontos Mais Estimulados
  const pointStats = sessions.reduce(
    (acc, session) => {
      session.stimulatedPoints.forEach((point) => {
        acc[point] = (acc[point] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );
  const pointData = Object.entries(pointStats)
    .map(([point, count]) => ({ Ponto: point, "Número de Sessões": count }))
    .sort((a, b) => b["Número de Sessões"] - a["Número de Sessões"])
    .slice(0, 20);
  const pointSheet = XLSX.utils.json_to_sheet(pointData);
  pointSheet["!cols"] = [{ wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, pointSheet, "Pontos Mais Estimulados");

  // Aba 4: Sessões por Mês
  const sessionsByMonth = sessions.reduce(
    (acc, session) => {
      const date = new Date(session.sessionDate);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const monthData = Object.entries(sessionsByMonth)
    .map(([month, count]) => ({ "Mês/Ano": month, "Número de Sessões": count }))
    .sort((a, b) => {
      const [aMonth, aYear] = a["Mês/Ano"].split("/").map(Number);
      const [bMonth, bYear] = b["Mês/Ano"].split("/").map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });
  const monthSheet = XLSX.utils.json_to_sheet(monthData);
  monthSheet["!cols"] = [{ wch: 15 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, monthSheet, "Sessões por Mês");

  await saveAndShareWorkbook(workbook, "estatisticas");
}

/**
 * Salva workbook e compartilha
 */
async function saveAndShareWorkbook(workbook: XLSX.WorkBook, filename: string): Promise<void> {
  try {
    // Gerar arquivo Excel
    const wbout = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });

    // Salvar arquivo
    const fileUri = `${FileSystem.documentDirectory}${filename}_${Date.now()}.xlsx`;
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Compartilhar arquivo
    if (Platform.OS !== "web") {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: `Exportar ${filename}`,
          UTI: "com.microsoft.excel.xlsx",
        });
      }
    } else {
      // No web, fazer download
      const link = document.createElement("a");
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${wbout}`;
      link.download = `${filename}_${Date.now()}.xlsx`;
      link.click();
    }
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
}
