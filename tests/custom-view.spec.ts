import { test, expect } from '@playwright/test';
import { remote, Browser } from 'webdriverio';
import * as path from 'path';
import { getConfig, setAppPath, setDeviceName } from '../config/appium.config';

/**
 * Test Case: Accessibility Custom View Verification
 * 
 * Steps:
 * 1. Open the app APIDemos.apk
 * 2. Tap 'Accessibility' menu element (accessibility id: Accessibility)
 * 3. Tap 'Custom View' menu element
 * 4. Verify expected text is displayed
 */

test.describe('Accessibility - Custom View Verification', () => {
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

  test('TC-006: Navigate to Custom View and verify instructional text', async () => {
    console.log('\n🧪 Test: Accessibility Custom View Verification');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Wait for app to load
    await driver.pause(2000);
    
    // Step 2: Tap 'Accessibility' menu element
    console.log('\n📍 Step 2: Tap "Accessibility" menu element');
    const accessibilityMenu = await driver.$('~Accessibility');
    
    const accessibilityExists = await accessibilityMenu.isExisting();
    console.log(`   Element exists: ${accessibilityExists}`);
    expect(accessibilityExists).toBeTruthy();
    
    await accessibilityMenu.click();
    console.log('✓ Tapped "Accessibility"');
    
    // Take screenshot after tapping Accessibility
    await driver.pause(1000);
    const screenshot1 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/accessibility-menu-customview.png', screenshot1, 'base64');
    console.log('📸 Screenshot saved: accessibility-menu-customview.png');
    
    // Step 3: Tap 'Custom View' menu element
    console.log('\n📍 Step 3: Tap "Custom View" menu element');
    
    // Try finding by accessibility id first
    let customViewMenu = await driver.$('~Custom View');
    let customViewExists = await customViewMenu.isExisting();
    
    if (!customViewExists) {
      console.log('   ⚠️ Element not found by accessibility id, trying text locator...');
      customViewMenu = await driver.$('android=new UiSelector().text("Custom View")');
      customViewExists = await customViewMenu.isExisting();
    }
    
    console.log(`   Element exists: ${customViewExists}`);
    expect(customViewExists).toBeTruthy();
    
    await customViewMenu.click();
    console.log('✓ Tapped "Custom View"');
    
    // Wait for the page to load
    await driver.pause(1500);
    
    // Take screenshot of the Custom View page
    const screenshot2 = await driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/custom-view-page.png', screenshot2, 'base64');
    console.log('📸 Screenshot saved: custom-view-page.png');
    
    // Step 4: Verify expected text
    console.log('\n📍 Step 4: Verify instructional text');
    console.log('─────────────────────────────────────────');
    
    const expectedText = '1. Enable TalkBack (Settings -> Accessibility -> TalkBack). \n\n2. Enable Explore-by-Touch (Settings -> Accessibility -> Explore by Touch). \n\n3. Touch explore/poke the buttons.';
    
    console.log('\n🔍 Searching for expected text...');
    console.log(`📝 Expected: "${expectedText}"`);
    
    // Try different locator strategies to find the text
    let textFound = false;
    let actualText = '';
    
    // Strategy 1: Find by exact text using UiSelector
    console.log('\n🔍 Strategy 1: Searching by exact text...');
    const exactTextElement = await driver.$(`android=new UiSelector().textContains("1. Enable TalkBack")`);
    const exactExists = await exactTextElement.isExisting();
    
    if (exactExists) {
      actualText = await exactTextElement.getText();
      console.log('✓ Text element found by partial text');
      console.log(`📝 Actual text: "${actualText}"`);
      textFound = true;
    } else {
      console.log('✗ Not found by exact text');
    }
    
    // Strategy 2: Get page source and search
    if (!textFound) {
      console.log('\n🔍 Strategy 2: Checking page source...');
      const pageSource = await driver.getPageSource();
      
      // Check if the key parts of the text exist in page source
      const hasStep1 = pageSource.includes('1. Enable TalkBack');
      const hasStep2 = pageSource.includes('2. Enable Explore-by-Touch');
      const hasStep3 = pageSource.includes('3. Touch explore/poke the buttons');
      
      console.log(`   Step 1 found in source: ${hasStep1}`);
      console.log(`   Step 2 found in source: ${hasStep2}`);
      console.log(`   Step 3 found in source: ${hasStep3}`);
      
      if (hasStep1 && hasStep2 && hasStep3) {
        textFound = true;
        console.log('✓ All text parts found in page source');
      }
    }
    
    // Strategy 3: Find all TextViews and check their content
    if (!textFound) {
      console.log('\n🔍 Strategy 3: Searching through all TextViews...');
      const textViews = await driver.$$('android.widget.TextView');
      
      for (const textView of textViews) {
        try {
          const text = await textView.getText();
          if (text && text.includes('1. Enable TalkBack')) {
            actualText = text;
            textFound = true;
            console.log('✓ Text element found in TextView');
            console.log(`📝 Actual text: "${actualText}"`);
            break;
          }
        } catch (e) {
          // Skip elements that can't be read
        }
      }
    }
    
    // Verification
    console.log('\n📊 Verification Results:');
    console.log('─────────────────────────────────────────');
    
    if (textFound) {
      console.log('✅ Expected text found on the page');
      
      // Normalize texts for comparison (handle different line break formats)
      const normalizedExpected = expectedText.replace(/\\n/g, '\n').trim();
      const normalizedActual = actualText.replace(/\\n/g, '\n').trim();
      
      // Check if actual text contains the expected content
      const containsStep1 = normalizedActual.includes('1. Enable TalkBack');
      const containsStep2 = normalizedActual.includes('2. Enable Explore-by-Touch');
      const containsStep3 = normalizedActual.includes('3. Touch explore/poke the buttons');
      
      console.log(`   ✓ Contains Step 1: ${containsStep1}`);
      console.log(`   ✓ Contains Step 2: ${containsStep2}`);
      console.log(`   ✓ Contains Step 3: ${containsStep3}`);
      
      expect(containsStep1).toBeTruthy();
      expect(containsStep2).toBeTruthy();
      expect(containsStep3).toBeTruthy();
      
      console.log('\n✅ All steps verified in the text');
    } else {
      console.log('✗ Expected text NOT FOUND');
      
      // Get page source for debugging
      const pageSource = await driver.getPageSource();
      console.log('\n📄 Page source snippet:');
      
      // Extract and show all text content from page source
      const textMatches = pageSource.match(/text="([^"]+)"/g);
      if (textMatches) {
        console.log('Found text elements:');
        textMatches.slice(0, 10).forEach(match => {
          console.log(`  - ${match}`);
        });
      }
      
      expect(textFound).toBeTruthy();
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('─────────────────────────────────────────');
    console.log('✓ Step 1: App opened successfully');
    console.log('✓ Step 2: Navigated to Accessibility menu');
    console.log('✓ Step 3: Navigated to Custom View');
    console.log('✓ Step 4: Verified instructional text');
    
    console.log('\n✅ Test Passed: Custom View text verification complete');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });
});
