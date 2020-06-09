
import { Injectable, Inject } from '@angular/core';
import { throwError, from, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Location, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { ButtonState } from 'src/app/main-button/button';
import { MainButtonService } from 'src/app/main-button/main-button.service';
import {environment } from '../environments/environment';
import * as moment from 'moment';
import { User } from 'src/app/models/User';
import { UserDto } from './userDto';
import { BackgroundService } from 'src/app/background/background.service';
import { BackgroundAnimationState, BackgroundState } from 'src/app/background/background';

// import {SpotifyConnectorService} from "../app/services/spotify-connector.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // TODO: use env var here
    private apiEndpoint = environment.apiEndpoint;
    private isloggedIn: boolean;

    private redirectUrl: string;
    private userName: string;

    constructor(
      @Inject(DOCUMENT) private document: Document,
      private mainButtonService: MainButtonService,
      private backgroundService: BackgroundService,
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
      code
    };
    console.log('going to authenticate');
    return this.http.get<any>((Location.joinWithSlash(this.apiEndpoint, 'authenticate?code=' + code)))
    .pipe(map((res => this.setSession(res))), shareReplay());

  }

  private setRedirectUrl(getRedirectUrlResult: { redirectUrl: any; }) {
    this.redirectUrl = getRedirectUrlResult.redirectUrl;
    return getRedirectUrlResult;
  }

  private setSession(authResult: { expirationDate: moment.DurationInputArg1; accessToken: string; status: number; refreshToken: string; }) {

    const expiresAt = moment().add(authResult.expirationDate, 'second');

    localStorage.setItem('id_token', authResult.accessToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );


    if (authResult.status !== 500) {
      console.log(localStorage.getItem('id_token'));
      this.isloggedIn = true;
    }
}

  me() {
    return this.http.get(Location.joinWithSlash(this.apiEndpoint, 'me?access_token=' + localStorage.getItem('id_token')));
  }

  join(id: string) {
    return this.http.get(
      Location.joinWithSlash(this.apiEndpoint, 'join?user_id_to_join=' + id + '&access_token=' + localStorage.getItem('id_token'))
    );
  }

  player(id: string, play: boolean) {
    console.log(localStorage.getItem('id_token'));
    return this.http.get(
      Location.joinWithSlash(this.apiEndpoint, 'player?access_token=' + localStorage.getItem('id_token') + '&id=' + id + '&play=' + play));
  }

  friends(): Observable<User[]> {
    console.log(localStorage.getItem('id_token'));
    return this.http.get<UserDto[]>(Location.joinWithSlash(this.apiEndpoint, 'friends?access_token=' + localStorage.getItem('id_token')))
    // 3. so now this guy here is still waiting for a any object, we want this to be the UserDto interface
    // and we want to be sure the we can access a UserDto namespace that knows how to convert a UserDto to User
    // so next step is to convert UserDto to User instance
      .pipe(map((data: UserDto[]) => data.map(userDto => UserDto.unmarshal(userDto))));
  }


  public isLoggedIn() {
    console.log(localStorage.getItem('id_token'));
    console.log(moment().isBefore(this.getExpiration()));

    return moment().isBefore(this.getExpiration());
}

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
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
      this.backgroundService.setBackgroundState(BackgroundState.ERROR);
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
