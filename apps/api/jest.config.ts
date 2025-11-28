import type { Config } from 'jest';
import { baseConfig } from './jest.config.base';

const config: Config = {
  ...baseConfig,
  testMatch: ['**/?(*.)+(spec|test).ts'],
  testPathIgnorePatterns: ['functional-tests'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts']
};

export default config;

