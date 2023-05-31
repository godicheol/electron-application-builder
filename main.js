// main.js

// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  dialog,
  ipcMain
} = require('electron');
const path = require('path');

// run this as early in the main process as possible
if (require('electron-squirrel-startup')) app.quit();

let mainWindow;
let webContents;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "assets/icons/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      // nodeIntegration: true, // is default value after Electron v5
    }
  });

  webContents = mainWindow.webContents;

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // ...

  webContents.on("did-finish-load", () => {
    console.log("Window loaded.");

    // send to preload.js ipcRenderer.on("test");
    sendValue("test", "Test message from main.js.");
  });

  webContents.on("close", () => {
    console.log("Window closed.");
  });

  // send "pong" to preload.js ipcRenderer.invoke("ping")
  ipcMain.handle('ping', () => 'pong');

  // receive from preload.js ipcRenderer.send("test");
  setListener("test", function(evt, err, res) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(res);
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function isWin() {
  return os.platform() === "win32";
}
function isMac() {
  return os.platform() === "darwin";
}
function isLinux() {
  return os.platform() === "linux";
}
function isLoaded() {
  return mainWindow && mainWindow.webContents && mainWindow.webContents.isLoading() === false;
}
function isFocused() {
  return mainWindow && mainWindow.webContents && mainWindow.webContents.isFocused;
}
function alert(title, message) {
  dialog.showErrorBox(title || "Title", message || "");
}
function sendValue(key, value) {
  mainWindow.webContents.send(key, null, value);
}
function sendError(key, err) {
  mainWindow.webContents.send(key, err);
}
function setListener(key, listener) {
  ipcMain.on(key, listener);
}
function removeListener(key, listener) {
  ipcMain.removeListener(key, listener);
}
function removeAllListeners(key) {
  ipcMain.removeAllListeners(key);
}