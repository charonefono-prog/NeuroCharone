import { getPointByName } from "@/shared/manual-colored-points";

/**
 * Gera uma representação SVG do capacete com os pontos selecionados
 * para ser incluída nos PDFs
 */
export function generateHelmetSVG(selectedPoints: string[]): string {
  const svgWidth = 400;
  const svgHeight = 400;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = 150;

  // Mapa de posições dos pontos (aproximado para visualização 2D frontal)
  const pointPositions: Record<string, [number, number]> = {
    // Frontal Anterior (Rosa)
    Fp1: [centerX - 60, centerY - 140],
    Fp2: [centerX + 60, centerY - 140],
    Fpz: [centerX, centerY - 140],

    // Frontal Média (Laranja)
    AF3: [centerX - 80, centerY - 100],
    AF4: [centerX + 80, centerY - 100],
    AFz: [centerX, centerY - 100],

    // Frontal Central (Amarelo)
    F3: [centerX - 100, centerY - 60],
    F4: [centerX + 100, centerY - 60],
    F7: [centerX - 120, centerY - 40],
    F8: [centerX + 120, centerY - 40],
    Fz: [centerX, centerY - 60],

    // Central / Sensório-Motora (Ciano)
    FC3: [centerX - 90, centerY - 20],
    FC1: [centerX - 40, centerY - 20],
    FCz: [centerX, centerY - 20],
    FC2: [centerX + 40, centerY - 20],
    FC4: [centerX + 90, centerY - 20],
    C5: [centerX - 140, centerY + 20],
    C3: [centerX - 100, centerY + 20],
    C1: [centerX - 40, centerY + 20],
    Cz: [centerX, centerY + 20],
    C2: [centerX + 40, centerY + 20],
    C4: [centerX + 100, centerY + 20],
    C6: [centerX + 140, centerY + 20],
    CP3: [centerX - 90, centerY + 60],
    CP1: [centerX - 40, centerY + 60],
    CPz: [centerX, centerY + 60],
    CP2: [centerX + 40, centerY + 60],
    CP4: [centerX + 90, centerY + 60],

    // Temporal (Verde)
    T9: [centerX - 160, centerY - 20],
    T3: [centerX - 150, centerY + 20],
    T4: [centerX + 150, centerY + 20],
    T10: [centerX + 160, centerY - 20],

    // Parietal (Roxo)
    P3: [centerX - 80, centerY + 100],
    P1: [centerX - 40, centerY + 100],
    Pz: [centerX, centerY + 100],
    P2: [centerX + 40, centerY + 100],
    P4: [centerX + 80, centerY + 100],

    // Occipital (Rosa claro)
    O1: [centerX - 60, centerY + 140],
    Oz: [centerX, centerY + 140],
    O2: [centerX + 60, centerY + 140],
  };

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

  // Desenhar círculo do capacete
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#999" stroke-width="2"/>`;

  // Desenhar todos os pontos
  Object.entries(pointPositions).forEach(([pointName, [x, y]]) => {
    const point = getPointByName(pointName);
    if (!point) return;

    const isSelected = selectedPoints.includes(pointName);
    const color = point.color;
    const radius = isSelected ? 8 : 5;
    const strokeWidth = isSelected ? 2 : 1;

    svg += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" stroke="${isSelected ? '#000' : '#ccc'}" stroke-width="${strokeWidth}"/>`;

    // Adicionar label do ponto se selecionado
    if (isSelected) {
      svg += `<text x="${x + 12}" y="${y + 4}" font-size="10" font-weight="bold" fill="#333">${pointName}</text>`;
    }
  });

  svg += `</svg>`;

  return svg;
}

/**
 * Gera uma representação HTML do capacete com legenda
 */
export function generateHelmetHTML(selectedPoints: string[]): string {
  const svg = generateHelmetSVG(selectedPoints);

  let html = `
    <div style="margin: 20px 0; text-align: center;">
      <h3 style="margin-bottom: 10px; color: #333;">Visualização do Capacete - Pontos Selecionados</h3>
      ${svg}
      <div style="margin-top: 15px; text-align: left; font-size: 12px;">
        <strong>Pontos Estimulados:</strong><br/>
  `;

  selectedPoints.forEach((pointName) => {
    const point = getPointByName(pointName);
    if (point) {
      html += `<span style="display: inline-block; margin-right: 15px; margin-bottom: 5px;">
        <span style="display: inline-block; width: 12px; height: 12px; background-color: ${point.color}; border: 1px solid #999; margin-right: 5px; vertical-align: middle;"></span>
        ${pointName} - ${point.region}
      </span>`;
    }
  });

  html += `
      </div>
    </div>
  `;

  return html;
}

/**
 * Gera um resumo dos pontos selecionados para PDF
 */
export function generatePointsSummary(selectedPoints: string[]): string {
  let summary = "Pontos de Estimulação:\n";

  const pointsByRegion: Record<string, string[]> = {};

  selectedPoints.forEach((pointName) => {
    const point = getPointByName(pointName);
    if (point) {
      if (!pointsByRegion[point.region]) {
        pointsByRegion[point.region] = [];
      }
      pointsByRegion[point.region].push(pointName);
    }
  });

  Object.entries(pointsByRegion).forEach(([region, points]) => {
    summary += `\n${region}:\n`;
    summary += `  ${points.join(", ")}\n`;
  });

  return summary;
}
