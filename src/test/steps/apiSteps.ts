import { Given, When, Then } from "@cucumber/cucumber";
import { request as playwrightRequest, APIRequestContext, expect, APIResponse } from "@playwright/test";

let apiContext: APIRequestContext;

let response: APIResponse;

Given("an API client", async () => {
    // base URL comes from your .env.local BASE_URL
    apiContext = await playwrightRequest.newContext({
        baseURL: process.env.API_BASE_URI || undefined,
    });
});

Then("the response status should be {int}", async (status: number) => {
    expect(response.status()).toBe(status);
});

Then('the response JSON should have property {string}', async (prop: string) => {
    const json = await response.json();
    expect(json).toHaveProperty(prop);
});
When('I send GET request to {string}', async (path: string) => {
    response = await apiContext.get(path);
});