import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * External Storage Page Object
 * Handles interactions with Create and Delete buttons on External Storage screen
 */
export class ExternalStoragePage extends BasePage {
  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Tap a specific Create button by instance index
   * @param instance - The instance index (0 for first, 1 for second, 2 for third)
   */
  async tapCreateButton(instance: number): Promise<void> {
    const createLocator = `android=new UiSelector().text("Create").instance(${instance})`;
    await this.click(createLocator);
    await this.pause(1500);
    console.log(` Tapped Create button instance ${instance}`);
  }

  /**
   * Check if Delete button is enabled
   * @param instance - The instance index (0 for first, 1 for second, 2 for third)
   * @returns true if Delete button is enabled
   */
  async isDeleteButtonEnabled(instance: number): Promise<boolean> {
    const deleteLocator = `android=new UiSelector().text("Delete").instance(${instance})`;
    const element = await this.driver.$(deleteLocator);
    const exists = await element.isExisting();
    
    if (!exists) {
      console.log(` Delete button instance ${instance} not found`);
      return false;
    }
    
    const isEnabled = await element.isEnabled();
    console.log(` Delete button instance ${instance} enabled state: ${isEnabled}`);
    return isEnabled;
  }

  /**
   * Verify Delete button exists
   * @param instance - The instance index (0 for first, 1 for second, 2 for third)
   * @returns true if Delete button exists
   */
  async deleteButtonExists(instance: number): Promise<boolean> {
    const deleteLocator = `android=new UiSelector().text("Delete").instance(${instance})`;
    const element = await this.driver.$(deleteLocator);
    return await element.isExisting();
  }

  /**
   * Capture screenshot with custom name
   * @param screenshotName - Name of the screenshot file
   */
  async captureScreen(screenshotName: string): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync(`screenshots/${screenshotName}.png`, screenshot, 'base64');
    console.log(` Screenshot saved: ${screenshotName}.png`);
  }

  /**
   * Perform complete Create-Delete validation flow
   * @param instance - The instance index (0 for first, 1 for second, 2 for third)
   * @param screenshotName - Name for the screenshot
   * @returns Object with validation results
   */
  async validateCreateDeleteFlow(instance: number, screenshotName: string): Promise<{
    createSuccess: boolean;
    deleteExists: boolean;
    deleteEnabled: boolean;
  }> {
    // Tap Create button
    await this.tapCreateButton(instance);
    
    // Capture screenshot
    await this.captureScreen(screenshotName);
    
    // Check Delete button state
    const deleteExists = await this.deleteButtonExists(instance);
    const deleteEnabled = deleteExists ? await this.isDeleteButtonEnabled(instance) : false;
    
    return {
      createSuccess: true,
      deleteExists,
      deleteEnabled
    };
  }
}
