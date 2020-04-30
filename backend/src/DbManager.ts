import mongoose = require("mongoose");
import { logger } from "./logging/Logger";


class DB {

    private dbConnection: mongoose.Connection;

    constructor() {
        mongoose.createConnection(process.env.MONGODB_URI  || "mongodb://localhost:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then((connection => this.dbConnection = connection))
        .catch(function (reason) {
            logger.error("Unable to connect to the mongodb instance. Error: ", reason);
        });
    }


    getDbConnection(): mongoose.Connection {
        return this.dbConnection;
    }

}

export const dbConnection : mongoose.Connection = new DB().getDbConnection();
