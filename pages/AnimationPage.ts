import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * Page Object for Animation Menu
 * Handles navigation to animation-related screens
 */
export class AnimationPage extends BasePage {
  private readonly locators = {
    animationMenuItem: 'android=new UiSelector().text("Animation")',
    hideShowAnimationsItem: '~Hide-Show Animations',
    hideShowAnimationsItemAlt: 'android=new UiSelector().text("Hide-Show Animations")',
  };

  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Navigate to Animation menu from main screen
   */
  async navigateToAnimation(): Promise<void> {
    console.log('Step: Navigate to Animation menu');
    await this.click(this.locators.animationMenuItem);
    await this.pause(1000);
    console.log('Navigated to Animation menu');
  }

  /**
   * Navigate to Hide-Show Animations screen
   */
  async navigateToHideShowAnimations(): Promise<void> {
    console.log('Step: Navigate to Hide-Show Animations');
    
    let element = await this.driver.$(this.locators.hideShowAnimationsItem);
    let exists = await element.isExisting();
    
    if (!exists) {
      console.log('  Element not found by accessibility id, trying text locator...');
      element = await this.driver.$(this.locators.hideShowAnimationsItemAlt);
      exists = await element.isExisting();
    }
    
    if (exists) {
      await element.click();
      await this.pause(1500);
      console.log('Navigated to Hide-Show Animations');
    } else {
      throw new Error('Hide-Show Animations element not found');
    }
  }

  /**
   * Verify Animation menu is displayed
   */
  async verifyAnimationMenuDisplayed(): Promise<boolean> {
    return await this.isDisplayed(this.locators.hideShowAnimationsItem);
  }

  /**
   * Take screenshot of animation menu
   * @param filename - Screenshot filename
   */
  async captureAnimationMenu(filename: string = 'animations-menu'): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync(`screenshots/${filename}.png`, screenshot, 'base64');
    console.log(`Screenshot saved: ${filename}.png`);
  }
}
