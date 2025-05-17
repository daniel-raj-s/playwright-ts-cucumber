import { LaunchOptions, chromium, firefox, webkit, Browser } from "@playwright/test";

const getLaunchOptions = (headless: boolean, slowMo?: number, devtools?: boolean): LaunchOptions => {
  const args = ["--no-proxy-server"];
  if (!headless) {
    args.unshift("--start-maximized");
  }
  return {
    headless: headless,
    slowMo: slowMo,
    devtools: devtools,
    args,
  };
};

export const invokeBrowser = async (): Promise<Browser> => {
  const browserName = (process.env.BROWSER || "chromium").toLowerCase();
  const isHeadless = process.env.HEADLESS === "true";
  const slowMo = process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : undefined;
  const devTools = process.env.DEVTOOLS === "true";
  console.info(
    `Launching browser: ${browserName} ` +
    `(headless=${isHeadless}, slowMo=${slowMo ?? 0}, devtools=${devTools})`
  );
  const options = getLaunchOptions(isHeadless, slowMo, devTools);
  switch (browserName) {
    case "chromium":
      return chromium.launch(options);
    case "chrome":
      return chromium.launch(options);
    case "firefox":
      return firefox.launch(options);
    case "webkit":
      return webkit.launch(options);
    default:
      console.warn(`Unknown BROWSER "${browserName}", defaulting to chromium`);
      return chromium.launch(options);
  }
};
