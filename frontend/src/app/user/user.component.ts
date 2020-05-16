import { Component, Input} from '@angular/core';
import { AuthService } from 'src/auth/auth.service';
import {SocketService} from '../services/socket.service';
import { User } from '../models/User';


@Component({
  selector: 'nod-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {


  constructor(private authService: AuthService, private socketServices: SocketService) {
  }
  @Input()
  user: User;


  join(id: string) {
    this.authService.join(id).subscribe(val => console.log(val));
    // this.socketServices.join({sender: user._id});
  }

}
