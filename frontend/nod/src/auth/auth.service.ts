
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

    private isloggedIn: boolean;
    private refreshToken: string;
    private userName:string;

    constructor(private http: HttpClient) {
        this.isloggedIn=false;
    }

    login() {
        this.isloggedIn=true;
        return of(this.isloggedIn);
    }

    isUserLoggedIn(): boolean {
        return this.isloggedIn;
    }

    isAdminUser():boolean {
        if (this.userName=='Admin') {
            return true;
        }
        return false;
    }

    logoutUser(): void{
        this.isloggedIn = false;
    }

}
