import {Component, Input} from '@angular/core';
import {AuthService} from 'src/auth/auth.service';
import {User} from '../models/User';


@Component({
  selector: 'nod-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  @Input()
  user: User;
  currentSong: string;

  constructor(private authService: AuthService) {
  }


  join(id: string) {
    this.authService.join(id).subscribe(val => console.log(val));
    // this.socketServices.join({sender: user._id});
  }

}
