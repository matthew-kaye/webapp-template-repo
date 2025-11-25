import type { Config } from 'jest';

const setupFilesAfterEnv = ['<rootDir>/test/setup.ts'];
const config: Config = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  setupFilesAfterEnv,
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts']
};

if (process.env.TEST_TYPE === 'functional') {
  setupFilesAfterEnv.push('<rootDir>/test/setup-functional.ts');
  config.testTimeout = 60_000;
}

export default config;
