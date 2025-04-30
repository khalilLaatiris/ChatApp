module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/', // Transform axios
    '\\.pnp\\.[^\\/]+$'
  ],
  moduleNameMapper: {
    '^react-router-dom(.*)$': '<rootDir>/node_modules/react-router-dom$1', // Resolve react-router-dom
  },
};