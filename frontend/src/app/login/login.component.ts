import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import {pluck, catchError} from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { MainButtonService } from '../main-button/main-button.service';
import { ButtonState, ButtonPosition } from '../main-button/button';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalidCredentialMsg: string;
  username: string;
  password: string;
  retUrl='home';
  code: string;
  constructor(@Inject(DOCUMENT) private document: Document,
              private authService: AuthService,
              private mainButtonService: MainButtonService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
    .subscribe(params => {
    this.retUrl = params.get('retUrl');
    console.log( 'LoginComponent/ngOnInit ' + this.retUrl);
    });
    this.mainButtonService.setButtonCallback(this.login);

    if (this.document.location.href.search('code') !== -1) {
    this.code = this.document.location.href.split('=')[1];
  }
    if (this.code) {
      this.mainButtonService.setButtonState(ButtonState.LOADING);
      this.authService.login(this.code, this.retUrl);
    }
  }

  login() {
    if (!this.code) {
      this.mainButtonService.setButtonState(ButtonState.LOADING);
      this.authService.getRedirectUrl().pipe(catchError((error) => this.errorHandler(error)))
      .subscribe((data) => {
        console.log(data.redirectUrl);
        this.mainButtonService.setButtonState(ButtonState.SUCCESS);
        this.document.location.href = data.redirectUrl;
    });
    }
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
