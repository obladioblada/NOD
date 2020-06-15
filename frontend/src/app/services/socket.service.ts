import {Injectable} from '@angular/core';
import {SpotifyApiService} from './spotify-api.service';
import {Socket} from 'ngx-socket-io';
import {SocketEvent} from '../../../../shared/socket/socketEvent';
import {AuthService} from "../../auth/auth.service";
import {BehaviorSubject, Subject} from "rxjs";
import {CurrentSong} from "../models/CurrentSong";
import {UserProfileService} from "./user-profile.service";

@Injectable()
export class SocketService {

  refreshUsers$: Subject<any> = new Subject();
  userTrackStateChanged$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(spotifyService: SpotifyApiService,
              private socket: Socket,
              private authService: AuthService,
              private userProfileService: UserProfileService
  ) {

    this.socket.on(SocketEvent.USER_TRACK_STATE_CHANGED, (message) => {
      this.userTrackStateChanged$.next(message);
      this.refreshUsers$.next(message);
    });

    this.socket.on('connection', (message, callback) => {
      console.log(message);
      callback(this.authService.getAccessToken());
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    this.socket.on("otherUserConnection", (message) => {
      this.refreshUsers$.next(message);
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

  sendPlay(currentSongPlayed: CurrentSong) {
    this.socket.emit(SocketEvent.PLAY, {song: currentSongPlayed, sender: this.userProfileService.userProfile.id});
  }

  sendPause(currentSongStopped: CurrentSong) {
    this.socket.emit(SocketEvent.PAUSE, {song: currentSongStopped, sender: this.userProfileService.userProfile.id});
  }
}


