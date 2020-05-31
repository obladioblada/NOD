import {
    Component,
    Input,
    HostBinding,
    EventEmitter,
    Output,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import {AuthService} from 'src/auth/auth.service';
import {MainButtonService} from '../main-button/main-button.service';
import {SocketService} from '../services/socket.service';
import {BackgroundService} from '../background/background.service';
import {SpotifyApiService} from '../services/spotify-api.service';
import {Device} from '../models/Device';
import {PlayerService} from "../services/player.service";

@Component({
    selector: 'nod-device',
    templateUrl: './device.component.html',
    styleUrls: ['./device.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceComponent {
    private _device: Device;
    @Input()
    set device(device) {
        this._device = device;
    }

    get device() {
        return this._device;
    }

    constructor(private authService: AuthService,
                private mainButtonService: MainButtonService,
                private backgroundService: BackgroundService,
                private spotifyService: SpotifyApiService,
                private socketServices: SocketService,
                private playerService: PlayerService,
                private cd: ChangeDetectorRef) {
    }

    setDevice() {
        this.playerService.setDevice(this.device.id).subscribe((data) => {
            this.device.isActive = true;
            this.playerService.onCurrentDeviceChanged.next(this.device.id);
            this.cd.detectChanges();
        });
    }

}
