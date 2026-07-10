export interface Device {
  id: string;
  serial: string;
  model: string;
  manufacturer: string;
  androidVersion: string;
  batteryLevel: number;
  batteryStatus: string;
  cpu: string;
  storageTotal: string;
  storageUsed: string;
  rootStatus: string;
  connectionMode: 'adb' | 'fastboot' | 'none';
  status: 'online' | 'unauthorized' | 'recovery' | 'sideload' | 'none';
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: string;
  date: string;
  permissions: string;
}

export interface ApkPackage {
  packageName: string;
  version: string;
  type: 'system' | 'third-party';
}

export interface LogEntry {
  timestamp: string;
  pid: number;
  tid: number;
  level: 'V' | 'D' | 'I' | 'W' | 'E';
  tag: string;
  message: string;
}

export interface ConsoleLog {
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  source: string;
  message: string;
}

export interface CodeFile {
  name: string;
  path: string;
  content: string;
  language: 'csharp' | 'xml' | 'markdown' | 'json';
}

export interface CodeFolder {
  name: string;
  path: string;
  files: CodeFile[];
  subfolders: CodeFolder[];
}
