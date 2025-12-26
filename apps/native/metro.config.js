const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Trova la root del workspace (dove sta il file pnpm-lock.yaml)
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Diciamo a Metro di guardare anche nella root del workspace
config.watchFolders = [workspaceRoot];

// 2. Diciamo a Metro di risolvere i moduli dalla cartella node_modules dell'app E della root
// L'ordine è importante: prima l'app, poi la root (così l'app ha priorità per React)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Abilita package exports per supportare il campo "react-native" nel package.json
config.resolver.unstable_enablePackageExports = true;

// 4. Forza la risoluzione di React e React Native sempre dalla stessa posizione (quella dell'app)
// Questo evita problemi con multiple copie di React
const reactPath = require.resolve('react', { paths: [projectRoot] });
const reactNativePath = require.resolve('react-native', { paths: [projectRoot] });
const reactJsxRuntimePath = require.resolve('react/jsx-runtime', { paths: [projectRoot] });

config.resolver.extraNodeModules = {
  'react': path.dirname(reactPath),
  'react-native': path.dirname(reactNativePath),
  'react/jsx-runtime': path.dirname(reactJsxRuntimePath),
};

// 5. Risolvi esplicitamente React per evitare problemi con multiple copie
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Forza React e react/jsx-runtime a risolvere sempre dalla stessa posizione
  if (moduleName === 'react' || moduleName === 'react/jsx-runtime') {
    try {
      const resolvedPath = require.resolve(moduleName, { paths: [projectRoot] });
      return {
        filePath: resolvedPath,
        type: 'sourceFile',
      };
    } catch (e) {
      // Se non riesce a risolvere, usa il resolver di default
    }
  }

  // Usa la risoluzione di default per tutti gli altri moduli
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
