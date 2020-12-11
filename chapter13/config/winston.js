const appRoot = require('app-root-path');
const winston = require('winston');
const process = require('process');

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const options = {
    /* log file */
    file: {
        level: 'info',
        filename: `${appRoot}/logs/nodejs-starter.log`,
        handleExceptions: true,
        json: false,
        maxsize: 5 * 1024 * 1024,    /* 5MB */
        maxFiles: 60,   /* 2달치까지만 남긴다. */
        colorize: false,
        format: combine(
            label({label: 'production'}),
            timestamp(),
            myFormat
        )
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: combine(
            label(({label: 'development'})),
            timestamp(),
            myFormat
        )
    }
}

let logger = new winston.createLogger({
    transports: [
        new winston.transports.File(options.file)
    ],
    exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console(options.console));
}

module.exports = logger;
