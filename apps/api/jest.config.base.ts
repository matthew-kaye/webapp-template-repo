import type { Config } from 'jest';

const baseConfig: Config = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true
        }
      }
    ]
  }
};

// Export both as ES module and CommonJS for compatibility
export { baseConfig };
module.exports = { baseConfig };

