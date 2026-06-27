// main/main.js

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { ensureDb } = require("./db");

const isDev= process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

let mainWindow;
/* Cargar DB (per-usuario) */
let db;



/* Preregistrar IPCs si existen *
/* CREAR VENTANA PRINCIPAL*/
function createMainWindow() {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, '..', 'public', 'login.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach'});
    })

    // Abrir links externos en el navegador del sistema
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny'};
    });
}

/**Evitar multiples instancias */
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        app.setAppUserModelId('com.tuempresa.aprendiendo'); // útil para notificaciones/Atajos
        
        db = ensureDb();

        require("./auth.ipc.js")(ipcMain, db);
        require("./score.ipc.js")(ipcMain, db);


        createMainWindow();
    
        app.on('activate', () => {
          if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
          }
        });
      });

}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });