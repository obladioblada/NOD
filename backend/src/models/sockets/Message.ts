import { SourceMapping } from "module";

export enum MESSAGE_TYPE {
    CONNECT = "CONNECT",
    DISCONECT = "DISCONECT",
    JOIN = "JOIN",
    ENTER_ROOM = "ENTER_ROOM",
    LEAVE_ROOM = "LEAVE_ROOM",
    PLAY = "PLAY",
    PAUSE = "PAUSE",
    PLAY_SONG = "PLAY_SONG"
}

export interface Message {
    id: string;
    type: MESSAGE_TYPE;
}

export class Song {
    time: string;
    uri: string;
}

 
export class joinMessage implements Message {
    public userToJoin: string;
    public song: Song;
    public id: string;
    public type: MESSAGE_TYPE;
    
    constructor(userToJoin, song) {
        
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


export namespace MessageDto {
    export const unmarshal = (message: MessageDto): Message => {
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
                return joinParamsDto.unmarshal(params)
            break;
            default:
                break;
        }
    }
}