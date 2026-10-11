module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/test/**/*.test.ts'],
  // 実際のAPIに接続するテストがあるため長めにとる
  testTimeout: 30000
}
