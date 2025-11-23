const { recorder, event } = require("codeceptjs");
const Container = require("codeceptjs/lib/container");

const supportedHelpers = ["Playwright"];

/**
 * This plugin will listen for setting feature flags and apply them at the moment of page loading.
 * In this case set feature flags will affect the whole code including  models initialization,
 * and other similar parts that will run on the the scripts load.
 */

module.exports = () => {
  const helpers = Container.helpers();
  let helper;

  for (const helperName of supportedHelpers) {
    if (Object.keys(helpers).indexOf(helperName) > -1) {
      helper = helpers[helperName];
    }
  }

  if (!helper) {
    console.error(`Feature flags is only supported in ${supportedHelpers.join(", ")}`);
    return;
  }

  function hasStepName(name, step) {
    return step && (name === step.name || hasStepName(name, step.metaStep));
  }

  event.dispatcher.on(event.step.before, async (step) => {
    if (hasStepName("amOnPage", step)) {
      recorder.add("disable default init", async () => {
        try {
          helper.page.once("requestfinished", () => {
            helper.page.evaluate(() => {
              if (!window.DISABLE_DEFAULT_LSF_INIT) window.DISABLE_DEFAULT_LSF_INIT = true;
            });
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
  });
};
