import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;


export const RoomSchema = new Schema({
    _id: String,
    user: [{type: Schema.Type.ObjectId, ref: 'User'}]
});