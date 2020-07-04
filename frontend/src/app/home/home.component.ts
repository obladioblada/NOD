import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from 'src/auth/auth.service';
import {MainButtonService} from '../main-button/main-button.service';
import {ButtonPosition, ButtonState} from '../main-button/button';
import {combineLatest, merge, Observable, Subject, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {User} from '../models/User';
import {BackgroundService} from '../background/background.service';
import {BackgroundAnimationState, BackgroundState} from '../background/background';
import {SpotifyApiService} from '../services/spotify-api.service';
import {SocketService} from "../services/socket.service";
import {UserProfileService} from "../services/user-profile.service";
import {CurrentSong} from "../models/CurrentSong";

@Component({
  selector: 'nod-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit, OnInit {
  users$: Observable<User[]>;
  refreshOccurs$: Subject<any> = new Subject();
  mainButton$: Subscription;
  showPlayer: boolean;

  constructor(
    private authService: AuthService,
    private mainButtonService: MainButtonService,
    private backgroundService: BackgroundService,
    private spotifyService: SpotifyApiService,
    private socketService: SocketService,
    private userProfileService: UserProfileService) {
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    this.userProfileService.loadUserProfile();
    this.backgroundService.setBackgroundAnimationState(BackgroundAnimationState.PAUSE);
    this.users$ = combineLatest(
      [
        merge(
          this.refreshOccurs$.asObservable(), this.socketService.refreshUsers$.asObservable()
        ).pipe(switchMap(() => this.authService.friends())),
        this.socketService.userTrackStateChanged$.asObservable()]
    ).pipe(
      map(([users, currentSongMessage]) => {
        if (currentSongMessage && users.find(user => user.id === currentSongMessage.sender)) {
          const currentSong  = new CurrentSong(
            currentSongMessage.song.id,
            currentSongMessage.song.name,
            currentSongMessage.song.imgUrl,
            currentSongMessage.song.artist,
            currentSongMessage.song.paused
            );
          users.find(user => user.id === currentSongMessage.sender).setCurrentSong(currentSong)
        }
        console.log(users)
        return users;
      }));
  }

  ngOnInit() {
    this.mainButton$ = combineLatest([this.users$]).subscribe(() => {
        this.mainButtonService.setButtonPosition(ButtonPosition.BOTTOM);
        this.mainButtonService.setButtonState(ButtonState.SUCCESS);
        this.backgroundService.setBackgroundState(BackgroundState.SUCCESS);
        this.showPlayer = true;
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
