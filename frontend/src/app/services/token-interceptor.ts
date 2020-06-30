import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthService} from 'src/auth/auth.service';
import * as moment from "moment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessExpired = this.authService.isAccessTokenExpired();
    console.log("now" + moment().format())
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    console.log("expire At" + moment(expiresAt).format());
    if (this.authService.getAccessToken() && !accessExpired) {
      request = this.injectToken(request);
      console.log(accessExpired);
      console.log(this.authService.getAccessToken());
    }
    return next.handle(request)
      .pipe(catchError(error => {
        console.log(error);
        console.log("ERROR OCCURRED");
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      }));

  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((authResult: any) => {
          this.refreshTokenInProgress = false;
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
        switchMap(jwt => {
          return next.handle(this.injectToken(request));
        }));
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
