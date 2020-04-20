import { configure, getLogger, Logger } from "log4js";
export const logger : Logger = getLogger();
logger.level = "info";

configure({
    appenders: {
        rollingFileAppender: {type: "file", filename: "./logs/nod.log", maxLogSize: 10485760, numBackups: 3},
        consoleAppender: {type: "console"}
    },
    categories: {
        default: { appenders: [ "rollingFileAppender", "consoleAppender"], level: "INFO"}
    }
});