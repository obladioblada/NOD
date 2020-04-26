export class Song {
    private uri: string;
    private name: string;
    private progresMs: number;


    constructor(uri: string, name: string, progresMs: number) {
        this.uri = uri;
        this.name = name;
        this.progresMs = progresMs;
    }
}