import {Injectable} from '@angular/core';
import {SpotifyService} from './spotify.services';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from '../../environments/environment';

@Injectable()
export class SocketServices {

  private socket$: WebSocketSubject<any>;

  constructor(spotifyService: SpotifyService) {
    this.socket$ = webSocket('ws://localhost:3000');
    this.socket$.subscribe(
      msg => {
        console.log('message received: ');
        console.log(msg);
      }, // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );

    this.socket$.next('heyyy');
  }

  sendMessage(message) {
    this.socket$.next(message);
  }

}


