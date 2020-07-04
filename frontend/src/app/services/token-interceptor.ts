import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthService} from 'src/auth/auth.service';
import * as moment from "moment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private refreshTokenInProgress: boolean = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("now" + moment().format());
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    console.log("expire At" + moment(expiresAt).format());
    return next.handle(this.injectToken(request))
      .pipe(catchError(error => {
        console.log(error);
        console.log("ERROR OCCURRED");
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401: return  this.handle401Error(request, next);
            case 400: return  this.handle400Error(request);
            default : return throwError(error);
          }
        } else {
          return throwError(error);
        }
      }));

  }

  handle400Error(error) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.;
    }
    return throwError(error);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.refreshTokenInProgress) {
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((authResult: any) => {
          this.refreshTokenInProgress = false;
          console.log("got new access Token " + authResult.access_token);
          this.refreshTokenSubject.next(authResult.access_token);
          localStorage.setItem('access_token', authResult.access_token);
          const expiresAt = moment().add(authResult.expiresIn, 'seconds');
          localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
          return next.handle(this.injectToken(request));
        }));
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap( token => {
          return next.handle(this.injectToken(request))
        } )
      )
    }
  }

  injectToken(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`
      }
    });
  }
}
