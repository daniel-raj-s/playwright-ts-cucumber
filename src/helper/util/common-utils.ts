import type { Page, Locator } from "@playwright/test";

const DEFAULT_TIMEOUT = 30000;

export class Utility {
    page: Page;

    constructor(page: Page) {
        this.page = page;
        this.page.setDefaultTimeout(DEFAULT_TIMEOUT);
    }

    private async getElement(arg: string | Locator): Promise<Locator> {
        return typeof arg === 'string' ? this.page.locator(arg) : arg;
    }

    /**
     * Clicks on the specified element.
     * @param arg - The selector or Locator of the element to click.
     */
    async click(arg: string | Locator): Promise<void> {
        const element = await this.getElement(arg);
        await this.waitForElement(element);
        await element.click();
    }

    /**
     * Types text into the specified element.
     * @param arg - The selector or Locator of the element.
     * @param text - The text to type.
     */
    async typeText(arg: string | Locator, text: string): Promise<void> {
        const element = await this.getElement(arg);
        await this.waitForElement(element);
        await element.fill(text);
    }

    /**
     * Hovers over the specified element.
     * @param arg - The selector or Locator of the element.
     */
    async hover(arg: string | Locator): Promise<void> {
        const element = await this.getElement(arg);
        await this.waitForElement(element);
        await element.hover();
    }

    /**
     * Waits for the dashboard table to be visible.
     */
    async waitForDashboardTable(): Promise<void> {
        await this.page.waitForSelector("//div[contains(@class,'table-container')]//table");
    }

    /**
     * Repeatedly hovers over the specified element.
     * @param arg - The selector or Locator of the element.
     * @param repeat - The number of times to repeat the hover action.
     */
    async repeatHover(arg: string | Locator, repeat: number): Promise<void> {
        const element = await this.getElement(arg);

        while (repeat > 0) {
            try {
                await this.waitForElement(element);
                await element.hover();
                repeat--;
            } catch (error: any) {
                console.warn(`ignore errors and retry: ${error.message}`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    /**
     * Waits for the specified element to be visible.
     * @param arg - The selector or Locator of the element.
     */
    async waitForElement(arg: string | Locator): Promise<void> {
        const element = await this.getElement(arg);
        await element.waitFor({
            state: 'visible',
            timeout: DEFAULT_TIMEOUT
        });
    }

    /**
     * Waits for the specified element to be visible within a timeout period, checking at intervals.
     * @param arg - The selector or Locator of the element.
     * @param timeout - The maximum time to wait in milliseconds.
     * @param interval - The interval between checks in milliseconds.
     */
    async fluentWaitForElement(arg: string | Locator, timeout: number, interval: number): Promise<void> {
        const endTime = Date.now() + timeout;
        const element = await this.getElement(arg);

        while (Date.now() < endTime) {
            try {
                if (await element.isVisible()) {
                    return;
                }
            } catch (error: any) {
                console.warn(`ignore errors and retry: ${error.message}`);
            }
            await new Promise(resolve => setTimeout(resolve, interval));
        }

        let selectorDescription: string;
        if (typeof arg === 'string') {
            selectorDescription = arg;
        } else if (typeof (arg as any).selector === 'function') {
            selectorDescription = (arg as any).selector();
        } else {
            selectorDescription = '[Locator]';
        }
        throw new Error(`Element with selector "${selectorDescription}" was not found within ${timeout}ms`);
    }

    /**
     * Gets the inner text of the specified element.
     * @param arg - The selector or Locator of the element.
     * @returns The inner text of the element.
     */
    async getText(arg: string | Locator): Promise<string> {
        const element = await this.getElement(arg);
        await this.waitForElement(element);
        return await element.innerText();
    }

    /**
     * Checks if the specified element is visible.
     * @param arg - The selector or Locator of the element.
     * @returns True if the element is visible, otherwise false.
     */
    async isElementVisible(arg: string | Locator): Promise<boolean> {
        const element = await this.getElement(arg);
        try {
            await this.waitForElement(element);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Waits for the specified selector to be visible.
     * @param selector - The selector of the element.
     */
    async waitForSelector(selector: string): Promise<void> {
        await this.page.waitForSelector(selector);
    }

    /**
     * Waits for the specified text to be visible.
     * @param text - The text to wait for.
     */
    async waitForText(text: string): Promise<void> {
        await this.page.waitForSelector(`text=${text}`);
    }

    /**
     * Waits for the URL to match the specified URL.
     * @param url - The URL to wait for.
     */
    async waitForUrl(url: string): Promise<void> {
        await this.page.waitForURL(url);
    }

    /**
     * Waits for the specified timeout.
     * @param timeout - The timeout in milliseconds.
     */
    async waitForTimeout(timeout: number): Promise<void> {
        await this.page.waitForTimeout(timeout);
    }

    /**
     * Gets the count of elements matching the specified selector.
     * @param selector - The selector of the elements.
     * @returns The count of elements.
     */
    async getElementsCount(selector: string): Promise<number> {
        return (await this.page.$$(selector)).length;
    }

    /**
     * Selects a value from a dropdown.
     * @param selector - The selector or Locator of the dropdown.
     * @param value - The value to select.
     */
    async selectDropDownValue(selector: string | Locator, value: string): Promise<void> {
        const element = await this.getElement(selector);
        await this.waitForElement(element);
        await this.click(element);
        const optionName = this.page.locator(`//ul//span[contains(text(),'${value}')] | //li//div[contains(text(),'${value}')]`);
        await this.click(optionName);
    }

    /**
     * Generates a random string of the specified length.
     * @param length - The length of the random string.
     * @returns The random string.
     */
    async randomString(length: number): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    /**
     * Clears the text of the specified element.
     * @param selector - The selector or Locator of the element.
     */
    async clearText(selector: string | Locator): Promise<void> {
        const element = await this.getElement(selector);
        await this.waitForElement(element);
        await element.fill('');
    }

    async sleep(milliseconds: number) {
        await this.page.waitForTimeout(milliseconds);
    }

    async getAttribute(arg: string | Locator, attribute: string): Promise<string> {
        const element = typeof arg === 'string' ? this.page.locator(arg) : arg;
        await this.waitForElement(element);
        const attr = await element.getAttribute(attribute);
        if (attr === null) {
            throw new Error(`Attribute "${attribute}" not found on element`);
        }
        return attr;
    }

    /**
     * Waits for the specified load state.
     * @param options - Options including timeout and load state.
     */
    async waitForNavigation(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
        await this.page.waitForLoadState(
            options?.waitUntil ?? 'networkidle',
            { timeout: options?.timeout ?? DEFAULT_TIMEOUT }
        );
    }

    /**
     * Scrolls the element into view.
     * @param arg - The selector or Locator of the element.
     */
    async scrollToElement(arg: string | Locator): Promise<void> {
        const element = await this.getElement(arg);
        await element.scrollIntoViewIfNeeded();
    }

    /**
     * Clicks and optionally waits for navigation.
     * @param arg - The selector or Locator to click.
     * @param options - Click options.
     */
    async safeClick(
        arg: string | Locator,
        options?: { timeout?: number; waitForNavigation?: boolean }
    ): Promise<void> {
        const element = await this.getElement(arg);
        await this.waitForElement(element);
        const actions: Promise<void>[] = [];
        if (options?.waitForNavigation) {
            actions.push(
                this.page.waitForLoadState(
                    'networkidle',
                    { timeout: options.timeout ?? DEFAULT_TIMEOUT }
                )
            );
        }
        actions.push(element.click());
        await Promise.all(actions);
    }

    /**
     * Retrieves multiple attributes from an element.
     * @param arg - The selector or Locator.
     * @param attributes - Array of attribute names.
     * @returns A map of attribute names to values.
     */
    async getAttributes(arg: string | Locator, attributes: string[]): Promise<Record<string, string | null>> {
        const element = await this.getElement(arg);
        await this.waitForElement(element);
        const result: Record<string, string | null> = {};
        for (const attr of attributes) {
            result[attr] = await element.getAttribute(attr);
        }
        return result;
    }

    /**
     * Replaces busy-wait loops: waits until the provided function returns true.
     * @param fn - A function returning a boolean or Promise<boolean>.
     * @param timeout - Maximum wait time in ms.
     * @param interval - Poll interval in ms.
     */
    async waitForFunction(
        fn: () => Promise<boolean> | boolean,
        timeout: number = DEFAULT_TIMEOUT,
        interval: number = 500
    ): Promise<void> {
        const endTime = Date.now() + timeout;
        while (Date.now() < endTime) {
            const result = await fn();
            if (result) return;
            await this.page.waitForTimeout(interval);
        }
        throw new Error('waitForFunction timed out after ' + timeout + 'ms');
    }

    /**
     * Checks if an element is enabled.
     * @param arg - The selector or Locator.
     * @returns True if enabled, false otherwise.
     */
    async isElementEnabled(arg: string | Locator): Promise<boolean> {
        const element = await this.getElement(arg);
        try {
            await element.waitFor({ state: 'attached', timeout: DEFAULT_TIMEOUT });
            return await element.isEnabled();
        } catch {
            return false;
        }
    }

    /**
 * Formats a date string to YYYY-MM-DD.
 */
    formatDateToYYYYMMDD(dateString: string): string {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) throw new Error(`Invalid date: ${dateString}`);
        return date.toISOString().slice(0, 10);
    }
    
    checkDateGap(startDateStr: string, endDateStr: string): { isValid: boolean; gapInDays: number; daysShort?: number } {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        // Calculate the difference in milliseconds and convert to days
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const gapInDays = Math.floor((endDate.getTime() - startDate.getTime()) / millisecondsPerDay);

        if (gapInDays >= 7) {
            return { isValid: true, gapInDays };
        } else {
            return { isValid: false, gapInDays: gapInDays + 1, daysShort: 7 - gapInDays };
        }
    }
}
