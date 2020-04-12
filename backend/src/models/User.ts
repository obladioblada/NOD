import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;


export const UserSchema = new Schema({
    _id: String,
    name: String,
    accessToken: String,
    refreshToken: String,
    expirationDate: String,
    roomId: {type: Schema.Types.ObjectId, ref: 'Room'}
});