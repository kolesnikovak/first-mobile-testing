import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * Storage Page Object
 * Handles navigation within Storage menu
 */
export class StoragePage extends BasePage {
  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Navigate to External Storage option
   */
  async navigateToExternalStorage(): Promise<void> {
    const externalStorageLocator = 'android=new UiSelector().text("External Storage")';
    await this.click(externalStorageLocator);
    await this.pause(2000);
    console.log(' Navigated to External Storage');
  }

  /**
   * Capture screenshot of Storage menu
   */
  async captureStorageScreen(): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/storage-menu.png', screenshot, 'base64');
    console.log(' Screenshot saved: storage-menu.png');
  }
}
