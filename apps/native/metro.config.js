const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Trova la root del workspace (dove sta il file pnpm-lock.yaml)
// Assumendo che la tua app sia in apps/expo, torniamo indietro di due livelli
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Diciamo a Metro di guardare anche nella root del workspace
config.watchFolders = [workspaceRoot];

// 2. Diciamo a Metro di risolvere i moduli dalla cartella node_modules dell'app E della root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Importante per pnpm: disabilita risoluzione symlink (opzionale ma consigliato se hai problemi)
// config.resolver.disableHierarchicalLookup = true;

module.exports = config;
