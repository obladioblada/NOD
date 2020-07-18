import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {SpotifyApiService} from '../../services/spotify-api.service';
import {FormControl, FormGroup} from '@angular/forms';
import {filter, map, switchMap} from 'rxjs/operators';
import {SearchType} from './model';
import {BehaviorSubject, combineLatest} from 'rxjs';

@Component({
  selector: 'nod-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SpotifyApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  results: any[];
  formGroup: FormGroup;
  query: FormControl = new FormControl();
  type_$: BehaviorSubject<SearchType> = new BehaviorSubject(SearchType.artists);

  constructor(private spotifyApiService: SpotifyApiService, private cdr: ChangeDetectorRef) {
    this.formGroup = new FormGroup({
      query: this.query
    });
    combineLatest([
      this.formGroup.valueChanges,
      this.type_$.asObservable()]
    )
      .pipe(
        map(val => val[0]),
        filter(val => val.query.length > 1),
        switchMap(queryForm => this.spotifyApiService.searchMusic(queryForm.query, this.type_$.getValue()))
      ).subscribe((res: any) => {
      console.log(res[this.type_$.getValue() + 's'].items);
      this.results = res[this.type_$.getValue() + 's'].items;
      this.cdr.detectChanges();
    });
  }


  playSong(id) {
    console.log(id);
  }

  setOnFocus(value: boolean) {
    console.log(value);
    if (!value) {
      this.results.length = 0;
    }
    this.spotifyApiService.toggleSearchInProgress(value);
  }


  setType(type: string) {
    this.type_$.next(SearchType[type]);
  }

  getType() {
    return this.results && this.type_$.getValue();
  }
}
