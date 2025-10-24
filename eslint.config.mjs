import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Config files - allowed as .js/.mjs/.cjs
    '*.config.js',
    '*.config.mjs',
    '*.config.cjs',
    'eslint.config.mjs',
  ]),
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['**/*.config.js', '**/*.config.mjs', '**/*.config.cjs'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message:
            'JavaScript (.js) and JSX (.jsx) files are not allowed. Please use TypeScript (.ts) or TSX (.tsx) instead.',
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);

export default eslintConfig;
