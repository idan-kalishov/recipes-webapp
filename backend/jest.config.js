/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: 'tsconfig.json',
      diagnostics: false,
      babelConfig: true, // If you're using Babel
    }],
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/", // If you compile your TS files to a dist folder
    "/tests/", // If you store test files outside of the src directory
    "src/index.ts",
    "\\.d\\.ts$" // Ignore TypeScript declaration files
  ],
};