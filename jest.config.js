module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'src/app/**/*.{ts,tsx}',
    'src/features/auth/**/*.{ts,tsx}',
    'src/features/feed/**/*.{ts,tsx}',
    'src/features/onboarding/**/*.{ts,tsx}',
    'src/features/settings/**/*.{ts,tsx}',
    'src/lib/**/*.{ts,tsx}',
    'src/components/ui/date-picker/**/*.{ts,tsx}',
    'src/components/ui/date-time-picker/**/*.{ts,tsx}',
    'src/components/ui/image-viewer/**/*.{ts,tsx}',
    'src/components/ui/tabs/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    // Native Jest does not resolve platform Web entrypoints. They are covered
    // by the Web Expo export and browser/E2E checks instead of reporting 0%.
    '!**/*.web.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest-setup.ts',
    '!**/docs/**',
    '!**/cli/**',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transformIgnorePatterns: [
    `node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@gluestack-ui/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|@sentry/.*|native-base|react-native-svg|@gorhom/.*|@tanstack/.*|react-native-reanimated|react-native-mmkv|react-native-nitro-modules|react-native-worklets|zustand|tailwind-merge|tailwind-variants|uniwind))`,
  ],
  coverageReporters: ['json-summary', ['text', { file: 'coverage.txt' }]],
  reporters: [
    'default',
    ['github-actions', { silent: false }],
    'summary',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'jest-junit.xml',
        ancestorSeparator: ' › ',
        uniqueOutputName: 'false',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
  coverageDirectory: '<rootDir>/coverage/',
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 30,
      lines: 35,
      statements: 35,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
