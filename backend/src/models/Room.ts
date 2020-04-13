import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;


export const RoomSchema = new Schema({
    _id: String,
    user: [{type: Schema.Types.ObjectId, ref: 'User'}]
});