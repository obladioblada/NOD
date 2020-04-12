import mongoose = require("mongoose");
import {UserSchema} from "./models/User";
import {getLogger} from "log4js";

const logger = getLogger();
const User = mongoose.model('User', UserSchema);
const Room = mongoose.model('Room', UserSchema);

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
        });
        mongoose.connect('mongodb://localhost:27017/room', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
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


    async getUserById(id: string) {
        return User.findById(id, function (err, user) {
            if (err) {
                return err;
            }
            if (user === "null" || user === null) {
                logger.info(" user " + id + " not found");
                return user;
            }
            logger.info("user :");
            logger.info(user);
        });


    }

    async getUserByAccessToken(accessToken: string) {
        return User.find({accessToken: accessToken}, function (err, user) {
            if (err) {
                return err;
            }
            if (user === "null" || user === null) {
                logger.info(" user  with access token " + accessToken + " not found");
                return user;
            }
            logger.info("userByAccessToken :");
            logger.info(user);
        });
    }

}