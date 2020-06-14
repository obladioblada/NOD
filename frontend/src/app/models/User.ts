export class User {

  id: string;
  name: string;
  roomId: string;
  pictureUrl: string;
  connected: boolean;
  currentSong: any;

  constructor(id: string, name: string, pictureUrl: string, connected: boolean) {
    this.id = id;
    this.name = name;
    this.pictureUrl = pictureUrl;
    this.connected = connected;
  }

  setRoom(roomId: string) {
    this.roomId = roomId;
  }

  setCurrentSong(currentSong: any){
    this.currentSong = currentSong;
  }
}
