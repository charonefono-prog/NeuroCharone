import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Verificar se usuário está autenticado
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userStr || !token) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, isClient]);

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
        <h1 style={styles.title}>NeuroLaserMap - Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </div>

      <div style={styles.card}>
        <h2>Bem-vindo, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <p>Função: {user.role === 'admin' ? 'Administrador' : 'Usuário'}</p>

        <div style={styles.section}>
          <h3>Seus Pacientes</h3>
          <p style={styles.placeholder}>Nenhum paciente cadastrado ainda</p>
          <button style={styles.primaryButton}>+ Adicionar Paciente</button>
        </div>

        <div style={styles.section}>
          <h3>Escalas Recentes</h3>
          <p style={styles.placeholder}>Nenhuma escala preenchida ainda</p>
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
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  placeholder: {
    color: '#999',
    fontStyle: 'italic',
    margin: '10px 0',
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: '#0a7ea4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '10px',
  },
};
