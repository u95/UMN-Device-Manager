import React, { useState } from 'react';
import { Device, ApkPackage } from '../types';
import { AppWindow, Search, Plus, Trash2, Smartphone, Shield, Download, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ApkManagerTabProps {
  device: Device | null;
  onLogConsole: (source: string, msg: string, level?: 'INFO' | 'WARNING' | 'ERROR') => void;
}

const initialPackages: ApkPackage[] = [
  { packageName: 'com.whatsapp', version: '2.26.15', type: 'third-party' },
  { packageName: 'com.instagram.android', version: '304.0.0', type: 'third-party' },
  { packageName: 'com.spotify.music', version: '8.8.84', type: 'third-party' },
  { packageName: 'org.mozilla.firefox', version: '121.0.1', type: 'third-party' },
  { packageName: 'com.google.android.youtube', version: '19.04.37', type: 'system' },
  { packageName: 'com.google.android.apps.maps', version: '11.112.0', type: 'system' },
  { packageName: 'com.android.chrome', version: '121.0.6167', type: 'system' },
  { packageName: 'com.android.settings', version: '14.0.0', type: 'system' },
  { packageName: 'com.android.systemui', version: '14.0.0', type: 'system' },
  { packageName: 'com.google.android.gms', version: '24.03.14', type: 'system' },
];

export const ApkManagerTab: React.FC<ApkManagerTabProps> = ({ device, onLogConsole }) => {
  const [packages, setPackages] = useState<ApkPackage[]>(initialPackages);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'system' | 'third-party'>('third-party');
  const [selectedPkg, setSelectedPkg] = useState<ApkPackage | null>(null);
  
  // APK Installation Simulation States
  const [installing, setInstalling] = useState<boolean>(false);
  const [installProgress, setInstallProgress] = useState<number>(0);
  const [installStatusText, setInstallStatusText] = useState<string>('');

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center">
        <AppWindow size={48} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">Package Manager Offline</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Connect an authorized ADB device to query installed packages and deploy application binaries.</p>
      </div>
    );
  }

  if (device.connectionMode === 'fastboot') {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center">
        <AppWindow size={48} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">Package Manager Locked</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Application management is unavailable in Bootloader mode. Boot to system mode to list and manage applications.</p>
      </div>
    );
  }

  // Filter package list
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || pkg.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleUninstall = () => {
    if (!selectedPkg) return;
    const pkgName = selectedPkg.packageName;
    onLogConsole('AdbService', `Executing safe uninstall: adb uninstall "${pkgName}"`);

    setPackages(packages.filter((pkg) => pkg.packageName !== pkgName));
    setSelectedPkg(null);
    onLogConsole('AdbService', `Package "${pkgName}" removed from device user space. Output: Success.`);
  };

  const handleSimulatedApkInstall = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const rawName = file.name.replace('.apk', '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const simulatedPkg = `com.thirdparty.${rawName || 'app'}`;

    setInstalling(true);
    setInstallProgress(10);
    setInstallStatusText('Streaming APK payload to device staging tmp directory...');
    onLogConsole('AdbService', `Uploading APK file: adb install "${file.name}"`);

    // Simulate installer ticks
    setTimeout(() => {
      setInstallProgress(40);
      setInstallStatusText('Verifying package certificates and signing structure...');
    }, 800);

    setTimeout(() => {
      setInstallProgress(80);
      setInstallStatusText('Running package manager installation daemon (pm install)...');
    }, 1600);

    setTimeout(() => {
      setInstallProgress(100);
      setInstallStatusText('Success. Package linked!');

      const newPkg: ApkPackage = {
        packageName: simulatedPkg,
        version: '1.0.0-custom',
        type: 'third-party',
      };

      setPackages((prev) => [newPkg, ...prev]);
      setInstalling(false);
      onLogConsole('AdbService', `Package "${simulatedPkg}" deployed successfully. Execution exit code: 0`);
    }, 2400);
  };

  return (
    <div id="apk-manager-workspace" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Installed Packages List Panel (Left Side - spans 3 cols) */}
      <div id="pkg-list-pane" className="lg:col-span-3 border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4 flex flex-col h-[520px]">
        {/* Filter controls and Search Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          {/* Tabs for filters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800/80 w-fit">
            <button
              id="filter-third-party"
              onClick={() => { setActiveFilter('third-party'); setSelectedPkg(null); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeFilter === 'third-party' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Third-Party Apps
            </button>
            <button
              id="filter-system"
              onClick={() => { setActiveFilter('system'); setSelectedPkg(null); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeFilter === 'system' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              System Packages
            </button>
            <button
              id="filter-all"
              onClick={() => { setActiveFilter('all'); setSelectedPkg(null); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Packages
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input
              id="package-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search package name..."
              className="w-full bg-slate-950 text-slate-100 text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Packages Grid Viewport */}
        <div id="pkg-table-container" className="flex-1 overflow-y-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                <th className="py-2 px-3">Package Namespace</th>
                <th className="py-2 px-3">Version</th>
                <th className="py-2 px-3 text-right">Access Privileges</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-16 text-xs text-slate-500 font-mono">
                    No packages match query criteria.
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => {
                  const isSel = selectedPkg?.packageName === pkg.packageName;
                  return (
                    <tr
                      key={pkg.packageName}
                      onClick={() => setSelectedPkg(pkg)}
                      className={`border-b border-slate-800/40 text-xs transition-colors cursor-pointer hover:bg-slate-800/30 ${
                        isSel ? 'bg-blue-600/10 hover:bg-blue-600/15 border-blue-500/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-medium text-slate-300">
                        {pkg.packageName}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">{pkg.version}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wide ${
                          pkg.type === 'system' 
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' 
                            : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                        }`}>
                          {pkg.type}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APK Installation / Package Actions Sidebar (Right Col) */}
      <div id="pkg-sidebar-pane" className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 flex flex-col justify-between h-[520px]">
        {/* top slot */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2.5">App Deployment</h4>
          
          {/* Sideload APK Zone */}
          <div className="border border-dashed border-slate-800 bg-slate-950/40 hover:border-blue-500/50 rounded-xl p-4 transition-colors relative text-center flex flex-col items-center justify-center">
            {installing ? (
              <div className="space-y-3 w-full py-2">
                <Loader2 className="animate-spin text-blue-500 mx-auto" size={24} />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Installing APK...</span>
                    <span>{installProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${installProgress}%` }} />
                  </div>
                  <p className="text-[9px] text-slate-500 font-mono leading-tight">{installStatusText}</p>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer block py-4 space-y-2 w-full">
                <Upload size={28} className="text-slate-500 mx-auto" />
                <span className="text-xs font-semibold text-slate-300 block">Deploy (Sideload) APK</span>
                <span className="text-[10px] text-slate-500 block">Click to browse or drop APK file here</span>
                <input type="file" accept=".apk" onChange={handleSimulatedApkInstall} className="hidden" />
              </label>
            )}
          </div>

          {/* Selected Package Info */}
          {selectedPkg ? (
            <div className="border border-slate-800/80 bg-slate-950/20 p-4 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5">
                <Smartphone size={16} className="text-blue-500 mt-0.5" />
                <div>
                  <h5 className="text-xs font-semibold text-slate-200 font-mono break-all leading-tight">{selectedPkg.packageName}</h5>
                  <span className="text-[9px] text-slate-500 font-mono mt-1 block uppercase">Version {selectedPkg.version}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 leading-relaxed font-sans">
                {selectedPkg.type === 'system' ? (
                  <span className="text-amber-500 bg-amber-500/5 border border-amber-500/10 rounded p-1.5 block">
                    System applications are flagged as protected. Modification requires system shell privileges (root access).
                  </span>
                ) : (
                  <span>This third-party application package resides in user storage and can be uninstalled safely.</span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              Select a package from the table to run operations.
            </div>
          )}
        </div>

        {/* Bottom Actions Slot */}
        {selectedPkg && (
          <div className="border-t border-slate-800 pt-4">
            <button
              id="uninstall-package-btn"
              onClick={handleUninstall}
              disabled={selectedPkg.type === 'system'}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-950/20 hover:bg-rose-950/40 disabled:opacity-40 disabled:hover:bg-rose-950/20 text-rose-400 border border-rose-900/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              Uninstall Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
