import { Component, OnInit } from '@angular/core';
import { WindowRef } from './WindowRef';
declare var Spotify: any;

@Component({
  selector: 'nod-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nod';
  constructor(private winRef: WindowRef) {
    winRef.nativeWindow.onSpotifyWebPlaybackSDKReady = () => {
      if (localStorage.getItem('id_token')) {
        const token = localStorage.getItem('id_token');
        const player = new Spotify.Player({
              name: 'Nod Player',
              getOAuthToken: cb => { cb(token); }
            });

            // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

            // Playback status updates
        player.addListener('player_state_changed', state => { console.log(state); });

            // Ready
        player.addListener('ready', ({ device_id }) => {
              console.log('Ready with Device ID', device_id);
            });

            // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
              console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
        player.connect();
          }
      };
  }

}
