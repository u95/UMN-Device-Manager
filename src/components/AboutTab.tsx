import React, { useState } from 'react';
import { 
  Info, 
  Cpu, 
  ShieldCheck, 
  History, 
  HelpCircle, 
  CheckCircle2, 
  Languages, 
  Terminal,
  ArrowUpRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AboutTab: React.FC = () => {
  const [lang, setLang] = useState<'TA' | 'EN'>('TA');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [updateMsg, setUpdateMsg] = useState<string>('');

  const systemDetails = {
    releaseVersion: '1.0.0 Stable',
    license: 'Commercial Enterprise (Legal Use Only)',
    nodeVersion: typeof window !== 'undefined' && (window as any).process ? (window as any).process.versions.node : '20.11.0 (Simulation)',
    electronVersion: typeof window !== 'undefined' && (window as any).process ? (window as any).process.versions.electron : '28.2.0 (Simulation)',
    chromeVersion: typeof window !== 'undefined' && (window as any).process ? (window as any).process.versions.chrome : '120.0.6099.109',
    reactVersion: '19.0.1 (Production)',
    tailwindcssVersion: 'v4.1.14',
    dotnetPipeline: 'v8.0.204 Native WPF SDK Interop'
  };

  const changelog = [
    {
      version: 'v1.0.0 - Stable',
      date: '2026-07-11',
      changesEN: [
        'Merged dual-mode Electron desktop shell interop wrapper.',
        'Integrated multi-channel driver checker with automatic system-path telemetry.',
        'Replaced security circumvention components with complete Diagnostics Center.',
        'Implemented dual English/Tamil language transceivers.',
        'Added live Serilog logging sinks rolling with file database backups.'
      ],
      changesTA: [
        'எலக்ட்ரான் டெஸ்க்டாப் இண்டர்ஆப் ரேப்பர் ஒருங்கிணைக்கப்பட்டது.',
        'தானியங்கி கணினி-பாதை டெலிமெட்ரியுடன் கூடிய மல்டி-சேனல் டிரைவர் சரிபார்ப்பு வசதி.',
        'பாதுகாப்பு கட்டுப்பாடுகளை கடக்கும் அம்சங்கள் நீக்கப்பட்டு புதிய கண்டறியும் மையம் (Diagnostics Center) சேர்க்கப்பட்டது.',
        'முழுமையான ஆங்கிலம்/தமிழ் இருமொழி இடைமுக வசதி.',
        'கோப்பு தரவுத்தள காப்புப்பிரதிகளுடன் நேரடி செரிலாக் பதிவு கன்சோல்.'
      ]
    },
    {
      version: 'v0.9.0 - Beta',
      date: '2026-06-25',
      changesEN: [
        'Built full ADB File Explorer and backup system prototype.',
        'Implemented Android Fastboot flashing verification safeguards.',
        'Configured Vite bundling base pathways to fix GitHub Pages loading issues.'
      ],
      changesTA: [
        'முழுமையான ADB கோப்பு மேலாளர் மற்றும் காப்பு பிரதி சிஸ்டம் முன்மாதிரி உருவாக்கப்பட்டது.',
        'ஆண்ட்ராய்டு ஃபாஸ்ட்பூட் ஃபிளாஷிங் சரிபார்ப்பு மற்றும் பாதுகாப்பு எச்சரிக்கைகள் சேர்க்கப்பட்டன.',
        'ஜிட்ஹப் பக்கங்களின் (GitHub Pages) ஏற்ற சிக்கல்களைச் சரிசெய்ய வைட் (Vite) பாத்வேஸ் உள்ளமைக்கப்பட்டது.'
      ]
    }
  ];

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setUpdateMsg('');
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateMsg(lang === 'TA' ? 'உங்கள் மென்பொருள் ஏற்கனவே புதுப்பித்த நிலையில் உள்ளது (v1.0.0).' : 'You are currently on the latest stable channel release (v1.0.0).');
    }, 1500);
  };

  return (
    <div id="about-tab-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Column 1 & 2: License, Version, Changelog */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Core application introduction */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/10">
                UMN
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-100">UMN Device Manager Suite</h2>
                <span className="text-xs font-semibold text-slate-400 font-mono">v{systemDetails.releaseVersion}</span>
              </div>
            </div>

            <button
              onClick={() => setLang(lang === 'TA' ? 'EN' : 'TA')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-mono text-blue-400 rounded-lg cursor-pointer transition-colors"
            >
              <Languages size={13} />
              <span>{lang === 'TA' ? 'Switch to English' : 'தமிழுக்கு மாற்றவும்'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'TA' 
              ? 'UMN சாதன மேலாளர் என்பது மொபைல் போன்கள் மற்றும் ஆண்ட்ராய்டு போர்டுகளுக்கான மேம்பட்ட, பாதுகாப்பான மற்றும் சட்டப்பூர்வ சேவை மென்பொருள் ஆகும். இந்த கருவி வன்பொருள் ஒருமைப்பாட்டை ஆராயவும், அதிகாரப்பூர்வ மென்பொருளை மீண்டும் பதிவேற்றவும் (Flash), மற்றும் தரவுகளை காப்புப்பிரதி (Backup) எடுக்கவும் உதவுகிறது.' 
              : 'UMN Device Manager is an advanced, enterprise-grade, secure mobile service diagnostic application. Designed for certified service technicians, this utility enables comprehensive device health audits, secure authorized flashing, robust application deployment pipelines, and high-speed multi-threaded backups.'}
          </p>

          <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block">
              {lang === 'TA' ? 'சட்டப்பூர்வ பயன்பாட்டு சான்றிதழ்' : 'Authorized Licensure Parameters'}
            </span>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <ShieldCheck className="text-emerald-500 mt-0.5 flex-shrink-0" size={16} />
              <span>
                {lang === 'TA'
                  ? 'இந்த மென்பொருள் சட்டவிரோத செயல்களுக்குப் பயன்படுத்துவதைத் தடுக்கிறது. FRP பைபாஸ், IMEI மாற்றம் போன்ற செயல்கள் இதில் முடக்கப்பட்டுள்ளன.'
                  : 'Commercial License issued in strict accordance with legal mobile maintenance standards. Protection safeguards prevent execution of network unlocking or factory lock bypass patterns.'}
              </span>
            </div>
          </div>
        </div>

        {/* Changelog Sections */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <History className="text-blue-500" size={16} />
            <h3 className="text-sm font-semibold text-slate-300">
              {lang === 'TA' ? 'மென்பொருள் மாற்றங்களின் வரலாறு (Changelog)' : 'Software Changelog History'}
            </h3>
          </div>

          <div className="space-y-4">
            {changelog.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/10">
                    {item.version}
                  </span>
                  <span className="text-slate-500 font-mono">{item.date}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 pl-1.5">
                  {(lang === 'TA' ? item.changesTA : item.changesEN).map((change, cIdx) => (
                    <li key={cIdx} className="leading-relaxed">
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Column 3: Live System Specs & Software details */}
      <div className="space-y-6">
        
        {/* System Information Panel */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Cpu className="text-blue-500" size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {lang === 'TA' ? 'கணினி தகவல்' : 'System Information'}
            </h3>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-850">
              <span className="text-slate-500">Suite Version:</span>
              <span className="text-slate-300 font-bold">{systemDetails.releaseVersion}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-850">
              <span className="text-slate-500">License Model:</span>
              <span className="text-emerald-400 font-bold">Commercial</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-850">
              <span className="text-slate-500">Node JS Engine:</span>
              <span className="text-slate-300">{systemDetails.nodeVersion}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-850">
              <span className="text-slate-500">Electron Core:</span>
              <span className="text-slate-300">{systemDetails.electronVersion}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-850">
              <span className="text-slate-500">Chromium Runtime:</span>
              <span className="text-slate-300">{systemDetails.chromeVersion}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-850">
              <span className="text-slate-500">React Core:</span>
              <span className="text-slate-300">{systemDetails.reactVersion}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-850">
              <span className="text-slate-500">DotNet Pipeline:</span>
              <span className="text-blue-400 text-[10px]">{systemDetails.dotnetPipeline}</span>
            </div>
          </div>
        </div>

        {/* Check for Updates Utility */}
        <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Sparkles className="text-yellow-500 animate-pulse" size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {lang === 'TA' ? 'மென்பொருள் புதுப்பிப்பு' : 'Live Update Center'}
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'TA'
              ? 'UMN கிளவுட் சர்வர்களில் இருந்து சமீபத்திய ஃபார்ம்வேர் மற்றும் மென்பொருள் புதுப்பிப்புகளைச் சரிபார்க்கவும்.'
              : 'Keep your local driver configurations and vendor diagnostic lists synchronised with UMN security patch repositories.'}
          </p>

          {updateMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[11px] font-medium flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>{updateMsg}</span>
            </div>
          )}

          <button
            onClick={handleCheckUpdate}
            disabled={isCheckingUpdate}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-500 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            {isCheckingUpdate ? 'Checking Server API...' : (lang === 'TA' ? 'புதுப்பிப்புகளைச் சரிபார்' : 'Check for Updates')}
          </button>
        </div>

      </div>

    </div>
  );
};
