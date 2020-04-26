"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Room_1 = require("./models/Room");
const Logger_1 = require("./logging/Logger");
const User_1 = require("./models/User");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const spotifyService_1 = require("./spotifyService");
class RoomManager {
    constructor() {
        mongoose.connect('mongodb://localhost:27017/room', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).catch(function (reason) {
            Logger_1.logger.error('Unable to connect to the mongodb instance. Error: ', reason);
        });
    }
    createRoom(userToJoin, joiner) {
        const newRoom = new Room_1.Room([userToJoin._id, joiner._id]);
        const newRoom$ = rxjs_1.from(Room_1.Rooms.create(newRoom)).pipe(operators_1.shareReplay());
        return newRoom$;
    }
    updateRoom(roomId, joiner) {
        let room$ = rxjs_1.from(Room_1.Rooms.findById(roomId, (err, room) => {
            if (!room.users.includes(joiner._id)) {
                room.users.push(joiner._id);
            }
            room.save();
            return room;
        })).pipe(operators_1.shareReplay());
        return room$;
    }
    joinRoom(userToJoin, joiner) {
        let room$;
        if (!userToJoin.roomId) {
            room$ = this.createRoom(userToJoin, joiner);
        }
        else {
            room$ = this.updateRoom(userToJoin.roomId, joiner);
        }
        room$.subscribe(room => {
            User_1.Users.updateMany({ _id: { $in: [userToJoin._id, joiner._id] } }, { $set: { roomId: room._id } }, (val) => {
                Logger_1.logger.info(val);
            });
            return spotifyService_1.spotifyService.syncUsers(userToJoin, joiner);
        });
        return room$;
    }
}
exports.roomManager = new RoomManager();
//# sourceMappingURL=RoomManager.js.map