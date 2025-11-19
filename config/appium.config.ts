/**
 * Appium Configuration
 * Contains device and app configuration for mobile testing
 */

export interface AppiumConfig {
  hostname: string;
  port: number;
  logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
  capabilities: {
    platformName: string;
    'appium:deviceName': string;
    'appium:automationName': string;
    'appium:app': string;
    'appium:appPackage'?: string;
    'appium:appActivity'?: string;
    'appium:noReset'?: boolean;
    'appium:fullReset'?: boolean;
    'appium:autoGrantPermissions'?: boolean;
    'appium:newCommandTimeout'?: number;
  };
}

/**
 * Default configuration for Android emulator
 */
export const defaultAndroidConfig: AppiumConfig = {
  hostname: 'localhost',
  port: 4723,
  logLevel: 'info',
  capabilities: {
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554', // Update with your device name from 'adb devices'
    'appium:automationName': 'UiAutomator2',
    'appium:app': '', // Set app path in tests
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 300
  }
};

/**
 * Configuration for real Android device
 */
export const realDeviceConfig: AppiumConfig = {
  hostname: 'localhost',
  port: 4723,
  logLevel: 'info',
  capabilities: {
    platformName: 'Android',
    'appium:deviceName': 'REAL_DEVICE_ID', // Get from 'adb devices'
    'appium:automationName': 'UiAutomator2',
    'appium:app': '',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 300
  }
};

/**
 * Get configuration based on environment
 */
export function getConfig(deviceType: 'emulator' | 'real' = 'emulator'): AppiumConfig {
  return deviceType === 'emulator' ? defaultAndroidConfig : realDeviceConfig;
}

/**
 * Update app path in configuration
 */
export function setAppPath(config: AppiumConfig, appPath: string): AppiumConfig {
  return {
    ...config,
    capabilities: {
      ...config.capabilities,
      'appium:app': appPath
    }
  };
}

/**
 * Update device name in configuration
 */
export function setDeviceName(config: AppiumConfig, deviceName: string): AppiumConfig {
  return {
    ...config,
    capabilities: {
      ...config.capabilities,
      'appium:deviceName': deviceName
    }
  };
}
