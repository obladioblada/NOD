import mongoose = require("mongoose");
import {Room, Rooms} from "./models/Room";
import {getLogger, Logger} from "log4js";
import {User, Users} from "./models/User";
import {from, merge, Observable} from "rxjs";
import {shareReplay, switchMap, take} from "rxjs/operators";
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
        newRoom$.subscribe(room => {
            Users.updateMany(
                {_id: {$in: [userToJoin._id, joiner._id]}},
                {$set: {roomId: room._id}},
                (val) => {
                    logger.info(val);
                }
            );
        });
        return newRoom$;
    }

    updateRoom(roomId: String, joiner) {
        let room$ = Rooms.findById({_id: roomId});
        room$.users.push(joiner._id);
        return room$.save() as Observable<Room>;
    }

    joinRoom(userToJoin: User, joiner: User): Observable<Room> {
        let create$;
        let update$;
        if (!userToJoin.roomId) {
            create$  = this.createRoom(userToJoin, joiner)
        } else {
            update$ = this.updateRoom(userToJoin.roomId, joiner);
        }

        return merge([create$, update$]).pipe(take(1), switchMap(room => {
            spotifyService.CurrentlyPlaying(userToJoin.accessToken)
                .then((song: any) => {
                   const uriSong = song.uri;
                   const progressMs = song.progress_ms;
                   return spotifyService.playSame(joiner.accessToken, uriSong, progressMs)
                        .then((response) => {
                            logger.info(response);
                            logger.info(joiner.name +  " joined!");
                            return {response, song};
                        })
                        .catch((error) => {
                            logger.info(joiner.name +  " failed to join!!");
                            logger.error(error);
                            return error;
                        });
                });
            return from(room) as Observable<Room>;
        }));
    }
}