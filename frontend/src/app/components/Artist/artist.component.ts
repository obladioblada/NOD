import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';

import { ActivatedRoute } from '@angular/router';

import { Artist } from '../../models/Artist';
import { Album } from '../../models/Album';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  id: string;
  artist: Artist[];
  albums: Album[];
  constructor(private _spotifyService: SpotifyApiService,
              private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params
      .map(params => params.id)
      .subscribe((id) => {
        this._spotifyService.getAuth()
          .subscribe(res => {
            this._spotifyService.getArtist(id, res.access_token)
              .subscribe(artist => {
                this.artist = artist;
              });
            this._spotifyService.getAlbums(id, res.access_token)
              .subscribe(albums => {
                this.albums = albums.items;
              });
          });
      });
  }
}

