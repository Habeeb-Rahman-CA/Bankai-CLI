# ⚔️ BANKAI CLI - Deep Work Tracker

🔥 **Enter your flow state and track your sessions like a Soul Reaper.**

BANKAI is a minimalist yet powerful command-line productivity tool designed for developers who want to track their deep work, manage Pomodoro sessions, and monitor their focus efficiency with global idle detection.

Developed by [Habrmnc](https://habrhmnc.dev/)

---

## 🚀 Key Features

- **🎯 Task & Project Tracking**: Organize your focus sessions by task name and project categories.
- **⏲️ Pomodoro Focus Mode**: Fixed-duration timers with live countdowns.
- **💤 Global Idle Detection**: Automatically detects when you move away from your computer and calculates your **Focus Efficiency %**.
- **📊 Advanced Reporting**:
  - Daily, Weekly, and Monthly summaries.
  - Custom Date Range filtering (`--from` and `--to`).
  - Beautifully formatted ASCII tables (`--table`).
- **⚡ Ultra Lightweight**: Minimal dependencies, pure productivity.

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Habeeb-Rahman-CA/Bankai-CLI.git
   cd Bankai-CLI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Link the CLI globally**:
   ```bash
   # This will make the 'bankai' command available everywhere
   npm link
   ```

> [!IMPORTANT]
> This tool uses `uiohook-napi` for global idle detection. Ensure you have the necessary build tools installed on your OS if compilation is required.

---

## 📖 Command Guide

### 1. Start Tracking
Begin a manual tracking session.
```bash
bankai start "Implementing Auth Module" -p "My App"
```

### 2. Stop Tracking
Finalize the active session.
```bash
bankai stop
```

### 3. Focus Mode (Pomodoro)
Start a timed session with a live countdown.
```bash
# Focus for 25 minutes
bankai focus 25 --task "Code Review" -p "Internal"
```

### 4. Advanced Reporting
View your focus data in various formats.

- **Standard Report**: `bankai report`
- **Table View**: `bankai report --table`
- **Time Filters**:
  - `bankai report --daily`
  - `bankai report --weekly`
  - `bankai report --monthly`
- **Date Ranges**:
  - `bankai report --from 2026-03-01 --to 2026-03-31`

---

## 🎨 Aesthetics
BANKAI uses `chalk`, `figlet`, and `gradient-string` to provide a premium terminal experience. Every report and help screen is designed to inspire focus and power.

## 📄 License
This project is licensed under the ISC License.

---
*Created with ❤️ by Habrmnc*
