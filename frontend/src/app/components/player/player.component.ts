import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {ButtonState} from '../../main-button/button';
import {BackgroundAnimationState} from '../../background/background';
import {AuthService} from '../../../auth/auth.service';
import {MainButtonService} from '../../main-button/main-button.service';
import {BackgroundService} from '../../background/background.service';
import {SocketService} from '../../services/socket.service';
import {SpotifyConnectorService} from '../../services/spotify-connector.service';
import {SpotifyService} from '../../services/spotify.service';

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

  constructor(private authService: AuthService,
              private mainButtonService: MainButtonService,
              private backgroundService: BackgroundService,
              private socketServices: SocketService,
              private spotifyConnectorService: SpotifyConnectorService,
              private spotifyService: SpotifyService,
              private cd: ChangeDetectorRef) {
    this.isPlaying = false;
  }

  ngOnInit(): void {
    this.spotifyConnectorService.onPlaySong.subscribe(data => {
      console.log(data.track);
      console.log(data.track.name);
      this.currentSong = data.track.name;
      this.currentImgUrl = data.track.album.images[1].url;
      this.currentArtist = data.track.artists[0].name;
      console.log(data.paused);
      this.isPlaying = !data.paused;
      this.cd.detectChanges();
    });
    this.spotifyService.getCurrentPlaying(this.authService.getAccessToken()).subscribe(currentTrack => {
        this.isPlaying = false;
    });
  }

  play() {
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    console.log('Play --> ' + !this.isPlaying);
    this.authService.player(this.spotifyConnectorService.getDeviceId(), !this.isPlaying)
      .subscribe(val => {
        console.log(!this.isPlaying);
        this.isPlaying = !this.isPlaying;
        this.mainButtonService.setButtonState(ButtonState.SUCCESS);
        console.log(val);
        if (this.isPlaying) {
          this.backgroundService.setBackgroundAnimationState(BackgroundAnimationState.PLAY);
          this.socketServices.sendPlay('I am playing a song');
        } else {
          this.backgroundService.setBackgroundAnimationState(BackgroundAnimationState.PAUSE);
        }
      });
  }


}
