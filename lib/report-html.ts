/*
 * Serviço de geração de relatórios em HTML e PDF
 * Design sofisticado e clean moderno para impressão de alto nível
 */

export interface ReportData {
  patientName: string;
  protocolName: string;
  condition: string;
  targetPoints: string[];
  frequency: number;
  duration: number;
  date: string;
  notes?: string;
  targetRegions?: string[];
  objective?: string;
}

export function generateReportHTML(data: ReportData): string {
  const pointsList = data.targetPoints.map(p => `<li>${p}</li>`).join('');
  const regionsList = data.targetRegions ? data.targetRegions.map(r => `<li>${r}</li>`).join('') : '';
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório - ${data.protocolName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            height: 100%;
            width: 100%;
        }
        
        body {
            font-family: 'Segoe UI', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 30px 20px;
            line-height: 1.6;
            color: #2c3e50;
        }
        
        .container {
            max-width: 950px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 60px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }
        
        /* Header Sofisticado */
        .header {
            border-bottom: 2px solid #e8eef7;
            margin-bottom: 45px;
            padding-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .header-left h1 {
            color: #1a3a52;
            font-size: 36px;
            margin-bottom: 8px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        
        .header-left .subtitle {
            color: #7f8c8d;
            font-size: 13px;
            letter-spacing: 1.2px;
            text-transform: uppercase;
            font-weight: 600;
        }
        
        .header-right {
            text-align: right;
        }
        
        .developer-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .developer-badge .label {
            display: block;
            font-size: 11px;
            opacity: 0.9;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .developer-badge .name {
            display: block;
            font-size: 16px;
            font-weight: 700;
        }
        
        .developer-badge .cria {
            display: block;
            font-size: 10px;
            opacity: 0.85;
            margin-top: 4px;
        }
        
        /* Seções */
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .section h2 {
            color: #1a3a52;
            font-size: 18px;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 3px solid #667eea;
            font-weight: 700;
            letter-spacing: 0.3px;
        }
        
        /* Grid de Informações */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 20px;
        }
        
        .info-row {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .info-label {
            font-weight: 700;
            color: #667eea;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .info-value {
            color: #2c3e50;
            font-size: 16px;
            font-weight: 500;
            padding-left: 0;
            border-left: none;
        }
        
        /* Listas de Pontos */
        .points-list, .regions-list {
            list-style: none;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 12px;
            margin-top: 18px;
        }
        
        .points-list li {
            background: linear-gradient(135deg, #f8f9ff 0%, #f0f3ff 100%);
            padding: 14px 16px;
            border-radius: 8px;
            text-align: center;
            font-weight: 700;
            color: #667eea;
            border: 2px solid #e8eef7;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .points-list li:hover {
            border-color: #667eea;
            background: linear-gradient(135deg, #f0f3ff 0%, #e8eef7 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }
        
        .regions-list li {
            background: linear-gradient(135deg, #fff5f7 0%, #ffe8ed 100%);
            border-color: #f0d9e0;
            color: #c2185b;
            font-weight: 700;
        }
        
        .regions-list li:hover {
            border-color: #c2185b;
            background: linear-gradient(135deg, #ffe8ed 0%, #ffd9e3 100%);
        }
        
        /* Card de Detalhes */
        .protocol-details {
            background: linear-gradient(135deg, #f8f9ff 0%, #f0f3ff 100%);
            padding: 24px;
            border-radius: 8px;
            border-left: 5px solid #667eea;
            margin-top: 18px;
        }
        
        .protocol-details p {
            margin-bottom: 12px;
            line-height: 1.8;
            color: #2c3e50;
            font-size: 15px;
        }
        
        .protocol-details strong {
            color: #667eea;
            font-weight: 700;
        }
        
        /* Card de Notas */
        .notes-section {
            background: linear-gradient(135deg, #fffbf0 0%, #fff5e6 100%);
            padding: 24px;
            border-radius: 8px;
            border-left: 5px solid #ff9800;
            margin-top: 18px;
        }
        
        .notes-section p {
            color: #2c3e50;
            line-height: 1.8;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 15px;
        }
        
        /* Footer Elegante */
        .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e8eef7;
            color: #7f8c8d;
            font-size: 12px;
            text-align: center;
            line-height: 1.8;
        }
        
        .footer-developer {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            font-weight: 600;
        }
        
        .footer-developer .title {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.9;
            margin-bottom: 4px;
        }
        
        .footer-developer .name {
            font-size: 16px;
            font-weight: 700;
        }
        
        .footer-developer .cria {
            font-size: 11px;
            opacity: 0.85;
            margin-top: 4px;
        }
        
        .footer-info {
            margin-top: 15px;
            color: #95a5a6;
            font-size: 11px;
        }
        
        /* Responsivo */
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                padding: 50px;
                max-width: 100%;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 30px;
            }
            
            .header {
                flex-direction: column;
                gap: 20px;
            }
            
            .header-right {
                text-align: left;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .header-left h1 {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <h1>Relatório Terapêutico</h1>
                <div class="subtitle">NeuroLaserMap</div>
            </div>

        </div>
        
        <div class="section">
            <h2>Informações do Paciente</h2>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Nome do Paciente</div>
                    <div class="info-value">${data.patientName || 'Não informado'}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Data do Relatório</div>
                    <div class="info-value">${data.date}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>Protocolo Selecionado</h2>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Protocolo</div>
                    <div class="info-value">${data.protocolName}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Condição Clínica</div>
                    <div class="info-value">${data.condition}</div>
                </div>
            </div>
            
            ${data.objective ? `
            <div class="protocol-details">
                <p><strong>Objetivo do Protocolo:</strong></p>
                <p>${data.objective}</p>
            </div>
            ` : ''}
        </div>
        
        <div class="section">
            <h2>Parâmetros de Tratamento</h2>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Frequência</div>
                    <div class="info-value">${data.frequency}x por semana</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Duração Total</div>
                    <div class="info-value">${data.duration} semanas</div>
                </div>
            </div>
        </div>
        
        ${data.targetRegions && data.targetRegions.length > 0 ? `
        <div class="section">
            <h2>Regiões Cerebrais Alvo</h2>
            <ul class="regions-list">
                ${data.targetRegions.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        <div class="section">
            <h2>Pontos de Estimulação</h2>
            <p style="color: #7f8c8d; margin-bottom: 15px; font-size: 14px;">Total de pontos: <strong style="color: #2c3e50;">${data.targetPoints.length}</strong></p>
            <ul class="points-list">
                ${pointsList}
            </ul>
        </div>
        
        ${data.notes ? `
        <div class="section">
            <h2>Notas Adicionais</h2>
            <div class="notes-section">
                <p>${data.notes}</p>
            </div>
        </div>
        ` : ''}
        
        <div class="footer">
            <div class="footer-info">
                <p>NeuroLaserMap - Sistema de Mapeamento de Neuromodulação</p>
                <p style="margin-top: 8px;">Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
            </div>
        </div>
    </div>
</body>
</html>
  `.trim();
}

export function downloadReportHTML(html: string, filename: string = 'relatorio.html') {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function downloadReportPDF(html: string, filename: string = 'relatorio.pdf') {
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
    
    newWindow.onload = () => {
      setTimeout(() => {
        newWindow.print();
      }, 250);
    };
  }
}

export function openReportHTML(html: string) {
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
  }
}

export function shareReportHTML(html: string, filename: string = 'relatorio.html') {
  if (navigator.share) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const file = new File([blob], filename, { type: 'text/html' });
    
    navigator.share({
      files: [file],
      title: 'Relatório NeuroLaserMap',
      text: 'Relatório de Protocolo Terapêutico - NeuroLaserMap'
    }).catch(err => console.log('Erro ao compartilhar:', err));
  } else {
    downloadReportHTML(html, filename);
  }
}
