import {Injectable} from '@angular/core';
import {SpotifyService} from './spotify.service';
import {Socket} from 'ngx-socket-io';
import {SocketEvent} from '../../../../shared/socket/socketEvent';

@Injectable()
export class SocketService {

  constructor(spotifyService: SpotifyService, private socket: Socket) {

    this.socket.on('connection', (message, callback) => {
      console.log(message);
      callback(' ciaooo ');
    });

    this.socket.on(SocketEvent.JOIN_ROOM, (message) => {
    });

    this.socket.on(SocketEvent.PLAY, (playMessage) => {
      console.log(playMessage);
    });
    this.socket.on(SocketEvent.PAUSE, (playMessage) => {
      console.log(playMessage);
    });
  }

  sendJoinRoom(message) {
    this.socket.emit(SocketEvent.JOIN_ROOM, message, (response) => {
      console.log(response);
    });
  }

  sendLeaveRoom(message) {
    this.socket.emit(SocketEvent.LEAVE_ROOM, message);
  }

  sendPlay(message) {
    this.socket.emit(SocketEvent.PLAY, message);
  }

  sendPause(message) {
    this.socket.emit(SocketEvent.PAUSE, message);
  }
}


