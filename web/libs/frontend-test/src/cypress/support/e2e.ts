// Custom commands can be executed with `cy.[command_name]`
import "./commands";

import "@cypress/code-coverage/support";

// Output spec steps
require("cypress-terminal-report/src/installLogsCollector")();

// Global throttling reset after each test
afterEach(() => {
  const defaultCpuThrottling = Cypress.env("DEFAULT_CPU_THROTTLING");
  const defaultNetworkThrottling = Cypress.env("DEFAULT_NETWORK_THROTTLING");

  if (defaultCpuThrottling) {
    cy.resetCPU();
  }

  if (defaultNetworkThrottling) {
    cy.resetNetwork();
  }
});
