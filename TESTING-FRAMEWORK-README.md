# 📱 Mobile Testing Framework

A professional mobile testing framework using **Appium**, **WebDriverIO**, **Playwright**, and **TypeScript** with **Page Object Model** (POM) design pattern.

## 🎯 Features

- ✅ **Page Object Model** - Maintainable and reusable code structure
- ✅ **TypeScript** - Type-safe test development
- ✅ **Best Practice Locator Strategy** - Priority-based element location
- ✅ **Driver Management** - Centralized WebDriver lifecycle handling
- ✅ **Test Helpers** - Utility functions for common test operations
- ✅ **Configuration Management** - Environment-specific configurations
- ✅ **Screenshot Support** - Automatic screenshot capture on failure

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** (LTS version) - [Download](https://nodejs.org/)
- ✅ **Android Studio** with SDK - [Download](https://developer.android.com/studio)
- ✅ **Appium** - Installed globally
- ✅ **Appium Inspector** - For element inspection
- ✅ **Android Emulator or Device** - Running and connected

### Environment Variables

Ensure these are set in your `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
```

## 🚀 Quick Start

### 1. Verify Your Setup

```bash
# Check Node.js
node -v

# Check ADB
adb version

# Check connected devices
adb devices

# Check Appium
appium -v

# Check UIAutomator2 driver
appium driver list --installed
```

### 2. Start Your Emulator

```bash
# List available emulators
emulator -list-avds

# Start emulator (replace with your AVD name)
emulator -avd <YOUR_AVD_NAME> &

# Verify connection
adb devices
```

### 3. Start Appium Server

Open a **new terminal** and run:

```bash
appium
```

Leave this terminal running. You should see:
```
[Appium] Appium REST http interface listener started on 0.0.0.0:4723
```

### 4. Run Your Tests

In your **original terminal**:

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/example.spec.ts

# Run tests in headed mode (with browser visible)
npx playwright test --headed

# Run with debug output
npx playwright test --debug
```

## 📁 Project Structure

```
first-mobile-testing/
├── src/
│   ├── config/
│   │   └── appium.config.ts      # Appium configuration
│   ├── pages/
│   │   ├── BasePage.ts            # Base page object class
│   │   └── ApiDemosPage.ts        # Example page object
│   └── utils/
│       ├── DriverManager.ts       # WebDriver lifecycle management
│       └── TestHelpers.ts         # Utility functions
├── tests/
│   ├── example.spec.ts            # Basic test examples
│   ├── advanced.spec.ts           # Advanced test examples
│   └── app.apk                    # Test application
├── screenshots/                    # Auto-generated screenshots
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies
```

## 🎓 Testing Workflow

### 1. Test Case Creation
Create your test cases before implementation:
- Define test scenarios
- Identify test data requirements
- Plan assertion points

### 2. Manual Execution
Execute the test manually to understand the flow:
- Launch the app
- Perform actions manually
- Note element properties using Appium Inspector

### 3. Automation

#### Find Elements with Appium Inspector

1. **Start Appium Server** (if not already running)
2. **Open Appium Inspector**
3. **Configure Connection:**
   - Remote Host: `localhost`
   - Remote Port: `4723`
   - Remote Path: `/`

4. **Set Desired Capabilities:**
```json
{
  "platformName": "Android",
  "appium:deviceName": "emulator-5554",
  "appium:automationName": "UiAutomator2",
  "appium:app": "/absolute/path/to/first-mobile-testing/tests/app.apk"
}
```

5. **Start Session** and inspect elements

#### Element Locator Strategy

**Priority Order:**

1. 🥇 **Accessibility ID** (Best Practice)
   ```typescript
   const locator = '~AccessibilityIdValue';
   ```

2. 🥈 **Resource ID**
   ```typescript
   const locator = 'android=new UiSelector().resourceId("com.example:id/button")';
   ```

3. 🥉 **UiAutomator**
   ```typescript
   const locator = 'android=new UiSelector().text("Button Text")';
   ```

## 📝 Writing Tests

### Basic Test Example

```typescript
import { test } from '@playwright/test';
import { DriverManager } from '../src/utils/DriverManager';
import { ApiDemosPage } from '../src/pages/ApiDemosPage';

test('My First Test', async () => {
  // Create driver
  const driver = await DriverManager.createDriver();
  
  // Initialize page object
  const page = new ApiDemosPage(driver);
  
  // Perform actions
  await page.verifyAppLaunched();
  await page.clickMenuItem('Accessibility');
  
  // Cleanup
  await DriverManager.quitDriver();
});
```

### Creating a New Page Object

```typescript
import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  // Define locators
  private readonly locators = {
    button: '~myButton',
    input: 'android=new UiSelector().resourceId("com.app:id/input")',
  };

  constructor(driver: Browser) {
    super(driver);
  }

  // Define actions
  async clickButton() {
    await this.click(this.locators.button);
  }

  async enterText(text: string) {
    await this.sendKeys(this.locators.input, text);
  }
}
```

## 🛠️ Configuration

### Change Device Name

Edit `src/config/appium.config.ts`:

```typescript
export function getAppiumConfig(): AppiumConfig {
  return {
    // ... other config
    capabilities: {
      'appium:deviceName': 'YOUR_DEVICE_NAME', // Change this
      // ... other capabilities
    }
  };
}
```

### Change App Path

The app path is automatically set to `tests/app.apk`. To change:

```typescript
'appium:app': `${process.cwd()}/path/to/your/app.apk`,
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Cannot find server at URL"** | Appium server not running. Start with `appium` |
| **"UIAutomator2 not found"** | Run `appium driver install uiautomator2` |
| **"adb not recognized"** | Add Android SDK to PATH and restart terminal |
| **"Device not found"** | Run `adb devices` to verify device connection |
| **Connection failures** | Verify URL (localhost:4723) and capabilities |
| **Element not found"** | Use Appium Inspector to find correct locator |
| **App doesn't launch"** | Verify app path is absolute in config |

### Common Commands

```bash
# Kill Appium if port is in use
killall node

# Restart ADB
adb kill-server
adb start-server

# Check Appium logs
appium --log-level debug

# List installed drivers
appium driver list --installed

# Update UIAutomator2 driver
appium driver update uiautomator2
```

## 📊 Test Reports

Playwright generates detailed test reports automatically:

```bash
# View last test report
npx playwright show-report
```

## 🔧 Advanced Features

### Taking Screenshots

```typescript
await DriverManager.takeScreenshot('test-name');
```

### Swipe Gestures

```typescript
await page.swipe('up');    // Scroll up
await page.swipe('down');  // Scroll down
await page.swipe('left');  // Swipe left
await page.swipe('right'); // Swipe right
```

### Wait for Conditions

```typescript
import { waitForCondition } from '../src/utils/TestHelpers';

await waitForCondition(async () => {
  return await page.isDisplayed(locator);
}, 10000);
```

### Retry Failed Actions

```typescript
import { retry } from '../src/utils/TestHelpers';

await retry(async () => {
  await page.click(locator);
}, 3, 1000); // 3 retries, 1 second delay
```

## 📚 Resources

- [Appium Documentation](http://appium.io/docs/en/latest/)
- [WebDriverIO Documentation](https://webdriver.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Android UIAutomator](https://developer.android.com/training/testing/other-components/ui-automator)

## 🤝 Contributing

Feel free to contribute by:
1. Adding new page objects
2. Creating reusable test helpers
3. Improving documentation
4. Adding more test examples

## 📄 License

ISC

---

**Happy Testing! 🎉**
