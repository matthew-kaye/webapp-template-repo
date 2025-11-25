module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.base.json', './apps/*/tsconfig.json']
      }
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  ignorePatterns: ['node_modules', 'dist', '.next', '.turbo'],
  overrides: [
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      extends: ['next', 'next/core-web-vitals'],
      parserOptions: {
        project: './apps/web/tsconfig.json'
      },
      env: {
        browser: true
      }
    },
    {
      files: ['**/*.spec.{ts,tsx}'],
      env: {
        jest: true
      }
    }
  ]
};
