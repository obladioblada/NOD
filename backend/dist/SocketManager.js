"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = __importStar(require("ws"));
const app_1 = require("./app");
const Logger_1 = require("./logging/Logger");
class SocketManager {
    constructor(server) {
        this.ws = new WebSocket.Server({ server });
        this.listen();
    }
    listen() {
        // When a connection is established
        this.ws.on('connection', function (socket) {
            Logger_1.logger.info('Opened connection ');
            Logger_1.logger.info('broadcasting!');
            //connection is up, let's add a simple simple event
            socket.on('message', (m) => {
                //log the received message and send it back to the client
                Logger_1.logger.info('received: %s', m);
                //messageDispatcher.execute(m);
            });
            //send immediatly a feedback to the incoming connection
            socket.send(JSON.stringify({ message: 'Hi there, I am a WebSocket server' }));
            // The connection was closed
            socket.on('close', function () {
                Logger_1.logger.info('Closed Connection ');
            });
        });
    }
    connectUser(uuid) {
        // save uuuid into user
    }
    join() { }
    ;
}
exports.socketManager = new SocketManager(app_1.server);
//# sourceMappingURL=SocketManager.js.map