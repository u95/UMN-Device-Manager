import React, { useState } from 'react';
import { Device, FileEntry } from '../types';
import { Folder, File, ArrowLeft, Plus, Upload, Download, Trash2, Edit2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface FileManagerTabProps {
  device: Device | null;
  onLogConsole: (source: string, msg: string, level?: 'INFO' | 'WARNING' | 'ERROR') => void;
}

const initialFiles: { [path: string]: FileEntry[] } = {
  '/sdcard': [
    { name: 'Android', path: '/sdcard/Android', type: 'directory', size: '<DIR>', date: '07-01 12:30', permissions: 'drwxrwx--x' },
    { name: 'DCIM', path: '/sdcard/DCIM', type: 'directory', size: '<DIR>', date: '07-02 14:15', permissions: 'drwxrwx---' },
    { name: 'Download', path: '/sdcard/Download', type: 'directory', size: '<DIR>', date: '07-09 08:00', permissions: 'drwxrwx---' },
    { name: 'Music', path: '/sdcard/Music', type: 'directory', size: '<DIR>', date: '06-20 09:45', permissions: 'drwxrwx---' },
    { name: 'Pictures', path: '/sdcard/Pictures', type: 'directory', size: '<DIR>', date: '07-05 18:30', permissions: 'drwxrwx---' },
    { name: 'device_logs.txt', path: '/sdcard/device_logs.txt', type: 'file', size: '4.2 KB', date: '07-09 08:12', permissions: '-rw-rw----' },
    { name: 'backup_manifest.json', path: '/sdcard/backup_manifest.json', type: 'file', size: '280 B', date: '07-08 11:22', permissions: '-rw-rw----' },
  ],
  '/sdcard/Android': [
    { name: 'data', path: '/sdcard/Android/data', type: 'directory', size: '<DIR>', date: '07-01 12:30', permissions: 'drwxrwx--x' },
    { name: 'media', path: '/sdcard/Android/media', type: 'directory', size: '<DIR>', date: '07-01 12:30', permissions: 'drwxrwx--x' },
    { name: 'obb', path: '/sdcard/Android/obb', type: 'directory', size: '<DIR>', date: '07-01 12:30', permissions: 'drwxrwx--x' },
  ],
  '/sdcard/Android/data': [
    { name: 'com.google.android.youtube', path: '/sdcard/Android/data/com.google.android.youtube', type: 'directory', size: '<DIR>', date: '07-01 12:35', permissions: 'drwxrwx---' },
    { name: 'com.android.chrome', path: '/sdcard/Android/data/com.android.chrome', type: 'directory', size: '<DIR>', date: '07-01 12:40', permissions: 'drwxrwx---' },
  ],
  '/sdcard/DCIM': [
    { name: 'Camera', path: '/sdcard/DCIM/Camera', type: 'directory', size: '<DIR>', date: '07-02 14:15', permissions: 'drwxrwx---' },
    { name: 'Screenshots', path: '/sdcard/DCIM/Screenshots', type: 'directory', size: '<DIR>', date: '07-05 10:20', permissions: 'drwxrwx---' },
  ],
  '/sdcard/DCIM/Camera': [
    { name: 'IMG_20260702_141122.jpg', path: '/sdcard/DCIM/Camera/IMG_20260702_141122.jpg', type: 'file', size: '3.4 MB', date: '07-02 14:11', permissions: '-rw-rw----' },
    { name: 'IMG_20260702_141205.jpg', path: '/sdcard/DCIM/Camera/IMG_20260702_141205.jpg', type: 'file', size: '2.8 MB', date: '07-02 14:12', permissions: '-rw-rw----' },
  ],
  '/sdcard/Download': [
    { name: 'chrome-installer.apk', path: '/sdcard/Download/chrome-installer.apk', type: 'file', size: '92.4 MB', date: '07-09 08:00', permissions: '-rwxrwx---' },
    { name: 'UMN_Release_v1.0.apk', path: '/sdcard/Download/UMN_Release_v1.0.apk', type: 'file', size: '15.1 MB', date: '07-08 22:15', permissions: '-rwxrwx---' },
    { name: 'Instruction_Manual.pdf', path: '/sdcard/Download/Instruction_Manual.pdf', type: 'file', size: '1.2 MB', date: '07-05 16:30', permissions: '-rw-rw----' },
  ],
};

export const FileManagerTab: React.FC<FileManagerTabProps> = ({ device, onLogConsole }) => {
  const [currentPath, setCurrentPath] = useState<string>('/sdcard');
  const [files, setFiles] = useState<{ [path: string]: FileEntry[] }>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Modals / Input states
  const [isNewFolderOpen, setIsNewFolderOpen] = useState<boolean>(false);
  const [isRenameOpen, setIsRenameOpen] = useState<boolean>(false);
  const [folderNameInput, setFolderNameInput] = useState<string>('');
  const [renameInput, setRenameInput] = useState<string>('');

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center">
        <Folder size={48} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">File System Inactive</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Connect an authorized ADB device to inspect block partitions, folders, and shared internal storage.</p>
      </div>
    );
  }

  if (device.connectionMode === 'fastboot') {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center">
        <Folder size={48} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">File Explorer Locked</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">ADB operations are unavailable in Fastboot/Bootloader Mode. File interaction requires an active Android system state.</p>
      </div>
    );
  }

  const currentList = files[currentPath] || [];

  const handleDirectoryClick = (entry: FileEntry) => {
    setLoading(true);
    setSelectedFile(null);
    onLogConsole('AdbService', `Executing directory sweep on device: adb shell ls -la "${entry.path}"`);
    setTimeout(() => {
      setCurrentPath(entry.path);
      setLoading(false);
    }, 300);
  };

  const handleGoBack = () => {
    if (currentPath === '/sdcard') return;
    setLoading(true);
    setSelectedFile(null);
    const parts = currentPath.split('/');
    parts.pop();
    const parentPath = parts.join('/') || '/sdcard';
    onLogConsole('AdbService', `Reading parent cluster listing: adb shell ls -la "${parentPath}"`);
    setTimeout(() => {
      setCurrentPath(parentPath);
      setLoading(false);
    }, 250);
  };

  const handleCreateFolder = () => {
    if (!folderNameInput.trim()) return;
    const newPath = `${currentPath}/${folderNameInput.trim()}`;
    const newEntry: FileEntry = {
      name: folderNameInput.trim(),
      path: newPath,
      type: 'directory',
      size: '<DIR>',
      date: '07-09 08:22',
      permissions: 'drwxrwx---',
    };

    // Update state
    const currentFolderFiles = files[currentPath] || [];
    setFiles({
      ...files,
      [currentPath]: [...currentFolderFiles, newEntry],
      [newPath]: [], // Initialize directory list empty
    });

    onLogConsole('AdbService', `Dispatched filesystem command: adb shell mkdir -p "${newPath}"`);
    setFolderNameInput('');
    setIsNewFolderOpen(false);
  };

  const handlePushFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setLoading(true);
    onLogConsole('AdbService', `Starting binary stream upload: adb push "${file.name}" "${currentPath}/${file.name}"`);

    setTimeout(() => {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;

      const newEntry: FileEntry = {
        name: file.name,
        path: `${currentPath}/${file.name}`,
        type: 'file',
        size: sizeStr,
        date: '07-09 08:22',
        permissions: '-rw-rw----',
      };

      const currentFolderFiles = files[currentPath] || [];
      setFiles({
        ...files,
        [currentPath]: [...currentFolderFiles, newEntry],
      });

      setLoading(false);
      onLogConsole('AdbService', `Stream finalized. 100% transferred. Pushed ${file.name} to ${currentPath}`);
    }, 1200);
  };

  const handleDeleteFile = () => {
    if (!selectedFile) return;
    const pathToDelete = selectedFile.path;
    onLogConsole('AdbService', `Sending delete command: adb shell rm -rf "${pathToDelete}"`, 'WARNING');

    const currentFolderFiles = files[currentPath] || [];
    const updatedFiles = currentFolderFiles.filter((f) => f.path !== pathToDelete);

    // Deep clone and clean up sub-directories as well
    const filesClone = { ...files };
    delete filesClone[pathToDelete];
    filesClone[currentPath] = updatedFiles;

    setFiles(filesClone);
    setSelectedFile(null);
  };

  const handleRenameFile = () => {
    if (!selectedFile || !renameInput.trim()) return;
    const oldPath = selectedFile.path;
    const parentPath = currentPath;
    const newPath = `${parentPath}/${renameInput.trim()}`;

    onLogConsole('AdbService', `Dispatched rename instruction: adb shell mv "${oldPath}" "${newPath}"`);

    const currentFolderFiles = files[currentPath] || [];
    const updatedFiles = currentFolderFiles.map((f) => {
      if (f.path === oldPath) {
        return {
          ...f,
          name: renameInput.trim(),
          path: newPath,
        };
      }
      return f;
    });

    const filesClone = { ...files };
    // If it was a folder, move its nested registry entry too
    if (selectedFile.type === 'directory' && filesClone[oldPath]) {
      filesClone[newPath] = filesClone[oldPath].map(f => ({
        ...f,
        path: f.path.replace(oldPath, newPath)
      }));
      delete filesClone[oldPath];
    }
    filesClone[currentPath] = updatedFiles;

    setFiles(filesClone);
    setSelectedFile(null);
    setRenameInput('');
    setIsRenameOpen(false);
  };

  const handlePullFile = () => {
    if (!selectedFile) return;
    onLogConsole('AdbService', `Starting binary fetch pipeline: adb pull "${selectedFile.path}" "./downloads/${selectedFile.name}"`);
    
    // Simulate web download
    const element = document.createElement('a');
    const fileContent = `Simulated device file content for ${selectedFile.name}. Path: ${selectedFile.path}`;
    const file = new Blob([fileContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    onLogConsole('AdbService', `Transfer pipeline closed. Pulled ${selectedFile.name} successfully.`);
  };

  return (
    <div id="file-manager-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* File Explorer Listing (Left Col - spanning 3) */}
      <div id="file-list-pane" className="lg:col-span-3 border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <button
              id="back-dir-btn"
              onClick={handleGoBack}
              disabled={currentPath === '/sdcard'}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">Device Directory Path</span>
              <h3 className="text-sm font-mono text-blue-400 font-medium">{currentPath}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="mkdir-modal-btn"
              onClick={() => setIsNewFolderOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus size={14} />
              New Folder
            </button>
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-md shadow-blue-500/10">
              <Upload size={14} />
              Push File
              <input type="file" onChange={handlePushFile} className="hidden" />
            </label>
          </div>
        </div>

        {/* Directory Listing Table */}
        <div id="file-table-viewport" className="overflow-x-auto min-h-[360px] relative">
          {loading ? (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : null}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Modified</th>
                <th className="py-2.5 px-3">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-xs text-slate-500 font-mono">
                    Empty folder. Push a file or create a directory.
                  </td>
                </tr>
              ) : (
                currentList.map((file) => {
                  const isSel = selectedFile?.path === file.path;
                  return (
                    <tr
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      onDoubleClick={() => file.type === 'directory' && handleDirectoryClick(file)}
                      className={`border-b border-slate-800/40 text-xs transition-colors cursor-pointer hover:bg-slate-800/30 ${
                        isSel ? 'bg-blue-600/10 hover:bg-blue-600/15 border-blue-500/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-medium text-slate-200 flex items-center gap-2.5">
                        {file.type === 'directory' ? (
                          <Folder size={16} className="text-blue-400" />
                        ) : (
                          <File size={16} className="text-slate-400" />
                        )}
                        <span className="truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">{file.size}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{file.date}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{file.permissions}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Action Sidebar (Right Panel) */}
      <div id="file-meta-sidebar" className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 flex flex-col justify-between h-[480px]">
        <div>
          <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2.5 mb-4">Resource Inspector</h4>
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center p-4 bg-slate-950/40 rounded-lg border border-slate-800/80 text-center">
                {selectedFile.type === 'directory' ? (
                  <Folder size={40} className="text-blue-400 mb-2" />
                ) : (
                  <File size={40} className="text-slate-400 mb-2" />
                )}
                <span className="text-xs font-semibold text-slate-200 break-all">{selectedFile.name}</span>
                <span className="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-wider">{selectedFile.type}</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Device Path:</span>
                  <span className="text-slate-300 font-mono text-[10px] break-all">{selectedFile.path}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Size:</span>
                  <span className="text-slate-300 font-mono">{selectedFile.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Modified:</span>
                  <span className="text-slate-300 font-mono">{selectedFile.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Permissions:</span>
                  <span className="text-slate-300 font-mono">{selectedFile.permissions}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500">
              Select a file or folder from the listing pane to run actions.
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="space-y-2 border-t border-slate-800 pt-4">
            {selectedFile.type === 'file' && (
              <button
                id="pull-file-btn"
                onClick={handlePullFile}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <Download size={14} />
                Pull (Download)
              </button>
            )}
            <button
              id="rename-modal-btn"
              onClick={() => {
                setRenameInput(selectedFile.name);
                setIsRenameOpen(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Edit2 size={13} />
              Rename
            </button>
            <button
              id="delete-confirm-btn"
              onClick={handleDeleteFile}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              Delete Resource
            </button>
          </div>
        )}
      </div>

      {/* New Folder Modal Prompt */}
      {isNewFolderOpen && (
        <div id="new-folder-modal" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Create Remote Directory</h3>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Folder Name</label>
              <input
                id="folder-name-input"
                type="text"
                value={folderNameInput}
                onChange={(e) => setFolderNameInput(e.target.value)}
                placeholder="e.g. Pictures"
                className="w-full bg-slate-950 text-slate-100 text-sm p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 text-xs pt-2">
              <button
                id="close-mkdir-btn"
                onClick={() => setIsNewFolderOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-mkdir-btn"
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors cursor-pointer shadow-md shadow-blue-500/10"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal Prompt */}
      {isRenameOpen && (
        <div id="rename-modal" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Rename Remote Resource</h3>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">New Filename / Name</label>
              <input
                id="rename-input-field"
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 text-sm p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 text-xs pt-2">
              <button
                id="close-rename-btn"
                onClick={() => setIsRenameOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-rename-btn"
                onClick={handleRenameFile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors cursor-pointer shadow-md shadow-blue-500/10"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
