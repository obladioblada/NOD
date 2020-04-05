import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import {pluck} from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalidCredentialMsg: string;
  username:string;
  password:string;
  retUrl:string="home";
  code: string;
  constructor(@Inject(DOCUMENT) private document: Document,
              private authService: AuthService,

              private activatedRoute:ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
    .subscribe(params => {
    this.retUrl = params.get('retUrl');
    console.log( 'LoginComponent/ngOnInit '+ this.retUrl);
    });

    if(this.document.location.href.search("code") !== -1){
    this.code = this.document.location.href.split('=')[1]
  }
    if(this.code){this.authService.login(this.code, this.retUrl);}
  }

  login() {
    if(!this.code){
      this.authService.getAuthCode();
    }

  }

}
