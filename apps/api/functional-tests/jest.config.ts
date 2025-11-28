import type { Config } from 'jest';
import { baseConfig } from '../jest.config.base';

const config: Config = {
  ...baseConfig,
  rootDir: '..', // Set root to apps/api so paths resolve correctly
  testMatch: ['<rootDir>/functional-tests/**/*.spec.ts', '<rootDir>/functional-tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts', '<rootDir>/test/setup-functional.ts'],
  testTimeout: 60_000
};

export default config;

