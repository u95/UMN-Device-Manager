import React, { useState } from 'react';
import { csharpFiles } from '../data/csharpCodebase';
import { CodeFile } from '../types';
import { Folder, File, Download, ChevronRight, ChevronDown, CheckCircle2, Clipboard, FileText, Settings, Loader2 } from 'lucide-react';
import JSZip from 'jszip';

export const SolutionExplorerTab: React.FC = () => {
  const [activeFile, setActiveFile] = useState<CodeFile>(csharpFiles.find(f => f.name.endsWith('.sln')) || csharpFiles[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  // Simple hardcoded expanded folder nodes state for visual convenience
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({
    'UMN.DeviceManager.Core': true,
    'UMN.DeviceManager.Core/Models': true,
    'UMN.DeviceManager.Core/Interfaces': true,
    'UMN.DeviceManager.Services': true,
    'UMN.DeviceManager.Services/Adb': true,
    'UMN.DeviceManager.Services/Fastboot': true,
    'UMN.DeviceManager.UI': true,
    'UMN.DeviceManager.UI/ViewModels': true,
    'UMN.DeviceManager.UI/Styles': true,
    'UMN.DeviceManager.Tests': true,
  });

  const toggleNode = (node: string) => {
    setExpandedNodes(prev => ({ ...prev, [node]: !prev[node] }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportZip = async () => {
    if (exporting) return;
    setExporting(true);

    try {
      const zip = new JSZip();

      // Add all C# codebase files to the ZIP package with their exact subfolder structure
      csharpFiles.forEach((file) => {
        // Normalize paths for ZIP writing
        const normalizedPath = file.path.replace(/\\/g, '/');
        zip.file(normalizedPath, file.content);
      });

      // Generate the ZIP payload asynchronously
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Create trigger link and download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'UMN_DeviceManager_VS2022_Solution.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to bundle ZIP archive', err);
    } finally {
      setExporting(false);
    }
  };

  // Structured rendering of the solution nodes
  const renderTree = () => {
    return (
      <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
        <div className="flex items-center gap-1 font-bold text-blue-400 py-1 border-b border-slate-800 mb-2">
          <Settings size={12} />
          <span>Solution Explorer</span>
        </div>

        {/* SLN file */}
        <div 
          onClick={() => {
            const sln = csharpFiles.find(f => f.name === 'UMN.DeviceManager.sln');
            if (sln) setActiveFile(sln);
          }}
          className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${
            activeFile.name === 'UMN.DeviceManager.sln' ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500' : 'hover:bg-slate-800/40'
          }`}
        >
          <FileText size={13} className="text-blue-500 flex-shrink-0" />
          <span>UMN.DeviceManager.sln</span>
        </div>

        {/* Core Project */}
        <div className="pl-1 space-y-1 mt-2">
          <div 
            onClick={() => toggleNode('UMN.DeviceManager.Core')} 
            className="flex items-center gap-1 py-1 cursor-pointer hover:text-slate-100 font-semibold text-slate-400 select-none"
          >
            {expandedNodes['UMN.DeviceManager.Core'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            <Folder size={12} className="text-yellow-500 flex-shrink-0" />
            <span>UMN.DeviceManager.Core</span>
          </div>

          {expandedNodes['UMN.DeviceManager.Core'] && (
            <div className="pl-4 space-y-1 border-l border-slate-800">
              {/* Models */}
              <div onClick={() => toggleNode('UMN.DeviceManager.Core/Models')} className="flex items-center gap-1 py-0.5 cursor-pointer hover:text-slate-100 select-none">
                {expandedNodes['UMN.DeviceManager.Core/Models'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                <Folder size={11} className="text-yellow-600 flex-shrink-0" />
                <span>Models</span>
              </div>
              {expandedNodes['UMN.DeviceManager.Core/Models'] && (
                <div className="pl-4 space-y-0.5 border-l border-slate-850">
                  {['Device.cs', 'FileEntry.cs', 'PackageInfo.cs'].map(file => {
                    const matched = csharpFiles.find(f => f.name === file);
                    const isActive = activeFile.name === file;
                    return matched && (
                      <div 
                        key={file}
                        onClick={() => setActiveFile(matched)}
                        className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                      >
                        <File size={10} className="inline mr-1 text-slate-400" />
                        {file}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Interfaces */}
              <div onClick={() => toggleNode('UMN.DeviceManager.Core/Interfaces')} className="flex items-center gap-1 py-0.5 cursor-pointer hover:text-slate-100 select-none">
                {expandedNodes['UMN.DeviceManager.Core/Interfaces'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                <Folder size={11} className="text-yellow-600 flex-shrink-0" />
                <span>Interfaces</span>
              </div>
              {expandedNodes['UMN.DeviceManager.Core/Interfaces'] && (
                <div className="pl-4 space-y-0.5 border-l border-slate-850">
                  {['IAdbService.cs', 'IFastbootService.cs'].map(file => {
                    const matched = csharpFiles.find(f => f.name === file);
                    const isActive = activeFile.name === file;
                    return matched && (
                      <div 
                        key={file}
                        onClick={() => setActiveFile(matched)}
                        className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                      >
                        <File size={10} className="inline mr-1 text-slate-400" />
                        {file}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CSPROJ */}
              {(() => {
                const matched = csharpFiles.find(f => f.name === 'UMN.DeviceManager.Core.csproj');
                const isActive = activeFile.name === 'UMN.DeviceManager.Core.csproj';
                return matched && (
                  <div 
                    onClick={() => setActiveFile(matched)}
                    className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                  >
                    <File size={10} className="inline mr-1 text-sky-500" />
                    UMN.DeviceManager.Core.csproj
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Services Project */}
        <div className="pl-1 space-y-1 mt-2">
          <div 
            onClick={() => toggleNode('UMN.DeviceManager.Services')} 
            className="flex items-center gap-1 py-1 cursor-pointer hover:text-slate-100 font-semibold text-slate-400 select-none"
          >
            {expandedNodes['UMN.DeviceManager.Services'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            <Folder size={12} className="text-yellow-500 flex-shrink-0" />
            <span>UMN.DeviceManager.Services</span>
          </div>

          {expandedNodes['UMN.DeviceManager.Services'] && (
            <div className="pl-4 space-y-1 border-l border-slate-800">
              {/* Adb */}
              <div onClick={() => toggleNode('UMN.DeviceManager.Services/Adb')} className="flex items-center gap-1 py-0.5 cursor-pointer hover:text-slate-100 select-none">
                {expandedNodes['UMN.DeviceManager.Services/Adb'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                <Folder size={11} className="text-yellow-600 flex-shrink-0" />
                <span>Adb</span>
              </div>
              {expandedNodes['UMN.DeviceManager.Services/Adb'] && (
                <div className="pl-4 space-y-0.5 border-l border-slate-850">
                  {(() => {
                    const matched = csharpFiles.find(f => f.name === 'AdbService.cs');
                    const isActive = activeFile.name === 'AdbService.cs';
                    return matched && (
                      <div 
                        onClick={() => setActiveFile(matched)}
                        className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                      >
                        <File size={10} className="inline mr-1 text-slate-400" />
                        AdbService.cs
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Fastboot */}
              <div onClick={() => toggleNode('UMN.DeviceManager.Services/Fastboot')} className="flex items-center gap-1 py-0.5 cursor-pointer hover:text-slate-100 select-none">
                {expandedNodes['UMN.DeviceManager.Services/Fastboot'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                <Folder size={11} className="text-yellow-600 flex-shrink-0" />
                <span>Fastboot</span>
              </div>
              {expandedNodes['UMN.DeviceManager.Services/Fastboot'] && (
                <div className="pl-4 space-y-0.5 border-l border-slate-850">
                  {(() => {
                    const matched = csharpFiles.find(f => f.name === 'FastbootService.cs');
                    const isActive = activeFile.name === 'FastbootService.cs';
                    return matched && (
                      <div 
                        onClick={() => setActiveFile(matched)}
                        className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                      >
                        <File size={10} className="inline mr-1 text-slate-400" />
                        FastbootService.cs
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* CSPROJ */}
              {(() => {
                const matched = csharpFiles.find(f => f.name === 'UMN.DeviceManager.Services.csproj');
                const isActive = activeFile.name === 'UMN.DeviceManager.Services.csproj';
                return matched && (
                  <div 
                    onClick={() => setActiveFile(matched)}
                    className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                  >
                    <File size={10} className="inline mr-1 text-sky-500" />
                    UMN.DeviceManager.Services.csproj
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* UI Project */}
        <div className="pl-1 space-y-1 mt-2">
          <div 
            onClick={() => toggleNode('UMN.DeviceManager.UI')} 
            className="flex items-center gap-1 py-1 cursor-pointer hover:text-slate-100 font-semibold text-slate-400 select-none"
          >
            {expandedNodes['UMN.DeviceManager.UI'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            <Folder size={12} className="text-yellow-500 flex-shrink-0" />
            <span>UMN.DeviceManager.UI</span>
          </div>

          {expandedNodes['UMN.DeviceManager.UI'] && (
            <div className="pl-4 space-y-1 border-l border-slate-800">
              {/* ViewModels */}
              <div onClick={() => toggleNode('UMN.DeviceManager.UI/ViewModels')} className="flex items-center gap-1 py-0.5 cursor-pointer hover:text-slate-100 select-none">
                {expandedNodes['UMN.DeviceManager.UI/ViewModels'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                <Folder size={11} className="text-yellow-600 flex-shrink-0" />
                <span>ViewModels</span>
              </div>
              {expandedNodes['UMN.DeviceManager.UI/ViewModels'] && (
                <div className="pl-4 space-y-0.5 border-l border-slate-850">
                  {(() => {
                    const matched = csharpFiles.find(f => f.name === 'MainWindowViewModel.cs');
                    const isActive = activeFile.name === 'MainWindowViewModel.cs';
                    return matched && (
                      <div 
                        onClick={() => setActiveFile(matched)}
                        className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                      >
                        <File size={10} className="inline mr-1 text-slate-400" />
                        MainWindowViewModel.cs
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Styles */}
              <div onClick={() => toggleNode('UMN.DeviceManager.UI/Styles')} className="flex items-center gap-1 py-0.5 cursor-pointer hover:text-slate-100 select-none">
                {expandedNodes['UMN.DeviceManager.UI/Styles'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                <Folder size={11} className="text-yellow-600 flex-shrink-0" />
                <span>Styles</span>
              </div>
              {expandedNodes['UMN.DeviceManager.UI/Styles'] && (
                <div className="pl-4 space-y-0.5 border-l border-slate-850">
                  {(() => {
                    const matched = csharpFiles.find(f => f.name === 'ModernTheme.xaml');
                    const isActive = activeFile.name === 'ModernTheme.xaml';
                    return matched && (
                      <div 
                        onClick={() => setActiveFile(matched)}
                        className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                      >
                        <File size={10} className="inline mr-1 text-slate-400" />
                        ModernTheme.xaml
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Files */}
              {['App.xaml', 'App.xaml.cs', 'MainWindow.xaml', 'MainWindow.xaml.cs'].map(file => {
                const matched = csharpFiles.find(f => f.name === file);
                const isActive = activeFile.name === file;
                return matched && (
                  <div 
                    key={file}
                    onClick={() => setActiveFile(matched)}
                    className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                  >
                    <File size={10} className="inline mr-1 text-slate-400" />
                    {file}
                  </div>
                );
              })}

              {/* CSPROJ */}
              {(() => {
                const matched = csharpFiles.find(f => f.name === 'UMN.DeviceManager.UI.csproj');
                const isActive = activeFile.name === 'UMN.DeviceManager.UI.csproj';
                return matched && (
                  <div 
                    onClick={() => setActiveFile(matched)}
                    className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                  >
                    <File size={10} className="inline mr-1 text-sky-500" />
                    UMN.DeviceManager.UI.csproj
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Tests Project */}
        <div className="pl-1 space-y-1 mt-2">
          <div 
            onClick={() => toggleNode('UMN.DeviceManager.Tests')} 
            className="flex items-center gap-1 py-1 cursor-pointer hover:text-slate-100 font-semibold text-slate-400 select-none"
          >
            {expandedNodes['UMN.DeviceManager.Tests'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            <Folder size={12} className="text-yellow-500 flex-shrink-0" />
            <span>UMN.DeviceManager.Tests</span>
          </div>

          {expandedNodes['UMN.DeviceManager.Tests'] && (
            <div className="pl-4 space-y-1 border-l border-slate-800">
              {(() => {
                const matched = csharpFiles.find(f => f.name === 'AdbServiceTests.cs');
                const isActive = activeFile.name === 'AdbServiceTests.cs';
                return matched && (
                  <div 
                    onClick={() => setActiveFile(matched)}
                    className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                  >
                    <File size={10} className="inline mr-1 text-slate-400" />
                    AdbServiceTests.cs
                  </div>
                );
              })()}

              {(() => {
                const matched = csharpFiles.find(f => f.name === 'UMN.DeviceManager.Tests.csproj');
                const isActive = activeFile.name === 'UMN.DeviceManager.Tests.csproj';
                return matched && (
                  <div 
                    onClick={() => setActiveFile(matched)}
                    className={`py-0.5 px-1.5 rounded cursor-pointer ${isActive ? 'bg-blue-600/20 text-blue-300 font-medium' : 'hover:bg-slate-800/40'}`}
                  >
                    <File size={10} className="inline mr-1 text-sky-500" />
                    UMN.DeviceManager.Tests.csproj
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* README.md */}
        <div 
          onClick={() => {
            const readme = csharpFiles.find(f => f.name === 'README.md');
            if (readme) setActiveFile(readme);
          }}
          className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer mt-2 transition-colors ${
            activeFile.name === 'README.md' ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500' : 'hover:bg-slate-800/40'
          }`}
        >
          <FileText size={13} className="text-emerald-500 flex-shrink-0" />
          <span>README.md</span>
        </div>

      </div>
    );
  };

  return (
    <div id="solution-explorer-tab-root" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Solution Explorer Sidebar (Left Panel - Span 1) */}
      <div id="tree-panel" className="border border-slate-800 rounded-xl bg-slate-950/40 p-4 h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {renderTree()}
      </div>

      {/* Editor & Actions view (Right Panel - Span 3) */}
      <div id="editor-panel" className="lg:col-span-3 border border-slate-800 rounded-xl bg-slate-900/30 p-5 flex flex-col justify-between h-[540px]">
        
        {/* Editor Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Staged Solution Path</span>
            <span className="text-xs font-mono text-blue-400 font-medium">{activeFile.path}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              id="copy-code-btn"
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Clipboard size={13} />
                  Copy Code
                </>
              )}
            </button>

            {/* Downloader ZIP */}
            <button
              id="export-zip-btn"
              onClick={handleExportZip}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-md shadow-blue-500/10"
            >
              {exporting ? (
                <>
                  <Loader2 className="animate-spin" size={13} />
                  Bundling ZIP...
                </>
              ) : (
                <>
                  <Download size={13} />
                  Export Solution (.ZIP)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="flex-1 my-4 bg-slate-950/80 rounded-xl border border-slate-850 p-4 font-mono text-xs overflow-auto relative">
          <pre className="text-slate-300 leading-relaxed font-mono whitespace-pre break-all select-text">
            {activeFile.content}
          </pre>
        </div>

        {/* Editor Footer */}
        <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Encoding: UTF-8 | Language: {activeFile.language.toUpperCase()}</span>
          <span>C# 12 / .NET 8.0 Solution</span>
        </div>
      </div>
    </div>
  );
};
