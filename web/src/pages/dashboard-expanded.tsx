import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  diagnosis: string;
  createdAt: string;
  userId: string;
}

interface Scale {
  id: string;
  name: string;
  description: string;
  questions: number;
  lastFilled?: string;
  patientId: string;
  userId: string;
}

export default function DashboardExpandedPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [scales, setScales] = useState<Scale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'patients' | 'scales'>('patients');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientDiagnosis, setNewPatientDiagnosis] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userStr || !token) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role === 'admin') {
        router.push('/admin');
        return;
      }
      setUser(userData);
      loadUserData(userData.id);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, isClient]);

  const loadUserData = (userId: string) => {
    // Simular carregamento de pacientes
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '(11) 98765-4321',
        diagnosis: 'Afasia',
        createdAt: '2026-02-01',
        userId,
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '(11) 91234-5678',
        diagnosis: 'Disartria',
        createdAt: '2026-02-05',
        userId,
      },
    ];

    const mockScales: Scale[] = [
      {
        id: '1',
        name: 'Escala de Dor',
        description: 'Avaliação de intensidade de dor',
        questions: 10,
        lastFilled: '2026-02-19',
        patientId: '1',
        userId,
      },
      {
        id: '2',
        name: 'Escala de Funcionalidade',
        description: 'Avaliação de funcionalidade motora',
        questions: 15,
        lastFilled: '2026-02-18',
        patientId: '1',
        userId,
      },
    ];

    setPatients(mockPatients);
    setScales(mockScales);
  };

  const handleAddPatient = () => {
    if (!newPatientName || !newPatientEmail) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const newPatient: Patient = {
      id: Date.now().toString(),
      name: newPatientName,
      email: newPatientEmail,
      phone: newPatientPhone,
      diagnosis: newPatientDiagnosis,
      createdAt: new Date().toISOString().split('T')[0],
      userId: user?.id || '',
    };

    setPatients([...patients, newPatient]);
    setNewPatientName('');
    setNewPatientEmail('');
    setNewPatientPhone('');
    setNewPatientDiagnosis('');
    setShowNewPatientForm(false);
  };

  const handleDeletePatient = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este paciente?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!isClient || loading) {
    return <div style={styles.container}>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>NeuroLaserMap</h1>
          <p style={styles.subtitle}>Bem-vindo, {user.name}!</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('patients')}
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'patients' ? '3px solid #0a7ea4' : 'none',
          }}
        >
          Pacientes ({patients.length})
        </button>
        <button
          onClick={() => setActiveTab('scales')}
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'scales' ? '3px solid #0a7ea4' : 'none',
          }}
        >
          Escalas ({scales.length})
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'patients' && (
          <div>
            <div style={styles.actionBar}>
              <h2>Meus Pacientes</h2>
              <button
                onClick={() => setShowNewPatientForm(!showNewPatientForm)}
                style={styles.primaryButton}
              >
                + Novo Paciente
              </button>
            </div>

            {showNewPatientForm && (
              <div style={styles.form}>
                <h3>Adicionar Novo Paciente</h3>
                <input
                  type="text"
                  placeholder="Nome do paciente"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newPatientEmail}
                  onChange={(e) => setNewPatientEmail(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Diagnóstico"
                  value={newPatientDiagnosis}
                  onChange={(e) => setNewPatientDiagnosis(e.target.value)}
                  style={styles.input}
                />
                <div style={styles.formButtons}>
                  <button onClick={handleAddPatient} style={styles.primaryButton}>
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowNewPatientForm(false)}
                    style={styles.secondaryButton}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div style={styles.grid}>
              {patients.map((patient) => (
                <div key={patient.id} style={styles.card}>
                  <h3>{patient.name}</h3>
                  <p><strong>Email:</strong> {patient.email}</p>
                  <p><strong>Telefone:</strong> {patient.phone}</p>
                  <p><strong>Diagnóstico:</strong> {patient.diagnosis}</p>
                  <p style={styles.date}>Adicionado em: {patient.createdAt}</p>
                  <div style={styles.cardActions}>
                    <button style={styles.editButton}>Editar</button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      style={styles.deleteButton}
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scales' && (
          <div>
            <h2>Escalas Disponíveis</h2>
            <div style={styles.grid}>
              {scales.map((scale) => (
                <div key={scale.id} style={styles.card}>
                  <h3>{scale.name}</h3>
                  <p>{scale.description}</p>
                  <p><strong>Perguntas:</strong> {scale.questions}</p>
                  {scale.lastFilled && (
                    <p style={styles.date}>Última vez: {scale.lastFilled}</p>
                  )}
                  <button style={styles.primaryButton}>Preencher Escala</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#0a7ea4',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  tabs: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
  },
  tab: {
    padding: '10px 0',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    color: '#666',
    transition: 'all 0.3s',
  },
  content: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: '#0a7ea4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  secondaryButton: {
    padding: '10px 20px',
    backgroundColor: '#eee',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  editButton: {
    padding: '8px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  date: {
    fontSize: '12px',
    color: '#999',
    marginTop: '10px',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
};
