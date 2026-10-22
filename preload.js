const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  downloadModel: (modelKey, modelUrl, targetSubDir) => 
    ipcRenderer.invoke('download-model', modelKey, modelUrl, targetSubDir),
  onDownloadProgress: (callback) => 
    ipcRenderer.on('download-progress', (event, data) => callback(data)),
});
