import { request, APIRequestContext, APIResponse } from "@playwright/test";
import { JSONPath } from "jsonpath-plus";
import { DataTable } from "@cucumber/cucumber";

export class APIUtility {
  private contextPromise!: Promise<APIRequestContext>;
  private defaultHeaders: { [key: string]: string } = {};
  private token: string | null = null;
  private tokenExpiry: number | null = null; // store as timestamp (ms)
  public response?: APIResponse;
  protected baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Ensures a valid token and request context are available.
   * Only fetches a new token/context if missing or expired.
   */
  private async ensureContext() {
    const now = Date.now();
    if (!this.token || !this.tokenExpiry || now > this.tokenExpiry) {
      const { token, expiresIn } = await this.getAccessToken();
      this.token = token;
      this.tokenExpiry = now + (expiresIn ? expiresIn * 1000 : 3600 * 1000);
      this.defaultHeaders = {
        'content-type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${this.token}`,
      };
      this.contextPromise = request.newContext({
        baseURL: this.baseURL,
        extraHTTPHeaders: this.defaultHeaders,
      });
    }
    this.contextPromise ??= request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: this.defaultHeaders,
    });
  }

  /**
   * Returns a valid Playwright APIRequestContext, ensuring token/context are fresh.
   */
  public async getContext() {
    await this.ensureContext();
    return this.contextPromise;
  }

  /**
   * Fetches a new access token from the auth endpoint.
   * Returns the token and its expiry (in seconds).
   */
  async getAccessToken(): Promise<{ token: string, expiresIn: number }> {
    const URI = process.env.TokenURL;
    if (!URI) {
      throw new Error("TokenURL is not defined in the environment variables.");
    }
    const contextPromise = request.newContext({
      extraHTTPHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const context = await contextPromise;
    const response = await context.post(URI, {
      form: {
        client_id: 'web-api',
        client_secret: process.env.SECRET ?? (() => { throw new Error("SECRET is not defined in the environment variables."); })(),
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD,
        grant_type: 'password'
      }
    });
    const responseBody = await response.json();
    const accessToken = responseBody.access_token;
    const expiresIn = responseBody.expires_in ?? 3600;
    return { token: accessToken, expiresIn };
  }

  async get(endpoint: string, params: Record<string, string | number> = {}): Promise<APIResponse> {
    const context = await this.getContext();
    const response = await context.get("/rest" + endpoint, {
      params,
      headers: { ...this.defaultHeaders },
    });
    return response;
  }

async getWithRetry(endpoint: string, params: Record<string, string | number> = {}, retries = 3): Promise<APIResponse> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await this.get(endpoint, params);
      return response;
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        console.error(`Failed after ${retries} attempts:`, error);
        throw error;
      }
    }
  }
  throw new Error(`Failed to get response from ${endpoint} after ${retries} attempts.`);
}

  async post(endpoint: string, data: any): Promise<APIResponse> {
    const context = await this.getContext();
    const response = await context.post("/rest" + endpoint, {
      headers: {
        ...this.defaultHeaders,
        'Content-Type': 'application/json'
      },
      data
    });
    return response;
  }

  async put(endpoint: string, data: any): Promise<APIResponse> {
    const context = await this.getContext();
    const response = await context.put("/rest" + endpoint, {
      headers: {
        ...this.defaultHeaders,
        'Content-Type': 'application/json'
      },
      data
    });
    return response;
  }

  async delete(endpoint: string, params: Record<string, string | number> = {}): Promise<APIResponse> {
    const context = await this.getContext();
    const response = await context.delete("/rest" + endpoint, {
      params,
      headers: { ...this.defaultHeaders },
    });
    return response;
  }

  async assertResponseStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    if (response.status() !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, but got ${response.status()}`);
    }
  }

  async assertResponseBodyContains(response: APIResponse, expectedContent: string): Promise<void> {
    const responseBody = await response.json();
    const responseBodyString = JSON.stringify(responseBody);
    if (!responseBodyString.includes(expectedContent)) {
      throw new Error(`Response body does not contain expected content: ${expectedContent}`);
    }
  }

  getDataFromJsonUsingPath(jsonData: any, path: string): any[] {
    try {
      return JSONPath({ path, json: jsonData });
    } catch (error) {
      console.error("Error parsing JSONPath:", error);
      return [];
    }
  }

  isSorted(array: any[], order: "asc" | "desc" = "asc"): boolean {
    for (let i = 1; i < array.length; i++) {
      if (order === "asc" && array[i] < array[i - 1]) {
        return false;
      }
      if (order === "desc" && array[i] > array[i - 1]) {
        return false;
      }
    }
    return true;
  }

  static parseDataTable(table: DataTable): Record<string, string> {
    const rows = table.raw();
    return rows[0].reduce((acc: Record<string, string>, key: string, idx: number) => {
      const val = rows[1][idx]?.trim();
      if (val) acc[key] = val;
      return acc;
    }, {});
  }

  static generateRandomEmail(): string {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${randomString}@example.com`;
  }
}