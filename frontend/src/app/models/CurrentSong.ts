export class CurrentSong {
  id: string;
  name: string;
  imgUrl: string;
  artist: string;
  paused: boolean;

  constructor(id: string, name: string, imgUrl: string, artist: string, paused: boolean) {
    this.id = id;
    this.name = name;
    this.imgUrl = imgUrl;
    this.artist = artist;
    this.paused = paused;
  }
}
