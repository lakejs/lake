module.exports = {
  verbose: true,
  testMatch: ['<rootDir>/test/**/*.{ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
};
