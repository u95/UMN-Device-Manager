import React, { useState } from 'react';
import { Device } from '../types';
import { Zap, AlertOctagon, HelpCircle, HardDrive, CheckCircle, Flame, ShieldAlert, RotateCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FastbootToolsTabProps {
  device: Device | null;
  onLogConsole: (source: string, msg: string, level?: 'INFO' | 'WARNING' | 'ERROR') => void;
  onReboot: (mode: string) => void;
}

export const FastbootToolsTab: React.FC<FastbootToolsTabProps> = ({ device, onLogConsole, onReboot }) => {
  const [selectedPartition, setSelectedPartition] = useState<string>('boot');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileNameSim, setImageFileNameSim] = useState<string>('boot.img');
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const [flashing, setFlashing] = useState<boolean>(false);
  const [flashStatusText, setFlashStatusText] = useState<string>('');

  // Fastboot Variables State
  const [fastbootVars, setFastbootVars] = useState<{ [key: string]: string } | null>(null);
  const [loadingVars, setLoadingVars] = useState<boolean>(false);

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center">
        <Zap size={48} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">Fastboot Console Offline</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Connect a device in Fastboot/Bootloader mode to run low-level flashing and diagnostic sweeps.</p>
      </div>
    );
  }

  // Fastboot is active only when device connectionMode is 'fastboot'
  const isFastbootMode = device.connectionMode === 'fastboot';

  const handleQueryVars = () => {
    setLoadingVars(true);
    onLogConsole('FastbootService', `Querying board specs: fastboot getvar all`);
    
    setTimeout(() => {
      setFastbootVars({
        'version-bootloader': 'slider-16.0-1049282',
        'version-baseband': 'g5300g-240112-R',
        'secure-boot': 'yes (authorized)',
        'unlocked': 'no (OEM LOCKED)',
        'product': 'husky',
        'serialno': device.serial,
        'current-slot': 'a',
        'slot-count': '2',
        'has-slot:boot': 'yes',
        'max-download-size': '268435456 bytes',
      });
      setLoadingVars(false);
      onLogConsole('FastbootService', `getvar all completed. 10 board variables retrieved.`);
    }, 800);
  };

  const triggerSelectFileSim = (partition: string) => {
    setImageFileNameSim(`${partition}.img`);
    onLogConsole('FastbootService', `Staged flashing descriptor file: ${partition}.img`);
  };

  const handleErasePartition = (partition: string) => {
    if (!isFastbootMode) {
      onLogConsole('FastbootService', `Erase cancelled. Device is in ADB mode. Boot to Bootloader first.`, 'ERROR');
      return;
    }
    const yes = window.confirm(`Are you absolutely sure you want to completely ERASE the "${partition}" partition? This operation is irreversible.`);
    if (!yes) return;

    onLogConsole('FastbootService', `Erasing partition sectors: fastboot erase ${partition}`, 'WARNING');
    setTimeout(() => {
      onLogConsole('FastbootService', `Partition "${partition}" wiped successfully. Sector size: OKAY.`);
    }, 600);
  };

  const handleStartFlashing = () => {
    if (!isFastbootMode) {
      onLogConsole('FastbootService', `Flashing halted. Target is not in Fastboot mode.`, 'ERROR');
      setIsConfirmOpen(false);
      return;
    }
    
    setIsConfirmOpen(false);
    setFlashing(true);
    setFlashProgress(10);
    setFlashStatusText(`Opening channel and loading image binary: ${imageFileNameSim}...`);
    onLogConsole('FastbootService', `Dispatched flashing pipeline: fastboot flash ${selectedPartition} "${imageFileNameSim}"`, 'WARNING');

    setTimeout(() => {
      setFlashProgress(35);
      setFlashStatusText(`Sending raw binary blocks (Size: 42.4 MB)...`);
    }, 800);

    setTimeout(() => {
      setFlashProgress(70);
      setFlashStatusText(`Writing sector structures on block: ${selectedPartition}_a...`);
    }, 1600);

    setTimeout(() => {
      setFlashProgress(100);
      setFlashStatusText('Flashing successfully verified! OKAY [ 100% written ]');
      setFlashing(false);
      onLogConsole('FastbootService', `Flashing partition ${selectedPartition} complete. Exit code: 0.`);
    }, 2500);
  };

  return (
    <div id="fastboot-tools-tab-container" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Partition Flasher Controls (Left Column) */}
      <div id="flasher-controls" className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Flame className="text-amber-500" size={18} />
          <h3 className="text-sm font-semibold text-slate-300 font-sans">Authorized Firmware Flashing</h3>
        </div>

        {!isFastbootMode ? (
          <div className="p-4 bg-amber-950/15 border border-amber-900/30 text-amber-300/90 rounded-xl text-xs space-y-2 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <AlertOctagon size={14} />
              Fastboot Flasher Disabled (Device in ADB Mode)
            </div>
            <p>
              Your active device is currently running in standard ADB mode. Low-level partition flashing can only be dispatched when the device is rebooted into the Fastboot Bootloader stage.
            </p>
            <button
              id="reboot-bootloader-fastboot-tab"
              onClick={() => onReboot('bootloader')}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/20 text-amber-300 rounded font-medium transition-colors cursor-pointer"
            >
              <RotateCw size={12} />
              Reboot to Bootloader
            </button>
          </div>
        ) : (
          <div className="p-4 bg-emerald-950/15 border border-emerald-900/30 text-emerald-400 rounded-xl text-xs flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold block">Fastboot Controller Active</span>
              <span className="block mt-0.5 text-[11px] text-emerald-500/80 leading-snug">The device is unlocked and acknowledging partition flashing packets over USB. Run low-level partition writes securely.</span>
            </div>
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Partition Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">Target Block Partition</label>
            <select
              id="partition-select"
              value={selectedPartition}
              onChange={(e) => {
                setSelectedPartition(e.target.value);
                triggerSelectFileSim(e.target.value);
              }}
              className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            >
              <option value="boot">boot (System Bootloader Kernel)</option>
              <option value="recovery">recovery (Custom Recovery Environment)</option>
              <option value="system">system (System Core ROM OS Images)</option>
              <option value="vendor">vendor (OEM Drivers &amp; Filesystem)</option>
              <option value="userdata">userdata (User App Blocks Wipe)</option>
            </select>
          </div>

          {/* Staged Image */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">Firmware Image File (.img)</label>
            <div className="flex items-center gap-2">
              <input
                id="firmware-image-path-field"
                type="text"
                readOnly
                value={imageFileNameSim}
                className="flex-1 bg-slate-950 text-slate-300 text-xs p-2.5 rounded-lg border border-slate-800 focus:outline-none font-mono"
              />
              <button
                id="browse-img-sim"
                onClick={() => triggerSelectFileSim(selectedPartition)}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Browse img
              </button>
            </div>
          </div>

          {/* Write Flash Button */}
          <div className="pt-2 flex gap-3">
            <button
              id="flash-confirm-modal-trigger"
              onClick={() => setIsConfirmOpen(true)}
              disabled={flashing}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <Flame size={14} />
              Flash Firmware Image
            </button>
            <button
              id="erase-partition-btn"
              onClick={() => handleErasePartition(selectedPartition)}
              disabled={flashing}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              title="Wipe Partition Sectors"
            >
              Erase Partition
            </button>
          </div>
        </div>

        {/* Flashing Progress Bar */}
        {flashing && (
          <div className="space-y-2 bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Writing sectors to {selectedPartition}...</span>
              <span>{flashProgress}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${flashProgress}%` }} />
            </div>
            <span className="text-[9px] font-mono text-slate-500 leading-tight block">{flashStatusText}</span>
          </div>
        )}
      </div>

      {/* Board Variables & Status Grid (Right Column) */}
      <div id="board-variables" className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 flex flex-col justify-between h-[450px]">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-4">
            <div className="flex items-center gap-2">
              <HardDrive className="text-slate-500" size={16} />
              <h3 className="text-sm font-semibold text-slate-300">Target Board Diagnostics</h3>
            </div>
            <button
              id="query-vars-btn"
              onClick={handleQueryVars}
              disabled={loadingVars || !isFastbootMode}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-45 text-slate-300 border border-slate-700 rounded text-[11px] font-semibold cursor-pointer"
            >
              {loadingVars ? (
                <>
                  <Loader2 size={10} className="animate-spin" />
                  Reading...
                </>
              ) : 'getvar all'}
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[290px] pr-1 scrollbar-thin">
            {fastbootVars ? (
              Object.entries(fastbootVars).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center p-2 border border-slate-800/40 bg-slate-950/20 rounded-lg">
                  <span className="text-[10px] font-mono text-slate-500 break-all leading-none">{k}</span>
                  <span className="text-xs font-mono text-slate-300 font-medium break-all text-right pl-4">{v}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-xs text-slate-500 font-sans leading-relaxed">
                <HelpCircle size={32} className="mx-auto text-slate-750 mb-2" />
                No diagnostics loaded. Click the "getvar all" query tool to fetch low-level hardware structures.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 text-center">
          <span className="text-[10px] text-slate-500 font-medium font-sans">Fastboot tools match UMN Device Manager Service definitions.</span>
        </div>
      </div>

      {/* Flashing Warnings Confirmation Dialog */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div id="flash-confirmation-modal" className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-rose-900/30 rounded-xl p-6 w-full max-w-md space-y-4"
            >
              <div className="flex items-center gap-2.5 text-rose-500 bg-rose-500/5 p-3 border border-rose-500/20 rounded-lg">
                <ShieldAlert size={22} className="flex-shrink-0" />
                <h4 className="font-bold text-sm text-rose-400">CRITICAL SAFETY ALERT</h4>
              </div>

              <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed font-sans">
                <p>
                  You are about to execute a direct raw write onto partition: <strong className="text-amber-400 font-mono">[{selectedPartition}]</strong> using image: <strong className="text-slate-100 font-mono">[{imageFileNameSim}]</strong>.
                </p>
                <p className="p-2.5 bg-slate-950 rounded border border-slate-800/80 font-semibold text-slate-400 text-[11px]">
                  Flashing incompatible partitions, non-signed custom kernels, or corrupt headers can cause severe system failure (soft-brick/hard-brick). Ensure the image is fully validated for model serial: <span className="font-mono text-blue-400">{device.serial}</span>.
                </p>
                <p>
                  By clicking flash, you acknowledge that you have authorized credentials and permissions to execute low-level firmware flashing on this Android board.
                </p>
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button
                  id="cancel-flash-modal"
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel Operation
                </button>
                <button
                  id="execute-flash-btn"
                  onClick={handleStartFlashing}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  Confirm &amp; Flash Partition
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
