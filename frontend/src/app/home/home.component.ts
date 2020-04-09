import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  stuff;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.me().subscribe(data => this.stuff = data)
  }

}
