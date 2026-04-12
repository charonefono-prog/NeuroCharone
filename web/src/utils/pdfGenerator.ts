import jsPDF from 'jspdf'

export function generateSessionReport(sessionData: any) {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.text('NeuroLaserMap - Relatório de Sessão', 20, 20)
  
  // Patient info
  doc.setFontSize(12)
  doc.text(`Paciente: ${sessionData.patientName}`, 20, 40)
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 50)
  doc.text(`Profissional: ${sessionData.professionalName}`, 20, 60)
  
  // Session details
  doc.setFontSize(14)
  doc.text('Detalhes da Sessão', 20, 80)
  doc.setFontSize(11)
  doc.text(`Duração: ${sessionData.duration} minutos`, 20, 90)
  doc.text(`Pontos Estimulados: ${sessionData.points.join(', ')}`, 20, 100)
  doc.text(`Intensidade: ${sessionData.intensity}%`, 20, 110)
  
  // Results
  doc.setFontSize(14)
  doc.text('Resultados', 20, 130)
  doc.setFontSize(11)
  doc.text(`Resposta do Paciente: ${sessionData.response}`, 20, 140)
  doc.text(`Observações: ${sessionData.notes}`, 20, 150)
  
  // Footer
  doc.setFontSize(9)
  doc.text('Relatório gerado automaticamente pelo NeuroLaserMap', 20, 280)
  
  return doc
}

export function downloadReport(doc: jsPDF, filename: string) {
  doc.save(filename)
}
