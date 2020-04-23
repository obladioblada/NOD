import { userDBManager } from './DbManager'
import * as WebSocket from "ws";
import { server } from "./app"
import {logger} from "./logging/Logger";
class SocketManager {
     ws : WebSocket.Server;

    constructor(server) {
        this.ws  = new WebSocket.Server({ server });
        this.listen()
    }

    listen() {
        // When a connection is established
        this.ws.on('connection', function(socket: WebSocket) {
            logger.info('Opened connection ');
            logger.info('broadcasting!');
            // this.ws.clients.forEach((client)=> {
            //     logger.info(WebSocket.OPEN);
            //     logger.info(client.readyState);
            //     if (client.readyState === WebSocket.OPEN) {
            //         client.send(JSON.stringify({ type: 'newUserLogged'}));
            //     }
            // });

            //connection is up, let's add a simple simple event
            socket.on('message', (message: string) => {
                //log the received message and send it back to the client
                logger.info('received: %s', message);
            });

            //send immediatly a feedback to the incoming connection
            socket.send(JSON.stringify({message: 'Hi there, I am a WebSocket server'}));

            // The connection was closed
            socket.on('close', function() {
                logger.info('Closed Connection ');
            });

        });

    }

    public connectUser(uuid: string) {
        // save uuuid into user

    }


}

export const socketManager : SocketManager = new SocketManager(server);
