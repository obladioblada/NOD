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
              private router: Router,
              private activatedRoute:ActivatedRoute) {

  }

  ngOnInit() {
    this.code = this.document.location.href.split('=')[1]

  }

  login() {
    if(this.code){
     this.authService.login(this.code);
    } else {
      this.authService.getAuthCode();
    }
    // .subscribe(data => {
    //     console.log( 'return to '+ this.retUrl);
    //     if (this.retUrl!=null) {
    //          this.router.navigate( [this.retUrl]);
    //     } else {
    //          this.router.navigate( ['']);
    //     }
    // });
  }

}
