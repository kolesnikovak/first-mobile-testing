import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * Page Object for Text -> Linkify screen
 * Handles verification of linkified text elements
 */
export class LinkifyPage extends BasePage {
  private readonly locators = {
    textMenuItem: 'android=new UiSelector().text("Text")',
    linkifyItem: 'android=new UiSelector().text("Linkify")',
    text1: 'android=new UiSelector().resourceId("io.appium.android.apis:id/text1")',
    text2: 'android=new UiSelector().resourceId("io.appium.android.apis:id/text2")',
    text3: 'android=new UiSelector().resourceId("io.appium.android.apis:id/text3")',
    text4: 'android=new UiSelector().resourceId("io.appium.android.apis:id/text4")',
  };

  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Navigate to Text menu from main screen
   */
  async navigateToTextMenu(): Promise<void> {
    console.log('Step: Navigate to Text menu');
    await this.click(this.locators.textMenuItem);
    await this.pause(1000);
    console.log('Navigated to Text menu');
  }

  /**
   * Navigate to Linkify screen
   */
  async navigateToLinkify(): Promise<void> {
    console.log('Step: Navigate to Linkify');
    await this.click(this.locators.linkifyItem);
    await this.pause(1000);
    console.log('Navigated to Linkify');
  }

  /**
   * Get text from a specific text element
   * @param textNumber - Text element number (1-4)
   * @returns The text content
   */
  async getTextElement(textNumber: 1 | 2 | 3 | 4): Promise<string> {
    const locatorKey = `text${textNumber}` as keyof typeof this.locators;
    const locator = this.locators[locatorKey];
    
    if (typeof locator === 'string') {
      const element = await this.driver.$(locator);
      const exists = await element.isExisting();
      
      if (exists) {
        const text = await element.getText();
        console.log(`  Text ${textNumber}: "${text}"`);
        return text;
      }
    }
    
    throw new Error(`Text element ${textNumber} not found`);
  }

  /**
   * Verify all text elements (1-4) are present
   * @returns Object with all text contents
   */
  async getAllTextElements(): Promise<{
    text1: string;
    text2: string;
    text3: string;
    text4: string;
  }> {
    console.log('\nVerifying all text elements:');
    
    return {
      text1: await this.getTextElement(1),
      text2: await this.getTextElement(2),
      text3: await this.getTextElement(3),
      text4: await this.getTextElement(4),
    };
  }

  /**
   * Verify a specific text element is displayed
   * @param textNumber - Text element number (1-4)
   * @returns true if element is displayed
   */
  async isTextElementDisplayed(textNumber: 1 | 2 | 3 | 4): Promise<boolean> {
    const locatorKey = `text${textNumber}` as keyof typeof this.locators;
    const locator = this.locators[locatorKey];
    
    if (typeof locator === 'string') {
      return await this.isDisplayed(locator);
    }
    
    return false;
  }

  /**
   * Verify all text elements are displayed
   * @returns true if all elements are displayed
   */
  async verifyAllTextElementsDisplayed(): Promise<boolean> {
    console.log('\nVerifying all text elements are displayed:');
    
    for (let i = 1; i <= 4; i++) {
      const isDisplayed = await this.isTextElementDisplayed(i as 1 | 2 | 3 | 4);
      console.log(`  Text ${i}: ${isDisplayed ? 'Displayed' : 'Not displayed'}`);
      
      if (!isDisplayed) {
        return false;
      }
    }
    
    console.log('All text elements are displayed');
    return true;
  }

  /**
   * Take screenshot of Linkify page
   * @param filename - Screenshot filename
   */
  async captureLinkifyScreen(filename: string = 'linkify-page'): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync(`screenshots/${filename}.png`, screenshot, 'base64');
    console.log(`Screenshot saved: ${filename}.png`);
  }
}
