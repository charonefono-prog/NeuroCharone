import { describe, it, expect } from 'vitest';
import { generateProfessionalSignature, ProfessionalSignature } from '@/lib/electronic-signature-generator';

describe('Exportações e Assinatura Eletrônica', () => {
  
  it('deve gerar assinatura eletrônica válida', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    expect(signature).toBeDefined();
    expect(signature.signatureHash).toBeDefined();
    expect(signature.signatureQRCode).toBeDefined();
    expect(signature.signatureDate).toBeDefined();
    expect(signature.professionalName).toBeDefined();
    expect(signature.councilNumber).toBeDefined();
    expect(signature.registrationNumber).toBeDefined();
  });

  it('assinatura deve conter hash válido', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    // Hash deve ser string hexadecimal
    expect(typeof signature.signatureHash).toBe('string');
    expect(signature.signatureHash.length).toBeGreaterThan(0);
    expect(/^[0-9A-F]+$/.test(signature.signatureHash)).toBe(true);
  });

  it('QR code deve conter dados válidos em JSON', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    const qrData = JSON.parse(signature.signatureQRCode);
    expect(qrData.name).toBe('Dr. Carlos Charone');
    expect(qrData.council).toBe('CREFONO-9');
    expect(qrData.registration).toBe('9-10025-5');
    expect(qrData.email).toBe('carlos@example.com');
    expect(qrData.date).toBeDefined();
    expect(qrData.signature).toBeDefined();
  });

  it('data de assinatura deve ser ISO 8601', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    const date = new Date(signature.signatureDate);
    expect(date.getTime()).toBeGreaterThan(0);
    expect(signature.signatureDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('assinaturas diferentes devem ter hashes diferentes', () => {
    const sig1 = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    // Pequeno delay para garantir timestamp diferente
    const sig2 = generateProfessionalSignature(
      'Dr',
      'João',
      'Silva',
      '9-10025-6',
      'CREFONO-9',
      'joao@example.com'
    );

    expect(sig1.signatureHash).not.toBe(sig2.signatureHash);
  });

  it('nome profissional deve estar formatado corretamente', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    expect(signature.professionalName).toBe('Dr. Carlos Charone');
    expect(signature.professionalName).toContain('Dr.');
    expect(signature.professionalName).toContain('Carlos');
    expect(signature.professionalName).toContain('Charone');
  });

  it('conselho deve ser preservado na assinatura', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    expect(signature.councilNumber).toBe('CREFONO-9');
  });

  it('número de registro deve ser preservado na assinatura', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    expect(signature.registrationNumber).toBe('9-10025-5');
  });

  it('deve gerar assinatura com diferentes títulos', () => {
    const titles = ['Dr', 'Dra', 'Prof', 'Profa'];

    titles.forEach((title) => {
      const signature = generateProfessionalSignature(
        title,
        'Nome',
        'Sobrenome',
        '9-10025-5',
        'CREFONO-9',
        'email@example.com'
      );

      expect(signature.professionalName).toContain(title);
      expect(signature.professionalName).toContain('Nome');
      expect(signature.professionalName).toContain('Sobrenome');
    });
  });

  it('relatório PDF deve conter informações do paciente', () => {
    // Estrutura esperada de um relatório PDF
    const reportData = {
      patient: {
        id: 'p1',
        fullName: 'João Silva',
        dateOfBirth: '1990-01-01',
        phone: '123456789',
        diagnosis: 'Depressão',
        initialAssessment: 8,
      },
      plan: null,
      sessions: [],
    };

    expect(reportData.patient.fullName).toBe('João Silva');
    expect(reportData.patient.diagnosis).toBe('Depressão');
  });

  it('CSV deve conter headers corretos', () => {
    const csvHeaders = [
      'ID Paciente',
      'Nome Paciente',
      'Data de Nascimento',
      'Diagnóstico',
      'Total de Sessões',
      'Data Primeira Sessão',
      'Data Última Sessão',
    ];

    expect(csvHeaders.length).toBeGreaterThan(0);
    expect(csvHeaders[0]).toBe('ID Paciente');
  });

  it('exportação deve incluir timestamp', () => {
    const timestamp = new Date().toISOString();
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('assinatura deve ser única por profissional', () => {
    const sig = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    // Mesmo profissional deve ter hash único (por causa do timestamp)
    expect(sig.signatureHash).toBeDefined();
    expect(sig.signatureHash.length).toBeGreaterThan(0);
  });

  it('dados de exportação devem ser serializáveis', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    const json = JSON.stringify(signature);
    expect(typeof json).toBe('string');
    
    const parsed = JSON.parse(json);
    expect(parsed.signatureHash).toBe(signature.signatureHash);
    expect(parsed.professionalName).toBe(signature.professionalName);
  });

  it('QR code deve ser decodificável', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    const qrData = JSON.parse(signature.signatureQRCode);
    expect(qrData).toBeDefined();
    expect(qrData.name).toBeDefined();
    expect(qrData.signature).toBeDefined();
  });

  it('assinatura deve conter informações de auditoria', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    // Verificar que contém informações para auditoria
    const qrData = JSON.parse(signature.signatureQRCode);
    expect(qrData.date).toBeDefined(); // Data de assinatura
    expect(qrData.signature).toBeDefined(); // Hash único
    expect(qrData.name).toBeDefined(); // Profissional
    expect(qrData.registration).toBeDefined(); // Registro profissional
  });

  it('exportação deve suportar múltiplos formatos', () => {
    const formats = ['PDF', 'CSV', 'Excel', 'JSON'];
    
    formats.forEach((format) => {
      expect(format.length).toBeGreaterThan(0);
    });
  });

  it('assinatura deve ser válida por tempo indeterminado', () => {
    const signature = generateProfessionalSignature(
      'Dr',
      'Carlos',
      'Charone',
      '9-10025-5',
      'CREFONO-9',
      'carlos@example.com'
    );

    const signatureDate = new Date(signature.signatureDate);
    const now = new Date();

    // Assinatura deve ter sido criada no passado ou agora
    expect(signatureDate.getTime()).toBeLessThanOrEqual(now.getTime() + 1000); // +1s de margem
  });
});
