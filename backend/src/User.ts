export class User {
    id: number;
    name: string;
    songId: number;
    accessToken: string;

    constructor(accessToken: string, id: number, name: string) {
        this.accessToken = accessToken;
        this.id = id;
        this.name = name;
    }



}