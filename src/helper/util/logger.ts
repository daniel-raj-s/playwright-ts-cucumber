import { transports, format } from "winston";

export function options(scenarioName: string) {
    return {
        transports: [
            new transports.File({
                filename: `test-results/logs/${scenarioName}/${scenarioName}.log`,
                level: 'debug',
                format: format.combine(
                    format.colorize(),
                    format.timestamp({ format: 'MMM-DD-YYYY hh:mm:ss A' }), // 12-hour format with AM/PM
                    format.align(),
                    format.printf(info => `${info.level}: ${info.timestamp}: ${info.message}`)
                )
            }),
            new transports.Console({
                level: 'info',
                format: format.combine(
                    format.colorize(),
                    format.timestamp({ format: 'MMM-DD-YYYY hh:mm:ss A' }), // 12-hour format with AM/PM
                    format.align(),
                    format.printf(info => `${info.level}: ${info.timestamp}: ${info.message}`)
                )
            })
        ]
    }
};