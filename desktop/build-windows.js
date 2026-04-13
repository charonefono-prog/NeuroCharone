const { build } = require('electron-builder');

build({
  config: {
    appId: 'com.neurolasermap.app',
    productName: 'NeuroLaserMap',
    directories: {
      buildResources: 'assets'
    },
    win: {
      target: ['nsis', 'portable'],
      certificateFile: null,
      certificatePassword: null
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true
    }
  }
}).catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
