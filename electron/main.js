const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const express = require('express');
const cors = require('cors');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let mainWindow;
let server;
let updateAvailable = false;

// Configurar logging para auto-updater
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Criar janela principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../assets/images/icon.png'),
  });

  // URL da aplicação
  const startUrl = isDev
    ? 'http://localhost:8081'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Abrir DevTools em desenvolvimento
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Iniciar servidor backend
function startBackendServer() {
  const backendApp = express();
  
  backendApp.use(cors());
  backendApp.use(express.json());

  // Importar rotas do servidor
  try {
    const serverModule = require('../server/_core/index.ts');
    // As rotas serão configuradas pelo servidor
  } catch (error) {
    console.error('Erro ao carregar servidor:', error);
  }

  server = backendApp.listen(3000, () => {
    console.log('Servidor backend rodando na porta 3000');
  });
}

// Configurar auto-updater
function setupAutoUpdater() {
  // Verificar atualizações ao iniciar
  autoUpdater.checkForUpdatesAndNotify();

  // Verificar atualizações a cada 1 hora
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 3600000);

  // Evento: Atualização disponível
  autoUpdater.on('update-available', (info) => {
    updateAvailable = true;
    log.info('Atualização disponível:', info.version);
    
    if (mainWindow) {
      mainWindow.webContents.send('update-available', {
        version: info.version,
        releaseDate: info.releaseDate,
        releaseNotes: info.releaseNotes,
      });
    }
  });

  // Evento: Atualização baixada
  autoUpdater.on('update-downloaded', (info) => {
    log.info('Atualização baixada:', info.version);
    
    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded', {
        version: info.version,
      });
    }
  });

  // Evento: Erro ao atualizar
  autoUpdater.on('error', (error) => {
    log.error('Erro ao atualizar:', error);
    if (mainWindow) {
      mainWindow.webContents.send('update-error', {
        message: error.message,
      });
    }
  });

  // Evento: Progresso do download
  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow) {
      mainWindow.webContents.send('update-progress', {
        percent: Math.round(progressObj.percent),
        bytesPerSecond: progressObj.bytesPerSecond,
        total: progressObj.total,
        transferred: progressObj.transferred,
      });
    }
  });
}

// Criar menu
function createMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Sair',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Refazer', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Cortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Colar', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: 'Visualizar',
      submenu: [
        { label: 'Recarregar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Recarregar Forçado', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'DevTools', accelerator: 'CmdOrCtrl+Shift+I', role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Verificar Atualizações',
          click: async () => {
            try {
              const result = await autoUpdater.checkForUpdates();
              if (result.updateInfo.version === app.getVersion()) {
                dialog.showMessageBox(mainWindow, {
                  type: 'info',
                  title: 'Sem Atualizações',
                  message: 'Você já possui a versão mais recente do NeuroLaserMap.',
                });
              }
            } catch (error) {
              dialog.showErrorBox('Erro', 'Erro ao verificar atualizações: ' + error.message);
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Sobre NeuroLaserMap',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Sobre NeuroLaserMap',
              message: 'NeuroLaserMap v' + app.getVersion(),
              detail: 'Mapeamento de Neuromodulação com Laser\n\nUm sistema profissional para gerenciamento de pacientes e planos terapêuticos.',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Quando o app está pronto
app.on('ready', () => {
  startBackendServer();
  createWindow();
  createMenu();
  setupAutoUpdater();
});

// Quando todas as janelas são fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Quando o app é ativado (macOS)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handlers IPC
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

// Handler para instalar atualização
ipcMain.handle('install-update', async () => {
  try {
    autoUpdater.quitAndInstall();
    return { success: true };
  } catch (error) {
    log.error('Erro ao instalar atualização:', error);
    return { success: false, error: error.message };
  }
});

// Handler para verificar atualizações manualmente
ipcMain.handle('check-for-updates', async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return {
      success: true,
      updateAvailable: result.updateInfo.version !== app.getVersion(),
      version: result.updateInfo.version,
      currentVersion: app.getVersion(),
    };
  } catch (error) {
    log.error('Erro ao verificar atualizações:', error);
    return { success: false, error: error.message };
  }
});

// Handler para obter status de atualização
ipcMain.handle('get-update-status', () => {
  return { updateAvailable };
});

// Handler para baixar atualização
ipcMain.handle('download-update', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (error) {
    log.error('Erro ao baixar atualização:', error);
    return { success: false, error: error.message };
  }
});

// Tratar erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
  log.error('Erro não capturado:', error);
});
