import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * Page Object for ApiDemos Home Screen
 * Demonstrates proper locator strategy priority:
 * 1. Accessibility ID (best practice)
 * 2. Resource ID
 * 3. UiAutomator
 */
export class ApiDemosPage extends BasePage {
  // Locators using different strategies
  private readonly locators = {
    // Using text-based UiAutomator selector
    appTitle: 'android=new UiSelector().text("API Demos")',
    
    // Using accessibility id (best practice when available)
    accessibilityMenu: '~Accessibility',
    
    // Using resource-id
    listView: 'android.widget.ListView',
    
    // Using UiAutomator for complex scenarios
    menuItemByText: (text: string) => `android=new UiSelector().text("${text}")`,
    menuItemByPartialText: (text: string) => `android=new UiSelector().textContains("${text}")`,
  };

  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Verify the app has launched successfully
   */
  async verifyAppLaunched(): Promise<boolean> {
    try {
      await this.waitForElement(this.locators.listView, 15000);
      return true;
    } catch (error) {
      console.error('App failed to launch:', error);
      return false;
    }
  }

  /**
   * Click on a menu item by its text
   * @param menuText - Text of the menu item
   */
  async clickMenuItem(menuText: string): Promise<void> {
    const locator = this.locators.menuItemByText(menuText);
    await this.scrollToElement(locator);
    await this.click(locator);
  }

  /**
   * Search for menu item containing specific text
   * @param partialText - Partial text to search for
   */
  async findMenuItemContaining(partialText: string): Promise<boolean> {
    const locator = this.locators.menuItemByPartialText(partialText);
    return await this.isDisplayed(locator);
  }

  /**
   * Get all menu items (for demonstration purposes)
   */
  async getMenuItems(): Promise<string[]> {
    const elements = await this.driver.$$('android.widget.TextView');
    const texts: string[] = [];
    
    for (const element of elements) {
      const text = await element.getText();
      if (text) {
        texts.push(text);
      }
    }
    
    return texts;
  }

  /**
   * Navigate to a specific section
   * @param sectionName - Name of the section to navigate to
   */
  async navigateToSection(sectionName: string): Promise<void> {
    await this.clickMenuItem(sectionName);
    await this.pause(1000); // Wait for navigation
  }
}
