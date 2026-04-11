/**
 * Helmet 2D Visualization - Sistema 10-20 EEG
 * Visualizador 2D interativo com imagem do capacete e seleção de pontos
 * Cores e funções neuroanatômicas correspondentes
 */

// Coordenadas dos pontos na imagem (em percentual de largura/altura)
// Baseado na imagem do sistema 10-20
const HELMET_POINTS_2D = {
  // Referência
  'Nz': { x: 50, y: 8, region: 'ref', color: '#999999', function: 'Nasion - Referência anterior' },
  'Iz': { x: 50, y: 92, region: 'ref', color: '#999999', function: 'Inion - Referência posterior' },
  
  // Frontal Anterior (Rosa/Magenta)
  'Fp1': { x: 35, y: 12, region: 'fa', color: '#E91E63', function: 'Pré-frontal Anterior Esquerda - Atenção, memória de trabalho' },
  'Fpz': { x: 50, y: 10, region: 'fa', color: '#E91E63', function: 'Pré-frontal Anterior Central - Controle atencional' },
  'Fp2': { x: 65, y: 12, region: 'fa', color: '#E91E63', function: 'Pré-frontal Anterior Direita - Atenção, memória de trabalho' },
  
  // Frontal Anterior-Média (Laranja)
  'AF7': { x: 25, y: 18, region: 'fam', color: '#FF9800', function: 'Frontal Anterior Esquerda - Processamento emocional' },
  'AF3': { x: 38, y: 20, region: 'fam', color: '#FF9800', function: 'Frontal Anterior-Média Esquerda - Regulação emocional' },
  'AFz': { x: 50, y: 22, region: 'fam', color: '#FF9800', function: 'Frontal Anterior-Média Central - Controle executivo' },
  'AF4': { x: 62, y: 20, region: 'fam', color: '#FF9800', function: 'Frontal Anterior-Média Direita - Regulação emocional' },
  'AF8': { x: 75, y: 18, region: 'fam', color: '#FF9800', function: 'Frontal Anterior Direita - Processamento emocional' },
  
  // Frontal Média (Amarelo)
  'F9': { x: 15, y: 28, region: 'fm', color: '#FFD700', function: 'Frontal Anterior Esquerda - Linguagem expressiva' },
  'F7': { x: 22, y: 32, region: 'fm', color: '#FFD700', function: 'Área de Broca Esquerda - Linguagem expressiva, fala' },
  'F5': { x: 32, y: 35, region: 'fm', color: '#FFD700', function: 'Frontal Média Esquerda - Planejamento motor' },
  'F3': { x: 42, y: 36, region: 'fm', color: '#FFD700', function: 'Córtex Pré-frontal Dorsolateral Esquerdo - Depressão, cognição' },
  'F1': { x: 48, y: 37, region: 'fm', color: '#FFD700', function: 'Frontal Média Central Esquerda - Controle motor' },
  'Fz': { x: 50, y: 38, region: 'fm', color: '#FFD700', function: 'Córtex Pré-frontal Medial - Controle executivo, motivação' },
  'F2': { x: 52, y: 37, region: 'fm', color: '#FFD700', function: 'Frontal Média Central Direita - Controle motor' },
  'F4': { x: 58, y: 36, region: 'fm', color: '#FFD700', function: 'Córtex Pré-frontal Dorsolateral Direito - Ansiedade, emoção' },
  'F6': { x: 68, y: 35, region: 'fm', color: '#FFD700', function: 'Frontal Média Direita - Planejamento motor' },
  'F8': { x: 78, y: 32, region: 'fm', color: '#FFD700', function: 'Área de Broca Direita - Processamento emocional, prosódia' },
  'F10': { x: 85, y: 28, region: 'fm', color: '#FFD700', function: 'Frontal Anterior Direita - Linguagem expressiva' },
  
  // Central/Sensório-Motora (Ciano/Verde Água)
  'FT9': { x: 12, y: 40, region: 'csm', color: '#00BCD4', function: 'Fronto-Temporal Esquerda - Integração sensório-motora' },
  'FT7': { x: 18, y: 44, region: 'csm', color: '#00BCD4', function: 'Fronto-Temporal Esquerda - Processamento auditivo' },
  'FC5': { x: 28, y: 48, region: 'csm', color: '#00BCD4', function: 'Fronto-Central Esquerda - Controle motor esquerdo' },
  'FC3': { x: 38, y: 50, region: 'csm', color: '#00BCD4', function: 'Fronto-Central Esquerda - Controle motor fino' },
  'FC1': { x: 46, y: 51, region: 'csm', color: '#00BCD4', function: 'Fronto-Central Central Esquerda - Controle motor bilateral' },
  'FCz': { x: 50, y: 52, region: 'csm', color: '#00BCD4', function: 'Fronto-Central Central - Controle motor central' },
  'FC2': { x: 54, y: 51, region: 'csm', color: '#00BCD4', function: 'Fronto-Central Central Direita - Controle motor bilateral' },
  'FC4': { x: 62, y: 50, region: 'csm', color: '#00BCD4', function: 'Fronto-Central Direita - Controle motor fino' },
  'FC6': { x: 72, y: 48, region: 'csm', color: '#00BCD4', function: 'Fronto-Central Direita - Controle motor direito' },
  'FT8': { x: 82, y: 44, region: 'csm', color: '#00BCD4', function: 'Fronto-Temporal Direita - Processamento auditivo' },
  'FT10': { x: 88, y: 40, region: 'csm', color: '#00BCD4', function: 'Fronto-Temporal Direita - Integração sensório-motora' },
  
  // Central (Verde Escuro)
  'T9': { x: 8, y: 50, region: 'temp', color: '#4CAF50', function: 'Temporal Anterior Esquerda - Processamento auditivo' },
  'T7': { x: 12, y: 56, region: 'temp', color: '#4CAF50', function: 'Temporal Esquerda - Área de Wernicke (linguagem receptiva)' },
  'C5': { x: 28, y: 60, region: 'csm', color: '#00BCD4', function: 'Central Esquerda - Processamento sensório-motor' },
  'C3': { x: 38, y: 62, region: 'csm', color: '#00BCD4', function: 'Córtex Motor Primário Esquerdo - Movimento lado direito' },
  'C1': { x: 46, y: 63, region: 'csm', color: '#00BCD4', function: 'Central Central Esquerda - Processamento sensorial' },
  'Cz': { x: 50, y: 64, region: 'csm', color: '#00BCD4', function: 'Córtex Motor Suplementar - Coordenação bilateral' },
  'C2': { x: 54, y: 63, region: 'csm', color: '#00BCD4', function: 'Central Central Direita - Processamento sensorial' },
  'C4': { x: 62, y: 62, region: 'csm', color: '#00BCD4', function: 'Córtex Motor Primário Direito - Movimento lado esquerdo' },
  'C6': { x: 72, y: 60, region: 'csm', color: '#00BCD4', function: 'Central Direita - Processamento sensório-motor' },
  'T8': { x: 88, y: 56, region: 'temp', color: '#4CAF50', function: 'Temporal Direita - Processamento auditivo, memória' },
  'T10': { x: 92, y: 50, region: 'temp', color: '#4CAF50', function: 'Temporal Anterior Direita - Processamento auditivo' },
  
  // Central-Parietal (Ciano)
  'TP9': { x: 10, y: 62, region: 'csm', color: '#00BCD4', function: 'Temporo-Parietal Esquerda - Integração sensório-motora' },
  'TP7': { x: 16, y: 68, region: 'csm', color: '#00BCD4', function: 'Temporo-Parietal Esquerda - Processamento espacial' },
  'CP5': { x: 28, y: 72, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Esquerda - Processamento sensório-motor' },
  'CP3': { x: 38, y: 74, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Esquerda - Integração sensório-motora' },
  'CP1': { x: 46, y: 75, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Central Esquerda - Processamento sensorial' },
  'CPz': { x: 50, y: 76, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Central - Integração sensório-motora central' },
  'CP2': { x: 54, y: 75, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Central Direita - Processamento sensorial' },
  'CP4': { x: 62, y: 74, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Direita - Integração sensório-motora' },
  'CP6': { x: 72, y: 72, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Direita - Processamento sensório-motor' },
  'TP8': { x: 84, y: 68, region: 'csm', color: '#00BCD4', function: 'Temporo-Parietal Direita - Processamento espacial' },
  'TP10': { x: 90, y: 62, region: 'csm', color: '#00BCD4', function: 'Temporo-Parietal Direita - Integração sensório-motora' },
  
  // Parietal (Roxo/Magenta)
  'P9': { x: 14, y: 78, region: 'par', color: '#9C27B0', function: 'Parietal Anterior Esquerda - Processamento sensorial' },
  'P5': { x: 24, y: 82, region: 'par', color: '#9C27B0', function: 'Parietal Esquerda - Processamento sensorial esquerdo' },
  'P3': { x: 38, y: 84, region: 'par', color: '#9C27B0', function: 'Parietal Esquerda - Processamento sensorial esquerdo' },
  'P1': { x: 46, y: 85, region: 'par', color: '#9C27B0', function: 'Parietal Central Esquerda - Integração sensório-motora' },
  'Pz': { x: 50, y: 86, region: 'par', color: '#9C27B0', function: 'Parietal Central - Integração sensório-motora central' },
  'P2': { x: 54, y: 85, region: 'par', color: '#9C27B0', function: 'Parietal Central Direita - Integração sensório-motora' },
  'P4': { x: 62, y: 84, region: 'par', color: '#9C27B0', function: 'Parietal Direita - Processamento sensorial direito' },
  'P6': { x: 76, y: 82, region: 'par', color: '#9C27B0', function: 'Parietal Direita - Processamento sensorial direito' },
  'P10': { x: 86, y: 78, region: 'par', color: '#9C27B0', function: 'Parietal Anterior Direita - Processamento sensorial' },
  
  // Occipital Anterior (Roxo Escuro)
  'PO7': { x: 20, y: 88, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Esquerda - Processamento visual periférico' },
  'PO3': { x: 38, y: 90, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Esquerda - Processamento visual' },
  'POz': { x: 50, y: 91, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Central - Processamento visual central' },
  'PO4': { x: 62, y: 90, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Direita - Processamento visual' },
  'PO8': { x: 80, y: 88, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Direita - Processamento visual periférico' },
  
  // Occipital (Vermelho)
  'O1': { x: 35, y: 94, region: 'occ', color: '#F44336', function: 'Córtex Visual Esquerdo - Visão lado direito' },
  'Oz': { x: 50, y: 95, region: 'occ', color: '#F44336', function: 'Córtex Visual Central - Processamento visual central' },
  'O2': { x: 65, y: 94, region: 'occ', color: '#F44336', function: 'Córtex Visual Direito - Visão lado esquerdo' }
};

class Helmet2D {
  constructor(canvasId, imageUrl, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) throw new Error('Canvas not found');
    
    this.ctx = this.canvas.getContext('2d');
    this.imageUrl = imageUrl;
    this.image = null;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    this.selectedPoints = new Set(options.selectedPoints || []);
    this.onPointSelect = options.onPointSelect || (() => {});
    this.onPointInfo = options.onPointInfo || (() => {});
    
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.pointRadius = 8;
    
    this.loadImage();
    this.setupEventListeners();
    this.animate();
  }
  
  loadImage() {
    this.image = new Image();
    this.image.onload = () => {
      this.draw();
    };
    this.image.onerror = (e) => {
      console.error('Erro ao carregar imagem do capacete:', e);
      console.error('URL tentada:', this.image.src);
    };
    // Usar URL absoluta baseada na localização atual
    const baseUrl = window.location.pathname.includes('/api/pwa/') ? '/api/pwa/app/' : './'
    this.image.src = baseUrl + this.imageUrl;
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.isDragging = false);
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));
    
    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.canvas.addEventListener('touchend', () => this.isDragging = false);
  }
  
  onMouseDown(e) {
    this.isDragging = true;
    this.lastMouse = { x: e.clientX, y: e.clientY };
  }
  
  onMouseMove(e) {
    if (!this.isDragging) return;
    const dx = e.clientX - this.lastMouse.x;
    const dy = e.clientY - this.lastMouse.y;
    this.panX += dx;
    this.panY += dy;
    this.lastMouse = { x: e.clientX, y: e.clientY };
  }
  
  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }
  
  onTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - this.lastMouse.x;
    const dy = e.touches[0].clientY - this.lastMouse.y;
    this.panX += dx;
    this.panY += dy;
    this.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  
  onWheel(e) {
    e.preventDefault();
    const zoomFactor = 1 - e.deltaY * 0.001;
    this.zoom = Math.max(0.5, Math.min(3, this.zoom * zoomFactor));
  }
  
  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.checkPointClick(x, y);
  }
  
  checkPointClick(x, y) {
    // Converter coordenadas de clique para coordenadas da imagem
    for (const [pointId, point] of Object.entries(HELMET_POINTS_2D)) {
      const screenX = this.width / 2 + (point.x - 50) * this.width / 100 * this.zoom + this.panX;
      const screenY = this.height / 2 + (point.y - 50) * this.height / 100 * this.zoom + this.panY;
      
      const dx = screenX - x;
      const dy = screenY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < this.pointRadius * 2) {
        // Ponto clicado
        if (this.selectedPoints.has(pointId)) {
          this.selectedPoints.delete(pointId);
        } else {
          this.selectedPoints.add(pointId);
        }
        this.onPointSelect(Array.from(this.selectedPoints));
        
        // Mostrar informações
        this.onPointInfo(pointId, {
          name: pointId,
          region: point.region,
          function: point.function,
          color: point.color
        });
        break;
      }
    }
  }
  
  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
  
  draw() {
    // Limpar canvas
    this.ctx.fillStyle = 'var(--surface)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Desenhar imagem do capacete
    if (this.image && this.image.complete) {
      const imgWidth = this.width * this.zoom;
      const imgHeight = this.height * this.zoom;
      const imgX = this.width / 2 - imgWidth / 2 + this.panX;
      const imgY = this.height / 2 - imgHeight / 2 + this.panY;
      
      this.ctx.drawImage(this.image, imgX, imgY, imgWidth, imgHeight);
    }
    
    // Desenhar pontos
    for (const [pointId, point] of Object.entries(HELMET_POINTS_2D)) {
      const screenX = this.width / 2 + (point.x - 50) * this.width / 100 * this.zoom + this.panX;
      const screenY = this.height / 2 + (point.y - 50) * this.height / 100 * this.zoom + this.panY;
      
      const isSelected = this.selectedPoints.has(pointId);
      const radius = isSelected ? this.pointRadius * 1.5 : this.pointRadius;
      
      // Desenhar círculo do ponto
      this.ctx.fillStyle = isSelected ? 'rgba(255, 0, 0, 0.9)' : point.color;
      this.ctx.beginPath();
      this.ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Borda
      this.ctx.strokeStyle = isSelected ? '#FF0000' : '#fff';
      this.ctx.lineWidth = isSelected ? 3 : 2;
      this.ctx.stroke();
      
      // Label
      this.ctx.fillStyle = 'var(--foreground)';
      this.ctx.font = 'bold 10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(pointId, screenX, screenY);
    }
    
    // Instruções
    this.ctx.fillStyle = 'var(--muted)';
    this.ctx.font = '11px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('Clique para selecionar | Arraste para mover | Scroll para zoom', 10, 10);
  }
  
  getSelectedPoints() {
    return Array.from(this.selectedPoints);
  }
  
  setSelectedPoints(points) {
    this.selectedPoints = new Set(points);
  }
  
  clearSelection() {
    this.selectedPoints.clear();
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.canvas.removeEventListener('touchstart', this.onTouchStart);
    this.canvas.removeEventListener('touchmove', this.onTouchMove);
    this.canvas.removeEventListener('touchend', this.onTouchEnd);
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.Helmet2D = Helmet2D;
  window.HELMET_POINTS_2D = HELMET_POINTS_2D;
}
