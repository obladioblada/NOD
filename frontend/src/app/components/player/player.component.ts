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

  togglePlayer: boolean;


  constructor(private authService: AuthService,
              private socketService: SocketService,
              private spotifyApiService: SpotifyApiService,
              private playerService: PlayerService) {
    this.isPlaying = false;
    this.showDevices = false;

  }

  ngOnInit(): void {
    this.devices$ = this.refreshOccurs$.asObservable().pipe(switchMap(() => this.playerService.getDevices()));
    this.playerService.onSDKReady().pipe(
      switchMap((NodId) => this.playerService.setDevice(NodId)),
      takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshDevices();
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

    this.spotifyApiService.searchInProgress$.pipe(
      takeUntil(this.destroy$))
      .subscribe(toggleValue => { console.log(toggleValue);this.togglePlayer = toggleValue});

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
      console.log('previous called');
    });
  }

  next() {
    this.spotifyApiService.nextSong().pipe(takeUntil(this.destroy$)).subscribe(data => {
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
