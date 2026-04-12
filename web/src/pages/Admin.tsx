import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  requestedAt: string;
}

export function Admin() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Dr. João', email: 'joao@example.com', status: 'pending', requestedAt: '2026-04-10' },
    { id: 2, name: 'Dra. Maria', email: 'maria@example.com', status: 'approved', requestedAt: '2026-04-05' },
    { id: 3, name: 'Dr. Pedro', email: 'pedro@example.com', status: 'pending', requestedAt: '2026-04-11' },
    { id: 4, name: 'Dr. Carlos', email: 'carlos@example.com', status: 'approved', requestedAt: '2026-04-01' },
  ]);

  const handleApprove = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
    alert('Usuário aprovado!');
  };

  const handleReject = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
    alert('Usuário rejeitado!');
  };

  const handleBlock = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'blocked' } : u));
    alert('Usuário bloqueado!');
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
    alert('Usuário deletado!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-white';
      case 'pending': return 'bg-warning text-white';
      case 'rejected': return 'bg-error text-white';
      case 'blocked': return 'bg-error text-white';
      default: return 'bg-muted text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      case 'blocked': return 'Bloqueado';
      default: return 'Desconhecido';
    }
  };

  const pendingUsers = users.filter(u => u.status === 'pending');
  const approvedUsers = users.filter(u => u.status === 'approved');
  const blockedUsers = users.filter(u => u.status === 'blocked' || u.status === 'rejected');

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">Painel Administrativo</h2>

      {/* Resumo */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-sm text-muted">Total de Usuários</p>
          <p className="text-2xl font-bold text-primary">{users.length}</p>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-sm text-muted">Pendentes</p>
          <p className="text-2xl font-bold text-warning">{pendingUsers.length}</p>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-sm text-muted">Aprovados</p>
          <p className="text-2xl font-bold text-success">{approvedUsers.length}</p>
        </div>
        <div className="bg-surface p-4 rounded-lg border border-border">
          <p className="text-sm text-muted">Bloqueados</p>
          <p className="text-2xl font-bold text-error">{blockedUsers.length}</p>
        </div>
      </div>

      {/* Usuários Pendentes */}
      {pendingUsers.length > 0 && (
        <div className="mb-8 bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Aprovações Pendentes</h3>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-4 bg-background rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="px-4 py-2 bg-success text-white rounded-lg hover:opacity-90"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todos os Usuários */}
      <div className="bg-surface p-6 rounded-lg border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">Todos os Usuários</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2 text-foreground">Nome</th>
                <th className="text-left px-4 py-2 text-foreground">Email</th>
                <th className="text-left px-4 py-2 text-foreground">Status</th>
                <th className="text-left px-4 py-2 text-foreground">Data</th>
                <th className="text-left px-4 py-2 text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-background">
                  <td className="px-4 py-3 text-foreground">{user.name}</td>
                  <td className="px-4 py-3 text-muted">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-sm">{user.requestedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {user.status === 'approved' && (
                        <button
                          onClick={() => handleBlock(user.id)}
                          className="px-2 py-1 bg-warning text-white text-sm rounded hover:opacity-90"
                        >
                          Bloquear
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-2 py-1 bg-error text-white text-sm rounded hover:opacity-90"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
