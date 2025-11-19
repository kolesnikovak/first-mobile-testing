import { Browser } from 'webdriverio';

/**
 * Element Locator Helper
 * Provides utility functions for locating elements with fallback strategies
 */
export class ElementLocator {
  private driver: Browser;

  constructor(driver: Browser) {
    this.driver = driver;
  }

  /**
   * Find element using multiple locator strategies with fallback
   * Priority: Accessibility ID → Resource ID → UiAutomator
   * @param locators - Object containing different locator strategies
   */
  async findWithFallback(locators: {
    accessibilityId?: string;
    resourceId?: string;
    uiAutomator?: string;
  }) {
    // Try Accessibility ID first (Priority 1)
    if (locators.accessibilityId) {
      try {
        const element = await this.driver.$(`~${locators.accessibilityId}`);
        if (await element.isExisting()) {
          console.log(`✓ Found element using Accessibility ID: ${locators.accessibilityId}`);
          return element;
        }
      } catch (error) {
        console.log(`⚠ Accessibility ID failed: ${locators.accessibilityId}`);
      }
    }

    // Try Resource ID (Priority 2)
    if (locators.resourceId) {
      try {
        const element = await this.driver.$(`id=${locators.resourceId}`);
        if (await element.isExisting()) {
          console.log(`✓ Found element using Resource ID: ${locators.resourceId}`);
          return element;
        }
      } catch (error) {
        console.log(`⚠ Resource ID failed: ${locators.resourceId}`);
      }
    }

    // Try UiAutomator (Priority 3)
    if (locators.uiAutomator) {
      try {
        const element = await this.driver.$(`android=${locators.uiAutomator}`);
        if (await element.isExisting()) {
          console.log(`✓ Found element using UiAutomator: ${locators.uiAutomator}`);
          return element;
        }
      } catch (error) {
        console.log(`⚠ UiAutomator failed: ${locators.uiAutomator}`);
      }
    }

    throw new Error('❌ Element not found with any locator strategy');
  }

  /**
   * Wait for element to be present with fallback strategies
   * @param locators - Object containing different locator strategies
   * @param timeout - Timeout in milliseconds
   */
  async waitForElement(
    locators: {
      accessibilityId?: string;
      resourceId?: string;
      uiAutomator?: string;
    },
    timeout: number = 10000
  ) {
    const element = await this.findWithFallback(locators);
    await element.waitForDisplayed({ timeout });
    return element;
  }

  /**
   * Check if element exists using fallback strategies
   * @param locators - Object containing different locator strategies
   */
  async isElementPresent(locators: {
    accessibilityId?: string;
    resourceId?: string;
    uiAutomator?: string;
  }): Promise<boolean> {
    try {
      const element = await this.findWithFallback(locators);
      return await element.isExisting();
    } catch (error) {
      return false;
    }
  }
}

/**
 * Wait Helper
 * Provides common wait utilities
 */
export class WaitHelper {
  private driver: Browser;

  constructor(driver: Browser) {
    this.driver = driver;
  }

  /**
   * Wait for element to be visible
   * @param element - Element to wait for
   * @param timeout - Timeout in milliseconds
   */
  async waitForVisible(element: any, timeout: number = 10000) {
    await element.waitForDisplayed({ timeout });
  }

  /**
   * Wait for element to be clickable
   * @param element - Element to wait for
   * @param timeout - Timeout in milliseconds
   */
  async waitForClickable(element: any, timeout: number = 10000) {
    await element.waitForClickable({ timeout });
  }

  /**
   * Wait for element to disappear
   * @param element - Element to wait for
   * @param timeout - Timeout in milliseconds
   */
  async waitForNotVisible(element: any, timeout: number = 10000) {
    await element.waitForDisplayed({ timeout, reverse: true });
  }

  /**
   * Wait for specific duration
   * @param milliseconds - Duration to wait
   */
  async pause(milliseconds: number) {
    await this.driver.pause(milliseconds);
  }

  /**
   * Wait for condition to be true
   * @param condition - Function that returns boolean
   * @param timeout - Timeout in milliseconds
   * @param interval - Check interval in milliseconds
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 500
  ): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await this.pause(interval);
    }
    return false;
  }
}

/**
 * Gesture Helper
 * Provides common mobile gesture utilities
 */
export class GestureHelper {
  private driver: Browser;

  constructor(driver: Browser) {
    this.driver = driver;
  }

  /**
   * Swipe from one point to another using W3C Actions API
   */
  async swipe(startX: number, startY: number, endX: number, endY: number, duration: number = 1000) {
    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: duration },
          { type: 'pointerMove', duration: duration, x: endX, y: endY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
    await this.driver.releaseActions();
  }

  /**
   * Swipe up on screen
   */
  async swipeUp() {
    const size = await this.driver.getWindowSize();
    const startX = size.width / 2;
    const startY = size.height * 0.8;
    const endY = size.height * 0.2;
    await this.swipe(startX, startY, startX, endY);
  }

  /**
   * Swipe down on screen
   */
  async swipeDown() {
    const size = await this.driver.getWindowSize();
    const startX = size.width / 2;
    const startY = size.height * 0.2;
    const endY = size.height * 0.8;
    await this.swipe(startX, startY, startX, endY);
  }

  /**
   * Swipe left on screen
   */
  async swipeLeft() {
    const size = await this.driver.getWindowSize();
    const startY = size.height / 2;
    const startX = size.width * 0.8;
    const endX = size.width * 0.2;
    await this.swipe(startX, startY, endX, startY);
  }

  /**
   * Swipe right on screen
   */
  async swipeRight() {
    const size = await this.driver.getWindowSize();
    const startY = size.height / 2;
    const startX = size.width * 0.2;
    const endX = size.width * 0.8;
    await this.swipe(startX, startY, endX, startY);
  }

  /**
   * Scroll to element
   */
  async scrollToElement(element: any) {
    await element.scrollIntoView();
  }

  /**
   * Tap on coordinates
   */
  async tapAtCoordinates(x: number, y: number) {
    await this.driver.touchAction({
      action: 'tap',
      x,
      y
    });
  }

  /**
   * Long press on element
   */
  async longPress(element: any, duration: number = 2000) {
    const location = await element.getLocation();
    await this.driver.touchAction([
      { action: 'press', x: location.x, y: location.y },
      { action: 'wait', ms: duration },
      { action: 'release' }
    ]);
  }
}

/**
 * Device Helper
 * Provides device-specific utilities
 */
export class DeviceHelper {
  private driver: Browser;

  constructor(driver: Browser) {
    this.driver = driver;
  }

  /**
   * Hide keyboard if visible
   */
  async hideKeyboard() {
    try {
      await this.driver.hideKeyboard();
      console.log('✓ Keyboard hidden');
    } catch (error) {
      console.log('ℹ Keyboard not visible or already hidden');
    }
  }

  /**
   * Check if keyboard is visible
   */
  async isKeyboardVisible(): Promise<boolean> {
    try {
      return await this.driver.isKeyboardShown();
    } catch (error) {
      return false;
    }
  }

  /**
   * Press device back button
   */
  async pressBack() {
    await this.driver.back();
    console.log('✓ Pressed back button');
  }

  /**
   * Get device orientation
   */
  async getOrientation(): Promise<string> {
    return await this.driver.getOrientation();
  }

  /**
   * Set device orientation
   */
  async setOrientation(orientation: 'PORTRAIT' | 'LANDSCAPE') {
    await this.driver.setOrientation(orientation);
    console.log(`✓ Orientation set to ${orientation}`);
  }

  /**
   * Get current activity (Android)
   */
  async getCurrentActivity(): Promise<string> {
    return await this.driver.getCurrentActivity();
  }

  /**
   * Get current package (Android)
   */
  async getCurrentPackage(): Promise<string> {
    return await this.driver.getCurrentPackage();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(filename: string) {
    await this.driver.saveScreenshot(`./screenshots/${filename}.png`);
    console.log(`✓ Screenshot saved: ${filename}.png`);
  }

  /**
   * Launch app
   */
  async launchApp(bundleId: string) {
    await this.driver.activateApp(bundleId);
    console.log(`✓ App launched: ${bundleId}`);
  }

  /**
   * Close app
   */
  async closeApp(bundleId: string) {
    await this.driver.terminateApp(bundleId);
    console.log(`✓ App closed: ${bundleId}`);
  }

  /**
   * Reset app
   */
  async resetApp(bundleId: string) {
    await this.closeApp(bundleId);
    await this.launchApp(bundleId);
    console.log('✓ App reset');
  }

  /**
   * Get device time
   */
  async getDeviceTime(): Promise<string> {
    return await this.driver.getDeviceTime();
  }
}

/**
 * Assertion Helper
 * Provides common assertion utilities
 */
export class AssertionHelper {
  /**
   * Assert element is displayed
   */
  static async assertDisplayed(element: any, message?: string) {
    const isDisplayed = await element.isDisplayed();
    if (!isDisplayed) {
      throw new Error(message || 'Element is not displayed');
    }
    console.log('✓ Assert passed: Element is displayed');
  }

  /**
   * Assert element text matches expected
   */
  static async assertText(element: any, expectedText: string, message?: string) {
    const actualText = await element.getText();
    if (actualText !== expectedText) {
      throw new Error(
        message || `Expected text "${expectedText}" but found "${actualText}"`
      );
    }
    console.log(`✓ Assert passed: Text matches "${expectedText}"`);
  }

  /**
   * Assert element text contains expected text
   */
  static async assertTextContains(element: any, expectedText: string, message?: string) {
    const actualText = await element.getText();
    if (!actualText.includes(expectedText)) {
      throw new Error(
        message || `Expected text to contain "${expectedText}" but found "${actualText}"`
      );
    }
    console.log(`✓ Assert passed: Text contains "${expectedText}"`);
  }

  /**
   * Assert element exists
   */
  static async assertExists(element: any, message?: string) {
    const exists = await element.isExisting();
    if (!exists) {
      throw new Error(message || 'Element does not exist');
    }
    console.log('✓ Assert passed: Element exists');
  }

  /**
   * Assert element is enabled
   */
  static async assertEnabled(element: any, message?: string) {
    const isEnabled = await element.isEnabled();
    if (!isEnabled) {
      throw new Error(message || 'Element is not enabled');
    }
    console.log('✓ Assert passed: Element is enabled');
  }
}