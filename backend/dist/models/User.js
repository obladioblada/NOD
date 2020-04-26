"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class User {
    constructor(data) {
        this._id = data._id;
        this.name = data.name;
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.expirationDate = data.expirationDate;
        this.pictureUrl = data.pictureUrl;
    }
}
exports.User = User;
exports.UserSchema = new mongoose_1.Schema({
    _id: String,
    name: String,
    accessToken: String,
    refreshToken: String,
    expirationDate: String,
    pictureUrl: String,
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Room" }
});
// 3) MODEL
exports.Users = mongoose_1.model("User", exports.UserSchema);
//# sourceMappingURL=User.js.map