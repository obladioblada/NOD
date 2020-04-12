
import { Injectable, Inject } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Location, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { ButtonState } from 'src/app/main-button/button';
import { MainButtonService } from 'src/app/main-button/main-button.service';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // TODO: use env var here
    private apiEndpoint = 'http://localhost:3000';
    private isloggedIn: boolean;
    private accessToken: string;
    private expirationDate: string;
    private refreshToken: string;
    private redirectUrl: string;
    private userName: string;

    constructor(
      @Inject(DOCUMENT) private document: Document,
      private mainButtonService: MainButtonService,
      private http: HttpClient,
      private router: Router) {
    }

  getRedirectUrl() {
      return this.http.get<{redirectUrl: string}>(Location.joinWithSlash(this.apiEndpoint, 'login'))
      .pipe(catchError((error) => this.errorHandler(error)))
      .pipe(map((res => this.setRedirectUrl(res)))).subscribe((data) => {
        this.document.location.href = this.redirectUrl;
    });
  }

  getAccessToken() {
    return localStorage.getItem('id_token');
  }

  login(code: string) {
    const body = {
      'code': code
    };
    return this.http.get<any>((Location.joinWithSlash(this.apiEndpoint, 'authenticate?code=' + code)))
    .pipe(map((res => this.setSession(res))), shareReplay());

  }

  private setRedirectUrl(getRedirectUrlResult) {
    this.redirectUrl = getRedirectUrlResult.redirectUrl;
    return getRedirectUrlResult;
  }

  private setSession(authResult) {

    const expiresAt = moment().add(authResult.expirationDate,'second');

    localStorage.setItem('id_token', authResult.accessToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    //localStorage.setItem('expires_at', authResult.expirationDate);


    if (authResult.status !== 500) {
      this.expirationDate = authResult.expirationDate;
      this.refreshToken = authResult.refreshToken;
      console.log(localStorage.getItem('id_token'));
      this.isloggedIn = true;
    }
}

  me() {
    return this.http.get(Location.joinWithSlash(this.apiEndpoint, 'me?access_token=' + localStorage.getItem('id_token')));
  }

  join() {
    return this.http.get(Location.joinWithSlash(this.apiEndpoint, 'join?access_token=' + localStorage.getItem('id_token')));
  }

  player(id: string, play: boolean) {
    console.log(localStorage.getItem('id_token'));
    return this.http.get(
      Location.joinWithSlash(this.apiEndpoint, 'player?access_token=' + localStorage.getItem('id_token') + '&id=' + id + '&play=' + play));
  }

  devices() {
    console.log(localStorage.getItem('id_token'));
    return this.http.get(Location.joinWithSlash(this.apiEndpoint, 'player/devices?access_token=' + localStorage.getItem('id_token')))
    .pipe(map((data: any) => data.devices));
  }
  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
}

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    isAdminUser(): boolean {
        if (this.userName === 'Admin') {
            return true;
        }
        return false;
    }

    logoutUser(): void {
        localStorage.clear();
        this.isloggedIn = false;
    }

    errorHandler(error: HttpErrorResponse) {
      this.mainButtonService.setButtonState(ButtonState.ERROR);
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    }

}
