import { Device, DeviceDto } from './Device';
import { List } from 'immutable';

export interface DevicesDto {
  devices: DeviceDto[];
}

export class Devices {

  devices: Device[];

  constructor(devices: Device[]) {
    this.devices = devices;
  }

  static parseFromDto(devicesDto: DevicesDto): List<Device> {
    return List(devicesDto.devices.map((deviceDto: DeviceDto) => Device.parseFromDto(deviceDto)));
  }

  asArray(): Device[] {
    return this.devices;
  }

  getDevice(id: string) {
    return this.devices.filter(device => device.id === id);
  }
}
