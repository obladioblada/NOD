import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {BackgroundService} from '../../background/background.service';
import {SocketService} from '../../services/socket.service';
import {SpotifyApiService} from '../../services/spotify-api.service';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PlayerService} from "../../services/player.service";
import {Device} from 'src/app/models/Device';
import {List} from 'immutable';

@Component({
  selector: 'nod-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit {
  isPlaying: boolean;
  currentSong: string;
  currentImgUrl: string;
  currentArtist: string;
  devices: Device[];
  devices$: Observable<List<Device>>;
  showDevices: boolean;

  constructor(private authService: AuthService,
              private backgroundService: BackgroundService,
              private socketServices: SocketService,
              private spotifyService: SpotifyApiService,
              private playerService: PlayerService,
              private cd: ChangeDetectorRef) {
    this.isPlaying = false;
    this.showDevices = false;
  }

  ngOnInit(): void {
    this.devices$ = this.playerService.onSDKReady().pipe(
      switchMap((NodId) => this.playerService.setDevice(NodId).pipe(map(() => NodId))),
      switchMap(() => this.playerService.getDevices())
    );

    this.playerService.onSDKReady().pipe(
      switchMap((NodId) => this.playerService.setDevice(NodId).pipe(map(() => NodId))),
      switchMap(data => this.playerService.getDevices())
    ).subscribe((devicesDto) => {
      console.log(devicesDto);
      this.devices = devicesDto;
    });
    this.playerService.onPlaySong().subscribe(data => {
      this.currentSong = data.track.name;
      this.currentImgUrl = data.track.album.images[1].url;
      this.currentArtist = data.track.artists[0].name;
      this.isPlaying = !data.paused;
      this.cd.detectChanges();
    });
    this.spotifyService.getCurrentPlaying().subscribe((currentTrack) => {
      if (currentTrack != null) {
        this.isPlaying = currentTrack.is_playing;
      } else {
        this.isPlaying = false;
      }
    });
    this.playerService.onCurrentDeviceChanged.subscribe(id => {
    this.devices = this.devices.map(device => {
        if(device.id !== id) {
        device.isActive = false;
        }
        return device
      });
      console.log(this.devices);
      this.cd.detectChanges();
    })
  }


  play() {
    if (this.isPlaying || this.isPlaying === undefined) {
      this.playerService.pause().subscribe(data => {
        console.log('pause');
        console.log(data);
        this.isPlaying = false;
        this.cd.detectChanges();
      });
    } else {
      this.playerService.play().subscribe(data => {
        console.log('play');
        console.log(data);
        this.isPlaying = true;
        this.cd.detectChanges();
      });
    }
    console.log(this.isPlaying);
  }

  previous() {
    this.spotifyService.previousSong().subscribe(data => {
      console.log('previous called');
      console.log(data);
    });
  }

  next() {
    this.spotifyService.nextSong().subscribe(data => {
        console.log('next called');
        console.log(data);
        this.spotifyService.player().subscribe(d => {
          console.log(d);
        });
      },
      error => {
        console.log(error);
      });
  }

  toggleDevices(par) {
    console.log(par);
    this.showDevices = !this.showDevices;
  }
}
