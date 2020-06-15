import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AuthService} from 'src/auth/auth.service';
import {User} from '../models/User';


@Component({
  selector: 'nod-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {

  _user: User;

  @Input()
  set user(user) {
    this._user = user;
  }

  get user(){
    return this._user;
  }

  constructor(private authService: AuthService) {

  }


  join(id: string) {
    this.authService.join(id).subscribe(val => console.log(val));
  }

  ngOnInit(): void {

  }

}
