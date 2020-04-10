import { Component } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import { MainButtonService } from '../main-button/main-button.service';
import { ButtonState, ButtonPosition } from '../main-button/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  devices$: Observable<any>;

  constructor(private authService: AuthService, private mainButtonService: MainButtonService) {
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    this.devices$ = this.authService.devices();

    this.devices$.subscribe(val => {
      this.mainButtonService.setButtonPosition(ButtonPosition.BOTTOM);
      this.mainButtonService.setButtonState(ButtonState.SUCCESS);
    });
   }

  play(id, play) {
    this.authService.player(id, !play).subscribe(val => {
      console.log(val);
      this.mainButtonService.setButtonState(ButtonState.PLAY);
    });
  }

}
