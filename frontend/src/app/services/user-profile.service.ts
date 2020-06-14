import {Injectable} from "@angular/core";
import {AuthService} from "../../auth/auth.service";
import {SpotifyApiService} from './spotify-api.service';
import {take} from 'rxjs/operators';

@Injectable()
export class UserProfileService {

  userProfile: any;

  constructor(private spotifyApiService: SpotifyApiService, private authService: AuthService) {
  }

  loadUserProfile() {
    this.spotifyApiService.me().pipe(take(1)).subscribe(userProfile => {
      console.log(userProfile);
      this.userProfile = userProfile;
    })
  }
}
