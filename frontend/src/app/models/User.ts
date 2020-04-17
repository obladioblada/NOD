export class User {

  id: string;
  name: string;
  roomId: string;
  pictureUrl: string;

  constructor(id: string, name: string, pictureUrl: string) {
    this.id = id;
    this.name = name;
    this.pictureUrl = pictureUrl;
  }

  setRoom(roomId: string) {
    this.roomId = roomId;
  }
}
