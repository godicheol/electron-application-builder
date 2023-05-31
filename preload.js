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
  // send to main.js ipcMain.handle("ping") and receive data
  ping: () => ipcRenderer.invoke('ping'),
  // we can also expose variables, not just functions
});

function setListener(key, listener) {
  ipcRenderer.on(key, listener);
}
function removeListener(key, listener) {
  ipcRenderer.removeListener(key, listener);
}
function removeAllListeners(key) {
  ipcRenderer.removeAllListeners(key);
}
function sendValue(key, value) {
  ipcRenderer.send(key, null, value);
}
function sendError(key, err) {
  ipcRenderer.send(key, err);
}

// receive from main.js
setListener("test", function(evt, err, res) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(res);
});

// send to main.js
sendValue("test", "Test message from preload.js");