const path = require('path');

const dotenv = require('dotenv');
// Load environment-specific vars before reading PARALLEL, TAGS, etc.
dotenv.config({
  path: path.resolve(__dirname, '../src/helper/env/.env.' + (process.env.ENV || 'dev'))
});

// Environment variables
const TAGS = process.env.TAGS?.trim() || '';
const PARALLEL = parseInt(process.env.PARALLEL || '1', 10);

// Common paths
const FEATURE_PATH = path.join('src', 'test', 'features');
const STEP_PATHS = [
  path.join('src', 'test', 'steps', '*.ts'),
  path.join('src', 'test', 'steps', '**', '*.ts'),
];
const HOOK_PATH = path.join('src', 'hooks', 'hooks.ts');
const REPORT_DIR = 'test-results';
const JSON_REPORT = path.join(REPORT_DIR, 'cucumber-report.json');
const HTML_REPORT = path.join(REPORT_DIR, 'cucumber-report.html');
const JUNIT_REPORT = path.join(REPORT_DIR, 'cucumber-report.xml');

console.log(`Cucumber - running with tags: "${TAGS || 'none'}", parallel: ${PARALLEL}`);

const baseConfig = {
  paths: [FEATURE_PATH],
  require: [...STEP_PATHS, HOOK_PATH],
  requireModule: ['ts-node/register'],
  formatOptions: { snippetInterface: 'async-await' },
  format: [
    'progress-bar',
    `html:${HTML_REPORT}`,
    `json:${JSON_REPORT}`,
    `junit:${JUNIT_REPORT}`,
    'rerun:@rerun.txt',
  ],
  dryRun: false,
};

module.exports = {
  default: {
    ...baseConfig,
    parallel: PARALLEL,
    ...(TAGS && { tags: TAGS }),
  },
  rerun: {
    ...baseConfig,
    parallel: PARALLEL,
  },
};