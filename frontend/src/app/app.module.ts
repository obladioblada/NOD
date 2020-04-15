import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MainButtonComponent } from './main-button/main-button.component';
import { AuthGuardService } from 'src/auth/auth-guard.service';
import { AuthService } from 'src/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MainButtonService } from './main-button/main-button.service';
import { DeviceComponent } from './device/device.component';
import { SpotifyService } from './services/spotify.services';
import { SearchComponent } from './components/Search/search.component';
import { TileComponent } from './components/tile/tile.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MainButtonComponent,
    DeviceComponent,
    SearchComponent,
    TileComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthGuardService, AuthService, SpotifyService, MainButtonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
