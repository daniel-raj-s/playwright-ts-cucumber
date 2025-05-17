import { expect, Locator, Page } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import path from "path";

export class Assertions {
  private readonly page: Page;
  private readonly defaultTimeout: number;

  /**
   * @param page - Playwright Page
   * @param defaultTimeout - default timeout for all assertions (ms)
   */
  constructor(page: Page, defaultTimeout = 10_000) {
    this.page = page;
    this.defaultTimeout = defaultTimeout;
    this.page.setDefaultTimeout(this.defaultTimeout);
  }

  /** Normalize a selector or Locator into a Locator */
  private toLocator(selector: string | Locator): Locator {
    if (typeof selector !== "string") return selector;
    return selector.startsWith("//")
      ? this.page.locator(`xpath=${selector}`)
      : this.page.locator(selector);
  }

  /** Convert string or Locator into a human-readable description */
  private describeSelector(selector: string | Locator): string {
    if (typeof selector === "string") {
      return selector;
    }
    return JSON.stringify(selector);
  }

  /** Internal logging + optional screenshot capture */
  private async log(
    passed: boolean,
    message: string,
    opts: { expected?: any; actual?: any; error?: any; soft?: boolean }
  ) {
    const { expected, actual, error, soft } = opts;
    const logMsg = [
      message,
      expected !== undefined && `Expected: "${expected}"`,
      actual !== undefined && `Actual: "${actual}"`,
    ]
      .filter(Boolean)
      .join(" | ");

    if (passed) {
      fixture.logger.info(`[PASS] ${logMsg}`);
      console.log(`[PASS] ${logMsg}`);
    } else {
      // capture screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const screenshotPath = path.join(
        "screenshots",
        `assertion-${timestamp}.png`
      );
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      fixture.logger.error(`[FAIL] ${logMsg} (screenshot: ${screenshotPath})`);
      console.error(`[FAIL] ${logMsg}`);
      console.error(error);
      if (!soft) throw error;
    }
  }

  /** Assert page title */
  async assertTitle(
    expectedTitle: string,
    message = "Page title assertion",
    timeout = this.defaultTimeout,
    soft = false
  ) {
    try {
      await expect(this.page).toHaveTitle(expectedTitle, { timeout });
      await this.log(true, message, { expected: expectedTitle, soft });
    } catch (err) {
      await this.log(false, message, {
        expected: expectedTitle,
        actual: await this.page.title(),
        error: err,
        soft,
      });
    }
  }

  /** Assert current URL */
  async assertUrl(
    expectedUrl: string,
    message = "Page URL assertion",
    timeout = this.defaultTimeout,
    soft = false
  ) {
    try {
      await expect(this.page).toHaveURL(expectedUrl, { timeout });
      await this.log(true, message, { expected: expectedUrl, soft });
    } catch (err) {
      await this.log(false, message, {
        expected: expectedUrl,
        actual: this.page.url(),
        error: err,
        soft,
      });
    }
  }

  /** Assert element is visible */
  async assertElementVisible(
    selector: string | Locator,
    message?: string,
    timeout = this.defaultTimeout,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Element visible: ${this.describeSelector(selector)}`;
    try {
      await expect(locator).toBeVisible({ timeout });
      await this.log(true, msg, { soft });
    } catch (err) {
      await this.log(false, msg, { error: err, soft });
    }
  }

  /** Assert element is hidden or not visible */
  async assertElementHidden(
    selector: string | Locator,
    message?: string,
    timeout = this.defaultTimeout,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Element hidden: ${this.describeSelector(selector)}`;
    try {
      await expect(locator).toBeHidden({ timeout });
      await this.log(true, msg, { soft });
    } catch (err) {
      await this.log(false, msg, { error: err, soft });
    }
  }

  /** Assert element is enabled */
  async assertElementEnabled(
    selector: string | Locator,
    message?: string,
    timeout = this.defaultTimeout,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Element enabled: ${this.describeSelector(selector)}`;
    try {
      await expect(locator).toBeEnabled({ timeout });
      await this.log(true, msg, { soft });
    } catch (err) {
      await this.log(false, msg, { error: err, soft });
    }
  }

  /** Assert element is disabled */
  async assertElementDisabled(
    selector: string | Locator,
    message?: string,
    timeout = this.defaultTimeout,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Element disabled: ${this.describeSelector(selector)}`;
    try {
      await expect(locator).toBeDisabled({ timeout });
      await this.log(true, msg, { soft });
    } catch (err) {
      await this.log(false, msg, { error: err, soft });
    }
  }

  /** Assert exact text */
  async assertElementText(
    selector: string | Locator,
    expectedText: string,
    message?: string,
    timeout = this.defaultTimeout,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Element text equals: ${this.describeSelector(selector)}`;
    try {
      await expect(locator).toHaveText(expectedText, { timeout });
      await this.log(true, msg, { expected: expectedText, soft });
    } catch (err) {
      const actual = await locator.textContent();
      await this.log(false, msg, { expected: expectedText, actual, error: err, soft });
    }
  }

  /** Assert text contains */
  async assertElementTextContains(
    selector: string | Locator,
    expectedSubstring: string,
    message?: string,
    timeout = this.defaultTimeout,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Element text contains: ${this.describeSelector(selector)}`;
    try {
      await expect(locator).toContainText(expectedSubstring, { timeout });
      await this.log(true, msg, { expected: expectedSubstring, soft });
    } catch (err) {
      const actual = await locator.textContent();
      await this.log(false, msg, { expected: expectedSubstring, actual, error: err, soft });
    }
  }

  /** Assert attribute equals */
  async assertElementAttribute(
    selector: string | Locator,
    attribute: string,
    expectedValue: string,
    message?: string,
    timeout = this.defaultTimeout,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Attribute "${attribute}" equals on ${this.describeSelector(selector)}`;
    try {
      await expect(locator).toHaveAttribute(attribute, expectedValue, { timeout });
      await this.log(true, msg, { expected: expectedValue, soft });
    } catch (err) {
      const actual = await locator.getAttribute(attribute);
      await this.log(false, msg, { expected: expectedValue, actual, error: err, soft });
    }
  }

  /** Assert attribute contains */
  async assertAttributeContains(
    selector: string | Locator,
    attribute: string,
    expectedSubstring: string,
    message?: string,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Attribute "${attribute}" contains on ${this.describeSelector(selector)}`;
    try {
      const actual = (await locator.getAttribute(attribute)) || "";
      if (!actual.includes(expectedSubstring)) throw new Error(`"${attribute}" did not contain "${expectedSubstring}"`);
      await this.log(true, msg, { expected: expectedSubstring, actual, soft });
    } catch (err) {
      const actual = (await locator.getAttribute(attribute)) || null;
      await this.log(false, msg, { expected: expectedSubstring, actual, error: err, soft });
    }
  }

  /** Assert exact count */
  async assertElementCount(
    selector: string | Locator,
    expectedCount: number,
    message?: string,
    timeout = this.defaultTimeout,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Element count equals: ${this.describeSelector(selector)}`;
    try {
      await expect(locator).toHaveCount(expectedCount, { timeout });
      await this.log(true, msg, { expected: expectedCount, soft });
    } catch (err) {
      const actual = await locator.count();
      await this.log(false, msg, { expected: expectedCount, actual, error: err, soft });
    }
  }

  /** Assert count greater than */
  async assertElementCountGreaterThan(
    selector: string | Locator,
    minCount: number,
    message?: string,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Element count > ${minCount}: ${this.describeSelector(selector)}`;
    try {
      const actual = await locator.count();
      if (actual <= minCount) throw new Error(`Count ${actual} is not > ${minCount}`);
      await this.log(true, msg, { expected: `>${minCount}`, actual, soft });
    } catch (err) {
      const actual = await locator.count();
      await this.log(false, msg, { expected: `>${minCount}`, actual, error: err, soft });
    }
  }

  /** Assert count less than */
  async assertElementCountLessThan(
    selector: string | Locator,
    maxCount: number,
    message?: string,
    soft = false
  ) {
    const locator = this.toLocator(selector);
    const msg = message ?? `Element count < ${maxCount}: ${this.describeSelector(selector)}`;
    try {
      const actual = await locator.count();
      if (actual >= maxCount) throw new Error(`Count ${actual} is not < ${maxCount}`);
      await this.log(true, msg, { expected: `<${maxCount}`, actual, soft });
    } catch (err) {
      const actual = await locator.count();
      await this.log(false, msg, { expected: `<${maxCount}`, actual, error: err, soft });
    }
  }

  /** Assert arbitrary condition */
  async assertTrue(
    condition: boolean,
    message = `Condition is truthy`,
    soft = false
  ) {
    try {
      expect(condition).toBeTruthy();
      await this.log(true, message, { soft });
    } catch (err) {
      await this.log(false, message, { actual: condition, error: err, soft });
    }
  }

  async assertFalse(
    condition: boolean,
    message = `Condition is falsy`,
    soft = false
  ) {
    try {
      expect(condition).toBeFalsy();
      await this.log(true, message, { soft });
    } catch (err) {
      await this.log(false, message, { actual: condition, error: err, soft });
    }
  }
}