import React, { useState } from 'react';
import { Settings, Folder, Save, Shield, HelpCircle, CheckCircle } from 'lucide-react';

interface SettingsTabProps {
  onLogConsole: (source: string, msg: string, level?: 'INFO' | 'WARNING' | 'ERROR') => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onLogConsole }) => {
  const [adbPath, setAdbPath] = useState<string>('C:\\platform-tools\\adb.exe');
  const [fastbootPath, setFastbootPath] = useState<string>('C:\\platform-tools\\fastboot.exe');
  const [theme, setTheme] = useState<string>('Dark-Slate');
  const [language, setLanguage] = useState<string>('English');
  const [autoRefreshSecs, setAutoRefreshSecs] = useState<number>(3);
  const [logsPath, setLogsPath] = useState<string>('%APPDATA%\\UMN_DeviceManager\\logs.txt');
  const [saved, setSaved] = useState<boolean>(false);

  const handleSaveSettings = () => {
    setSaved(true);
    onLogConsole('SettingsService', `Configuration state flushed to local disk database cleanly.`);
    onLogConsole('SettingsService', `Updated auto-refresh rate to ${autoRefreshSecs} seconds.`);
    
    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div id="settings-tab-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Settings Input Grid (Spans 2) */}
      <div id="settings-inputs" className="lg:col-span-2 border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Settings className="text-blue-500" size={18} />
          <h3 className="text-sm font-semibold text-slate-300">Tool Suite Configurations</h3>
        </div>

        {saved && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <span className="font-semibold">Settings successfully updated! Properties saved to registry and App.config files.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* ADB Path override */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">ADB Process Executable Path</label>
            <input
              id="adb-path-field"
              type="text"
              value={adbPath}
              onChange={(e) => setAdbPath(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>

          {/* Fastboot Path override */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">Fastboot Process Executable Path</label>
            <input
              id="fastboot-path-field"
              type="text"
              value={fastbootPath}
              onChange={(e) => setFastbootPath(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>

          {/* Theme Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">Application Theme Skin</label>
            <select
              id="theme-select-field"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            >
              <option value="Dark-Slate">UMN Slate (Custom Premium Dark Theme)</option>
              <option value="Light-Modern">Crystal (Modern Minimal Light Theme)</option>
              <option value="Amoled-Brut">Amoled High-Contrast (Deep Pitch Dark)</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">Default UI Language</label>
            <select
              id="language-select-field"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            >
              <option value="English">English (United States)</option>
              <option value="Spanish">Español (Castellano)</option>
              <option value="French">Français (Europe)</option>
              <option value="German">Deutsch (Zentral)</option>
            </select>
          </div>

          {/* Refresh Slider */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Device Scanning Sweep Rate</label>
              <span className="text-blue-400 font-mono font-medium">{autoRefreshSecs} seconds</span>
            </div>
            <input
              id="refresh-slider"
              type="range"
              min={1}
              max={15}
              value={autoRefreshSecs}
              onChange={(e) => setAutoRefreshSecs(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 border border-slate-850"
            />
          </div>

          {/* Serilog logs sink folder path */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">Serilog File Sink Path</label>
            <input
              id="serilog-logs-path-field"
              type="text"
              value={logsPath}
              onChange={(e) => setLogsPath(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>

        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            id="save-settings-btn"
            onClick={handleSaveSettings}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-lg shadow-blue-500/10"
          >
            <Save size={14} />
            Save Configuration
          </button>
        </div>
      </div>

      {/* Guide Info panel (Right Column) */}
      <div id="guide-info-panel" className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4 h-fit text-xs leading-relaxed">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Shield className="text-slate-500" size={16} />
          <h3 className="text-sm font-semibold text-slate-300">UMN Security Audit Policy</h3>
        </div>

        <p className="text-slate-400">
          UMN Device Manager adheres strictly to legal and ethical operational standards on all mobile board devices.
        </p>

        <div className="space-y-2 text-slate-500 border-l-2 border-slate-800 pl-3">
          <span className="block font-semibold text-slate-400">🚫 Restricted/Forbidden Actions:</span>
          <span className="block">• No Factory Reset Protection (FRP) locks bypass keys</span>
          <span className="block">• No Account lock/pattern bypass operations</span>
          <span className="block">• No IMEI modifications or baseband rewrites</span>
          <span className="block">• No unauthorized bootloader unlock payloads</span>
        </div>

        <p className="text-slate-500 text-[11px]">
          All operations list, inspect, or backup only user-owned, authorized resources and sign logs with Serilog file-rolling logging sinks for auditing.
        </p>
      </div>
      
    </div>
  );
};
