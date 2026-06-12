import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()),
  transports: [new transports.Console(), new transports.File({ filename: 'logs/app.log' })],
});

export default logger;
