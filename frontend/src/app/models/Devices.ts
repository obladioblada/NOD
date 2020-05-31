import { Device, DeviceDto } from './Device';

export interface DevicesDto {
  devices: DeviceDto[];
}

export class Devices {

  devices: Device[];

  constructor(devices: Device[]) {
    this.devices = devices;
  }

  static parseFromDto(devicesDto: DevicesDto): Devices {
    return new Devices(devicesDto.devices.map(devicesDto => Device.parseFromDto(devicesDto)));
  }

  asArray(): Device[] {
    return this.devices;
  }

  getDevice(id: string) {
    return this.devices.filter(device => device.id === id);
  }
}
