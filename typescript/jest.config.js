/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    "default",
    ["jest-html-reporters", {
      "publicPath": "./jest-custom-report",
      "filename": "unit-test-report.html",
      "openReport": true
    }]
  ],
};