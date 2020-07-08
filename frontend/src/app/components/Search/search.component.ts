import {Component} from '@angular/core';
import {SpotifyApiService} from '../../services/spotify-api.service';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {SearchType} from './model';
import {BehaviorSubject, combineLatest} from 'rxjs';

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

  constructor(private spotifyApiService: SpotifyApiService) {
    this.formGroup =  new FormGroup({
      query: this.query
    });
    combineLatest([
      this.formGroup.valueChanges,
      this.type_$.asObservable()]
    )
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(val => val[0]),
      filter(val => val.query.length > 1),
      tap(() => this.spotifyApiService.searchInProgress$.next(!this.spotifyApiService.searchInProgress$.getValue()))
    ).subscribe((queryForm: any) => {

      this.spotifyApiService.searchMusic(queryForm.query, this.type_$.getValue())
        .subscribe( (res) => {
          console.log(res[this.type_$.getValue() + 's'].items);
          this.results = res[this.type_$.getValue() + 's'].items;
        });
    });
  }

  setOnFocus(value: boolean) {
    console.log(value);
    this.spotifyApiService.searchInProgress$.next(value);
  }


  setType(type: string) {
    this.type_$.next(SearchType[type]);
  }
  getType() {
    return this.results && this.type_$.getValue();
  }
}
