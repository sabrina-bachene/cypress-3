const { defineConfig } = require("cypress");
module.exports = defineConfig({
  projectId: 'afyd4v',
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
});
