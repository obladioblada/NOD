import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { List } from 'Immutable';

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
