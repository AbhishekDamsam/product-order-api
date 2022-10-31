import { createLogger, transports, format, config } from "winston";
const { combine, timestamp, label, printf } = format;

//Logger function to log
export const Logger = createLogger({
    levels: config.syslog.levels,
    transports: [
        new transports.Console(),
        new transports.File({
            filename: './logs/logs.log'
        })
    ],
    format: combine(
        label({ label: `Label` }),
        timestamp(),
        printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
    )
});


