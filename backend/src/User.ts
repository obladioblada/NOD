export class User {
    id: number;
    name: string;
    songId: number;
    accessToken: string;
    refreshToken: string;
    expirationDate: number;
    
    constructor(accessToken: string, id: number, name: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.id = id;
        this.name = name;
        this.refreshToken = refreshToken;
    }



}