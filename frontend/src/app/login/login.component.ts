import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {MainButtonService} from '../main-button/main-button.service';
import {ButtonState} from '../main-button/button';
import {BackgroundService} from '../background/background.service';
import {BackgroundAnimationState, BackgroundState} from '../background/background';

@Component({
  selector: 'nod-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  invalidCredentialMsg: string;
  username: string;
  password: string;
  retUrl = 'home';
  code: string;
  constructor(@Inject(DOCUMENT) private document: Document,
              private authService: AuthService,
              private mainButtonService: MainButtonService,
              private backgroundService: BackgroundService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
    .subscribe(params => {
    this.retUrl = params.get('retUrl');
    console.log( 'LoginComponent/ngOnInit ' + this.retUrl);
    });
    this.mainButtonService.setButtonCallback(this.getRedirectUrl);
    console.log(this.code);
    if (this.document.location.href.search('code') !== -1) {
      this.code = this.document.location.href.split('=')[1];
  }
    if (this.code) {
      this.mainButtonService.setButtonState(ButtonState.LOADING);
      this.backgroundService.setBackgroundAnimationState(BackgroundAnimationState.PLAY);
      this.backgroundService.setBackgroundState(BackgroundState.IDLE);
      this.authService.login(this.code).subscribe(() => {
        if (this.retUrl) {
              this.router.navigate( [this.retUrl]);
         } else {
              this.router.navigate( ['']);
         }
      });
    }
    this.getRedirectUrl();
  }

  getRedirectUrl() {
    if (!this.code) {
      this.mainButtonService.setButtonState(ButtonState.LOADING);
      this.backgroundService.setBackgroundState(BackgroundState.IDLE);
      this.backgroundService.setBackgroundAnimationState(BackgroundAnimationState.PLAY);
      this.authService.getRedirectUrl();
    }
  }

  ngOnDestroy(): void {

  }


}
