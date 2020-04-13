import mongoose = require("mongoose");
import { RoomSchema } from "./models/Room";
import { configure, getLogger } from "log4js";
const logger = getLogger();
const Room = mongoose.model('Room', RoomSchema);

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