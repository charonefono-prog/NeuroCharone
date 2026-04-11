/**
 * Helmet 3D Visualization
 * Sistema 10-20 EEG com visualização interativa 3D
 */

// Definição dos pontos do sistema 10-20 em coordenadas 3D
// Usando esfera unitária (raio = 1)
const HELMET_POINTS_3D = {
  // Referência
  'Nz': { x: 0, y: 1, z: 0.3, label: 'Nz', region: 'ref' },
  'Iz': { x: 0, y: -1, z: 0.3, label: 'Iz', region: 'ref' },
  
  // Frontal Anterior
  'Fp1': { x: -0.3, y: 0.9, z: 0.4, label: 'Fp1', region: 'fa' },
  'Fp2': { x: 0.3, y: 0.9, z: 0.4, label: 'Fp2', region: 'fa' },
  'Fpz': { x: 0, y: 0.95, z: 0.3, label: 'Fpz', region: 'fa' },
  
  // Frontal Anterior-Média
  'AF3': { x: -0.25, y: 0.8, z: 0.5, label: 'AF3', region: 'fam' },
  'AF4': { x: 0.25, y: 0.8, z: 0.5, label: 'AF4', region: 'fam' },
  'AFz': { x: 0, y: 0.85, z: 0.5, label: 'AFz', region: 'fam' },
  
  // Frontal Média
  'F3': { x: -0.35, y: 0.6, z: 0.7, label: 'F3', region: 'fm' },
  'F4': { x: 0.35, y: 0.6, z: 0.7, label: 'F4', region: 'fm' },
  'F7': { x: -0.6, y: 0.5, z: 0.6, label: 'F7', region: 'fm' },
  'F8': { x: 0.6, y: 0.5, z: 0.6, label: 'F8', region: 'fm' },
  'Fz': { x: 0, y: 0.7, z: 0.7, label: 'Fz', region: 'fm' },
  
  // Central/Sensório-Motora
  'FC1': { x: -0.25, y: 0.5, z: 0.85, label: 'FC1', region: 'csm' },
  'FC2': { x: 0.25, y: 0.5, z: 0.85, label: 'FC2', region: 'csm' },
  'FC5': { x: -0.6, y: 0.3, z: 0.75, label: 'FC5', region: 'csm' },
  'FC6': { x: 0.6, y: 0.3, z: 0.75, label: 'FC6', region: 'csm' },
  'C3': { x: -0.7, y: 0.1, z: 0.7, label: 'C3', region: 'csm' },
  'C4': { x: 0.7, y: 0.1, z: 0.7, label: 'C4', region: 'csm' },
  'Cz': { x: 0, y: 0.2, z: 0.98, label: 'Cz', region: 'csm' },
  'CP1': { x: -0.25, y: -0.3, z: 0.9, label: 'CP1', region: 'csm' },
  'CP2': { x: 0.25, y: -0.3, z: 0.9, label: 'CP2', region: 'csm' },
  'CP5': { x: -0.6, y: -0.5, z: 0.75, label: 'CP5', region: 'csm' },
  'CP6': { x: 0.6, y: -0.5, z: 0.75, label: 'CP6', region: 'csm' },
  
  // Temporal
  'T3': { x: -1, y: 0.1, z: 0.2, label: 'T3', region: 'temp' },
  'T4': { x: 1, y: 0.1, z: 0.2, label: 'T4', region: 'temp' },
  'T5': { x: -0.95, y: -0.3, z: 0.1, label: 'T5', region: 'temp' },
  'T6': { x: 0.95, y: -0.3, z: 0.1, label: 'T6', region: 'temp' },
  
  // Parietal
  'P3': { x: -0.45, y: -0.5, z: 0.7, label: 'P3', region: 'par' },
  'P4': { x: 0.45, y: -0.5, z: 0.7, label: 'P4', region: 'par' },
  'Pz': { x: 0, y: -0.4, z: 0.92, label: 'Pz', region: 'par' },
  
  // Occipital Anterior
  'PO3': { x: -0.35, y: -0.7, z: 0.6, label: 'PO3', region: 'oa' },
  'POz': { x: 0, y: -0.75, z: 0.66, label: 'POz', region: 'oa' },
  'PO4': { x: 0.35, y: -0.7, z: 0.6, label: 'PO4', region: 'oa' },
  
  // Occipital
  'O1': { x: -0.3, y: -0.9, z: 0.3, label: 'O1', region: 'occ' },
  'O2': { x: 0.3, y: -0.9, z: 0.3, label: 'O2', region: 'occ' },
  'Oz': { x: 0, y: -0.95, z: 0.3, label: 'Oz', region: 'occ' }
};

// Informações dos pontos
const POINT_INFO = {
  'F3': { name: 'F3', region: 'Frontal Esquerda', function: 'Córtex pré-frontal dorsolateral esquerdo - Depressão, cognição' },
  'F4': { name: 'F4', region: 'Frontal Direita', function: 'Córtex pré-frontal dorsolateral direita - Ansiedade, emoção' },
  'F7': { name: 'F7', region: 'Frontal Anterior Esquerda', function: 'Área de Broca - Linguagem expressiva' },
  'F8': { name: 'F8', region: 'Frontal Anterior Direita', function: 'Processamento emocional e social' },
  'Fz': { name: 'Fz', region: 'Frontal Central', function: 'Córtex pré-frontal medial - Controle executivo' },
  'C3': { name: 'C3', region: 'Central Esquerda', function: 'Córtex motor primário esquerdo' },
  'C4': { name: 'C4', region: 'Central Direita', function: 'Córtex motor primário direito' },
  'Cz': { name: 'Cz', region: 'Central', function: 'Córtex motor suplementar' },
  'T3': { name: 'T3', region: 'Temporal Esquerda', function: 'Área de Wernicke - Linguagem receptiva' },
  'T4': { name: 'T4', region: 'Temporal Direita', function: 'Processamento auditivo e memória' },
  'P3': { name: 'P3', region: 'Parietal Esquerda', function: 'Processamento sensorial esquerdo' },
  'P4': { name: 'P4', region: 'Parietal Direita', function: 'Processamento sensorial direito' },
  'Pz': { name: 'Pz', region: 'Parietal Central', function: 'Integração sensório-motora' },
  'O1': { name: 'O1', region: 'Occipital Esquerda', function: 'Córtex visual esquerdo' },
  'O2': { name: 'O2', region: 'Occipital Direita', function: 'Córtex visual direito' },
  'Oz': { name: 'Oz', region: 'Occipital Central', function: 'Processamento visual central' }
};

// Cores das regiões
const REGION_COLORS = {
  'ref': '#999999',
  'fa': '#FF69B4',
  'fam': '#FFA500',
  'fm': '#FFFF00',
  'csm': '#00FF00',
  'temp': '#00BFFF',
  'par': '#8A2BE2',
  'oa': '#FF4500',
  'occ': '#DC143C'
};

class Helmet3D {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) throw new Error('Canvas not found');
    
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    this.selectedPoints = new Set(options.selectedPoints || []);
    this.onPointSelect = options.onPointSelect || (() => {});
    this.onPointInfo = options.onPointInfo || (() => {});
    
    this.rotation = { x: 0, y: 0 };
    this.zoom = 1;
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    
    this.setupEventListeners();
    this.animate();
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.isDragging = false);
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));
  }
  
  onMouseDown(e) {
    this.isDragging = true;
    this.lastMouse = { x: e.clientX, y: e.clientY };
  }
  
  onMouseMove(e) {
    if (!this.isDragging) return;
    const dx = e.clientX - this.lastMouse.x;
    const dy = e.clientY - this.lastMouse.y;
    this.rotation.y += dx * 0.01;
    this.rotation.x += dy * 0.01;
    this.lastMouse = { x: e.clientX, y: e.clientY };
  }
  
  onWheel(e) {
    e.preventDefault();
    this.zoom *= (1 - e.deltaY * 0.001);
    this.zoom = Math.max(0.5, Math.min(3, this.zoom));
  }
  
  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Verificar qual ponto foi clicado
    for (const [pointId, point3d] of Object.entries(HELMET_POINTS_3D)) {
      const projected = this.projectPoint(point3d);
      const dx = projected.x - x;
      const dy = projected.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 15) {
        // Ponto clicado
        if (this.selectedPoints.has(pointId)) {
          this.selectedPoints.delete(pointId);
        } else {
          this.selectedPoints.add(pointId);
        }
        this.onPointSelect(Array.from(this.selectedPoints));
        
        // Mostrar informações
        if (POINT_INFO[pointId]) {
          this.onPointInfo(pointId, POINT_INFO[pointId]);
        }
        break;
      }
    }
  }
  
  projectPoint(point3d) {
    // Aplicar rotação
    let x = point3d.x;
    let y = point3d.y;
    let z = point3d.z;
    
    // Rotação em X
    const cosX = Math.cos(this.rotation.x);
    const sinX = Math.sin(this.rotation.x);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    
    // Rotação em Y
    const cosY = Math.cos(this.rotation.y);
    const sinY = Math.sin(this.rotation.y);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;
    
    // Projeção perspectiva
    const scale = 200 * this.zoom / (2 + z2);
    const screenX = this.width / 2 + x2 * scale;
    const screenY = this.height / 2 + y1 * scale;
    
    return { x: screenX, y: screenY, z: z2 };
  }
  
  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
  
  draw() {
    // Limpar canvas
    this.ctx.fillStyle = 'var(--surface)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Desenhar pontos
    const projectedPoints = [];
    for (const [pointId, point3d] of Object.entries(HELMET_POINTS_3D)) {
      const proj = this.projectPoint(point3d);
      projectedPoints.push({ id: pointId, proj, point3d });
    }
    
    // Ordenar por profundidade (z)
    projectedPoints.sort((a, b) => a.proj.z - b.proj.z);
    
    // Desenhar pontos
    for (const { id, proj } of projectedPoints) {
      const isSelected = this.selectedPoints.has(id);
      const region = HELMET_POINTS_3D[id].region;
      const color = REGION_COLORS[region] || '#999';
      
      this.ctx.fillStyle = isSelected ? 'rgba(255, 0, 0, 0.8)' : color;
      this.ctx.beginPath();
      this.ctx.arc(proj.x, proj.y, isSelected ? 8 : 6, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Borda
      this.ctx.strokeStyle = isSelected ? '#FF0000' : '#fff';
      this.ctx.lineWidth = isSelected ? 3 : 2;
      this.ctx.stroke();
      
      // Label
      this.ctx.fillStyle = 'var(--fg)';
      this.ctx.font = 'bold 10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(id, proj.x, proj.y + 15);
    }
    
    // Instruções
    this.ctx.fillStyle = 'var(--muted)';
    this.ctx.font = '11px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Arraste para girar • Scroll para zoom • Clique para selecionar', 10, this.height - 10);
  }
  
  selectPoint(pointId) {
    this.selectedPoints.add(pointId);
    this.onPointSelect(Array.from(this.selectedPoints));
  }
  
  deselectPoint(pointId) {
    this.selectedPoints.delete(pointId);
    this.onPointSelect(Array.from(this.selectedPoints));
  }
  
  clearSelection() {
    this.selectedPoints.clear();
    this.onPointSelect([]);
  }
  
  getSelectedPoints() {
    return Array.from(this.selectedPoints);
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.Helmet3D = Helmet3D;
  window.HELMET_POINTS_3D = HELMET_POINTS_3D;
  window.POINT_INFO = POINT_INFO;
  window.REGION_COLORS = REGION_COLORS;
}
