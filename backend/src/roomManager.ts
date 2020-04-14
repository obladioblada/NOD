import mongoose = require("mongoose");
import { Room, IRoomDocument, Rooms } from "./models/Room";
import { getLogger, Logger } from "log4js";
import { User } from "./models/User";
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

    joinRoom(user) {

    }

    
}