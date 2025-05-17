/**
 * Enhanced declarations for multiple-cucumber-html-reporter
 */
declare module 'multiple-cucumber-html-reporter' {
  export interface GenerateOptions {
    theme?: string;
    jsonDir: string;
    reportPath: string;
    reportName?: string;
    pageTitle?: string;
    pageFooter?: string;
    displayDuration?: boolean;
    metadata?: {
      browser?: { name?: string; version?: string };
      device?: string;
      memory?: string;
      cpu?: string;
      platform?: { name?: string; version?: string };
    };
    customData?: {
      title?: string;
      data?: Array<{ label: string; value: string }>;
    };
    customStyle?: string;
    openReportInBrowser?: boolean;
    saveCollectedJSON?: boolean;
    disableLog?: boolean;
    // allow additional options
    [key: string]: any;
  }

  export function generate(options: GenerateOptions): void;
}