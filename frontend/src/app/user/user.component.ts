import { Component, Input} from '@angular/core';


@Component({
  selector: 'nod-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  @Input()
  user;

}
