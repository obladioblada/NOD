import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CurrentSong} from "../../models/CurrentSong";

@Component({
  selector: 'nod-current-song',
  templateUrl: './current-song.component.html',
  styleUrls: ['./current-song.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentSongComponent implements OnInit {

  _song: CurrentSong;

  @Input()
  set song(currentSong) {
    this._song = currentSong
  }

  get song() {
    return this._song
  }

  ngOnInit(): void {
  }

}
