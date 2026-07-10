import React from 'react';
import { Device } from '../types';
import { Shield, RefreshCw, Cpu, Battery, HardDrive, Smartphone, Zap, RotateCw } from 'lucide-react';
import { motion } from 'motion/react';

interface DeviceDashboardProps {
  device: Device | null;
  onReboot: (mode: string) => void;
  onScan: () => void;
  isScanning: boolean;
  onSimulateStateChange?: (action: 'authorize' | 'connect') => void;
}

export const DeviceDashboard: React.FC<DeviceDashboardProps> = ({
  device,
  onReboot,
  onScan,
  isScanning,
  onSimulateStateChange,
}) => {
  if (!device) {
    return (
      <div id="no-device-view" className="flex flex-col items-center justify-center h-96 border border-slate-800 rounded-xl bg-slate-900/50 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-500 animate-pulse">
          <Smartphone size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">No Authorized Device Connected</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Connect your Android device via USB with USB Debugging enabled in Developer Options. UMN Device Manager scans ports automatically.
        </p>
        <button
          id="scan-btn-dashboard"
          onClick={onScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/10"
        >
          <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
          {isScanning ? 'Scanning Ports...' : 'Scan USB Ports'}
        </button>
      </div>
    );
  }

  const isUnauthorized = device.status === 'unauthorized';
  const isFastboot = device.connectionMode === 'fastboot';

  // Calculate battery color
  const getBatteryColor = (level: number) => {
    if (level > 70) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (level > 30) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div id="device-dashboard-workspace" className="space-y-6">
      {/* Dynamic Unauthorized Banner */}
      {isUnauthorized && (
        <div id="unauthorized-banner" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border border-amber-500/30 bg-amber-500/5 rounded-xl">
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-1 md:mt-0">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-300">Device Unauthorized (Pending Request)</h4>
              <p className="text-xs text-amber-400/80 mt-0.5">
                Please allow USB debugging on your device screen. An RSA key fingerprint prompt is active on the screen.
              </p>
            </div>
          </div>
          <button
            id="auth-sim-btn"
            onClick={() => onSimulateStateChange?.('authorize')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md font-medium text-xs transition-colors cursor-pointer"
          >
            Acknowledge RSA Prompt
          </button>
        </div>
      )}

      {/* Main Info Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Photo & General Properties */}
        <div id="device-identity-card" className="lg:col-span-2 border border-slate-800 rounded-xl bg-slate-900/30 p-6 flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-950/40 rounded-xl border border-slate-800/80 w-full md:w-48 text-center">
            <div className="relative mb-3">
              <Smartphone size={80} className="text-blue-500" />
              <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900 rounded-full border border-slate-800">
                <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full`}>
                  <span className={`absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full opacity-75 ${isFastboot ? 'bg-amber-400' : isUnauthorized ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isFastboot ? 'bg-amber-500' : isUnauthorized ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{isFastboot ? 'Fastboot Target' : 'ADB Client'}</span>
            <h3 className="text-lg font-bold text-slate-100 mt-1">{device.model}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{device.manufacturer}</p>
          </div>

          <div className="flex-1 space-y-4">
            <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2">Hardware Properties</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 block">Serial Number</span>
                <span className="font-mono text-sm text-slate-300">{device.serial}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 block">Android OS Release</span>
                <span className="text-sm text-slate-300 font-medium">Android {device.androidVersion}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 block">Processor Hardware</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Cpu size={14} className="text-blue-500" />
                  <span className="text-sm font-medium">{device.cpu}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 block">Root System Flag</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Shield size={14} className={device.rootStatus.includes('Rooted') ? 'text-emerald-500' : 'text-slate-500'} />
                  <span className="text-sm font-medium">{device.rootStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Battery & Memory Telemetry */}
        <div id="device-telemetry-panel" className="border border-slate-800 rounded-xl bg-slate-900/30 p-6 space-y-5">
          <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2">Telemetry Monitors</h4>

          {/* Battery Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1"><Battery size={14} /> Battery Power</span>
              <span className="text-slate-300 font-medium">{device.batteryLevel}% - {device.batteryStatus}</span>
            </div>
            <div className="w-full bg-slate-950 h-3.5 rounded-full p-0.5 border border-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${device.batteryLevel}%` }}
                className={`h-full rounded-full ${
                  device.batteryLevel > 70 ? 'bg-emerald-500' : device.batteryLevel > 30 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
            </div>
          </div>

          {/* Storage Capacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1"><HardDrive size={14} /> Shared Internal Memory</span>
              <span className="text-slate-300 font-medium">{device.storageUsed} / {device.storageTotal}</span>
            </div>
            {/* Compute Percentage */}
            {(() => {
              const usedVal = parseFloat(device.storageUsed) || 0;
              const totalVal = parseFloat(device.storageTotal) || 64;
              const pct = totalVal > 0 ? (usedVal / totalVal) * 100 : 0;
              return (
                <div className="w-full bg-slate-950 h-3.5 rounded-full p-0.5 border border-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Reboot Power Grid Controls */}
      <div id="power-grid-card" className="border border-slate-800 rounded-xl bg-slate-900/30 p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2.5">
          <Zap size={18} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-300">System Boot Operations</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Reboot operations send direct signal commands to the device. Ensure any ongoing data transfer, backup, or flash processes are completely finalized before issuing power payloads.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            id="reboot-normal-btn"
            onClick={() => onReboot('')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <RotateCw size={16} />
            Reboot (Normal)
          </button>
          <button
            id="reboot-bootloader-btn"
            onClick={() => onReboot('bootloader')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 border border-amber-900/30 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <Zap size={16} />
            Reboot to Bootloader (Fastboot)
          </button>
          <button
            id="reboot-recovery-btn"
            onClick={() => onReboot('recovery')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <RotateCw size={16} />
            Reboot to Recovery
          </button>
        </div>
      </div>
    </div>
  );
};
