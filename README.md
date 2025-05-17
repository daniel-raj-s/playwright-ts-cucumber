A modular, end-to-end UI and API automation framework with PostGres integration built by Daniel Raj S. It provides a scalable test architecture with Page Objects, reusable helpers, custom Cucumber hooks, automated reporting, and environment-specific configuration.

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

## Overview

This framework offers:

- **Page Objects** and **Step Definitions** for modular UI automation  
- **API Utility** for authenticated REST calls  
- **Custom Helpers** (assertions, common actions, date utils, random data)  
- **Custom Cucumber Hooks** for artifact management and environment setup  
- Automated **screenshots**, **videos**, and **Multiple Cucumber HTML Reports**  
- **GitHub Actions** CI template for automated test runs  

## Features

- Cross-browser testing with Playwright (Chromium, Firefox, WebKit)  
- Data-driven testing via JSON/YAML fixtures  
- Environment-specific `.env.{env}` configuration  
- Parallel test execution with configurable threads  
- Extensible utilities for logging, database operations, and more  

## Technology Stack

- **Language:** TypeScript  
- **Test Runner:** Cucumber.js  
- **Browser Automation:** Playwright  
- **Reporting:** multiple-cucumber-html-reporter  
- **Utilities:** fs-extra, winston, dotenv, jsonpath-plus, crypto-js, pg  
- **CI/CD:** GitHub Actions  

## Prerequisites

- Node.js v16+  
- npm v8+  
- (Optional) Docker if running tests in containerized environments  

## Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-org/tv.octillion.UIAutomation.git
   cd tv.octillion.UIAutomation

	2.	Install dependencies

npm ci
npx playwright install --with-deps



Configuration

Environment variables are managed via .env.{env} files in src/helper/env/.
Use the ENV variable to select your config:

export ENV=dev      # loads .env.dev
export ENV=staging  # loads .env.staging
export ENV=prod     # loads .env.prod

You can also set other vars (e.g. BROWSER, HEADLESS, SLOWMO, DEVTOOLS, PARALLEL, TAGS) before running tests.

Running Tests

UI Tests

# Run UI tests tagged @ui in parallel
ENV=dev PARALLEL=2 TAGS="@ui" npm run dev

API Tests

# Run API tests tagged @api
ENV=dev PARALLEL=1 TAGS="@api" npm run dev

Test artifacts (screenshots, videos, traces, HTML reports) land under the test-results/ folder.

Environment Variables

Name	Description	Default
ENV	Target environment (dev, staging, prod, etc.)	dev
BROWSER	Browser to use (chromium, firefox, webkit)	chromium
HEADLESS	Run browser headless (true/false)	true
SLOWMO	Slow down Playwright actions (ms)	0
DEVTOOLS	Launch browser with devtools (true/false)	false
PARALLEL	Number of parallel test threads	1
TAGS	Cucumber tag expression (e.g. @ui or @api)	—

Directory Structure

.
├── config/
│   └── cucumber.js           # Cucumber configuration
├── src/
│   ├── helper/
│   │   ├── api-utils.ts       # REST helper with token management
│   │   ├── browsers/
│   │   │   └── browserManager.ts
│   │   ├── env/
│   │   │   ├── env.ts
│   │   │   └── .env.*         # Environment files
│   │   ├── report/
│   │   │   ├── init.ts
│   │   │   └── report.ts
│   │   └── util/              # Common utilities
│   ├── hooks/
│   │   ├── hooks.ts
│   │   └── pageFixture.ts
│   └── pages/                 # Page Objects
├── src/test/
│   ├── TestData/              # Test fixtures (JSON/YAML)
│   ├── features/              # Gherkin feature files
│   └── steps/                 # Step definitions
├── test-results/              # Test artifacts
├── .github/
│   └── workflows/ci.yml       # CI pipeline
├── package.json
├── tsconfig.json
└── README.md

Contributing
	1.	Fork the repo and create a feature branch
	2.	Implement your changes with clear, descriptive commits
	3.	Add or update tests and fixtures as needed
	4.	Submit a Pull Request against main and ensure all CI checks pass

License

This project is licensed under the MIT License.

Author

Daniel 🚀