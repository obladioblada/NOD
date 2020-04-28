import mongoose = require("mongoose");
import { logger } from "./logging/Logger";
import { from, Observable } from "rxjs";
import { User, IUserDocument, Users } from "./models/User";

let dbManager = mongoose.connection;
dbManager.on("error", console.error.bind(console, "connection error:"));
dbManager.once("open", function () {
    logger.info("coonected to dbManager");
});

class DB {

    constructor() {
        DB.connect();
    }

    private static connect(): any {
        mongoose.connect("mongodb://heroku_jlvwfpk0:p5c2nqamrkc05e9uoku11rb4dm@ds117164.mlab.com:17164/heroku_jlvwfpk0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).catch(function (reason) {
            logger.error("Unable to connect to the mongodb instance. Error: ", reason);
        });
    }


    addOrUpdateUser(user: User): Observable<User> {
        return from(
            Users.findOneAndUpdate(
            {_id: user._id},
            user, {upsert: true, new: true, runValidators: true},
            function (err: any, document: IUserDocument) {
                if (err) {
                    // handle error
                    logger.error(err);
                    return null;
                } else {
                    // handle document
                    logger.info("user added or updated", document);
                    return document;
                }
            }) as Observable<User>
        );
    }


    getUserById(id: string): Observable<User> {
        return from(
            Users.findById(id, function (err: any, document: IUserDocument) {
                if (err) {
                    return err;
                }
                if (document === null) {
                    logger.info(" user " + id + " not found");
                    return document;
                }
            }) as Observable<User>
        );
    }

    getUsers(): Observable<any> {
        return from( Users.find(function (err: any,  document: IUserDocument[]) {
            if (err) {
                return err;
            }
            if (document === null) {
                logger.info("users:");
                return document;
            }
        }) as Observable<IUserDocument[]>
        );
    }

     getUserByAccessToken(accessToken: String): Observable<User> {
        return from(
            Users.findOne({accessToken: accessToken}, function (err: any, document: IUserDocument) {
                if (err) {
                    return err;
                }
                if (document === null) {
                    logger.info(" user  with access token " + accessToken + " not found");
                    return document;
                }
                logger.info("userByAccessToken :");
                logger.info(document);
            }) as Observable<User>
        );
    }

}

export const userDBManager : DB = new DB();