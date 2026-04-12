import React, { useState } from 'react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home')

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
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">NeuroLaserMap</h1>
        </div>
        <nav className="p-4 space-y-2">
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
                  <p className="text-3xl font-bold text-blue-600">4</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Ativos</p>
                  <p className="text-3xl font-bold text-green-600">4</p>
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
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Paciente 1</td>
                      <td className="px-6 py-4 text-sm text-gray-600">paciente1@email.com</td>
                      <td className="px-6 py-4 text-sm"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">Ativo</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'admin' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Painel Administrativo</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Gerenciar Usuários</h3>
                <p className="text-gray-600">Funcionalidade de admin em desenvolvimento...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
