# Implementação de Atualização Automática - Guia Técnico

**Instruções detalhadas para desenvolvedores**

Versão: 1.0.0 | Janeiro de 2026

---

## 📋 Visão Geral

Este guia descreve como implementar e usar o sistema de atualização automática no NeuroLaserMap Electron.

---

## 🔧 Arquivos Modificados

### 1. electron/main.js

**Mudanças:**
- Importado `electron-updater` e `electron-log`
- Adicionada função `setupAutoUpdater()`
- Configurados listeners para eventos de atualização
- Adicionados handlers IPC para controlar atualizações

**Funcionalidades:**
- Verificação automática a cada hora
- Notificações quando atualização está disponível
- Progresso do download
- Instalação automática

### 2. electron/preload.js

**Mudanças:**
- Adicionado objeto `updater` ao contextBridge
- Exposto métodos para verificar, baixar e instalar atualizações
- Adicionados listeners para eventos de atualização

**APIs Expostas:**
- `updater.checkForUpdates()` - Verificar atualizações
- `updater.downloadUpdate()` - Baixar atualização
- `updater.installUpdate()` - Instalar atualização
- `updater.getUpdateStatus()` - Obter status
- `updater.onUpdateAvailable(callback)` - Listener
- `updater.onUpdateDownloaded(callback)` - Listener
- `updater.onUpdateProgress(callback)` - Listener
- `updater.onUpdateError(callback)` - Listener

### 3. components/update-notification.tsx

**Novo Componente:**
- Modal que mostra notificações de atualização
- Barra de progresso do download
- Botões para baixar e instalar
- Tratamento de erros

**Props:**
- Nenhuma (usa APIs globais do Electron)

**Estados:**
- `updateAvailable` - Se há atualização disponível
- `updateDownloaded` - Se atualização foi baixada
- `isDownloading` - Se está baixando
- `downloadProgress` - Progresso do download

---

## 🚀 Como Usar no Aplicativo

### Passo 1: Importar o Componente

No arquivo `app/_layout.tsx` ou `app/(tabs)/_layout.tsx`:

```tsx
import { UpdateNotificationComponent } from '@/components/update-notification';

export default function RootLayout() {
  return (
    <Stack>
      <UpdateNotificationComponent />
      {/* Resto do layout */}
    </Stack>
  );
}
```

### Passo 2: Usar as APIs de Atualização

Em qualquer componente React:

```tsx
import { useEffect } from 'react';

export function MyComponent() {
  useEffect(() => {
    const checkUpdates = async () => {
      if (typeof window !== 'undefined' && (window as any).updater) {
        const updater = (window as any).updater;
        const result = await updater.checkForUpdates();
        console.log('Atualização disponível:', result.updateAvailable);
      }
    };

    checkUpdates();
  }, []);

  return <Text>Verificando atualizações...</Text>;
}
```

---

## 🔐 Configuração de Segurança

### Isolamento de Contexto

O preload.js usa `contextIsolation: true` para:
- Impedir acesso direto ao Node.js
- Validar todas as chamadas IPC
- Proteger contra injeção de código

### Validação de Mensagens

Todas as mensagens IPC são validadas:
- Verificação de tipo
- Validação de dados
- Tratamento de erros

---

## 📦 Dependências

### electron-updater

```bash
npm install electron-updater
```

**Versão:** ^6.0.0 ou superior

**Funcionalidades:**
- Verificação de atualizações
- Download de arquivos
- Instalação automática
- Suporte para múltiplos provedores

### electron-log

```bash
npm install electron-log
```

**Versão:** ^5.0.0 ou superior

**Funcionalidades:**
- Logging estruturado
- Múltiplos transportes
- Níveis de log

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────┐
│ Aplicação React (Renderer Process)                  │
│                                                      │
│  UpdateNotificationComponent                        │
│  ↓                                                   │
│  window.updater.checkForUpdates()                   │
└─────────────────────────────────────────────────────┘
                      ↓ IPC
┌─────────────────────────────────────────────────────┐
│ Electron Main Process                               │
│                                                      │
│  ipcMain.handle('check-for-updates', ...)           │
│  ↓                                                   │
│  autoUpdater.checkForUpdates()                      │
│  ↓                                                   │
│  GitHub API (Releases)                              │
└─────────────────────────────────────────────────────┘
                      ↓ IPC
┌─────────────────────────────────────────────────────┐
│ Aplicação React (Renderer Process)                  │
│                                                      │
│  Recebe resultado e atualiza UI                     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Eventos de Atualização

### update-available

Disparado quando uma nova versão está disponível.

```typescript
interface UpdateInfo {
  version: string;
  releaseDate: string;
  releaseNotes: string;
}
```

### update-downloaded

Disparado quando a atualização foi completamente baixada.

```typescript
interface UpdateInfo {
  version: string;
}
```

### update-progress

Disparado durante o download com progresso.

```typescript
interface ProgressInfo {
  percent: number;
  bytesPerSecond: number;
  total: number;
  transferred: number;
}
```

### update-error

Disparado quando há erro na atualização.

```typescript
interface ErrorInfo {
  message: string;
}
```

---

## 🧪 Testes

### Teste Local

Para testar o auto-update localmente:

1. Modifique a versão em `package.json`
2. Execute `npm run electron-dev`
3. Verifique se a notificação aparece

### Teste com Release Real

1. Crie um release no GitHub
2. Execute o build: `npm run electron-build:all`
3. Teste em outro computador

---

## 🐛 Debugging

### Verificar Logs

Os logs de atualização estão em:

**Windows:**
```
%APPDATA%\NeuroLaserMap\logs\electron-updater.log
```

**macOS:**
```
~/Library/Logs/NeuroLaserMap/electron-updater.log
```

### DevTools

Para debugar no Electron:

1. Pressione `Ctrl+Shift+I` (Windows) ou `Cmd+Option+I` (macOS)
2. Vá para a aba **Console**
3. Verifique se há erros

### Logging Manual

```typescript
const log = require('electron-log');

log.info('Verificando atualizações...');
log.warn('Atualização não disponível');
log.error('Erro ao baixar:', error);
```

---

## 🔄 Atualizar Versão

### Passo 1: Atualizar package.json

```json
{
  "version": "1.1.0"
}
```

### Passo 2: Criar Release no GitHub

1. Vá para **Releases**
2. Clique em **Create a new release**
3. Tag: `v1.1.0`
4. Título: `NeuroLaserMap 1.1.0`
5. Descrição: Notas de atualização

### Passo 3: Fazer Build

```bash
npm run electron-build:all
```

### Passo 4: Publicar

Os arquivos serão publicados automaticamente no release do GitHub.

---

## 📝 Notas de Atualização

### Formato Recomendado

```markdown
## NeuroLaserMap 1.1.0

### Novas Funcionalidades
- Adicionado suporte para exportação em PDF
- Melhorado o desempenho da visualização 3D

### Correções de Bugs
- Corrigido erro ao salvar pacientes
- Corrigido crash ao gerar relatório

### Melhorias
- Atualizada interface do usuário
- Melhorado suporte para macOS

### Requisitos
- macOS 10.13 ou superior
- Windows 10 ou superior
```

---

## 🎯 Boas Práticas

1. **Sempre versione** - Atualize a versão antes de publicar
2. **Teste completamente** - Teste a atualização antes de publicar
3. **Documente mudanças** - Escreva notas claras
4. **Mantenha compatibilidade** - Não quebre funcionalidades existentes
5. **Monitore logs** - Verifique os logs de atualização regularmente

---

## 🚨 Troubleshooting

| Problema | Solução |
|----------|---------|
| Atualização não aparece | Verifique se versão no release é maior |
| Erro ao baixar | Verifique conexão com internet |
| Erro ao instalar | Reinicie o computador |
| Logs não aparecem | Verifique permissões de pasta |
| GitHub não encontrado | Verifique token e configuração |

---

## 📚 Referências

- [electron-updater Docs](https://www.electron.build/auto-update)
- [electron-log Docs](https://github.com/megahertz/electron-log)
- [GitHub Releases API](https://docs.github.com/en/rest/releases)
- [Electron IPC](https://www.electronjs.org/docs/api/ipc-main)

---

**NeuroLaserMap Electron** - Implementação de Auto-Update

Versão 1.0.0 | Janeiro de 2026
