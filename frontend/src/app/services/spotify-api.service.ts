import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {Devices, DevicesDto} from '../models/Devices';
import {AuthService} from "../../auth/auth.service";
import {List} from 'immutable';
import {Device} from '../models/Device';
import {map} from 'rxjs/operators';
import {SpotifyConnectorService} from "./spotify-connector.service";


@Injectable()
export class SpotifyApiService {
  selectedDevice: string;
  private searchUrl: string;
  private artistUrl: string;
  private albumsUrl: string;
  private albumUrl: string;
  private previousUrl: string;
  private nextUrl: string;
  private playerUrl: string;
  // private clientId: string = environment.clientId;
  // private clientSecret: string = environment.clientSecret;
  private body: any;


  constructor(private http: HttpClient, private authService: AuthService, private spotifyConnectorService: SpotifyConnectorService) {
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({});
  }

  player() {
    this.playerUrl = `https://api.spotify.com/v1/me/player`;
    return this.http.get(this.playerUrl);
  }

  me() {
    return this.http.get("https://api.spotify.com/v1/me");
  }

  play() {
    return this.http.put("https://api.spotify.com/v1/me/player/play", {});
  }

  pause() {
    return this.http.put("https://api.spotify.com/v1/me/player/pause", {});
  }

  setDevice(deviceId: string): Observable<any |undefined> {
    this.playerUrl = `https://api.spotify.com/v1/me/player`;
    let body = {
      device_ids:[deviceId],
      play: this.spotifyConnectorService.paused != undefined ? !this.spotifyConnectorService.paused: false
    };
    return this.http.put(this.playerUrl, body);
  }


  previousSong() {
    this.previousUrl = 'https://api.spotify.com/v1/me/player/previous';
    return this.http.post( this.previousUrl, null);
  }

  nextSong() {
    this.nextUrl = 'https://api.spotify.com/v1/me/player/next';
    return this.http.post( this.nextUrl, null);
  }

  // Get search results for a query
  searchMusic(query: string, type) {
    // const headers = new HttpHeaders();
    // headers.set('Authorization', 'Bearer ' + authToken);

    const headers = {
      headers: {Authorization: 'Bearer ' + this.authService.getAccessToken()}
    };

    this.searchUrl = `https://api.spotify.com/v1/search?q=${query}&offset=0&limit=20&type=${type}&market=from_token`;
    console.log(this.searchUrl);
    console.log(headers);

    return this.http.get(this.searchUrl, headers);
  }

  // Get data about artist that has been chosen to view
  getArtist(id: string) {
    this.artistUrl = 'https://api.spotify.com/v1/artists/' + id;
    return this.http.get(this.artistUrl);
  }

  // Get the albums about the artist that has been chosen
  getAlbums(id: string) {
    this.albumsUrl = 'https://api.spotify.com/v1/artists/' + id + '/albums?market=from_token&album_type=single';
    return this.http.get(this.albumsUrl);
  }

  // Get Tracks in ablum selected
  getAlbum(id: string) {
    this.albumUrl = 'https://api.spotify.com/v1/albums/' + id;
    return this.http.get(this.albumUrl);
  }
  // Get current track playing
  getCurrentPlaying(): Observable<any>{
    return this.http.get<any>('https://api.spotify.com/v1/me/player/currently-playing');
  }

  devices(): Observable<List<Device>> {
    return this.http.get<DevicesDto>('https://api.spotify.com/v1/me/player/devices').pipe(map((devicesDto: DevicesDto) =>
      Devices.parseFromDto(devicesDto)
      ));
  }
}
