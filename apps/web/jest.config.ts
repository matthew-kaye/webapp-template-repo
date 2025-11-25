import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)']
};

export default createJestConfig(config);
