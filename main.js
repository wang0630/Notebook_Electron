// Basic init
const { app, BrowserWindow } = require('electron');

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname);

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // Open the dev window
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/build/index.html`);
});
