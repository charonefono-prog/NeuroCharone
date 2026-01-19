/**
 * Serviço de geração de relatórios em HTML simples
 * Sem dependências externas, apenas HTML puro
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
}

export function generateReportHTML(data: ReportData): string {
  const pointsList = data.targetPoints.map(p => `<li>${p}</li>`).join('');
  
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
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .header {
            border-bottom: 3px solid #0066cc;
            margin-bottom: 30px;
            padding-bottom: 20px;
        }
        
        .header h1 {
            color: #0066cc;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 14px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            color: #333;
            font-size: 18px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        .info-row {
            display: grid;
            grid-template-columns: 150px 1fr;
            margin-bottom: 12px;
            gap: 20px;
        }
        
        .info-label {
            font-weight: 600;
            color: #333;
        }
        
        .info-value {
            color: #666;
        }
        
        .points-list {
            list-style: none;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
        }
        
        .points-list li {
            background-color: #f0f0f0;
            padding: 10px 15px;
            border-radius: 4px;
            text-align: center;
            font-weight: 500;
            color: #0066cc;
            border: 1px solid #ddd;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #999;
            font-size: 12px;
            text-align: center;
        }
        
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Relatório de Protocolo Terapêutico</h1>
            <p>NeuroLaserMap - Sistema de Mapeamento de Neuromodulação</p>
        </div>
        
        <div class="section">
            <h2>Informações do Paciente</h2>
            <div class="info-row">
                <div class="info-label">Paciente:</div>
                <div class="info-value">${data.patientName || 'Não informado'}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Data:</div>
                <div class="info-value">${data.date}</div>
            </div>
        </div>
        
        <div class="section">
            <h2>Protocolo Selecionado</h2>
            <div class="info-row">
                <div class="info-label">Protocolo:</div>
                <div class="info-value">${data.protocolName}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Condição:</div>
                <div class="info-value">${data.condition}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Frequência:</div>
                <div class="info-value">${data.frequency}x por semana</div>
            </div>
            <div class="info-row">
                <div class="info-label">Duração:</div>
                <div class="info-value">${data.duration} semanas</div>
            </div>
        </div>
        
        <div class="section">
            <h2>Pontos de Estimulação</h2>
            <ul class="points-list">
                ${pointsList}
            </ul>
        </div>
        
        ${data.notes ? `
        <div class="section">
            <h2>Notas Adicionais</h2>
            <div class="info-value">${data.notes}</div>
        </div>
        ` : ''}
        
        <div class="footer">
            <p>Este relatório foi gerado automaticamente pelo sistema NeuroLaserMap.</p>
            <p>Para mais informações, consulte o manual do sistema.</p>
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

export function openReportHTML(html: string) {
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
  }
}
