import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
}

export default function AdminExpandedPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'stats' | 'settings'>('users');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
      if (userData.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setAdmin(userData);
      loadUsers();
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, isClient]);

  const loadUsers = () => {
    // Simular carregamento de usuários
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'teste1@email.com',
        name: 'Teste 1',
        role: 'user',
        createdAt: '2026-02-01',
        lastLogin: '2026-02-20',
      },
      {
        id: '2',
        email: 'teste2@email.com',
        name: 'Teste 2',
        role: 'user',
        createdAt: '2026-02-05',
        lastLogin: '2026-02-19',
      },
    ];
    setUsers(mockUsers);
  };

  const handleAddUser = () => {
    if (!newUserEmail || !newUserName || !newUserPassword) {
      alert('Preencha todos os campos');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: newUserEmail,
      name: newUserName,
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserName('');
    setNewUserPassword('');
    setShowNewUserForm(false);
    alert('Usuário criado com sucesso!');
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      setUsers(users.filter(u => u.id !== id));
      alert('Usuário deletado com sucesso!');
    }
  };

  const handleResetPassword = (email: string) => {
    if (confirm(`Resetar senha de ${email}?`)) {
      alert(`Email de reset enviado para ${email}`);
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

  if (!admin) {
    return null;
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.lastLogin).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>NeuroLaserMap - Painel de Admin</h1>
          <p style={styles.subtitle}>Administrador: {admin.email}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'users' ? '3px solid #0a7ea4' : 'none',
          }}
        >
          Usuários ({totalUsers})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'stats' ? '3px solid #0a7ea4' : 'none',
          }}
        >
          Estatísticas
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'settings' ? '3px solid #0a7ea4' : 'none',
          }}
        >
          Configurações
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'users' && (
          <div>
            <div style={styles.actionBar}>
              <h2>Gerenciar Usuários</h2>
              <button
                onClick={() => setShowNewUserForm(!showNewUserForm)}
                style={styles.primaryButton}
              >
                + Novo Usuário
              </button>
            </div>

            {showNewUserForm && (
              <div style={styles.form}>
                <h3>Adicionar Novo Usuário</h3>
                <input
                  type="text"
                  placeholder="Nome"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  style={styles.input}
                />
                <div style={styles.formButtons}>
                  <button onClick={handleAddUser} style={styles.primaryButton}>
                    Criar Usuário
                  </button>
                  <button
                    onClick={() => setShowNewUserForm(false)}
                    style={styles.secondaryButton}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div style={styles.table}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableCell}>Nome</th>
                    <th style={styles.tableCell}>Email</th>
                    <th style={styles.tableCell}>Criado em</th>
                    <th style={styles.tableCell}>Último Acesso</th>
                    <th style={styles.tableCell}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{user.name}</td>
                      <td style={styles.tableCell}>{user.email}</td>
                      <td style={styles.tableCell}>{user.createdAt}</td>
                      <td style={styles.tableCell}>{user.lastLogin}</td>
                      <td style={styles.tableCell}>
                        <button
                          onClick={() => handleResetPassword(user.email)}
                          style={styles.resetButton}
                        >
                          Reset Senha
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={styles.deleteButton}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <h2>Estatísticas</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h3>Total de Usuários</h3>
                <p style={styles.statNumber}>{totalUsers}</p>
              </div>
              <div style={styles.statCard}>
                <h3>Usuários Ativos</h3>
                <p style={styles.statNumber}>{activeUsers}</p>
              </div>
              <div style={styles.statCard}>
                <h3>Taxa de Atividade</h3>
                <p style={styles.statNumber}>{totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2>Configurações</h2>
            <div style={styles.settingsCard}>
              <h3>Informações do Sistema</h3>
              <p><strong>Versão:</strong> 1.0.0</p>
              <p><strong>Ambiente:</strong> Produção</p>
              <p><strong>Banco de Dados:</strong> PostgreSQL</p>
              <p><strong>Última Atualização:</strong> 2026-02-20</p>
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
  resetButton: {
    padding: '6px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '5px',
  },
  deleteButton: {
    padding: '6px 12px',
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
  table: {
    overflowX: 'auto',
  },
  tableHeader: {
    backgroundColor: '#f9f9f9',
    borderBottom: '2px solid #ddd',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
  },
  tableCell: {
    padding: '12px',
    textAlign: 'left',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  statCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #eee',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0a7ea4',
    margin: '10px 0 0 0',
  },
  settingsCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
};
