# ⚔️ @habrmnc/bankai

[![npm version](https://img.shields.io/npm/v/@habrmnc/bankai.svg?style=flat-square)](https://www.npmjs.com/package/@habrmnc/bankai)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

🔥 **Enter your flow state and track your sessions like a Soul Reaper.**

`@habrmnc/bankai` is a premium, minimalist command-line productivity tool designed for developers who want to track their deep work, manage Pomodoro sessions, and monitor focus efficiency with global activity detection.

Developed by [Habrmnc](https://habrhmnc.dev/)

---

## 🚀 Key Features

- **🎯 Task & Project Tracking**: Organize your deep work by specific tasks and project categories.
- **⏲️ Pomodoro Focus Mode**: High-release focus sessions with live countdowns.
- **💤 Smart Idle Detection**: Captures global mouse/keyboard activity and calculates your **Focus Efficiency %** in real-time.
- **📊 Detailed Reporting**:
  - Daily, Weekly, and Monthly data views.
  - Custom Date Range filtering (`--from` and `--to`).
  - Professional ASCII table exports (`--table`).
- **🎨 Premium Aesthetics**: Dynamic gradients, ASCII art, and smooth animations powered by `chalk` and `figlet`.

---

## 🛠️ Installation

### Method 1: Global Install (Recommended)
You can install BANKAI directly from npm:

```bash
npm install -g @habrmnc/bankai
```

### Method 2: Development Install
If you'd like to run it locally or contribute:

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Habeeb-Rahman-CA/Bankai-CLI.git
   cd Bankai-CLI
   npm install
   ```

2. **Link for CLI Use**:
   ```bash
   npm link
   ```

> [!IMPORTANT]
> This tool uses `uiohook-napi` for system-wide idle detection. If you are on Linux or macOS, you may need additional build tools or permissions for global input listeners.

---

## 📖 Command Guide

### 1. `bankai start <task>`
Begin tracking an active work session.
```bash
bankai start "Refactoring UI Components" --project "Dashboard-V2"
```

### 2. `bankai focus <minutes>`
Activate Pomodoro mode with a live spinner.
```bash
# Focus for 50 minutes on a specific task
bankai focus 50 --task "Database Migration" --project "Backend"
```

### 3. `bankai report`
Unlock your productivity insights with advanced filters.

- **Today**: `bankai report -d`
- **This Week**: `bankai report -w`
- **Last 30 Days**: `bankai report -m`
- **Table Summary**: `bankai report -t`
- **Custom Range**: `bankai report -f 2026-03-01 -e 2026-03-31`

---

## 🎨 Design Philosophy
Inspired by the "release" concept of Bankai, this CLI turns mundane task tracking into a visually engaging experience. It uses **gradient-string** for its iconic magenta-to-red aura and **cli-table3** for precise, data-dense summaries.

## 📄 License
MIT © [Habrmnc](https://habrhmnc.dev/)

---
*Created with ❤️ for deep work enthusiasts.*
