import mongoose = require("mongoose");
import { logger } from "./logging/Logger";
import { from, Observable } from "rxjs";
import { IUserDocument, Users } from "./databse/User";

class UserDbManager {

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
        ) as Observable<IUserDocument>;
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
        ) as Observable<IUserDocument>;
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
        ) as Observable<IUserDocument[]>;
    }

     getUserByAccessToken(accessToken: string): Observable<IUserDocument> {
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
        ) as Observable<IUserDocument>;
    }

}

export const userDBManager : UserDbManager = new UserDbManager();