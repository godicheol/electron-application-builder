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
})

// send to renderer.js window.preload
contextBridge.exposeInMainWorld('preload', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  // we can also expose variables, not just functions
});

// from main.js
ipcRenderer.on("test", function(e, err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log(res);
  }
});