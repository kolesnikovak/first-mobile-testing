# 🚀 Quick Start Guide

## Prerequisites Checklist
- [ ] Android Studio installed
- [ ] Android SDK configured
- [ ] Environment variables set (ANDROID_HOME)
- [ ] Appium installed globally
- [ ] UIAutomator2 driver installed
- [ ] Emulator created or device connected

## Step-by-Step Execution

### 1. Start Android Emulator

```bash
# List available emulators
emulator -list-avds

# Start your emulator
emulator -avd <YOUR_AVD_NAME> &

# Verify it's running
adb devices
# You should see: emulator-5554 device
```

### 2. Start Appium Server

**Open a NEW terminal window** and run:

```bash
appium
```

Keep this terminal open! You should see:
```
[Appium] Appium REST http interface listener started on 0.0.0.0:4723
```

### 3. Update Device Configuration

Edit `src/config/appium.config.ts` and update the device name:

```typescript
'appium:deviceName': 'emulator-5554', // Replace with your device from 'adb devices'
```

### 4. Run Your First Test

**In your original terminal**:

```bash
# Run basic example test
npm run test:example

# Or run all tests
npm test
```

## Common Issues & Quick Fixes

### Issue: "Cannot connect to Appium"
**Solution:** Make sure Appium is running in a separate terminal

### Issue: "Device not found"
**Solution:** Run `adb devices` and update device name in config

### Issue: "App not found"
**Solution:** Verify `tests/app.apk` exists and path is correct

### Issue: "Element not found"
**Solution:** Use Appium Inspector to find the correct locator

## Using Appium Inspector

1. Start Appium server
2. Open Appium Inspector
3. Configure:
   - Host: `localhost`
   - Port: `4723`
   - Path: `/`

4. Desired Capabilities:
```json
{
  "platformName": "Android",
  "appium:deviceName": "emulator-5554",
  "appium:automationName": "UiAutomator2",
  "appium:app": "/Users/YOUR_USERNAME/Downloads/first-mobile-testing/tests/app.apk"
}
```

5. Click "Start Session"
6. Click elements to see their locators

## Available NPM Scripts

```bash
npm test                  # Run all tests
npm run test:example      # Run example tests only
npm run test:advanced     # Run advanced tests only
npm run test:headed       # Run with visible browser
npm run test:debug        # Run in debug mode
npm run test:report       # View test report
npm run devices           # List connected devices
```

## Test Workflow

1. ✅ **Start Emulator** → `emulator -avd YOUR_AVD`
2. ✅ **Start Appium** → `appium` (in new terminal)
3. ✅ **Find Elements** → Use Appium Inspector
4. ✅ **Write Tests** → Create/modify test files
5. ✅ **Run Tests** → `npm test`

## Next Steps

1. Explore `tests/example.spec.ts` to see basic test patterns
2. Check `tests/advanced.spec.ts` for advanced techniques
3. Read `TESTING-FRAMEWORK-README.md` for detailed documentation
4. Create your own page objects in `src/pages/`
5. Add your own tests in `tests/`

---

**Need Help?** Check the full documentation in `TESTING-FRAMEWORK-README.md`
