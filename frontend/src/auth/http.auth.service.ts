
import { Injectable, Inject } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Location, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthService {

  // TODO: use env var here
    private apiEndpoint = 'http://localhost:3000';
    private isloggedIn: boolean;
    private accessToken: string;
    private expirationDate: string;
    private refreshToken: string;
    private userName: string;

    constructor(@Inject(DOCUMENT) private document: Document, private http: HttpClient,  private router: Router) {
        this.isloggedIn = false;
    }

    getRedirectUrl() {
      return this.http.get<{redirectUrl: string}>(Location.joinWithSlash(this.apiEndpoint, 'login'));
  }
  login(code: string, redirectUrl: string) {
      // this.isloggedIn=true;
      this.http.get(Location.joinWithSlash(this.apiEndpoint, 'authenticate/?code=' + code)).subscribe((data: any) => {
        console.log(data);
        if (data.status !== 500) {
            this.expirationDate = data.expiration_date;
            this.refreshToken = data.refresh_token;
            this.accessToken = data.access_token;
            console.log('setto aT');
            console.log(this.accessToken);
            this.isloggedIn = true;
            if (redirectUrl) {
                  this.router.navigate( [redirectUrl]);
             } else {
                  this.router.navigate( ['']);
             }
          }
      });

      // .subscribe(data => {
    //     console.log( 'return to '+ this.retUrl);
    //
    // });
  }

  me() {
    console.log(this.accessToken);
    return this.http.get(Location.joinWithSlash(this.apiEndpoint, 'me?access_token=' + this.accessToken));
  }

  player(id: string, play: boolean) {
    console.log(this.accessToken);
    return this.http.get(
      Location.joinWithSlash(this.apiEndpoint, 'player?access_token=' + this.accessToken + '&id=' + id + '&play=' + play));
  }

  devices() {
    console.log(this.accessToken);
    return this.http.get(Location.joinWithSlash(this.apiEndpoint, 'player/devices?access_token=' + this.accessToken))
    .pipe(map((data: any) => data.devices));
  }

    isUserLoggedIn(): boolean {
        return this.isloggedIn;
    }

    isAdminUser(): boolean {
        if (this.userName == 'Admin') {
            return true;
        }
        return false;
    }

    logoutUser(): void {
        this.isloggedIn = false;
    }

}
