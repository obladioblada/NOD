import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private authService: AuthService,
              private router: Router,
              private activatedRoute:ActivatedRoute) {
  }

  ngOnInit() {
      this.activatedRoute.queryParamMap
              .subscribe(params => {
          this.retUrl = params.get('retUrl');
          console.log( 'LoginComponent/ngOnInit '+ this.retUrl);
      });
  }

  login() {
     this.authService.login().subscribe(data => {
         console.log( 'return to '+ this.retUrl);
         if (this.retUrl!=null) {
              this.router.navigate( [this.retUrl]);
         } else {
              this.router.navigate( ['']);
         }
     });
  }

}
