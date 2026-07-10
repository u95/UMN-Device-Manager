import React, { useState } from 'react';
import { Device } from '../types';
import { 
  Shield, 
  RefreshCw, 
  Cpu, 
  Battery, 
  HardDrive, 
  Smartphone, 
  Zap, 
  RotateCw,
  Usb,
  Bluetooth,
  Wifi,
  Radio,
  Sparkles,
  Layers,
  CheckCircle,
  Hash,
  Languages,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [lang, setLang] = useState<'TA' | 'EN'>('TA'); // Tamil by default
  const [connType, setConnType] = useState<'usb' | 'bluetooth' | 'wifi'>('usb');
  const [usbSpeed, setUsbSpeed] = useState<string>('USB 3.2 Gen 2 (10 Gbps)');
  const [btPaired, setBtPaired] = useState<boolean>(true);
  const [btMac, setBtMac] = useState<string>('74:E1:82:9F:3C:D0');
  const [wifiSsid, setWifiSsid] = useState<string>('UMN_HighSpeed_Secure_5G');
  const [wifiIp, setWifiIp] = useState<string>('192.168.1.142');
  
  // IMEI & SIM States
  const [imei1, setImei1] = useState<string>('358241098273614');
  const [imei2, setImei2] = useState<string>('358241098273622');
  const [simCarrier, setSimCarrier] = useState<string>('Jio 5G / Airtel SuperNetwork');
  const [signalStrength, setSignalStrength] = useState<number>(94); // percentage

  if (!device) {
    return (
      <div id="no-device-view" className="flex flex-col items-center justify-center h-96 border border-slate-800 rounded-xl bg-slate-900/50 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-500 animate-pulse">
          <Smartphone size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          {lang === 'TA' ? 'அங்கீகரிக்கப்பட்ட சாதனம் எதுவும் இணைக்கப்படவில்லை' : 'No Authorized Device Connected'}
        </h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          {lang === 'TA' 
            ? 'டெவலப்பர் விருப்பங்களில் USB பிழைத்திருத்தத்துடன் உங்கள் சாதனத்தை இணைக்கவும். UMN சாதன மேலாளர் தானாக ஸ்கேன் செய்யும்.' 
            : 'Connect your Android device via USB with USB Debugging enabled in Developer Options. UMN Device Manager scans ports automatically.'}
        </p>
        <div className="flex gap-3">
          <button
            id="scan-btn-dashboard"
            onClick={onScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/10"
          >
            <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
            {isScanning 
              ? (lang === 'TA' ? 'ஸ்கேன் செய்யப்படுகிறது...' : 'Scanning Ports...') 
              : (lang === 'TA' ? 'போர்ட்களை ஸ்கேன் செய்' : 'Scan USB Ports')}
          </button>
          
          <button
            onClick={() => setLang(lang === 'TA' ? 'EN' : 'TA')}
            className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <Languages size={14} className="text-blue-400" />
            <span>{lang === 'TA' ? 'English' : 'தமிழ்'}</span>
          </button>
        </div>
      </div>
    );
  }

  const isUnauthorized = device.status === 'unauthorized';
  const isFastboot = device.connectionMode === 'fastboot';

  // Generate random dummy IMEI matching standard length
  const handleGenerateImei = () => {
    const genRand = () => Math.floor(10000000 + Math.random() * 90000000).toString();
    const newImei1 = '35824109' + genRand().slice(0, 7);
    const newImei2 = '35824109' + genRand().slice(0, 7);
    setImei1(newImei1);
    setImei2(newImei2);
  };

  return (
    <div id="device-dashboard-workspace" className="space-y-6">
      
      {/* Top action row inside Dashboard with Tamil Toggle */}
      <div className="flex items-center justify-between bg-slate-900/30 p-3.5 border border-slate-800/80 rounded-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="text-yellow-400 animate-pulse" size={15} />
          <span className="text-xs font-semibold text-slate-300">
            {lang === 'TA' ? 'சாதன இணைப்பு மற்றும் கண்டறியும் தளம்' : 'Active Hardware Diagnostic Console'}
          </span>
        </div>
        <button
          id="dashboard-lang-switch-btn"
          onClick={() => setLang(lang === 'TA' ? 'EN' : 'TA')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono font-semibold text-blue-300 cursor-pointer transition-colors"
        >
          <Languages size={13} className="text-blue-400" />
          <span>{lang === 'TA' ? 'Change to English' : 'தமிழுக்கு மாற்றவும்'}</span>
        </button>
      </div>

      {/* Dynamic Unauthorized Banner */}
      {isUnauthorized && (
        <div id="unauthorized-banner" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border border-amber-500/30 bg-amber-500/5 rounded-xl">
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-1 md:mt-0">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-300">
                {lang === 'TA' ? 'சாதனம் அங்கீகரிக்கப்படவில்லை (அனுமதி நிலுவையில் உள்ளது)' : 'Device Unauthorized (Pending Request)'}
              </h4>
              <p className="text-xs text-amber-400/80 mt-0.5">
                {lang === 'TA' 
                  ? 'உங்கள் மொபைல் திரையில் USB டீபக்கிங் அனுமதியை வழங்கவும். RSA சான்றிதழ் கோரிக்கை காட்டப்படுகிறது.' 
                  : 'Please allow USB debugging on your device screen. An RSA key fingerprint prompt is active on the screen.'}
              </p>
            </div>
          </div>
          <button
            id="auth-sim-btn"
            onClick={() => onSimulateStateChange?.('authorize')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md font-medium text-xs transition-colors cursor-pointer"
          >
            {lang === 'TA' ? 'RSA அனுமதியை உருவகப்படுத்து' : 'Acknowledge RSA Prompt'}
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
            <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2">
              {lang === 'TA' ? 'வன்பொருள் விவரக்குறிப்புகள்' : 'Hardware Properties'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 block">{lang === 'TA' ? 'வரிசை எண் (Serial No)' : 'Serial Number'}</span>
                <span className="font-mono text-sm text-slate-300">{device.serial}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 block">{lang === 'TA' ? 'ஆண்ட்ராய்டு பதிப்பு' : 'Android OS Release'}</span>
                <span className="text-sm text-slate-300 font-medium">Android {device.androidVersion}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 block">{lang === 'TA' ? 'செயலி (Processor)' : 'Processor Hardware'}</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Cpu size={14} className="text-blue-500" />
                  <span className="text-sm font-medium">{device.cpu}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 block">{lang === 'TA' ? 'ரூட் அனுமதி நிலை' : 'Root System Flag'}</span>
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
          <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2">
            {lang === 'TA' ? 'நேரடி டெலிமெட்ரி கண்காணிப்பு' : 'Telemetry Monitors'}
          </h4>

          {/* Battery Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Battery size={14} /> {lang === 'TA' ? 'பேட்டரி மின்சாரம்' : 'Battery Power'}
              </span>
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
              <span className="text-slate-500 flex items-center gap-1">
                <HardDrive size={14} /> {lang === 'TA' ? 'உள் நினைவகம் (Internal Memory)' : 'Shared Internal Memory'}
              </span>
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

      {/* NEW SECTION: BILINGUAL ADVANCED CONNECTION HUB (USB, Bluetooth, WiFi, IMEI) */}
      <div id="advanced-connection-hub" className="border border-slate-800 rounded-xl bg-slate-900/20 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Radio className="text-blue-500 animate-pulse" size={18} />
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                {lang === 'TA' ? 'நெகிழ்வான பல இணைப்பு மற்றும் சிக்னல் மேலாளர்' : 'Multi-Interface Link & Core Telecom Engine'}
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-mono mt-0.5">
                {lang === 'TA' ? 'USB, புளூடூத், வைஃபை மற்றும் IMEI தகவல்கள்' : 'Configure Wired / Wireless Channels & Sim Transceivers'}
              </p>
            </div>
          </div>

          {/* Connection Type Switcher Buttons */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
            {[
              { id: 'usb', label: lang === 'TA' ? 'USB கேபிள்' : 'USB Cable', icon: Usb },
              { id: 'bluetooth', label: lang === 'TA' ? 'புளூடூத்' : 'Bluetooth', icon: Bluetooth },
              { id: 'wifi', label: lang === 'TA' ? 'வைஃபை' : 'Wi-Fi LAN', icon: Wifi }
            ].map(tab => {
              const Icon = tab.icon;
              const isSel = connType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setConnType(tab.id as 'usb' | 'bluetooth' | 'wifi')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    isSel 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display based on Selected Connection Option */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Connection Interface Configuration */}
          <div className="md:col-span-1 bg-slate-950/40 p-4 border border-slate-850 rounded-xl space-y-4">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block tracking-wider">
              {lang === 'TA' ? 'இணைப்பு விவரங்கள்' : 'Active Connection Details'}
            </span>

            {connType === 'usb' && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 p-2 bg-blue-600/10 border border-blue-500/20 text-blue-300 rounded-lg">
                  <Usb size={16} />
                  <span className="text-xs font-semibold">{lang === 'TA' ? 'USB இணைப்பில் உள்ளது' : 'USB Bus Connection Active'}</span>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block">{lang === 'TA' ? 'கேபிள் வன்பொருள் வேகம்' : 'Cable Interface Link Speed'}</label>
                  <select
                    value={usbSpeed}
                    onChange={(e) => setUsbSpeed(e.target.value)}
                    className="w-full bg-slate-950 text-slate-300 text-xs p-2 rounded-lg border border-slate-800 focus:outline-none"
                  >
                    <option value="USB 2.0 legacy (480 Mbps)">USB 2.0 Standard (480 Mbps)</option>
                    <option value="USB 3.2 Gen 2 (10 Gbps)">USB 3.2 Gen 2 (10 Gbps) - HighSpeed</option>
                    <option value="USB 4 Thunderbolt (40 Gbps)">USB 4 Type-C Thunderbolt (40 Gbps)</option>
                  </select>
                </div>
                <div className="text-[10px] text-slate-500 leading-relaxed font-mono">
                  {lang === 'TA' ? 'Physical Port: ADB USB Hardware Hub [Port #3]' : 'Physical Port: ADB USB Hardware Hub [Port #3]'}
                </div>
              </div>
            )}

            {connType === 'bluetooth' && (
              <div className="space-y-3.5">
                <div className={`flex items-center justify-between p-2 rounded-lg border ${
                  btPaired ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <div className="flex items-center gap-2">
                    <Bluetooth size={16} />
                    <span className="text-xs font-semibold">
                      {btPaired ? (lang === 'TA' ? 'புளூடூத் இணைக்கப்பட்டுள்ளது' : 'Bluetooth Device Paired') : (lang === 'TA' ? 'இணைக்கப்படவில்லை' : 'Bluetooth Disconnected')}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={btPaired}
                    onChange={(e) => setBtPaired(e.target.checked)}
                    className="accent-indigo-500 h-4 w-4 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block">{lang === 'TA' ? 'புளூடூத் மேக் முகவரி' : 'Bluetooth MAC Address'}</label>
                  <input
                    type="text"
                    value={btMac}
                    onChange={(e) => setBtMac(e.target.value)}
                    className="w-full bg-slate-950 text-slate-300 text-xs p-2 rounded-lg border border-slate-800 focus:outline-none font-mono"
                  />
                </div>
                <div className="text-[10px] text-slate-500 leading-relaxed font-mono">
                  {lang === 'TA' ? 'சிப் செட்: Broadcom BLE v5.3' : 'Transceiver Chipset: Broadcom BLE v5.3'}
                </div>
              </div>
            )}

            {connType === 'wifi' && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 p-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-300 rounded-lg">
                  <Wifi size={16} />
                  <span className="text-xs font-semibold">{lang === 'TA' ? 'வைஃபை நெட்வொர்க் ஆன்' : 'Wi-Fi Wireless LAN Active'}</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block">{lang === 'TA' ? 'வைஃபை பெயர் (SSID)' : 'Wi-Fi Network Name (SSID)'}</label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      className="w-full bg-slate-950 text-slate-300 text-xs p-2.5 rounded-lg border border-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block">{lang === 'TA' ? 'ஐபி முகவரி (IP Address)' : 'Assigned IP Address'}</label>
                    <input
                      type="text"
                      value={wifiIp}
                      onChange={(e) => setWifiIp(e.target.value)}
                      className="w-full bg-slate-950 text-slate-300 text-xs p-2.5 rounded-lg border border-slate-800 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: IMEI Telecommunications & SIM Card Diagnostics */}
          <div className="md:col-span-2 bg-slate-950/40 p-4 border border-slate-850 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block tracking-wider">
                {lang === 'TA' ? 'IMEI & சிம் கார்டு கண்டறிதல்' : 'Core SIM / IMEI Dual Transceiver Specs'}
              </span>
              
              <button
                onClick={handleGenerateImei}
                className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 bg-slate-900 px-2.5 py-1 border border-slate-850 rounded-md cursor-pointer transition-colors"
              >
                <Hash size={11} />
                <span>{lang === 'TA' ? 'புதிய IMEI உருவாக்கு' : 'Regenerate IMEIs'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* IMEI 1 */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 block">
                  {lang === 'TA' ? 'முதன்மையான IMEI (சிம் 1)' : 'Primary IMEI (SIM 1 slot)'}
                </label>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-300 text-xs font-mono">
                  <Hash size={12} className="text-blue-500" />
                  <span>{imei1}</span>
                </div>
              </div>

              {/* IMEI 2 */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 block">
                  {lang === 'TA' ? 'இரண்டாவது IMEI (சிம் 2 / eSIM)' : 'Secondary IMEI (SIM 2 / eSIM)'}
                </label>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-300 text-xs font-mono">
                  <Hash size={12} className="text-indigo-400" />
                  <span>{imei2}</span>
                </div>
              </div>

              {/* SIM Network Carrier */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 block">
                  {lang === 'TA' ? 'சிம் நெட்வொர்க் சேவை' : 'SIM Network Carrier Provider'}
                </label>
                <input
                  type="text"
                  value={simCarrier}
                  onChange={(e) => setSimCarrier(e.target.value)}
                  className="w-full bg-slate-950 text-slate-300 text-xs p-2 rounded-lg border border-slate-800 focus:outline-none"
                />
              </div>

              {/* Signal strength percentage slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <label className="text-slate-500 block">{lang === 'TA' ? 'சிக்னல் வலிமை (RSSI)' : 'RF Transceiver Signal Strength'}</label>
                  <span className="text-blue-400 font-mono font-semibold">{signalStrength}% ({signalStrength > 75 ? 'Excellent' : 'Moderate'})</span>
                </div>
                <div className="flex items-center gap-2.5 pt-1.5">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={signalStrength}
                    onChange={(e) => setSignalStrength(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                  />
                  <Activity size={14} className="text-blue-500 animate-pulse flex-shrink-0" />
                </div>
              </div>

            </div>

            <div className="p-2.5 bg-slate-900/50 border border-slate-850 rounded-lg text-[10px] text-slate-400 leading-relaxed font-sans">
              <span className="font-semibold text-slate-300 block mb-0.5">
                {lang === 'TA' ? 'சிம் கார்டு பாதுகாப்பு நிலை:' : 'SIM Protection & Security State:'}
              </span>
              <span>
                {lang === 'TA' 
                  ? 'PIN / PUK பாதுகாப்பு: இல்லை. SIM 1 வோல்டி (VoLTE) மற்றும் சிம் 2 5G நெட்வொர்க் வழியாக நேரடி அழைப்புக்குத் தயாராக உள்ளது.' 
                  : 'PIN Lock: Disabled. eSIM profile fully provisioned. VoLTE signaling channels open and responsive over primary telecom mast.'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Reboot Power Grid Controls */}
      <div id="power-grid-card" className="border border-slate-800 rounded-xl bg-slate-900/30 p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2.5">
          <Zap size={18} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-300">
            {lang === 'TA' ? 'சிஸ்டம் பூட் கட்டுப்பாடுகள்' : 'System Boot Operations'}
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          {lang === 'TA'
            ? 'மறுதொடக்கம் செயல்பாடுகள் மொபைலுக்கு நேரடி சமிக்ஞைகளை அனுப்புகின்றன. தரவு பரிமாற்றம் அல்லது காப்புப்பிரதி செயல்முறைகள் முழுமையாக முடிந்ததை உறுதிப்படுத்தவும்.'
            : 'Reboot operations send direct signal commands to the device. Ensure any ongoing data transfer, backup, or flash processes are completely finalized before issuing power payloads.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            id="reboot-normal-btn"
            onClick={() => onReboot('')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <RotateCw size={16} />
            {lang === 'TA' ? 'மறுதொடக்கம் (இயல்பான)' : 'Reboot (Normal)'}
          </button>
          <button
            id="reboot-bootloader-btn"
            onClick={() => onReboot('bootloader')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 border border-amber-900/30 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <Zap size={16} />
            {lang === 'TA' ? 'பூட்லோடரில் ரீபூட் (Fastboot)' : 'Reboot to Bootloader (Fastboot)'}
          </button>
          <button
            id="reboot-recovery-btn"
            onClick={() => onReboot('recovery')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <RotateCw size={16} />
            {lang === 'TA' ? 'ரிகவரியில் ரீபூட் செய்க' : 'Reboot to Recovery'}
          </button>
        </div>
      </div>
    </div>
  );
};
