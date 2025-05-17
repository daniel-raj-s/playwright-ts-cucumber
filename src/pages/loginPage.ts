import { Page } from "@playwright/test";
import { Utility } from "../helper/util/common-utils";

export class LoginPage extends Utility{
  readonly page: Page;
  readonly usernameInput = "#username";
  readonly passwordInput = "#password";
  readonly loginButton = "#submit";

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  /**
   * Navigate to the login page URL from env or default
   */
  async goto() {
    const url = process.env.BASE_URL || null;
    await this.page.goto(url!);
  }

  /**
   * Fill credentials and submit
   */
  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}