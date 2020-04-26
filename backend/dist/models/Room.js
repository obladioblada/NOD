"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class Room {
    constructor(users) {
        this.users = users;
    }
}
exports.Room = Room;
exports.RoomSchema = new mongoose_1.Schema({
    users: [{ type: String, ref: "User" }],
    queue: [{ type: String }]
});
// 3) MODEL
exports.Rooms = mongoose_1.model("Room", exports.RoomSchema);
//# sourceMappingURL=Room.js.map