import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * Page Object for Custom View screen
 * Handles text verification on Custom View page
 */
export class CustomViewPage extends BasePage {
  private readonly expectedInstructions = {
    step1: '1. Enable TalkBack',
    step2: '2. Enable Explore-by-Touch',
    step3: '3. Touch explore/poke the buttons',
  };

  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Get the instructional text from the Custom View page
   * Uses multiple strategies to find the text element
   * @returns The instructional text
   */
  async getInstructionalText(): Promise<string> {
    console.log('\nSearching for instructional text...');
    
    // Strategy 1: Find by partial text using UiSelector
    let element = await this.driver.$(`android=new UiSelector().textContains("1. Enable TalkBack")`);
    let exists = await element.isExisting();
    
    if (exists) {
      console.log('Text element found using Strategy 1: UiSelector with textContains');
      return await element.getText();
    }
    
    // Strategy 2: Find all TextViews and search through them
    console.log('Strategy 1 failed, trying Strategy 2: Search through TextViews...');
    const textViews = await this.driver.$$('android.widget.TextView');
    
    for (const textView of textViews) {
      try {
        const text = await textView.getText();
        if (text && text.includes('1. Enable TalkBack')) {
          console.log('Text element found in TextView');
          return text;
        }
      } catch (e) {
        // Skip elements that can't be read
      }
    }
    
    throw new Error('Instructional text not found');
  }

  /**
   * Verify all three steps are present in the instructional text
   * @returns Object with verification results for each step
   */
  async verifyAllInstructions(): Promise<{
    step1: boolean;
    step2: boolean;
    step3: boolean;
  }> {
    const actualText = await this.getInstructionalText();
    const normalizedText = actualText.replace(/\\n/g, '\n').trim();
    
    console.log('\nVerification Results:');
    
    const step1Present = normalizedText.includes(this.expectedInstructions.step1);
    const step2Present = normalizedText.includes(this.expectedInstructions.step2);
    const step3Present = normalizedText.includes(this.expectedInstructions.step3);
    
    console.log(`  Step 1 (Enable TalkBack): ${step1Present ? 'Found' : 'Not found'}`);
    console.log(`  Step 2 (Enable Explore-by-Touch): ${step2Present ? 'Found' : 'Not found'}`);
    console.log(`  Step 3 (Touch explore/poke): ${step3Present ? 'Found' : 'Not found'}`);
    
    return {
      step1: step1Present,
      step2: step2Present,
      step3: step3Present,
    };
  }

  /**
   * Verify the page contains expected text
   * @param expectedText - The text to verify
   * @returns true if text is found
   */
  async verifyTextContains(expectedText: string): Promise<boolean> {
    const actualText = await this.getInstructionalText();
    return actualText.includes(expectedText);
  }

  /**
   * Take screenshot of Custom View page
   * @param filename - Screenshot filename
   */
  async captureCustomViewScreen(filename: string = 'custom-view-page'): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync(`screenshots/${filename}.png`, screenshot, 'base64');
    console.log(`Screenshot saved: ${filename}.png`);
  }
}
