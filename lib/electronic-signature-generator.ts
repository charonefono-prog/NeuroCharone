/**
 * Gerador de Assinatura Eletrônica para Profissionais
 * Cria assinatura única baseada nos dados do profissional
 */

import * as crypto from 'crypto';

export interface ProfessionalSignature {
  signatureHash: string;
  signatureQRCode: string;
  signatureDate: string;
  professionalName: string;
  councilNumber: string;
  registrationNumber: string;
}

/**
 * Gera hash SHA-256 para assinatura eletrônica
 */
function generateSignatureHash(data: string): string {
  try {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();
  } catch {
    // Fallback para navegador
    return generateSimpleHash(data);
  }
}

/**
 * Fallback para geração de hash em ambiente web
 */
function generateSimpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).substring(0, 16).toUpperCase();
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
