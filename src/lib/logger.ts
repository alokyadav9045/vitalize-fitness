import winston from 'winston'

let logger: winston.Logger | {
  error: (message: string) => void
  warn: (message: string) => void
  info: (message: string) => void
  debug: (message: string) => void
  log: (message: string) => void
}

// Only create logger on server side
if (typeof window === 'undefined') {
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'vitalize-fitness' },
    transports: [
      // Write all logs with importance level of `error` or less to `error.log`
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      // Write all logs with importance level of `info` or less to `combined.log`
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  })

  // If we're not in production then log to the console with a simple format
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }))
  }
} else {
  // Client-side logger (no-op)
  logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
    log: () => {}
  }
}

export default logger