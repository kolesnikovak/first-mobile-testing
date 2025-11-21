import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';
import { ContentPage, StoragePage, ExternalStoragePage } from '../pages';

/**
 * Test Case: External Storage - Create and Delete Button State Validation (POM)
 * 
 * Steps:
 * 1. Open the app APIDemos.apk
 * 2. Navigate to Content menu
 * 3. Navigate to Storage submenu
 * 4. Navigate to External Storage
 * 5. Tap first 'Create' and verify 'Delete' button state
 * 6. Tap second 'Create' and verify 'Delete' button state
 * 7. Tap third 'Create' and verify 'Delete' button state
 */

test.describe('Content - External Storage Validation', () => {
  let driver: Browser;
  let contentPage: ContentPage;
  let storagePage: StoragePage;
  let externalStoragePage: ExternalStoragePage;

  test.beforeEach(async () => {
    console.log('\n Starting test setup...');
    
    const deviceName = process.env.DEVICE_NAME || 'emulator-5554';
    const appPath = path.join(__dirname, 'app.apk');
    
    let config = getConfig('emulator');
    config = setAppPath(config, appPath);
    config = setDeviceName(config, deviceName);
    
    driver = await remote(config);
    
    // Initialize page objects
    contentPage = new ContentPage(driver);
    storagePage = new StoragePage(driver);
    externalStoragePage = new ExternalStoragePage(driver);
    
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
    
    // Step 1: Navigate to Content menu
    console.log('\n Step 1: Navigate to Content');
    await contentPage.navigateToContent();
    await contentPage.captureContentScreen();
    
    // Step 2: Navigate to Storage submenu
    console.log('\n Step 2: Navigate to Storage');
    await contentPage.navigateToStorage();
    await storagePage.captureStorageScreen();
    
    // Step 3: Navigate to External Storage
    console.log('\n Step 3: Navigate to External Storage');
    await storagePage.navigateToExternalStorage();
    await externalStoragePage.captureScreen('external-storage-initial');
    
    // Step 4: Validate first Create/Delete button flow
    console.log('\n Step 4: Validate first Create button');
    console.log('----------------------------------------');
    const result1 = await externalStoragePage.validateCreateDeleteFlow(0, 'after-first-create');
    expect(result1.deleteExists).toBeTruthy();
    expect(result1.deleteEnabled).toBeTruthy();
    console.log(' PASS: First "Delete" button is enabled after first Create');
    
    // Step 5: Validate second Create/Delete button flow
    console.log('\n Step 5: Validate second Create button');
    console.log('----------------------------------------');
    const result2 = await externalStoragePage.validateCreateDeleteFlow(1, 'after-second-create');
    expect(result2.deleteExists).toBeTruthy();
    expect(result2.deleteEnabled).toBeTruthy();
    console.log(' PASS: Second "Delete" button is enabled after second Create');
    
    // Step 6: Validate third Create/Delete button flow
    console.log('\n Step 6: Validate third Create button');
    console.log('----------------------------------------');
    const result3 = await externalStoragePage.validateCreateDeleteFlow(2, 'after-third-create');
    expect(result3.deleteExists).toBeTruthy();
    expect(result3.deleteEnabled).toBeTruthy();
    console.log(' PASS: Third "Delete" button is enabled after third Create');
    
    // Final validation summary
    console.log('\n Validation Summary:');
    console.log('========================================');
    console.log(' All Create button interactions completed');
    console.log(' Delete button state validated correctly');
    console.log('\n Test Passed: External Storage validation complete');
    console.log('========================================\n');
  });
});
