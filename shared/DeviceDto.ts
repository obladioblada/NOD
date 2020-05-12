export class DeviceDto {
    id: string;
    isActive: boolean;
    name: string;
    type: string;
    volue: number;


    constructor(id: string, name: string, type: string) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}

export interface DeviceDto {
    id: string;
    isActive: boolean;
    name: string;
    type: string;
    volue: number;
}