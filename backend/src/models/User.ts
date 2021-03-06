import * as mongoose from "mongoose";
import {Document, Model, Schema} from "mongoose";
import {UserDto} from "../../../shared/UserDto"


export const UserSchema: Schema = new Schema({
    _id: String,
    name: String,
    accessToken: String,
    refreshToken: String,
    expiresIn: String,
    pictureUrl: String,
    roomId: {type: Schema.Types.ObjectId, ref: "Room"},
    connected: Boolean,
    socketId: String
});

// 2) Document
export interface IUserDocument extends Document {
    _id: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
    pictureUrl: string;
    roomId: string;
    connected: boolean,
    socketId: string;
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
            roomId: user.roomId,
            connected: user.connected,
            socketId: user.socketId
        }
    }
}

// 3) MODEL
export const Users: Model<IUserDocument> = mongoose.model<IUserDocument>("User", UserSchema);