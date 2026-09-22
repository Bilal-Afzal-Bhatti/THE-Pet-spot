import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "hc2qhk",
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // implement node event listeners here
    },
  },
});