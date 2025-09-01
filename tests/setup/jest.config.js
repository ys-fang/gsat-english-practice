module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/test-setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'scripts/**/*.js',
    '!scripts/exam-*.js', // 排除考試資料檔案
    '!scripts/question-generator.js',
    '!scripts/year-template-generator.js'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@scripts/(.*)$': '<rootDir>/scripts/$1'
  },
  testTimeout: 30000,
  verbose: true
};