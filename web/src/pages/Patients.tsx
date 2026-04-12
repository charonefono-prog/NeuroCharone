import React, { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await trpc.patients.list.query();
      setPatients(data || []);
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await trpc.patients.create.mutate(formData);
      setFormData({ name: '', email: '', phone: '' });
      setShowForm(false);
      loadPatients();
    } catch (err) {
      console.error('Failed to create patient:', err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-foreground">Pacientes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
        >
          {showForm ? 'Cancelar' : 'Novo Paciente'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddPatient} className="bg-surface p-6 rounded-lg mb-6 border border-border">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-success text-white rounded-lg hover:opacity-90"
          >
            Salvar Paciente
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-muted">Carregando...</p>
      ) : patients.length === 0 ? (
        <p className="text-muted">Nenhum paciente cadastrado</p>
      ) : (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-surface p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground">{patient.name}</h3>
              <p className="text-sm text-muted">{patient.email}</p>
              <p className="text-sm text-muted">{patient.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
