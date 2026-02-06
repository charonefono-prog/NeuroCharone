/**
 * Gerador de Assinatura Eletrônica para Profissionais
 * Compatível com React Native, Expo Web e navegadores
 * Não usa módulos do Node.js que não funcionam em ambiente web
 */

export interface ProfessionalSignature {
  signatureHash: string;
  signatureQRCode: string;
  signatureDate: string;
  professionalName: string;
  councilNumber: string;
  registrationNumber: string;
}

/**
 * Gera hash para assinatura eletrônica (compatível com web e React Native)
 * Usa algoritmo simples que funciona em todos os ambientes
 */
function generateSignatureHash(data: string): string {
  // Algoritmo de hash simples que funciona em todos os ambientes
  let hash = 0;
  let i = 0;

  while (i < data.length) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
    i++;
  }

  // Converter para string hexadecimal
  const hashStr = Math.abs(hash).toString(16);

  // Adicionar timestamp para garantir unicidade
  const timestamp = new Date().getTime().toString(16);

  // Combinar e retornar primeiros 16 caracteres
  return (hashStr + timestamp).substring(0, 16).toUpperCase();
}

/**
 * Gera assinatura eletrônica do profissional
 * Deve ser chamada UMA VEZ quando o perfil é completado
 */
export function generateProfessionalSignature(
  title: string,
  firstName: string,
  lastName: string,
  registrationNumber: string,
  councilNumber: string,
  email: string
): ProfessionalSignature {
  const fullName = `${title}. ${firstName} ${lastName}`;
  const signatureDate = new Date().toISOString();

  // Dados para gerar assinatura
  const signatureData = `${fullName}|${councilNumber}|${registrationNumber}|${signatureDate}`;
  const signatureHash = generateSignatureHash(signatureData);

  // QR Code contém informações da assinatura
  const qrCodeData = JSON.stringify({
    name: fullName,
    council: councilNumber,
    registration: registrationNumber,
    email: email,
    date: signatureDate,
    signature: signatureHash,
  });

  return {
    signatureHash,
    signatureQRCode: qrCodeData,
    signatureDate,
    professionalName: fullName,
    councilNumber,
    registrationNumber,
  };
}

/**
 * Valida se a assinatura eletrônica é válida
 */
export function validateSignature(
  signature: ProfessionalSignature,
  title: string,
  firstName: string,
  lastName: string,
  registrationNumber: string,
  councilNumber: string
): boolean {
  const fullName = `${title}. ${firstName} ${lastName}`;
  const signatureData = `${fullName}|${councilNumber}|${registrationNumber}|${signature.signatureDate}`;
  const expectedHash = generateSignatureHash(signatureData);

  return expectedHash === signature.signatureHash;
}

/**
 * Formata assinatura eletrônica para exibição
 */
export function formatSignatureForDisplay(signature: ProfessionalSignature): string {
  const date = new Date(signature.signatureDate).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `Assinado digitalmente por ${signature.professionalName}
Registro: ${signature.registrationNumber}
Conselho: ${signature.councilNumber}
Data: ${date}
Assinatura: ${signature.signatureHash}`;
}
