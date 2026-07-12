const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');

let mainWindow;

// Safe ADB & Fastboot Executable resolver
function getToolPath(toolName) {
  // Check typical installation paths or local platform-tools directory
  const localPath = path.join(__dirname, 'platform-tools', `${toolName}.exe`);
  if (fs.existsSync(localPath)) {
    return `"${localPath}"`;
  }
  return toolName; // fallback to system environment path variable
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 720,
    title: "UMN Device Manager Suite v1.0.0",
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: true,
  });

  // Load the Vite local dev server port in development
  // or compile output dist/index.html in production
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron secure App Lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler Registrations
// 1. Diagnostics & Port Sweeper
ipcMain.handle('diagnostic:check-drivers', async () => {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32';
    if (!isWin) {
      resolve({ status: 'Success', details: 'Non-Windows OS. Simulating driver health.' });
      return;
    }
    // Query registry for connected Android USB Devices or driver classes
    exec('reg query HKLM\\System\\CurrentControlSet\\Control\\Class\\{3f966bd9-fa04-4ec5-991c-d326973b5128}', (err, stdout) => {
      if (err) {
        resolve({ status: 'Warning', details: 'Google USB Driver registry key not found. Legacy fallback active.' });
      } else {
        resolve({ status: 'Success', details: 'Google Android USB Driver Class fully registered in Registry.' });
      }
    });
  });
});

// 2. Safe ADB Executer (No security-circumventing commands allowed)
ipcMain.handle('adb:execute', async (event, args) => {
  return new Promise((resolve) => {
    const adbPath = getToolPath('adb');
    const safeArgs = args.filter(arg => !arg.includes(';') && !arg.includes('&') && !arg.includes('|'));
    const cmd = `${adbPath} ${safeArgs.join(' ')}`;

    // Reject security-circumventing parameters
    const forbidden = ['frp', 'bypass', 'unlock', 'oem', 'lock_state', 'imei', 'nvram'];
    if (safeArgs.some(arg => forbidden.some(f => arg.toLowerCase().includes(f)))) {
      resolve({ success: false, error: 'Command BLOCKED by UMN Security Audit Policy. Unauthorized parameters detected.' });
      return;
    }

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        resolve({ success: false, error: stderr || err.message });
      } else {
        resolve({ success: true, output: stdout });
      }
    });
  });
});

// 3. Fastboot Command Interop with safeguard filters
ipcMain.handle('fastboot:execute', async (event, args) => {
  return new Promise((resolve) => {
    const fastbootPath = getToolPath('fastboot');
    const safeArgs = args.filter(arg => !arg.includes(';') && !arg.includes('&') && !arg.includes('|'));
    
    // Prevent sensitive lock tampering operations
    const blockedKeywords = ['oem unlock', 'unlocking', 'tamper', 'baseband', 'erase nvram', 'write-imei'];
    const joinedArgs = safeArgs.join(' ').toLowerCase();
    
    if (blockedKeywords.some(keyword => joinedArgs.includes(keyword))) {
      resolve({ success: false, error: 'Command BLOCKED. Bootloader security tampering is forbidden.' });
      return;
    }

    const cmd = `${fastbootPath} ${safeArgs.join(' ')}`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        resolve({ success: false, error: stderr || err.message });
      } else {
        resolve({ success: true, output: stdout || stderr }); // fastboot often outputs logging to stderr
      }
    });
  });
});

// 4. File Dialog Selectors for APK & File managers
ipcMain.handle('dialog:open-file', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

// 5. System File Exporter (Diagnostic reports, logs backups)
ipcMain.handle('fs:save-file', async (event, { defaultName, content }) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Document',
    defaultPath: path.join(app.getPath('downloads'), defaultName),
    filters: [{ name: 'Text Documents', extensions: ['txt', 'html', 'json'] }]
  });

  if (filePath) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, path: filePath };
  }
  return { success: false };
});
