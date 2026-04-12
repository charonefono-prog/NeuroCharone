import { useState, useEffect } from 'react'
import { Helmet3D } from '../components/Helmet3D'
import { generateSessionReport, downloadReport } from '../utils/pdfGenerator'

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('home')
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPoints, setSelectedPoints] = useState<string[]>([])

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/trpc/patients.list')
      const data = await response.json()
      setPatients(data.result?.data || [])
    } catch (err) {
      console.error('Error loading patients:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateReport = () => {
    const sessionData = {
      patientName: 'João Silva',
      professionalName: 'Dr. Carlos',
      duration: 30,
      points: selectedPoints,
      intensity: 75,
      response: 'Positiva',
      notes: 'Sessão bem tolerada pelo paciente',
    }
    const doc = generateSessionReport(sessionData)
    downloadReport(doc, `relatorio-sessao-${Date.now()}.pdf`)
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'scales', label: 'Escalas', icon: '📊' },
    { id: 'cycles', label: 'Ciclos', icon: '🔄' },
    { id: 'patients', label: 'Pacientes', icon: '👥' },
    { id: 'session', label: 'Nova Sessão', icon: '➕' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
    { id: 'effectiveness', label: 'Efetividade', icon: '📈' },
    { id: 'admin', label: 'Admin', icon: '🔐' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">NeuroLaserMap</h1>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'home' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Total de Pacientes</p>
                  <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{patients.filter((p: any) => p.status === 'active').length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Sessões Hoje</p>
                  <p className="text-3xl font-bold text-orange-600">2</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Esta Semana</p>
                  <p className="text-3xl font-bold text-purple-600">4</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'patients' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Pacientes</h2>
              {isLoading ? (
                <p>Carregando...</p>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {patients.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-center text-gray-600">Nenhum paciente cadastrado</td>
                        </tr>
                      ) : (
                        patients.map((p: any) => (
                          <tr key={p.id}>
                            <td className="px-6 py-4 text-sm text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{p.email}</td>
                            <td className="px-6 py-4 text-sm"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">Ativo</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'session' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nova Sessão</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-2 gap-8">
                  {/* 2D Helmet Visualization */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Visualizador 2D - Sistema 10-20</h3>
                    <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Helmet outline */}
                        <ellipse cx="100" cy="80" rx="60" ry="70" fill="none" stroke="#333" strokeWidth="2"/>
                        {/* 10-20 system points */}
                        {[
                          { x: 100, y: 30, label: 'Cz' },
                          { x: 70, y: 60, label: 'C3' },
                          { x: 130, y: 60, label: 'C4' },
                          { x: 50, y: 80, label: 'T3' },
                          { x: 150, y: 80, label: 'T4' },
                          { x: 100, y: 140, label: 'Oz' },
                        ].map((point, i) => (
                          <g key={i} onClick={() => {
                            if (selectedPoints.includes(point.label)) {
                              setSelectedPoints(selectedPoints.filter(p => p !== point.label))
                            } else {
                              setSelectedPoints([...selectedPoints, point.label])
                            }
                          }}>
                            <circle 
                              cx={point.x} 
                              cy={point.y} 
                              r="6" 
                              fill={selectedPoints.includes(point.label) ? '#ff6b6b' : '#0066cc'} 
                              cursor="pointer"
                              style={{ transition: 'fill 0.2s' }}
                            />
                            <text x={point.x + 10} y={point.y + 3} fontSize="12" fill="#333">{point.label}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Pontos selecionados: {selectedPoints.join(', ') || 'Nenhum'}</p>
                  </div>
                  
                  {/* 3D Helmet Visualization */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Visualizador 3D</h3>
                    <div className="bg-gray-100 rounded-lg p-4 h-96">
                      <Helmet3D selectedPoints={selectedPoints} />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Arraste para rotacionar, scroll para zoom</p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleGenerateReport}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
                  >
                    📄 Gerar Relatório PDF
                  </button>
                  <button
                    onClick={() => setSelectedPoints([])}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700"
                  >
                    🔄 Limpar Seleção
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
