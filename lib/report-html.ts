/**
 * Serviço de geração de relatórios em HTML e PDF
 * Relatórios profissionais para compartilhamento
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
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: white;
            padding: 50px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .header {
            border-bottom: 4px solid #0066cc;
            margin-bottom: 40px;
            padding-bottom: 25px;
            text-align: center;
        }
        
        .header h1 {
            color: #0066cc;
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header .subtitle {
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .header .system-info {
            color: #999;
            font-size: 12px;
            margin-top: 10px;
        }
        
        .section {
            margin-bottom: 35px;
            page-break-inside: avoid;
        }
        
        .section h2 {
            color: #0066cc;
            font-size: 20px;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 3px solid #e0e0e0;
            font-weight: 600;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 20px;
        }
        
        .info-row {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .info-label {
            font-weight: 700;
            color: #0066cc;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            color: #333;
            font-size: 16px;
            padding-left: 5px;
            border-left: 3px solid #0066cc;
            padding-left: 12px;
        }
        
        .points-list, .regions-list {
            list-style: none;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
            margin-top: 15px;
        }
        
        .points-list li, .regions-list li {
            background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
            padding: 14px 16px;
            border-radius: 6px;
            text-align: center;
            font-weight: 600;
            color: #0066cc;
            border: 2px solid #0066cc;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .regions-list li {
            background: linear-gradient(135deg, #fff0f5 0%, #ffe6f0 100%);
            border-color: #ff69b4;
            color: #ff69b4;
        }
        
        .protocol-details {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            border-left: 5px solid #0066cc;
            margin-top: 15px;
        }
        
        .protocol-details p {
            margin-bottom: 10px;
            line-height: 1.8;
            color: #555;
        }
        
        .protocol-details strong {
            color: #0066cc;
        }
        
        .notes-section {
            background-color: #fffbf0;
            padding: 20px;
            border-radius: 6px;
            border-left: 5px solid #ff9800;
            margin-top: 15px;
        }
        
        .notes-section p {
            color: #555;
            line-height: 1.8;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 25px;
            border-top: 2px solid #e0e0e0;
            color: #999;
            font-size: 12px;
            text-align: center;
            line-height: 1.8;
        }
        
        .footer-signature {
            margin-top: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }
        
        .signature-line {
            border-top: 1px solid #333;
            padding-top: 10px;
            text-align: center;
            font-size: 12px;
            color: #333;
        }
        
        .badge {
            display: inline-block;
            background-color: #0066cc;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-right: 8px;
            margin-bottom: 8px;
        }
        
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                padding: 40px;
                max-width: 100%;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
        
        @media (max-width: 600px) {
            .container {
                padding: 20px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Relatório de Protocolo Terapêutico</h1>
            <div class="subtitle">NeuroLaserMap - Sistema de Mapeamento de Neuromodulação</div>
            <div class="system-info">Desenvolvido por Carlos Charone | CRIA 9-10025-5</div>
        </div>
        
        <div class="section">
            <h2>👤 Informações do Paciente</h2>
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
            <h2>🎯 Protocolo Selecionado</h2>
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
            <h2>⚙️ Parâmetros de Tratamento</h2>
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
            <h2>🧠 Regiões Cerebrais Alvo</h2>
            <ul class="regions-list">
                ${data.targetRegions.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        <div class="section">
            <h2>📍 Pontos de Estimulação</h2>
            <p style="color: #666; margin-bottom: 15px;">Total de pontos: <strong>${data.targetPoints.length}</strong></p>
            <ul class="points-list">
                ${pointsList}
            </ul>
        </div>
        
        ${data.notes ? `
        <div class="section">
            <h2>📝 Notas Adicionais</h2>
            <div class="notes-section">
                <p>${data.notes}</p>
            </div>
        </div>
        ` : ''}
        
        <div class="footer">
            <p>Este relatório foi gerado automaticamente pelo sistema <strong>NeuroLaserMap</strong>.</p>
            <p>Sistema de Mapeamento de Neuromodulação - Versão 1.0</p>
            <p style="margin-top: 15px; color: #ccc;">Desenvolvido por Carlos Charone | CRIA 9-10025-5</p>
            <p style="margin-top: 10px; font-size: 11px;">Data de geração: ${new Date().toLocaleString('pt-BR')}</p>
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
  // Abrir em nova janela para impressão em PDF
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
    
    // Aguardar o carregamento do documento e abrir diálogo de impressão
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
  // Para compartilhamento em plataformas que suportam Web Share API
  if (navigator.share) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const file = new File([blob], filename, { type: 'text/html' });
    
    navigator.share({
      files: [file],
      title: 'Relatório NeuroLaserMap',
      text: 'Relatório de Protocolo Terapêutico'
    }).catch(err => console.log('Erro ao compartilhar:', err));
  } else {
    // Fallback: download
    downloadReportHTML(html, filename);
  }
}
