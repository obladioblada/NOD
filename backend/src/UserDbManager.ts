import {logger} from "./logging/Logger";
import {from, Observable} from "rxjs";
import {IUserDocument, Users} from "./models/User";

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

    getConnectedUser() : Observable<IUserDocument[]>{
        return from(
         Users.find({connected: true}, function (err: any, documents: IUserDocument[]){
            logger.info("array of Users Connected");
            logger.info(documents);
            return documents
        })) as Observable<IUserDocument[]>
    }

    getUserByAccessTokenAndUpdate(accessToken: string, update): Observable<IUserDocument> | any {
        return from(
             Users.findOneAndUpdate({accessToken: accessToken}, update,{new: true},function (err: any, document: IUserDocument) {
                if (err) {
                    return err;
                }
                if (document === null) {
                    logger.info(" user with access token " + accessToken + " not found");
                    return document;
                }
                logger.info(`BY TOKEN: User ${document.name} update successfully! ${document.socketId}`);
                return document;
            })) as Observable<IUserDocument>;
    }

    getUserBySocketIDTokenAndUpdate(socketId: string, update): Observable<IUserDocument> | any {
        return from(
             Users.findOneAndUpdate({socketId: socketId}, update, {new: true},function (err: any, document: IUserDocument) {
                if (err) {
                    return err;
                }
                if (document === null) {
                    logger.info(" user with socket id" + socketId + " not found");
                    return document;
                }
                logger.info(` BY SOCKET: User ${document.name} update successfully! ${document}`);
                return document;
            })) as Observable<IUserDocument>;
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