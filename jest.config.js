module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: './tests/integration/.*.test.ts$',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};