import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Verificar se usuário é admin
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
      setUser(userData);
      loadUsers();
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, isClient]);

  const loadUsers = async () => {
    try {
      // Simular carregamento de usuários
      const mockUsers: UserData[] = [
        {
          id: 'user-001',
          email: 'teste1@email.com',
          name: 'Usuário Teste 1',
          role: 'user',
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: 'user-002',
          email: 'teste2@email.com',
          name: 'Usuário Teste 2',
          role: 'user',
          createdAt: new Date().toISOString(),
          isActive: true,
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar adição de usuário
    alert(`Usuário ${newUserEmail} seria adicionado aqui`);
    setNewUserEmail('');
    setNewUserName('');
    setShowNewUserForm(false);
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
        <h1 style={styles.title}>NeuroLaserMap - Painel de Admin</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2>Gerenciamento de Usuários</h2>
            <button
              onClick={() => setShowNewUserForm(!showNewUserForm)}
              style={styles.primaryButton}
            >
              + Novo Usuário
            </button>
          </div>

          {showNewUserForm && (
            <form onSubmit={handleAddUser} style={styles.form}>
              <input
                type="email"
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Nome"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                style={styles.input}
                required
              />
              <div style={styles.formButtons}>
                <button type="submit" style={styles.primaryButton}>
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewUserForm(false)}
                  style={styles.secondaryButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nome</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.name}</td>
                  <td>{u.isActive ? '✓ Ativo' : '✗ Inativo'}</td>
                  <td>
                    <button style={styles.smallButton}>Editar</button>
                    <button style={styles.smallButton}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.card}>
          <h2>Estatísticas</h2>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statValue}>{users.length}</div>
              <div style={styles.statLabel}>Total de Usuários</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statValue}>{users.filter((u) => u.isActive).length}</div>
              <div style={styles.statLabel}>Usuários Ativos</div>
            </div>
          </div>
        </div>
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#0a7ea4',
    margin: 0,
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: '#0a7ea4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  secondaryButton: {
    padding: '10px 20px',
    backgroundColor: '#ddd',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px',
  },
  stat: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginTop: '10px',
  },
  smallButton: {
    padding: '6px 12px',
    backgroundColor: '#0a7ea4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '5px',
  },
};
