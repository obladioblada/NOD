import * as socketIo from 'socket.io'
import {logger} from "./logging/Logger";
import {SocketEvent} from "../../shared/socket/socketEvent";


class SocketManager {
    io: socketIo.Server;

    init(server) {
        logger.info("initialising socket Manager");
        this.io =  socketIo.listen(server, { origins: '*:*'});
        this.io.on("connection", function (socket: socketIo.Socket) {
            console.log("a user connected");
            console.log(socket.id);
            socket.broadcast.emit(socket.id + 'connected');

            socket.on(SocketEvent.PLAY, (message) => {
                console.log(message);
                console.log("broadcasting");
                socket.broadcast.emit(message);
            });
            socket.on('JOIN', (message) => {
                console.log(message);
            });

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
}

export const socketManager: SocketManager = new SocketManager();
