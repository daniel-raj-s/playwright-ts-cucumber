import { writeFileSync } from 'fs';
import path from 'path';
import { ensureDirSync } from 'fs-extra';

const DATA_PATH = process.env.DYNAMIC_TEST_DATA_PATH
  ? path.resolve(process.cwd(), process.env.DYNAMIC_TEST_DATA_PATH)
  : path.join(__dirname, 'testData.json');

ensureDirSync(path.dirname(DATA_PATH));

function generateTestData() {
  const timestamp = Date.now();
  const testData = {
    username: `test_user_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    password: process.env.TEST_PASSWORD || 'password123',
  };
  writeFileSync(DATA_PATH, JSON.stringify(testData, null, 2), 'utf-8');
  console.info(`Test data generated at ${DATA_PATH}:`, testData);
}

generateTestData();