import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * Page Object for Hide-Show Animations screen
 * Handles interaction with buttons and show/hide functionality
 */
export class HideShowAnimationsPage extends BasePage {
  private readonly locators = {
    showButtonsBtn: 'android=new UiSelector().text("Show Buttons")',
    buttonByText: (id: number) => `android=new UiSelector().text("${id}")`,
    buttonByResourceId: (id: number) => `android=new UiSelector().resourceId("io.appium.android.apis:id/button${id}")`,
    buttonByDescription: (id: number) => `android=new UiSelector().description("${id}")`,
  };

  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Find a button using multiple strategies
   * @param buttonId - Button ID (0-3)
   * @returns Element and the strategy used
   */
  private async findButton(buttonId: number): Promise<{ element: any; strategy: string }> {
    // Strategy 1: Try by resource-id
    try {
      const element = await this.driver.$(this.locators.buttonByResourceId(buttonId));
      if (await element.isExisting()) {
        console.log(`  Button ${buttonId} found by resource-id`);
        return { element, strategy: 'resource-id' };
      }
    } catch (e) {
      // Continue to next strategy
    }

    // Strategy 2: Try by text content
    try {
      const element = await this.driver.$(this.locators.buttonByText(buttonId));
      if (await element.isExisting()) {
        console.log(`  Button ${buttonId} found by text`);
        return { element, strategy: 'text' };
      }
    } catch (e) {
      // Continue to next strategy
    }

    // Strategy 3: Try by description
    try {
      const element = await this.driver.$(this.locators.buttonByDescription(buttonId));
      if (await element.isExisting()) {
        console.log(`  Button ${buttonId} found by description`);
        return { element, strategy: 'description' };
      }
    } catch (e) {
      // Continue to next strategy
    }

    // Strategy 4: Try to find all buttons and identify by index
    try {
      const allButtons = await this.driver.$$('android.widget.Button');
      if (allButtons && allButtons[buttonId]) {
        const element = allButtons[buttonId];
        if (await element.isExisting()) {
          console.log(`  Button ${buttonId} found by index in button collection`);
          return { element, strategy: 'index' };
        }
      }
    } catch (e) {
      // Element not found
    }

    throw new Error(`Button ${buttonId} not found using any strategy`);
  }

  /**
   * Hide a specific button by clicking it
   * @param buttonId - Button ID (0-3)
   */
  async hideButton(buttonId: number): Promise<void> {
    console.log(`\nStep: Tap button ${buttonId} and validate it's gone`);
    
    const { element } = await this.findButton(buttonId);
    
    await element.click();
    console.log(`Clicked button ${buttonId}`);
    
    // Wait for animation to complete
    await this.pause(1000);
    
    // Verify the button is gone
    const buttonStillExists = await element.isExisting();
    console.log(`  Button ${buttonId} still visible: ${buttonStillExists}`);
    
    if (buttonStillExists) {
      throw new Error(`Button ${buttonId} should be hidden but is still visible`);
    }
    
    console.log(`Button ${buttonId} successfully hidden`);
  }

  /**
   * Hide all buttons (0-3)
   */
  async hideAllButtons(): Promise<void> {
    for (let i = 0; i <= 3; i++) {
      await this.hideButton(i);
      await this.captureButtonState(i, 'hidden');
    }
  }

  /**
   * Click "Show Buttons" to restore all hidden buttons
   */
  async showAllButtons(): Promise<void> {
    console.log('\nStep: Tap "Show Buttons" and verify all buttons are back');
    
    const showButton = await this.driver.$(this.locators.showButtonsBtn);
    const exists = await showButton.isExisting();
    
    console.log(`  "Show Buttons" button exists: ${exists}`);
    
    if (!exists) {
      throw new Error('"Show Buttons" button not found');
    }
    
    await showButton.click();
    console.log('Clicked "Show Buttons"');
    
    // Wait for animation to complete (longer wait for all 4 buttons to appear)
    await this.pause(2500);
  }

  /**
   * Verify a specific button is visible
   * @param buttonId - Button ID (0-3)
   * @returns true if button is visible
   */
  async isButtonVisible(buttonId: number): Promise<boolean> {
    try {
      const { element } = await this.findButton(buttonId);
      return await element.isExisting();
    } catch (e) {
      return false;
    }
  }

  /**
   * Verify all buttons are visible
   * @param buttonIds - Array of button IDs to verify
   * @returns Object with visibility status for each button
   */
  async verifyAllButtonsVisible(buttonIds: number[] = [0, 1, 2, 3]): Promise<Record<number, boolean>> {
    console.log('\nVerifying all buttons are visible again:');
    const results: Record<number, boolean> = {};
    
    for (const buttonId of buttonIds) {
      const isVisible = await this.isButtonVisible(buttonId);
      results[buttonId] = isVisible;
      console.log(`  Button ${buttonId} visible: ${isVisible}`);
      
      if (!isVisible) {
        throw new Error(`Button ${buttonId} should be visible but is not found`);
      }
    }
    
    console.log('All buttons successfully restored');
    return results;
  }

  /**
   * Take screenshot of button state
   * @param buttonId - Button ID
   * @param state - Button state ('hidden' or 'shown')
   */
  async captureButtonState(buttonId: number, state: 'hidden' | 'shown'): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    const filename = `button-${buttonId}-${state}.png`;
    require('fs').writeFileSync(`screenshots/${filename}`, screenshot, 'base64');
    console.log(`Screenshot saved: ${filename}`);
  }

  /**
   * Take screenshot of all buttons shown
   */
  async captureAllButtonsShown(): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/all-buttons-shown.png', screenshot, 'base64');
    console.log('Screenshot saved: all-buttons-shown.png');
  }

  /**
   * Capture initial state of Hide-Show Animations page
   */
  async captureInitialState(): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync('screenshots/hide-show-animations-page.png', screenshot, 'base64');
    console.log('Screenshot saved: hide-show-animations-page.png');
  }
}
