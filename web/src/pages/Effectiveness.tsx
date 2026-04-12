import React, { useState, useRef } from 'react';
import { generateEffectivenessPDF } from '../utils/pdf-generator';

interface Patient {
  id: string;
  name: string;
  improvement: number;
}

export function Effectiveness() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const patients: Patient[] = [
    { id: '1', name: 'Paciente 1', improvement: 65 },
    { id: '2', name: 'Paciente 2', improvement: 82 },
    { id: '3', name: 'Paciente 3', improvement: 45 },
    { id: '4', name: 'Paciente 4', improvement: 78 },
  ];

  const getColor = (value: number) => {
    if (value >= 75) return 'bg-success';
    if (value >= 50) return 'bg-primary';
    return 'bg-warning';
  };

  const handleExportPDF = async () => {
    if (!selectedPatient) return;
    
    setIsGeneratingPDF(true);
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      if (!patient) return;

      const effectivenessData = {
        averageImprovement: patient.improvement,
        sessionsCompleted: 12,
        successRate: 75,
        scales: [
          { name: 'Escala de Boston', score: 85 },
          { name: 'Escala de Comer', score: 72 },
          { name: 'SARA', score: 68 },
        ],
      };

      const doc = await generateEffectivenessPDF(
        patient.name,
        'Dr. Carlos',
        effectivenessData
      );

      doc.save(`relatorio-efetividade-${patient.name}.pdf`);
      alert('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">Efetividade do Tratamento</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Resumo */}
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Resumo Geral</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-background rounded-lg">
              <span className="text-foreground">Melhora Média</span>
              <span className="text-2xl font-bold text-primary">67%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-background rounded-lg">
              <span className="text-foreground">Pacientes Melhorados</span>
              <span className="text-2xl font-bold text-success">3/4</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-background rounded-lg">
              <span className="text-foreground">Taxa de Sucesso</span>
              <span className="text-2xl font-bold text-primary">75%</span>
            </div>
          </div>
        </div>

        {/* Gráfico de Efetividade */}
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Progresso por Paciente</h3>
          <div className="space-y-3">
            {patients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedPatient === patient.id
                    ? 'bg-primary text-white'
                    : 'bg-background hover:bg-border'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{patient.name}</span>
                  <span className="text-sm">{patient.improvement}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getColor(patient.improvement)}`}
                    style={{ width: `${patient.improvement}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detalhes do Paciente */}
      {selectedPatient && (
        <div className="mt-6 bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Detalhes - {patients.find(p => p.id === selectedPatient)?.name}
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-background p-4 rounded-lg">
              <p className="text-sm text-muted mb-2">Sessões Realizadas</p>
              <p className="text-2xl font-bold text-primary">12</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-sm text-muted mb-2">Melhora Registrada</p>
              <p className="text-2xl font-bold text-success">+{patients.find(p => p.id === selectedPatient)?.improvement}%</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-sm text-muted mb-2">Última Sessão</p>
              <p className="text-sm text-foreground">Há 2 dias</p>
            </div>
          </div>
          <button
            onClick={handleExportPDF}
            disabled={isGeneratingPDF}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isGeneratingPDF ? 'Gerando PDF...' : 'Exportar Relatório PDF'}
          </button>
        </div>
      )}
    </div>
  );
}
