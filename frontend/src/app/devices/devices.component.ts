import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'nod-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {

  @Input()
  devices: [];

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
