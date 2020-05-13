import { Schema, Model } from "mongoose";
import * as mongoose from "mongoose";
import { IUserDocument as IuserD } from "../../../shared/UserDto";

export interface IUserDocument extends IuserD {
    _id: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    expirationDate: string;
    pictureUrl: string;
    roomId: string;
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

// 3) MODEL
export const Users: Model<IUserDocument> = mongoose.model<IUserDocument>("User", UserSchema);

