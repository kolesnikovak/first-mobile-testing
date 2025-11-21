import { Browser } from 'webdriverio';
import { BasePage } from './BasePage';

/**
 * Page Object for Accessibility Service screen
 * Handles verification of accessibility service steps
 */
export class AccessibilityServicePage extends BasePage {
  constructor(driver: Browser) {
    super(driver);
  }

  /**
   * Verify a specific step text is present in the page
   * @param stepNumber - Step number to verify (1-8)
   * @returns true if step is found
   */
  async verifyStepPresent(stepNumber: number): Promise<boolean> {
    const pageSource = await this.driver.getPageSource();
    const stepText = `${stepNumber}.`;
    return pageSource.includes(stepText);
  }

  /**
   * Verify all steps (1-8) are present
   * @param totalSteps - Total number of steps to verify
   * @returns Array of verification results
   */
  async verifyAllSteps(totalSteps: number = 8): Promise<boolean[]> {
    console.log(`\nVerifying ${totalSteps} steps in Accessibility Service`);
    const results: boolean[] = [];
    
    for (let i = 1; i <= totalSteps; i++) {
      const isPresent = await this.verifyStepPresent(i);
      results.push(isPresent);
      console.log(`  Step ${i}: ${isPresent ? 'Found' : 'Not found'}`);
    }
    
    return results;
  }

  /**
   * Get all step texts from the page
   * @returns Array of step texts
   */
  async getAllStepTexts(): Promise<string[]> {
    const pageSource = await this.driver.getPageSource();
    const stepTexts: string[] = [];
    
    for (let i = 1; i <= 8; i++) {
      const regex = new RegExp(`${i}\\. ([^<]+)`, 'g');
      const matches = regex.exec(pageSource);
      if (matches && matches[1]) {
        stepTexts.push(matches[1].trim());
      }
    }
    
    return stepTexts;
  }

  /**
   * Take screenshot of the service page
   * @param filename - Screenshot filename
   */
  async captureServiceScreen(filename: string = 'accessibility-service'): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    require('fs').writeFileSync(`screenshots/${filename}.png`, screenshot, 'base64');
    console.log(`Screenshot saved: ${filename}.png`);
  }
}
