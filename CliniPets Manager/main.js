const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process'); // Módulo para ejecutar procesos externos
const url = require('url');
const path = require('path');

let mainWindow;
let serverProcess; // Variable para manejar el proceso del servidor

// Función para crear la ventana principal
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.setMenuBarVisibility(false); // Ocultar la barra de menú
  mainWindow.maximize(); // Maximiza la ventana cuando se crea la app

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/project_ing_software20/browser/index.csr.html`),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.on('closed', function () {
    mainWindow = null;
    if (serverProcess) serverProcess.kill(); // Termina el servidor cuando la app se cierra
  });
}

// Función para iniciar el servidor local
function startServer() {
  serverProcess = spawn('node', [path.join(__dirname, 'index.js')]);

  // Opcional: Logs del servidor en la consola de Electron
  serverProcess.stdout.on('data', (data) => {
    console.log(`Servidor: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Error en el servidor: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`El servidor se cerró con el código ${code}`);
  });
}

// Eventos de Electron
app.on('ready', () => {
  startServer(); // Inicia el servidor API
  createWindow(); // Crea la ventana principal
});

app.on('window-all-closed', function () {
  if (serverProcess) serverProcess.kill(); // Termina el servidor cuando la app se cierra
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
