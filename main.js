// main.js

// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  session,
} = require('electron');
const path = require('path');

// run this as early in the main process as possible
if (require('electron-squirrel-startup')) app.quit();

let mainWindow;
let webContents;

const methods = {
  alert: function(message) {
    dialog.showErrorBox("Alert", message);
  },
  handle: function(channel, listener) {
    ipcMain.handle(channel, listener);
  },
  send: function(channel, value) {
    if (webContents) {
      webContents.send(channel, value);
    }
  },
  receive: function(channel, listener) {
    ipcMain.on(channel, listener);
  }
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "assets/icons/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true, // https://www.electronjs.org/docs/latest/tutorial/security
      nodeIntegration: false,
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
  });

  webContents.on("close", () => {
    console.log("Window closed.");
  });

  // CSP HTTP headers
  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       'Content-Security-Policy': ['default-src \'none\'']
  //     }
  //   })
  // });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.