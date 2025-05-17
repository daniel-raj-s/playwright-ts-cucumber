import { emptyDir, ensureDir } from "fs-extra";
import * as fs from 'fs';

/**
 * Initializes (creates and cleans) the report directory.
 * Uses RESULTS_DIR env var or defaults to 'test-results'.
 */
export async function initReportDir(): Promise<void> {
  const resultsDir = process.env.RESULTS_DIR ?? "test-results";
  try {
    // Ensure the main directory exists
    await ensureDir(resultsDir);
    // Empty it
    await emptyDir(resultsDir);
    // Ensure the 'meta' subdirectory exists
    await ensureDir(`${resultsDir}/meta`);
    // Write the execution.txt file
    const startTime = new Date().toLocaleString();
    fs.writeFileSync(
      `${resultsDir}/meta/execution.txt`,
      `ExecutionStartTime: ${startTime}\n`
    );
  } catch (err: any) {
    console.error(`Failed to initialize report directory '${resultsDir}':`, err);
    process.exit(1);
  }
}

// If run directly, execute initialization
if (require.main === module) {
  initReportDir();
}