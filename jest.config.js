export default {
    transform: {
      '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: ['js'],
    testEnvironment: 'jsdom',
    setupFiles: ['jest-webextension-mock'],
    transformIgnorePatterns: [
      'node_modules/(?!(jest-webextension-mock)/)'
    ]
  };
  