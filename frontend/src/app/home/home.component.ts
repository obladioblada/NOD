import {Component, AfterViewInit, ChangeDetectionStrategy, OnInit, NgZone} from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import { MainButtonService } from '../main-button/main-button.service';
import { ButtonState, ButtonPosition } from '../main-button/button';
import { Observable, Subject, Subscription, combineLatest } from 'rxjs';
import { switchMap, shareReplay, map } from 'rxjs/operators';
import {SpotifyConnectorService} from '../services/spotify-connector.service';
import { User } from '../models/User';
import { BackgroundService } from '../background/background.service';
import { BackgroundState, BackgroundAnimationState } from '../background/background';
import { SpotifyService } from '../services/spotify.service';
import {List} from 'immutable';
@Component({
  selector: 'nod-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit, OnInit {
  sdkReady$: Observable<any>;
  currentPlaying$: Observable<any>;
  devices$: Observable<List<any>>;
  isPlaying$: Observable<boolean>;
  isPlaying: boolean;
  users$: Observable<User[]>;
  refreshOccurs$: Subject<any> = new Subject();
  joinSucceded: boolean;
  mainButton$: Subscription;
  showPlayer: boolean;
  devices;

  constructor(
              private authService: AuthService,
              private mainButtonService: MainButtonService,
              private backgroundService: BackgroundService,
              private spotifyService: SpotifyService,
              private spotifyConnectorService: SpotifyConnectorService,
              private ngZone: NgZone) {
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    this.backgroundService.setBackgroundAnimationState(BackgroundAnimationState.PAUSE);
    this.currentPlaying$ = this.refreshOccurs$.asObservable()
      .pipe(switchMap(() => this.spotifyService.getCurrentPlaying(authService.getAccessToken())), shareReplay());
    this.sdkReady$ =  this.spotifyConnectorService.connectNodPlayer();
    this.devices$ = this.refreshOccurs$.asObservable().pipe(switchMap(() => this.authService.devices()));
    this.users$ = this.refreshOccurs$.asObservable().pipe(switchMap(() => this.authService.friends()));
   }

   ngOnInit() {
     this.sdkReady$.subscribe(() => this.ngZone.run(() => this.refresh()));
     this.mainButton$ = combineLatest([this.devices$, this.users$, this.currentPlaying$]).pipe(
         map(([devices, users, currentPlaying]) => ({devices, users, currentPlaying}))
       ).subscribe(({devices, users, currentPlaying}) => {
          this.mainButtonService.setButtonPosition(ButtonPosition.BOTTOM);
          this.mainButtonService.setButtonState(ButtonState.SUCCESS);
          this.backgroundService.setBackgroundState(BackgroundState.SUCCESS);
          this.showPlayer = true;
          console.log(devices);
          console.log(users);
          console.log(currentPlaying);
          this.isPlaying = currentPlaying ? currentPlaying.is_playing : false;
          this.devices = devices;
          return devices;
     },
     () => {
       this.mainButtonService.setButtonPosition(ButtonPosition.CENTER);
       this.mainButtonService.setButtonState(ButtonState.ERROR);
     });
   }

   ngAfterViewInit() {
    this.refresh();
   }

   updateFriends() {
     this.refresh();
   }

  play(id, play) {
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    this.authService.player(id, play).subscribe(val => {
      console.log(val);
      this.refresh();
    });
  }


  refresh() {
    console.log('refresh');
    this.refreshOccurs$.next();
  }

  join() {
  // this.authService.join().subscribe(val => {
  //   console.log(val);
  //   this.joinSucceded = true;
  //   this.refresh();
  // });
  }

}
