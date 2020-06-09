import { Injectable } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginSevice {
  private isloggedIn: boolean;
    private accessToken: string;
    private expirationDate: string;
    private refreshToken: string;

  constructor( private http: HttpClient, private authService: AuthService) {

  }
  login(code: string, redirectUrl: string) {
      // this.isloggedIn=true;
      // this.authService.authenticate(code, redirectUrl).subscribe((data) => {
      //   console.log(data);
      //   if(data["status"] !== 500){
      //       this.isloggedIn=true;
      //       /*
      //       if (redirectUrl) {
      //             this.router.navigate( [redirectUrl]);
      //        } else {
      //             this.router.navigate( ['']);
      //        }
      //        */
      //     }
      // });
    }
}
