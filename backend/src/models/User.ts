import * as mongoose from "mongoose";
import {Document, Model, Schema} from "mongoose";
import {UserDto} from "../../../shared/UserDto"


export const UserSchema: Schema = new Schema({
    _id: String,
    name: String,
    accessToken: String,
    refreshToken: String,
    expirationDate: String,
    pictureUrl: String,
    roomId: {type: Schema.Types.ObjectId, ref: "Room"},
    connected: Boolean
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
    connected: boolean
} 

// 1. Here we place a namespace exporting a marshal method that converts an Object from IUserDocument interface to UserDto interface
// this namespace will be called everytime we need to convert the IUserDocument to UserDto

export namespace IUserDocument {
    export const marshal = (user : IUserDocument): UserDto => {
        return {
            name: user.name, 
            pictureUrl: user.
            pictureUrl, 
            _id: user._id, 
            roomId: user.roomId
        }
    }
}

// 3) MODEL
export const Users: Model<IUserDocument> = mongoose.model<IUserDocument>("User", UserSchema);