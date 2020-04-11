import { Component, Input, HostBinding, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import { MainButtonService } from '../main-button/main-button.service';
import { ButtonState} from '../main-button/button';

@Component({
  selector: 'nod-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent {

  // tslint:disable-next-line: variable-name
  private _device: any;
  @Input()
  set device(device) {
    this._device = device;
    this.isActive = device.is_active; }
  get device() {return this._device; }

  @Output()
  onPlayPause: EventEmitter<boolean> = new EventEmitter<boolean>();

  isPlaying=false;

  @HostBinding('class.is-active') isActive: boolean;

  constructor(private authService: AuthService, private mainButtonService: MainButtonService) {  }

  play() {
    this.mainButtonService.setButtonState(ButtonState.LOADING);
    this.authService.player(this.device.id, !this.isPlaying).subscribe(val => {
      this.isPlaying = !this.isPlaying;
      this.onPlayPause.emit(this.isPlaying);
      this.mainButtonService.setButtonState(ButtonState.SUCCESS);
      console.log(val);
    });

  }

  setVolume(event) {
    this._device.volume_percent = event.target.value;
  }
}
