// Basic init
const { app, BrowserWindow } = require('electron');

// Let electron reloads by itself when webpack watches changes in ./app/
// webpack compiles a new build files every time when files are changed
// electron-reload only watch the build directory for hot loading
require('electron-reload')(`${__dirname}/build`);

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
