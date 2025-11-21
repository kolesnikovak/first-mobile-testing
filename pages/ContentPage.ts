import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * Content Page Object
 * Handles navigation to Content menu and its sub-menus
 */
export class ContentPage extends BasePage {
  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Navigate to Content menu from main screen
   */
  async navigateToContent(): Promise<void> {
    const contentLocator = 'android=new UiSelector().text("Content")';
    await this.click(contentLocator);
    await this.pause(1500);
    console.log(' Navigated to Content menu');
  }

  /**
   * Navigate to Storage submenu
   */
  async navigateToStorage(): Promise<void> {
    const storageLocator = 'android=new UiSelector().text("Storage")';
    await this.click(storageLocator);
    await this.pause(1500);
    console.log(' Navigated to Storage submenu');
  }

  /**
   * Capture screenshot of Content menu
   */
  async captureContentScreen(): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/content-menu.png', screenshot, 'base64');
    console.log(' Screenshot saved: content-menu.png');
  }
}
