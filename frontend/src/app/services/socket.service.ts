import {Injectable} from '@angular/core';
import {SpotifyService} from './spotify.service';
import {Socket} from 'ngx-socket-io';
import {SocketEvent} from '../../../../shared/socket/socketEvent';

@Injectable()
export class SocketService {

  constructor(spotifyService: SpotifyService, private socket: Socket) {
    this.socket.on(SocketEvent.JOIN, (message) => {
    });
    this.socket.on(SocketEvent.PLAY, (playMessage) => {
      console.log(playMessage);
    });
    this.socket.on(SocketEvent.PAUSE, (playMessage) => {
      console.log(playMessage);
    });
  }

  sendJoin(message) {
    this.socket.emit(SocketEvent.JOIN, message);
  }

  sendPlay(message) {
    this.socket.emit(SocketEvent.PLAY, message);
  }

  sendPause(message) {
    this.socket.emit(SocketEvent.PAUSE, message);
  }
}


