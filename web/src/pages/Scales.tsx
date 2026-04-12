import React, { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

interface Scale {
  id: number;
  name: string;
  description: string;
  questions: number;
}

export function Scales() {
  const [scales, setScales] = useState<Scale[]>([
    { id: 1, name: 'Escala de Comer', description: 'Avaliação de disfagia', questions: 10 },
    { id: 2, name: 'Escala Breve de Zumbido', description: 'Avaliação de tinnitus', questions: 5 },
    { id: 3, name: 'Escala de Boston', description: 'Avaliação de afasia', questions: 60 },
    { id: 4, name: 'Communication Matrix', description: 'Matriz de comunicação', questions: 8 },
    { id: 5, name: 'Escala SARA', description: 'Avaliação de ataxia', questions: 8 },
    { id: 6, name: 'QCS', description: 'Questionário de Comunicação Social', questions: 40 },
  ]);
  const [selectedScale, setSelectedScale] = useState<Scale | null>(null);
  const [responses, setResponses] = useState<Record<number, number>>({});

  const handleApplyScale = (scale: Scale) => {
    setSelectedScale(scale);
    setResponses({});
  };

  const handleSaveResponse = async () => {
    if (!selectedScale) return;
    try {
      await trpc.scales.saveResponse.mutate({
        scaleId: selectedScale.id,
        responses,
        date: new Date(),
      });
      setSelectedScale(null);
      alert('Escala salva com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar escala:', err);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">Escalas Clínicas</h2>
      
      {!selectedScale ? (
        <div className="grid grid-cols-2 gap-4">
          {scales.map((scale) => (
            <div key={scale.id} className="bg-surface p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-foreground mb-2">{scale.name}</h3>
              <p className="text-sm text-muted mb-4">{scale.description}</p>
              <p className="text-xs text-muted mb-4">{scale.questions} questões</p>
              <button
                onClick={() => handleApplyScale(scale)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 w-full"
              >
                Aplicar Escala
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface p-8 rounded-lg border border-border">
          <h3 className="text-2xl font-semibold text-foreground mb-6">{selectedScale.name}</h3>
          <div className="space-y-4 mb-6">
            {Array.from({ length: Math.min(selectedScale.questions, 5) }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background rounded-lg">
                <label className="text-foreground">Questão {i + 1}</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={responses[i] || 0}
                  onChange={(e) => setResponses({ ...responses, [i]: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-primary font-semibold">{responses[i] || 0}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedScale(null)}
              className="flex-1 px-4 py-2 bg-border text-foreground rounded-lg hover:opacity-90"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveResponse}
              className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:opacity-90"
            >
              Salvar Resposta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
