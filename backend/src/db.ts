export class DB {

    USERS = [];

    constructor() {
    }

    getUser (id) {
        return this.USERS.filter(val => val.id === id).length > 0 && this.USERS.filter(val => val.id === id)[0];
    }
    addUser (user){
        if(!this.getUser(user)){
            this.USERS.push(user);
        } else {
            this.USERS = this.USERS.map(value => {
                /*if(value.id == id){
                    return user
                }
                */

            });
            return null;
        }
    }
}