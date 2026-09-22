// cypress/support/e2e.ts

Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test on app errors
  return false;
});