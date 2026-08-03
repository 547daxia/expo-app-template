import path from 'node:path';
import { fileURLToPath } from 'node:url';

import antfu from '@antfu/eslint-config';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import reactCompiler from 'eslint-plugin-react-compiler';
import testingLibrary from 'eslint-plugin-testing-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default antfu(
  {
    // Enable React and TypeScript support
    react: true,
    typescript: true,

    // Use ESLint Stylistic for formatting
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },

    // Global ignores
    ignores: [
      'dist/*',
      'node_modules',
      '__tests__/',
      'coverage',
      '.expo',
      '.expo-shared',
      '.github/**',
      'android',
      'ios',
      '__mocks__/**',
      '.vscode',
      'docs/',
      'cli/',
      'expo-env.d.ts',
      'uniwind-types.d.ts',
      'migration/*',
      'src/components/ui/**/*.md',
    ],
  },

  // Custom rules
  {
    rules: {
      'max-params': ['error', 3],
      'max-lines-per-function': ['error', 110],
      'react/display-name': 'off',
      'react/no-inline-styles': 'off',
      'react/destructuring-assignment': 'off',
      'react/require-default-props': 'off',
      'react-refresh/only-export-components': 'warn', // Too strict for React Native
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: [
            '/android',
            '/ios',
            'README.md',
            'README-project.md',
            'ISSUE_TEMPLATE.md',
            'PULL_REQUEST_TEMPLATE.md',
          ],
        },
      ],
      'node/prefer-global/process': 'off', // process is commonly used in React Native configs
      'ts/no-require-imports': 'off', // Sometimes needed for mocks
      'ts/no-use-before-define': 'off', // Allow forward references in React components
      'no-console': 'off', // Console is useful for debugging
      'no-cond-assign': 'off', // Allow assignment in conditions when intentional
      'regexp/no-super-linear-backtracking': 'off', // Relax regex performance rules
      'regexp/no-unused-capturing-group': 'off', // Allow unused capturing groups
    },
  },

  // TypeScript-specific rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'ts/consistent-type-definitions': ['error', 'type'], // Prefer type over interface
      'react-hooks/refs': 'off', // Allow useRef without exhaustive-deps
      'ts/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: true,
        },
      ],
    },
  },

  // Better TailwindCSS plugin
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...betterTailwindcss.configs.recommended,
    settings: {
      'better-tailwindcss': {
        entryPoint: path.resolve(__dirname, './src/global.css'),
      },
    },
    rules: {
      ...betterTailwindcss.configs.recommended.rules,
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
      'better-tailwindcss/no-unknown-classes': 'warn',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off', // Can be too strict for some cases
    },
  },

  // React Compiler plugin
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },

  // Gluestack CLI sources use upstream filenames and large compound factories.
  // Keep correctness linting enabled while relaxing repository-only structure rules.
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    ignores: [
      'src/components/ui/chat-ai/**',
      'src/components/ui/date-picker/**',
      'src/components/ui/date-time-picker/**',
      'src/components/ui/image-viewer/**',
      'src/components/ui/tabs/**',
    ],
    rules: {
      'better-tailwindcss/enforce-canonical-classes': 'off',
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'max-lines-per-function': 'off',
      'react-compiler/react-compiler': 'off',
      'react/no-children-map': 'off',
      'react/no-children-to-array': 'off',
      'react/no-clone-element': 'off',
      'react/no-context-provider': 'off',
      'react/no-forward-ref': 'off',
      'react/no-use-context': 'off',
      'react/use-state': 'off',
      'react-refresh/only-export-components': 'off',
      'ts/ban-ts-comment': 'off',
      'unicorn/filename-case': 'off',
    },
  },

  // Hand-written compound/gesture components keep repository defaults. Only
  // relax rules that conflict with public refs, context, or UI-thread values.
  {
    files: [
      'src/components/ui/chat-ai/**/*.{ts,tsx}',
      'src/components/ui/date-picker/**/*.{ts,tsx}',
      'src/components/ui/date-time-picker/**/*.{ts,tsx}',
      'src/components/ui/image-viewer/**/*.{ts,tsx}',
      'src/components/ui/tabs/**/*.{ts,tsx}',
    ],
    rules: {
      'max-lines-per-function': 'off',
      'react-compiler/react-compiler': 'off',
      'react/no-children-to-array': 'off',
      'react/no-clone-element': 'off',
      'react/no-context-provider': 'off',
      'react/no-forward-ref': 'off',
      'react/no-use-context': 'off',
      'react/use-state': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },

  // The web provider injects a static, repository-owned theme bootstrap script.
  {
    files: ['src/components/ui/gluestack-ui-provider/index.web.tsx'],
    rules: {
      'react/dom-no-dangerously-set-innerhtml': 'off',
    },
  },

  // Streaming message parts, branch history, and skeleton lines are positional
  // sequences; their upstream data models do not provide stable item IDs.
  {
    files: [
      'src/components/ui/chat-ai/message.tsx',
      'src/components/ui/skeleton/index.tsx',
    ],
    rules: {
      'react/no-array-index-key': 'off',
    },
  },

  // Testing Library rules
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: { 'testing-library': testingLibrary },
    rules: {
      ...testingLibrary.configs.react.rules,
    },
  },
);
