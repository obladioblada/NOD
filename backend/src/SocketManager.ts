import * as WebSocket from "ws";
import {logger} from "./logging/Logger";


class SocketManager {
    ws: WebSocket.Server;

    init(server) {
        this.ws = new WebSocket.Server({server});
        this.listen();
    }

    listen() {
        // When a connection is established
        this.ws.on('connection', function (socket: WebSocket) {
            logger.info('Opened connection ');
            logger.info('broadcasting!');


            //connection is up, let's add a simple simple event
            socket.on('message', (m: any) => {
                //log the received message and send it back to the client
                logger.info('received: %s', m);
                //messageDispatcher.execute(m);
            });

            //send immediatly a feedback to the incoming connection
            socket.send(JSON.stringify({message: 'Hi there, I am a WebSocket server'}));

            // The connection was closed
            socket.on('close', function () {
                logger.info('Closed Connection ');
            });

        });

    }

    public connectUser(uuid: string) {
        // save uuuid into user

    }

    join() {
    };

}

export const socketManager: SocketManager = new SocketManager();
