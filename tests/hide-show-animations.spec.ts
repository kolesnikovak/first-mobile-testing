import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';
import { AnimationPage, HideShowAnimationsPage } from '../pages';

/**
 * Test Case: Animations Hide-Show Buttons (POM Pattern)
 * 
 * Steps:
 * 1. Open the app APIDemos.apk
 * 2. Tap 'Animation' menu element
 * 3. Tap 'Hide-Show Animations' menu element
 * 4. Tap on box 0 and validate it's gone
 * 5. Tap on box 1 and validate it's gone
 * 6. Tap on box 2 and validate it's gone
 * 7. Tap on box 3 and validate it's gone
 * 8. Tap on 'Show Buttons' and verify all buttons are back 
 */

test.describe('Animations - Hide-Show Buttons', () => {
  let driver: Browser;
  let animationPage: AnimationPage;
  let hideShowAnimationsPage: HideShowAnimationsPage;

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
    animationPage = new AnimationPage(driver);
    hideShowAnimationsPage = new HideShowAnimationsPage(driver);
  });

  test.afterEach(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('TC-007: Hide-Show Animations - Validate button visibility', async () => {
    console.log('\nTest: Animations Hide-Show Buttons Verification');
    console.log('========================================');
    
    // Wait for app to load
    await driver.pause(2000);
    
    // Step 2: Navigate to Animation menu
    await animationPage.navigateToAnimation();
    await animationPage.captureAnimationMenu();
    
    // Step 3: Navigate to Hide-Show Animations
    await animationPage.navigateToHideShowAnimations();
    await hideShowAnimationsPage.captureInitialState();
    
    // Steps 4-7: Hide all buttons (0-3)
    await hideShowAnimationsPage.hideAllButtons();
    
    // Step 8: Show all buttons and verify they're back
    await hideShowAnimationsPage.showAllButtons();
    const buttonVisibility = await hideShowAnimationsPage.verifyAllButtonsVisible();
    
    // Verify all buttons are visible
    expect(buttonVisibility[0]).toBeTruthy();
    expect(buttonVisibility[1]).toBeTruthy();
    expect(buttonVisibility[2]).toBeTruthy();
    expect(buttonVisibility[3]).toBeTruthy();
    
    await hideShowAnimationsPage.captureAllButtonsShown();
    
    // Summary
    console.log('\nTest Summary:');
    console.log('----------------------------------------');
    console.log('Step 1: App opened successfully');
    console.log('Step 2: Navigated to Animation menu');
    console.log('Step 3: Navigated to Hide-Show Animations');
    console.log('Step 4: Hidden button 0 and validated');
    console.log('Step 5: Hidden button 1 and validated');
    console.log('Step 6: Hidden button 2 and validated');
    console.log('Step 7: Hidden button 3 and validated');
    console.log('Step 8: Shown all buttons and validated');
    
    console.log('\nTest Passed: Hide-Show Animations complete');
    console.log('========================================\n');
  });
});
