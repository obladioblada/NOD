


export interface MessageDto {
    sender: string;
    timestamp: number;
    type: Message.TYPE

    doAction():Message;

}

export class Message implements MessageDto {
    sender: string;
    timestamp: number;
    type: Message.TYPE



    constructor(sender: string) {
        this.sender = sender;
    }

    execute() {
    }

    doAction(): Message {
        return undefined;
    }

}

export namespace Message {
    export enum TYPE {
        CONNECT = "CONNECT",
        DISCONECT = "DISCONECT",
        JOIN = "JOIN",
        LEAVE_ROOM = "LEAVE_ROOM",
        PLAY = "PLAY",
        PAUSE = "PAUSE",
        PLAY_SONG = "PLAY_SONG"
    }
}


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