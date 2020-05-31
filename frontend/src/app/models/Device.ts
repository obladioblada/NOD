export interface DeviceDto {
  id: string;
  is_active: boolean;
  name: string;
  volume_percent: number
  type: string,
}

export class Device {

  id: string;
  isActive: boolean;
  name: string;
  volumePercent: number;
  type: string;


  constructor(id: string, is_active: boolean, name: string, volume_percent: number, type: string) {
    this.id = id;
    this.isActive = is_active;
    this.name = name;
    this.volumePercent = volume_percent;
    this.type = type;
  }

  static parseFromDto(deviceDto: DeviceDto): Device {
    return new Device(deviceDto.id, deviceDto.is_active, deviceDto.name, deviceDto.volume_percent, deviceDto.type)
  }
}
