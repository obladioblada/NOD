"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
exports.logger = log4js_1.getLogger();
exports.logger.level = "info";
log4js_1.configure({
    appenders: {
        rollingFileAppender: { type: "file", filename: "./logs/nod.log", maxLogSize: 10485760, numBackups: 3 },
        consoleAppender: { type: "console" }
    },
    categories: {
        default: { appenders: ["rollingFileAppender", "consoleAppender"], level: "INFO" }
    }
});
//# sourceMappingURL=Logger.js.map