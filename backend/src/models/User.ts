import { Schema, Model , Document} from "mongoose";
import * as WebSocket from 'ws';
import { dbConnection } from "../DbManager";



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
export interface IUserDocument extends Document {
    _id: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    expirationDate: string;
    pictureUrl: string;
    roomId: string;
    socket: WebSocket;
    uuuiD: string;
}
// 3) MODEL
export const Users: Model<IUserDocument> = dbConnection.model<IUserDocument>("User", UserSchema);

