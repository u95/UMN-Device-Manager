const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Check driver installation status
  checkDrivers: () => ipcRenderer.invoke('diagnostic:check-drivers'),
  
  // Safe ADB triggers
  adbExecute: (args) => ipcRenderer.invoke('adb:execute', args),
  
  // Safe Fastboot triggers
  fastbootExecute: (args) => ipcRenderer.invoke('fastboot:execute', args),
  
  // Open local file system dialogs (useful for APK installation / backups)
  openFileDialog: (options) => ipcRenderer.invoke('dialog:open-file', options),
  
  // Write custom reports or backups to client disk
  saveFile: (defaultName, content) => ipcRenderer.invoke('fs:save-file', { defaultName, content }),
  
  // Identify if running inside Electron wrapper vs. Web browser
  isElectron: true
});
