import React, { useState } from 'react';

export function Profile() {
  const [profileData, setProfileData] = useState({
    name: 'Dr. Carlos',
    email: 'carlos@example.com',
    crm: '123456',
    specialty: 'Neurologia',
    phone: '(11) 99999-9999',
    clinic: 'Clínica Neural',
    bio: 'Especialista em Neuromodulação',
    darkMode: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-foreground">Meu Perfil</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg text-white ${isEditing ? 'bg-error' : 'bg-primary'}`}
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Avatar */}
        <div className="bg-surface p-6 rounded-lg border border-border text-center">
          <div className="w-32 h-32 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl text-white">👤</span>
          </div>
          {isEditing && (
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 mt-4">
              Alterar Avatar
            </button>
          )}
        </div>

        {/* Dados Profissionais */}
        <div className="col-span-2 bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-6">Dados Profissionais</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-2">Nome</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">CRM</label>
              <input
                type="text"
                value={profileData.crm}
                onChange={(e) => setProfileData({ ...profileData, crm: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Especialidade</label>
              <input
                type="text"
                value={profileData.specialty}
                onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Telefone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Clínica</label>
              <input
                type="text"
                value={profileData.clinic}
                onChange={(e) => setProfileData({ ...profileData, clinic: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-50"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-muted mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-50"
                rows={3}
              />
            </div>
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="mt-6 w-full px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 font-semibold"
            >
              Salvar Alterações
            </button>
          )}
        </div>
      </div>

      {/* Preferências */}
      <div className="mt-6 bg-surface p-6 rounded-lg border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">Preferências</h3>
        <div className="flex items-center justify-between">
          <label className="text-foreground">Modo Escuro</label>
          <input
            type="checkbox"
            checked={profileData.darkMode}
            onChange={(e) => setProfileData({ ...profileData, darkMode: e.target.checked })}
            disabled={!isEditing}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
