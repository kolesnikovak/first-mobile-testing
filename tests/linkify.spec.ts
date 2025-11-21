import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';
import { LinkifyPage } from '../pages';

/**
 * Test Case: Linkify Text Verification (POM Pattern)
 * 
 * Steps:
 * 1. Open the app
 * 2. Navigate to Text menu
 * 3. Navigate to Linkify
 * 4. Verify all 4 text elements are present
 */

test.describe('Text - Linkify Verification', () => {
  let driver: Browser;
  let linkifyPage: LinkifyPage;

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
    linkifyPage = new LinkifyPage(driver);
  });

  test.afterEach(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('TC-005: Navigate to Linkify and verify text elements', async () => {
    console.log('\nTest: Linkify Text Verification');
    console.log('========================================');
    
    // Wait for app to load
    await driver.pause(2000);
    
    // Step 2: Navigate to Text menu
    await linkifyPage.navigateToTextMenu();
    
    // Step 3: Navigate to Linkify
    await linkifyPage.navigateToLinkify();
    
    // Step 4: Verify all text elements
    console.log('\nStep: Verify all text elements (1-4)');
    const allTextElements = await linkifyPage.getAllTextElements();
    
    // Assert all text elements are present and not empty
    expect(allTextElements.text1).toBeTruthy();
    expect(allTextElements.text2).toBeTruthy();
    expect(allTextElements.text3).toBeTruthy();
    expect(allTextElements.text4).toBeTruthy();
    
    console.log('\nAll text elements verified:');
    console.log(`  Text 1: ${allTextElements.text1}`);
    console.log(`  Text 2: ${allTextElements.text2}`);
    console.log(`  Text 3: ${allTextElements.text3}`);
    console.log(`  Text 4: ${allTextElements.text4}`);
    
    // Verify all elements are displayed
    const allDisplayed = await linkifyPage.verifyAllTextElementsDisplayed();
    expect(allDisplayed).toBeTruthy();
    
    // Take screenshot
    await linkifyPage.captureLinkifyScreen();
    
    // Summary
    console.log('\nTest Summary:');
    console.log('----------------------------------------');
    console.log('Step 1: App opened successfully');
    console.log('Step 2: Navigated to Text menu');
    console.log('Step 3: Navigated to Linkify');
    console.log('Step 4: Verified all 4 text elements');
    
    console.log('\nTest Passed: Linkify text verification complete');
    console.log('========================================\n');
  });
});
