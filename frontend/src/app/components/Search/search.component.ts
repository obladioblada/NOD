import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.services';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Artist } from '../../models/Artist';
import { AuthService } from 'src/auth/auth.service';

@Component({
  selector: 'nod-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SpotifyService]
})
export class SearchComponent {
  searchStr: string;
  results: Artist[];
  formGroup: FormGroup;
  query: FormControl = new FormControl();

  constructor(private spotifyService: SpotifyService, private authService: AuthService) {
    this.formGroup =  new FormGroup({
      query: this.query
    });
    this.formGroup.valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((queryForm: any) =>{
      this.spotifyService.searchMusic(queryForm.query, 'artist', this.authService.getAccessToken())
        .subscribe( (res: { artists: { items: Artist[]; }; }) => {
          console.log(res.artists.items)
          this.results = res.artists.items
        })
    });
  }
}
