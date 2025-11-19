import { Browser } from 'webdriverio';

/**
 * Base Page Object class
 * Contains common methods used across all page objects
 */
export class BasePage {
  protected driver: Browser;

  constructor(driver: Browser) {
    this.driver = driver;
  }

  /**
   * Wait for element to be displayed
   * @param locator - Element locator strategy (accessibility id, resource-id, xpath)
   * @param timeout - Maximum wait time in milliseconds (default: 10000)
   */
  async waitForElement(locator: string, timeout: number = 10000): Promise<void> {
    const element = await this.driver.$(locator);
    await element.waitForDisplayed({ timeout });
  }

  /**
   * Click on an element
   * @param locator - Element locator
   */
  async click(locator: string): Promise<void> {
    await this.waitForElement(locator);
    const element = await this.driver.$(locator);
    await element.click();
  }

  /**
   * Send text to an element
   * @param locator - Element locator
   * @param text - Text to input
   */
  async sendKeys(locator: string, text: string): Promise<void> {
    await this.waitForElement(locator);
    const element = await this.driver.$(locator);
    await element.setValue(text);
  }

  /**
   * Get text from an element
   * @param locator - Element locator
   * @returns Element text
   */
  async getText(locator: string): Promise<string> {
    await this.waitForElement(locator);
    const element = await this.driver.$(locator);
    return await element.getText();
  }

  /**
   * Check if element is displayed
   * @param locator - Element locator
   * @returns true if element is displayed
   */
  async isDisplayed(locator: string): Promise<boolean> {
    try {
      const element = await this.driver.$(locator);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Scroll to element
   * @param locator - Element locator
   */
  async scrollToElement(locator: string): Promise<void> {
    const element = await this.driver.$(locator);
    await element.scrollIntoView();
  }

  /**
   * Wait for a specific time
   * @param milliseconds - Time to wait in milliseconds
   */
  async pause(milliseconds: number): Promise<void> {
    await this.driver.pause(milliseconds);
  }

  /**
   * Swipe on the screen
   * @param direction - Direction to swipe (up, down, left, right)
   */
  async swipe(direction: 'up' | 'down' | 'left' | 'right'): Promise<void> {
    const { width, height } = await this.driver.getWindowSize();
    const centerX = width / 2;
    const centerY = height / 2;

    let startX = centerX;
    let startY = centerY;
    let endX = centerX;
    let endY = centerY;

    switch (direction) {
      case 'up':
        startY = height * 0.8;
        endY = height * 0.2;
        break;
      case 'down':
        startY = height * 0.2;
        endY = height * 0.8;
        break;
      case 'left':
        startX = width * 0.8;
        endX = width * 0.2;
        break;
      case 'right':
        startX = width * 0.2;
        endX = width * 0.8;
        break;
    }

    await this.driver.touchAction([
      { action: 'press', x: startX, y: startY },
      { action: 'wait', ms: 500 },
      { action: 'moveTo', x: endX, y: endY },
      { action: 'release' }
    ]);
  }
}
