import expressLogger from 'express-winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const dailyLogTransport = new DailyRotateFile({
  filename: 'modium-lite-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

export const middlewareLogger = expressLogger.logger({
  format: winston.format.combine(
    winston.format.label(),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.json(),
    winston.format.printf((info) => `${info.level}, ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    dailyLogTransport
  ],
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format:'MM-YY-DD HH:mm:ss:ms' }),
    winston.format.label(),
    winston.format.splat(),
    winston.format.colorize(),
    winston.format.json(),
    winston.format.printf((info) =>  `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    dailyLogTransport
  ]
})
