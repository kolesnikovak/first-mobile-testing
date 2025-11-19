import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';

/**
 * Test Case: Accessibility Service Navigation and Validation
 * 
 * Steps:
 * 1. Tap "Accessibility"
 * 2. Tap "Accessibility Service"
 * 3. Validate all steps 1-8 are visible as text
 */

test.describe('Accessibility Service - Step Validation', () => {
  let driver: Browser;

  test.beforeEach(async () => {
    console.log('\n🚀 Starting test setup...');
    
    const deviceName = process.env.DEVICE_NAME || 'emulator-5554';
    const appPath = path.join(__dirname, 'app.apk');
    
    let config = getConfig('emulator');
    config = setAppPath(config, appPath);
    config = setDeviceName(config, deviceName);
    
    driver = await remote(config);
    console.log('✅ Setup complete');
  });

  test.afterEach(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('TC-004: Navigate to Accessibility Service and validate steps 1-8', async () => {
    console.log('\n🧪 Test: Accessibility Service Step Validation');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Wait for app to load
    await driver.pause(2000);
    
    // Step 1: Tap "Accessibility"
    console.log('\n📍 Step 1: Tap "Accessibility"');
    const accessibilityOption = await driver.$('android=new UiSelector().text("Accessibility")');
    expect(await accessibilityOption.isExisting()).toBeTruthy();
    await accessibilityOption.click();
    console.log('✓ Tapped "Accessibility"');
    
    // Take screenshot after first tap
    await driver.pause(1000);
    const screenshot1 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/accessibility-menu.png', screenshot1, 'base64');
    console.log('📸 Screenshot saved: accessibility-menu.png');
    
    // Step 2: Tap "Accessibility Service"
    console.log('\n📍 Step 2: Tap "Accessibility Service"');
    const accessibilityService = await driver.$('android=new UiSelector().text("Accessibility Service")');
    expect(await accessibilityService.isExisting()).toBeTruthy();
    await accessibilityService.click();
    console.log('✓ Tapped "Accessibility Service"');
    
    // Wait for the page to load
    await driver.pause(2000);
    
    // Take screenshot of the service page
    const screenshot2 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/accessibility-service.png', screenshot2, 'base64');
    console.log('📸 Screenshot saved: accessibility-service.png');
    
    // Step 3: Validate all steps 1-8 are visible as text
    console.log('\n📍 Step 3: Validate steps 1-8 are visible');
    console.log('─────────────────────────────────────────');
    
    const stepsToValidate = [
      '1. Enable ClockBack',
      '2. Enable TalkBack',
      '3. Enable Explore by Touch',
      '4. Enable accessibility from web scripts',
      '5. Enable accessibility from the shell',
      '6. Enable accessibility from the shell by printing the event text',
      '7. Query the content provider from the shell',
      '8. Query the settings from the shell'
    ];
    
    const validationResults: { step: string; found: boolean }[] = [];
    
    for (const step of stepsToValidate) {
      const stepNumber = step.split('.')[0];
      
      // Try to find the step text
      const stepElement = await driver.$(`android=new UiSelector().textContains("${stepNumber}.")`);
      const exists = await stepElement.isExisting();
      
      validationResults.push({ step, found: exists });
      
      if (exists) {
        const elementText = await stepElement.getText();
        console.log(`✓ Step ${stepNumber}: Found - "${elementText}"`);
      } else {
        console.log(`✗ Step ${stepNumber}: NOT FOUND`);
      }
    }
    
    // Get page source for debugging
    console.log('\n📄 Getting page source for verification...');
    const pageSource = await driver.getPageSource();
    
    // Count how many steps are actually found in page source
    let stepsFoundInSource = 0;
    for (let i = 1; i <= 8; i++) {
      if (pageSource.includes(`${i}.`)) {
        stepsFoundInSource++;
      }
    }
    console.log(`📊 Steps found in page source: ${stepsFoundInSource}/8`);
    
    // Assertions
    console.log('\n🔍 Validation Results:');
    console.log('─────────────────────────────────────────');
    
    const foundCount = validationResults.filter(r => r.found).length;
    console.log(`Found: ${foundCount}/8 steps`);
    
    validationResults.forEach(result => {
      if (result.found) {
        console.log(`  ✓ ${result.step}`);
      } else {
        console.log(`  ✗ ${result.step}`);
      }
    });
    
    // Assert all steps are found
    expect(foundCount).toBeGreaterThanOrEqual(8);
    console.log('\n✅ Test Passed: All steps 1-8 are visible');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });
});