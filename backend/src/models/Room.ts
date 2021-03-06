import { Schema , Document, Model} from "mongoose";
import * as mongoose from "mongoose";

export class Room {
    _id: string;
    users: string[];
    queue: string[];

    constructor(users: string[]) {
        this.users = users;
    }
}

export const RoomSchema: Schema = new Schema({
    users: [{type: String, ref: "User"}],
    queue: [{type: String}]
});

// 2) Document
export interface IRoomDocument extends Document {
    _id: string;
    users: string[];
    queue: string[];
}
// 3) MODEL
export const Rooms: Model<IRoomDocument> = mongoose.model<IRoomDocument>("Room", RoomSchema);