import { BeforeAll, AfterAll, Before, After, AfterStep, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext } from "@playwright/test";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { loadEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";
import * as fs from "fs-extra";
import path from 'path';

const DOWNLOAD_DIR = path.resolve(__dirname, '../test/TestData/downloads');
const SCREENSHOT_DIR = path.resolve('test-results', 'screenshots');
const TRACE_DIR = path.resolve('test-results', 'trace');

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
    loadEnv();
});

Before({ tags: "@ui" }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id;
    await fs.emptyDir(DOWNLOAD_DIR);
    await fs.ensureDir(DOWNLOAD_DIR);
    await fs.ensureDir(SCREENSHOT_DIR);
    await fs.ensureDir(TRACE_DIR);
    const isHeadless = process.env.HEADLESS === "true";
    browser = await invokeBrowser();
    context = await browser.newContext({
        recordVideo: {
            dir: "test-results/videos",
            size: { width: 1920, height: 1080 }
        },
        acceptDownloads: true,
        ...(isHeadless
            ? { viewport: { width: 1920, height: 1080 } }
            : { viewport: null, noDefaultViewport: true }
        ),
    });

    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true,
        snapshots: true
    });

    const page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
});

Before({ tags: "@api" }, async function () { /* no UI setup */ });

AfterStep({ tags: "@ui" }, async function ({ pickle, result }) {
    const screenshotPath = path.join(SCREENSHOT_DIR, `${pickle.name}-${Date.now()}.png`);
    const shouldCapture = result?.status === Status.FAILED || result?.status === Status.PASSED;
    if (shouldCapture) {
        const img = await fixture.page.screenshot({ path: screenshotPath, type: "png", timeout: 60000 });
        this.attach(img, "image/png");
    }
});

After({ tags: "@ui" }, async function ({ pickle, result }) {
    try {
        const shouldCapture = result?.status === Status.PASSED || result?.status === Status.FAILED;
        const tracePath = path.join(TRACE_DIR, `${pickle.id}.zip`);
        let img: Buffer;
        let videoPath: string;

        if (shouldCapture) {
            img = await fixture.page.screenshot({
                path: path.join(SCREENSHOT_DIR, `${pickle.name}.png`),
                type: "png"
            });
            // wait to ensure video is fully written for short tests
            await fixture.page.waitForTimeout(2000);
            videoPath = await fixture.page.video()!.path();
        }

        await context.tracing.stop({ path: tracePath });

        if (shouldCapture) {
            this.attach(img!, "image/png");
            this.attach(fs.readFileSync(videoPath!), 'video/webm');
            const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${tracePath}</a>`;
            this.attach(`Trace file: ${traceFileLink}`, 'text/html');
        }

        await fixture.page.close();
        await context.close();
        await browser.close();
        
    } catch (err: any) {
        console.error(`After hook error in scenario ${pickle.name}:`, err);
        this.attach(`Hook error: ${err.message}`, 'text/plain');
    }
});

After({ tags: "@api" }, async function () { /* no UI teardown */ });

AfterAll(async function () {
    if (browser) {
        await browser.close();
    }
});