# 📱 Complete Mobile Testing Setup Guide

> **A comprehensive step-by-step guide to set up mobile testing from scratch**

---

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Project Configuration](#project-configuration)
- [Running Tests](#running-tests)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Step 1: Install Required Software

Download and install the following tools:

| Tool | Platform | Download Link |
|------|----------|---------------|
| **Node.js** (LTS) | All | [nodejs.org](https://nodejs.org) |
| **Android Studio** | All | [developer.android.com](https://developer.android.com/studio) |
| **Appium Inspector** | Windows | [Appium-Inspector-windows-{version}.exe](https://github.com/appium/appium-inspector/releases) |
| | Mac | [Appium-Inspector-macos-{version}.dmg](https://github.com/appium/appium-inspector/releases) |
| | Linux | [Appium-Inspector-linux-{version}.AppImage](https://github.com/appium/appium-inspector/releases) |

---

### Step 2: Install Android Studio Components

1. Open **Android Studio**
2. Click **"More Actions"** → **SDK Manager**
3. Under **"SDK Platforms"** - Check the latest Android version
4. Under **"SDK Tools"** - Check:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Intel x86 Emulator Accelerator _(if Intel CPU)_
5. Click **"Apply"** and wait for downloads to complete

---

### Step 3: Setup Environment Variables

#### 🪟 Windows

Set the following environment variable:

```plaintext
ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk
```

Add to **Path**:
```plaintext
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

#### 🍎 Mac/Linux

Add to `~/.bash_profile` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

Then run:
```bash
source ~/.zshrc
```

> ⚠️ **Important:** Restart your terminal after setting environment variables!

---

### Step 4: Create Android Emulator

1. Open **Android Studio**
2. Click **"More Actions"** → **Virtual Device Manager**
3. Click **"Create Device"**
4. Select **"Pixel 5"** → **Next**
5. Download a system image (e.g., **API 33**) → **Next**
6. Click **"Finish"**
7. Click ▶️ **Play button** to start emulator

---

### Step 5: Verify Setup

Run the following commands to verify installation:

```bash
node -v
adb version
```

✅ Both should display version numbers.

---

## Environment Setup

### Step 6: Create Project

```bash
mkdir mobile-testing
cd mobile-testing
```

---

### Step 7: Initialize Node Project

```bash
npm init -y
```

---

### Step 8: Install All Dependencies

```bash
npm install -D @playwright/test typescript
npm install -D appium
npm install -D appium-uiautomator2-driver
npm install -D webdriverio
npm install -D @wdio/types
npm install -D ts-node
```

---

### Step 9: Install Appium Globally

```bash
npm install -g appium
```

---

### Step 10: Install Appium Driver

```bash
appium driver install uiautomator2
```

---

## Project Configuration

### Step 11: Create TypeScript Config

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

### Step 12: Create Playwright Config

Create `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  use: {
    screenshot: 'only-on-failure',
  },
});
```

---

### Step 13: Create Tests Folder

```bash
mkdir tests
```

---

### Step 14: Get Sample App

Download the sample APK:

```bash
curl -o tests/app.apk https://github.com/appium/appium/raw/master/packages/appium/sample-code/apps/ApiDemos-debug.apk
```

_Or place your own `.apk` file in the tests folder._

---

## Running Tests

### Step 15: Start Emulator

**Android Studio** → **Device Manager** → Start your emulator

⏳ Wait until the home screen appears.

---

### Step 16: Get Device Name

```bash
adb devices
```

📝 You'll see something like `emulator-5554` - remember this!

---

### Step 17: Start Appium Server

Open a **NEW terminal window**:

```bash
appium
```

🟢 Leave this running. You'll see:
```
Appium REST http interface listener started on 0.0.0.0:4723
```

---

### Step 18: Use Appium Inspector to Find Elements

1. Open **Appium Inspector** app
2. Set configuration:
   - **Remote Host:** `localhost`
   - **Remote Port:** `4723`
   - **Remote Path:** `/`

3. Click **"Desired Capabilities"** tab and add:

```json
{
  "platformName": "Android",
  "appium:deviceName": "emulator-5554",
  "appium:automationName": "UiAutomator2",
  "appium:app": "/full/path/to/mobile-testing/tests/app.apk"
}
```

4. Click **"Start Session"**
5. Your app opens - click elements to see their properties
6. Copy `resource-id`, `text`, or `accessibility id` for your tests

---

### Step 19: Create Your First Test

Create `tests/mobile.spec.ts`:

```typescript
import { test } from '@playwright/test';
import { remote } from 'webdriverio';
import * as path from 'path';

test('launch and interact with android app', async () => {
  const appPath = path.join(__dirname, 'app.apk');
  
  const driver = await remote({
    hostname: 'localhost',
    port: 4723,
    logLevel: 'info',
    capabilities: {
      platformName: 'Android',
      'appium:deviceName': 'emulator-5554',
      'appium:automationName': 'UiAutomator2',
      'appium:app': appPath,
    }
  });

  console.log('✅ App launched successfully!');
  
  // Example: Find and click element (use IDs from Appium Inspector)
  // const button = await driver.$('~buttonAccessibilityId');
  // await button.click();
  
  await driver.pause(5000);
  
  await driver.deleteSession();
  console.log('✅ Test completed!');
});
```

---

### Step 20: Run Your Test

In the **ORIGINAL terminal** (not the one running Appium):

```bash
npx playwright test tests/mobile.spec.ts
```

---

## 🔄 Your Workflow Going Forward

1. **Start Emulator** (Android Studio)
2. **Start Appium** (terminal: `appium`)
3. **Use Inspector** to find elements
4. **Write tests** using element IDs from Inspector
5. **Run tests** (`npx playwright test`)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 🔴 "adb not found" | Restart terminal after setting environment variables |
| 🔴 "Cannot connect" | Check emulator is running (`adb devices`) |
| 🔴 "Port 4723 in use" | Kill appium process and restart |
| 🔴 Test fails | Check app path is absolute in Appium Inspector |

---

## 🚀 You're Ready!

You're all set to start mobile testing! Happy testing! 🎉