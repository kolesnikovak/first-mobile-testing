import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';

/**
 * Test Case: Text Linkify Verification
 * 
 * Steps:
 * 1. Open the app APIDemos.apk
 * 2. Tap 'Text' menu element (accessibility id: Text)
 * 3. Tap 'Linkify' menu element (accessibility id: Linkify)
 * 4. Verify text elements (text1, text2, text3, text4)
 */

test.describe('Text - Linkify Verification', () => {
  let driver: Browser;

  test.beforeEach(async () => {
    console.log('\n🚀 Starting test setup...');
    
    const deviceName = process.env.DEVICE_NAME || 'emulator-5554';
    const appPath = path.join(__dirname, 'app.apk');
    
    let config = getConfig('emulator');
    config = setAppPath(config, appPath);
    config = setDeviceName(config, deviceName);
    
    driver = await remote(config);
    console.log('✅ Setup complete - APIDemos.apk opened');
  });

  test.afterEach(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('TC-005: Navigate to Linkify and verify text elements', async () => {
    console.log('\n🧪 Test: Linkify Text Verification');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Wait for app to load
    await driver.pause(2000);
    
    // Step 2: Tap 'Text' menu element
    console.log('\n📍 Step 2: Tap "Text" menu element');
    const textMenu = await driver.$('~Text');
    expect(await textMenu.isExisting()).toBeTruthy();
    await textMenu.click();
    console.log('✓ Tapped "Text"');
    
    // Take screenshot after tapping Text
    await driver.pause(1000);
    const screenshot1 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/text-menu.png', screenshot1, 'base64');
    console.log('📸 Screenshot saved: text-menu.png');
    
    // Step 3: Tap 'Linkify' menu element
    console.log('\n📍 Step 3: Tap "Linkify" menu element');
    const linkifyMenu = await driver.$('~Linkify');
    expect(await linkifyMenu.isExisting()).toBeTruthy();
    await linkifyMenu.click();
    console.log('✓ Tapped "Linkify"');
    
    // Wait for the page to load
    await driver.pause(1500);
    
    // Take screenshot of the Linkify page
    const screenshot2 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/linkify-page.png', screenshot2, 'base64');
    console.log('📸 Screenshot saved: linkify-page.png');
    
    // Step 4: Verify text elements
    console.log('\n📍 Step 4: Verify text elements');
    console.log('─────────────────────────────────────────');
    
    // Verify text1
    console.log('\n🔍 Verifying text1...');
    const text1 = await driver.$('~io.appium.android.apis:id/text1');
    const text1Exists = await text1.isExisting();
    
    if (text1Exists) {
      const text1Content = await text1.getText();
      console.log(`✓ text1 found`);
      console.log(`  Resource ID: io.appium.android.apis:id/text1`);
      console.log(`  Content: "${text1Content}"`);
      expect(text1Exists).toBeTruthy();
    } else {
      console.log('⚠️ text1 not found by accessibility id, trying resource-id...');
      const text1ById = await driver.$('android=new UiSelector().resourceId("io.appium.android.apis:id/text1")');
      const text1ByIdExists = await text1ById.isExisting();
      
      if (text1ByIdExists) {
        const text1Content = await text1ById.getText();
        console.log(`✓ text1 found by resource-id`);
        console.log(`  Resource ID: io.appium.android.apis:id/text1`);
        console.log(`  Content: "${text1Content}"`);
        expect(text1ByIdExists).toBeTruthy();
      } else {
        console.log('✗ text1 NOT FOUND');
        expect(text1ByIdExists).toBeTruthy();
      }
    }
    
    // Verify text2
    console.log('\n🔍 Verifying text2...');
    const text2ById = await driver.$('android=new UiSelector().resourceId("io.appium.android.apis:id/text2")');
    const text2Exists = await text2ById.isExisting();
    
    if (text2Exists) {
      const text2Content = await text2ById.getText();
      console.log(`✓ text2 found`);
      console.log(`  Resource ID: io.appium.android.apis:id/text2`);
      console.log(`  Content: "${text2Content}"`);
      expect(text2Exists).toBeTruthy();
    } else {
      console.log('✗ text2 NOT FOUND');
      expect(text2Exists).toBeTruthy();
    }
    
    // Verify text3
    console.log('\n🔍 Verifying text3...');
    const text3ById = await driver.$('android=new UiSelector().resourceId("io.appium.android.apis:id/text3")');
    const text3Exists = await text3ById.isExisting();
    
    if (text3Exists) {
      const text3Content = await text3ById.getText();
      console.log(`✓ text3 found`);
      console.log(`  Resource ID: io.appium.android.apis:id/text3`);
      console.log(`  Content: "${text3Content}"`);
      expect(text3Exists).toBeTruthy();
    } else {
      console.log('✗ text3 NOT FOUND');
      expect(text3Exists).toBeTruthy();
    }
    
    // Verify text4
    console.log('\n🔍 Verifying text4...');
    const text4ById = await driver.$('android=new UiSelector().resourceId("io.appium.android.apis:id/text4")');
    const text4Exists = await text4ById.isExisting();
    
    if (text4Exists) {
      const text4Content = await text4ById.getText();
      console.log(`✓ text4 found`);
      console.log(`  Resource ID: io.appium.android.apis:id/text4`);
      console.log(`  Content: "${text4Content}"`);
      expect(text4Exists).toBeTruthy();
    } else {
      console.log('✗ text4 NOT FOUND');
      expect(text4Exists).toBeTruthy();
    }
    
    // Summary
    console.log('\n📊 Verification Summary:');
    console.log('─────────────────────────────────────────');
    console.log('✓ All 4 text elements verified successfully');
    console.log('  - text1 (io.appium.android.apis:id/text1)');
    console.log('  - text2 (io.appium.android.apis:id/text2)');
    console.log('  - text3 (io.appium.android.apis:id/text3)');
    console.log('  - text4 (io.appium.android.apis:id/text4)');
    
    console.log('\n✅ Test Passed: All text elements verified');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });
});