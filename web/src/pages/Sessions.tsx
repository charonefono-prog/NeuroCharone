import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const HELMET_POINTS_2D = [
  { id: 1, x: 50, y: 30, name: 'Cz', region: 'Central', function: 'Coordenação motora' },
  { id: 2, x: 40, y: 35, name: 'C3', region: 'Esquerda', function: 'Motricidade esquerda' },
  { id: 3, x: 60, y: 35, name: 'C4', region: 'Direita', function: 'Motricidade direita' },
  { id: 4, x: 30, y: 25, name: 'F3', region: 'Frontal Esquerda', function: 'Linguagem/Cognição' },
  { id: 5, x: 70, y: 25, name: 'F4', region: 'Frontal Direita', function: 'Emoção/Comportamento' },
  { id: 6, x: 50, y: 15, name: 'Fz', region: 'Frontal Central', function: 'Planejamento' },
  { id: 7, x: 20, y: 40, name: 'T3', region: 'Temporal Esquerda', function: 'Audição/Memória' },
  { id: 8, x: 80, y: 40, name: 'T4', region: 'Temporal Direita', function: 'Processamento' },
  { id: 9, x: 30, y: 55, name: 'P3', region: 'Parietal Esquerda', function: 'Sensação esquerda' },
  { id: 10, x: 70, y: 55, name: 'P4', region: 'Parietal Direita', function: 'Sensação direita' },
];

export function Sessions() {
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [view3D, setView3D] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const [sessionData, setSessionData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    intensity: 50,
    notes: '',
  });

  useEffect(() => {
    if (view3D && containerRef.current && !sceneRef.current) {
      initThreeJS();
    }
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [view3D]);

  const initThreeJS = () => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // Criar capacete 3D
    const helmetGeometry = new THREE.IcosahedronGeometry(3, 4);
    const helmetMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4a90e2,
      wireframe: false,
      transparent: true,
      opacity: 0.7
    });
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    scene.add(helmet);

    // Adicionar pontos 3D
    const pointsGroup = new THREE.Group();
    HELMET_POINTS_2D.forEach((point, idx) => {
      const angle = (idx / HELMET_POINTS_2D.length) * Math.PI * 2;
      const height = (idx % 2 === 0 ? 1 : -1) * 0.5;
      
      const pointGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const pointMaterial = new THREE.MeshPhongMaterial({ 
        color: selectedPoints.includes(point.id) ? 0xff6b6b : 0xffd93d 
      });
      const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
      
      pointMesh.position.set(
        Math.cos(angle) * 3.2,
        height * 2,
        Math.sin(angle) * 3.2
      );
      pointMesh.userData.pointId = point.id;
      pointsGroup.add(pointMesh);
    });
    scene.add(pointsGroup);

    // Iluminação
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animação
    const animate = () => {
      requestAnimationFrame(animate);
      helmet.rotation.x += 0.001;
      helmet.rotation.y += 0.002;
      pointsGroup.rotation.x += 0.001;
      pointsGroup.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = scene;
    rendererRef.current = renderer;
  };

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
  const hoveredPointData = HELMET_POINTS_2D.find(p => p.id === hoveredPoint);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">Nova Sessão</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView3D(false)}
          className={`px-4 py-2 rounded-lg ${!view3D ? 'bg-primary text-white' : 'bg-border text-foreground'}`}
        >
          Visualização 2D
        </button>
        <button
          onClick={() => setView3D(true)}
          className={`px-4 py-2 rounded-lg ${view3D ? 'bg-primary text-white' : 'bg-border text-foreground'}`}
        >
          Visualização 3D
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Visualizador */}
        <div className="col-span-2">
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Mapa do Capacete {view3D ? '(3D)' : '(Sistema 10-20)'}
            </h3>
            
            {!view3D ? (
              <svg viewBox="0 0 100 100" className="w-full bg-background rounded-lg border border-border p-4">
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
                
                {HELMET_POINTS_2D.map(point => (
                  <g key={point.id}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={hoveredPoint === point.id ? 4 : 3}
                      fill={selectedPoints.includes(point.id) ? '#0a7ea4' : '#E5E7EB'}
                      stroke={selectedPoints.includes(point.id) ? '#0a7ea4' : '#687076'}
                      strokeWidth="1"
                      style={{ cursor: 'pointer' }}
                      onClick={() => togglePoint(point.id)}
                      onMouseEnter={() => setHoveredPoint(point.id)}
                      onMouseLeave={() => setHoveredPoint(null)}
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
            ) : (
              <div
                ref={containerRef}
                className="w-full h-96 bg-background rounded-lg border border-border"
              />
            )}

            {hoveredPointData && (
              <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                <p className="font-semibold text-foreground">{hoveredPointData.name}</p>
                <p className="text-sm text-muted">{hoveredPointData.region}</p>
                <p className="text-sm text-primary mt-2">{hoveredPointData.function}</p>
              </div>
            )}
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
            <h3 className="text-lg font-semibold text-foreground mb-4">Pontos ({selectedPoints.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedPointsData.map(point => (
                <div key={point.id} className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm text-foreground font-semibold">{point.name}</span>
                  <button
                    onClick={() => togglePoint(point.id)}
                    className="text-xs text-error hover:opacity-70"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
