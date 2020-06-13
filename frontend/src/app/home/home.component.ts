import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from 'src/auth/auth.service';
import {MainButtonService} from '../main-button/main-button.service';
import {ButtonPosition, ButtonState} from '../main-button/button';
import {combineLatest, merge, Observable, Subject, Subscription} from 'rxjs';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {User} from '../models/User';
import {BackgroundService} from '../background/background.service';
import {BackgroundAnimationState, BackgroundState} from '../background/background';
import {SpotifyApiService} from '../services/spotify-api.service';
import {SocketService} from "../services/socket.service";

@Component({
  selector: 'nod-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit, OnInit {
  currentPlaying$: Observable<any>;
  isPlaying: boolean;
  users$: Observable<User[]>;
  refreshOccurs$: Subject<any> = new Subject();
  mainButton$: Subscription;
  showPlayer: boolean;

  constructor(
    private authService: AuthService,
    private mainButtonService: MainButtonService,
    private backgroundService: BackgroundService,
    private spotifyService: SpotifyApiService,
    private socketService: SocketService) {
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    this.backgroundService.setBackgroundAnimationState(BackgroundAnimationState.PAUSE);
    this.currentPlaying$ = this.refreshOccurs$.asObservable()
      .pipe(switchMap(() => this.spotifyService.getCurrentPlaying()), shareReplay());
    this.users$ = merge(this.refreshOccurs$.asObservable(),this.socketService.refreshUser$.asObservable()).pipe(
      switchMap(() => this.authService.friends())
    );
  }

  ngOnInit() {
    this.mainButton$ = combineLatest([this.users$, this.currentPlaying$]).pipe(
      map(([users, currentPlaying]) => ({users, currentPlaying}))
    ).subscribe(({users, currentPlaying}) => {
        this.mainButtonService.setButtonPosition(ButtonPosition.BOTTOM);
        this.mainButtonService.setButtonState(ButtonState.SUCCESS);
        this.backgroundService.setBackgroundState(BackgroundState.SUCCESS);
        this.showPlayer = true;
        console.log(users);
        console.log(currentPlaying);
        this.isPlaying = currentPlaying ? currentPlaying.is_playing : false;
      },
      () => {
        this.mainButtonService.setButtonPosition(ButtonPosition.CENTER);
        this.mainButtonService.setButtonState(ButtonState.ERROR);
      });
  }

  ngAfterViewInit() {
    this.refresh();
  }


  refresh() {
    console.log('refresh');
    this.refreshOccurs$.next();
  }


}
