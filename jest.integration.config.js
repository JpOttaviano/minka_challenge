module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  testRegex: './tests/integration/.*.test.ts$',
  setupFilesAfterEnv: ['./tests/setup/index.ts'],
  reporters: [ "default", "jest-junit" ]
};