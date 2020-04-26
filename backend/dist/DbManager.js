"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Logger_1 = require("./logging/Logger");
const rxjs_1 = require("rxjs");
const User_1 = require("./models/User");
let dbManager = mongoose.connection;
dbManager.on("error", console.error.bind(console, "connection error:"));
dbManager.once("open", function () {
    Logger_1.logger.info("coonected to dbManager");
});
class DB {
    constructor() {
        DB.connect();
    }
    static connect() {
        mongoose.connect("mongodb://localhost:27017/user", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).catch(function (reason) {
            Logger_1.logger.error("Unable to connect to the mongodb instance. Error: ", reason);
        });
    }
    addOrUpdateUser(user) {
        return rxjs_1.from(User_1.Users.findOneAndUpdate({ _id: user._id }, user, { upsert: true, new: true, runValidators: true }, function (err, document) {
            if (err) {
                // handle error
                Logger_1.logger.error(err);
                return null;
            }
            else {
                // handle document
                Logger_1.logger.info("user added or updated", document);
                return document;
            }
        }));
    }
    getUserById(id) {
        return rxjs_1.from(User_1.Users.findById(id, function (err, document) {
            if (err) {
                return err;
            }
            if (document === null) {
                Logger_1.logger.info(" user " + id + " not found");
                return document;
            }
        }));
    }
    getUsers() {
        return rxjs_1.from(User_1.Users.find(function (err, document) {
            if (err) {
                return err;
            }
            if (document === null) {
                Logger_1.logger.info("users:");
                return document;
            }
        }));
    }
    getUserByAccessToken(accessToken) {
        return rxjs_1.from(User_1.Users.findOne({ accessToken: accessToken }, function (err, document) {
            if (err) {
                return err;
            }
            if (document === null) {
                Logger_1.logger.info(" user  with access token " + accessToken + " not found");
                return document;
            }
            Logger_1.logger.info("userByAccessToken :");
            Logger_1.logger.info(document);
        }));
    }
}
exports.userDBManager = new DB();
//# sourceMappingURL=DbManager.js.map