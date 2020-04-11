import mongoose = require("mongoose");
import {UserSchema} from "./models/User";
import { getLogger } from "log4js";
const logger = getLogger();
const User = mongoose.model('User', UserSchema);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   logger.info("coonected to db");
});

export class DB {

    constructor() {
        DB.connect();
    }

    private static connect() {
        mongoose.connect('mongodb://localhost:27017/user', {useNewUrlParser: true, useUnifiedTopology: true});
    }

    async addUser(user: any) {
        let newUser = new User(user);
        await newUser.create((err, addedUser) => {
            if (err){
                logger.error(err);
                return(err);
            }
            logger.info("added user", user);
            return addedUser;
        });
    }

    async addOrUpdateUser(user: any) {
        let newUser = new User(user);
        await newUser.findOneAndUpdate(
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


    async getUserById(id:string){
        User.findById(id, function (err, user) {
            if (err) {

            }
            if (user === "null" || user === null) {
                logger.info(" user " + id + " not found");
                return  user;
            }
            logger.info("user :");
            logger.info(user);
        });


    }

    async getUsedByAccessToken(accessToken:string) {

    }

}