# UMN Device Manager Suite 📱💻

A highly polished, enterprise-grade, secure Android Device Management application. Built on top of **Electron**, **React 19**, **Vite**, **TypeScript Strict Mode**, and **Tailwind CSS**, this tool replicates the appearance of professional commercial mobile service utilities, while operating strictly within legal and authorized boundaries.

---

## 🚫 Legal & Safety Compliance Policy
UMN Device Manager complies strictly with telecom regulatory frameworks and legal device-servicing guidelines.

- **NO Security Circumvention**: Features such as FRP (Factory Reset Protection) lock bypasses, account bypasses, unauthorized bootloader unlocks, network unlocking, or IMEI modifications are **strictly excluded** from this suite.
- **Auditing**: All hardware scans, flashes, and file movements write to a secure, rolling **Serilog file-logging sink** (`%APPDATA%/UMN_DeviceManager/logs.txt`) to maintain clear audit records.

---

## 🛠️ Technology Stack
- **Desktop Shell**: Electron (Context Isolation, Secure IPC Bridge, Preload scripts)
- **Frontend Engine**: React 19, TypeScript (Strict Mode), Zustand Store, Lucide Icons, Motion Animations
- **CSS Utility**: Tailwind CSS (Optimised base compiles)
- **Tool Interops**: Safe child_process executables resolver (`adb.exe` / `fastboot.exe` wrappers)

---

## 📂 Project Architecture

```text
UMN-Device-Manager/
├── electron/
│   ├── main.js         # Core Electron main process & safe system CLI execution wrappers
│   └── preload.js      # Secure contextBridge IPC exposure to frontend
├── src/
│   ├── components/     # Modular feature tab views (Dashboard, File Explorer, Logcat, etc.)
│   ├── types.ts        # Fully-typed system interfaces
│   ├── App.tsx         # Main structural layout with Serilog console drawer
│   └── main.tsx        # React entry-point
├── .github/
│   └── workflows/
│       └── deploy.yml  # Automatic GitHub Actions build & deploy script to GitHub Pages
├── package.json        # Project scripts & Electron-Builder configurations
└── electron-builder.json # Windows installer compiler configurations (.exe generator)
```

---

## 🚀 How to Run the App Local & Package as a `.exe`

To compile, run, or bundle UMN Device Manager as a native Windows application on your desktop, follow these simple steps:

### 1. Installation
Extract the ZIP or checkout the repository to your desktop and run:
```bash
npm install
```

### 2. Run in Development Mode
To launch the hot-reloading Vite server combined with the native Electron application frame:
```bash
# In terminal 1: Start the Vite preview server
npm run dev

# In terminal 2: Launch the Electron frame
npm run electron:dev
```

### 3. Compile & Compile to a Windows Installer (.exe)
To compile the React files and pack them into a standalone Windows installer inside the `dist-electron/` directory:
```bash
npm run electron:build
```

---

## 🌐 Resolving the GitHub Pages 404 Error (`GET /src/main.tsx 404`)

If you see a `GET https://u95.github.io/src/main.tsx net::ERR_ABORTED 404 (Not Found)` error in your browser console, it means GitHub Pages is configured to serve your raw files from the branch root `/` instead of using the automated build workflow.

### 🔧 1-Minute Fix:
1. Open your repository on **GitHub**.
2. Go to **Settings** (பின்தொடர் பொத்தானை அடுத்து இருக்கும் 'Settings' தளம்).
3. In the left sidebar, click on **Pages** (பக்கங்கள்).
4. Under **Build and deployment** -> **Source**, click the dropdown and change it from **"Deploy from a branch"** to **"GitHub Actions"** (ஜிட்ஹப் ஆக்சன்ஸ்).
5. On your next push or commit, GitHub will automatically run our configured workflow (`.github/workflows/deploy.yml`), compile the TypeScript files safely to static assets inside the `dist` directory, and deploy them.

Your web-based simulation will then load flawlessly on `https://u95.github.io` without any 404 errors!
