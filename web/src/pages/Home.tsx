import React from 'react';

export function Home() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">Home</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface p-6 rounded-lg border border-border">
          <div className="text-4xl font-bold text-primary">4</div>
          <p className="text-muted mt-2">Total Pacientes</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <div className="text-4xl font-bold text-primary">4</div>
          <p className="text-muted mt-2">Ativos</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <div className="text-4xl font-bold text-primary">2</div>
          <p className="text-muted mt-2">Sessões Hoje</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <div className="text-4xl font-bold text-primary">4</div>
          <p className="text-muted mt-2">Esta Semana</p>
        </div>
      </div>
    </div>
  );
}
