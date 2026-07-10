import React, { useState } from 'react';
import { Device } from '../types';
import { Database, ShieldCheck, XCircle, Play, History, FolderArchive, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BackupRestoreTabProps {
  device: Device | null;
  onLogConsole: (source: string, msg: string, level?: 'INFO' | 'WARNING' | 'ERROR') => void;
}

export const BackupRestoreTab: React.FC<BackupRestoreTabProps> = ({ device, onLogConsole }) => {
  // Option Flags
  const [apps, setApps] = useState<boolean>(true);
  const [media, setMedia] = useState<boolean>(true);
  const [settings, setSettings] = useState<boolean>(false);
  const [sms, setSms] = useState<boolean>(false);

  // Backup file inputs
  const [backupPath, setBackupPath] = useState<string>('C:\\UMN_DeviceManager\\Backups\\Pixel_8_Pro_Backup.ab');
  const [restorePath, setRestorePath] = useState<string>('Pixel_8_Pro_Backup.ab');

  // Operation state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [opMode, setOpMode] = useState<'backup' | 'restore' | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentAsset, setCurrentAsset] = useState<string>('');
  const [transferSpeed, setTransferSpeed] = useState<string>('0.0 MB/s');
  
  // Simulated Backups History List
  const [backupsHistory, setBackupsHistory] = useState([
    { filename: 'Pixel_8_Pro_Backup.ab', date: '2026-07-08 14:22', size: '1.2 GB', status: 'Success' },
    { filename: 'S24_Ultra_Full.ab', date: '2026-07-05 09:12', size: '2.8 GB', status: 'Success' },
  ]);

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center">
        <Database size={48} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">Backup Engine Idle</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Plug in an authorized device via USB to create system configurations backups or restore images.</p>
      </div>
    );
  }

  if (device.connectionMode === 'fastboot') {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center">
        <Database size={48} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">Backup Engine Unavailable</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Full system backups require ADB debugging privileges. Fastboot mode is restricted to partition image transfers.</p>
      </div>
    );
  }

  const handleStartBackup = () => {
    if (isRunning) return;
    setIsRunning(true);
    setOpMode('backup');
    setProgress(0);
    setTransferSpeed('5.4 MB/s');
    onLogConsole('AdbService', `Initializing device backup sequence: adb backup -f "${backupPath}" -all -apk -shared`);

    const assetsToBackup: string[] = [];
    if (apps) assetsToBackup.push('Application APKs', 'App Storage Catalogs');
    if (media) assetsToBackup.push('Shared Media (Music, DCIM)', 'Downloads Folder');
    if (settings) assetsToBackup.push('System Settings & Preferences');
    if (sms) assetsToBackup.push('SMS Messages database', 'Call logs logs');

    if (assetsToBackup.length === 0) {
      onLogConsole('AdbService', `Backup aborted: No data clusters selected.`, 'ERROR');
      setIsRunning(false);
      setOpMode(null);
      return;
    }

    let assetIdx = 0;
    setCurrentAsset(`Preparing local disk: ${backupPath}...`);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        
        // Cycle current asset based on progress
        if (next === 20) {
          setCurrentAsset(`Reading partition sectors for: ${assetsToBackup[0] || 'Metadata'}`);
          setTransferSpeed('8.2 MB/s');
        } else if (next === 50) {
          setCurrentAsset(`Processing payload: ${assetsToBackup[1] || 'Internal data'}`);
          setTransferSpeed('12.5 MB/s');
        } else if (next === 80) {
          setCurrentAsset(`Finalizing binary stream and writing filesystem indexes...`);
          setTransferSpeed('4.1 MB/s');
        }

        if (next >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setOpMode(null);
          
          // Add to backup history
          const parts = backupPath.split('\\');
          const name = parts[parts.length - 1];
          setBackupsHistory((prevList) => [
            { filename: name, date: new Date().toISOString().replace('T', ' ').slice(0, 19), size: '420 MB', status: 'Success' },
            ...prevList
          ]);

          onLogConsole('AdbService', `Backup written to disk cleanly. Output: Success.`);
          return 100;
        }
        return next;
      });
    }, 250);
  };

  const handleStartRestore = () => {
    if (isRunning) return;
    setIsRunning(true);
    setOpMode('restore');
    setProgress(0);
    setTransferSpeed('14.2 MB/s');
    onLogConsole('AdbService', `Initializing restore engine: adb restore "./backups/${restorePath}"`);
    setCurrentAsset(`Loading file manifest: ${restorePath}...`);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next === 30) {
          setCurrentAsset('Pushing packages and installing sideloaded APK binaries...');
          setTransferSpeed('18.4 MB/s');
        } else if (next === 60) {
          setCurrentAsset('Restoring shared folders, photos, and databases...');
          setTransferSpeed('22.1 MB/s');
        } else if (next === 90) {
          setCurrentAsset('Updating device configuration databases and rebooting application layers...');
        }

        if (next >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setOpMode(null);
          onLogConsole('AdbService', `Restoration sequence finished. Device reports 100% written.`);
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const handleCancelOperation = () => {
    setIsRunning(false);
    setOpMode(null);
    onLogConsole('AdbService', 'Sequence execution aborted by supervisor CancellationToken signal.', 'WARNING');
  };

  return (
    <div id="backup-restore-container" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Backup and Restore Core Control Panels */}
      <div id="controls-panel-flex" className="space-y-6">
        {/* Backup Wizard Card */}
        <div id="backup-panel" className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Database className="text-blue-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-300">Device Backup Wizard</h3>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">1. Select Data Clusters to Backup</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2.5 p-2 bg-slate-950/40 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 select-none">
                <input type="checkbox" checked={apps} onChange={(e) => setApps(e.target.checked)} className="accent-blue-500" />
                <span className="text-slate-300">Application APKs</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-950/40 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 select-none">
                <input type="checkbox" checked={media} onChange={(e) => setMedia(e.target.checked)} className="accent-blue-500" />
                <span className="text-slate-300">Shared Media Content</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-950/40 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 select-none">
                <input type="checkbox" checked={settings} onChange={(e) => setSettings(e.target.checked)} className="accent-blue-500" />
                <span className="text-slate-300">System Preferences</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-950/40 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 select-none">
                <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="accent-blue-500" />
                <span className="text-slate-300">SMS &amp; Contacts (Secure)</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">2. Output File Path on Desktop</label>
            <input
              id="backup-path-field"
              type="text"
              value={backupPath}
              onChange={(e) => setBackupPath(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>

          <button
            id="start-backup-btn"
            onClick={handleStartBackup}
            disabled={isRunning}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/10"
          >
            <Play size={14} />
            Launch Secure Backup Pipeline
          </button>
        </div>

        {/* Restore Wizard Card */}
        <div id="restore-panel" className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <History className="text-blue-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-300">Device Restore Wizard</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">Select Source Archive (.ab)</label>
            <select
              id="restore-file-select"
              value={restorePath}
              onChange={(e) => setRestorePath(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            >
              {backupsHistory.map((h) => (
                <option key={h.filename} value={h.filename}>
                  {h.filename} ({h.size} - {h.date})
                </option>
              ))}
            </select>
          </div>

          <button
            id="start-restore-btn"
            onClick={handleStartRestore}
            disabled={isRunning}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <FolderArchive size={14} className="text-blue-500" />
            Launch Device Restore Sequence
          </button>
        </div>
      </div>

      {/* Progress Monitor Pane or History Log (Right Col) */}
      <div id="monitor-or-history" className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 flex flex-col h-[460px]">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.div
              key="active-progress-frame"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin text-blue-500" size={16} />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {opMode === 'backup' ? 'ADB Backup Streaming Active' : 'ADB Restore Writing Active'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/5">
                    {transferSpeed}
                  </span>
                </div>

                {/* Info and Progress display */}
                <div className="space-y-3 bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Streaming Asset Node</span>
                    <span className="text-xs text-blue-400 font-mono font-medium truncate block">{currentAsset}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Operational Progress</span>
                    <div className="flex items-center justify-between text-lg font-bold text-slate-200 font-mono">
                      <span>{progress}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-950 h-4 rounded-full p-0.5 border border-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>

              {/* Cancel Button */}
              <button
                id="cancel-backup-btn"
                onClick={handleCancelOperation}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer mt-4"
              >
                <XCircle size={14} />
                Cancel Process Signal
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="backups-history-frame"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5 mb-4">
                  <History className="text-slate-500" size={16} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Archives Vault History</h4>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[280px]">
                  {backupsHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-slate-800/60 bg-slate-950/20 rounded-xl hover:border-slate-800 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <FolderArchive size={18} className="text-blue-500 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-semibold text-slate-200 font-mono">{h.filename}</h5>
                          <span className="text-[10px] text-slate-500 font-mono block mt-1">{h.date}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono text-slate-400 block">{h.size}</span>
                        <span className="text-[9px] font-semibold text-emerald-400 mt-1 inline-flex items-center gap-1">
                          <ShieldCheck size={10} />
                          {h.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 text-center">
                <span className="text-[10px] text-slate-500 font-medium">Backup operations automatically stream via Serilog file sinks.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
