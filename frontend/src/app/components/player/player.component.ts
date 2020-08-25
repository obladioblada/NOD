import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {SocketService} from '../../services/socket.service';
import {SpotifyApiService} from '../../services/spotify-api.service';
import {map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {PlayerService} from "../../services/player.service";
import {Device} from 'src/app/models/Device';
import {List} from 'immutable';
import {CurrentSong} from "../../models/CurrentSong";
import {ButtonPosition, ButtonState} from "../../main-button/button";
import {MainButtonService} from "../../main-button/main-button.service";

@Component({
  selector: 'nod-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit, OnDestroy {
  isPlaying: boolean;
  devices$: Observable<List<Device>>;
  showDevices: boolean;
  refreshOccurs$: Subject<any> = new Subject();
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentSong$: Observable<CurrentSong>;

  togglePlayer$: Observable<boolean>;


  constructor(private authService: AuthService,
              private socketService: SocketService,
              private spotifyApiService: SpotifyApiService,
              private playerService: PlayerService,
              private mainButtonService: MainButtonService) {
    this.isPlaying = false;
    this.showDevices = false;

  }

  ngOnInit(): void {
    this.togglePlayer$ = this.spotifyApiService.getSearchInProgress().pipe(takeUntil(this.destroy$));
    this.togglePlayer$.subscribe(value => console.log(value), error => console.log(error));
    this.devices$ = this.refreshOccurs$.asObservable().pipe(switchMap(() => this.playerService.getDevices()));
    this.playerService.onSDKReady().pipe(
      switchMap((NodId) => this.playerService.setDevice(NodId)),
      takeUntil(this.destroy$))
      .subscribe(() => {
        console.log("sdk readyyy");
        this.refreshDevices();
        this.mainButtonService.setButtonPosition(ButtonPosition.BOTTOM);
        this.mainButtonService.setButtonState(ButtonState.SUCCESS);
      });
    this.currentSong$ = this.playerService.onPlaySong().pipe(
      map((data) => new CurrentSong(
        data.track.id,
        data.track.name,
        data.track.album.images[1].url,
        data.track.artists[0].name,
        data.paused)),
      tap((currentSong) => {
        this.isPlaying = !currentSong.paused;
        if (!currentSong.paused) {
          this.socketService.sendPlay(currentSong);
        } else {
          this.socketService.sendPause(currentSong);
        }
      })
    );
  }


  play() {
    if (this.isPlaying || this.isPlaying === undefined) {
      this.isPlaying = false;
      this.playerService.pause().pipe(takeUntil(this.destroy$)).subscribe(data => {
        console.log('pause');
        console.log(data);
      });
    } else {
      this.playerService.play().pipe(takeUntil(this.destroy$)).subscribe(data => {
        console.log('play');
        console.log(data);
        this.isPlaying = true;
      });
    }

  }

  previous() {
    this.spotifyApiService.previousSong().pipe(takeUntil(this.destroy$)).subscribe(data => {
      // handle current song if device isn't NOD
      console.log('previous called');
    });
  }

  next() {
    this.spotifyApiService.nextSong().pipe(takeUntil(this.destroy$)).subscribe(data => {
        // handle current song if device isn't NOD
      },
      error => {
        console.log(error);
      });
  }

  toggleDevices() {
    this.refreshDevices();
    this.showDevices = !this.showDevices;
  }

  refreshDevices() {
    this.refreshOccurs$.next();
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
