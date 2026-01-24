import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Server Health and Stability', () => {
  const projectRoot = path.join(__dirname, '..');
  const packageJsonPath = path.join(projectRoot, 'package.json');

  // Load package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  describe('Dependencies Validation', () => {
    it('should not have incompatible dependencies', () => {
      const incompatibleDeps = [
        '@react-three/drei',
        '@react-three/fiber',
        'three',
        'electron',
        'electron-builder',
        'stl-loader',
      ];

      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      incompatibleDeps.forEach((dep) => {
        expect(
          allDeps[dep],
          `${dep} should not be installed (incompatible with React Native)`
        ).toBeUndefined();
      });
    });

    it('should have required Expo dependencies', () => {
      const requiredDeps = ['expo', 'react-native', 'nativewind'];

      requiredDeps.forEach((dep) => {
        expect(
          packageJson.dependencies[dep],
          `${dep} is required for Expo projects`
        ).toBeDefined();
      });
    });

    it('should have correct Expo version', () => {
      expect(packageJson.dependencies.expo).toMatch(/~54\./);
    });

    it('should have correct React Native version', () => {
      expect(packageJson.dependencies['react-native']).toBe('0.81.5');
    });

    it('should have tRPC dependencies', () => {
      const trpcDeps = ['@trpc/client', '@trpc/react-query', '@trpc/server'];

      trpcDeps.forEach((dep) => {
        expect(packageJson.dependencies[dep]).toBeDefined();
      });
    });

    it('should have xlsx for data export', () => {
      expect(packageJson.dependencies.xlsx).toBeDefined();
    });
  });

  describe('Project Structure', () => {
    it('should have app directory', () => {
      const appDir = path.join(projectRoot, 'app');
      expect(fs.existsSync(appDir)).toBe(true);
    });

    it('should have components directory', () => {
      const componentsDir = path.join(projectRoot, 'components');
      expect(fs.existsSync(componentsDir)).toBe(true);
    });

    it('should have lib directory', () => {
      const libDir = path.join(projectRoot, 'lib');
      expect(fs.existsSync(libDir)).toBe(true);
    });

    it('should have server directory', () => {
      const serverDir = path.join(projectRoot, 'server');
      expect(fs.existsSync(serverDir)).toBe(true);
    });

    it('should have app.config.ts', () => {
      const appConfig = path.join(projectRoot, 'app.config.ts');
      expect(fs.existsSync(appConfig)).toBe(true);
    });

    it('should have tailwind.config.js', () => {
      const tailwindConfig = path.join(projectRoot, 'tailwind.config.js');
      expect(fs.existsSync(tailwindConfig)).toBe(true);
    });

    it('should have theme.config.js', () => {
      const themeConfig = path.join(projectRoot, 'theme.config.js');
      expect(fs.existsSync(themeConfig)).toBe(true);
    });
  });

  describe('Configuration Files', () => {
    it('should have valid package.json', () => {
      expect(packageJson.name).toBeDefined();
      expect(packageJson.version).toBeDefined();
      expect(packageJson.scripts).toBeDefined();
    });

    it('should have required scripts', () => {
      const requiredScripts = ['dev', 'build', 'check', 'lint', 'test'];

      requiredScripts.forEach((script) => {
        expect(
          packageJson.scripts[script],
          `Script "${script}" is required`
        ).toBeDefined();
      });
    });

    it('should have correct package manager', () => {
      expect(packageJson.packageManager).toMatch(/pnpm@/);
    });
  });

  describe('TypeScript Configuration', () => {
    it('should have tsconfig.json', () => {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
    });

    it('tsconfig.json should be valid JSON', () => {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      const content = fs.readFileSync(tsconfigPath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe('Build Configuration', () => {
    it('should have babel.config.js', () => {
      const babelConfig = path.join(projectRoot, 'babel.config.js');
      expect(fs.existsSync(babelConfig)).toBe(true);
    });

    it('should have .gitignore', () => {
      const gitignore = path.join(projectRoot, '.gitignore');
      expect(fs.existsSync(gitignore)).toBe(true);
    });

    it('should have .npmrc', () => {
      const npmrc = path.join(projectRoot, '.npmrc');
      expect(fs.existsSync(npmrc)).toBe(true);
    });
  });

  describe('Documentation', () => {
    it('should have SERVER_STABILITY_GUIDE.md', () => {
      const guide = path.join(projectRoot, 'SERVER_STABILITY_GUIDE.md');
      expect(fs.existsSync(guide)).toBe(true);
    });

    it('should have documentation', () => {
      const appDesc = path.join(projectRoot, 'APP_DESCRIPTION.md');
      expect(fs.existsSync(appDesc)).toBe(true);
    });

    it('should have todo.md', () => {
      const todo = path.join(projectRoot, 'todo.md');
      expect(fs.existsSync(todo)).toBe(true);
    });
  });

  describe('No Conflicting Dependencies', () => {
    it('should not have both Three.js and React Native', () => {
      const hasThreeJs = !!packageJson.dependencies.three;
      const hasReactNative = !!packageJson.dependencies['react-native'];

      expect(hasThreeJs && hasReactNative).toBe(false);
    });

    it('should not have both Electron and Expo', () => {
      const hasElectron = !!packageJson.devDependencies.electron;
      const hasExpo = !!packageJson.dependencies.expo;

      expect(hasElectron && hasExpo).toBe(false);
    });

    it('should not have stl-loader with React Native', () => {
      const hasStlLoader = !!packageJson.dependencies['stl-loader'];
      const hasReactNative = !!packageJson.dependencies['react-native'];

      expect(hasStlLoader && hasReactNative).toBe(false);
    });
  });

  describe('Version Constraints', () => {
    it('should have compatible React and React Native versions', () => {
      const reactVersion = packageJson.dependencies.react;
      const reactNativeVersion = packageJson.dependencies['react-native'];

      expect(reactVersion).toBeDefined();
      expect(reactNativeVersion).toBeDefined();
    });

    it('should use pnpm as package manager', () => {
      expect(packageJson.packageManager).toContain('pnpm');
    });

    it('should have TypeScript in devDependencies', () => {
      expect(packageJson.devDependencies.typescript).toBeDefined();
    });
  });
});
