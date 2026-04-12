import React, { useState } from 'react';

interface Cycle {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
  sessions: number;
}

export function Cycles() {
  const [cycles, setCycles] = useState<Cycle[]>([
    { id: 1, name: 'Ciclo 1 - Fase Inicial', startDate: '2026-01-01', endDate: '2026-02-01', status: 'completed', sessions: 12 },
    { id: 2, name: 'Ciclo 2 - Fase Intermediária', startDate: '2026-02-01', endDate: '2026-03-01', status: 'active', sessions: 8 },
    { id: 3, name: 'Ciclo 3 - Fase Final', startDate: '2026-03-01', endDate: '2026-04-01', status: 'planned', sessions: 0 },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'active': return 'bg-primary';
      case 'planned': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'active': return 'Ativo';
      case 'planned': return 'Planejado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-foreground">Ciclos Terapêuticos</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90">
          Novo Ciclo
        </button>
      </div>

      <div className="space-y-4">
        {cycles.map((cycle) => (
          <div key={cycle.id} className="bg-surface p-6 rounded-lg border border-border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{cycle.name}</h3>
                <p className="text-sm text-muted mt-1">
                  {cycle.startDate} até {cycle.endDate}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(cycle.status)}`}>
                {getStatusLabel(cycle.status)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted">{cycle.sessions} sessões</p>
              <button className="px-4 py-2 bg-border text-foreground rounded-lg hover:opacity-90">
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
