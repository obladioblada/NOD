import { Document, Schema, model } from "mongoose";
import { User } from "./User";

export class Room {
    _id: String;
    users: User[];

    constructor(data: {
        users: User[]
    }) {
        this.users = data.users;
    }
}

export const RoomSchema: Schema = new Schema({
    _id: String,
    users: [{type: [Schema.Types.ObjectId], ref: "Room"}]
});

// 2) Document
export interface IRoomDocument extends Room, Document {}
// 3) MODEL
export const Rooms: model<IRoomDocument> = model<IRoomDocument>("Room", RoomSchema);