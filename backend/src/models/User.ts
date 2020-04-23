import { Document, Schema, model } from "mongoose";
import * as WebSocket from 'ws';

export class User {

    _id: String;
    name: String;
    accessToken: String;
    refreshToken: String;
    expirationDate: String;
    pictureUrl: String;
    roomId: String;
    socket: WebSocket;
    uuuiD: String;

    constructor(data: {
        _id: String,
        name: String,
        accessToken: String,
        refreshToken: String,
        expirationDate: String,
        pictureUrl: String,
    }) {
        this._id = data._id;
        this.name = data.name;
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.expirationDate = data.expirationDate;
        this.pictureUrl = data.pictureUrl;
    }

}


export const UserSchema: Schema = new Schema({
    _id: String,
    name: String,
    accessToken: String,
    refreshToken: String,
    expirationDate: String,
    pictureUrl: String,
    roomId: {type: Schema.Types.ObjectId, ref: "Room"}
});

// 2) Document
export interface IUserDocument extends User, Document {}
// 3) MODEL
export const Users: model<IUserDocument> = model<IUserDocument>("User", UserSchema);

