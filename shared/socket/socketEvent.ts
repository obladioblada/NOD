export enum SocketEvent {
        USER_TRACK_STATE_CHANGED = "user_track_state_changed",
        // at user's joining a room
        JOIN_ROOM = "join",
        // at user's leaving a room
        LEAVE_ROOM = "leave_room",
        // at user's entering a room
        ENTER_ROOM = "enter_room",
        // at user's playing
        PLAY = "play",
        // at user's pausing
        PAUSE = "pause",
}
