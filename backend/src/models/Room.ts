import { Document, Schema, model } from "mongoose";
import { User } from "./User";

export class Room {
    _id: String;
    users: String[];
    queue: String[];

    constructor(users: String[]) {
        this.users = users;
    }
}

export const RoomSchema: Schema = new Schema({
    users: [{type: String, ref: "User"}],
    queue: [{type: String}]
});

// 2) Document
export interface IRoomDocument extends Room, Document {}
// 3) MODEL
export const Rooms: model<IRoomDocument> = model<IRoomDocument>("Room", RoomSchema);