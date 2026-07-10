import React, { useState, useEffect, useRef } from 'react';
import { Device, LogEntry } from '../types';
import { Terminal, Play, Pause, Trash2, Search, Filter, Loader2 } from 'lucide-react';

interface LogcatViewerTabProps {
  device: Device | null;
}

const mockLogcatLines: Omit<LogEntry, 'timestamp'>[] = [
  { pid: 1210, tid: 1210, level: 'I', tag: 'ActivityManager', message: 'Start proc 28014:com.whatsapp/u0a112 for service com.whatsapp/.messaging.MessageService' },
  { pid: 512, tid: 580, level: 'D', tag: 'BatteryService', message: 'update battery properties: level=84 temp=31.2 voltage=4012 status=3' },
  { pid: 1422, tid: 1440, level: 'W', tag: 'SQLiteConnectionPool', message: 'The connection pool for database +/data/user/0/com.spotify.music/databases/spotify.db has been closed.' },
  { pid: 852, tid: 852, level: 'V', tag: 'WindowManager', message: 'Positioning window: Window{7e91122 u0 com.whatsapp/com.whatsapp.HomeActivity}' },
  { pid: 320, tid: 350, level: 'E', tag: 'AndroidRuntime', message: 'FATAL EXCEPTION: main Process: com.thirdparty.testapp, PID: 32410 java.lang.NullPointerException: Attempt to invoke virtual method on a null object reference' },
  { pid: 1210, tid: 1240, level: 'I', tag: 'ActivityManager', message: 'Displayed com.instagram.android/.activity.MainTabActivity: +250ms' },
  { pid: 480, tid: 480, level: 'I', tag: 'PowerManagerService', message: 'Going to sleep due to power button (uid 1000)...' },
  { pid: 512, tid: 512, level: 'D', tag: 'DeviceStateProvider', message: 'Reporting device state: 1 (NORMAL_DISPLAY_ON)' },
  { pid: 1422, tid: 1445, level: 'V', tag: 'AudioTrack', message: 'Audio stream starting... Sample rate: 44100Hz, Channel mask: 0x3, Format: 1' },
  { pid: 1012, tid: 1012, level: 'W', tag: 'PackageManager', message: 'Failure requesting verification for package com.thirdparty.unknown source (sign matches root)' },
];

export const LogcatViewerTab: React.FC<LogcatViewerTabProps> = ({ device }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tagQuery, setTagQuery] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<'V' | 'D' | 'I' | 'W' | 'E'>('V');

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Initialize with some seed logs
  useEffect(() => {
    if (!device || device.connectionMode === 'fastboot') return;
    const now = new Date();
    const seedLogs: LogEntry[] = Array.from({ length: 25 }).map((_, i) => {
      const line = mockLogcatLines[i % mockLogcatLines.length];
      const timeStr = new Date(now.getTime() - (25 - i) * 1000).toISOString().slice(11, 23);
      return {
        ...line,
        timestamp: timeStr,
      };
    });
    setLogs(seedLogs);
  }, [device]);

  // Handle continuous real-time streaming
  useEffect(() => {
    if (!isStreaming || !device || device.connectionMode === 'fastboot') return;

    const interval = setInterval(() => {
      const randLine = mockLogcatLines[Math.floor(Math.random() * mockLogcatLines.length)];
      const timeStr = new Date().toISOString().slice(11, 23);
      
      const newLog: LogEntry = {
        ...randLine,
        timestamp: timeStr,
        // Make the crash logs happen rarely
        level: randLine.level === 'E' && Math.random() > 0.15 ? 'I' : randLine.level,
        message: randLine.level === 'E' && Math.random() > 0.15 ? 'Surface drawing complete' : randLine.message,
      };

      setLogs((prev) => {
        const list = [...prev, newLog];
        // Keep last 150 lines to prevent memory lag
        return list.slice(-150);
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isStreaming, device]);

  // Auto scroll to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center">
        <Terminal size={48} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">Logcat Viewer Inactive</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Connect an authorized ADB device to interface with Android standard logging streams.</p>
      </div>
    );
  }

  if (device.connectionMode === 'fastboot') {
    return (
      <div className="flex flex-col items-center justify-center h-80 border border-slate-800 rounded-xl bg-slate-900/50 p-6 text-center">
        <Terminal size={48} className="text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">Logcat Viewer Locked</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Direct system logs are unavailable in Fastboot/Bootloader mode. Boots to system are required to open Logcat pipes.</p>
      </div>
    );
  }

  // Map levels for priorities
  const levelPriority = { 'V': 1, 'D': 2, 'I': 3, 'W': 4, 'E': 5 };

  // Filter lists
  const filteredLogs = logs.filter((log) => {
    const matchesQuery = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = tagQuery === '' || log.tag.toLowerCase().includes(tagQuery.toLowerCase());
    const matchesLevel = levelPriority[log.level] >= levelPriority[levelFilter];
    return matchesQuery && matchesTag && matchesLevel;
  });

  const getLevelColor = (level: 'V' | 'D' | 'I' | 'W' | 'E') => {
    switch (level) {
      case 'E': return 'text-rose-500 font-bold bg-rose-500/10 px-1 rounded';
      case 'W': return 'text-amber-500 font-semibold bg-amber-500/10 px-1 rounded';
      case 'I': return 'text-sky-400';
      case 'D': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div id="logcat-viewer-container" className="border border-slate-800 rounded-xl bg-slate-900/30 p-5 space-y-4 flex flex-col h-[520px]">
      {/* Search and control filter header */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        
        {/* Play-Pause controls */}
        <div className="flex items-center gap-2">
          <button
            id="logcat-stream-toggle"
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isStreaming ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/20' : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/20'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause size={13} />
                Pause Stream
              </>
            ) : (
              <>
                <Play size={13} />
                Resume Logcat
              </>
            )}
          </button>
          
          <button
            id="clear-logs-btn"
            onClick={() => setLogs([])}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            Wipe View
          </button>
        </div>

        {/* Level, search queries */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 xl:justify-end">
          
          {/* Level Filter select */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['V', 'D', 'I', 'W', 'E'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`w-7 h-7 text-xs font-mono rounded font-bold transition-colors cursor-pointer ${
                  levelFilter === lvl ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                title={`Level ${lvl}`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search text filter */}
          <div className="relative sm:max-w-[180px] flex-1">
            <Search className="absolute left-2.5 top-2.5 text-slate-500" size={13} />
            <input
              id="log-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search msg..."
              className="w-full bg-slate-950 text-slate-200 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>

          {/* Search tag filter */}
          <div className="relative sm:max-w-[130px] flex-1">
            <Filter className="absolute left-2.5 top-2.5 text-slate-500" size={12} />
            <input
              id="log-tag-input"
              type="text"
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
              placeholder="Filter Tag..."
              className="w-full bg-slate-950 text-slate-200 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-800 focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>

        </div>

      </div>

      {/* Terminal View */}
      <div id="logcat-terminal" className="flex-1 bg-slate-950 rounded-xl border border-slate-850 p-4 font-mono text-[10.5px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs">
            {isStreaming ? (
              <div className="flex items-center gap-1.5">
                <Loader2 className="animate-spin text-slate-600" size={13} />
                Awaiting device system events logcat stream...
              </div>
            ) : 'No logs caught matching filter.'}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 text-slate-300 leading-normal hover:bg-slate-900/40 p-0.5 rounded transition-colors whitespace-pre-wrap break-all">
              <span className="text-slate-500 select-none flex-shrink-0">{log.timestamp}</span>
              <span className="text-slate-600 select-none flex-shrink-0 text-[9px] font-medium">{log.pid}:{log.tid}</span>
              <span className={`select-none flex-shrink-0 text-center font-bold font-mono w-4 ${getLevelColor(log.level)}`}>
                {log.level}
              </span>
              <span className="text-blue-400 font-semibold flex-shrink-0 break-words max-w-[150px]">{log.tag}:</span>
              <span className="flex-1 break-all text-slate-300">{log.message}</span>
            </div>
          ))
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
};
