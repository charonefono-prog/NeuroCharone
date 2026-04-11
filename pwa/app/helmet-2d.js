/**
 * Helmet 2D Visualization - Sistema 10-20 EEG
 * v6.0 - Suporte a formato objeto e argumentos separados
 */

const HELMET_POINTS_2D = {
  'Nz': { x: 50, y: 8, region: 'ref', color: '#999999', function: 'Nasion - Referência anterior' },
  'Iz': { x: 50, y: 92, region: 'ref', color: '#999999', function: 'Inion - Referência posterior' },
  'Fp1': { x: 35, y: 12, region: 'fa', color: '#E91E63', function: 'Pré-frontal Anterior Esquerda - Atenção, memória de trabalho' },
  'Fpz': { x: 50, y: 10, region: 'fa', color: '#E91E63', function: 'Pré-frontal Anterior Central - Controle atencional' },
  'Fp2': { x: 65, y: 12, region: 'fa', color: '#E91E63', function: 'Pré-frontal Anterior Direita - Atenção, memória de trabalho' },
  'AF7': { x: 25, y: 18, region: 'fam', color: '#FF9800', function: 'Frontal Anterior Esquerda - Processamento emocional' },
  'AF3': { x: 38, y: 20, region: 'fam', color: '#FF9800', function: 'Frontal Anterior-Média Esquerda - Regulação emocional' },
  'AFz': { x: 50, y: 22, region: 'fam', color: '#FF9800', function: 'Frontal Anterior-Média Central - Controle executivo' },
  'AF4': { x: 62, y: 20, region: 'fam', color: '#FF9800', function: 'Frontal Anterior-Média Direita - Regulação emocional' },
  'AF8': { x: 75, y: 18, region: 'fam', color: '#FF9800', function: 'Frontal Anterior Direita - Processamento emocional' },
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
  'T9': { x: 8, y: 50, region: 'temp', color: '#4CAF50', function: 'Temporal Anterior Esquerda - Processamento auditivo' },
  'T3': { x: 10, y: 55, region: 'temp', color: '#4CAF50', function: 'Temporal Esquerda (T3) - Área de Wernicke' },
  'T7': { x: 12, y: 56, region: 'temp', color: '#4CAF50', function: 'Temporal Esquerda - Área de Wernicke (linguagem receptiva)' },
  'C5': { x: 28, y: 60, region: 'csm', color: '#00BCD4', function: 'Central Esquerda - Processamento sensório-motor' },
  'C3': { x: 38, y: 62, region: 'csm', color: '#00BCD4', function: 'Córtex Motor Primário Esquerdo - Movimento lado direito' },
  'C1': { x: 46, y: 63, region: 'csm', color: '#00BCD4', function: 'Central Central Esquerda - Processamento sensorial' },
  'Cz': { x: 50, y: 64, region: 'csm', color: '#00BCD4', function: 'Córtex Motor Suplementar - Coordenação bilateral' },
  'C2': { x: 54, y: 63, region: 'csm', color: '#00BCD4', function: 'Central Central Direita - Processamento sensorial' },
  'C4': { x: 62, y: 62, region: 'csm', color: '#00BCD4', function: 'Córtex Motor Primário Direito - Movimento lado esquerdo' },
  'C6': { x: 72, y: 60, region: 'csm', color: '#00BCD4', function: 'Central Direita - Processamento sensório-motor' },
  'T8': { x: 88, y: 56, region: 'temp', color: '#4CAF50', function: 'Temporal Direita - Processamento auditivo, memória' },
  'T4': { x: 90, y: 55, region: 'temp', color: '#4CAF50', function: 'Temporal Direita (T4) - Processamento auditivo' },
  'T10': { x: 92, y: 50, region: 'temp', color: '#4CAF50', function: 'Temporal Anterior Direita - Processamento auditivo' },
  'A1': { x: 5, y: 58, region: 'ref', color: '#999999', function: 'Auricular Esquerda - Referência' },
  'A2': { x: 95, y: 58, region: 'ref', color: '#999999', function: 'Auricular Direita - Referência' },
  'TP9': { x: 10, y: 62, region: 'csm', color: '#00BCD4', function: 'Temporo-Parietal Esquerda' },
  'TP7': { x: 16, y: 68, region: 'csm', color: '#00BCD4', function: 'Temporo-Parietal Esquerda' },
  'CP5': { x: 28, y: 72, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Esquerda' },
  'CP3': { x: 38, y: 74, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Esquerda' },
  'CP1': { x: 46, y: 75, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Central Esquerda' },
  'CPz': { x: 50, y: 76, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Central' },
  'CP2': { x: 54, y: 75, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Central Direita' },
  'CP4': { x: 62, y: 74, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Direita' },
  'CP6': { x: 72, y: 72, region: 'csm', color: '#00BCD4', function: 'Central-Parietal Direita' },
  'TP8': { x: 84, y: 68, region: 'csm', color: '#00BCD4', function: 'Temporo-Parietal Direita' },
  'TP10': { x: 90, y: 62, region: 'csm', color: '#00BCD4', function: 'Temporo-Parietal Direita' },
  'T5': { x: 18, y: 80, region: 'temp', color: '#4CAF50', function: 'Temporal Posterior Esquerda (T5)' },
  'P9': { x: 14, y: 78, region: 'par', color: '#9C27B0', function: 'Parietal Anterior Esquerda' },
  'P7': { x: 18, y: 80, region: 'par', color: '#9C27B0', function: 'Parietal Esquerda' },
  'P5': { x: 24, y: 82, region: 'par', color: '#9C27B0', function: 'Parietal Esquerda' },
  'P3': { x: 38, y: 84, region: 'par', color: '#9C27B0', function: 'Parietal Esquerda' },
  'P1': { x: 46, y: 85, region: 'par', color: '#9C27B0', function: 'Parietal Central Esquerda' },
  'Pz': { x: 50, y: 86, region: 'par', color: '#9C27B0', function: 'Parietal Central' },
  'P2': { x: 54, y: 85, region: 'par', color: '#9C27B0', function: 'Parietal Central Direita' },
  'P4': { x: 62, y: 84, region: 'par', color: '#9C27B0', function: 'Parietal Direita' },
  'P6': { x: 76, y: 82, region: 'par', color: '#9C27B0', function: 'Parietal Direita' },
  'P8': { x: 82, y: 80, region: 'par', color: '#9C27B0', function: 'Parietal Direita' },
  'T6': { x: 82, y: 80, region: 'temp', color: '#4CAF50', function: 'Temporal Posterior Direita (T6)' },
  'P10': { x: 86, y: 78, region: 'par', color: '#9C27B0', function: 'Parietal Anterior Direita' },
  'PO7': { x: 20, y: 88, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Esquerda' },
  'PO3': { x: 38, y: 90, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Esquerda' },
  'POz': { x: 50, y: 91, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Central' },
  'PO4': { x: 62, y: 90, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Direita' },
  'PO8': { x: 80, y: 88, region: 'oa', color: '#673AB7', function: 'Parieto-Occipital Direita' },
  'O1': { x: 35, y: 94, region: 'occ', color: '#F44336', function: 'Córtex Visual Esquerdo' },
  'Oz': { x: 50, y: 95, region: 'occ', color: '#F44336', function: 'Córtex Visual Central' },
  'O2': { x: 65, y: 94, region: 'occ', color: '#F44336', function: 'Córtex Visual Direito' }
};

class Helmet2D {
  constructor(configOrCanvasId, imageUrl, options) {
    let canvasId, opts;
    if (typeof configOrCanvasId === 'object' && configOrCanvasId !== null) {
      canvasId = configOrCanvasId.canvasId;
      imageUrl = configOrCanvasId.imageUrl;
      opts = configOrCanvasId;
    } else {
      canvasId = configOrCanvasId;
      opts = options || {};
    }

    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Helmet2D: Canvas not found:', canvasId);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.imageUrl = imageUrl || 'helmet-10-20.webp';
    this.image = null;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.selectedPoints = new Set(opts.selectedPoints || []);
    this.visibleRegions = new Set(['fa', 'fam', 'fm', 'csm', 'temp', 'par', 'oa', 'occ', 'ref']);
    this.onPointSelect = opts.onPointSelect || (() => {});
    this.onPointInfo = opts.onPointInfo || (() => {});

    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.pointRadius = 8;
    this.animationId = null;
    this._retried = false;

    this.loadImage();
    this.setupEvents();
    this.animate();
    console.log('Helmet2D v6.0 OK:', canvasId);
  }

  loadImage() {
    this.image = new Image();
    this.image.crossOrigin = 'anonymous';
    this.image.onload = () => {
      console.log('Helmet2D: img loaded', this.image.naturalWidth, 'x', this.image.naturalHeight);
      this.draw();
    };
    this.image.onerror = () => {
      if (!this._retried) {
        this._retried = true;
        const fb = ['/api/pwa/app/' + this.imageUrl, '/api/pwa/app/helmet-10-20.webp', './' + this.imageUrl];
        const cur = this.image.src;
        for (const f of fb) {
          const u = new URL(f, window.location.href).href;
          if (u !== cur) { this.image.src = u; return; }
        }
      }
      console.error('Helmet2D: all image fallbacks failed');
    };
    let src = this.imageUrl;
    if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
      src = window.location.pathname.replace(/\/[^/]*$/, '/') + src;
    }
    this.image.src = src;
  }

  setupEvents() {
    this._onClick = (e) => this.onClick(e);
    this._onMouseDown = (e) => { this.isDragging = true; this.lastMouse = { x: e.clientX, y: e.clientY }; };
    this._onMouseMove = (e) => { if (!this.isDragging) return; this.panX += e.clientX - this.lastMouse.x; this.panY += e.clientY - this.lastMouse.y; this.lastMouse = { x: e.clientX, y: e.clientY }; };
    this._onMouseUp = () => this.isDragging = false;
    this._onWheel = (e) => { e.preventDefault(); this.zoom = Math.max(0.5, Math.min(3, this.zoom * (1 - e.deltaY * 0.001))); };
    this._onTouchStart = (e) => { if (e.touches.length === 1) { this.isDragging = true; this.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; } };
    this._onTouchMove = (e) => { if (!this.isDragging || e.touches.length !== 1) return; e.preventDefault(); this.panX += e.touches[0].clientX - this.lastMouse.x; this.panY += e.touches[0].clientY - this.lastMouse.y; this.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    this._onTouchEnd = () => this.isDragging = false;

    this.canvas.addEventListener('click', this._onClick);
    this.canvas.addEventListener('mousedown', this._onMouseDown);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseup', this._onMouseUp);
    this.canvas.addEventListener('wheel', this._onWheel, { passive: false });
    this.canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this._onTouchEnd);
  }

  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = this.canvas.width / rect.width;
    const sy = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * sx;
    const y = (e.clientY - rect.top) * sy;

    for (const [id, pt] of Object.entries(HELMET_POINTS_2D)) {
      if (!this.visibleRegions.has(pt.region)) continue;
      const px = this.width / 2 + (pt.x - 50) * this.width / 100 * this.zoom + this.panX;
      const py = this.height / 2 + (pt.y - 50) * this.height / 100 * this.zoom + this.panY;
      if (Math.hypot(px - x, py - y) < this.pointRadius * 2.5) {
        this.selectedPoints.has(id) ? this.selectedPoints.delete(id) : this.selectedPoints.add(id);
        this.onPointSelect(Array.from(this.selectedPoints));
        this.onPointInfo(id, { name: id, region: pt.region, function: pt.function, color: pt.color });
        break;
      }
    }
  }

  animate() {
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.fillStyle = '#f5f5f5';
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (this.image && this.image.complete && this.image.naturalWidth > 0) {
      const iw = this.width * this.zoom, ih = this.height * this.zoom;
      const ix = this.width / 2 - iw / 2 + this.panX, iy = this.height / 2 - ih / 2 + this.panY;
      this.ctx.drawImage(this.image, ix, iy, iw, ih);
    }

    for (const [id, pt] of Object.entries(HELMET_POINTS_2D)) {
      if (!this.visibleRegions.has(pt.region)) continue;
      const sx = this.width / 2 + (pt.x - 50) * this.width / 100 * this.zoom + this.panX;
      const sy = this.height / 2 + (pt.y - 50) * this.height / 100 * this.zoom + this.panY;
      const sel = this.selectedPoints.has(id);
      const r = sel ? this.pointRadius * 1.5 : this.pointRadius;

      this.ctx.beginPath();
      this.ctx.arc(sx, sy, r, 0, Math.PI * 2);
      this.ctx.fillStyle = sel ? 'rgba(255,0,0,0.9)' : pt.color;
      this.ctx.fill();
      this.ctx.strokeStyle = sel ? '#FF0000' : '#fff';
      this.ctx.lineWidth = sel ? 3 : 2;
      this.ctx.stroke();

      this.ctx.fillStyle = '#333';
      this.ctx.font = 'bold 10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(id, sx, sy);
    }

    this.ctx.fillStyle = '#888';
    this.ctx.font = '11px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';
    this.ctx.fillText('Clique para selecionar \u2022 Arraste para mover \u2022 Scroll para zoom', this.width / 2, this.height - 5);
  }

  getSelectedPoints() { return Array.from(this.selectedPoints); }
  setSelectedPoints(pts) { this.selectedPoints = new Set(pts); }
  clearSelection() { this.selectedPoints.clear(); }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.canvas) {
      this.canvas.removeEventListener('click', this._onClick);
      this.canvas.removeEventListener('mousedown', this._onMouseDown);
      this.canvas.removeEventListener('mousemove', this._onMouseMove);
      this.canvas.removeEventListener('mouseup', this._onMouseUp);
      this.canvas.removeEventListener('wheel', this._onWheel);
      this.canvas.removeEventListener('touchstart', this._onTouchStart);
      this.canvas.removeEventListener('touchmove', this._onTouchMove);
      this.canvas.removeEventListener('touchend', this._onTouchEnd);
    }
  }
}

if (typeof window !== 'undefined') {
  window.Helmet2D = Helmet2D;
  window.HELMET_POINTS_2D = HELMET_POINTS_2D;
}
console.log('Helmet2D v6.0 loaded');
