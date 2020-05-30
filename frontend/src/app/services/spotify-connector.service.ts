import {WindowRef} from '../WindowRef';
import {Injectable, Output} from '@angular/core';
import {AuthService} from 'src/auth/auth.service';
import {Subject, Observable} from 'rxjs';

declare var Spotify: any;

@Injectable()
export class SpotifyConnectorService {

  private deviceId: string;
  onPlaySong: Subject<any> = new Subject<any>();
  onConnected: Subject<boolean> = new Subject<boolean>();


  constructor(private winRef: WindowRef, private authService: AuthService) {
    this.winRef.nativeWindow.onSpotifyWebPlaybackSDKReady = () => {
      const token = this.authService.getAccessToken();
      if (token) {
        const player = new Spotify.Player({
          name: 'Nod',
          getOAuthToken: cb => {
            cb(token);
          }
        });

        // Error handling
        player.addListener('initialization_error', ({message}) => {
          console.error(message);
        });
        player.addListener('authentication_error', ({message}) => {
          console.error(message);
        });
        player.addListener('account_error', ({message}) => {
          console.error(message);
        });
        player.addListener('playback_error', ({message}) => {
          console.error(message);
        });

        // Playback status updates
        player.addListener('player_state_changed', state => {
          console.log(state);
          if (state) {
            this.onPlaySong.next({track: state.track_window.current_track, paused: state.paused });
          }
        });

        // Ready
        player.addListener('ready', ({device_id}) => {
          console.log('Ready with Device ID', device_id);
          this.deviceId = device_id;
          this.onConnected.next(true);
        });

        // Not Ready
        player.addListener('not_ready', ({device_id}) => {
          console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect().then(success => {
          if (success) {
            console.log('The Web Playback SDK successfully connected to Spotify!');
          }
        });
      }
    };
  }


  getDeviceId(): string {
    return this.deviceId;
  }

}
