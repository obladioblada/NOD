import { Component } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { Artist } from '../../models/Artist';
import {SearchType} from './model';
import { AuthService } from 'src/auth/auth.service';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'nod-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SpotifyApiService]
})
export class SearchComponent {
  searchStr: string;
  results: any[];
  formGroup: FormGroup;
  query: FormControl = new FormControl();
  type_$: BehaviorSubject<SearchType> = new BehaviorSubject(SearchType.artists);

  constructor(private spotifyService: SpotifyApiService, private authService: AuthService) {
    this.formGroup =  new FormGroup({
      query: this.query
    });
    combineLatest(
      this.formGroup.valueChanges,
      this.type_$.asObservable()
    )
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(val => val[0]),
      filter(val => val.query.length > 0)
    ).subscribe((queryForm: any) => {
      this.spotifyService.searchMusic(queryForm.query, this.type_$.getValue())
        .subscribe( (res) => {
          console.log(res[this.type_$.getValue() + 's'].items);
          this.results = res[this.type_$.getValue() + 's'].items;
        });
    });
  }

  setType(type: string) {
    this.type_$.next(SearchType[type]);
  }
  getType() {
    return this.results && this.type_$.getValue();
  }
}
