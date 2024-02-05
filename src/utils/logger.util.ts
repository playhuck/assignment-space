import { createLogger, log, transports } from 'winston';
import wistonDaily from "winston-daily-rotate-file";
import { format } from 'logform';
const { combine, printf } = format;
import { getEnvMode } from '@config/config.private';
import { Injectable } from "@nestjs/common";

const chalk = require('chalk');

const logLevelFormat = {
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARNING',
    error: 'ERROR'
}

@Injectable()
export class LoggerUtil {
    private envMode = getEnvMode('NODE_ENV');
    private isProduction = this.envMode === 'prod';

    private logger;

    constructor(
    ) {
        const level = this.isProduction ? 'info' : 'debug';
        
        // create logger
        this.logger = createLogger({
            level,
            format: combine(
                this._logPrintf
            ),
            transports: [
                new wistonDaily({
                    dirname: './log',
                    filename: `%DATE%.log`,
                    maxFiles: '7d',
                    zippedArchive: true,
                }),
            ]
        })

        if (!this.isProduction) {
            this.logger.add(new transports.Console());
        }
    }

    public debug(method, path, message, errorCode?) {
        const timestamp = this._getTimestamp();
        this.logger.log({
            method,
            level: 'debug',
            path,
            message,
            errorCode
        })
    }

    public info( method, path, message) {
        const timestamp = this._getTimestamp();
        this.logger.log({
            method,
            level: 'info',
            path,
            message
        });

    }

    public warn(method, path, message, errorCode?) {
        const timestamp = this._getTimestamp();
        this.logger.log({
            method,
            level: 'warn',
            path,
            message,
            errorCode,
        })

    }

    public error( method, path, message, errorCode?) {
        const timestamp = this._getTimestamp();
        this.logger.log({
            method,
            level: 'error',
            path,
            message,
            errorCode
        })

    }

    private _logPrintf = printf(({ method, level, path, message, errorCode }) => {
        const formattedLogLevel = this._getFormattedLogLevel(level);
        
        if (errorCode == null) {
            return `${method} ${process.env.NODE_ENV} ${formattedLogLevel} ${path} ${message}`;
        }
        return `${method} ${process.env.NODE_ENV} ${formattedLogLevel} ${path} ${errorCode} ${message}`;
    })

    private _getFormattedLogLevel(originLevel: string) {
        switch (originLevel) {
            case "debug": return chalk.black(logLevelFormat.debug);
            case "info": return chalk.green(logLevelFormat.info);
            case "warn": return chalk.yellow(logLevelFormat.warn);
            case "error": return chalk.red(logLevelFormat.error);
            default:
                return originLevel;
        }
    }

    private _getTimestamp() {
        return new Date().toISOString();
    }
}
