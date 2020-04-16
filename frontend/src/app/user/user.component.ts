import { Component, Input} from '@angular/core';
import { AuthService } from 'src/auth/auth.service';


@Component({
  selector: 'nod-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {


  constructor(private authService: AuthService) {
  }
  @Input()
  user;


  join(user: {_id: string}) {

    this.authService.join(user._id).subscribe(val => console.log(val));
  }

}
