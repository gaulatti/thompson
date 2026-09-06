const fs = require('node:fs');
const path = require('node:path');

module.exports = function metroWatchFolders(workspaceRoot, pathExists = fs.existsSync) {
  const siblingBleecker = path.resolve(workspaceRoot, '../bleecker');
  return pathExists(siblingBleecker) ? [workspaceRoot, siblingBleecker] : [workspaceRoot];
};
