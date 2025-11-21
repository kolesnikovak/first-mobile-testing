import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';

/**
 * Test Case: External Storage - Create and Delete Button State Validation
 * 
 * Steps:
 * 1. Open the app APIDemos.apk
 * 2. Tap 'Content' menu element
 * 3. Tap 'Storage' menu element
 * 4. Tap 'External Storage' menu element
 * 5. Tap first 'Create' and verify 'Delete' button state
 * 6. Tap second 'Create' and verify 'Delete' button state
 * 7. Tap third 'Create' and verify 'Delete' button state
 */

test.describe('Content - External Storage Validation', () => {
  let driver: Browser;

  test.beforeEach(async () => {
    console.log('\n Starting test setup...');
    
    const deviceName = process.env.DEVICE_NAME || 'emulator-5554';
    const appPath = path.join(__dirname, 'app.apk');
    
    let config = getConfig('emulator');
    config = setAppPath(config, appPath);
    config = setDeviceName(config, deviceName);
    
    driver = await remote(config);
    console.log(' Setup complete');
  });

  test.afterEach(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('TC-007: Validate External Storage Create and Delete button states', async () => {
    console.log('\n Test: External Storage Create/Delete Button Validation');
    console.log('========================================');
    
    // Wait for app to load
    await driver.pause(2000);
    
    // Step 1: Tap "Content"
    console.log('\n Step 1: Tap "Content"');
    const contentOption = await driver.$('android=new UiSelector().text("Content")');
    expect(await contentOption.isExisting()).toBeTruthy();
    await contentOption.click();
    console.log(' Tapped "Content"');
    
    // Wait for Content menu to load
    await driver.pause(1500);
    
    // Take screenshot after tapping Content
    const screenshot1 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/content-menu.png', screenshot1, 'base64');
    console.log(' Screenshot saved: content-menu.png');
    
    // Step 2: Tap "Storage"
    console.log('\n Step 2: Tap "Storage"');
    const storageOption = await driver.$('android=new UiSelector().text("Storage")');
    expect(await storageOption.isExisting()).toBeTruthy();
    await storageOption.click();
    console.log(' Tapped "Storage"');
    
    // Wait for Storage menu to load
    await driver.pause(1500);
    
    // Take screenshot after tapping Storage
    const screenshot2 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/storage-menu.png', screenshot2, 'base64');
    console.log(' Screenshot saved: storage-menu.png');
    
    // Step 3: Tap "External Storage"
    console.log('\n Step 3: Tap "External Storage"');
    const externalStorageOption = await driver.$('android=new UiSelector().text("External Storage")');
    expect(await externalStorageOption.isExisting()).toBeTruthy();
    await externalStorageOption.click();
    console.log(' Tapped "External Storage"');
    
    // Wait for External Storage page to load
    await driver.pause(2000);
    
    // Take screenshot of External Storage page
    const screenshot3 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/external-storage-initial.png', screenshot3, 'base64');
    console.log(' Screenshot saved: external-storage-initial.png');
    
    // Step 4: Tap first 'Create' button and verify 'Delete' button state
    console.log('\n Step 4: Tap first "Create" button');
    console.log('----------------------------------------');
    
    // Find all Create buttons using indexed selector for first button
    const firstCreateButton = await driver.$('android=new UiSelector().text("Create").instance(0)');
    expect(await firstCreateButton.isExisting()).toBeTruthy();
    console.log(' Tapping first "Create" button...');
    await firstCreateButton.click();
    await driver.pause(1500);
    
    // Take screenshot after first Create
    const screenshot4 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/after-first-create.png', screenshot4, 'base64');
    console.log(' Screenshot saved: after-first-create.png');
    
    // Check if Delete button exists and its enabled state (first Delete button)
    let deleteButton1 = await driver.$('android=new UiSelector().text("Delete").instance(0)');
    let deleteExists1 = await deleteButton1.isExisting();
    
    if (deleteExists1) {
      const isDeleteEnabled1 = await deleteButton1.isEnabled();
      console.log(` First "Delete" button enabled state: ${isDeleteEnabled1}`);
      // The app enables Delete after Create - this is the actual behavior
      expect(isDeleteEnabled1).toBeTruthy();
      console.log(' PASS: First "Delete" button is enabled after first Create');
    } else {
      console.log(' First "Delete" button not found on screen');
      expect(deleteExists1).toBeTruthy();
    }
    
    // Step 5: Tap second 'Create' button and verify 'Delete' button state
    console.log('\n Step 5: Tap second "Create" button');
    console.log('----------------------------------------');
    
    const secondCreateButton = await driver.$('android=new UiSelector().text("Create").instance(1)');
    expect(await secondCreateButton.isExisting()).toBeTruthy();
    console.log(' Tapping second "Create" button...');
    await secondCreateButton.click();
    await driver.pause(1500);
    
    // Take screenshot after second Create
    const screenshot5 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/after-second-create.png', screenshot5, 'base64');
    console.log(' Screenshot saved: after-second-create.png');
    
    // Check Delete button state (second Delete button)
    let deleteButton2 = await driver.$('android=new UiSelector().text("Delete").instance(1)');
    let deleteExists2 = await deleteButton2.isExisting();
    
    if (deleteExists2) {
      const isDeleteEnabled2 = await deleteButton2.isEnabled();
      console.log(` Second "Delete" button enabled state: ${isDeleteEnabled2}`);
      expect(isDeleteEnabled2).toBeTruthy();
      console.log(' PASS: Second "Delete" button IS enabled after second Create');
    } else {
      console.log(' Second "Delete" button not found on screen');
      expect(deleteExists2).toBeTruthy();
    }
    
    // Step 6: Tap third 'Create' button and verify 'Delete' button state
    console.log('\n Step 6: Tap third "Create" button');
    console.log('----------------------------------------');
    
    const thirdCreateButton = await driver.$('android=new UiSelector().text("Create").instance(2)');
    expect(await thirdCreateButton.isExisting()).toBeTruthy();
    console.log(' Tapping third "Create" button...');
    await thirdCreateButton.click();
    await driver.pause(1500);
    
    // Take screenshot after third Create
    const screenshot6 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/after-third-create.png', screenshot6, 'base64');
    console.log(' Screenshot saved: after-third-create.png');
    
    // Check Delete button state (third Delete button)
    let deleteButton3 = await driver.$('android=new UiSelector().text("Delete").instance(2)');
    let deleteExists3 = await deleteButton3.isExisting();
    
    if (deleteExists3) {
      const isDeleteEnabled3 = await deleteButton3.isEnabled();
      console.log(` Third "Delete" button enabled state: ${isDeleteEnabled3}`);
      expect(isDeleteEnabled3).toBeTruthy();
      console.log(' PASS: Third "Delete" button IS enabled after third Create');
    } else {
      console.log(' Third "Delete" button not found on screen');
      expect(deleteExists3).toBeTruthy();
    }
    
    // Final validation summary
    console.log('\n Validation Summary:');
    console.log('========================================');
    console.log(' All Create button interactions completed');
    console.log(' Delete button state validated correctly');
    console.log('\n Test Passed: External Storage validation complete');
    console.log('========================================\n');
  });
});
