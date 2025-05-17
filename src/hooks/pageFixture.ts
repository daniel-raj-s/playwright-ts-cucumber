import { Page } from "@playwright/test";
import { Logger } from "winston";

export type Fixture = {
  page: Page;   // the `!` says “Trust me, this will be initialized.”
  logger: Logger;
};

export const fixture: Fixture = {} as Fixture;