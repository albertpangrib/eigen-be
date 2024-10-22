import winston, { format, transports, LoggerOptions, Logger } from "winston";
import path from "path";
import Stringify from "json-stringify-safe";

const { combine, timestamp, label, printf } = format;

// Define the custom logging format
const myFormat = printf(({ level, message, label, timestamp }) => {
  if (typeof message === "object") {
    message = `data: ${Stringify(message)}`;
  }
  return `${timestamp}, [${label}, ${level}], ${message}`;
});

// Define options for file and console transports
const options: {
  file: winston.transports.FileTransportOptions;
  console: winston.transports.ConsoleTransportOptions;
} = {
  file: {
    level: "info",
    filename: path.join(
      __dirname,
      "../../eigen-be-betest-log/eigen-be-betest.log"
    ),
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  console: {
    level: "debug",
    handleExceptions: true,
  },
};

// Create a Winston logger instance
const logger: Logger = winston.createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  format: combine(
    label({ label: path.basename(process.pid.toString()) }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    myFormat
  ),
  exitOnError: false, // Do not exit on handled exceptions
});

// Add a stream object for use with morgan or other libraries
(logger as any).stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
