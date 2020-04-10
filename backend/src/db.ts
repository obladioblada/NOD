import {User} from "./User";

export class DB {

    public USER: Map<string, User> = new Map<string, User>();


    getUser(id: string): User {
        return this.USER.get(id);
    }

    getUserByAccessToken(accessToken: string): User {
        for (let [id, user] of this.USER) {
            if (user.accessToken === accessToken) {
                return user;
            }
        }
        return null;
    }

    addUser(user: User): Boolean {
        console.log("adding " + user.name);
        if(user !== undefined && !this.USER.has(user.id)) {
            console.log("NON ESISTE AGGIUNGIAMOLO");
            this.USER.set(user.id, user);
            console.log(this.USER.size);
            return true;
        } else {
            console.log("user already exist!");
            return false;
        }
    }

    updateUser(user:User): Boolean{
        if(this.USER.has(user.id)) {
            this.USER.set(user.id, user);
            console.log(this.USER);
            return true;
        } else {
            console.log("user does not exist!");
            return false;
        }
    }
}