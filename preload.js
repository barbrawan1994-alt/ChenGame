const { contextBridge, ipcRenderer } = require('electron');

const send = (channel, ...args) => ipcRenderer.sendSync(channel, ...args);

contextBridge.exposeInMainWorld('desktopSave', {
  read: () => send('save:read'),
  write: (raw) => send('save:write', raw),
  backup: (kind) => send('save:backup', kind),
  remove: () => send('save:remove'),
  info: () => send('save:info'),
});
