import {Injectable} from '@angular/core';
import {SpotifyApiService} from './spotify-api.service';
import {Socket} from 'ngx-socket-io';
import {SocketEvent} from '../../../../shared/socket/socketEvent';
import {AuthService} from "../../auth/auth.service";
import {Subject} from "rxjs";

@Injectable()
export class SocketService {

  refreshUser$: Subject<any> = new Subject();

  constructor(spotifyService: SpotifyApiService,
              private socket: Socket,
              private  authService: AuthService

  ) {

    this.socket.on(SocketEvent.USER_TRACK_STATE_CHANGED, (message) => {
      console.log(message);
    });

    this.socket.on('connection', (message, callback) => {
      console.log(message);
      callback(this.authService.getAccessToken());
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    this.socket.on("otherUserConnection", (message) => {
      this.refreshUser$.next(message);
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


