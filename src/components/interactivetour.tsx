import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Sparkles, 
  Languages, 
  BookOpen, 
  Smartphone, 
  FolderOpen, 
  AppWindow, 
  Database, 
  Terminal, 
  Flame, 
  FileCode, 
  Settings,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

interface InteractiveTourProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSimKey: string;
  onDeviceSimChange: (key: string) => void;
  onLogConsole: (source: string, msg: string, level?: 'INFO' | 'WARNING' | 'ERROR') => void;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  activeTab,
  setActiveTab,
  selectedSimKey,
  onDeviceSimChange,
  onLogConsole
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<'TA' | 'EN'>('TA'); // Default to Tamil as requested
  const [currentStep, setCurrentStep] = useState<number>(0);

  const tourSteps = [
    {
      titleEN: 'Welcome to UMN Device Manager!',
      titleTA: 'UMN சாதன மேலாளருக்கு அன்புடன் வரவேற்கிறோம்!',
      descEN: 'This suite is a simulated professional Android diagnostics and recovery utility. It is fully backed by real C# 12 and .NET 8 codebase. Let’s explore how to use each feature!',
      descTA: 'இந்த மென்பொருள் ஆண்ட்ராய்டு சாதனங்களைக் கண்டறிந்து சரிசெய்யும் ஒரு மாதிரி கருவியாகும். இது C# 12 மற்றும் .NET 8 தொழில்நுட்பத்தில் உருவாக்கப்பட்டுள்ளது. இதன் ஒவ்வொரு அம்சத்தையும் நாம் கற்றுக்கொள்வோம்!',
      tab: 'dashboard',
      actionTextEN: 'Start Tour',
      actionTextTA: 'டூர் தொடங்கவும்',
      icon: Sparkles,
      tipEN: 'Use the language switch button on top to switch between Tamil and English anytime!',
      tipTA: 'தமிழ் மற்றும் ஆங்கில மொழிக்கு மாற மேலே உள்ள மொழி பொத்தானைப் பயன்படுத்தவும்!'
    },
    {
      titleEN: 'Step 1: Simulating USB Connection',
      titleTA: 'படி 1: USB இணைப்பை உருவகப்படுத்துதல்',
      descEN: 'Look at the sidebar. You can simulate connecting different Android devices (like Google Pixel 8, Samsung Galaxy S24, or Xiaomi Redmi) using the "Simulated USB Port" selector. Try selecting Samsung Galaxy S24 to trigger authorization prompt!',
      descTA: 'பக்கவாட்டு மெனுவை (Sidebar) கவனிக்கவும். "Simulated USB Port" மூலம் கூகுள் பிக்சல் 8, சாம்சங் S24 அல்லது ரெட்மி போன்ற வெவ்வேறு சாதனங்களை இணைத்து பார்க்க முடியும். சாம்சங் S24-ஐ தேர்ந்தெடுத்து அங்கீகார அறிவிப்பைப் பாருங்கள்!',
      tab: 'dashboard',
      actionTextEN: 'Simulate S24 Connection',
      actionTextTA: 'சாம்சங் S24 இணைப்பை இயக்குக',
      icon: Smartphone,
      action: () => {
        onDeviceSimChange('s24');
        onLogConsole('TourGuide', 'Simulated switching to Samsung Galaxy S24 Ultra.');
      },
      tipEN: 'Devices behave differently depending on authorization states.',
      tipTA: 'சாதனங்களின் அங்கீகார நிலையைப் பொறுத்து அவற்றின் செயல்பாடுகள் மாறுபடும்.'
    },
    {
      titleEN: 'Step 2: Diagnostics & Reboots',
      titleTA: 'படி 2: கண்டறிதல் மற்றும் மறுதொடக்கம்',
      descEN: 'In the Device Dashboard, you can see real-time hardware specs like Battery %, storage partitions, CPU speed, and locked/unlocked state. You can also trigger reboots to System, Recovery or Bootloader (Fastboot) mode.',
      descTA: 'சாதன டாஷ்போர்டில் (Device Dashboard) பேட்டரி அளவு, சேமிப்பகம் (Storage), CPU வேகம் மற்றும் பூட்டப்பட்ட/திறக்கப்பட்ட நிலையை அறியலாம். மேலும் சிஸ்டம், ரிகவரி அல்லது ஃபாஸ்ட்பூட் பயன்முறையில் சாதனத்தை ரீபூட் செய்யலாம்.',
      tab: 'dashboard',
      actionTextEN: 'View Dashboard Specs',
      actionTextTA: 'டாஷ்போர்டை காண்க',
      icon: Smartphone,
      tipEN: 'Rebooting into bootloader automatically connects Fastboot mode!',
      tipTA: 'பூட்லோடரில் ரீபூட் செய்யும்போது தானாகவே ஃபாஸ்ட்பூட் பயன்முறைக்கு மாறிவிடும்!'
    },
    {
      titleEN: 'Step 3: Android File Explorer',
      titleTA: 'படி 3: கோப்பு மேலாளர் (File Explorer)',
      descEN: 'Go to the File Explorer tab. You can navigate internal folders like Camera (DCIM), Pictures, and Downloads. You can perform diagnostics, download files, and upload custom scripts to test disk status.',
      descTA: 'File Explorer பகுதிக்குச் செல்லவும். கேமரா (DCIM), படங்கள் (Pictures), மற்றும் பதிவிறக்கங்கள் (Downloads) போன்ற கோப்புறைகளைக் கண்டறியலாம். கோப்புகளை டவுன்லோட் செய்யவோ அல்லது புதிய கோப்பை பதிவேற்றவோ முடியும்.',
      tab: 'files',
      actionTextEN: 'Explore Directories',
      actionTextTA: 'கோப்புகளைப் பார்க்கவும்',
      icon: FolderOpen,
      tipEN: 'Click on folders to browse directories dynamically.',
      tipTA: 'கோப்புறைகளை கிளிக் செய்து எளிதாக உள்ளே இருக்கும் விபரங்களை பார்க்கலாம்.'
    },
    {
      titleEN: 'Step 4: APK App Manager',
      titleTA: 'படி 4: ஏபிகே ஆப் மேலாளர் (APK Manager)',
      descEN: 'Under APK Manager, you see list of user apps and system packages. You can drag and drop custom APK files to simulate app installation, or search packages by typing names.',
      descTA: 'APK Manager பக்கத்தில் உங்கள் மொபைலில் உள்ள செயலிகளின் பட்டியலை அறியலாம். புதிய ஏபிகே கோப்புகளை இழுத்துப் போடுவதன் (Drag & Drop) மூலம் எளிதாக செயலிகளை நிறுவலாம்.',
      tab: 'apps',
      actionTextEN: 'Go to APK Manager',
      actionTextTA: 'ஏபிகே பக்கத்திற்கு செல்க',
      icon: AppWindow,
      tipEN: 'Try installing a simulated custom app like WhatsApp or Chrome.',
      tipTA: 'வாட்ஸ்அப் அல்லது குரோம் போன்ற செயலிகளை நிறுவிப் பாருங்கள்.'
    },
    {
      titleEN: 'Step 5: Data Backup & Restore',
      titleTA: 'படி 5: காப்புப்பிரதி & மீட்பு (Backup & Restore)',
      descEN: 'Protect your device data! Here you can create a secure system backup (.ab bundle) of your contacts, messages, and photo library, or restore existing backup archives securely.',
      descTA: 'உங்கள் தகவல்களைப் பாதுகாத்திடுங்கள்! இங்கே தொடர்புகள், குறுஞ்செய்திகள் மற்றும் புகைப்படங்களை பாதுகாப்பான காப்புப்பிரதி (.ab கோப்பு) எடுக்கலாம் அல்லது முன்பு எடுத்த கோப்பை மீண்டும் பெறலாம்.',
      tab: 'backup',
      actionTextEN: 'View Backup Manager',
      actionTextTA: 'காப்புப்பிரதி பக்கம் செல்க',
      icon: Database,
      tipEN: 'Always keep diagnostic backups before flashing custom ROMs!',
      tipTA: 'விருப்ப ரோம்களை நிறுவும் முன் எப்போதும் காப்புப்பிரதி எடுத்து வைக்கவும்!'
    },
    {
      titleEN: 'Step 6: Real-Time Logcat Viewer',
      titleTA: 'படி 6: ரியல்-டைம் லாக்புக் (Logcat)',
      descEN: 'Logcat displays running background event logs streaming from the Android OS. You can filter logs by level (Verbose, Debug, Info, Warn, Error) or pause the stream to inspect system stack traces.',
      descTA: 'ஆண்ட்ராய்டு சாதனத்தின் பின்னணியில் இயங்கும் நிகழ்வுகளின் பதிவுகளை Logcat காட்டும். முக்கியத்துவத்தின் அடிப்படையில் வடிகட்டலாம் (Filter) அல்லது தற்காலிகமாக நிறுத்தி ஆராயலாம்.',
      tab: 'logcat',
      actionTextEN: 'View Live Logcat',
      actionTextTA: 'லாக் விபரங்களை காண்க',
      icon: Terminal,
      tipEN: 'Useful for debugging app crashes or connection issues.',
      tipTA: 'செயலிகள் செயலிழக்கும்போது அல்லது பிழைகளை கண்டறிய இது உதவும்.'
    },
    {
      titleEN: 'Step 7: Fastboot ROM Flasher',
      titleTA: 'படி 7: ஃபாஸ்ட்பூட் ரோம் ஃபிளாஷர்',
      descEN: 'If a device is connected in Fastboot/Bootloader mode (like Xiaomi Redmi in our menu), you can flash custom Recovery partitions, flash system ROMs, and safely unlock/lock bootloaders with authorized operations.',
      descTA: 'சாதனம் ஃபாஸ்ட்பூட் பயன்முறையில் இருக்கும்போது (நமது மெனுவில் Xiaomi Redmi போன்றது), கஸ்டம் ரிகவரி, சிஸ்டம் ரோம் மற்றும் பூட்லோடர் பூட்டைத் திறக்க/பூட்ட முடியும்.',
      tab: 'fastboot',
      actionTextEN: 'Explore Fastboot Tools',
      actionTextTA: 'ஃபாஸ்ட்பூட் கருவிகள்',
      icon: Flame,
      tipEN: 'Bootloader unlocking wipes all user data for physical security!',
      tipTA: 'சாதன பாதுகாப்பிற்காக பூட்லோடர் பூட்டை உடைக்கும்போது அனைத்து தகவல்களும் அழியும்!'
    },
    {
      titleEN: 'Step 8: C# Code Solution Explorer',
      titleTA: 'படி 8: C# நிரல் குறியீடு பார்வை',
      descEN: 'This is the most incredible educational feature! UMN Device Manager is fully functional in C# .NET. You can explore the actual Visual Studio 2022 Solution structure, view source code, and download the entire solution as a .ZIP archive!',
      descTA: 'இது மிகவும் அருமையான கல்வி சார்ந்த அம்சம்! இந்த மென்பொருளின் பின்னணியில் இயங்கும் முழுமையான C# .NET Visual Studio 2022 குறியீட்டை நீங்கள் பார்த்து தெரிந்து கொள்ளலாம், மேலும் .ZIP கோப்பாக பதிவிறக்கவும் செய்யலாம்!',
      tab: 'explorer',
      actionTextEN: 'Open C# Code Explorer',
      actionTextTA: 'C# குறியீட்டைப் பார்க்கவும்',
      icon: FileCode,
      tipEN: 'Click "Export Solution (.ZIP)" to download code to your computer!',
      tipTA: '"Export Solution (.ZIP)" ஐ கிளிக் செய்து குறியீட்டை உங்கள் கணினியில் சேமிக்கவும்!'
    },
    {
      titleEN: 'Tour Complete! Ready to Roll',
      titleTA: 'வழிகாட்டி டூர் நிறைவடைந்தது!',
      descEN: 'You are now ready to explore UMN Device Manager like a pro. Keep an eye on the Serilog Output Logs Console at the bottom to see live diagnostics of everything you do.',
      descTA: 'இப்போது நீங்கள் UMN சாதன மேலாளரை மிக எளிதாகப் பயன்படுத்தலாம். நீங்கள் செய்யும் ஒவ்வொரு செயலுக்கும் கீழே உள்ள Serilog அவுட்புட் விண்டோவில் லைவ் லாக் பதிவாகுவதை கவனித்து மகிழுங்கள்.',
      tab: 'dashboard',
      actionTextEN: 'Finish & Close',
      actionTextTA: 'முடிக்கவும்',
      icon: CheckCircle,
      tipEN: 'UMN adheres to legal and ethical operational standards on all mobile board devices.',
      tipTA: 'அனைத்து மொபைல் சாதனங்களிலும் UMN சட்டபூர்வமான மற்றும் முறையான செயல்பாடுகளை மட்டுமே செய்யும்.'
    }
  ];

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep < tourSteps.length) {
      setCurrentStep(nextStep);
      const stepObj = tourSteps[nextStep];
      setActiveTab(stepObj.tab);
      if (stepObj.action) {
        stepObj.action();
      }
    } else {
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= 0) {
      setCurrentStep(prevStep);
      const stepObj = tourSteps[prevStep];
      setActiveTab(stepObj.tab);
    }
  };

  const handleStartTour = () => {
    setIsOpen(true);
    setCurrentStep(0);
    setActiveTab(tourSteps[0].tab);
    onLogConsole('TourGuide', 'User launched interactive tutorial demo tour.');
  };

  const activeStepObj = tourSteps[currentStep];
  const StepIcon = activeStepObj.icon;

  return (
    <>
      {/* Tour Trigger Button in Header/Sidebar */}
      <button
        id="tour-trigger-banner-btn"
        onClick={handleStartTour}
        className="flex items-center justify-between w-full px-3.5 py-2.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/35 hover:to-indigo-600/35 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md"
      >
        <div className="flex items-center gap-2">
          <HelpCircle size={15} className="text-blue-400 animate-pulse" />
          <div className="text-left">
            <span className="block text-[11px] font-bold text-slate-100">
              {lang === 'TA' ? 'பயன்பாட்டு கையேடு டூர்' : 'Interactive Demo Tour'}
            </span>
            <span className="block text-[9px] text-blue-400 font-normal">
              {lang === 'TA' ? 'எப்படி பயன்படுத்துவது என அறிக' : 'Learn how to use easily'}
            </span>
          </div>
        </div>
        <ChevronRight size={14} className="text-blue-400" />
      </button>

      {/* Backdrop Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              id="interactive-tour-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Corner ambient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-400 animate-spin-slow" />
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-400">
                    {lang === 'TA' ? 'மென்பொருள் நேரடி விளக்கம்' : 'Guided App Demo Tour'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language Selector */}
                  <button
                    id="tour-lang-switch-btn"
                    onClick={() => setLang(lang === 'TA' ? 'EN' : 'TA')}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-[10px] font-mono cursor-pointer transition-all"
                  >
                    <Languages size={11} className="text-blue-400" />
                    <span>{lang === 'TA' ? 'English' : 'தமிழ்'}</span>
                  </button>

                  {/* Close button */}
                  <button
                    id="tour-close-btn"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Step indicator progress bar */}
              <div className="w-full bg-slate-950 h-1.5 rounded-full mb-5 overflow-hidden border border-slate-850">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>

              {/* Step Content */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl flex-shrink-0">
                    <StepIcon size={24} className="animate-pulse" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base font-extrabold text-slate-100 leading-tight">
                      {lang === 'TA' ? activeStepObj.titleTA : activeStepObj.titleEN}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      {lang === 'TA' ? `படி ${currentStep + 1} இல் ${tourSteps.length}` : `Step ${currentStep + 1} of ${tourSteps.length}`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 border border-slate-850 rounded-xl font-medium">
                  {lang === 'TA' ? activeStepObj.descTA : activeStepObj.descEN}
                </p>

                {/* Live suggestion tip box */}
                <div className="flex items-start gap-2 p-3 bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 rounded-xl text-[11px] leading-relaxed">
                  <Lightbulb size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-indigo-200 block mb-0.5">
                      {lang === 'TA' ? 'பயனுள்ள குறிப்பு:' : 'Quick Tip:'}
                    </span>
                    <span>
                      {lang === 'TA' ? activeStepObj.tipTA : activeStepObj.tipEN}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Navigation Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-850">
                <button
                  id="tour-prev-btn"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 px-3.5 py-2 bg-slate-950 border border-slate-800 disabled:opacity-30 hover:bg-slate-850 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span>{lang === 'TA' ? 'முந்தைய' : 'Back'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {/* Skip option */}
                  {currentStep < tourSteps.length - 1 && (
                    <button
                      id="tour-skip-btn"
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-2 text-slate-500 hover:text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      {lang === 'TA' ? 'தவிர்க்க' : 'Skip'}
                    </button>
                  )}

                  <button
                    id="tour-next-btn"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-4.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-blue-500/10"
                  >
                    <span>
                      {currentStep === tourSteps.length - 1 
                        ? (lang === 'TA' ? 'முடிக்கவும்' : 'Finish') 
                        : (lang === 'TA' ? activeStepObj.actionTextTA : activeStepObj.actionTextEN)
                      }
                    </span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
