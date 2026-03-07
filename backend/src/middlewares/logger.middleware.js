import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import winston from 'winston';

// Ensure logs directory exists
const logDir = path.join('logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info', // error | warn | info | http | verbose | debug | silly
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // You can use `.simple()` or `.printf()` for dev
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Show logs in console (only in dev)
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Morgan stream to redirect logs to Winston
const morganStream = {
  write: (message) => logger.http(message.trim()), // Use .info for less verbose
};

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream: morganStream }
);

export { logger, morganMiddleware };
