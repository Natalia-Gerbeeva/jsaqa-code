const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'Cypress/cypress/e2e/**/*.cy.js',
    supportFile: 'Cypress/cypress/support/e2e.js',
    viewportWidth: 1366,
    viewportHeight: 768,
  },
})
