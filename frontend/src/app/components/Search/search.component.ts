import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {SpotifyApiService} from '../../services/spotify-api.service';
import {FormControl, FormGroup} from '@angular/forms';
import {filter, map, switchMap, take} from 'rxjs/operators';
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
  collapse: boolean;

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
        filter(val => val.query && val.query.length > 1),
        switchMap(queryForm => this.spotifyApiService.searchMusic(queryForm.query, this.type_$.getValue()))
      ).subscribe((res: any) => {
      this.results = res[this.type_$.getValue() + 's'].items;
      this.cdr.detectChanges();
    });
    this.collapse = false;
  }


  playSong(id) {
    console.log(id);
    const body = {
      uris: [id]
    };
    this.spotifyApiService.play(body).subscribe(() => console.log("song changed"));
  }

  close() {
    if (this.results) {
      this.results.length = 0;
    }
    this.query.reset();
    this.collapse = false;
  }

  setOnFocus() {
    this.collapse = !this.collapse;
    this.spotifyApiService.toggleSearchInProgress(this.collapse);
  }


  setType(type: string) {
    this.type_$.next(SearchType[type]);
  }

  getType() {
    return this.results && this.type_$.getValue();
  }
}
