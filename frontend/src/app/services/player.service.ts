import {Injectable} from "@angular/core";
import {SpotifyConnectorService} from "./spotify-connector.service";
import {SpotifyApiService} from "./spotify-api.service";
import {AuthService} from "../../auth/auth.service";
import {Subject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import { DeviceDto, Device } from '../models/Device';
import { DevicesDto } from '../models/Devices';
import { List } from 'immutable';

@Injectable({ providedIn: 'root'})
export class PlayerService {

  currentDevices: string;
  onCurrentDeviceChanged: Subject<string> = new Subject<string>();

  constructor(private spotifyApiService: SpotifyApiService,
              private authService: AuthService,
              private spotifyConnectorService: SpotifyConnectorService
  ) {}

  onSDKReady() {
    return this.spotifyConnectorService.onConnected;
  }

  getDevices(): Observable<List<Device>> {
    return this.spotifyApiService.devices();
  }

  onPlaySong() {
    return this.spotifyConnectorService.onPlaySong;
  }

  setDevice(deviceId: string)  {
    this.currentDevices = deviceId;
    return this.spotifyApiService.setDevice(deviceId);
  }

  play() {
    return this.spotifyApiService.play();
  }

  pause() {
    return this.spotifyApiService.pause();
  }


  getCurrentPlaying() {
    return this.spotifyApiService.getCurrentPlaying();
  }
}
