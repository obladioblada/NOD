import mongoose = require("mongoose");
import {UserSchema} from "./models/User";
import {getLogger} from "log4js";
import { from, Observable } from "rxjs";

const logger = getLogger();
const User: any = mongoose.model('User', UserSchema);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    logger.info("coonected to db");
});

export class DB {

    constructor() {
        DB.connect();
    }

    private static connect() {
        mongoose.connect('mongodb://localhost:27017/user', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).catch(function (reason) {
            console.log('Unable to connect to the mongodb instance. Error: ', reason);
        });
    }


    async addOrUpdateUser(user: any) {
        //let newUser = new User(user);
        return await User.findOneAndUpdate(
            {_id: user.id},
            user, {upsert: true, new: true, runValidators: true},
            function (err, doc) {
                if (err) {
                    // handle error
                    logger.error(err);
                    return null;
                } else {
                    // handle document
                    logger.info("user added or updated", doc);
                    return doc;
                }
            });
    }


    getUserById(id: string) :Observable<any> {
        return from(
            User.findById(id, function (err, user) {
                if (err) {
                    return err;
                }
                if (user === "null" || user === null) {
                    logger.info(" user " + id + " not found");
                    return user;
                }
            })
        );
    }

    async   getUsers() {
        return User.find(function (err, users) {
            if (err) {
                return err;
            }
            if (users === "null" || users === null) {
                logger.info("users:");
                return users;
            }
        });
    }


    async getUsersAsMap() {
        return  User.find({}, function(err, users) {
            let userMap = {};
            users.forEach(function(user) {
              userMap[user._id] = user;
            });
            return userMap;
          });
    }

     getUserByAccessToken(accessToken: string): Observable<any> {
        return from(
            User.find({accessToken: accessToken}, function (err, user) {
                if (err) {
                    return err;
                }
                if (user === "null" || user === null) {
                    logger.info(" user  with access token " + accessToken + " not found");
                    return user;
                }
                logger.info("userByAccessToken :");
                logger.info(user);
            })
        );
    }

}