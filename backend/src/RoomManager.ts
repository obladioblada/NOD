import mongoose = require("mongoose");
import { Room, IRoomDocument, Rooms } from "./models/Room";
import { getLogger, Logger } from "log4js";
import {IUserDocument, User, Users} from "./models/User";
import { from, Observable } from "rxjs";
const logger: Logger = getLogger();

export class RoomManager {

    constructor() {
        mongoose.connect('mongodb://localhost:27017/room', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).catch(function (reason) {
            console.log('Unable to connect to the mongodb instance. Error: ', reason);
        });
    }

    createRoom(user1,user2) {

        logger.info("Imma gonna create a funky room boooy")
    }



    createOrUpdateRoom(userToJoin: User, Joiner: User): Observable<User> {
        return from(

            Rooms.findOneAndUpdate(
                {_id: userToJoin.roomId},
                new Room({users:[userToJoin, Joiner]}), {
                    upsert: true,
                    new: true,
                    runValidators: true,
                    fields: { users: { $push: Joiner }}
                },
                function (err: any, document: IUserDocument) {
                    if (err) {
                        // handle error
                        logger.error(err);
                        return null;
                    } else {
                        // handle document
                        logger.info("room created or updated", document);
                        return document;
                    }
                }) as Observable<User>
        );
    }

    joinRoom(user) {

    }

    
}