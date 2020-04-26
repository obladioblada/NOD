"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(sender) {
        this.sender = sender;
    }
    execute() {
    }
    doAction() {
        return undefined;
    }
}
exports.Message = Message;
(function (Message) {
    let TYPE;
    (function (TYPE) {
        TYPE["CONNECT"] = "CONNECT";
        TYPE["DISCONECT"] = "DISCONECT";
        TYPE["JOIN"] = "JOIN";
        TYPE["LEAVE_ROOM"] = "LEAVE_ROOM";
        TYPE["PLAY"] = "PLAY";
        TYPE["PAUSE"] = "PAUSE";
        TYPE["PLAY_SONG"] = "PLAY_SONG";
    })(TYPE = Message.TYPE || (Message.TYPE = {}));
})(Message = exports.Message || (exports.Message = {}));
/*
export class Song {
    time: string;
    uri: string;

    xx
}

 
export class joinMessage extends Message {
    public userToJoin: string;
    public song: Song;
    public id: string;
    public type: MESSAGE_TYPE;
    
    constructor(id, type) {
        super(id, type);
    }
}


export class disJoinParamas implements Message {
    id
    type: MESSAGE_TYPE;
    roomId:Song;
    
    constructor(userToJoin, song) {
        
    }
}



export interface MessageDto {
    id: string;
    type: string;
}


export interface SongDto {
    time: string;
    uri: string;
}

export interface joinParamasDto {
    userToJoin: number;
    song: SongDto;
}

export namespace joinParamsDto {
    export const unmarshal = (params: joinParamasDto): joinMessage => {
        return new joinMessage(params.userToJoin, params.song);
    }
}
*/
/*export namespace MessageDto {
    export const unmarshal = (message: MessageDto): any=> {
        switch (message.type) {
            case MESSAGE_TYPE.JOIN:
                return new joinMessage(
                    message.id,
                    unmarshalParams(message.type, message)
                );
            break;
            default:
                break;
        }

    }
    const unmarshalParams = (type: string, params) => {
        switch (type) {
            case MESSAGE_TYPE.JOIN:
                return joinParamsDto.unmarshal(params);
            default:
                break;
        }
    }
}*/ 
//# sourceMappingURL=Message.js.map