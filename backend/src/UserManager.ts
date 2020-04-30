import mongoose = require("mongoose");
import { logger } from "./logging/Logger";
import { from, Observable } from "rxjs";
import { IUserDocument, Users } from "./models/User";

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
        logger.info(process.env.MONGODB_URI);
        mongoose.connect(process.env.MONGODB_URI  || "mongodb://localhost:27017/user", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).catch(function (reason) {
            logger.error("Unable to connect to the mongodb instance. Error: ", reason);
        });
    }


    addOrUpdateUser(user: IUserDocument): Observable<IUserDocument> {
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
            })
        );
    }


    getUserById(id: string): Observable<IUserDocument> {
        return from(
            Users.findById(id, function (err: any, document: IUserDocument) {
                if (err) {
                    return err;
                }
                if (document === null) {
                    logger.info(" user " + id + " not found");
                    return document;
                }
            })
        );
    }

    getUsers(): Observable<IUserDocument[]> {
        return from( 
            Users.find(function (err: any,  document: IUserDocument[]) {
                if (err) {
                    return err;
                }
                if (document === null) {
                    logger.info("users:");
                    return document;
                }
            }) 
        );
    }

     getUserByAccessToken(accessToken: String): Observable<IUserDocument> {
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
            })
        );
    }

}

export const userDBManager : DB = new DB();