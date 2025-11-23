const Helper = require("@codeceptjs/helper");
const ElementNotFound = require("codeceptjs/lib/helper/errors/ElementNotFound");
const assert = require("assert");

function assertElementExists(res, locator, prefix, suffix) {
  if (!res || res.length === 0) {
    throw new ElementNotFound(locator, prefix, suffix);
  }
}

class PlaywrightAddon extends Helper {
  /**
   * Grab CSS property for given locator with pseudo element
   * Resumes test execution, so **should be used inside an async function with `await`** operator.
   * If more than one element is found - value of first element is returned.
   *
   * ```js
   * const value = await I.grabCssPropertyFromPseudo('h3', 'font-weight', 'after');
   * ```
   *
   * @param {CodeceptJS.LocatorOrString} locator element located by CSS|XPath|strict locator.
   * @param {string} cssProperty CSS property name.
   * @param {string} pseudoElement Pseudo element name.
   * @returns {Promise<string>} CSS value
   */
  async grabCssPropertyFromPseudo(locator, cssProperty, pseudoElement) {
    const cssValues = await this.grabCssPropertyFromAllPseudo(locator, cssProperty, pseudoElement);

    assertElementExists(cssValues, locator);
    this.helpers.Playwright.debugSection("CSS", cssValues[0]);
    return cssValues[0];
  }

  /**
   * Grab array of CSS properties for given locator with pseudo element
   * Resumes test execution, so **should be used inside an async function with `await`** operator.
   *
   * ```js
   * const values = await I.grabCssPropertyFromAllPseudo('h3', 'font-weight', 'after');
   * ```
   *
   * @param {CodeceptJS.LocatorOrString} locator element located by CSS|XPath|strict locator.
   * @param {string} cssProperty CSS property name.
   * @param {string} pseudoElement Pseudo element name.
   * @returns {Promise<string[]>} CSS value
   */
  async grabCssPropertyFromAllPseudo(locator, cssProperty, pseudoElement) {
    const els = await this.helpers.Playwright._locate(locator);

    this.helpers.Playwright.debug(`Matched ${els.length} elements`);
    return await Promise.all(
      els.map((el) =>
        el.evaluate(
          (el, { cssProperty, pseudoElement }) => getComputedStyle(el, pseudoElement).getPropertyValue(cssProperty),
          { cssProperty, pseudoElement },
        ),
      ),
    );
  }

  async seeFocusedElement(selector, { timeout = 2000 } = {}) {
    const startTime = Date.now();
    const checkInterval = 16;

    let isFocused = false;
    let lastError;

    while (Date.now() - startTime < timeout) {
      try {
        const els = await this.helpers.Playwright._locate(selector);
        const areFocused = await Promise.all(els.map((el) => el.evaluate((el) => el === document.activeElement)));
        if (areFocused.some((el) => el)) {
          isFocused = true;
          break;
        }
        lastError = null;
      } catch (error) {
        lastError = error;
      }
      await this.helpers.Playwright.page.waitForTimeout(checkInterval);
    }

    assert.ok(isFocused, `Element ${selector} is not focused after ${timeout}ms${lastError ? `:\n${lastError}` : ""}`);
  }

  /**
   * Get or create CDP client for performance operations
   */
  async _getCDPClient() {
    try {
      const { page } = this.helpers.Playwright;

      // Check if page is still valid
      if (!page || page.isClosed()) {
        this._cdpClient = null;
        throw new Error("Page is closed or invalid");
      }

      // Create new session
      this._cdpClient = await page.context().newCDPSession(page);
      return this._cdpClient;
    } catch (error) {
      this._cdpClient = null;
      throw new Error(`Failed to create CDP session: ${error.message}`);
    }
  }

  /**
   * Clean up CDP client
   */
  async _cleanupCDPClient() {
    if (this._cdpClient) {
      try {
        await this._cdpClient.detach();
      } catch (error) {
        // Ignore cleanup errors
      } finally {
        this._cdpClient = null;
      }
    }
  }

  /**
   * Throttle CPU performance using Chrome DevTools Protocol
   * @param {number} rate - CPU throttling rate (1 = normal, 2 = 2x slower, 4 = 4x slower, etc.)
   */
  async throttleCPU(rate = 1) {
    if (rate < 1) {
      throw new Error("CPU throttling rate must be >= 1");
    }

    try {
      const client = await this._getCDPClient();
      await client.send("Emulation.setCPUThrottlingRate", { rate });
      this._CPUThrottlingRate = rate;
      this.helpers.Playwright.debugSection("CPU", `Throttling set to ${rate}x slower`);
      return this;
    } catch (error) {
      this.helpers.Playwright.debugSection("CPU", `Failed to throttle: ${error.message}`);
      // Clean up broken client
      await this._cleanupCDPClient();
      throw error;
    }
  }

  /**
   * Reset CPU to normal performance
   */
  async resetCPU() {
    try {
      return await this.throttleCPU(1);
    } catch (error) {
      // Ignore errors when page is closed - CPU will be reset automatically
      return this;
    }
  }

  /**
   * CodeceptJS hook - cleanup CDP client after each test
   */
  async _after() {
    if (!this._CPUThrottlingRate || this._CPUThrottlingRate === 1) return;
    // Try to reset CPU before cleanup, but don't fail if page is closed
    try {
      await this.resetCPU();
    } catch (error) {
      // Ignore - page might be closed already
    }
    return this._cleanupCDPClient();
  }

  /**
   * CodeceptJS hook - cleanup CDP client after all tests are finished
   */
  _finishTest() {
    return this._cleanupCDPClient();
  }
}

module.exports = PlaywrightAddon;
