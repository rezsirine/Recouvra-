module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['controller/**/*.js', 'middleware/**/*.js'],
  coverageReporters: ['text', 'lcov'],
};