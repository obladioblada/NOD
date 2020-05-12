import { Document} from "mongoose";
export interface IUserDocument extends Document {
    _id: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    expirationDate: string;
    pictureUrl: string;
    roomId: string;
}