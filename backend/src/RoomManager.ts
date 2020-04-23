import mongoose = require("mongoose");
import {Room, Rooms} from "./models/Room";
import {getLogger, Logger} from "log4js";
import {User, Users} from "./models/User";
import {from, merge, Observable} from "rxjs";
import {shareReplay, switchMap, take, subscribeOn} from "rxjs/operators";
import {spotifyService} from "./SpotifyService";

const logger: Logger = getLogger();

export class RoomManager {

    constructor() {
        mongoose.connect('mongodb://localhost:27017/room', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).catch(function (reason) {
            logger.error('Unable to connect to the mongodb instance. Error: ', reason);
        });
    }

    createRoom(userToJoin: User, joiner: User) {
        const newRoom = new Room([userToJoin._id, joiner._id]);
        const newRoom$ = from(Rooms.create(newRoom)).pipe(shareReplay()) as Observable<Room>;
        return newRoom$;
    }

    updateRoom(roomId: String, joiner) {
        let room$ = from(Rooms.findById(roomId,(err, room)=> {
            if (!room.users.includes(joiner._id)) {
                room.users.push(joiner._id);
            }
            room.save();
            return room;
        })).pipe(shareReplay());
        
        return room$  as Observable<Room>;
    }

    joinRoom(userToJoin: User, joiner: User): Observable<Room> {
        let room$: Observable<Room>;
        if (!userToJoin.roomId) {
            room$  = this.createRoom(userToJoin, joiner);
        } else {
            room$ = this.updateRoom(userToJoin.roomId, joiner);
        }
        room$.subscribe(room => {
            Users.updateMany(
                {_id: {$in: [userToJoin._id, joiner._id]}},
                {$set: {roomId: room._id}},
                (val) => {
                    logger.info(val);
                }
            );
           return spotifyService.syncUsers(userToJoin,joiner);
        });
        return room$;
    }
}