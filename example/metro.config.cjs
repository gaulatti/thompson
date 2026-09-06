const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');
const metroWatchFolders = require('./metro-watch-folders.cjs');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');
const config = getDefaultConfig(projectRoot);

config.watchFolders = metroWatchFolders(workspaceRoot);
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
];

module.exports = withStorybook(config, {
  configPath: path.resolve(projectRoot, '.rnstorybook'),
  websockets: 'auto'
});
