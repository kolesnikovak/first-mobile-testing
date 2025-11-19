import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';

/**
 * Simple API Demos Test - Working Example
 * 
 * This test works with the actual ApiDemos app (app.apk)
 * It demonstrates basic mobile testing without requiring specific login elements
 */

test.describe('API Demos - Basic Tests', () => {
  let driver: Browser;

  test.beforeEach(async () => {
    console.log('\n🚀 Starting test setup...');
    
    const deviceName = process.env.DEVICE_NAME || 'emulator-5554';
    console.log(`📱 Device: ${deviceName}`);
    
    const appPath = path.join(__dirname, 'app.apk');
    let config = getConfig('emulator');
    config = setAppPath(config, appPath);
    config = setDeviceName(config, deviceName);
    
    console.log('⚙️ Connecting to Appium server...');
    driver = await remote(config);
    console.log('✅ Connected successfully');
  });

  test.afterEach(async () => {
    console.log('\n🧹 Cleaning up...');
    if (driver) {
      await driver.deleteSession();
      console.log('✅ Session closed');
    }
  });

  test('TC-001: App launches successfully', async () => {
    console.log('\n🧪 Test: TC-001 - App Launch');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Get app info
    const activity = await driver.getCurrentActivity();
    const packageName = await driver.getCurrentPackage();
    
    console.log(`📱 Activity: ${activity}`);
    console.log(`📦 Package: ${packageName}`);
    
    // Verify app launched
    expect(activity).toBeTruthy();
    expect(packageName).toBeTruthy();
    
    // Take screenshot
    await driver.saveScreenshot('./screenshots/app-launched.png');
    console.log('📸 Screenshot saved: app-launched.png');
    
    console.log('✅ Test Passed: App launched successfully\n');
  });

  test('TC-002: Find and interact with API Demos elements', async () => {
    console.log('\n🧪 Test: TC-002 - Element Interaction');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Wait for app to fully load
    await driver.pause(2000);
    
    // Try to find elements by text (API Demos has these)
    try {
      // Look for "Access'ibility" or "Accessibility" text
      const accessibilityOption = await driver.$('android=new UiSelector().textContains("Access")');
      const exists = await accessibilityOption.isExisting();
      
      console.log(`✓ Found element with 'Access' text: ${exists}`);
      
      if (exists) {
        await driver.saveScreenshot('./screenshots/element-found.png');
        console.log('📸 Screenshot saved: element-found.png');
        
        // Click the element
        await accessibilityOption.click();
        console.log('✓ Clicked on element');
        
        await driver.pause(1000);
        await driver.saveScreenshot('./screenshots/after-click.png');
        console.log('📸 Screenshot saved: after-click.png');
        
        // Go back
        await driver.back();
        console.log('✓ Navigated back');
      }
      
      expect(exists).toBeTruthy();
      console.log('✅ Test Passed: Element interaction successful\n');
      
    } catch (error) {
      console.log('⚠️ Element not found - see screenshot for app state');
      await driver.saveScreenshot('./screenshots/element-not-found.png');
      throw error;
    }
  });

  test('TC-003: Scroll and find elements', async () => {
    console.log('\n🧪 Test: TC-003 - Scroll Test');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    await driver.pause(2000);
    
    // Find scrollable list
    try {
      const listView = await driver.$('android=new UiSelector().className("android.widget.ListView")');
      const exists = await listView.isExisting();
      
      console.log(`✓ Found ListView: ${exists}`);
      expect(exists).toBeTruthy();
      
      // Get all list items
      const items = await driver.$$('android=new UiSelector().className("android.widget.TextView")');
      const count = items.length;
      console.log(`✓ Found ${count} TextViews`);
      
      expect(count).toBeGreaterThan(0);
      
      await driver.saveScreenshot('./screenshots/list-view.png');
      console.log('📸 Screenshot saved: list-view.png');
      
      console.log('✅ Test Passed: List elements found\n');
      
    } catch (error) {
      console.log('⚠️ Error finding list elements');
      await driver.saveScreenshot('./screenshots/list-error.png');
      throw error;
    }
  });
});