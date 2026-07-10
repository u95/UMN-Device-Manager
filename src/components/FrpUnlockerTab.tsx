import React, { useState } from 'react';
import { Device } from '../types';
import { 
  Lock, 
  Unlock, 
  Cpu, 
  HelpCircle, 
  AlertTriangle, 
  Play, 
  CheckCircle, 
  Loader2, 
  ShieldAlert, 
  Terminal, 
  Activity, 
  Layers, 
  RefreshCw,
  Flame,
  Languages
} from 'lucide-react';
import { motion } from 'motion/react';

interface FrpUnlockerTabProps {
  device: Device | null;
  onLogConsole: (source: string, msg: string, level?: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG') => void;
}

export const FrpUnlockerTab: React.FC<FrpUnlockerTabProps> = ({ device, onLogConsole }) => {
  const [lang, setLang] = useState<'TA' | 'EN'>('TA'); // Tamil by default per user request
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [unlockProgress, setUnlockProgress] = useState<number>(0);
  const [unlockStatusText, setUnlockStatusText] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('auto');
  const [brandPreset, setBrandPreset] = useState<string>('detect');
  const [frpLockState, setFrpLockState] = useState<'locked' | 'unlocked'>('locked');

  // Logs specifically generated for the FRP visual console
  const [frpLogs, setFrpLogs] = useState<string[]>([]);

  const addFrpLog = (msg: string) => {
    setFrpLogs(prev => [...prev, `[${new Date().toTimeString().slice(0, 8)}] ${msg}`]);
  };

  const handleClearLogs = () => {
    setFrpLogs([]);
  };

  const handleStartFrpUnlock = () => {
    if (!device) {
      onLogConsole('FrpService', 'FRP Unlock failed. No target device detected over USB.', 'ERROR');
      addFrpLog('Error: No target device connected.');
      return;
    }

    if (device.status === 'unauthorized') {
      onLogConsole('FrpService', `Device ${device.model} is unauthorized. Allow USB Debugging first.`, 'ERROR');
      addFrpLog(`Error: Please authorize USB Debugging prompt on your ${device.model}.`);
      return;
    }

    setIsUnlocking(true);
    setUnlockProgress(5);
    setFrpLockState('locked');
    setFrpLogs([]);

    const detectedBrand = brandPreset === 'detect' ? device.manufacturer : brandPreset;
    const socFamily = detectedBrand === 'Samsung' ? 'Exynos/Snapdragon' : detectedBrand === 'Xiaomi' ? 'MediaTek MT67xx' : 'Google Tensor Core';

    onLogConsole('FrpService', `Initiating FRP Bypass Pipeline for ${detectedBrand} ${device.model} [SoC: ${socFamily}]`, 'WARNING');
    addFrpLog(`--- STARTING FRP BYPASS & ACCESSIBILITY REMOVAL PIPELINE ---`);
    addFrpLog(`[1] Detected Target Device: ${detectedBrand} ${device.model}`);
    addFrpLog(`[2] Device Serial ID: ${device.serial}`);
    addFrpLog(`[3] Handshake Connection: Mode [${device.connectionMode.toUpperCase()}] status [${device.status.toUpperCase()}]`);

    // Progress Simulation Sequence
    setTimeout(() => {
      setUnlockProgress(20);
      setUnlockStatusText(lang === 'TA' ? 'சாதன பாதுகாப்பை ஸ்கேன் செய்கிறது...' : 'Scanning device security Knox / SELinux policies...');
      addFrpLog(`Checking security patch status: Android ${device.androidVersion}`);
      addFrpLog(`Detected Bootloader State: Locked (OEM Protected)`);
      if (detectedBrand === 'Samsung') {
        addFrpLog(`Samsung Knox Security version: Knox v3.10 active`);
        addFrpLog(`Triggering testmode diagnostics protocol: *#0*# menu emulation`);
      } else {
        addFrpLog(`Generic Android Factory Reset Protection (FRP) partition offset found at: 0x008A2000`);
      }
    }, 1000);

    setTimeout(() => {
      setUnlockProgress(45);
      setUnlockStatusText(lang === 'TA' ? 'பாதுகாப்பு சான்றிதழ்களை முடக்குகிறது...' : 'Bypassing setupwizard and disabling persistent lock partition...');
      addFrpLog(`Sending payload: adb shell content insert --uri content://settings/secure --bind name:s:user_setup_complete --bind value:s:1`);
      addFrpLog(`Attempting to wipe persist partition sectors directly via boot sector`);
      onLogConsole('FrpService', 'Sending bypass exploit vector packets over ADB/Fastboot channel', 'INFO');
    }, 2500);

    setTimeout(() => {
      setUnlockProgress(70);
      setUnlockStatusText(lang === 'TA' ? 'தற்காலிக கோப்புகளை நீக்குகிறது...' : 'Wiping persistent hardware storage token keys...');
      addFrpLog(`Writing zeros to storage sector: /dev/block/bootdevice/by-name/frp`);
      addFrpLog(`Exploit status: OKAY. Partition bytes cleared.`);
      addFrpLog(`Simulating final reboot and setupwizard bypass injection...`);
    }, 4000);

    setTimeout(() => {
      setUnlockProgress(90);
      setUnlockStatusText(lang === 'TA' ? 'சரிபார்க்கிறது...' : 'Verifying Google Account lock status...');
      addFrpLog(`Testing connection to Google auth services: Google Lock inactive!`);
      addFrpLog(`System status check: Setup complete is set to TRUE.`);
    }, 5200);

    setTimeout(() => {
      setUnlockProgress(100);
      setIsUnlocking(false);
      setFrpLockState('unlocked');
      setUnlockStatusText(lang === 'TA' ? 'வெற்றிகரமாக FRP லாக் நீக்கப்பட்டது!' : 'FRP Lock successfully removed! Device unlocked.');
      addFrpLog(`--- FRP REMOVAL COMPLETED ---`);
      addFrpLog(`SUCCESS: Google account lock has been completely bypassed.`);
      addFrpLog(`Device is ready. You can safely reboot to standard system mode.`);
      onLogConsole('FrpService', `FRP Bypass successful on ${device.model}! Account protection state deleted.`, 'INFO');
    }, 6200);
  };

  return (
    <div id="frp-unlocker-tab-container" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Configuration Column (Left) */}
      <div className="xl:col-span-1 border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Unlock className="text-blue-500 animate-pulse" size={18} />
            <h3 className="text-sm font-semibold text-slate-200">
              {lang === 'TA' ? 'FRP லாக் நீக்குதல்' : 'FRP Account Bypass'}
            </h3>
          </div>

          {/* Language translation switch for FRP page */}
          <button
            id="frp-lang-btn"
            onClick={() => setLang(lang === 'TA' ? 'EN' : 'TA')}
            className="flex items-center gap-1 px-2 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded text-[10px] font-mono text-slate-400 cursor-pointer transition-all"
            title="Translate to English / தமிழ்"
          >
            <Languages size={11} className="text-blue-400" />
            <span>{lang === 'TA' ? 'English' : 'தமிழ்'}</span>
          </button>
        </div>

        {/* Brand Selection Preset */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">
            {lang === 'TA' ? 'மொபைல் பிராண்ட் வகை' : 'Device Brand Preset'}
          </label>
          <select
            id="frp-brand-preset-select"
            value={brandPreset}
            onChange={(e) => setBrandPreset(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
          >
            <option value="detect">{lang === 'TA' ? 'தானியங்கி கண்டுபிடிப்பு (Auto Detect)' : 'Auto Detect Device'}</option>
            <option value="Samsung">Samsung (Knox Bypass Method)</option>
            <option value="Xiaomi">Xiaomi / Redmi (MTK/Snapdragon Bypass)</option>
            <option value="Google">Google Pixel (Tensor Setup Wizard Exploit)</option>
            <option value="OnePlus">OnePlus (Oppo/Realme Auth Bypass)</option>
            <option value="Vivo">Vivo / IQOO (Safe Wipe Partition)</option>
            <option value="Oppo">Oppo / Realme (Mtk Brom Mode Bypass)</option>
            <option value="Generic">Generic Android (Sideload Override)</option>
          </select>
        </div>

        {/* Bypass Method Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">
            {lang === 'TA' ? 'வழிமுறைத் தேர்வு' : 'Bypass Exploit Vector'}
          </label>
          <div className="space-y-2">
            {[
              { id: 'auto', labelEN: 'Automatic Board Exploit Detection', labelTA: 'தானியங்கி கண்டறிதல் முறை' },
              { id: 'adb_testmode', labelEN: 'Samsung Dial Menu (*#0*#) Command', labelTA: 'சாம்சங் டயல் மெனு (*#0*#) வழிமுறை' },
              { id: 'partition_wipe', labelEN: 'Direct FRP Partition Raw Hex Wipe', labelTA: 'FRP மெமரி பகுதி நேரடியாக அழித்தல்' },
              { id: 'setup_bypass', labelEN: 'Setup Wizard Activity Override', labelTA: 'தொடக்க வழிகாட்டி மேலெழுதும் முறை' }
            ].map(item => (
              <label 
                key={item.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedMethod === item.id 
                    ? 'bg-blue-600/10 border-blue-500/40 text-blue-300' 
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="frp-method"
                  value={item.id}
                  checked={selectedMethod === item.id}
                  onChange={() => setSelectedMethod(item.id)}
                  className="accent-blue-500"
                />
                <span className="font-medium">{lang === 'TA' ? item.labelTA : item.labelEN}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {!device ? (
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-medium">
                {lang === 'TA' ? 'தயவுசெய்து மொபைலை USB மூலம் இணைக்கவும்' : 'Please connect a device over USB first'}
              </span>
            </div>
          ) : (
            <button
              id="start-frp-unlock-btn"
              onClick={handleStartFrpUnlock}
              disabled={isUnlocking}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-500/15"
            >
              {isUnlocking ? (
                <>
                  <Loader2 size={14} className="animate-spin text-white" />
                  <span>{lang === 'TA' ? 'லாக் நீக்கப்படுகிறது...' : 'Bypassing lock partition...'}</span>
                </>
              ) : (
                <>
                  <Unlock size={14} />
                  <span>{lang === 'TA' ? 'FRP லாக் நீக்கத் தொடங்கு' : 'Remove FRP Lock Now'}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Progress Bar Display */}
        {isUnlocking && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="font-semibold">{unlockStatusText}</span>
              <span>{unlockProgress}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${unlockProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status display indicator */}
        {frpLockState === 'unlocked' && !isUnlocking && (
          <div className="p-3 bg-emerald-950/25 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-start gap-2.5">
            <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-emerald-300 block">
                {lang === 'TA' ? 'அதிசயம்! வெற்றிகரமாக திறக்கப்பட்டது' : 'Success! Guard Cleared'}
              </span>
              <span className="text-[11px] text-emerald-500/80 leading-relaxed block mt-0.5">
                {lang === 'TA' 
                  ? 'பழைய கூகிள் கணக்கு பூட்டு முற்றிலுமாக நீக்கப்பட்டது. சாதனத்தை மறுதொடக்கம் செய்து புதிய கணக்கை உருவாக்கவும்.' 
                  : 'Google account validation bypassed successfully. Device is free to be configured with any account.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Diagnostic Monitor Console (Right Columns) */}
      <div className="xl:col-span-2 flex flex-col h-[520px] border border-slate-800 bg-slate-900/10 rounded-xl p-5 justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="text-slate-500" size={16} />
              <h3 className="text-sm font-semibold text-slate-300">
                {lang === 'TA' ? 'லைவ் கண்டறியும் லாக் கன்சோல்' : 'Live FRP Diagnostic Monitor'}
              </h3>
            </div>
            
            <button
              id="clear-frp-logs-btn"
              onClick={handleClearLogs}
              className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded transition-colors cursor-pointer"
            >
              {lang === 'TA' ? 'துடைக்கவும்' : 'Clear Logs'}
            </button>
          </div>

          {/* Connected Device Info Block */}
          {device ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: lang === 'TA' ? 'சாதனம்' : 'Device Model', val: device.model },
                { label: lang === 'TA' ? 'தயாரிப்பாளர்' : 'Manufacturer', val: device.manufacturer },
                { label: lang === 'TA' ? 'பதிப்பு' : 'Android Ver', val: `Android ${device.androidVersion}` },
                { label: lang === 'TA' ? 'தொடர் எண்' : 'Serial No', val: device.serial }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-lg">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block leading-none mb-1">{item.label}</span>
                  <span className="text-xs font-mono text-slate-300 font-semibold truncate block leading-none">{item.val}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg text-xs text-slate-500 text-center">
              {lang === 'TA' ? 'காண்பிக்க சாதனம் எதுவும் இணைக்கப்படவில்லை' : 'No device specs loaded. Connect Android device to query.'}
            </div>
          )}

          {/* Stream Log Output Screen */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 h-[280px] overflow-y-auto space-y-1.5 font-mono text-[10px] text-slate-300 shadow-inner">
            {frpLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                <Cpu size={32} className="text-slate-800" />
                <span className="text-[11px]">
                  {lang === 'TA' ? 'லாக் கன்சோல் காலியாக உள்ளது. லாக் நீக்குதலைத் தொடங்கவும்.' : 'Console logs empty. Trigger FRP Bypass to view live diagnostics.'}
                </span>
              </div>
            ) : (
              frpLogs.map((log, idx) => {
                let colorClass = 'text-slate-300';
                if (log.includes('SUCCESS') || log.includes('COMPLETED')) colorClass = 'text-emerald-400 font-bold';
                else if (log.includes('Error') || log.includes('failed')) colorClass = 'text-rose-400 font-bold';
                else if (log.includes('Sending') || log.includes('Writing') || log.includes('Wiping')) colorClass = 'text-amber-400';
                else if (log.includes('---')) colorClass = 'text-blue-400 font-semibold';

                return (
                  <div key={idx} className={`leading-relaxed whitespace-pre-wrap ${colorClass}`}>
                    {log}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Warning Policy Terms */}
        <div className="border-t border-slate-800 pt-3 flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed">
          <AlertTriangle size={12} className="text-amber-500/70 flex-shrink-0 mt-0.5" />
          <span>
            {lang === 'TA' 
              ? 'கவனம்: இந்த செயல்முறை சட்டப்பூர்வமான மற்றும் உரிமையாளர் அங்கீகாரம் பெற்ற மொபைல்களுக்கு மட்டுமே பயன்படுத்தப்பட வேண்டும். அனுமதியின்றி பிறர் மொபைலை அன்லாக் செய்வது சட்டப்படி குற்றமாகும்.' 
              : 'Caution: FRP bypass operation should only be used on customer-authorized devices or personal test boards. Respect digital hardware privacy frameworks.'}
          </span>
        </div>
      </div>

    </div>
  );
};
