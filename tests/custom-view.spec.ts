import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';
import { AccessibilityPage, CustomViewPage } from '../pages';

/**
 * Test Case: Accessibility Custom View Verification (POM Pattern)
 * 
 * Steps:
 * 1. Open the app APIDemos.apk
 * 2. Tap 'Accessibility' menu element
 * 3. Tap 'Custom View' menu element
 * 4. Verify expected text is displayed
 */

test.describe('Accessibility - Custom View Verification', () => {
  let driver: Browser;
  let accessibilityPage: AccessibilityPage;
  let customViewPage: CustomViewPage;

  test.beforeEach(async () => {
    console.log('\nStarting test setup...');
    
    const deviceName = process.env.DEVICE_NAME || 'emulator-5554';
    const appPath = path.join(__dirname, 'app.apk');
    
    let config = getConfig('emulator');
    config = setAppPath(config, appPath);
    config = setDeviceName(config, deviceName);
    
    driver = await remote(config);
    console.log('Setup complete - APIDemos.apk opened');
    
    // Initialize Page Objects
    accessibilityPage = new AccessibilityPage(driver);
    customViewPage = new CustomViewPage(driver);
  });

  test.afterEach(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('TC-006: Navigate to Custom View and verify instructional text', async () => {
    console.log('\nTest: Accessibility Custom View Verification');
    console.log('========================================');
    
    // Wait for app to load
    await driver.pause(2000);
    
    // Step 2: Navigate to Accessibility menu
    await accessibilityPage.navigateToAccessibility();
    
    // Take screenshot after navigating to Accessibility
    const screenshot1 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/accessibility-menu-customview.png', screenshot1, 'base64');
    console.log('Screenshot saved: accessibility-menu-customview.png');
    
    // Step 3: Navigate to Custom View
    await accessibilityPage.navigateToCustomView();
    
    // Step 4: Verify instructional text
    console.log('\nStep: Verify instructional text');
    const verificationResults = await customViewPage.verifyAllInstructions();
    
    // Assert all steps are present
    expect(verificationResults.step1).toBeTruthy();
    expect(verificationResults.step2).toBeTruthy();
    expect(verificationResults.step3).toBeTruthy();
    
    // Take screenshot of Custom View page
    await customViewPage.captureCustomViewScreen();
    
    // Summary
    console.log('\nTest Summary:');
    console.log('----------------------------------------');
    console.log('Step 1: App opened successfully');
    console.log('Step 2: Navigated to Accessibility menu');
    console.log('Step 3: Navigated to Custom View');
    console.log('Step 4: Verified instructional text');
    
    console.log('\nTest Passed: Custom View text verification complete');
    console.log('========================================\n');
  });
});
