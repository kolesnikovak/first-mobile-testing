import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';
import { AccessibilityPage, AccessibilityServicePage } from '../pages';

/**
 * Test Case: Accessibility Service Step Validation (POM Pattern)
 * 
 * Steps:
 * 1. Tap "Accessibility"
 * 2. Tap "Accessibility Service"
 * 3. Validate all steps 1-8 are visible as text
 */

test.describe('Accessibility Service - Step Validation', () => {
  let driver: Browser;
  let accessibilityPage: AccessibilityPage;
  let accessibilityServicePage: AccessibilityServicePage;

  test.beforeEach(async () => {
    console.log('\nStarting test setup...');
    
    const deviceName = process.env.DEVICE_NAME || 'emulator-5554';
    const appPath = path.join(__dirname, 'app.apk');
    
    let config = getConfig('emulator');
    config = setAppPath(config, appPath);
    config = setDeviceName(config, deviceName);
    
    driver = await remote(config);
    console.log('Setup complete');
    
    // Initialize Page Objects
    accessibilityPage = new AccessibilityPage(driver);
    accessibilityServicePage = new AccessibilityServicePage(driver);
  });

  test.afterEach(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('TC-004: Navigate to Accessibility Service and validate steps 1-8', async () => {
    console.log('\nTest: Accessibility Service Step Validation');
    console.log('========================================');
    
    // Wait for app to load
    await driver.pause(2000);
    
    // Step 1: Navigate to Accessibility
    await accessibilityPage.navigateToAccessibility();
    
    // Take screenshot after first tap
    const screenshot1 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/accessibility-menu.png', screenshot1, 'base64');
    console.log('Screenshot saved: accessibility-menu.png');
    
    // Step 2: Navigate to Accessibility Service
    await accessibilityPage.navigateToAccessibilityService();
    
    // Step 3: Validate all steps 1-8
    console.log('\nStep: Validate steps 1-8 are visible');
    const verificationResults = await accessibilityServicePage.verifyAllSteps(8);
    
    // Assert all steps are found
    verificationResults.forEach((isPresent, index) => {
      expect(isPresent).toBeTruthy();
      console.log(`Step ${index + 1} verified: ${isPresent ? 'PASS' : 'FAIL'}`);
    });
    
    // Take screenshot of service page
    await accessibilityServicePage.captureServiceScreen();
    
    // Summary
    console.log('\nTest Summary:');
    console.log('----------------------------------------');
    console.log('Step 1: Navigated to Accessibility menu');
    console.log('Step 2: Navigated to Accessibility Service');
    console.log('Step 3: Validated all 8 steps are present');
    
    console.log('\nTest Passed: All steps verified successfully');
    console.log('========================================\n');
  });
});
