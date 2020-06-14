import * as socketIo from 'socket.io'
import {logger} from "./logging/Logger";
import {SocketEvent} from "../../shared/socket/socketEvent";
import {userDBManager} from "./UserDbManager";
import {take} from 'rxjs/operators';


class SocketManager {

    io: socketIo.Server;

    init(server) {
        logger.info("initialising socket Manager");
        this.io = socketIo.listen(server);

        this.io.on("connection", function (socket: socketIo.Socket) {
            let lastMessage;
            logger.info("a user connected");
            socket.emit("connection", "welcome", (accessToken) => {
                logger.info("accessToken");
                logger.info("accessToken");
                //userDBManager.getConnectedUser().subscribe(users =>  socket.emit("users", {users: users}));
                userDBManager.getUserByAccessTokenAndUpdate(accessToken, {connected: true, socketId: socket.id})
                    .pipe(take(1))
                    .subscribe(user => {
                        logger.info(`sending ${user.name}`);
                        socket.broadcast.emit("otherUserConnection", {user: user})
                    });
            });

            socket.on("users connected", (message) => {
                logger.info(message);
                logger.info("broadcasting");
                socket.broadcast.emit(message);
            });

            socket.on(SocketEvent.PLAY, (message) => {
                if (lastMessage !== message) {
                    lastMessage = message;
                    logger.info(message);
                    logger.info("broadcasting");
                    socket.broadcast.emit(SocketEvent.USER_TRACK_STATE_CHANGED, message);
                }
            });

            socket.on(SocketEvent.PAUSE, (message) => {
                if (lastMessage !== message) {
                logger.info(message);
                logger.info("broadcasting");
                socket.broadcast.emit(SocketEvent.USER_TRACK_STATE_CHANGED, message);
                }
            });

            socket.on(SocketEvent.JOIN_ROOM, (message) => {
                logger.info(message);
            });

            socket.on('disconnect', () => {
                userDBManager.getUserBySocketIDTokenAndUpdate(socket.id, {connected: false, socketId: null})
                    .subscribe(() => socket.broadcast.emit("otherUserConnection", "please refresh users"));
            });
        });
    }
}


export const socketManager: SocketManager = new SocketManager();
