import {User} from "./User";

export class DB {

   public USER: Map<number, User> = new Map<number, User>();

    constructor() {
    }



    addUser(user: User){
        console.log("adding " + user.name);
        if(!this.USER.has(user.id)){
            console.log("NON ESISTE AGGIUNGIAMOLO");
            this.USER.set(user.id, user)
            console.log(this.USER.size);
        } else {
            console.log("user already exist!");
            return null;
        }
    }
}