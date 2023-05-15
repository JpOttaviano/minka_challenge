module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  testRegex: './tests/unit/.*.test.ts$',
  reporters: [ "default", "jest-junit" ]
};