import React, { useState } from 'react';

const HELMET_POINTS_2D = [
  { id: 1, x: 50, y: 30, name: 'Cz', region: 'Central' },
  { id: 2, x: 40, y: 35, name: 'C3', region: 'Esquerda' },
  { id: 3, x: 60, y: 35, name: 'C4', region: 'Direita' },
  { id: 4, x: 30, y: 25, name: 'F3', region: 'Frontal Esquerda' },
  { id: 5, x: 70, y: 25, name: 'F4', region: 'Frontal Direita' },
  { id: 6, x: 50, y: 15, name: 'Fz', region: 'Frontal Central' },
  { id: 7, x: 20, y: 40, name: 'T3', region: 'Temporal Esquerda' },
  { id: 8, x: 80, y: 40, name: 'T4', region: 'Temporal Direita' },
  { id: 9, x: 30, y: 55, name: 'P3', region: 'Parietal Esquerda' },
  { id: 10, x: 70, y: 55, name: 'P4', region: 'Parietal Direita' },
];

export function Sessions() {
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [sessionData, setSessionData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    intensity: 50,
    notes: '',
  });

  const togglePoint = (pointId: number) => {
    setSelectedPoints(prev =>
      prev.includes(pointId)
        ? prev.filter(id => id !== pointId)
        : [...prev, pointId]
    );
  };

  const handleSaveSession = async () => {
    console.log('Salvando sessão:', {
      ...sessionData,
      selectedPoints,
    });
    alert('Sessão salva com sucesso!');
  };

  const selectedPointsData = HELMET_POINTS_2D.filter(p => selectedPoints.includes(p.id));

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">Nova Sessão</h2>

      <div className="grid grid-cols-3 gap-6">
        {/* Visualizador 2D */}
        <div className="col-span-2">
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">Mapa do Capacete (Sistema 10-20)</h3>
            <svg viewBox="0 0 100 100" className="w-full bg-background rounded-lg border border-border p-4">
              {/* Cabeça */}
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
              
              {/* Pontos */}
              {HELMET_POINTS_2D.map(point => (
                <g key={point.id}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill={selectedPoints.includes(point.id) ? '#0a7ea4' : '#E5E7EB'}
                    stroke={selectedPoints.includes(point.id) ? '#0a7ea4' : '#687076'}
                    strokeWidth="1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => togglePoint(point.id)}
                  />
                  <text
                    x={point.x}
                    y={point.y - 5}
                    fontSize="6"
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-foreground pointer-events-none"
                  >
                    {point.name}
                  </text>
                </g>
              ))}
            </svg>
            <p className="text-sm text-muted mt-4">Clique nos pontos para selecionar</p>
          </div>
        </div>

        {/* Painel de Controle */}
        <div className="space-y-4">
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Dados da Sessão</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-2">Paciente</label>
                <input
                  type="text"
                  value={sessionData.patientId}
                  onChange={(e) => setSessionData({ ...sessionData, patientId: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                  placeholder="ID do paciente"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Data</label>
                <input
                  type="date"
                  value={sessionData.date}
                  onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Duração (min): {sessionData.duration}</label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={sessionData.duration}
                  onChange={(e) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Intensidade: {sessionData.intensity}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sessionData.intensity}
                  onChange={(e) => setSessionData({ ...sessionData, intensity: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Notas</label>
                <textarea
                  value={sessionData.notes}
                  onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                  rows={3}
                  placeholder="Observações..."
                />
              </div>

              <button
                onClick={handleSaveSession}
                className="w-full px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 font-semibold"
              >
                Salvar Sessão
              </button>
            </div>
          </div>

          {/* Pontos Selecionados */}
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Pontos Selecionados ({selectedPoints.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedPointsData.map(point => (
                <div key={point.id} className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm text-foreground font-semibold">{point.name}</span>
                  <span className="text-xs text-muted">{point.region}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
