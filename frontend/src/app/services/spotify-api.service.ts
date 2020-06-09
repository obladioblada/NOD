import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {Devices, DevicesDto} from '../models/Devices';
import {AuthService} from "../../auth/auth.service";
import {List} from 'immutable';
import {Device} from '../models/Device';
import {map} from 'rxjs/operators';


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


  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
        Authorization : 'Bearer ' + this.authService.getAccessToken()
      });
  }

  player() {
    const headers: HttpHeaders = this.getHeaders();
    this.playerUrl = `https://api.spotify.com/v1/me/player`;
    return this.http.get(this.playerUrl, {headers});
  }

  play() {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.put(" https://api.spotify.com/v1/me/player/play", {},{ headers });
  }

  pause() {
    const headers: HttpHeaders = this.getHeaders();
    return this.http.put(" https://api.spotify.com/v1/me/player/pause", {},{ headers });
  }

  setDevice(deviceId: string): Observable<any |undefined> {
    const headers: HttpHeaders = this.getHeaders();
    this.playerUrl = `https://api.spotify.com/v1/me/player`;
    console.log(deviceId);
    return this.http.put(this.playerUrl,{device_ids:[deviceId]} ,{ headers });
  }


  previousSong() {
    const headers: HttpHeaders = this.getHeaders();
    this.previousUrl = 'https://api.spotify.com/v1/me/player/previous';
    return this.http.post( this.previousUrl, null, { headers });
  }

  nextSong() {
    const headers: HttpHeaders = this.getHeaders();
    this.nextUrl = 'https://api.spotify.com/v1/me/player/next';
    return this.http.post( this.nextUrl, null, { headers});
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
    const headers = this.getHeaders();
    this.artistUrl = 'https://api.spotify.com/v1/artists/' + id;
    return this.http.get(this.artistUrl, {headers});
  }

  // Get the albums about the artist that has been chosen
  getAlbums(id: string) {
    const headers = this.getHeaders();
    this.albumsUrl = 'https://api.spotify.com/v1/artists/' + id + '/albums?market=from_token&album_type=single';
    return this.http.get(this.albumsUrl, {headers});
  }

  // Get Tracks in ablum selected
  getAlbum(id: string) {
    const headers = this.getHeaders();
    this.albumUrl = 'https://api.spotify.com/v1/albums/' + id;
    return this.http.get(this.albumUrl, {headers});
  }
  // Get current track playing
  getCurrentPlaying(): Observable<any>{
    const headers = this.getHeaders();
    return this.http.get<any>('https://api.spotify.com/v1/me/player/currently-playing', {headers});
  }

  devices(): Observable<List<Device>> {
    const headers = this.getHeaders();
    return this.http.get<DevicesDto>('https://api.spotify.com/v1/me/player/devices', { headers }).pipe(map((devicesDto: DevicesDto) =>
      Devices.parseFromDto(devicesDto)
      ));
  }
}
