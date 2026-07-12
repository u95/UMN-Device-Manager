import { useState, useEffect, useCallback, useRef } from 'react';
import { Device, ConsoleLog } from './types';
import {
  Smartphone,
  FolderOpen,
  AppWindow,
  Database,
  Terminal,
  Flame,
  Settings,
  Menu,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  LogOut,
  Usb,
  X,
  Plus,
  Activity,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Modular Tab components imports
import { DeviceDashboard } from './components/DeviceDashboard';
import { FileManagerTab } from './components/FileManagerTab';
import { ApkManagerTab } from './components/ApkManagerTab';
import { BackupRestoreTab } from './components/BackupRestoreTab';
import { LogcatViewerTab } from './components/LogcatViewerTab';
import { FastbootToolsTab } from './components/FastbootToolsTab';
import { DiagnosticsCenterTab } from './components/DiagnosticsCenterTab';
import { AboutTab } from './components/AboutTab';
import { SettingsTab } from './components/SettingsTab';
import { InteractiveTour } from './components/InteractiveTour';

// Definition of pre-populated simulation devices
const mockDevices: { [key: string]: Device | null } = {
  'pixel8': {
    id: 'pixel8',
    serial: '2A8B3C4D5E6F',
    model: 'Pixel 8 Pro',
    manufacturer: 'Google',
    androidVersion: '14.0',
    batteryLevel: 85,
    batteryStatus: 'Charging',
    cpu: 'Tensor G3',
    storageTotal: '256 GB',
    storageUsed: '42.8 GB',
    rootStatus: 'No (Locked)',
    connectionMode: 'adb',
    status: 'online',
  },
  's24': {
    id: 's24',
    serial: '9F8E7D6C5B4A',
    model: 'Galaxy S24 Ultra',
    manufacturer: 'Samsung',
    androidVersion: '14.0',
    batteryLevel: 64,
    batteryStatus: 'Discharging',
    cpu: 'Snapdragon 8 Gen 3',
    storageTotal: '512 GB',
    storageUsed: '128.5 GB',
    rootStatus: 'No (Locked)',
    connectionMode: 'adb',
    status: 'unauthorized',
  },
  'redmi': {
    id: 'redmi',
    serial: 'FB821094E73D',
    model: 'Redmi Note 13',
    manufacturer: 'Xiaomi',
    androidVersion: '13.0',
    batteryLevel: 45,
    batteryStatus: 'Discharging',
    cpu: 'Dimensity 6080',
    storageTotal: '128 GB',
    storageUsed: '84.2 GB',
    rootStatus: 'Yes (Rooted)',
    connectionMode: 'fastboot',
    status: 'online',
  },
  'none': null,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSimKey, setSelectedSimKey] = useState<string>('pixel8');
  const [activeDevice, setActiveDevice] = useState<Device | null>(mockDevices['pixel8']);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [logsOpen, setLogsOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Real-time toast state
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' } | null>(null);

  // Serilog console log entries list
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { timestamp: '08:21:42', level: 'INFO', source: 'SerilogLogger', message: 'Serilog file sinks rolling database active on path: %APPDATA%/UMN_DeviceManager/logs.txt' },
    { timestamp: '08:21:43', level: 'INFO', source: 'Bootstrap', message: 'UMN Device Manager starting... Setting up .NET 8 WPF pipelines.' },
    { timestamp: '08:21:43', level: 'INFO', source: 'AdbService', message: 'AdbService initialized. Executing fallback device detection checks.' },
    { timestamp: '08:21:44', level: 'INFO', source: 'FastbootService', message: 'FastbootService active. Scanning system USB hubs for fastboot targets.' },
    { timestamp: '08:21:45', level: 'INFO', source: 'AdbService', message: 'ADB Device detected: Google Pixel 8 Pro [Serial: 2A8B3C4D5E6F] connected via USB.' },
  ]);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Handler to write a live Serilog console entry
  const logToConsole = useCallback((source: string, message: string, level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG' = 'INFO') => {
    const timeStr = new Date().toTimeString().slice(0, 8);
    setConsoleLogs((prev) => [
      ...prev,
      { timestamp: timeStr, level, source, message },
    ].slice(-100)); // Keep last 100 entries
  }, []);

  // Trigger alert toast
  const triggerToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle active device simulation toggles
  const handleDeviceSimChange = (key: string) => {
    setSelectedSimKey(key);
    const targetDev = mockDevices[key];
    
    if (targetDev) {
      logToConsole('AdbService', `USB Connection Event detected: ${targetDev.manufacturer} ${targetDev.model} attached.`);
      triggerToast(`USB Connected: ${targetDev.model}`, 'success');
    } else {
      logToConsole('AdbService', `USB Device detached event received. Interface offline.`);
      triggerToast('Device Disconnected', 'warn');
    }
    
    setActiveDevice(targetDev);
  };

  // Simulate scanning ports
  const handleScanUSBPorts = () => {
    setIsScanning(true);
    logToConsole('AdbService', 'Performing physical hardware poll on device controller hubs...');
    
    setTimeout(() => {
      setIsScanning(false);
      logToConsole('AdbService', `Hardware poll completed. Connected device: ${activeDevice ? activeDevice.model : 'None'}`);
      triggerToast(activeDevice ? `Found: ${activeDevice.model}` : 'No devices found', 'info');
    }, 1200);
  };

  // Simulate remote device reboot commands
  const handleRebootCommand = (mode: string) => {
    if (!activeDevice) return;
    const dest = mode === '' ? 'Normal System OS' : mode.toUpperCase();
    logToConsole('AdbService', `Sending soft power reset signal to ${activeDevice.serial}. Destination: ${dest}`, 'WARNING');
    triggerToast(`Rebooting to ${mode || 'System'}...`, 'info');

    // Simulate device disconnecting as it reboots
    setActiveDevice(null);
    
    setTimeout(() => {
      if (mode === 'bootloader') {
        // Switch to the fastboot target Redmi Note 13 as it boots into fastboot mode!
        setSelectedSimKey('redmi');
        setActiveDevice(mockDevices['redmi']);
        logToConsole('FastbootService', `Redmi Note 13 detected in Bootloader/Fastboot Mode. ready for flashing.`);
        triggerToast('Redmi Note 13 (Fastboot) Online', 'success');
      } else {
        // Boot back to the current device
        const targetDev = mockDevices[selectedSimKey];
        setActiveDevice(targetDev);
        if (targetDev) {
          logToConsole('AdbService', `Device ${targetDev.model} completed reboot cycle and is now fully Online.`);
          triggerToast(`${targetDev.model} online`, 'success');
        }
      }
    }, 2500);
  };

  // Auto-scrolling for logs tray
  useEffect(() => {
    if (logsOpen && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs, logsOpen]);

  // Handle simulations triggered from nested pages
  const handleSimulateAction = (action: 'authorize' | 'connect') => {
    if (action === 'authorize' && activeDevice) {
      const authorizedDev: Device = {
        ...activeDevice,
        status: 'online',
      };
      // update state
      setActiveDevice(authorizedDev);
      logToConsole('AdbService', `Device ${activeDevice.serial} authorized by user. Handshake successful.`);
      triggerToast('Device Authorized', 'success');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Device Dashboard', icon: Smartphone },
    { id: 'files', label: 'File Explorer', icon: FolderOpen },
    { id: 'apps', label: 'APK Manager', icon: AppWindow },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'logcat', label: 'Real-Time Logcat', icon: Terminal },
    { id: 'fastboot', label: 'Fastboot Flasher', icon: Flame },
    { id: 'diagnostics', label: 'Diagnostics Center', icon: Activity },
    { id: 'about', label: 'About & System Info', icon: Info },
    { id: 'settings', label: 'Suite Settings', icon: Settings },
  ];

  const getLogStyle = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-rose-400 font-bold';
      case 'WARNING': return 'text-amber-400 font-semibold';
      case 'DEBUG': return 'text-slate-500';
      default: return 'text-sky-400';
    }
  };

  return (
    <div id="app-viewport-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="toast-notification"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border flex items-center gap-2.5 shadow-xl shadow-slate-950/40 text-xs font-semibold ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : toast.type === 'warn' 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={15} />}
            {toast.type === 'warn' && <AlertCircle size={15} />}
            {toast.type === 'info' && <HelpCircle size={15} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 border-b border-slate-850 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
            UMN
          </div>
          <div>
            <h1 className="font-extrabold text-xs text-slate-100 leading-none">UMN DEVICE</h1>
            <span className="text-[8px] text-slate-500 font-bold block mt-0.5 leading-none">SERVICE UTILITY</span>
          </div>
        </div>

        <button
          id="mobile-menu-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-slate-100 bg-slate-950/50 border border-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <Menu size={14} />
          <span>Menu</span>
        </button>
      </div>

      {/* Main Structural Framework */}
      <div id="main-grid-flex" className="flex-1 flex flex-col lg:flex-row h-full relative">
        
        {/* Mobile Sidebar Backdrop overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* SIDEBAR NAVIGATION PANEL */}
        <aside 
          id="suite-sidebar" 
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
            w-72 lg:w-64 bg-slate-900 border-r border-slate-800/80 p-5 
            flex flex-col justify-between flex-shrink-0 
            h-full lg:max-h-screen lg:overflow-y-auto overflow-y-auto scrollbar-thin
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="space-y-6">
            
            {/* Logo / Commercial Branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                  UMN
                </div>
                <div>
                  <h1 className="font-extrabold text-sm tracking-wider text-slate-100">UMN DEVICE</h1>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Service Utility v1.0</span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1.5 text-slate-500 hover:text-slate-300 rounded-lg bg-slate-950/40 border border-slate-850 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Simulated USB Link Hub */}
            <div id="usb-link-simulator" className="p-3 bg-slate-950 rounded-xl border border-slate-850/80 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <Usb size={12} className="text-blue-500" />
                <span>Simulated USB Port</span>
              </div>
              <select
                id="usb-device-select"
                value={selectedSimKey}
                onChange={(e) => handleDeviceSimChange(e.target.value)}
                className="w-full bg-slate-900 text-slate-300 text-xs p-2 rounded-lg border border-slate-800 focus:outline-none cursor-pointer hover:border-slate-700 transition-colors"
              >
                <option value="pixel8">Google Pixel 8 Pro (ADB)</option>
                <option value="s24">Samsung Galaxy S24 (RSA Prompt)</option>
                <option value="redmi">Xiaomi Redmi Note 13 (Fastboot)</option>
                <option value="none">[ USB Disconnected ]</option>
              </select>
            </div>

            {/* Interactive Tour Guide (Demo) */}
            <InteractiveTour
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedSimKey={selectedSimKey}
              onDeviceSimChange={handleDeviceSimChange}
              onLogConsole={logToConsole}
            />

            {/* Navigation Tabs Menu */}
            <nav id="nav-tabs" className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSel = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'
                    }`}
                  >
                    <Icon size={15} className={isSel ? 'text-white' : 'text-slate-500'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Info */}
          <div className="hidden lg:block pt-5 border-t border-slate-800/80 text-[10px] text-slate-500 space-y-1">
            <span className="block font-medium">UMN Device Manager Console</span>
            <span className="block">Legal Android Diagnostics Suite</span>
          </div>
        </aside>

        {/* CONTENT VIEWSPACE */}
        <main id="main-content-canvas" className="flex-1 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto max-h-screen">
          
          {/* Header Title Section */}
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-850 pb-5 mb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-blue-500 font-mono tracking-widest">
                {activeDevice ? `Device connected: ${activeDevice.serial}` : 'Offline Mode'}
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-100 mt-0.5">
                {navItems.find(n => n.id === activeTab)?.label}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="header-scan-btn"
                onClick={handleScanUSBPorts}
                disabled={isScanning}
                className="flex items-center gap-1.5 px-4.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors disabled:opacity-40"
              >
                <RefreshCw size={13} className={isScanning ? 'animate-spin' : ''} />
                Refresh Scan
              </button>
            </div>
          </header>

          {/* Dynamic Tab Workspaces Router */}
          <div id="dynamic-tab-viewspace" className="flex-1">
            {activeTab === 'dashboard' && (
              <DeviceDashboard
                device={activeDevice}
                onReboot={handleRebootCommand}
                onScan={handleScanUSBPorts}
                isScanning={isScanning}
                onSimulateStateChange={handleSimulateAction}
              />
            )}
            {activeTab === 'files' && (
              <FileManagerTab
                device={activeDevice}
                onLogConsole={logToConsole}
              />
            )}
            {activeTab === 'apps' && (
              <ApkManagerTab
                device={activeDevice}
                onLogConsole={logToConsole}
              />
            )}
            {activeTab === 'backup' && (
              <BackupRestoreTab
                device={activeDevice}
                onLogConsole={logToConsole}
              />
            )}
            {activeTab === 'logcat' && (
              <LogcatViewerTab
                device={activeDevice}
              />
            )}
            {activeTab === 'fastboot' && (
              <FastbootToolsTab
                device={activeDevice}
                onLogConsole={logToConsole}
                onReboot={handleRebootCommand}
              />
            )}
            {activeTab === 'diagnostics' && (
              <DiagnosticsCenterTab
                device={activeDevice}
                onLogConsole={logToConsole}
              />
            )}
            {activeTab === 'about' && (
              <AboutTab />
            )}
            {activeTab === 'settings' && (
              <SettingsTab
                onLogConsole={logToConsole}
              />
            )}
          </div>

          {/* GLOBAL STATUS BAR & INTEGRATED SERILOG TRAY */}
          <footer className="mt-8 border-t border-slate-850 pt-4">
            
            {/* Active Serilog Log Console Tray Toggle */}
            <div id="console-logs-tray" className="mb-4">
              <button
                id="toggle-logs-drawer-btn"
                onClick={() => setLogsOpen(!logsOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-400 cursor-pointer transition-colors"
              >
                <Terminal size={12} />
                <span>Serilog Output Logs Console</span>
                {logsOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
              </button>

              <AnimatePresence>
                {logsOpen && (
                  <motion.div
                    id="logs-drawer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 160, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 bg-slate-950 border border-slate-850 rounded-xl p-3 overflow-y-auto space-y-1.5 font-mono text-[10px] text-slate-300"
                  >
                    {consoleLogs.map((log, index) => (
                      <div key={index} className="flex gap-2 leading-relaxed hover:bg-slate-900/45 p-0.5 rounded transition-colors whitespace-pre-wrap font-mono">
                        <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                        <span className={`select-none ${getLogStyle(log.level)}`}>[{log.level}]</span>
                        <span className="text-slate-500 font-semibold">{log.source}:</span>
                        <span className="text-slate-300 flex-1">{log.message}</span>
                      </div>
                    ))}
                    <div ref={consoleEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Base Status Bar Bar */}
            <div id="base-status-bar" className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-500 font-mono font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${activeDevice ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                  Device Connection: {activeDevice ? `${activeDevice.model} (${activeDevice.connectionMode.toUpperCase()})` : 'Disconnected'}
                </span>
                {activeDevice && (
                  <span className="text-[10px] font-normal">
                    Battery: {activeDevice.batteryLevel}% ({activeDevice.batteryStatus})
                  </span>
                )}
              </div>
              <div>
                <span>UMN Device Manager Suite v1.0.0 Stable (Authorized Actions Only)</span>
              </div>
            </div>

          </footer>

        </main>
      </div>

    </div>
  );
}
