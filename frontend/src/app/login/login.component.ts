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
  selector: 'nod-login',
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
              private activatedRoute: ActivatedRoute,
              private router: Router) {

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
      this.authService.login(this.code).subscribe(() => {
        if (this.retUrl) {
              this.router.navigate( [this.retUrl]);
         } else {
              this.router.navigate( ['']);
         }
      });
    }
  }

  login() {
    if (!this.code) {
      this.mainButtonService.setButtonState(ButtonState.LOADING);
      this.authService.getRedirectUrl();
    }
  }
}
