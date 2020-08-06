import {WindowRef} from '../WindowRef';
import {Injectable} from '@angular/core';
import {AuthService} from 'src/auth/auth.service';
import {Subject} from 'rxjs';
import {DeviceDetectorService} from 'ngx-device-detector';

declare var Spotify: any;

@Injectable({providedIn: 'root'})
export class SpotifyConnectorService {

  onPlaySong: Subject<any> = new Subject<any>();
  onSdkReady$: Subject<string> = new Subject<string>();
  paused: boolean;
  player: any;
  deviceId: string;

  constructor(private winRef: WindowRef, private authService: AuthService, private deviceService: DeviceDetectorService) {
    this.initializeSdk()
  }

  initializeSdk(): any {
    return  this.winRef.nativeWindow.waitForSpotify.then(() =>{
      const token = this.authService.getAccessToken();
      console.log(this.deviceService.getDeviceInfo());
      if (token && this.player === undefined) {
         this.player = new Spotify.Player({
          name: 'Nod ' + this.deviceService.getDeviceInfo().browser + " " + this.deviceService.getDeviceInfo().os,
          getOAuthToken: cb => {
            cb(token);
          }
        });

        // Error handling
        this.player.addListener('initialization_error', ({message}) => {
          console.error(message);
        });
        this.player.addListener('authentication_error', ({message}) => {
          console.error(message);
        });
        this.player.addListener('account_error', ({message}) => {
          console.error(message);
        });
        this.player.addListener('playback_error', ({message}) => {
          console.error(message);
        });

        this.player.addListener('player_state_changed', state => {
          if (state) {
            this.paused = state.paused;
            this.onPlaySong.next({track: state.track_window.current_track, paused: this.paused});
          }
        });

        // Ready
        this.player.addListener('ready', ({device_id}) => {
          console.log('Ready with Device ID', device_id);
          this.de
          this.onSdkReady$.next(device_id);
        });

        // Not Ready
        this.player.addListener('not_ready', ({device_id}) => {
          console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        this.player.connect().then(success => {
          if (success) {
            console.log('The Web Playback SDK successfully connected to Spotify!')
          }
        });
        return  this.player
      } else {
        this.onSdkReady$.next(this.deviceId);
      }
    });
  }



}
