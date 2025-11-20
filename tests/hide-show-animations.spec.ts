import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';

/**
 * Test Case: Animations Hide-Show Buttons
 * 
 * Steps:
 * 1. Open the app APIDemos.apk
 * 2. Tap 'Animations' menu element
 * 3. Tap 'Hide-Show Animations' menu element
 * 4. Tap on box 0 and validate it's gone
 * 5. Tap on box 1 and validate it's gone
 * 6. Tap on box 2 and validate it's gone
 * 7. Tap on box 3 and validate it's gone
 * 8. Tap on 'Show Buttons' and verify all buttons are back
 */

test.describe('Animations - Hide-Show Buttons', () => {
  let driver: Browser;

  test.beforeEach(async () => {
    console.log('\nStarting test setup...');
    
    const deviceName = process.env.DEVICE_NAME || 'emulator-5554';
    const appPath = path.join(__dirname, 'app.apk');
    
    let config = getConfig('emulator');
    config = setAppPath(config, appPath);
    config = setDeviceName(config, deviceName);
    
    driver = await remote(config);
    console.log('Setup complete - APIDemos.apk opened');
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
    
    // Step 2: Tap 'Animation' menu element
    console.log('\nStep 2: Tap "Animation" menu element');
    const animationsMenu = await driver.$('android=new UiSelector().text("Animation")');
    
    const animationsExists = await animationsMenu.isExisting();
    console.log(`  Element exists: ${animationsExists}`);
    expect(animationsExists).toBeTruthy();
    
    await animationsMenu.click();
    console.log('Tapped "Animation"');
    
    // Take screenshot after tapping Animations
    await driver.pause(1000);
    const screenshot1 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/animations-menu.png', screenshot1, 'base64');
    console.log('Screenshot saved: animations-menu.png');
    
    // Step 3: Tap 'Hide-Show Animations' menu element
    console.log('\nStep 3: Tap "Hide-Show Animations" menu element');
    
    // Try finding by accessibility id first, then by text
    let hideShowMenu = await driver.$('~Hide-Show Animations');
    let hideShowExists = await hideShowMenu.isExisting();
    
    if (!hideShowExists) {
      console.log('  Element not found by accessibility id, trying text locator...');
      hideShowMenu = await driver.$('android=new UiSelector().text("Hide-Show Animations")');
      hideShowExists = await hideShowMenu.isExisting();
    }
    
    console.log(`  Element exists: ${hideShowExists}`);
    expect(hideShowExists).toBeTruthy();
    
    await hideShowMenu.click();
    console.log('Tapped "Hide-Show Animations"');
    
    // Wait for the page to load
    await driver.pause(1500);
    
    // Take screenshot of the Hide-Show Animations page
    const screenshot2 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/hide-show-animations-page.png', screenshot2, 'base64');
    console.log('Screenshot saved: hide-show-animations-page.png');
    
    // Steps 4-7: Hide buttons 0 through 3
    const buttonIds = [0, 1, 2, 3];
    
    for (const buttonId of buttonIds) {
      console.log(`\nStep ${4 + buttonId}: Tap button ${buttonId} and validate it's gone`);
      
      // Find the button - try multiple locator strategies
      let button;
      let buttonFound = false;
      
      // Strategy 1: Try by resource-id
      try {
        button = await driver.$(`android=new UiSelector().resourceId("io.appium.android.apis:id/button${buttonId}")`);
        buttonFound = await button.isExisting();
        
        if (buttonFound) {
          console.log(`  Button ${buttonId} found by resource-id`);
        }
      } catch (e) {
        console.log(`  Button ${buttonId} not found by resource-id`);
      }
      
      // Strategy 2: Try by text content
      if (!buttonFound) {
        try {
          button = await driver.$(`android=new UiSelector().text("${buttonId}")`);
          buttonFound = await button.isExisting();
          
          if (buttonFound) {
            console.log(`  Button ${buttonId} found by text`);
          }
        } catch (e) {
          console.log(`  Button ${buttonId} not found by text`);
        }
      }
      
      // Strategy 3: Try by description
      if (!buttonFound) {
        try {
          button = await driver.$(`android=new UiSelector().description("${buttonId}")`);
          buttonFound = await button.isExisting();
          
          if (buttonFound) {
            console.log(`  Button ${buttonId} found by description`);
          }
        } catch (e) {
          console.log(`  Button ${buttonId} not found by description`);
        }
      }
      
      // Strategy 4: Try to find all buttons and identify by index
      if (!buttonFound) {
        try {
          const allButtons = await driver.$$('android.widget.Button');
          if (allButtons && allButtons[buttonId]) {
            button = allButtons[buttonId];
            buttonFound = await button.isExisting();
            
            if (buttonFound) {
              console.log(`  Button ${buttonId} found by index in button collection`);
            }
          }
        } catch (e) {
          console.log(`  Button ${buttonId} not found by index`);
        }
      }
      
      expect(buttonFound).toBeTruthy();
      
      // Click the button to hide it
      if (button) {
        await button.click();
        console.log(`Clicked button ${buttonId}`);
      }
      
      // Wait for animation to complete
      await driver.pause(1000);
      
      // Verify the button is gone
      const buttonStillExists = button ? await button.isExisting() : true;
      console.log(`  Button ${buttonId} still visible: ${buttonStillExists}`);
      expect(buttonStillExists).toBeFalsy();
      
      console.log(`Button ${buttonId} successfully hidden`);
      
      // Take screenshot after hiding each button
      const screenshotHide = await driver.takeScreenshot();
      require('fs').writeFileSync(`screenshots/button-${buttonId}-hidden.png`, screenshotHide, 'base64');
      console.log(`Screenshot saved: button-${buttonId}-hidden.png`);
    }
    
    // Step 8: Tap 'Show Buttons' and verify all buttons are back
    console.log('\nStep 8: Tap "Show Buttons" and verify all buttons are back');
    
    // Find the "Show Buttons" button
    let showButton;
    let showButtonFound = false;
    
    // Strategy 1: Try by text
    showButton = await driver.$('android=new UiSelector().text("Show Buttons")');
    showButtonFound = await showButton.isExisting();
    
    if (!showButtonFound) {
      console.log('  "Show Buttons" not found by text, trying by description...');
      showButton = await driver.$('android=new UiSelector().description("Show Buttons")');
      showButtonFound = await showButton.isExisting();
    }
    
    if (!showButtonFound) {
      console.log('  "Show Buttons" not found by description, trying by textContains...');
      showButton = await driver.$('android=new UiSelector().textContains("Show")');
      showButtonFound = await showButton.isExisting();
    }
    
    console.log(`  "Show Buttons" button exists: ${showButtonFound}`);
    expect(showButtonFound).toBeTruthy();
    
    await showButton.click();
    console.log('Clicked "Show Buttons"');
    
    // Wait for animation to complete (longer wait for all 4 buttons to appear)
    await driver.pause(2500);
    
    // Verify all buttons are back
    console.log('\nVerifying all buttons are visible again:');
    
    for (const buttonId of buttonIds) {
      let button;
      let buttonVisible = false;
      
      // Try to find each button again using text locator (same as hiding)
      try {
        button = await driver.$(`android=new UiSelector().text("${buttonId}")`);
        buttonVisible = await button.isExisting();
      } catch (e) {
        // Try alternative locator - find all buttons
        try {
          const allButtons = await driver.$$('android.widget.Button');
          if (allButtons && allButtons[buttonId]) {
            button = allButtons[buttonId];
            buttonVisible = await button.isExisting();
          }
        } catch (e2) {
          buttonVisible = false;
        }
      }
      
      console.log(`  Button ${buttonId} visible: ${buttonVisible}`);
      expect(buttonVisible).toBeTruthy();
    }
    
    console.log('All buttons successfully restored');
    
    // Take final screenshot with all buttons visible
    const screenshotFinal = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/all-buttons-shown.png', screenshotFinal, 'base64');
    console.log('Screenshot saved: all-buttons-shown.png');
    
    // Summary
    console.log('\nTest Summary:');
    console.log('----------------------------------------');
    console.log('Step 1: App opened successfully');
    console.log('Step 2: Navigated to Animations menu');
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
