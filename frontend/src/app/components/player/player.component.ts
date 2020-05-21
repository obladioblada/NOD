import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {ButtonState} from '../../main-button/button';
import {BackgroundAnimationState, BackgroundState} from '../../background/background';
import {AuthService} from '../../../auth/auth.service';
import {MainButtonService} from '../../main-button/main-button.service';
import {BackgroundService} from '../../background/background.service';
import {SocketService} from '../../services/socket.service';
import {SpotifyConnectorService} from '../../services/spotify-connector.service';
import {SpotifyService} from "../../services/spotify.service";

@Component({
  selector: 'nod-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Output()
  onPlayPause: EventEmitter<boolean> = new EventEmitter<boolean>();
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
              private ngZone: NgZone) {
    this.spotifyConnectorService.onPlaySong.subscribe(currentTrack => {
      console.log(currentTrack);
      console.log(currentTrack.name);
      this.currentSong = currentTrack.name;
      this.currentImgUrl = currentTrack.album.images[1].url;
      this.currentArtist = currentTrack.artists[0].name;
    });
    this.spotifyService.getCurrentPlaying(this.authService.getAccessToken()).subscribe(currentTrack => {
      console.log(currentTrack);
    });
  }

  ngOnInit(): void {

  }


  play() {
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    this.authService.player(this.spotifyService.selectedDevice || this.spotifyConnectorService.getDeviceId(), !this.isPlaying)
      .subscribe((val) => this.ngZone.run((val) => {
        this.isPlaying = !this.isPlaying;
        this.onPlayPause.emit(this.isPlaying);
        this.mainButtonService.setButtonState(ButtonState.SUCCESS);
        console.log(val);
        if (this.isPlaying) {
          this.backgroundService.setBackgroundAnimationState(BackgroundAnimationState.PLAY);
          this.socketServices.sendPlay('I am playing a song');
        } else {
          this.backgroundService.setBackgroundAnimationState(BackgroundAnimationState.PAUSE);
        }
      }));
  }


}
