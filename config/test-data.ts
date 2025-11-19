/**
 * Test Data Configuration
 * Contains test data for different test scenarios
 */

export const testData = {
  // User credentials
  users: {
    valid: {
      email: 'testuser@example.com',
      password: 'Test@12345',
      username: 'testuser'
    },
    invalid: {
      email: 'invalid@example.com',
      password: 'WrongPassword123',
      username: 'invaliduser'
    },
    empty: {
      email: '',
      password: ''
    }
  },

  // App package and activity
  app: {
    package: 'com.example.app',
    mainActivity: '.MainActivity',
    loginActivity: '.LoginActivity'
  },

  // Timeout values (in milliseconds)
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 15000,
    veryLong: 30000
  },

  // Test messages
  messages: {
    loginSuccess: 'Login successful',
    loginFailed: 'Invalid credentials',
    fieldRequired: 'This field is required',
    invalidEmail: 'Invalid email format'
  }
};

/**
 * Environment Configuration
 */
export const environment = {
  development: {
    apiUrl: 'https://dev-api.example.com',
    appUrl: 'https://dev.example.com'
  },
  staging: {
    apiUrl: 'https://staging-api.example.com',
    appUrl: 'https://staging.example.com'
  },
  production: {
    apiUrl: 'https://api.example.com',
    appUrl: 'https://example.com'
  }
};

/**
 * Get current environment
 */
export function getCurrentEnvironment() {
  const env = process.env.TEST_ENV || 'development';
  return environment[env as keyof typeof environment] || environment.development;
}