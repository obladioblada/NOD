import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {MainButtonService} from '../main-button/main-button.service';
import {ButtonState} from '../main-button/button';
import {SpotifyConnectorService} from "../services/spotify-connector.service";

@Component({
  selector: 'nod-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  password: string;
  retUrl = 'home';
  code: string;

  constructor(@Inject(DOCUMENT) private document: Document,
              private authService: AuthService,
              private mainButtonService: MainButtonService,
              private activatedRoute: ActivatedRoute,
              private spotifyConnectorService: SpotifyConnectorService,
              private router: Router) {

  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.retUrl = params.get('retUrl');
        console.log('LoginComponent/ngOnInit ' + this.retUrl);
      });
    this.mainButtonService.setButtonCallback(this.getRedirectUrl);
    console.log(this.code);
    if (this.document.location.href.search('code') !== -1) {
      this.code = this.document.location.href.split('=')[1];
    }
    if (this.code) {
      this.mainButtonService.setButtonState(ButtonState.LOADING);
      this.authService.login(this.code).subscribe(() => {
        if (this.retUrl) {
          console.log("initialising sdk after login");
          this.spotifyConnectorService.initializeSdk();
          this.router.navigate([this.retUrl]);
        } else {
          this.router.navigate(['']);
        }
      });
    }
    this.getRedirectUrl();
  }

  getRedirectUrl() {
    if (!this.code) {
      this.mainButtonService.setButtonState(ButtonState.LOADING);
      this.authService.getRedirectUrl();
    }
  }

  ngOnDestroy(): void {

  }


}
