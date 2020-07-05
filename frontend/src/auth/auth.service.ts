import {Inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {DOCUMENT, Location} from '@angular/common';
import {Router} from '@angular/router';
import {catchError, map, shareReplay} from 'rxjs/operators';
import {ButtonState} from 'src/app/main-button/button';
import {MainButtonService} from 'src/app/main-button/main-button.service';
import {environment} from '../environments/environment';
import * as moment from 'moment';
import {User} from 'src/app/models/User';
import {UserDto} from './userDto';
import {BackgroundService} from 'src/app/background/background.service';
import {BackgroundState} from 'src/app/background/background';

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
    return localStorage.getItem('access_token');
  }

  getRefreshtoken() {
    return localStorage.getItem('refresh_token');
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

  private setSession(authResult: { expiresIn: moment.DurationInputArg1; accessToken: string; status: number; refreshToken: string; }) {
    localStorage.setItem('access_token', authResult.accessToken);
    const expiresAt = moment().add(authResult.expiresIn, 'seconds');
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('gianpaolo', "gianpaolo");
    localStorage.setItem('refresh_token', authResult.refreshToken);
    if (authResult.status !== 500) {
      this.isloggedIn = true;
    }
}

  refreshToken(){
    return this.http.post(Location.joinWithSlash(this.apiEndpoint, 'refreshToken'),
      {
        refresh_token: localStorage.getItem('refresh_token'),
        access_token: this.getAccessToken()
      });
  }

  me() {
    return this.http.get(Location.joinWithSlash(this.apiEndpoint, 'me?access_token=' + localStorage.getItem('access_token')));
  }

  join(id: string) {
    return this.http.get(
      Location.joinWithSlash(this.apiEndpoint, 'join?user_id_to_join=' + id + '&access_token=' + localStorage.getItem('access_token'))
    );
  }

  player(id: string, play: boolean) {
    console.log(localStorage.getItem('access_token'));
    return this.http.get(
      Location.joinWithSlash(this.apiEndpoint, 'player?access_token=' + localStorage.getItem('access_token') + '&id=' + id + '&play=' + play));
  }

  friends(): Observable<User[]> {
    console.log(localStorage.getItem('access_token'));
    return this.http.get<UserDto[]>(Location.joinWithSlash(this.apiEndpoint, 'friends?access_token=' + localStorage.getItem('access_token')))
      .pipe(map((data: UserDto[]) => data.map(userDto => UserDto.unmarshal(userDto))));
  }


  public isLoggedIn(): boolean {
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

    isAccessTokenExpired(): boolean {
      return !moment().isBefore(this.getExpiration());
    }

    logoutUser(): void {
        localStorage.clear();
        this.isloggedIn = false;
    }

    errorHandler(error: HttpErrorResponse) {
      this.mainButtonService.setButtonState(ButtonState.ERROR);
      this.backgroundService.setBackgroundState(BackgroundState.ERROR);
      console.log(error);
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
