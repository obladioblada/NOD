export interface DeviceDto {
  id: string;
  is_active: boolean;
  name: string;
  volume_percent: number
  type: string,
}

export class Device {
  constructor(
    readonly id: string, readonly isActive: boolean, readonly name: string, readonly volumePercent: number, readonly type: string) {  }

  static parseFromDto(deviceDto: DeviceDto): Device {
    return new Device(deviceDto.id, deviceDto.is_active, deviceDto.name, deviceDto.volume_percent, deviceDto.type);
  }
}
