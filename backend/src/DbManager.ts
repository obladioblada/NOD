import mongoose = require("mongoose");
import {logger} from "./logging/Logger";


class DB {

    private dbConnection: mongoose.Connection;

    init() {
        mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nod", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then((connection => {
            logger.info("successfully connected to");
        }))
            .catch(function (reason) {
                logger.error("Unable to connect to the mongodb instance. Error: ", reason);
            });
    }
}

export const db: DB = new DB();
