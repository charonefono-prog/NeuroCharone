/**
 * Sistema de Assinatura Eletrônica
 * Integra dados do cadastro do profissional
 * Validação e armazenamento de assinaturas digitais
 */

export interface ProfessionalData {
  id: string;
  fullName: string;
  professionalLicense: string;
  licenseType: "MD" | "PT" | "OT" | "SLP" | "NURSE" | "OTHER";
  licenseNumber: string;
  licenseState?: string;
  licenseExpirationDate?: string;
  specialization?: string;
  institution?: string;
  email: string;
  phone?: string;
  crm?: string; // Conselho Regional de Medicina
  crefito?: string; // Conselho Regional de Fisioterapia
  coren?: string; // Conselho Regional de Enfermagem
}

export interface ElectronicSignature {
  id: string;
  documentId: string;
  documentType: "treatment-plan" | "assessment" | "discharge" | "report" | "consent";
  professionalId: string;
  professionalData: ProfessionalData;
  signatureData: string; // Base64 encoded signature image or digital signature
  timestamp: string; // ISO 8601 format
  ipAddress?: string;
  deviceInfo?: string;
  signatureMethod: "digital" | "drawn" | "typed";
  isValid: boolean;
  validationCode: string; // Código único para validação
}

export interface SignedDocument {
  id: string;
  documentType: "treatment-plan" | "assessment" | "discharge" | "report" | "consent";
  patientId: string;
  patientName: string;
  content: string;
  signatures: ElectronicSignature[];
  createdDate: string;
  lastModifiedDate: string;
  status: "draft" | "pending-signature" | "signed" | "archived";
  notes?: string;
}

// ============================================
// FUNÇÕES DE ASSINATURA ELETRÔNICA
// ============================================

/**
 * Cria um código de validação único para a assinatura
 */
export function generateValidationCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `SIG-${timestamp}-${random}`.toUpperCase();
}

/**
 * Valida dados do profissional
 */
export function validateProfessionalData(data: ProfessionalData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.push("Nome completo inválido");
  }

  if (!data.professionalLicense || data.professionalLicense.trim().length === 0) {
    errors.push("Tipo de licença profissional não informado");
  }

  if (!data.licenseNumber || data.licenseNumber.trim().length === 0) {
    errors.push("Número da licença não informado");
  }

  if (!data.email || !data.email.includes("@")) {
    errors.push("Email inválido");
  }

  // Validar documentos específicos por tipo de profissional
  if (data.licenseType === "MD" && !data.crm) {
    errors.push("CRM obrigatório para médicos");
  }

  if (data.licenseType === "PT" && !data.crefito) {
    errors.push("CREFITO obrigatório para fisioterapeutas");
  }

  if (data.licenseType === "NURSE" && !data.coren) {
    errors.push("COREN obrigatório para enfermeiros");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Cria uma assinatura eletrônica
 */
export function createElectronicSignature(
  documentId: string,
  documentType: SignedDocument["documentType"],
  professionalData: ProfessionalData,
  signatureData: string,
  signatureMethod: ElectronicSignature["signatureMethod"],
  ipAddress?: string,
  deviceInfo?: string
): ElectronicSignature | null {
  // Validar dados do profissional
  const validation = validateProfessionalData(professionalData);
  if (!validation.isValid) {
    console.error("Dados do profissional inválidos:", validation.errors);
    return null;
  }

  // Validar dados da assinatura
  if (!signatureData || signatureData.trim().length === 0) {
    console.error("Dados da assinatura não fornecidos");
    return null;
  }

  return {
    id: `sig_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    documentId,
    documentType,
    professionalId: professionalData.id,
    professionalData,
    signatureData,
    timestamp: new Date().toISOString(),
    ipAddress,
    deviceInfo,
    signatureMethod,
    isValid: true,
    validationCode: generateValidationCode()
  };
}

/**
 * Cria um documento assinado
 */
export function createSignedDocument(
  documentType: SignedDocument["documentType"],
  patientId: string,
  patientName: string,
  content: string,
  notes?: string
): SignedDocument {
  return {
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    documentType,
    patientId,
    patientName,
    content,
    signatures: [],
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
    status: "draft",
    notes
  };
}

/**
 * Adiciona assinatura a um documento
 */
export function addSignatureToDocument(
  document: SignedDocument,
  signature: ElectronicSignature
): SignedDocument {
  return {
    ...document,
    signatures: [...document.signatures, signature],
    lastModifiedDate: new Date().toISOString(),
    status: document.signatures.length === 0 ? "signed" : "signed"
  };
}

/**
 * Valida assinatura de um documento
 */
export function validateDocumentSignature(
  document: SignedDocument,
  signatureId: string
): {
  isValid: boolean;
  message: string;
} {
  const signature = document.signatures.find(sig => sig.id === signatureId);

  if (!signature) {
    return {
      isValid: false,
      message: "Assinatura não encontrada"
    };
  }

  if (!signature.isValid) {
    return {
      isValid: false,
      message: "Assinatura inválida"
    };
  }

  if (!signature.validationCode) {
    return {
      isValid: false,
      message: "Código de validação não encontrado"
    };
  }

  return {
    isValid: true,
    message: `Assinatura válida - Código: ${signature.validationCode}`
  };
}

/**
 * Gera certificado de assinatura
 */
export function generateSignatureCertificate(
  document: SignedDocument,
  signature: ElectronicSignature
): string {
  const certificate = `
╔════════════════════════════════════════════════════════════════╗
║           CERTIFICADO DE ASSINATURA ELETRÔNICA                ║
╚════════════════════════════════════════════════════════════════╝

DOCUMENTO:
  ID: ${document.id}
  Tipo: ${document.documentType}
  Paciente: ${document.patientName}
  Data de Criação: ${new Date(document.createdDate).toLocaleString("pt-BR")}

PROFISSIONAL:
  Nome: ${signature.professionalData.fullName}
  Licença: ${signature.professionalData.licenseType} - ${signature.professionalData.licenseNumber}
  ${signature.professionalData.crm ? `CRM: ${signature.professionalData.crm}` : ""}
  ${signature.professionalData.crefito ? `CREFITO: ${signature.professionalData.crefito}` : ""}
  ${signature.professionalData.coren ? `COREN: ${signature.professionalData.coren}` : ""}
  Email: ${signature.professionalData.email}

ASSINATURA:
  ID: ${signature.id}
  Método: ${signature.signatureMethod}
  Data/Hora: ${new Date(signature.timestamp).toLocaleString("pt-BR")}
  Código de Validação: ${signature.validationCode}
  Válida: ${signature.isValid ? "SIM" : "NÃO"}
  ${signature.ipAddress ? `IP: ${signature.ipAddress}` : ""}

OBSERVAÇÕES:
  ${document.notes || "Nenhuma observação"}

═══════════════════════════════════════════════════════════════════
Este documento foi assinado eletronicamente e tem validade legal.
Código de Validação: ${signature.validationCode}
═══════════════════════════════════════════════════════════════════
  `;

  return certificate;
}

/**
 * Exporta documento assinado em formato PDF-ready
 */
export function exportSignedDocumentForPDF(
  document: SignedDocument,
  signature: ElectronicSignature
): {
  title: string;
  content: string;
  professionalInfo: string;
  signatureInfo: string;
  validationCode: string;
} {
  return {
    title: `${document.documentType.toUpperCase()} - ${document.patientName}`,
    content: document.content,
    professionalInfo: `
Profissional: ${signature.professionalData.fullName}
Licença: ${signature.professionalData.licenseType} - ${signature.professionalData.licenseNumber}
${signature.professionalData.crm ? `CRM: ${signature.professionalData.crm}` : ""}
${signature.professionalData.crefito ? `CREFITO: ${signature.professionalData.crefito}` : ""}
${signature.professionalData.coren ? `COREN: ${signature.professionalData.coren}` : ""}
Email: ${signature.professionalData.email}
    `,
    signatureInfo: `
Assinado em: ${new Date(signature.timestamp).toLocaleString("pt-BR")}
Método: ${signature.signatureMethod}
Código de Validação: ${signature.validationCode}
    `,
    validationCode: signature.validationCode
  };
}

/**
 * Valida múltiplas assinaturas em um documento
 */
export function validateAllSignatures(document: SignedDocument): {
  allValid: boolean;
  validSignatures: number;
  invalidSignatures: number;
  details: Array<{
    signatureId: string;
    professionalName: string;
    isValid: boolean;
    message: string;
  }>;
} {
  const details = document.signatures.map(sig => ({
    signatureId: sig.id,
    professionalName: sig.professionalData.fullName,
    isValid: sig.isValid,
    message: sig.isValid ? `Válida - Código: ${sig.validationCode}` : "Inválida"
  }));

  const validSignatures = details.filter(d => d.isValid).length;
  const invalidSignatures = details.filter(d => !d.isValid).length;

  return {
    allValid: invalidSignatures === 0,
    validSignatures,
    invalidSignatures,
    details
  };
}

/**
 * Arquiva documento assinado
 */
export function archiveSignedDocument(document: SignedDocument): SignedDocument {
  return {
    ...document,
    status: "archived",
    lastModifiedDate: new Date().toISOString()
  };
}
