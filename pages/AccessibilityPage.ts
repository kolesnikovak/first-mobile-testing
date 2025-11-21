import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * Page Object for Accessibility Menu
 * Handles navigation and interaction with Accessibility-related screens
 */
export class AccessibilityPage extends BasePage {
  private readonly locators = {
    accessibilityMenuItem: 'android=new UiSelector().text("Accessibility")',
    accessibilityServiceItem: 'android=new UiSelector().text("Accessibility Service")',
    customViewItem: 'android=new UiSelector().text("Custom View")',
    customViewItemAlt: '~Custom View',
  };

  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Navigate to Accessibility menu from main screen
   */
  async navigateToAccessibility(): Promise<void> {
    console.log('Step: Navigate to Accessibility menu');
    await this.click(this.locators.accessibilityMenuItem);
    await this.pause(1000);
    console.log('Navigated to Accessibility menu');
  }

  /**
   * Navigate to Accessibility Service
   */
  async navigateToAccessibilityService(): Promise<void> {
    console.log('Step: Navigate to Accessibility Service');
    await this.click(this.locators.accessibilityServiceItem);
    await this.pause(1000);
    console.log('Navigated to Accessibility Service');
  }

  /**
   * Navigate to Custom View
   */
  async navigateToCustomView(): Promise<void> {
    console.log('Step: Navigate to Custom View');
    
    let element = await this.driver.$(this.locators.customViewItemAlt);
    let exists = await element.isExisting();
    
    if (!exists) {
      console.log('  Element not found by accessibility id, trying text locator...');
      element = await this.driver.$(this.locators.customViewItem);
      exists = await element.isExisting();
    }
    
    if (exists) {
      await element.click();
      await this.pause(1500);
      console.log('Navigated to Custom View');
    } else {
      throw new Error('Custom View element not found');
    }
  }

  /**
   * Verify Accessibility menu is displayed
   */
  async verifyAccessibilityMenuDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.locators.accessibilityServiceItem);
  }
}
