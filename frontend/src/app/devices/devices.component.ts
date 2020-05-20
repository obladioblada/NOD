import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { List } from 'immutable';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { SpotifyConnectorService } from '../services/spotify-connector.service';

@Component({
  selector: 'nod-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {

  @Input()
  devices: List<any>;

  @Input()
  isPlaying: boolean;


  constructor() {
  }

  ngOnInit() {
  }


  refresh() {

  }

  trackById(index, device) {
    return device.id;
  }
}
