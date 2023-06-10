const {
  contextBridge,
  ipcRenderer
} = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});

// set window.preload
contextBridge.exposeInMainWorld('preload', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  // we can also expose variables, not just functions
});

// set window.electron 
contextBridge.exposeInMainWorld('methods', {
  invoke: function(channel, value) {
    return ipcRenderer.invoke(channel, value);
  },
  send: function(channel, value) {
    ipcRenderer.send(channel, value);
  },
  receive: function(channel, listener) {
    ipcRenderer.on(channel, listener);
  }
});