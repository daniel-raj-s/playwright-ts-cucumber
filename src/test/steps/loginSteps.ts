import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { fixture } from "../../hooks/pageFixture";
import { LoginPage } from "../../pages/loginPage";
import testData from "../../test/TestData/testData.json";
import { expect } from "@playwright/test";

let loginPage: LoginPage;
setDefaultTimeout(45000); // Set default timeout for steps

Given("I navigate to the login page", async () => {
  loginPage = new LoginPage(fixture.page);
  await loginPage.goto();
});

When("I login with valid credentials", async () => {
  const { username, password } = testData;
  await loginPage.login(username, password);
});

Then("I should see the logged in successfully", async () => {
  await expect(fixture.page).toHaveURL(/logged-in-successfully/);
  await loginPage.sleep(40000); // Wait for video generation to complete | remove in actual tests
});