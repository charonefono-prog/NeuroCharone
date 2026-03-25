#!/usr/bin/env node
/**
 * Post-install script to install lightningcss darwin binaries on macOS (EAS Build).
 * This is needed because react-native-css-interop requires lightningcss native binaries
 * but they are platform-specific and won't install on Linux (Docker/Manus).
 * 
 * Only runs on macOS (darwin) to avoid breaking Linux Docker builds.
 */
const { execSync } = require('child_process');
const os = require('os');

if (os.platform() === 'darwin') {
  console.log('[lightningcss] Detected macOS - installing darwin native binaries...');
  try {
    const arch = os.arch(); // 'arm64' or 'x64'
    const pkg = `lightningcss-darwin-${arch}@1.27.0`;
    console.log(`[lightningcss] Installing ${pkg}...`);
    execSync(`npm install --no-save ${pkg}`, { stdio: 'inherit', cwd: __dirname + '/..' });
    console.log(`[lightningcss] Successfully installed ${pkg}`);
  } catch (err) {
    console.warn('[lightningcss] Warning: Failed to install darwin binaries:', err.message);
    console.warn('[lightningcss] Build may fail if lightningcss is required.');
  }
} else {
  console.log(`[lightningcss] Platform is ${os.platform()} - skipping darwin binary installation.`);
}
