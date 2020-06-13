import * as socketIo from 'socket.io'
import {logger} from "./logging/Logger";
import {SocketEvent} from "../../shared/socket/socketEvent";
import {userDBManager} from "./UserDbManager";
import {take} from 'rxjs/operators';

class SocketManager {
    io: socketIo.Server;

    init(server) {
        logger.info("initialising socket Manager");
        this.io =  socketIo.listen(server);

        this.io.on("connection", function (socket: socketIo.Socket) {
            logger.info("a user connected");
            socket.emit("connection", "welcome", (clientId) => {
                logger.info("responseData");
                logger.info(clientId);
                //userDBManager.getConnectedUser().subscribe(users =>  socket.emit("users", {users: users}));
                userDBManager.getUserByAccessTokenAndUpdate(clientId, {connected: true})
                    .pipe(take(1))
                    .subscribe(user => socket.broadcast.emit("otherUserConnection", {user: user}) );
               });

            socket.on("users connected", (message) => {
                logger.info(message);
                logger.info("broadcasting");
                socket.broadcast.emit(message);
            });

            socket.on(SocketEvent.PLAY, (message) => {
                logger.info(message);
                logger.info("broadcasting");
                socket.broadcast.emit("user_track_state_changed", message);
            });


            socket.on(SocketEvent.JOIN_ROOM, (message) => {
                logger.info(message);
            });


            socket.on('disconnect', (user) => {
                logger.info(`user disconnected ${ user }` );
                socket.broadcast.emit(user);
            });
        });
    }
}

export const socketManager: SocketManager = new SocketManager();
