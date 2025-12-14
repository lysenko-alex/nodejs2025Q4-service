import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  LOG = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

@Injectable()
export class LoggingService implements OnModuleDestroy {
  private readonly logLevel: LogLevel;
  private readonly fileSizeKB: number;
  private readonly logDir: string;

  private logFileStream: fs.WriteStream | null = null;
  private currentLogFile: string | null = null;
  private currentFileSize: number = 0;

  private errorLogFileStream: fs.WriteStream | null = null;
  private currentErrorLogFile: string | null = null;
  private currentErrorFileSize: number = 0;

  constructor() {
    const logLevelEnv = process.env.LOG_LEVEL || '2';
    this.logLevel = parseInt(logLevelEnv, 10) as LogLevel;
    this.fileSizeKB = parseInt(process.env.LOG_FILE_SIZE_KB || '100', 10);
    this.logDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  onModuleDestroy() {
    this.closeLogFile();
    this.closeErrorLogFile();
  }

  private getLogFileName(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return path.join(this.logDir, `app-${timestamp}.log`);
  }

  private getErrorLogFileName(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return path.join(this.logDir, `error-${timestamp}.log`);
  }

  private rotateLogFile(): void {
    this.closeLogFile();
    this.currentLogFile = this.getLogFileName();
    this.currentFileSize = 0;
    this.logFileStream = fs.createWriteStream(this.currentLogFile, {
      flags: 'a',
    });
  }

  private rotateErrorLogFile(): void {
    this.closeErrorLogFile();
    this.currentErrorLogFile = this.getErrorLogFileName();
    this.currentErrorFileSize = 0;
    this.errorLogFileStream = fs.createWriteStream(this.currentErrorLogFile, {
      flags: 'a',
    });
  }

  private closeLogFile(): void {
    if (this.logFileStream) {
      this.logFileStream.end();
      this.logFileStream = null;
    }
  }

  private closeErrorLogFile(): void {
    if (this.errorLogFileStream) {
      this.errorLogFileStream.end();
      this.errorLogFileStream = null;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private writeLog(level: LogLevel, message: string, context?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? `[${context}]` : '';
    const logMessage = `${timestamp} [${levelName}] ${contextStr} ${message}\n`;

    // Write to stdout
    process.stdout.write(logMessage);

    // Write to file if file logging is enabled
    if (this.fileSizeKB > 0) {
      if (
        !this.logFileStream ||
        this.currentFileSize >= this.fileSizeKB * 1024
      ) {
        this.rotateLogFile();
      }

      if (this.logFileStream) {
        this.logFileStream.write(logMessage);
        this.currentFileSize += Buffer.byteLength(logMessage, 'utf8');
      }

      if (level === LogLevel.ERROR) {
        if (
          !this.errorLogFileStream ||
          this.currentErrorFileSize >= this.fileSizeKB * 1024
        ) {
          this.rotateErrorLogFile();
        }

        if (this.errorLogFileStream) {
          this.errorLogFileStream.write(logMessage);
          this.currentErrorFileSize += Buffer.byteLength(logMessage, 'utf8');
        }
      }
    }
  }

  error(message: string, context?: string): void {
    this.writeLog(LogLevel.ERROR, message, context);
  }

  warn(message: string, context?: string): void {
    this.writeLog(LogLevel.WARN, message, context);
  }

  log(message: string, context?: string): void {
    this.writeLog(LogLevel.LOG, message, context);
  }

  debug(message: string, context?: string): void {
    this.writeLog(LogLevel.DEBUG, message, context);
  }

  verbose(message: string, context?: string): void {
    this.writeLog(LogLevel.VERBOSE, message, context);
  }
}
