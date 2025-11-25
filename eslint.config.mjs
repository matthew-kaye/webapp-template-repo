import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const { configs: jsConfigs } = js;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: jsConfigs.recommended,
  allConfig: jsConfigs.all
});

export default [
  {
    ignores: ['node_modules', 'dist', '.next', '.turbo']
  },
  ...compat.config({
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
          project: [path.join(__dirname, 'tsconfig.base.json'), './apps/*/tsconfig.json']
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
    overrides: [
      {
        files: ['**/*.spec.{ts,tsx}', '**/*.test.{ts,tsx}'],
        env: {
          jest: true
        }
      }
    ]
  })
];
