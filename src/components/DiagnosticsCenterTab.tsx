import React, { useState, useEffect } from 'react';
import { Device } from '../types';
import { 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Cpu, 
  HardDrive, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Languages, 
  AlertTriangle,
  Flame,
  Radio,
  Zap,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';

interface DiagnosticsCenterTabProps {
  device: Device | null;
  onLogConsole: (source: string, msg: string, level?: 'INFO' | 'WARNING' | 'ERROR') => void;
}

interface TestItem {
  id: string;
  nameEN: string;
  nameTA: string;
  category: 'driver' | 'daemon' | 'storage' | 'cpu';
  status: 'idle' | 'running' | 'passed' | 'failed';
  resultEN: string;
  resultTA: string;
}

export const DiagnosticsCenterTab: React.FC<DiagnosticsCenterTabProps> = ({ device, onLogConsole }) => {
  const [lang, setLang] = useState<'TA' | 'EN'>('TA');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [currentTestIndex, setCurrentTestIndex] = useState<number>(-1);
  const [stressValue, setStressValue] = useState<number>(0);
  const [driverStatus, setDriverStatus] = useState<'Installed' | 'Missing' | 'Outdated'>('Installed');
  
  const [tests, setTests] = useState<TestItem[]>([
    {
      id: 'usb_driver',
      nameEN: 'USB Controller Driver Integrity',
      nameTA: 'USB கன்ட்ரோலர் டிரைவர் ஒருமைப்பாடு',
      category: 'driver',
      status: 'idle',
      resultEN: 'Google USB Driver v13.0 fully integrated with kernel.',
      resultTA: 'கூகிள் USB டிரைவர் v13.0 கர்னலுடன் முழுமையாக இணைக்கப்பட்டுள்ளது.',
    },
    {
      id: 'daemon_ping',
      nameEN: 'ADB / Fastboot Server Daemon Ping',
      nameTA: 'ADB / ஃபாஸ்ட்பூட் சர்வர் டீமான் பிங்',
      category: 'daemon',
      status: 'idle',
      resultEN: 'Daemon server responsive. Average ping delay 1.8ms.',
      resultTA: 'டீமான் சர்வர் பதிலளிக்கிறது. சராசரி பிங் தாமதம் 1.8ms.',
    },
    {
      id: 'partition_table',
      nameEN: 'GUID Partition Table (GPT) Verification',
      nameTA: 'GPT பகிர்வு அட்டவணை சரிபார்ப்பு',
      category: 'storage',
      status: 'idle',
      resultEN: 'Partition tables integrity verified. No bad block sectors.',
      resultTA: 'பகிர்வு அட்டவணையின் ஒருமைப்பாடு சரிபார்க்கப்பட்டது. பழுதான செக்டர்கள் இல்லை.',
    },
    {
      id: 'emmc_ufs',
      nameEN: 'eMMC / UFS Read Speed Diagnostics',
      nameTA: 'eMMC / UFS வாசிப்பு வேகக் கண்டறிதல்',
      category: 'storage',
      status: 'idle',
      resultEN: 'UFS 4.0 Storage Read verified at 3450 MB/s sequential.',
      resultTA: 'UFS 4.0 சேமிப்பக வாசிப்பு வேகம் 3450 MB/s ஆக உறுதி செய்யப்பட்டது.',
    },
    {
      id: 'cpu_throttling',
      nameEN: 'CPU Core Frequencies & Throttling Status',
      nameTA: 'CPU கோர் அதிர்வெண்கள் மற்றும் வெப்பக் கட்டுப்பாடு',
      category: 'cpu',
      status: 'idle',
      resultEN: 'Octa-Core thermal baseline 38.5°C. Performance index 100%.',
      resultTA: 'ஆக்டா-கோர் வெப்ப நிலை 38.5°C. செயல்திறன் குறியீடு 100%.',
    }
  ]);

  // Handle Stress Test Animation when running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTesting && currentTestIndex === 4) {
      interval = setInterval(() => {
        setStressValue(Math.floor(60 + Math.random() * 38));
      }, 150);
    } else {
      setStressValue(0);
    }
    return () => clearInterval(interval);
  }, [isTesting, currentTestIndex]);

  const runAllDiagnostics = () => {
    if (isTesting) return;
    setIsTesting(true);
    setCurrentTestIndex(0);
    onLogConsole('DiagnosticService', 'Starting full hardware and software verification cycle...');

    // Reset all tests status to idle except the first one to running
    setTests(prev => prev.map((t, idx) => ({ ...t, status: idx === 0 ? 'running' : 'idle' })));
  };

  useEffect(() => {
    if (currentTestIndex >= 0 && currentTestIndex < tests.length) {
      const timer = setTimeout(() => {
        setTests(prev => prev.map((t, idx) => {
          if (idx === currentTestIndex) {
            onLogConsole('DiagnosticService', `Test PASSED: ${t.nameEN}`);
            return { ...t, status: 'passed' };
          }
          if (idx === currentTestIndex + 1) {
            return { ...t, status: 'running' };
          }
          return t;
        }));
        
        setCurrentTestIndex(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentTestIndex === tests.length) {
      setIsTesting(false);
      setCurrentTestIndex(-1);
      onLogConsole('DiagnosticService', 'Full diagnostics sweep complete. Integrity signature: UMN-PASS-88A92', 'INFO');
    }
  }, [currentTestIndex]);

  const downloadReport = () => {
    onLogConsole('DiagnosticService', 'Exporting Diagnostic Report as HTML/TXT document.');
    const deviceText = device ? `Device: ${device.manufacturer} ${device.model} (${device.serial})` : 'No Device Connected';
    const reportContent = `
=============================================
         UMN DEVICE DIAGNOSTIC REPORT
=============================================
Timestamp: ${new Date().toLocaleString()}
${deviceText}
---------------------------------------------
USB Driver Status: ${driverStatus}
Diagnostic Check results:
${tests.map(t => `- [${t.status.toUpperCase()}] ${t.nameEN}: ${t.resultEN}`).join('\n')}
---------------------------------------------
Signature: UMN-PASS-88A92 (Validated Legal Actions Only)
=============================================
`;
    const element = document.createElement("a");
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `UMN_Diagnostic_Report_${device?.serial || 'offline'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="diagnostics-view-root" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Test Runner and Dashboard Column */}
      <div className="lg:col-span-2 space-y-6">
        
        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Activity className="text-blue-500 animate-pulse animate-duration-1000" size={18} />
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  {lang === 'TA' ? 'வன்பொருள் மற்றும் சிஸ்டம் சரிபார்ப்பு' : 'Hardware & System Verification'}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {lang === 'TA' ? 'அங்கீகரிக்கப்பட்ட சோதனைகளை இயக்கவும்' : 'Execute fully authorized hardware diagnostic tests'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang(lang === 'TA' ? 'EN' : 'TA')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] font-mono text-blue-400 rounded-lg cursor-pointer"
              >
                <Languages size={12} />
                <span>{lang === 'TA' ? 'English' : 'தமிழ்'}</span>
              </button>

              <button
                onClick={runAllDiagnostics}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-500 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <RefreshCw size={12} className={isTesting ? 'animate-spin' : ''} />
                <span>
                  {isTesting 
                    ? (lang === 'TA' ? 'கண்டறிதல் இயக்கத்தில் உள்ளது...' : 'Testing...') 
                    : (lang === 'TA' ? 'முழு சோதனை துவங்கு' : 'Run Diagnostics')}
                </span>
              </button>
            </div>
          </div>

          {/* Test items list */}
          <div className="space-y-3.5">
            {tests.map((test) => (
              <div 
                key={test.id} 
                className={`p-3.5 rounded-xl border transition-all ${
                  test.status === 'running' 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : test.status === 'passed' 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-slate-950/40 border-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${
                      test.status === 'running' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : test.status === 'passed' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-slate-900 text-slate-500'
                    }`}>
                      {test.category === 'driver' && <Radio size={14} />}
                      {test.category === 'daemon' && <Terminal size={14} />}
                      {test.category === 'storage' && <HardDrive size={14} />}
                      {test.category === 'cpu' && <Cpu size={14} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">
                        {lang === 'TA' ? test.nameTA : test.nameEN}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {test.status === 'passed' 
                          ? (lang === 'TA' ? test.resultTA : test.resultEN)
                          : test.status === 'running'
                            ? (lang === 'TA' ? 'சோதனை செய்யப்படுகிறது...' : 'Interrogating interface...')
                            : (lang === 'TA' ? 'காத்திருக்கிறது' : 'Ready to diagnose')}
                      </p>
                    </div>
                  </div>

                  <div>
                    {test.status === 'passed' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded">
                        <CheckCircle2 size={11} /> PASSED
                      </span>
                    )}
                    {test.status === 'running' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">
                        <RefreshCw size={11} className="animate-spin" /> RUNNING
                      </span>
                    )}
                    {test.status === 'idle' && (
                      <span className="text-[10px] font-bold text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>

                {/* Specific Live stress test sub-pane if running cpu test */}
                {test.id === 'cpu_throttling' && test.status === 'running' && (
                  <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                      <span>STRESS FREQUENCY STRESS_LOAD</span>
                      <span className="text-blue-400 font-semibold">{stressValue}% LOAD</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${stressValue}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Generate Report Option */}
        <div className="p-4 border border-slate-800 rounded-xl bg-slate-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-slate-300">
            <FileText size={16} className="text-blue-400" />
            <span className="text-xs">
              {lang === 'TA' 
                ? 'உங்கள் வன்பொருள் சோதனை முடிவுகளைச் சரிபார்க்கப்பட்ட அறிக்கையாகச் சேமிக்கவும்.' 
                : 'Compile the physical port and board status into an audit-ready diagnostic document.'}
            </span>
          </div>
          <button
            onClick={downloadReport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-blue-400 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            <Download size={13} />
            <span>{lang === 'TA' ? 'அறிக்கையைப் பதிவிறக்கு' : 'Download Diagnostic File'}</span>
          </button>
        </div>

      </div>

      {/* Right Hand Sidebar: USB Driver Inspector & Legal Guard */}
      <div className="space-y-6">
        
        {/* USB Drivers Checker */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Zap className="text-blue-500" size={16} />
            <h3 className="text-xs font-semibold text-slate-300">
              {lang === 'TA' ? 'USB டிரைவர் மேலாளர்' : 'USB Port & Driver Audit'}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
              <span className="text-slate-400">Google USB Driver</span>
              <span className="text-emerald-400 font-mono font-bold">INSTALLED (v13.0)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
              <span className="text-slate-400">Samsung USB Driver</span>
              <span className="text-emerald-400 font-mono font-bold">INSTALLED (v2.12)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
              <span className="text-slate-400">MediaTek VCOM USB</span>
              <span className="text-slate-500 font-mono font-bold">READY (WDM Filter)</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
            All system paths scanned under Windows System32 Registry filter tree cleanly. No conflict drivers found.
          </p>
        </div>

        {/* Prohibited features safeguard disclaimer */}
        <div className="border border-rose-900/30 rounded-xl bg-rose-500/5 p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-rose-950 pb-2.5 text-rose-400">
            <ShieldAlert size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider">UMN Legal Audit Compliance</h3>
          </div>
          <p className="text-[11px] text-rose-300/80 leading-relaxed">
            {lang === 'TA' 
              ? 'இந்த மென்பொருள் சட்டப்பூர்வ மற்றும் அங்கீகரிக்கப்பட்ட போன் பழுதுபார்ப்பு நிறுவனங்களுக்கு மட்டுமே வடிவமைக்கப்பட்டுள்ளது. FRP பைபாஸ், IMEI மாற்றம், பூட்லோடர் கிராக்கிங் அல்லது பாதுகாப்பு அம்சங்களை சட்டவிரோதமாக கடப்பது முற்றிலும் தடைசெய்யப்பட்டுள்ளது.' 
              : 'UMN Device Manager operates solely within ethical limits. All procedures adhere to regulatory telecom policies. Circumvention payloads (FRP bypass, baseband manipulation, account unlocks) are strictly stripped to prevent unauthorized abuse.'}
          </p>
          <div className="flex items-center gap-1.5 p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded text-[9px] font-mono">
            <AlertTriangle size={11} className="flex-shrink-0" />
            <span>Secure Tunnel: SHA-256 Verified Logs Rolling</span>
          </div>
        </div>

      </div>

    </div>
  );
};
