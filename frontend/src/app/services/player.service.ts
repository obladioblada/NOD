import {Injectable} from "@angular/core";
import {SpotifyConnectorService} from "./spotify-connector.service";
import {SpotifyApiService} from "./spotify-api.service";
import {AuthService} from "../../auth/auth.service";
import {Observable, Subject} from "rxjs";

@Injectable()
export class PlayerService {

  sdkReady$: Observable<boolean>;


  constructor(private spotifyApiService: SpotifyApiService,
              private authService: AuthService,
              private spotifyConnectorService: SpotifyConnectorService
  ) {
  }

  onSDKReady() {
    return this.spotifyConnectorService.onConnected;
  }

  onPlayerReady() {}

  onDevicesReady(){
  }

  onNodPlayerReady() {

  }

  getCurrentPlaying() {
    return this.spotifyApiService.getCurrentPlaying(this.authService.getAccessToken())
  }
}
