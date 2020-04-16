import mongoose = require("mongoose");
import { Room, IRoomDocument, Rooms } from "./models/Room";
import { getLogger, Logger } from "log4js";
import {IUserDocument, User, Users} from "./models/User";
import { from, Observable, merge } from "rxjs";
import { shareReplay } from "rxjs/operators";
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
    
    joinRoom(userToJoin: User, joiner: User): Observable<Room> {

  //      obs1$;
  //      obs2$;

        if(!userToJoin.roomId) {
 //           obs1$ = this.createRoom()

            const newRoom = new Room([userToJoin._id, joiner._id]);
            const newRoom$ = from(Rooms.create(newRoom)).pipe(shareReplay()) as Observable<Room>;
            newRoom$.subscribe(room => {
                Users.updateMany(
                    { _id: { $in: [userToJoin._id, joiner._id] } }, 
                    { $set: { roomId: room._id } },
                    (val) => {
                        console.log(val);
                    }
                  );
            })
            return newRoom$;
       } else {
           let room$ = Rooms.findById({_id: userToJoin.roomId});
           room$.users.push(joiner._id);
           return room$.save() as Observable<Room>;
  //         obs$ = update()
       }

//       merge(ob$,obs2$s).pipe(take(1)).subscribe
    }
}