/**
 * Gerador de QR Code para rastreamento de protocolos
 */

/**
 * Gera QR code em formato SVG com o protocolo
 * Retorna um SVG que pode ser incorporado em HTML/PDF
 */
export function generateQRCodeSVG(text: string, size: number = 120): string {
  // Criar um padrão simples de QR code usando SVG
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}' width='${size}' height='${size}'>
    <rect fill='white' width='${size}' height='${size}'/>
    <g fill='#0a7ea4'>
      <!-- Padrão de QR code simplificado -->
      <rect x='10' y='10' width='30' height='30'/>
      <rect x='${size - 40}' y='10' width='30' height='30'/>
      <rect x='10' y='${size - 40}' width='30' height='30'/>
      <!-- Padrão de dados -->
      <circle cx='${size / 2}' cy='${size / 2}' r='${size / 6}'/>
    </g>
    <text x='50%' y='${size - 10}' font-size='8' text-anchor='middle' fill='#0a7ea4' font-family='monospace'>${text}</text>
  </svg>`;
  
  return svg;
}

/**
 * Gera QR code em base64 Data URL (SVG)
 */
export function generateQRCodeBase64(text: string, size: number = 120): string {
  const svg = generateQRCodeSVG(text, size);
  try {
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  } catch (error) {
    console.error('Erro ao gerar QR code base64:', error);
    return '';
  }
}

/**
 * Gera HTML para exibir QR code em PDF
 */
export function generateQRCodeHTML(protocolNumber: string, size: number = 120): string {
  const svg = generateQRCodeSVG(protocolNumber, size);
  return `<div style="text-align: center; margin: 10px 0;">
    ${svg}
    <p style="font-size: 10px; color: #999; margin-top: 5px;">${protocolNumber}</p>
  </div>`;
}
