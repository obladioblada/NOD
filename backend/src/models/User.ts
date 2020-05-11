import { Schema, Model , Document} from "mongoose";
import * as WebSocket from 'ws';
import * as mongoose from "mongoose";



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
}
// 3) MODEL
export const Users: Model<IUserDocument> = mongoose.model<IUserDocument>("User", UserSchema);

