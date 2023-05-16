module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: './tests/integration/.*.test.ts$',
  setupFilesAfterEnv: ['./tests/setup/index.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/']
};