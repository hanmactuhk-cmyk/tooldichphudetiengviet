const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const https = require('https');

let mainWindow;
let pythonServerProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'HN Voice Studio v3 Turbo - Offline Desktop',
    backgroundColor: '#121214',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'resources/icon.png')
  });

  // In production load built vite files, in dev load localhost:3000
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

// Start Python FastAPI backend worker for local model execution
function startPythonBackend() {
  const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';
  const workerScript = path.join(__dirname, 'resources/backend/worker_server.py');

  if (fs.existsSync(workerScript)) {
    pythonServerProcess = spawn(pythonExecutable, [workerScript], {
      stdio: 'inherit',
      shell: true
    });
    console.log('Python local model worker started.');
  }
}

app.whenReady().then(() => {
  startPythonBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (pythonServerProcess) {
    pythonServerProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handler to download models from Hugging Face with progress
ipcMain.handle('download-model', async (event, modelKey, modelUrl, targetSubDir) => {
  const targetDir = path.join(app.getPath('userData'), 'resources', 'models', targetSubDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fileName = path.basename(modelUrl.split('?')[0]);
  const filePath = path.join(targetDir, fileName);

  if (fs.existsSync(filePath)) {
    return { success: true, path: filePath, cached: true };
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(modelUrl, (response) => {
      const totalSize = parseInt(response.headers['content-length'], 10) || 0;
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        file.write(chunk);
        if (totalSize > 0) {
          const percent = Math.round((downloadedSize / totalSize) * 100);
          mainWindow.webContents.send('download-progress', { modelKey, percent, downloadedSize, totalSize });
        }
      });

      response.on('end', () => {
        file.end();
        resolve({ success: true, path: filePath, cached: false });
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
});
