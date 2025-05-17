import * as fs from 'fs';
import * as os from 'os';
import path from 'path';
import { generate } from 'multiple-cucumber-html-reporter';
import { loadEnv } from "../../helper/env/env";

// Ensure output folder exists
const jsonDir = path.join(__dirname, '..', '..', '..', 'test-results');
const metaDir = path.join(jsonDir, 'meta'); // Separate directory for metadata

if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
if (!fs.existsSync(metaDir)) fs.mkdirSync(metaDir, { recursive: true });

const endTime = new Date().toLocaleString();
const executionFilePath = path.join(metaDir, 'execution.txt');

// Read the existing execution.txt file
let executionStartTime = 'Unknown Start Time';
if (fs.existsSync(executionFilePath)) {
  const fileContent = fs.readFileSync(executionFilePath, 'utf-8');
  const match = RegExp(/ExecutionStartTime: (.+)/).exec(fileContent);
  if (match) {
    executionStartTime = match[1];
  }
}

// Append the end time to the execution.txt file
fs.appendFileSync(executionFilePath, `ExecutionEndTime: ${endTime}\n`);

console.log(`Execution Start Time: ${executionStartTime}`);

loadEnv();
generate({
  theme: 'bootstrap',
  jsonDir, // Only scan the cucumber-json directory for Cucumber JSON files
  reportPath: 'test-results/reports/',
  reportName: 'Playwright Test Automation Report',
  pageTitle: 'Test Report',
  useCDN: true,
  displayDuration: true,
  displayReportTime: true,
  pageFooter: `
      <div class="report-footer created-by">
        <p>Customized Cucumber Report</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
      </div>
    `,
  metadata: {
    browser: { name: process.env.BROWSER || 'chrome' },
    platform: { name: os.platform(), version: os.release() },
    device: os.hostname(),
    cpu: os.cpus()[0].model,
    memory: `${(os.totalmem() / 1024 ** 3).toFixed(2)} GB`
  },
  customData: {
    title: 'Run Summary',
    data: [
      { label: 'Project', value: process.env.PROJECT_NAME ?? 'Test Automation' },
      ...(process.env.ENV ? [{ label: 'Environment', value: process.env.ENV ?? '' }] : []),
      ...(process.env.RELEASE ? [{ label: 'Release', value: process.env.RELEASE ?? '' }] : []),
      ...(process.env.CYCLE ? [{ label: 'Cycle', value: process.env.CYCLE ?? '' }] : []),
      { label: 'Executed By', value: os.userInfo().username || '' },
      { label: 'Execution Start', value: executionStartTime },
      { label: 'Execution End', value: endTime }
    ]
  },
  customStyle: path.join(__dirname, 'assets', 'custom-style.css'),
  openReportInBrowser: true
});