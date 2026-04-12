import React, { useState } from 'react';
import { Home } from './pages/Home';
import { Scales } from './pages/Scales';
import { Cycles } from './pages/Cycles';
import { Patients } from './pages/Patients';
import { Sessions } from './pages/Sessions';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Effectiveness } from './pages/Effectiveness';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { useAuth } from './hooks/useAuth';

type Tab = 'home' | 'scales' | 'cycles' | 'patients' | 'sessions' | 'profile' | 'settings' | 'effectiveness' | 'admin';

export function App() {
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'scales':
        return <Scales />;
      case 'cycles':
        return <Cycles />;
      case 'patients':
        return <Patients />;
      case 'sessions':
        return <Sessions />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'effectiveness':
        return <Effectiveness />;
      case 'admin':
        return user.role === 'admin' ? <Admin /> : <Home />;
      default:
        return <Home />;
    }
  };

  const tabs: { id: Tab; label: string; icon: string; adminOnly?: boolean }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'scales', label: 'Escalas', icon: '📊' },
    { id: 'cycles', label: 'Ciclos', icon: '🔄' },
    { id: 'patients', label: 'Pacientes', icon: '👥' },
    { id: 'sessions', label: 'Nova Sessão', icon: '➕' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
    { id: 'effectiveness', label: 'Efetividade', icon: '📈' },
    { id: 'admin', label: 'Admin', icon: '🔑', adminOnly: true },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">NeuroLaserMap</h1>
          <p className="text-sm text-muted mt-1">Sistema de Mapeamento</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs
            .filter(tab => !tab.adminOnly || user.role === 'admin')
            .map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-border'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <div className="text-sm text-muted">
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
