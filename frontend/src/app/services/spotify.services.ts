import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';


@Injectable()
export class SpotifyService {
  private searchUrl: string;
  private artistUrl: string;
  private albumsUrl: string;
  private albumUrl: string;
 // private clientId: string = environment.clientId;
 // private clientSecret: string = environment.clientSecret;
  private body: any;


  constructor(private http: HttpClient) { }



  // Get search results for a query
  searchMusic(query: string, type = 'artist', authToken: string) {
    //const headers = new HttpHeaders();
    //headers.set('Authorization', 'Bearer ' + authToken);

    const headers = {
      headers: {'Authorization': 'Bearer ' + authToken}
    }

    this.searchUrl = 'https://api.spotify.com/v1/search?q=' + query + '&offset=0&limit=20&type=' + type + '&market=US';
    console.log(this.searchUrl);
    console.log(headers);

    return this.http.get(this.searchUrl, headers );
  }

  // Get data about artist that has been chosen to view
  getArtist(id: string, authToken: string) {
    const headers= new HttpHeaders();
    headers.append('Authorization', 'Bearer ' + authToken);

    this.artistUrl = 'https://api.spotify.com/v1/artists/' + id;

    return this.http.get(this.artistUrl, { headers });
  }

  // Get the albums about the artist that has been chosen
  getAlbums(id: string, authToken: string) {
    const headers= new HttpHeaders();
    headers.append('Authorization', 'Bearer ' + authToken);

    this.albumsUrl = 'https://api.spotify.com/v1/artists/' + id + '/albums?market=US&album_type=single';

    return this.http.get(this.albumsUrl, { headers });
  }

  // Get Tracks in ablum selected
   getAlbum(id: string, authToken: string) {
    const headers= new HttpHeaders();
    headers.append('Authorization', 'Bearer ' + authToken);

    this.albumUrl = 'https://api.spotify.com/v1/albums/' + id;

    return this.http.get(this.albumUrl, { headers });
  }
}
