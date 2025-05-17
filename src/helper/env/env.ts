import * as dotenv from 'dotenv'
import * as fs from 'fs';

import * as path from 'path';


export enum Environment {
  Development = 'dev',
  Staging = 'staging',
  Production = 'prod',
}

/**
 * Loads environment variables from a base .env file and an environment-specific .env file.
 * @param env - The target environment (defaults to process.env.ENV or 'development').
 * @returns The combined dotenv config results.
 */
export const loadEnv = (
  env: string = process.env.ENV || Environment.Development
): dotenv.DotenvConfigOutput => {
  const envPath = path.resolve(__dirname, `.env.${env}`);

  // Override with environment-specific .env if it exists
  let envResult: dotenv.DotenvConfigOutput = { parsed: undefined };
  if (fs.existsSync(envPath)) {
    envResult = dotenv.config({ override: true, path: envPath });
    if (envResult.error) {
      console.warn(`Warning: Error loading environment .env at ${envPath}`, envResult.error);
    }
  } else {
    console.info(`Skipping .env.${env}; file not found at ${envPath}`);
  }

  return envResult;
};
