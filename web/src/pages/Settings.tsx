import React, { useState } from 'react';

export function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    autoBackup: true,
    backupFrequency: 'weekly',
    dataRetention: '2years',
  });

  const handleExport = () => {
    alert('Exportando dados...');
  };

  const handleBackup = () => {
    alert('Fazendo backup...');
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">Configurações</h2>

      <div className="space-y-6 max-w-2xl">
        {/* Notificações */}
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Notificações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-foreground">Notificações do Sistema</label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-foreground">Notificações por Email</label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Backup e Dados */}
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Backup e Dados</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-foreground">Backup Automático</label>
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            {settings.autoBackup && (
              <div>
                <label className="block text-sm text-muted mb-2">Frequência de Backup</label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                >
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                  <option value="monthly">Mensalmente</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm text-muted mb-2">Retenção de Dados</label>
              <select
                value={settings.dataRetention}
                onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
              >
                <option value="1year">1 Ano</option>
                <option value="2years">2 Anos</option>
                <option value="5years">5 Anos</option>
                <option value="forever">Permanente</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBackup}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
              >
                Fazer Backup Agora
              </button>
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:opacity-90"
              >
                Exportar Dados
              </button>
            </div>
          </div>
        </div>

        {/* Privacidade */}
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Privacidade e Segurança</h3>
          <button className="w-full px-4 py-2 bg-error text-white rounded-lg hover:opacity-90">
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  );
}
