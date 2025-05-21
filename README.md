
# UI and API Automation Framework
*A modular, scalable end-to-end framework by Daniel Raj S.*

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running Tests](#running-tests)
	- [UI Tests](#ui-tests)
	- [API Tests](#api-tests)
8. [Environment Variables](#environment-variables)
9. [Directory Structure](#directory-structure)
10. [Contributing](#contributing)
11. [License](#license)
12. [Author](#author)

---

## Overview

This framework provides a **modular**, **end-to-end** automation solution for both UI and API testing. It integrates seamlessly with **Postgres**, supports **Cucumber BDD**, and includes a robust reporting and configuration system.

### Key Features
- **Postgres DB integration** for backend validation
- **Gherkin-based BDD syntax** using Cucumber
- **Reusable JSON/YAML fixtures** for test data
- **Automated reporting** with screenshots, videos, and HTML output
- **Parallel execution** for faster feedback cycles
- **Environment-specific configurations** using `.env.{env}` files
- **Docker support** for containerized execution

### Key Components
- **Cucumber.js** – for Gherkin-style specs
- **Playwright** – for cross-browser UI automation
- **Postgres** – for DB assertions
- **Winston** – for structured logging
- **dotenv** – for environment variable management
- **fs-extra** – for file operations
- **jsonpath-plus** – for data extraction from responses
- **crypto-js** – for encryption/decryption

---

## Features

- Cross-browser testing (Chromium, Firefox, WebKit)
- Data-driven test execution with JSON/YAML
- Seamless environment switching with `.env.{env}` files
- Parallel test execution with configurable threads
- Utility-first design (DB ops, loggers, assertions, and more)
- CI-ready with GitHub Actions template

---

## Technology Stack

- **Language:** TypeScript
- **BDD Runner:** Cucumber.js
- **Browser Automation:** Playwright
- **Reporting:** multiple-cucumber-html-reporter
- **Utilities:** fs-extra, winston, dotenv, jsonpath-plus, crypto-js, pg
- **CI/CD:** GitHub Actions

---

## Prerequisites

- **Node.js** ≥ v16
- **npm** ≥ v8

---

## Installation

```bash
git clone https://github.com/daniel-raj-s/playwright-ts-cucumber.git
cd playwright-ts-cucumber

# Install project dependencies
npm ci

# Install browser dependencies for Playwright
npx playwright install --with-deps
```

---

## Configuration

All environment-specific configurations are stored in the `src/helper/env/` folder using `.env.{env}` files.

Example:

```bash
export ENV=dev      # Loads .env.dev
export ENV=staging  # Loads .env.staging
export ENV=prod     # Loads .env.prod
```

You can also define other environment variables such as `BROWSER`, `HEADLESS`, `SLOWMO`, `DEVTOOLS`, `PARALLEL`, and `TAGS`.

---

## Running Tests

### UI Tests

Run UI tests tagged with `@ui` in parallel mode:

```bash
ENV=dev PARALLEL=2 TAGS="@ui" npm run dev
```

### API Tests

Run API tests tagged with `@api`:

```bash
ENV=dev PARALLEL=1 TAGS="@api" npm run dev
```

All artifacts like screenshots, videos, traces, and HTML reports are stored in the `test-results/` directory.

---

## Environment Variables

| Name      | Description                              | Default     |
|-----------|------------------------------------------|-------------|
| `ENV`     | Target environment (dev, staging, prod)  | `dev`       |
| `BROWSER` | Browser to use (chromium, firefox, etc.) | `chromium`  |
| `HEADLESS`| Run browser in headless mode             | `true`      |
| `SLOWMO`  | Delay Playwright actions (in ms)         | `0`         |
| `DEVTOOLS`| Launch browser with DevTools             | `false`     |
| `PARALLEL`| Number of parallel threads               | `1`         |
| `TAGS`    | Cucumber tag expression (e.g. `@ui`)     | —           |

---

## Directory Structure

```
.
├── config/
│   └── cucumber.js              # Cucumber configuration
├── src/
│   ├── helper/
│   │   ├── api-utils.ts         # REST utilities
│   │   ├── browsers/
│   │   │   └── browserManager.ts
│   │   ├── env/
│   │   │   ├── env.ts
│   │   │   └── .env.*           # Environment files
│   │   ├── report/
│   │   │   ├── init.ts
│   │   │   └── report.ts
│   │   └── util/                # Common utilities
│   ├── hooks/
│   │   ├── hooks.ts
│   │   └── pageFixture.ts
│   └── pages/                   # Page Objects
├── src/test/
│   ├── TestData/                # Test data in JSON/YAML
│   ├── features/                # Gherkin feature files
│   └── steps/                   # Step definitions
├── test-results/                # Test artifacts (reports, screenshots)
├── .github/
│   └── workflows/ci.yml         # GitHub Actions pipeline
├── package.json
├── tsconfig.json
└── README.md
```

---

## Contributing

1. Fork the repository and create a feature branch
2. Write clean, descriptive commits
3. Update or add relevant tests and data files
4. Submit a pull request to `main` and ensure all CI checks pass

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Author

**Daniel 🚀**