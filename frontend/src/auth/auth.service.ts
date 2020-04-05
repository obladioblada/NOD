
import { Injectable, Inject } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Location, DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO: use env var here
    private apiEndpoint = "http://localhost:3000";
    private isloggedIn: boolean;
    private refreshToken: string;
    private userName:string;

    constructor(@Inject(DOCUMENT) private document: Document, private http: HttpClient) {
        this.isloggedIn=false;
    }

    getAuthCode() {
      //this.isloggedIn=true;
      return of(this.http.get<{redirectUrl:string}>(Location.joinWithSlash(this.apiEndpoint,"login")).subscribe((data) => {
          console.log(data.redirectUrl);
        this.document.location.href = data.redirectUrl;
//          window.open(data.urlRedirect);
      }));
  }
  login(code:string) {
      //this.isloggedIn=true;
      return of(this.http.get(Location.joinWithSlash(this.apiEndpoint,"updateToken/?code="+code)).subscribe((data) => {
          console.log(data);
//          window.open(data.urlRedirect);
      }));
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
