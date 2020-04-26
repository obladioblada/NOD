export class Device {
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