import * as FileSystem from "expo-file-system/legacy";
import { Share } from "react-native";
import { ScaleResponse } from "./clinical-scales";
import { ProfessionalInfo } from "@/hooks/use-professional-info";
import { generateScalePDFHTML } from "./scale-pdf-generator";

export interface PatientInfo {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  diagnosis?: string;
  phone?: string;
}

/**
 * Gera um arquivo PDF do resultado da escala
 */
export async function exportScaleResultToPDF(
  scaleResponse: ScaleResponse,
  professional: ProfessionalInfo,
  patient: PatientInfo
): Promise<string | null> {
  try {
    // Gerar HTML
    const htmlContent = generateScalePDFHTML(scaleResponse, professional, patient);

    // Criar nome do arquivo
    const fileName = `escala_${scaleResponse.scaleType}_${Date.now()}.html`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    // Salvar arquivo HTML
    await FileSystem.writeAsStringAsync(filePath, htmlContent);

    return filePath;
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    return null;
  }
}

/**
 * Compartilha um arquivo PDF
 */
export async function sharePDFFile(
  filePath: string,
  title: string,
  message: string
): Promise<boolean> {
  try {
    await Share.share({
      url: filePath,
      title,
      message,
    });
    return true;
  } catch (error) {
    console.error("Erro ao compartilhar arquivo:", error);
    return false;
  }
}

/**
 * Exporta e compartilha resultado de escala em PDF
 */
export async function exportAndShareScaleResult(
  scaleResponse: ScaleResponse,
  professional: ProfessionalInfo,
  patient: PatientInfo
): Promise<boolean> {
  try {
    // Exportar para PDF
    const pdfPath = await exportScaleResultToPDF(
      scaleResponse,
      professional,
      patient
    );

    if (!pdfPath) {
      console.error("Falha ao gerar PDF");
      return false;
    }

    // Compartilhar
    const shared = await sharePDFFile(
      pdfPath,
      `Resultado - ${scaleResponse.scaleName}`,
      `Resultado da escala ${scaleResponse.scaleName} para ${patient.fullName}`
    );

    return shared;
  } catch (error) {
    console.error("Erro ao exportar e compartilhar:", error);
    return false;
  }
}
