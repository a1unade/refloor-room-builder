import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/dist/**/*',
      '**/node_modules/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/*.d.ts',
    ],
  },

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true, semi: true }],
    },
  },
);
