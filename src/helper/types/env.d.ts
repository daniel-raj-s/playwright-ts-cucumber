export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_BASE_URI: string;
            BASE_URL: string;
            BROWSER: "chromium" | "firefox" | "webkit";
            CYCLE?: string;
            DEVTOOLS?: "true" | "false";
            DYNAMIC_TEST_DATA_PATH?: string;
            ENV: "dev" | "prod" | "local";
            HEADLESS: "true" | "false";
            PARALLEL?: string;
            PROD_DB_HOST?: string;
            PROD_DB_NAME?: string;
            PROD_DB_PASSWORD?: string;
            PROD_DB_PORT?: string;
            PROD_DB_USER?: string;
            PROJECT_NAME?: string;
            RELEASE?: string;
            RESULTS_DIR?: string;
            SECRET: string;
            SLOWMO?: string;
            TAGS?: string;
            TEST_PASSWORD: string;
            TEST_USERNAME: string;
            TokenURL: string;
            ExecutionStart: string;
        }
    }
}