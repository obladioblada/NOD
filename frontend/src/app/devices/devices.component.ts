import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Device } from '../models/Device';
import {Devices} from "../models/Devices";
import {Observable} from "rxjs";

@Component({
  selector: 'nod-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {

  @Input()
  devices: Devices;

  constructor() {
  }

  ngOnInit() {
  }


  trackById(index, device: Device) {
    return device.id;
  }
}
