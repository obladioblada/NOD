import { Document} from "mongoose";

export interface IRoomDocument extends Document {
    _id: string;
    users: string[];
    queue: string[];
}