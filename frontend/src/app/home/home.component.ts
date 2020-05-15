import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import { MainButtonService } from '../main-button/main-button.service';
import { ButtonState, ButtonPosition } from '../main-button/button';
import { Observable, Subject, Subscription, merge } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import {SocketService} from '../services/socket.service';
import {SpotifyConnectorService} from '../services/spotify-connector.service';

@Component({
  selector: 'nod-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  devices$: Observable<any>;
  users$: Observable<any>;
  refreshOccurs$: Subject<any> = new Subject();
  joinSucceded: boolean;
  mainButton$: Subscription;

  constructor(private authService: AuthService,
              private mainButtonService: MainButtonService,
              private spotifyConnectorService: SpotifyConnectorService) {
    this.spotifyConnectorService.connectNodPlayer();
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    this.devices$ = this.refreshOccurs$.asObservable().pipe(switchMap(() => this.authService.devices()), shareReplay(1));
    this.users$ = this.refreshOccurs$.asObservable().pipe(switchMap(() => this.authService.friends()), shareReplay(1));
    this.mainButton$ = merge(this.devices$, this.users$).subscribe(val => {
      this.mainButtonService.setButtonPosition(ButtonPosition.BOTTOM);
      this.mainButtonService.setButtonState(ButtonState.SUCCESS);
    },
    (error) => {
      this.mainButtonService.setButtonPosition(ButtonPosition.CENTER);
      this.mainButtonService.setButtonState(ButtonState.ERROR);
    });
   }

   ngAfterViewInit() {
    this.refresh();
   }

   updateFriends() {
     this.users$ = this.refreshOccurs$.asObservable().pipe(switchMap(() => this.authService.friends()), shareReplay(1));
   }

  play(id, play) {
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    this.authService.player(id, play).subscribe(val => {
      console.log(val);
      this.refresh();
    });
  }


  refresh() {
    this.refreshOccurs$.next();
  }

  join() {
  // this.authService.join().subscribe(val => {
  //   console.log(val);
  //   this.joinSucceded = true;
  //   this.refresh();
  // });
  }

  trackById(index, device) {
    return device.id;
  }
}
