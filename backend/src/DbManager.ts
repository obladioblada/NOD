import mongoose = require("mongoose");
import {logger} from "./logging/Logger";


class DB {

    private dbConnection: mongoose.Connection;

    init() {
        mongoose.createConnection(process.env.MONGODB_URI || "mongodb://localhost:27017/nod", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then((connection => {
            logger.info("successfully connected to " + connection.host);

            this.dbConnection = connection
        }))
            .catch(function (reason) {
                logger.error("Unable to connect to the mongodb instance. Error: ", reason);
            });
    }
}

export const db: DB = new DB();
