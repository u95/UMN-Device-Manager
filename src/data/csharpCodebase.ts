import { CodeFile } from '../types';

export const csharpFiles: CodeFile[] = [
  {
    name: "UMN.DeviceManager.sln",
    path: "UMN.DeviceManager.sln",
    language: "markdown",
    content: `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.8.34330.188
MinimumVisualStudioVersion = 10.0.40219.1
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UMN.DeviceManager.Core", "UMN.DeviceManager.Core\\UMN.DeviceManager.Core.csproj", "{CORE-1111-1111-1111-111111111111}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UMN.DeviceManager.Services", "UMN.DeviceManager.Services\\UMN.DeviceManager.Services.csproj", "{SERV-2222-2222-2222-222222222222}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UMN.DeviceManager.UI", "UMN.DeviceManager.UI\\UMN.DeviceManager.UI.csproj", "{WPFU-3333-3333-3333-333333333333}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UMN.DeviceManager.Tests", "UMN.DeviceManager.Tests\\UMN.DeviceManager.Tests.csproj", "{TEST-4444-4444-4444-444444444444}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{CORE-1111-1111-1111-111111111111}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{CORE-1111-1111-1111-111111111111}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{CORE-1111-1111-1111-111111111111}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{CORE-1111-1111-1111-111111111111}.Release|Any CPU.Build.0 = Release|Any CPU
		{SERV-2222-2222-2222-222222222222}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{SERV-2222-2222-2222-222222222222}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{SERV-2222-2222-2222-222222222222}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{SERV-2222-2222-2222-222222222222}.Release|Any CPU.Build.0 = Release|Any CPU
		{WPFU-3333-3333-3333-333333333333}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{WPFU-3333-3333-3333-333333333333}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{WPFU-3333-3333-3333-333333333333}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{WPFU-3333-3333-3333-333333333333}.Release|Any CPU.Build.0 = Release|Any CPU
		{TEST-4444-4444-4444-444444444444}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{TEST-4444-4444-4444-444444444444}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{TEST-4444-4444-4444-444444444444}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{TEST-4444-4444-4444-444444444444}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
EndGlobal
`
  },
  {
    name: "UMN.DeviceManager.Core.csproj",
    path: "UMN.DeviceManager.Core/UMN.DeviceManager.Core.csproj",
    language: "xml",
    content: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>`
  },
  {
    name: "Device.cs",
    path: "UMN.DeviceManager.Core/Models/Device.cs",
    language: "csharp",
    content: `namespace UMN.DeviceManager.Core.Models
{
    public class Device
    {
        public string Serial { get; set; } = string.Empty;
        public string Model { get; set; } = "Unknown Device";
        public string Manufacturer { get; set; } = "Unknown";
        public string AndroidVersion { get; set; } = "N/A";
        public int BatteryLevel { get; set; } = 0;
        public string BatteryStatus { get; set; } = "Unknown";
        public string Cpu { get; set; } = "Unknown";
        public string StorageTotal { get; set; } = "N/A";
        public string StorageUsed { get; set; } = "N/A";
        public string RootStatus { get; set; } = "No";
        public ConnectionMode Mode { get; set; } = ConnectionMode.None;
        public DeviceStatus Status { get; set; } = DeviceStatus.None;
    }

    public enum ConnectionMode
    {
        None,
        Adb,
        Fastboot
    }

    public enum DeviceStatus
    {
        None,
        Online,
        Unauthorized,
        Recovery,
        Sideload
    }
}`
  },
  {
    name: "FileEntry.cs",
    path: "UMN.DeviceManager.Core/Models/FileEntry.cs",
    language: "csharp",
    content: `namespace UMN.DeviceManager.Core.Models
{
    public class FileEntry
    {
        public string Name { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public bool IsDirectory { get; set; }
        public string Size { get; set; } = "0 B";
        public string Permissions { get; set; } = string.Empty;
        public string DateModified { get; set; } = string.Empty;
    }
}`
  },
  {
    name: "PackageInfo.cs",
    path: "UMN.DeviceManager.Core/Models/PackageInfo.cs",
    language: "csharp",
    content: `namespace UMN.DeviceManager.Core.Models
{
    public class PackageInfo
    {
        public string PackageName { get; set; } = string.Empty;
        public bool IsSystem { get; set; }
        public string Version { get; set; } = "Unknown";
    }
}`
  },
  {
    name: "IAdbService.cs",
    path: "UMN.DeviceManager.Core/Interfaces/IAdbService.cs",
    language: "csharp",
    content: `using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UMN.DeviceManager.Core.Models;

namespace UMN.DeviceManager.Core.Interfaces
{
    public interface IAdbService
    {
        Task<List<Device>> GetConnectedDevicesAsync(CancellationToken cancellationToken = default);
        Task<Device> GetDeviceDetailsAsync(string serial, CancellationToken cancellationToken = default);
        Task<bool> RebootAsync(string serial, string target = "", CancellationToken cancellationToken = default);
        Task<List<PackageInfo>> GetInstalledPackagesAsync(string serial, bool showSystem = false, CancellationToken cancellationToken = default);
        Task<bool> InstallApkAsync(string serial, string apkPath, Action<double> progressCallback, CancellationToken cancellationToken = default);
        Task<bool> UninstallApkAsync(string serial, string packageName, CancellationToken cancellationToken = default);
        Task<List<FileEntry>> ListDirectoryAsync(string serial, string directoryPath, CancellationToken cancellationToken = default);
        Task<bool> PushFileAsync(string serial, string localPath, string remotePath, Action<double> progressCallback, CancellationToken cancellationToken = default);
        Task<bool> PullFileAsync(string serial, string remotePath, string localPath, Action<double> progressCallback, CancellationToken cancellationToken = default);
        Task<bool> CreateFolderAsync(string serial, string remotePath, CancellationToken cancellationToken = default);
        Task<bool> DeleteFileOrFolderAsync(string serial, string remotePath, CancellationToken cancellationToken = default);
        Task<bool> RenameFileOrFolderAsync(string serial, string remotePath, string newName, CancellationToken cancellationToken = default);
        Task<bool> BackupAsync(string serial, string localBackupPath, List<string> backupOptions, Action<double, string> progressCallback, CancellationToken cancellationToken = default);
        Task<bool> RestoreAsync(string serial, string localBackupPath, Action<double, string> progressCallback, CancellationToken cancellationToken = default);
        Task StartLogcatAsync(string serial, Action<string> onLineReceived, string filterLevel = "V", string searchTag = "", CancellationToken cancellationToken = default);
    }
}`
  },
  {
    name: "IFastbootService.cs",
    path: "UMN.DeviceManager.Core/Interfaces/IFastbootService.cs",
    language: "csharp",
    content: `using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UMN.DeviceManager.Core.Models;

namespace UMN.DeviceManager.Core.Interfaces
{
    public interface IFastbootService
    {
        Task<List<Device>> GetConnectedDevicesAsync(CancellationToken cancellationToken = default);
        Task<bool> RebootAsync(string serial, string target = "", CancellationToken cancellationToken = default);
        Task<bool> FlashPartitionAsync(string serial, string partition, string imagePath, Action<double> progressCallback, CancellationToken cancellationToken = default);
        Task<bool> ErasePartitionAsync(string serial, string partition, CancellationToken cancellationToken = default);
        Task<Dictionary<string, string>> GetVarAllAsync(string serial, CancellationToken cancellationToken = default);
    }
}`
  },
  {
    name: "UMN.DeviceManager.Services.csproj",
    path: "UMN.DeviceManager.Services/UMN.DeviceManager.Services.csproj",
    language: "xml",
    content: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\\UMN.DeviceManager.Core\\UMN.DeviceManager.Core.csproj" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Serilog" Version="4.0.0" />
  </ItemGroup>
</Project>`
  },
  {
    name: "AdbService.cs",
    path: "UMN.DeviceManager.Services/Adb/AdbService.cs",
    language: "csharp",
    content: `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Serilog;
using UMN.DeviceManager.Core.Interfaces;
using UMN.DeviceManager.Core.Models;

namespace UMN.DeviceManager.Services.Adb
{
    public class AdbService : IAdbService
    {
        private readonly string _adbPath;
        private readonly ILogger _logger;

        public AdbService(string adbPath = "adb")
        {
            _adbPath = string.IsNullOrWhiteSpace(adbPath) ? "adb" : adbPath;
            _logger = Log.ForContext<AdbService>();
        }

        private async Task<(int ExitCode, string StandardOutput, string StandardError)> ExecuteCommandAsync(
            string arguments, 
            CancellationToken cancellationToken = default, 
            int timeoutMs = 15000)
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            if (timeoutMs > 0)
            {
                cts.CancelAfter(timeoutMs);
            }

            try
            {
                using var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = _adbPath,
                        Arguments = arguments,
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        CreateNoWindow = true,
                        StandardOutputEncoding = Encoding.UTF8,
                        StandardErrorEncoding = Encoding.UTF8
                    }
                };

                _logger.Debug("Executing ADB Command: adb {Arguments}", arguments);
                process.Start();

                var outputTask = process.StandardOutput.ReadToEndAsync(cts.Token);
                var errorTask = process.StandardError.ReadToEndAsync(cts.Token);

                await process.WaitForExitAsync(cts.Token);

                var output = await outputTask;
                var error = await errorTask;

                return (process.ExitCode, output, error);
            }
            catch (OperationCanceledException) when (cts.IsCancellationRequested)
            {
                _logger.Warning("ADB Command execution timed out or was cancelled: adb {Arguments}", arguments);
                throw new TimeoutException($"ADB command 'adb {arguments}' exceeded the allotted timeout.");
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed to execute ADB Command: adb {Arguments}", arguments);
                throw;
            }
        }

        public async Task<List<Device>> GetConnectedDevicesAsync(CancellationToken cancellationToken = default)
        {
            var devices = new List<Device>();
            try
            {
                var (exitCode, stdout, stderr) = await ExecuteCommandAsync("devices", cancellationToken);
                if (exitCode != 0) return devices;

                var lines = stdout.Split(new[] { '\\r', '\\n' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var line in lines)
                {
                    if (line.StartsWith("List of devices") || string.IsNullOrWhiteSpace(line))
                        continue;

                    var match = Regex.Match(line, @"^([^\\s]+)\\s+([^\\s]+)");
                    if (match.Success)
                    {
                        var serial = match.Groups[1].Value;
                        var stateStr = match.Groups[2].Value.ToLower();

                        var status = DeviceStatus.None;
                        if (stateStr == "device") status = DeviceStatus.Online;
                        else if (stateStr == "unauthorized") status = DeviceStatus.Unauthorized;
                        else if (stateStr == "recovery") status = DeviceStatus.Recovery;
                        else if (stateStr == "sideload") status = DeviceStatus.Sideload;

                        devices.Add(new Device
                        {
                            Serial = serial,
                            Mode = ConnectionMode.Adb,
                            Status = status
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error getting connected ADB devices");
            }
            return devices;
        }

        public async Task<Device> GetDeviceDetailsAsync(string serial, CancellationToken cancellationToken = default)
        {
            var device = new Device { Serial = serial, Mode = ConnectionMode.Adb, Status = DeviceStatus.Online };
            try
            {
                // Get Model
                var modelResult = await ExecuteCommandAsync($"-s {serial} shell getprop ro.product.model", cancellationToken);
                device.Model = modelResult.StandardOutput.Trim();

                // Get Manufacturer
                var brandResult = await ExecuteCommandAsync($"-s {serial} shell getprop ro.product.brand", cancellationToken);
                device.Manufacturer = brandResult.StandardOutput.Trim();

                // Get Android Version
                var verResult = await ExecuteCommandAsync($"-s {serial} shell getprop ro.build.version.release", cancellationToken);
                device.AndroidVersion = verResult.StandardOutput.Trim();

                // Get CPU details
                var cpuResult = await ExecuteCommandAsync($"-s {serial} shell getprop ro.board.platform", cancellationToken);
                device.Cpu = cpuResult.StandardOutput.Trim();

                // Get Battery Status & Level
                var batResult = await ExecuteCommandAsync($"-s {serial} shell dumpsys battery", cancellationToken);
                var batStdout = batResult.StandardOutput;
                var levelMatch = Regex.Match(batStdout, @"level:\\s+(\\d+)");
                if (levelMatch.Success) device.BatteryLevel = int.Parse(levelMatch.Groups[1].Value);

                var statusMatch = Regex.Match(batStdout, @"status:\\s+(\\d+)");
                if (statusMatch.Success)
                {
                    int statusId = int.Parse(statusMatch.Groups[1].Value);
                    device.BatteryStatus = statusId switch
                    {
                        2 => "Charging",
                        3 => "Discharging",
                        4 => "Not Charging",
                        5 => "Full",
                        _ => "Unknown"
                    };
                }

                // Get Root Status
                var suResult = await ExecuteCommandAsync($"-s {serial} shell which su", cancellationToken);
                device.RootStatus = suResult.StandardOutput.Contains("su") ? "Yes (Rooted)" : "No (Locked)";

                // Get Storage Details
                var dfResult = await ExecuteCommandAsync($"-s {serial} shell df -h /sdcard", cancellationToken);
                var dfLines = dfResult.StandardOutput.Split('\\n');
                if (dfLines.Length > 1)
                {
                    var cols = Regex.Split(dfLines[1].Trim(), @"\\s+");
                    if (cols.Length >= 4)
                    {
                        device.StorageTotal = cols[1];
                        device.StorageUsed = cols[2];
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed to retrieve full ADB device properties for {Serial}", serial);
            }
            return device;
        }

        public async Task<bool> RebootAsync(string serial, string target = "", CancellationToken cancellationToken = default)
        {
            _logger.Information("Rebooting ADB device {Serial} to {Target}", serial, string.IsNullOrEmpty(target) ? "Normal" : target);
            var arg = string.IsNullOrWhiteSpace(target) ? "reboot" : $"reboot {target.ToLower()}";
            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} {arg}", cancellationToken);
            return exitCode == 0;
        }

        public async Task<List<PackageInfo>> GetInstalledPackagesAsync(string serial, bool showSystem = false, CancellationToken cancellationToken = default)
        {
            var packages = new List<PackageInfo>();
            try
            {
                var arg = showSystem ? "shell pm list packages -f" : "shell pm list packages -f -3";
                var (exitCode, stdout, _) = await ExecuteCommandAsync($"-s {serial} {arg}", cancellationToken);
                if (exitCode != 0) return packages;

                var lines = stdout.Split(new[] { '\\r', '\\n' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var line in lines)
                {
                    var match = Regex.Match(line, @"^package:(.+)=([^\\s]+)$");
                    if (match.Success)
                    {
                        packages.Add(new PackageInfo
                        {
                            PackageName = match.Groups[2].Value,
                            IsSystem = !line.Contains("/data/app/"),
                            Version = "Current"
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed to retrieve package list for {Serial}", serial);
            }
            return packages;
        }

        public async Task<bool> InstallApkAsync(string serial, string apkPath, Action<double> progressCallback, CancellationToken cancellationToken = default)
        {
            _logger.Information("Installing APK {ApkPath} onto device {Serial}", apkPath, serial);
            progressCallback(10);
            var (exitCode, stdout, stderr) = await ExecuteCommandAsync($"-s {serial} install -r \"{apkPath}\"", cancellationToken, 60000);
            progressCallback(100);
            return exitCode == 0 && stdout.Contains("Success");
        }

        public async Task<bool> UninstallApkAsync(string serial, string packageName, CancellationToken cancellationToken = default)
        {
            _logger.Information("Uninstalling package {PackageName} from device {Serial}", packageName, serial);
            var (exitCode, stdout, _) = await ExecuteCommandAsync($"-s {serial} uninstall {packageName}", cancellationToken);
            return exitCode == 0 && stdout.Contains("Success");
        }

        public async Task<List<FileEntry>> ListDirectoryAsync(string serial, string directoryPath, CancellationToken cancellationToken = default)
        {
            var list = new List<FileEntry>();
            try
            {
                var escapedPath = directoryPath.Replace("\"", "\\\"");
                var (exitCode, stdout, _) = await ExecuteCommandAsync($"-s {serial} shell ls -la \"{escapedPath}\"", cancellationToken);
                if (exitCode != 0) return list;

                var lines = stdout.Split(new[] { '\\r', '\\n' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var line in lines)
                {
                    if (line.StartsWith("total") || string.IsNullOrWhiteSpace(line)) continue;

                    var cols = Regex.Split(line.Trim(), @"\\s+");
                    if (cols.Length >= 8)
                    {
                        var name = string.Join(" ", cols, 7, cols.Length - 7);
                        if (name == "." || name == "..") continue;

                        var isDir = line.StartsWith('d') || line.StartsWith('l');
                        var path = Path.Combine(directoryPath, name).Replace('\\\\', '/');

                        list.Add(new FileEntry
                        {
                            Name = name,
                            Path = path,
                            IsDirectory = isDir,
                            Size = isDir ? "<DIR>" : cols[4],
                            Permissions = cols[0],
                            DateModified = $"{cols[5]} {cols[6]}"
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed to parse folder listing on {Serial} for {Path}", serial, directoryPath);
            }
            return list;
        }

        public async Task<bool> PushFileAsync(string serial, string localPath, string remotePath, Action<double> progressCallback, CancellationToken cancellationToken = default)
        {
            _logger.Information("Pushing local file {LocalPath} to {RemotePath} on device {Serial}", localPath, remotePath, serial);
            progressCallback(20);
            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} push \"{localPath}\" \"{remotePath}\"", cancellationToken, 120000);
            progressCallback(100);
            return exitCode == 0;
        }

        public async Task<bool> PullFileAsync(string serial, string remotePath, string localPath, Action<double> progressCallback, CancellationToken cancellationToken = default)
        {
            _logger.Information("Pulling device file {RemotePath} to {LocalPath} on machine", remotePath, localPath);
            progressCallback(20);
            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} pull \"{remotePath}\" \"{localPath}\"", cancellationToken, 120000);
            progressCallback(100);
            return exitCode == 0;
        }

        public async Task<bool> CreateFolderAsync(string serial, string remotePath, CancellationToken cancellationToken = default)
        {
            _logger.Information("Creating folder {RemotePath} on device {Serial}", remotePath, serial);
            var escapedPath = remotePath.Replace("\"", "\\\"");
            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} shell mkdir -p \"{escapedPath}\"", cancellationToken);
            return exitCode == 0;
        }

        public async Task<bool> DeleteFileOrFolderAsync(string serial, string remotePath, CancellationToken cancellationToken = default)
        {
            _logger.Warning("Deleting resource {RemotePath} on device {Serial}", remotePath, serial);
            var escapedPath = remotePath.Replace("\"", "\\\"");
            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} shell rm -rf \"{escapedPath}\"", cancellationToken);
            return exitCode == 0;
        }

        public async Task<bool> RenameFileOrFolderAsync(string serial, string remotePath, string newName, CancellationToken cancellationToken = default)
        {
            _logger.Information("Renaming device resource {RemotePath} to {NewName}", remotePath, newName);
            var parent = Path.GetDirectoryName(remotePath)?.Replace('\\\\', '/') ?? "/sdcard";
            var targetPath = $"{parent}/{newName}";
            var escapedSource = remotePath.Replace("\"", "\\\"");
            var escapedTarget = targetPath.Replace("\"", "\\\"");

            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} shell mv \"{escapedSource}\" \"{escapedTarget}\"", cancellationToken);
            return exitCode == 0;
        }

        public async Task<bool> BackupAsync(string serial, string localBackupPath, List<string> backupOptions, Action<double, string> progressCallback, CancellationToken cancellationToken = default)
        {
            _logger.Information("Starting local ADB device backup of {Serial} to {Path}", serial, localBackupPath);
            progressCallback(10, "Initializing backup agent...");
            
            var options = "all -apk -shared"; // Authorized files backup
            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} backup -f \"{localBackupPath}\" -{options}", cancellationToken, 300000);
            
            progressCallback(100, "Backup finished successfully.");
            return exitCode == 0;
        }

        public async Task<bool> RestoreAsync(string serial, string localBackupPath, Action<double, string> progressCallback, CancellationToken cancellationToken = default)
        {
            _logger.Information("Restoring local backup package {Path} onto device {Serial}", localBackupPath, serial);
            progressCallback(10, "Starting restoration engine...");
            
            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} restore \"{localBackupPath}\"", cancellationToken, 300000);
            
            progressCallback(100, "Restoration complete.");
            return exitCode == 0;
        }

        public async Task StartLogcatAsync(string serial, Action<string> onLineReceived, string filterLevel = "V", string searchTag = "", CancellationToken cancellationToken = default)
        {
            var filterArgs = string.IsNullOrEmpty(searchTag) ? $"*:{filterLevel}" : $"{searchTag}:{filterLevel} *:S";
            var arguments = $"-s {serial} logcat -v time {filterArgs}";

            _logger.Information("Opening stream Logcat pipe: adb {Arguments}", arguments);

            using var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = _adbPath,
                    Arguments = arguments,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    StandardOutputEncoding = Encoding.UTF8
                }
            };

            process.Start();

            using var registration = cancellationToken.Register(() => {
                try { process.Kill(); } catch { }
            });

            while (!process.StandardOutput.EndOfStream && !cancellationToken.IsCancellationRequested)
            {
                var line = await process.StandardOutput.ReadLineAsync(cancellationToken);
                if (line != null)
                {
                    onLineReceived(line);
                }
            }
        }
    }
}`
  },
  {
    name: "FastbootService.cs",
    path: "UMN.DeviceManager.Services/Fastboot/FastbootService.cs",
    language: "csharp",
    content: `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Serilog;
using UMN.DeviceManager.Core.Interfaces;
using UMN.DeviceManager.Core.Models;

namespace UMN.DeviceManager.Services.Fastboot
{
    public class FastbootService : IFastbootService
    {
        private readonly string _fastbootPath;
        private readonly ILogger _logger;

        public FastbootService(string fastbootPath = "fastboot")
        {
            _fastbootPath = string.IsNullOrWhiteSpace(fastbootPath) ? "fastboot" : fastbootPath;
            _logger = Log.ForContext<FastbootService>();
        }

        private async Task<(int ExitCode, string StandardOutput, string StandardError)> ExecuteCommandAsync(
            string arguments, 
            CancellationToken cancellationToken = default, 
            int timeoutMs = 25000)
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            if (timeoutMs > 0) cts.CancelAfter(timeoutMs);

            try
            {
                using var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = _fastbootPath,
                        Arguments = arguments,
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        CreateNoWindow = true,
                        StandardOutputEncoding = Encoding.UTF8,
                        StandardErrorEncoding = Encoding.UTF8
                    }
                };

                _logger.Debug("Executing Fastboot Command: fastboot {Arguments}", arguments);
                process.Start();

                var outputTask = process.StandardOutput.ReadToEndAsync(cts.Token);
                var errorTask = process.StandardError.ReadToEndAsync(cts.Token);

                await process.WaitForExitAsync(cts.Token);

                var output = await outputTask;
                var error = await errorTask;

                return (process.ExitCode, output, error);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed to execute Fastboot Command: fastboot {Arguments}", arguments);
                throw;
            }
        }

        public async Task<List<Device>> GetConnectedDevicesAsync(CancellationToken cancellationToken = default)
        {
            var devices = new List<Device>();
            try
            {
                var (exitCode, stdout, _) = await ExecuteCommandAsync("devices", cancellationToken);
                if (exitCode != 0) return devices;

                var lines = stdout.Split(new[] { '\\r', '\\n' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var line in lines)
                {
                    var cols = Regex.Split(line.Trim(), @"\\s+");
                    if (cols.Length >= 2 && cols[1] == "fastboot")
                    {
                        devices.Add(new Device
                        {
                            Serial = cols[0],
                            Model = "Fastboot Bootloader Target",
                            Mode = ConnectionMode.Fastboot,
                            Status = DeviceStatus.Online
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed querying fastboot devices list");
            }
            return devices;
        }

        public async Task<bool> RebootAsync(string serial, string target = "", CancellationToken cancellationToken = default)
        {
            _logger.Information("Rebooting Fastboot device {Serial} to {Target}", serial, string.IsNullOrEmpty(target) ? "Normal" : target);
            var arg = string.IsNullOrWhiteSpace(target) ? "reboot" : $"reboot {target.ToLower()}";
            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} {arg}", cancellationToken);
            return exitCode == 0;
        }

        public async Task<bool> FlashPartitionAsync(string serial, string partition, string imagePath, Action<double> progressCallback, CancellationToken cancellationToken = default)
        {
            _logger.Warning("FLASHING CRITICAL PARTITION {Partition} with {ImagePath} on device {Serial}", partition, imagePath, serial);
            
            progressCallback(10);
            var (exitCode, stdout, stderr) = await ExecuteCommandAsync($"-s {serial} flash {partition} \"{imagePath}\"", cancellationToken, 300000);
            progressCallback(100);

            var fullLog = stdout + "\\n" + stderr;
            var success = exitCode == 0 && (fullLog.Contains("OKAY") || fullLog.Contains("Finished"));
            if (success) _logger.Information("Successfully flashed partition {Partition}", partition);
            else _logger.Error("Failed partition flashing output: {Output}", fullLog);

            return success;
        }

        public async Task<bool> ErasePartitionAsync(string serial, string partition, CancellationToken cancellationToken = default)
        {
            _logger.Warning("WIPING PARTITION {Partition} on Fastboot device {Serial}", partition, serial);
            var (exitCode, _, _) = await ExecuteCommandAsync($"-s {serial} erase {partition}", cancellationToken);
            return exitCode == 0;
        }

        public async Task<Dictionary<string, string>> GetVarAllAsync(string serial, CancellationToken cancellationToken = default)
        {
            var vars = new Dictionary<string, string>();
            try
            {
                var (exitCode, _, stderr) = await ExecuteCommandAsync($"-s {serial} getvar all", cancellationToken);
                var lines = stderr.Split('\\n');
                foreach (var line in lines)
                {
                    var match = Regex.Match(line, @"\\(bootloader\\)\\s+([^:]+):\\s*(.+)");
                    if (match.Success)
                    {
                        vars[match.Groups[2].Value.Trim()] = match.Groups[3].Value.Trim();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Failed to retrieve fastboot variables for {Serial}", serial);
            }
            return vars;
        }
    }
}`
  },
  {
    name: "UMN.DeviceManager.UI.csproj",
    path: "UMN.DeviceManager.UI/UMN.DeviceManager.UI.csproj",
    language: "xml",
    content: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWPF>true</UseWPF>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\\UMN.DeviceManager.Core\\UMN.DeviceManager.Core.csproj" />
    <ProjectReference Include="..\\UMN.DeviceManager.Services\\UMN.DeviceManager.Services.csproj" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="CommunityToolkit.Mvvm" Version="8.2.2" />
    <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="8.0.0" />
    <PackageReference Include="Serilog" Version="4.0.0" />
    <PackageReference Include="Serilog.Sinks.File" Version="6.0.0" />
  </ItemGroup>
</Project>`
  },
  {
    name: "App.xaml",
    path: "UMN.DeviceManager.UI/App.xaml",
    language: "xml",
    content: `<Application x:Class="UMN.DeviceManager.UI.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             Startup="OnStartup">
    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <ResourceDictionary Source="Styles/ModernTheme.xaml"/>
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>
</Application>`
  },
  {
    name: "App.xaml.cs",
    path: "UMN.DeviceManager.UI/App.xaml.cs",
    language: "csharp",
    content: `using System;
using System.IO;
using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using UMN.DeviceManager.Core.Interfaces;
using UMN.DeviceManager.Services.Adb;
using UMN.DeviceManager.Services.Fastboot;
using UMN.DeviceManager.UI.ViewModels;

namespace UMN.DeviceManager.UI
{
    public partial class App : Application
    {
        public static IServiceProvider ServiceProvider { get; private set; } = null!;

        private void OnStartup(object sender, StartupEventArgs e)
        {
            // Set up Serilog Logger
            var logPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "UMN_DeviceManager", "logs.txt");
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.File(logPath, rollingInterval: RollingInterval.Day, outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
                .CreateLogger();

            Log.Information("UMN Device Manager starting...");

            // Set up Dependency Injection
            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);
            ServiceProvider = serviceCollection.BuildServiceProvider();

            // Run MainWindow
            var mainWindow = ServiceProvider.GetRequiredService<MainWindow>();
            mainWindow.Show();
        }

        private void ConfigureServices(IServiceCollection services)
        {
            // Infrastructure/Services (ADB & Fastboot wrappers)
            services.AddSingleton<IAdbService>(sp => new AdbService("adb"));
            services.AddSingleton<IFastbootService>(sp => new FastbootService("fastboot"));

            // ViewModels
            services.AddSingleton<MainWindowViewModel>();

            // Main UI
            services.AddTransient<MainWindow>();
        }

        protected override void OnExit(ExitEventArgs e)
        {
            Log.Information("UMN Device Manager shutting down.");
            Log.CloseAndFlush();
            base.OnExit(e);
        }
    }
}`
  },
  {
    name: "ModernTheme.xaml",
    path: "UMN.DeviceManager.UI/Styles/ModernTheme.xaml",
    language: "xml",
    content: `<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <!-- Theme Colors (Dark/Slate Commercial Theme) -->
    <SolidColorBrush x:Key="BackgroundBrush" Color="#0F172A"/>      <!-- slate-900 -->
    <SolidColorBrush x:Key="CardBrush" Color="#1E293B"/>            <!-- slate-800 -->
    <SolidColorBrush x:Key="AccentBrush" Color="#3B82F6"/>          <!-- blue-500 -->
    <SolidColorBrush x:Key="AccentHoverBrush" Color="#2563EB"/>     <!-- blue-600 -->
    <SolidColorBrush x:Key="TextPrimaryBrush" Color="#F8FAFC"/>     <!-- slate-50 -->
    <SolidColorBrush x:Key="TextSecondaryBrush" Color="#94A3B8"/>   <!-- slate-400 -->
    <SolidColorBrush x:Key="BorderBrush" Color="#334155"/>          <!-- slate-700 -->
    <SolidColorBrush x:Key="SuccessBrush" Color="#10B981"/>         <!-- emerald-500 -->
    <SolidColorBrush x:Key="DangerBrush" Color="#EF4444"/>          <!-- red-500 -->

    <!-- Common Typography -->
    <Style TargetType="TextBlock" x:Key="HeaderStyle">
        <Setter Property="FontSize" Value="20"/>
        <Setter Property="FontWeight" Value="SemiBold"/>
        <Setter Property="Foreground" Value="{StaticResource TextPrimaryBrush}"/>
        <Setter Property="Margin" Value="0,0,0,10"/>
    </Style>

    <!-- Custom Button Control Template -->
    <Style TargetType="Button">
        <Setter Property="Background" Value="{StaticResource AccentBrush}"/>
        <Setter Property="Foreground" Value="{StaticResource TextPrimaryBrush}"/>
        <Setter Property="BorderThickness" Value="0"/>
        <Setter Property="Padding" Value="14,8"/>
        <Setter Property="FontSize" Value="13"/>
        <Setter Property="FontWeight" Value="Medium"/>
        <Setter Property="Height" Value="36"/>
        <Setter Property="Template">
            <Setter.Value>
                <ControlTemplate TargetType="Button">
                    <Border Background="{TemplateBinding Background}" 
                            CornerRadius="6" 
                            BorderThickness="{TemplateBinding BorderThickness}" 
                            BorderBrush="{TemplateBinding BorderBrush}"
                            Padding="{TemplateBinding Padding}">
                        <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center"/>
                    </Border>
                    <ControlTemplate.Triggers>
                        <Trigger Property="IsMouseOver" Value="True">
                            <Setter Property="Background" Value="{StaticResource AccentHoverBrush}"/>
                        </Trigger>
                        <Trigger Property="IsEnabled" Value="False">
                            <Setter Property="Background" Value="#334155"/>
                            <Setter Property="Foreground" Value="#64748B"/>
                        </Trigger>
                    </ControlTemplate.Triggers>
                </ControlTemplate>
            </Setter.Value>
        </Setter>
    </Style>

    <!-- Custom Textbox Control Template -->
    <Style TargetType="TextBox">
        <Setter Property="Background" Value="#0F172A"/>
        <Setter Property="Foreground" Value="{StaticResource TextPrimaryBrush}"/>
        <Setter Property="BorderBrush" Value="{StaticResource BorderBrush}"/>
        <Setter Property="BorderThickness" Value="1"/>
        <Setter Property="Padding" Value="10,6"/>
        <Setter Property="FontSize" Value="13"/>
        <Setter Property="CaretBrush" Value="{StaticResource AccentBrush}"/>
        <Setter Property="Template">
            <Setter.Value>
                <ControlTemplate TargetType="TextBox">
                    <Border x:Name="border" 
                            Background="{TemplateBinding Background}" 
                            BorderBrush="{TemplateBinding BorderBrush}" 
                            BorderThickness="{TemplateBinding BorderThickness}" 
                            CornerRadius="6">
                        <ScrollViewer x:Name="PART_ContentHost" Focusable="false" HorizontalScrollBarVisibility="Hidden" VerticalScrollBarVisibility="Hidden"/>
                    </Border>
                    <ControlTemplate.Triggers>
                        <Trigger Property="IsFocused" Value="true">
                            <Setter TargetName="border" Property="BorderBrush" Value="{StaticResource AccentBrush}"/>
                        </Trigger>
                    </ControlTemplate.Triggers>
                </ControlTemplate>
            </Setter.Value>
        </Setter>
    </Style>

</ResourceDictionary>`
  },
  {
    name: "MainWindow.xaml",
    path: "UMN.DeviceManager.UI/MainWindow.xaml",
    language: "xml",
    content: `<Window x:Class="UMN.DeviceManager.UI.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:vms="clr-namespace:UMN.DeviceManager.UI.ViewModels"
        mc:Ignorable="d"
        Title="UMN Device Manager v1.0.0" 
        Height="720" Width="1200"
        Background="{StaticResource BackgroundBrush}"
        WindowStartupLocation="CenterScreen">
    
    <Grid>
        <Grid.ColumnDefinitions>
            <!-- Navigation Sidebar (Width 240px) -->
            <ColumnDefinition Width="240"/>
            <!-- Main Work Panel -->
            <ColumnDefinition Width="*"/>
        </Grid.ColumnDefinitions>

        <!-- SIDEBAR PANEL -->
        <Border Grid.Column="0" Background="{StaticResource CardBrush}" BorderBrush="{StaticResource BorderBrush}" BorderThickness="0,0,1,0">
            <Grid Margin="15">
                <Grid.RowDefinitions>
                    <RowDefinition Height="Auto"/>
                    <RowDefinition Height="*"/>
                    <RowDefinition Height="Auto"/>
                </Grid.RowDefinitions>

                <!-- Branding Core Header -->
                <StackPanel Grid.Row="0" Margin="0,10,0,30">
                    <TextBlock Text="UMN" FontSize="24" FontWeight="Bold" Foreground="{StaticResource AccentBrush}" LetterSpacing="2"/>
                    <TextBlock Text="DEVICE MANAGER" FontSize="11" FontWeight="SemiBold" Foreground="{StaticResource TextSecondaryBrush}" Margin="0,2,0,0"/>
                </StackPanel>

                <!-- Sidebar Tab Navigation Links -->
                <StackPanel Grid.Row="1" Spacing="8">
                    <RadioButton Content="Dashboard" Style="{StaticResource ToggleButtonStyle}" IsChecked="True"/>
                    <RadioButton Content="File Explorer" Style="{StaticResource ToggleButtonStyle}"/>
                    <RadioButton Content="APK Manager" Style="{StaticResource ToggleButtonStyle}"/>
                    <RadioButton Content="Backup &amp; Restore" Style="{StaticResource ToggleButtonStyle}"/>
                    <RadioButton Content="Real-Time Logcat" Style="{StaticResource ToggleButtonStyle}"/>
                    <RadioButton Content="Fastboot Flasher" Style="{StaticResource ToggleButtonStyle}"/>
                </StackPanel>

                <!-- Connection Indicator Footer -->
                <Border Grid.Row="2" Background="#1E293B" CornerRadius="8" Padding="12" BorderBrush="{StaticResource BorderBrush}" BorderThickness="1">
                    <StackPanel>
                        <TextBlock Text="Simulated Backend" Foreground="{StaticResource TextSecondaryBrush}" FontSize="11"/>
                        <StackPanel Orientation="Horizontal" Margin="0,5,0,0">
                            <Ellipse Width="8" Height="8" Fill="{StaticResource SuccessBrush}" VerticalAlignment="Center" Margin="0,0,6,0"/>
                            <TextBlock Text="ADB &amp; Fastboot Online" Foreground="{StaticResource TextPrimaryBrush}" FontWeight="Medium" FontSize="12"/>
                        </StackPanel>
                    </StackPanel>
                </Border>
            </Grid>
        </Border>

        <!-- MAIN CONTAINER -->
        <Grid Grid.Column="1" Margin="25">
            <Grid.RowDefinitions>
                <RowDefinition Height="Auto"/> <!-- Title / Toolbar Header -->
                <RowDefinition Height="*"/>    <!-- Subview Content Workspace -->
                <RowDefinition Height="Auto"/> <!-- Global Operations Status Bar -->
            </Grid.RowDefinitions>

            <!-- Dashboard Active Context Header -->
            <Grid Grid.Row="0" Margin="0,0,0,25">
                <StackPanel>
                    <TextBlock Text="Active ADB Device Status" Style="{StaticResource HeaderStyle}" FontSize="24"/>
                    <TextBlock Text="Perform diagnostics, authorized flashing, package installation, and secure data backups." Foreground="{StaticResource TextSecondaryBrush}"/>
                </StackPanel>
                
                <StackPanel Orientation="Horizontal" HorizontalAlignment="Right" VerticalAlignment="Center">
                    <Button Content="Scan Devices" Width="120" Margin="0,0,10,0"/>
                    <Button Content="Reboot Normal" Background="{StaticResource CardBrush}" BorderThickness="1" BorderBrush="{StaticResource BorderBrush}" Width="120"/>
                </StackPanel>
            </Grid>

            <!-- Content Area Cards Mock (Dashboard Tab is selected) -->
            <Grid Grid.Row="1">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="2*"/>
                    <ColumnDefinition Width="1*"/>
                </Grid.ColumnDefinitions>
                
                <Grid.RowDefinitions>
                    <RowDefinition Height="*"/>
                </Grid.RowDefinitions>

                <!-- Main Device Metadata Table -->
                <Border Grid.Column="0" Background="{StaticResource CardBrush}" CornerRadius="12" BorderBrush="{StaticResource BorderBrush}" BorderThickness="1" Padding="20" Margin="0,0,20,0">
                    <Grid>
                        <Grid.RowDefinitions>
                            <RowDefinition Height="Auto"/>
                            <RowDefinition Height="*"/>
                        </Grid.RowDefinitions>

                        <TextBlock Grid.Row="0" Text="Device Hardware Information" FontWeight="SemiBold" FontSize="16" Foreground="{StaticResource TextPrimaryBrush}" Margin="0,0,0,15"/>

                        <ListView Grid.Row="1" Background="Transparent" BorderThickness="0" SelectionMode="None">
                            <!-- Custom rows populated with key properties (Serial, Model, Android OS, Battery, Root status) -->
                        </ListView>
                    </Grid>
                </Border>

                <!-- Actions / Console Console Log Frame -->
                <Border Grid.Column="1" Background="{StaticResource CardBrush}" CornerRadius="12" BorderBrush="{StaticResource BorderBrush}" BorderThickness="1" Padding="20">
                    <Grid>
                        <Grid.RowDefinitions>
                            <RowDefinition Height="Auto"/>
                            <RowDefinition Height="*"/>
                        </Grid.RowDefinitions>
                        <TextBlock Grid.Row="0" Text="Serilog Process Console" FontWeight="SemiBold" FontSize="16" Foreground="{StaticResource TextPrimaryBrush}" Margin="0,0,0,15"/>
                        <TextBox Grid.Row="1" IsReadOnly="True" AcceptsReturn="True" TextWrapping="Wrap" Background="#0F172A" FontFamily="Consolas" FontSize="11" Text="[INFO] AdbService initialized.\\n[INFO] Device Monitoring active...\\n[INFO] Pixel 8 Pro detected (ADB Mode)"/>
                    </Grid>
                </Border>
            </Grid>

            <!-- Status Bar Footer -->
            <Border Grid.Row="2" Height="30" Margin="0,15,0,0" BorderBrush="{StaticResource BorderBrush}" BorderThickness="0,1,0,0">
                <Grid Margin="0,8,0,0">
                    <TextBlock Text="Device Connected: Serial 2A8B3C4D | Battery Status: 85% Charging" Foreground="{StaticResource TextSecondaryBrush}" FontSize="12" VerticalAlignment="Center"/>
                    <TextBlock Text="v1.0.0 Stable (Authorized Operations Only)" Foreground="{StaticResource TextSecondaryBrush}" FontSize="12" HorizontalAlignment="Right" VerticalAlignment="Center"/>
                </Grid>
            </Border>
        </Grid>
    </Grid>
</Window>`
  },
  {
    name: "MainWindow.xaml.cs",
    path: "UMN.DeviceManager.UI/MainWindow.xaml.cs",
    language: "csharp",
    content: `using System.Windows;
using UMN.DeviceManager.UI.ViewModels;

namespace UMN.DeviceManager.UI
{
    public partial class MainWindow : Window
    {
        public MainWindow(MainWindowViewModel viewModel)
        {
            InitializeComponent();
            DataContext = viewModel;
        }
    }
}`
  },
  {
    name: "MainWindowViewModel.cs",
    path: "UMN.DeviceManager.UI/ViewModels/MainWindowViewModel.cs",
    language: "csharp",
    content: `using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Threading;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Serilog;
using UMN.DeviceManager.Core.Interfaces;
using UMN.DeviceManager.Core.Models;

namespace UMN.DeviceManager.UI.ViewModels
{
    public partial class MainWindowViewModel : ObservableObject, IDisposable
    {
        private readonly IAdbService _adbService;
        private readonly IFastbootService _fastbootService;
        private readonly DispatcherTimer _monitorTimer;
        private readonly CancellationTokenSource _cts;

        [ObservableProperty]
        private Device? _selectedDevice;

        [ObservableProperty]
        private string _statusBarMessage = "Ready. No devices connected.";

        [ObservableProperty]
        private bool _isScanning;

        public ObservableCollection<Device> ConnectedDevices { get; } = new();

        public MainWindowViewModel(IAdbService adbService, IFastbootService fastbootService)
        {
            _adbService = adbService;
            _fastbootService = fastbootService;
            _cts = new CancellationTokenSource();

            // Set up background monitoring thread at 3000ms intervals
            _monitorTimer = new DispatcherTimer
            {
                Interval = TimeSpan.FromSeconds(3)
            };
            _monitorTimer.Tick += async (s, e) => await ScanDevicesSilentlyAsync();
            _monitorTimer.Start();

            // Perform initial scan
            _ = ScanDevicesAsync();
        }

        [RelayCommand]
        public async Task ScanDevicesAsync()
        {
            if (IsScanning) return;
            IsScanning = true;
            StatusBarMessage = "Scanning for Android devices...";
            Log.Information("Scanning for USB connected Android devices...");

            try
            {
                await RefreshDevicesListAsync(_cts.Token);
                
                if (ConnectedDevices.Any())
                {
                    SelectedDevice = ConnectedDevices.First();
                    StatusBarMessage = $"Active device connected: {SelectedDevice.Serial} ({SelectedDevice.Mode})";
                    Log.Information("Found device: {Serial} in {Mode} mode", SelectedDevice.Serial, SelectedDevice.Mode);
                }
                else
                {
                    SelectedDevice = null;
                    StatusBarMessage = "No authorized device connected.";
                    Log.Information("No devices found during active hardware sweep.");
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Hardware scan encountered an error.");
                StatusBarMessage = "Scan error. Check ADB and Fastboot paths.";
            }
            finally
            {
                IsScanning = false;
            }
        }

        private async Task ScanDevicesSilentlyAsync()
        {
            if (IsScanning) return;
            try
            {
                await RefreshDevicesListAsync(_cts.Token);
                
                if (SelectedDevice != null && !ConnectedDevices.Any(d => d.Serial == SelectedDevice.Serial))
                {
                    SelectedDevice = null;
                    StatusBarMessage = "Device disconnected.";
                    Log.Warning("Active monitoring reported previous device disconnected.");
                }
                else if (SelectedDevice == null && ConnectedDevices.Any())
                {
                    SelectedDevice = ConnectedDevices.First();
                    StatusBarMessage = $"Active device detected: {SelectedDevice.Serial}";
                    Log.Information("Active monitoring reported new device connection: {Serial}", SelectedDevice.Serial);
                }
            }
            catch (Exception ex)
            {
                Log.Verbose(ex, "Background device polling encountered a normal transient exception.");
            }
        }

        private async Task RefreshDevicesListAsync(CancellationToken token)
        {
            var adbDevices = await _adbService.GetConnectedDevicesAsync(token);
            var fbDevices = await _fastbootService.GetConnectedDevicesAsync(token);

            ConnectedDevices.Clear();

            foreach (var dev in adbDevices)
            {
                // Retrieve deep properties in the background asynchronously
                var detailed = await _adbService.GetDeviceDetailsAsync(dev.Serial, token);
                ConnectedDevices.Add(detailed);
            }

            foreach (var dev in fbDevices)
            {
                ConnectedDevices.Add(dev);
            }
        }

        [RelayCommand]
        public async Task RebootDeviceAsync(string mode)
        {
            if (SelectedDevice == null) return;
            
            Log.Information("Rebooting active device to mode: {Mode}", mode);
            StatusBarMessage = $"Sending reboot payload ({mode})...";

            try
            {
                bool success = false;
                if (SelectedDevice.Mode == ConnectionMode.Adb)
                {
                    success = await _adbService.RebootAsync(SelectedDevice.Serial, mode, _cts.Token);
                }
                else if (SelectedDevice.Mode == ConnectionMode.Fastboot)
                {
                    success = await _fastbootService.RebootAsync(SelectedDevice.Serial, mode, _cts.Token);
                }

                if (success)
                {
                    StatusBarMessage = $"Reboot success. Waiting for device reboot Cycle...";
                    Log.Information("Device reboot payload accepted.");
                }
                else
                {
                    StatusBarMessage = "Reboot command declined by device controller.";
                    Log.Error("Device controller declined reboot request.");
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Reboot command failed.");
                StatusBarMessage = "Failed to dispatch reboot payload.";
            }
        }

        public void Dispose()
        {
            _monitorTimer.Stop();
            _cts.Cancel();
            _cts.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}`
  },
  {
    name: "AdbServiceTests.cs",
    path: "UMN.DeviceManager.Tests/AdbServiceTests.cs",
    language: "csharp",
    content: `using System.Threading.Tasks;
using Xunit;
using UMN.DeviceManager.Core.Models;
using UMN.DeviceManager.Services.Adb;

namespace UMN.DeviceManager.Tests
{
    public class AdbServiceTests
    {
        [Fact]
        public void AdbService_ShouldInitializeCorrectly()
        {
            // Arrange & Act
            var adb = new AdbService("adb");

            // Assert
            Assert.NotNull(adb);
        }

        [Fact]
        public async Task GetConnectedDevicesAsync_ShouldReturnEmptyList_WhenNoProcessPathConfigured()
        {
            // Arrange
            var adb = new AdbService("invalid_adb_executable_path_does_not_exist");

            // Act
            var devices = await adb.GetConnectedDevicesAsync();

            // Assert
            Assert.Empty(devices);
        }
    }
}`
  },
  {
    name: "UMN.DeviceManager.Tests.csproj",
    path: "UMN.DeviceManager.Tests/UMN.DeviceManager.Tests.csproj",
    language: "xml",
    content: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <IsPackable>false</IsPackable>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
    <PackageReference Include="xunit" Version="2.5.3" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.5.3" />
    <ProjectReference Include="..\\UMN.DeviceManager.Core\\UMN.DeviceManager.Core.csproj" />
    <ProjectReference Include="..\\UMN.DeviceManager.Services\\UMN.DeviceManager.Services.csproj" />
  </ItemGroup>
</Project>`
  },
  {
    name: "README.md",
    path: "README.md",
    language: "markdown",
    content: `# UMN Device Manager

UMN Device Manager is a highly professional, secure, and modern Windows desktop application built with .NET 8, WPF, and MVVM, designed specifically for legal and authorized management of Android devices.

## 🛠 Features

- **ADB Device Detection**: Connects and polls connected devices securely in the background.
- **Fastboot Mode Interoperability**: Detects bootloader-level devices safely and manages critical partitions.
- **Deep Diagnostics**: Extracts hardware particulars including manufacturer, CPU, precise Android release version, battery levels, and block storage states.
- **Async Execution**: Non-blocking IO pipelines built entirely with modern \`async/await\` constructs, utilizing Cancellation Tokens and timeouts.
- **File System Explorer**: Browse, create directories, upload, download, and delete device assets with non-blocking interfaces.
- **APK Manager**: Authorized application management (listing packages, installing APK packages, uninstalling third-party user apps).
- **Logcat Viewer**: Live asynchronous system logging stream with filtering mechanisms.
- **Safeguarded Fastboot Flashing**: Supports partition image flashing (e.g. boot, recovery) requiring explicit double-confirmation prompts to prevent accidental hardware damage.
- **Clean Architecture & Solid Design**: Separated completely into Core, Services, UI, and Test layers.

## 📁 Solution Architecture

\`\`\`
├── UMN.DeviceManager.sln          # VS 2022 Solution file
├── UMN.DeviceManager.Core/        # Core contracts, Models, and Service Interfaces
├── UMN.DeviceManager.Services/    # Concrete ADB & Fastboot system CLI processes wrappers
├── UMN.DeviceManager.UI/          # Modern Dark/Slate Theme WPF application (WPF, MVVM)
└── UMN.DeviceManager.Tests/       # xUnit Unit tests matching business logic execution
\`\`\`

## 🚀 Building & Compilation Instructions

1. **System Requirements**: 
   - Windows 10/11 x64
   - Visual Studio 2022 with **.NET Desktop Development** workload.
   - .NET 8.0 SDK or higher.

2. **Clone and Open Solution**:
   - Open Visual Studio 2022.
   - Click "Open a project or solution" and select \`UMN.DeviceManager.sln\`.

3. **Restore Dependencies**:
   - NuGet packages will be automatically restored on build.
   - Core libraries utilized:
     - \`CommunityToolkit.Mvvm\` (v8.2.2)
     - \`Microsoft.Extensions.DependencyInjection\` (v8.0.0)
     - \`Serilog.Sinks.File\` (v6.0.0)
     - \`Serilog\` (v4.0.0)
     - \`xunit\` (v2.5.3)

4. **Compile Solution**:
   - Go to Build -> Build Solution (or press \`Ctrl+Shift+B\`).
   - The compiled WPF application will reside in \`UMN.DeviceManager.UI\\bin\\Debug\\net8.0-windows\\UMN.DeviceManager.UI.exe\`.

5. **Testing**:
   - Go to Test -> Run All Tests in Visual Studio to execute the xUnit test runner verifying mock ADB commands.
`
  }
];
